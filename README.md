# Adaptive Training

A React Native / Expo iPhone app for adaptive workout training, built on the [Ischys](https://github.com/ischys-app/Ischys) open-source chassis (MIT).

## Repository structure

```
├── frontend/          # Real Expo / React Native app (Ischys chassis + Adaptive Training)
│   ├── app/           # Expo Router file-based routes
│   ├── src/
│   │   ├── domain/
│   │   │   ├── adaptive/   # Adaptive Training engine, types, validation (PR1/PR2)
│   │   │   └── ...         # Ischys domain logic (stats, records, streaks, …)
│   │   ├── db/             # SQLite/Drizzle schema + bootstrap
│   │   ├── data/           # Repository layer
│   │   ├── lib/            # App utilities (HealthKit, Live Activity, Watch, …)
│   │   └── components/     # React Native UI components
│   ├── drizzle/            # SQL migrations (Ischys baseline + adaptive additive)
│   ├── modules/            # Expo native modules (HealthKit, Live Activity)
│   ├── targets/            # Apple Watch + Live Activity widget targets
│   └── assets/             # App assets and exercise catalog
├── docs/              # Architecture, privacy, roadmap (Adaptive Training PR1/PR2)
├── LICENSE            # MIT (Adaptive Training)
└── THIRD_PARTY_NOTICES.md
```

## Running the app

```bash
cd frontend
npm install
npm start          # Expo dev server
npm run ios        # iOS simulator (requires macOS + Xcode)
```

## Checks

```bash
cd frontend
npm run typecheck  # TypeScript (tsc --noEmit)
npm test           # lint:la + node --test (194 tests)
```

## Adaptive Training modules

The `frontend/src/domain/adaptive/` directory contains:
- **types.ts** — Core domain types (TrainingRecommendation, ReadinessCheckIn, RecoverySnapshot, …)
- **validation.ts** — RIR/RPE/readiness bounds checking and normalization
- **engine.ts** — Deterministic double-progression engine with rationale codes
- **explain.ts** — Human-readable explanation generator
- **engine.test.ts / validation.test.ts** — Comprehensive test coverage

A simple demo screen is available at `frontend/app/recommendation-demo.tsx`.

## Database

The Ischys SQLite/Drizzle schema is extended additively:
- `workout_sets` gains `rir`, `rpe`, `pain_flag` columns
- `routine_sets` gains `target_rir`, `target_rep_min`, `target_rep_max` columns
- Four new tables: `readiness_check_ins`, `recovery_snapshots`, `external_training_sessions`, `training_recommendations`

Migration: `frontend/drizzle/0001_adaptive_training.sql`

## Native iOS / Watch / Live Activity

Native build requires macOS + Xcode. See `frontend/app.json` for bundle identifiers and signing configuration. Apple Team ID and signing certificates are developer-specific and not committed; configure them in Xcode before building.

## License

This repository is MIT licensed (see `LICENSE`). The `frontend/` directory is derived from [Ischys](https://github.com/ischys-app/Ischys) (MIT, Copyright 2026 Ischys) — see `frontend/LICENSE` and `frontend/NOTICE`.
