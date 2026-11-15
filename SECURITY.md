# Security Policy

## Supported versions

Only the latest commit on `main` receives fixes.

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Use GitHub's private reporting instead: **Security → Report a vulnerability** on this repository. Include what you found, how to reproduce it and the impact you expect. We aim to reply within 7 days.

## What we already protect

| Area | Measure |
|:--|:--|
| API keys | The LLM key lives only in the server's `.env` and is never sent to the browser |
| SSRF | `/api/sensor-set-ip` accepts private LAN IPv4 addresses only; loopback, link-local, multicast and public addresses are rejected |
| SQL | All queries are parameterised; the web app only reads the database and never writes to it |
| AI output | Answers are citation-locked to retrieved rows, and illustrative data is labelled |
| Hardware | Wi-Fi credentials go in a git-ignored `secrets.h` |

## Scope notes

The ESP32 node is meant for a trusted local network. Its HTTP interface has no authentication, so do not expose it to the internet.
