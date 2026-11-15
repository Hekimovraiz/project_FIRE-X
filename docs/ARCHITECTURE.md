# FIRE-X Architecture

FIRE-X has four layers: **NASA data → SQLite → FastAPI → web UI**, plus an **ESP32 edge node** that feeds live readings into the same backend. Every layer runs on a laptop with no cloud services required. The only optional external call is the LLM used by the AI assistant.

```mermaid
flowchart TB
    subgraph Sources["1 · Sources"]
        A1["Nasa_data/*.csv<br/>PSI-69 FLEX · PSI-25 BASS-II · PSI-98 SAFFIRE-I"]
        A2["Team-compiled CSVs<br/>from NASA publications"]
    end
    subgraph Pipeline["2 · Pipeline"]
        B1["scripts/pipeline.py"]
        B2["data/processed/canonical_experiments.csv<br/>569 rows × 28 columns"]
        B3[("fire_safety.db<br/>table canonical_experiments")]
    end
    subgraph Backend["3 · FastAPI (backend/)"]
        C1["main.py<br/>routes · static pages · sensor bridge"]
        C2["data_service.py<br/>queries · stats · FHI · rankings · provenance"]
        C3["ai_service.py + citation_rag_engine.py<br/>SQL-RAG · citation lock"]
        C4["nasa_combustion_engine.py<br/>d²-law · extinction · flame spread"]
    end
    subgraph Frontend["4 · Web UI (frontend/)"]
        D1["index · analytics · explorer · simulator · ai · hardware · about"]
        D2["js/nav.js<br/>EN/AZ engine · site-wide hazard banner"]
    end
    E1["ESP32 node<br/>hardware/firex_esp32_hotspot"]

    A1 --> B1
    A2 --> B1
    B1 --> B2 --> B3
    B3 --> C2
    B3 --> C3
    C2 --> C1
    C3 --> C1
    C4 --> C1
    C1 --> D1
    D2 --- D1
    E1 <--> C1
```

## Backend modules

| File | Responsibility |
|:--|:--|
| `backend/main.py` | FastAPI app (`v2.2.0`), all REST routes, HTML page routes, background ESP32 bridge thread, serial-line parser, input validation (for example, only private LAN IPs are accepted for the board address to prevent SSRF) |
| `backend/data_service.py` | Read-only access to SQLite: filtered queries, aggregates for charts, Fire Hazard Index, investigation relevance rankings, `provenance_of()` labelling |
| `backend/ai_service.py` | Builds the SQL-RAG context, calls the LLM when a key is configured, otherwise writes a deterministic answer from the same rows |
| `backend/citation_rag_engine.py` | Forces answers to cite experiment IDs and replaces ungrounded claims with a safe fallback |
| `backend/nasa_combustion_engine.py` | Physics helpers: droplet burning (d²-law), extinction diameter, low-flow solid flame spread |

## Request flow: AI assistant

```mermaid
sequenceDiagram
    participant U as Browser (/ai)
    participant API as FastAPI /api/chat-assistant
    participant RAG as SQL-RAG retriever
    participant DB as SQLite
    participant LLM as LLM (optional)

    U->>API: messages[], language (en/az)
    API->>RAG: latest question
    RAG->>DB: parameterised SELECT (fuel, O₂, family …)
    DB-->>RAG: matching rows + data_provenance
    alt OPENAI_API_KEY set
        RAG->>LLM: system prompt + rows + provenance rule
        LLM-->>API: draft answer
    else no key
        RAG-->>API: deterministic answer from rows
    end
    API->>API: citation lock (IDs must exist in rows)
    API-->>U: answer with ✓PSI / ⚠ illustrative tags
```

Design choices:

- **SQL, not vectors.** The data are numeric tables, so exact SQL filters beat embedding similarity and every number in an answer can be traced to a row.
- **Provenance in the prompt.** Rows carry `data_provenance`, and the system prompt forbids presenting illustrative rows as NASA measurements.
- **Key stays on the server.** The browser never sees the API key.

## Request flow: hardware node

```mermaid
sequenceDiagram
    participant ESP as ESP32 (/data)
    participant BR as Background bridge thread
    participant ST as LATEST_SENSOR_STATE
    participant UI as Any open page

    loop about once per second
        BR->>ESP: GET /data (2 s timeout, one at a time)
        ESP-->>BR: {mq2, mq4, flame, danger, buzzer, …}
        BR->>ST: update readings, hazard level, history
    end
    loop every 20 s while offline
        BR->>BR: scan hotspot subnets for /data
    end
    loop every ~2 s
        UI->>ST: GET /api/sensor-live
        ST-->>UI: state (no extra board traffic)
    end
    UI->>BR: POST /api/sensor-sound or /api/sensor-buzzer-test
    BR->>ESP: GET /sound/on · /sound/off · /buzzer/test
```

Why it is built this way:

- **One poller only.** The ESP32 web server handles one connection at a time. Earlier versions let every browser tab poll the board directly, which froze it. Now a single backend thread talks to the board behind a lock, and pages read a cached state.
- **The board decides.** The firmware computes its own `danger` flag from a self-calibrated baseline. The backend uses that flag when present and falls back to fixed thresholds (`MQ2_DANGER_THRESHOLD`, `MQ4_DANGER_THRESHOLD`) for older firmware.
- **Commands are retried.** If a sound on/off command cannot reach the board, it is kept as `pending_sound_command` and resent on the next successful poll.
- **Stale data is cleared.** If no packet arrives for 10 s, the state drops back to `SEARCHING` and readings reset to zero, so the UI never shows old numbers as live.

## Frontend

- Plain HTML, CSS and JavaScript (no build step), served by FastAPI.
- `css/ds.css` holds the design tokens; `js/nav.js` holds the navigation, the EN/AZ dictionaries (with a `MutationObserver` that translates dynamic content) and the site-wide visual hazard banner.
- Three.js renders the 3D scenes; Chart.js renders the 2D charts.

## Deployment

| Target | Config | Notes |
|:--|:--|:--|
| Render | `render.yaml` | Python web service, `uvicorn backend.main:app` |
| Vercel | `vercel.json` + root `main.py` | Serverless entry point that imports the backend app |
| Local / Cloudflare Tunnel | none | `uvicorn` on port 8000, then `cloudflared tunnel --url http://127.0.0.1:8000` |

The hardware node needs the backend on the **same local network** as the board (for example, a Windows Mobile Hotspot). A cloud deployment shows the dashboard but cannot reach a board on a private network.
