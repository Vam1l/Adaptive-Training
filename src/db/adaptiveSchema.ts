/**
 * Storage contract for the adaptive-training data added in PR1.
 *
 * This file is intentionally ORM-agnostic so it can be merged into an existing
 * Ischys Drizzle schema without forcing destructive changes. The SQL migration
 * beside it is additive and documents the intended columns/tables.
 */
export const ADAPTIVE_SCHEMA_VERSION = 1 as const;

export const adaptiveTables = [
  'readiness_check_ins',
  'recovery_snapshots',
  'external_training_sessions',
  'training_recommendations',
] as const;
