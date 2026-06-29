# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

CLI tool that simulates a Customer Success Engineer triaging a support ticket queue: read a CSV of tickets, call a local mock API for service status, classify each ticket P1–P4, optionally enrich P1/P2 with an AI summary, and write a `report.md` sorted by severity.

## Commands

Once implemented, the standard commands are:

```powershell
# Start the mock status API (must be running before the CLI)
node mock-api/server.js

# Run the full triage pipeline → produces report.md
node src/index.js

# Run tests (step 7)
npm test
```

Environment variable required for the AI step:
```
ANTHROPIC_API_KEY=<your key>   # loaded via dotenv from .env
```

## Architecture

```
support-triage-cli/
├── data/tickets_sample.csv     # input — 10 tickets, CSV
├── docs/mock-api-spec.md       # API contract for the mock server
├── mock-api/server.js          # local HTTP server (Node native or Express)
├── src/
│   ├── index.js                # entry point — orchestrates the pipeline
│   ├── classifier.js           # P1–P4 rules (pure function, no I/O)
│   ├── statusClient.js         # GET /status/:service calls
│   ├── aiSummary.js            # Anthropic SDK calls for P1/P2
│   └── reportWriter.js         # builds and writes report.md
├── report.md                   # generated output
├── .env                        # ANTHROPIC_API_KEY (gitignored)
└── package.json
```

## Classification rules (P1–P4)

| Priority | Condition |
|----------|-----------|
| **P1** | Service status is `down`, OR HTTP 5xx with direct client impact |
| **P2** | Service status is `degraded`, OR HTTP 429 (rate limit) |
| **P3** | HTTP 401 or 403 (client-side misconfiguration) |
| **P4** | Everything else (200 with complaint, latency, etc.) |

Service status (from the mock API) takes precedence — a ticket on a `down` service is always P1 regardless of HTTP code.

## Mock API contract

The local server implements `GET /status/:service` and responds with `{ service, status, lastIncident }`. Known services and their fixed statuses:

| service | status |
|---|---|
| billing-api | degraded |
| auth-service | down |
| search-api | healthy |
| notifications-api | healthy |

Unknown services → HTTP 404 `{ "error": "unknown service" }`.

## AI enrichment

For P1 and P2 tickets only, call Claude via `@anthropic-ai/sdk`. Each call should produce:
- A one-sentence client-facing summary
- A recommended action

The AI output is supplementary — classification is always determined by the rule-based classifier first. Always cross-check AI severity judgement against the coded rules.

## Key constraints

- Node.js only — no external framework required (native `http` module is fine for the mock server).
- Read `ANTHROPIC_API_KEY` from `.env` via `dotenv`; never hardcode it.
- `report.md` groups tickets by severity (P1 first), includes id, customer, service, severity, and AI summary where applicable.
