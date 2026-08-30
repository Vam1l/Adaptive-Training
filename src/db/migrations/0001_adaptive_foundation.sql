-- Adaptive Training PR1 additive schema.
-- When merging into an existing Ischys database, reconcile table/column names
-- with the existing Drizzle schema before applying. No destructive operations.

CREATE TABLE IF NOT EXISTS readiness_check_ins (
  id TEXT PRIMARY KEY NOT NULL,
  recorded_at TEXT NOT NULL,
  sleep_quality INTEGER,
  general_fatigue INTEGER,
  motivation INTEGER,
  stress INTEGER,
  soreness_json TEXT,
  pain_regions_json TEXT NOT NULL DEFAULT '[]',
  unusual_event TEXT
);

CREATE TABLE IF NOT EXISTS recovery_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  recorded_at TEXT NOT NULL,
  sleep_duration_minutes INTEGER,
  resting_heart_rate REAL,
  hrv REAL,
  steps INTEGER,
  active_energy REAL,
  source TEXT NOT NULL,
  baseline_json TEXT
);

CREATE TABLE IF NOT EXISTS external_training_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  started_at TEXT NOT NULL,
  duration_minutes REAL NOT NULL,
  intensity REAL,
  avg_heart_rate REAL,
  max_heart_rate REAL,
  affected_regions_json TEXT,
  source TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS training_recommendations (
  id TEXT PRIMARY KEY NOT NULL,
  generated_at TEXT NOT NULL,
  recommendation_type TEXT NOT NULL,
  exercise_id TEXT,
  prescribed_load REAL,
  prescribed_rep_min INTEGER,
  prescribed_rep_max INTEGER,
  prescribed_sets INTEGER,
  target_rir REAL,
  action TEXT NOT NULL,
  rationale_codes_json TEXT NOT NULL DEFAULT '[]',
  human_readable_reason TEXT,
  inputs_used_json TEXT NOT NULL DEFAULT '[]',
  version TEXT NOT NULL,
  provenance_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_readiness_recorded_at ON readiness_check_ins(recorded_at);
CREATE INDEX IF NOT EXISTS idx_recovery_recorded_at ON recovery_snapshots(recorded_at);
CREATE INDEX IF NOT EXISTS idx_external_started_at ON external_training_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_recommendations_generated_at ON training_recommendations(generated_at);
CREATE INDEX IF NOT EXISTS idx_recommendations_exercise_id ON training_recommendations(exercise_id);

-- Existing workout-set tables should receive these columns through the native
-- Drizzle migration once their exact upstream names are known:
--   rir REAL
--   rpe REAL
--   pain_flag INTEGER
--   target_rir REAL
--   target_rep_min INTEGER
--   target_rep_max INTEGER
-- Do not run ALTER TABLE statements blindly against an unknown upstream schema.
