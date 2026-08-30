export const trainingIntents = ['strength', 'hypertrophy', 'technique', 'power', 'endurance'] as const;
export type TrainingIntent = (typeof trainingIntents)[number];

export const setTypes = ['warmup', 'working', 'backoff', 'amrap', 'drop', 'failure', 'technique'] as const;
export type TrainingSetType = (typeof setTypes)[number];

export const recommendationActions = [
  'maintain',
  'increase_reps',
  'increase_load',
  'reduce_load',
  'reduce_sets',
  'add_set',
  'deload',
  'substitute_exercise',
  'rest',
  'no_change',
] as const;
export type RecommendationAction = (typeof recommendationActions)[number];

export const rationaleCodes = [
  'upper_rep_threshold_met',
  'target_rir_exceeded',
  'target_rir_missed',
  'repeated_performance_drop',
  'elevated_fatigue',
  'pain_reported',
  'high_external_training_load',
  'deload_due',
] as const;
export type RationaleCode = (typeof rationaleCodes)[number];

export type BodyRegion =
  | 'neck'
  | 'shoulders'
  | 'chest'
  | 'upper_back'
  | 'lower_back'
  | 'arms'
  | 'elbows'
  | 'forearms'
  | 'wrists'
  | 'hips'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'knees'
  | 'calves'
  | 'ankles'
  | 'feet'
  | 'other';

export interface TrainingSetPrescription {
  targetWeight?: number;
  targetRepsMin?: number;
  targetRepsMax?: number;
  targetRir?: number;
  targetRpe?: number;
  setType: TrainingSetType;
  restSeconds?: number;
}

export interface CompletedTrainingSet {
  weight?: number;
  reps?: number;
  rir?: number;
  rpe?: number;
  completedAt?: string;
  painFlag?: boolean;
}

export interface ExercisePrescription {
  exerciseId: string;
  sets: TrainingSetPrescription[];
  intent: TrainingIntent;
  loadIncrement?: number;
  notes?: string;
  rationaleCodes: RationaleCode[];
}

export interface ReadinessCheckIn {
  recordedAt: string;
  sleepQuality?: number;
  generalFatigue?: number;
  motivation?: number;
  stress?: number;
  soreness?: Partial<Record<BodyRegion, number>>;
  painRegions: BodyRegion[];
  unusualEvent?: string;
}

export interface BaselineMetadata {
  windowDays?: number;
  restingHeartRateBaseline?: number;
  hrvBaseline?: number;
  sleepDurationBaselineMinutes?: number;
  calculatedAt?: string;
}

export interface RecoverySnapshot {
  recordedAt: string;
  sleepDurationMinutes?: number;
  restingHeartRate?: number;
  hrv?: number;
  steps?: number;
  activeEnergy?: number;
  source: string;
  baseline?: BaselineMetadata;
}

export const externalTrainingTypes = ['bjj', 'running', 'swimming', 'cycling', 'sport', 'other'] as const;
export type ExternalTrainingType = (typeof externalTrainingTypes)[number];

export interface ExternalTrainingSession {
  type: ExternalTrainingType;
  startedAt: string;
  durationMinutes: number;
  intensity?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  affectedRegions?: BodyRegion[];
  source: string;
}

export interface RepRange {
  min: number;
  max: number;
}

export interface RecommendationProvenance {
  engineVersion: string;
  algorithm: string;
  generatedFrom: string[];
}

export interface TrainingRecommendation {
  id: string;
  generatedAt: string;
  recommendationType: string;
  exerciseId?: string;
  prescribedLoad?: number;
  prescribedRepRange?: RepRange;
  prescribedSets?: number;
  targetRir?: number;
  action: RecommendationAction;
  rationaleCodes: RationaleCode[];
  humanReadableReason?: string;
  inputsUsed: string[];
  version: string;
  provenance: RecommendationProvenance;
}
