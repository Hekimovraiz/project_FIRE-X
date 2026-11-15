# Challenge Alignment: *Flame in Freefall*

This page maps the NASA Space Apps Challenge 2026 brief to what FIRE-X actually delivers, with a pointer to where each piece lives in the repository.

## Objectives

| The challenge asks teams to… | FIRE-X | Where |
|:--|:--|:--|
| Use NASA's microgravity combustion data from PSI | 407 PSI-table rows (FLEX PSI-69, BASS-II PSI-25, SAFFIRE-I PSI-98) form the verified core | `Nasa_data/`, `docs/DATA_PROVENANCE.md` |
| Cover the named investigations | All 18 sub-suites: FLEX, FLEX-2, BASS-I/II, SAFFIRE-I/II/III, ACME (BRE, CFI, CFI-G, CLD, E-FIELD), SPICE, SLICE, SAME, SAME-R, DAFT | `/explorer` |
| Apply AI to produce insights | SQL-RAG assistant grounded in the database, with citation lock and a provenance rule | `backend/ai_service.py`, `/ai` |
| Make the data explorable | Filterable explorer, comparison dock, CSV export, 2D charts and 3D/4D scenes | `/explorer`, `/analytics` |
| Support spacecraft and habitat design | Mission simulator with Fire Hazard Index for ISS, Orion, lunar base, Mars base, rover, EVA suit and custom atmospheres | `/simulator`, `backend/data_service.py` |
| Bound partial-gravity behaviour (no LUCI/FM2 data yet) | 0 g ↔ 1 g bounding for 0.16 g and 0.38 g | `/simulator` |
| Address prevention, detection and suppression | 3-tier equipment advisory, plus a working detection node | `/about`, `/hardware` |
| Show benefits for Earth | Spin-offs for homes, vehicles and industry, demonstrated by the ESP32 gas and flame detector | `/about`, `docs/HARDWARE.md` |

## Key insights the platform surfaces

1. **Oxygen controls extinction size.** In FLEX, droplets keep burning to smaller diameters as O₂ rises, so oxygen-enriched cabins (rovers, suits) need more margin.
2. **There is a flammability corridor in airflow.** In BASS-II, very low flow starves the flame and high flow blows it off; the most dangerous band is the gentle ventilation typical of a cabin.
3. **Cool flames are a detection gap.** FLEX observed low-temperature flames that ordinary heat detectors can miss, which argues for gas and smoke sensing (as in the hardware node).
4. **Partial gravity is a design risk, not a solved problem.** Until LUCI and FM2 report, lunar and Martian estimates must be treated as bounded ranges.

## Honesty and safety

- Verified and illustrative records are labelled everywhere (`data_provenance`).
- The AI assistant may only cite experiment IDs present in its retrieved rows.
- FIRE-X is decision support and education, not a certified safety system.
- Rocket propellant combustion is explicitly out of scope.

## Built during the hackathon

| Area | Work |
|:--|:--|
| Data | Canonical 28-column schema, pipeline, provenance labelling, CSV export |
| Backend | FastAPI API, Fire Hazard Index, investigation rankings, combustion engine, SQL-RAG with citation lock |
| Frontend | 7 bilingual pages, Three.js scenes, explorer and simulator |
| Hardware | ESP32 node with auto-baseline detection, siren, single-poller bridge, 3D-printed enclosure |
