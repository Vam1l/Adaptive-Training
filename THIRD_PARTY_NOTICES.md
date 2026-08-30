# Third-party notices

## Ischys

Substantial portions of the React Native / Expo application chassis in this
repository (`frontend/`) are derived from **Ischys**:

> https://github.com/ischys-app/Ischys  
> MIT License — Copyright (c) 2026 Ischys

The Ischys MIT copyright notice is retained in the root `LICENSE` file as
required by the MIT license.

Ischys-derived components include:
- Expo Router app shell (`frontend/app/`)
- SQLite/Drizzle database schema and migrations (baseline `0000_silly_riptide.sql`)
- HealthKit module (`frontend/modules/health/`)
- Live Activity module (`frontend/modules/live-activity/`)
- Apple Watch target (`frontend/targets/ischys-watch/`)
- Live Activity widget target (`frontend/targets/ischys-widget/`)
- Domain logic: workout, set, exercise, routine, history, PR/e1RM
- Exercise catalog schema and seeding
- UI components and theme
- Project configuration (Expo, Metro, Babel, Drizzle, TypeScript)
- App assets (`frontend/assets/icon.png`, `splash-icon.png`, `favicon.png`,
  `android-icon-*.png`)
- Third-party attributions (see `frontend/NOTICE`)

## Exercise catalog

`frontend/assets/catalog/catalog.json` (736 exercises) is derived from
**free-exercise-db**:

> https://github.com/yuhonas/free-exercise-db  
> The Unlicense (public domain)

## Adaptive Training modules

`frontend/src/domain/adaptive/` is an **independent implementation** of general
training-domain concepts (RIR, RPE, progression engine, readiness). It does not
contain proprietary code from any third-party source.

## Repstack

The Adaptive Training engine was designed with reference to **Repstack**
(conceptual reference only; no source code copied):

> https://github.com/wulfland/Repstack  
> MIT License

## Fonts

See `frontend/NOTICE` for complete font attribution.
