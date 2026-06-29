# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

CLI tool that simulates a Customer Success Engineer triaging a support ticket queue: read a CSV of tickets, call a local mock API for service status, classify each ticket P1–P4, optionally enrich P1/P2 with an AI summary, and write a `report.md` sorted by severity.

## Commands

`node` is not in the Windows PATH — use the full path on this machine:

```powershell
# Start the mock status API (required before running the CLI)
& "C:\Program Files\nodejs\node.exe" mock-api/server.js

# Run the full triage pipeline (with AI enrichment) → produces report.md
& "C:\Program Files\nodejs\node.exe" src/index.js

# Run in watch mode — re-triages every 30s, AI enrichment disabled
& "C:\Program Files\nodejs\node.exe" src/index.js --watch
& "C:\Program Files\nodejs\node.exe" src/index.js --watch 10   # custom interval in seconds

# Run all tests
& "C:\Program Files\nodejs\node.exe" --test src/classifier.test.js
```

Environment variable required for AI enrichment:
```
ANTHROPIC_API_KEY=<your key>   # loaded via dotenv from .env (gitignored)
```
If the key is absent, enrichment is silently skipped (one warning logged, pipeline continues).

## Architecture

```
support-triage-cli/
├── data/tickets_sample.csv       # input — 10 tickets, CSV
├── docs/mock-api-spec.md         # API contract for the mock server
├── mock-api/server.js            # local HTTP server (Node native, port 3000)
├── src/
│   ├── index.js                  # orchestrator — arg parsing, pipeline, watch loop
│   ├── classifier.js             # P1–P4 rules (pure function, no I/O)
│   ├── classifier.test.js        # node --test unit tests for all classification rules
│   ├── statusClient.js           # GET /status/:service with in-memory cache
│   ├── aiSummary.js              # Anthropic SDK calls for P1/P2 enrichment
│   └── reportWriter.js           # builds and writes report.md
├── postman/collections/          # exportable Postman collection with automated tests
├── report.md                     # generated output (committed as sample)
└── .env                          # ANTHROPIC_API_KEY (gitignored)
```

## Classification rules (P1–P4)

Service status from the mock API takes precedence over the ticket's HTTP code.

| Priority | Condition |
|----------|-----------|
| **P1** | Service status is `down`, OR HTTP 5xx |
| **P2** | Service status is `degraded`, OR HTTP 429 |
| **P3** | HTTP 401 or 403 |
| **P4** | Everything else |

Unknown services (mock API 404) resolve to `{ status: 'unknown' }` and fall through to HTTP-code rules.

## Key behaviors

**statusClient** — 5 s timeout per request; on timeout, network error, or invalid JSON, resolves to `{ status: 'unknown' }` instead of rejecting (pipeline never crashes on a missing mock API). Results are cached in a `Map` for the process lifetime — each service is fetched once per run.

**aiSummary** — enriches P1/P2 tickets with `aiSummary` (one client-facing sentence) and `aiAction` (recommended action). On any error (auth, network, malformed JSON from Claude), returns the ticket unchanged. Handles markdown-wrapped JSON in the model response via `extractJson()`. Disabled automatically in `--watch` mode.

**watch mode** — `setInterval`-based loop; AI enrichment is always off to avoid per-cycle API costs. Each cycle prints a timestamped separator and overwrites `report.md`.

## Mock API contract

`GET /status/:service` → `{ service, status, lastIncident }` (200) or `{ error: "unknown service" }` (404).

| service | status |
|---|---|
| billing-api | degraded |
| auth-service | down |
| search-api | healthy |
| notifications-api | healthy |
