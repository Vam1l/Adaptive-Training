-- Adaptive Training additive migration.
-- Adds new tables for readiness, recovery, external training, and recommendations.
-- Also adds adaptive columns to workout_sets (all additive, no destructive changes).
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `readiness_check_ins` (
	`id` text PRIMARY KEY NOT NULL,
	`recorded_at` text NOT NULL,
	`sleep_quality` integer,
	`general_fatigue` integer,
	`motivation` integer,
	`stress` integer,
	`soreness_json` text,
	`pain_regions_json` text DEFAULT '[]' NOT NULL,
	`unusual_event` text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `recovery_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`recorded_at` text NOT NULL,
	`sleep_duration_minutes` integer,
	`resting_heart_rate` real,
	`hrv` real,
	`steps` integer,
	`active_energy` real,
	`source` text NOT NULL,
	`baseline_json` text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `external_training_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`started_at` text NOT NULL,
	`duration_minutes` real NOT NULL,
	`intensity` real,
	`avg_heart_rate` real,
	`max_heart_rate` real,
	`affected_regions_json` text,
	`source` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `training_recommendations` (
	`id` text PRIMARY KEY NOT NULL,
	`generated_at` text NOT NULL,
	`recommendation_type` text NOT NULL,
	`exercise_id` text,
	`prescribed_load` real,
	`prescribed_rep_min` integer,
	`prescribed_rep_max` integer,
	`prescribed_sets` integer,
	`target_rir` real,
	`action` text NOT NULL,
	`rationale_codes_json` text DEFAULT '[]' NOT NULL,
	`human_readable_reason` text,
	`inputs_used_json` text DEFAULT '[]' NOT NULL,
	`version` text NOT NULL,
	`provenance_json` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_readiness_recorded_at` ON `readiness_check_ins` (`recorded_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_recovery_recorded_at` ON `recovery_snapshots` (`recorded_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_external_started_at` ON `external_training_sessions` (`started_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_recommendations_generated_at` ON `training_recommendations` (`generated_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_recommendations_exercise_id` ON `training_recommendations` (`exercise_id`);
--> statement-breakpoint
-- Additive columns on workout_sets for adaptive tracking
ALTER TABLE `workout_sets` ADD COLUMN `rir` real;
--> statement-breakpoint
ALTER TABLE `workout_sets` ADD COLUMN `rpe` real;
--> statement-breakpoint
ALTER TABLE `workout_sets` ADD COLUMN `pain_flag` integer DEFAULT 0;
--> statement-breakpoint
-- Additive columns on routine_sets for adaptive prescriptions
ALTER TABLE `routine_sets` ADD COLUMN `target_rir` real;
--> statement-breakpoint
ALTER TABLE `routine_sets` ADD COLUMN `target_rep_min` integer;
--> statement-breakpoint
ALTER TABLE `routine_sets` ADD COLUMN `target_rep_max` integer;
