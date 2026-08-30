# Architecture

Adaptive Training is local-first. The initial dependency direction is:

UI → Local SQLite persistence → Health/recovery ingestion → Pure training domain → Deterministic recommendation engine → Optional AI explanation/coaching.

## Boundaries

### UI
React Native / Expo screens render prescriptions, logging, readiness check-ins, history, and rationale. UI code must not own progression policy.

### Persistence
SQLite/Drizzle stores training logs, prescriptions, readiness, recovery snapshots, external sessions, and recommendation provenance. Migrations are additive.

### Health ingestion
HealthKit is the first ingestion boundary. Garmin data can initially arrive through Garmin Connect → Apple Health. Direct Garmin APIs/FIT import are later phases.

### Pure domain
`frontend/src/domain/adaptive/` contains platform-independent TypeScript types and validators. It must run under Node tests without React Native or iOS APIs.

### Deterministic recommendation engine
Later PRs will derive prescriptions from completed work, RIR/RPE, readiness, recovery, and external training. Recommendation decisions must emit stable rationale codes and versioned provenance.

### Optional AI layer
AI may summarize trends, explain recommendations, or help redesign programs. It is not the source of truth for progression decisions and should receive minimal structured summaries rather than raw health databases when possible.
