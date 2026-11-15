# FIRE-X REST API

Base URL when running locally: `http://localhost:8000`. FastAPI also serves interactive documentation at **`/docs`** (Swagger UI) and **`/redoc`**, generated from the code, so those pages are always current.

All JSON responses use the shape `{"success": true, "data": ...}` unless noted.

## Health and statistics

### `GET /api/health`

```json
{
  "status": "healthy",
  "service": "FIRE-X Space Science API",
  "version": "2.2.0",
  "canonical_records": 569,
  "psi_verified_records": 407
}
```

### `GET /api/stats`

Aggregates for the charts: totals, per-family counts, outcome distribution, O₂ and airflow averages, scatter data, and `psi_verified_experiments` / `illustrative_experiments`.

## Experiments

### `GET /api/experiments`

| Query parameter | Type | Example |
|:--|:--|:--|
| `family` | string | `FLEX`, `BASS-II`, `SAFFIRE-I` |
| `fuel` | string | `Methanol` |
| `outcome` | string | `Extinction` |
| `min_o2`, `max_o2` | number | `21`, `40` |
| `provenance` | `psi_verified` \| `illustrative` | `psi_verified` |
| `page`, `limit` | integer | `1`, `50` |

```bash
curl "http://localhost:8000/api/experiments?family=FLEX&min_o2=30&limit=3"
```

Each record has the 28 canonical columns (see [`data_dictionary.md`](data_dictionary.md)) plus `data_provenance` and `provenance_source`.

### `GET /api/experiments/export.csv`

Same filters as above; returns a CSV download with the provenance column.

### `GET /api/experiments/{experiment_id}`

One record, for example `/api/experiments/FLEX-001`.

### `POST /api/compare`

```json
{ "experiment_ids": ["FLEX-001", "BASS-B1"] }
```

Between 1 and 4 IDs. Returns the records side by side.

## Mission analysis

### `GET /api/mission-scenario/{scenario_id}`

`scenario_id`: `iss`, `spacecraft`, `lunar_habitat`, `mars_habitat`, `rover`, `eva_suit`, `lunar_hypoxic` or `custom`.

Optional query parameters for any scenario: `custom_o2` (%), `custom_pressure` (kPa), `custom_gravity` (g), `material_factor`.

Returns the Fire Hazard Index (1–10), the risk level, partial-gravity bounds and ranked NASA investigations.

```bash
curl "http://localhost:8000/api/mission-scenario/custom?custom_o2=30&custom_pressure=70&custom_gravity=0.16"
```

### `GET /api/investigation-rankings` · `GET /api/investigation-rankings/{environment_id}`

Relevance ranking of the NASA investigations for a target environment (default `lunar_habitat`).

## Combustion engine

| Endpoint | Body (defaults) |
|:--|:--|
| `GET /api/combustion/summary` | none |
| `POST /api/combustion/predict-droplet-extinction` | `{"fuel": "n-Heptane Droplet", "d0_mm": 2.5, "oxygen_pct": 21, "pressure_kpa": 101.3, "co2_pct": 0, "he_pct": 0}` |
| `POST /api/combustion/predict-solid-flame-spread` | `{"material": "PMMA (Cast Acrylic)", "flow_velocity_cms": 8, "oxygen_pct": 21, "pressure_kpa": 101.3}` |
| `POST /api/combustion/telemetry-node-bridge` | `{"gas_ppm": 45, "smoke_density_pct": 2.5, "raw_adc": 180, "nominal_o2_pct": 21, "nominal_pressure_kpa": 101.3, "target_material": "PMMA (Cast Acrylic)"}` |

## AI assistant

### `POST /api/chat-assistant`

```json
{
  "messages": [{ "role": "user", "content": "Which fuels extinguish at the smallest droplet diameter?" }],
  "language": "en",
  "page_context": null
}
```

### `POST /api/ask-ai`

```json
{ "prompt": "Rank the investigations for a pressurized rover", "language": "az" }
```

Both retrieve matching rows with SQL, answer with citations, and tag every cited row as verified or illustrative. Without `OPENAI_API_KEY` the answer is built deterministically from the same rows.

## Hardware bridge

| Method | Endpoint | Purpose |
|:--|:--|:--|
| `GET` | `/api/sensor-live` | Cached latest reading, hazard level, FHI and history (no traffic to the board) |
| `POST` | `/api/sensor-set-ip?ip=192.168.137.125` | Point the bridge at a board. Only private LAN IPv4 addresses are accepted. |
| `POST` | `/api/sensor-scan` | Scan the local subnets for a board |
| `POST` | `/api/sensor-sound?enabled=true` | Unmute or mute the siren (resent automatically if the board is offline) |
| `POST` | `/api/sensor-buzzer-test` | Play the siren for a few seconds |
| `POST` | `/api/sensor-data` | Push a reading from the board or another client (JSON body) |
| `POST` | `/api/sensor-serial-line?line=...` | Push one Serial Monitor line (used by the WebSerial USB mode) |
| `POST` | `/api/sensor-simulate` | Demo mode for presentations without a board |

## Pages

`/`, `/analytics`, `/explorer`, `/simulator`, `/ai`, `/hardware`, `/about`, `/hardware/3d-viewer`.
