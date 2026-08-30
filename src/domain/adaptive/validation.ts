import type {
  CompletedTrainingSet,
  ReadinessCheckIn,
  RecoverySnapshot,
  TrainingSetPrescription,
} from './types.ts';

export const RIR_MIN = 0;
export const RIR_MAX = 10;
export const RPE_MIN = 1;
export const RPE_MAX = 10;
export const READINESS_MIN = 1;
export const READINESS_MAX = 5;

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function assertRange(name: string, value: number | undefined, min: number, max: number): void {
  if (value === undefined) return;
  if (!isFiniteNumber(value) || value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}`);
  }
}

export function validateRir(value: number | undefined): void {
  assertRange('RIR', value, RIR_MIN, RIR_MAX);
}

export function validateRpe(value: number | undefined): void {
  assertRange('RPE', value, RPE_MIN, RPE_MAX);
}

export function validateReadinessValue(name: string, value: number | undefined): void {
  assertRange(name, value, READINESS_MIN, READINESS_MAX);
}

export function normalizeRir(value: number | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (!isFiniteNumber(value)) throw new RangeError('RIR must be finite');
  return Math.min(RIR_MAX, Math.max(RIR_MIN, value));
}

export function normalizeRpe(value: number | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (!isFiniteNumber(value)) throw new RangeError('RPE must be finite');
  return Math.min(RPE_MAX, Math.max(RPE_MIN, value));
}

export function validateTrainingSetPrescription(value: TrainingSetPrescription): void {
  validateRir(value.targetRir);
  validateRpe(value.targetRpe);
  if (value.targetRepsMin !== undefined && value.targetRepsMin < 0) throw new RangeError('targetRepsMin must be >= 0');
  if (value.targetRepsMax !== undefined && value.targetRepsMax < 0) throw new RangeError('targetRepsMax must be >= 0');
  if (
    value.targetRepsMin !== undefined &&
    value.targetRepsMax !== undefined &&
    value.targetRepsMin > value.targetRepsMax
  ) {
    throw new RangeError('targetRepsMin must be <= targetRepsMax');
  }
  if (value.targetWeight !== undefined && value.targetWeight < 0) throw new RangeError('targetWeight must be >= 0');
  if (value.restSeconds !== undefined && value.restSeconds < 0) throw new RangeError('restSeconds must be >= 0');
}

export function validateCompletedTrainingSet(value: CompletedTrainingSet): void {
  validateRir(value.rir);
  validateRpe(value.rpe);
  if (value.weight !== undefined && value.weight < 0) throw new RangeError('weight must be >= 0');
  if (value.reps !== undefined && (!Number.isInteger(value.reps) || value.reps < 0)) {
    throw new RangeError('reps must be a non-negative integer');
  }
}

export function validateReadinessCheckIn(value: ReadinessCheckIn): void {
  validateReadinessValue('sleepQuality', value.sleepQuality);
  validateReadinessValue('generalFatigue', value.generalFatigue);
  validateReadinessValue('motivation', value.motivation);
  validateReadinessValue('stress', value.stress);
  for (const [region, soreness] of Object.entries(value.soreness ?? {})) {
    validateReadinessValue(`soreness.${region}`, soreness);
  }
}

export function validateRecoverySnapshot(value: RecoverySnapshot): void {
  if (value.sleepDurationMinutes !== undefined && value.sleepDurationMinutes < 0) {
    throw new RangeError('sleepDurationMinutes must be >= 0');
  }
  if (value.restingHeartRate !== undefined && value.restingHeartRate <= 0) {
    throw new RangeError('restingHeartRate must be > 0');
  }
  if (value.hrv !== undefined && value.hrv < 0) throw new RangeError('hrv must be >= 0');
  if (value.steps !== undefined && (!Number.isInteger(value.steps) || value.steps < 0)) {
    throw new RangeError('steps must be a non-negative integer');
  }
  if (value.activeEnergy !== undefined && value.activeEnergy < 0) throw new RangeError('activeEnergy must be >= 0');
}
