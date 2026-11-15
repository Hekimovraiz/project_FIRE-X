# Changelog

All notable changes to FIRE-X. Dates are in 2026.

## [2.2.0] — November 15 (NASA Space Apps Challenge)

### Added
- Data provenance labels (`psi_verified` / `illustrative`) across the API, Explorer, CSV export and AI assistant.
- `GET /api/experiments/export.csv` and a `provenance` filter on `/api/experiments`.
- ESP32 firmware with auto-baseline gas detection, 60 s warm-up, alarm latch (5 s siren, 15 s repeat) and a "beep-beep" siren.
- `/api/sensor-buzzer-test`, Buzzer Test button and a site-wide visual hazard banner.
- Automatic discovery of the board on hotspot subnets.
- Judging presentation (`presentation/FIRE-X_Teqdimat.pdf`).
- Project docs (architecture, hardware, API, data provenance, challenge alignment), CI with API smoke tests, community files and a citation file.

### Fixed
- The ESP32 froze when several pages polled it at once; a single backend poller now talks to the board.
- Passive buzzer stayed silent with `digitalWrite`; it now uses `tone()`.
- Sensor pins moved to ADC1 so analogue readings work with Wi-Fi.
- Sound on/off commands are resent if the board was offline.
- Azerbaijani translations completed on all pages.
- The database integrity check is now read-only and no longer deletes records.

## [2.1.0] — November 14

### Added
- Multi-page platform: Mission Control, Analytics Hub, Data Explorer, Mission Simulator, AI Research Assistant, Hardware and About.
- Canonical 28-column dataset and SQLite database.
- SQL-RAG AI assistant with citation lock.
- Three.js 3D/4D scenes and the 3D-printed enclosure viewer.
