# Privacy model

Adaptive Training is local-first by default.

- Training data should remain on-device unless the user explicitly exports or syncs it.
- Do not commit credentials, `.env` files, OAuth tokens, HealthKit exports, Garmin exports, or workout databases.
- Use OS authorization and OAuth where external services are integrated.
- Store only the health fields needed for training decisions.
- Future AI features should receive minimal structured summaries whenever possible rather than raw health records.
- Recommendation provenance should identify inputs and algorithm version without storing opaque model state.
