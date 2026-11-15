# Contributing to FIRE-X

Thanks for helping make spacecraft fire safety more open. Contributions of every size are welcome: a typo fix, a new translation, a data correction or a new feature.

## Getting set up

```bash
git clone https://github.com/Hekimovraiz/project_FIRE-X.git
cd project_FIRE-X
python -m venv .venv
.venv\Scripts\activate            # Windows  (macOS/Linux: source .venv/bin/activate)
pip install -r requirements-dev.txt
uvicorn backend.main:app --reload --port 8000
pytest -q
```

## Workflow

1. Open an issue first for anything bigger than a small fix, so we can agree on the approach.
2. Create a branch from `main`: `feat/…`, `fix/…`, `docs/…` or `data/…`.
3. Keep commits focused and write messages in the form `type(area): summary`, for example `fix(explorer): keep O₂ filter after page change`.
4. Run `pytest -q` before you push. CI runs the same tests on every pull request.
5. Open a pull request and fill in the template.

## Ground rules by area

**Data.** Never present illustrative values as NASA measurements. New rows from an official PSI table may be labelled `psi_verified` only when the source file is added to `Nasa_data/` and registered in `PSI_VERIFIED_SOURCES` in `backend/data_service.py`. Everything else stays `illustrative`. Cite the source URL in `source_url`.

**AI assistant.** Answers must stay grounded in retrieved rows. Changes to prompts in `backend/ai_service.py` must keep the citation lock and the provenance rule.

**Frontend.** Every user-visible string needs an English and an Azerbaijani version (`frontend/js/nav.js`, `frontend/locales/`). Bump the `?v=` cache version on `nav.js` when you change it.

**Hardware.** Keep Wi-Fi credentials in `secrets.h` (git-ignored); never commit them. Use ADC1 pins (GPIO 32–39) for analogue sensors, because ADC2 is unavailable while Wi-Fi is on. If you change the JSON fields served at `/data`, update the parser in `backend/main.py` and `docs/HARDWARE.md` together.

**Security.** Do not commit `.env`, API keys or passwords. See [SECURITY.md](SECURITY.md).

## Code style

- Python: PEP 8, type hints on public functions, no new heavy dependencies without discussion.
- JavaScript: plain ES2020, no build step.
- Docs: short sentences, tables for reference material, Mermaid for diagrams.

By contributing you agree that your work is released under the [MIT License](LICENSE) and that you follow our [Code of Conduct](CODE_OF_CONDUCT.md).
