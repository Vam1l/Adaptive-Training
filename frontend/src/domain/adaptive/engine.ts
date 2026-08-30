import type {
  CompletedTrainingSet,
  ExercisePrescription,
  RecommendationAction,
  RationaleCode,
  RepRange,
  TrainingRecommendation,
} from './types.ts';

export interface ExerciseProgressionInput {
  exerciseId: string;
  prescription: ExercisePrescription;
  completedSets: CompletedTrainingSet[];
  previousPerformanceDropCount?: number;
  generatedAt?: string;
}

export interface ExerciseProgressionDecision {
  action: RecommendationAction;
  rationaleCodes: RationaleCode[];
  prescribedLoad?: number;
  prescribedRepRange?: RepRange;
  prescribedSets?: number;
  targetRir?: number;
}

export const ENGINE_VERSION = '0.1.0';

function workingPrescription(prescription: ExercisePrescription) {
  return prescription.sets.filter((set) => set.setType !== 'warmup');
}

function relevantCompletedSets(sets: CompletedTrainingSet[]) {
  return sets.filter((set) => set.reps !== undefined || set.weight !== undefined || set.rir !== undefined || set.rpe !== undefined);
}

function average(values: number[]): number | undefined {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : undefined;
}

function firstDefined<T>(values: Array<T | undefined>): T | undefined {
  return values.find((value): value is T => value !== undefined);
}

export function decideExerciseProgression(input: ExerciseProgressionInput): ExerciseProgressionDecision {
  const prescribedWorkingSets = workingPrescription(input.prescription);
  const completed = relevantCompletedSets(input.completedSets);
  const repMin = firstDefined(prescribedWorkingSets.map((set) => set.targetRepsMin));
  const repMax = firstDefined(prescribedWorkingSets.map((set) => set.targetRepsMax));
  const targetRir = firstDefined(prescribedWorkingSets.map((set) => set.targetRir));
  const prescribedLoad = firstDefined(prescribedWorkingSets.map((set) => set.targetWeight));
  const repRange = repMin !== undefined && repMax !== undefined ? { min: repMin, max: repMax } : undefined;

  if (completed.some((set) => set.painFlag)) {
    return {
      action: 'substitute_exercise',
      rationaleCodes: ['pain_reported'],
      prescribedRepRange: repRange,
      prescribedSets: prescribedWorkingSets.length,
      targetRir,
    };
  }

  if (completed.length === 0) {
    return {
      action: 'no_change',
      rationaleCodes: [],
      prescribedLoad,
      prescribedRepRange: repRange,
      prescribedSets: prescribedWorkingSets.length,
      targetRir,
    };
  }

  if ((input.previousPerformanceDropCount ?? 0) >= 2) {
    return {
      action: 'reduce_load',
      rationaleCodes: ['repeated_performance_drop'],
      prescribedLoad,
      prescribedRepRange: repRange,
      prescribedSets: prescribedWorkingSets.length,
      targetRir,
    };
  }

  const reps = completed.flatMap((set) => (set.reps === undefined ? [] : [set.reps]));
  const rirs = completed.flatMap((set) => (set.rir === undefined ? [] : [set.rir]));
  const avgRir = average(rirs);
  const allAtUpperRepTarget = repMax !== undefined && reps.length > 0 && reps.every((rep) => rep >= repMax);
  const meetsRirTarget = targetRir === undefined || avgRir === undefined || avgRir >= targetRir;

  if (allAtUpperRepTarget && meetsRirTarget) {
    return {
      action: 'increase_load',
      rationaleCodes: ['upper_rep_threshold_met'],
      prescribedLoad:
        prescribedLoad !== undefined && input.prescription.loadIncrement !== undefined
          ? prescribedLoad + input.prescription.loadIncrement
          : prescribedLoad,
      prescribedRepRange: repRange,
      prescribedSets: prescribedWorkingSets.length,
      targetRir,
    };
  }

  if (targetRir !== undefined && avgRir !== undefined && avgRir <= Math.max(0, targetRir - 2)) {
    return {
      action: 'reduce_load',
      rationaleCodes: ['target_rir_missed'],
      prescribedLoad,
      prescribedRepRange: repRange,
      prescribedSets: prescribedWorkingSets.length,
      targetRir,
    };
  }

  const withinRepRange =
    repMin !== undefined &&
    repMax !== undefined &&
    reps.length > 0 &&
    reps.every((rep) => rep >= repMin && rep <= repMax);

  if (withinRepRange && meetsRirTarget && reps.some((rep) => rep < repMax!)) {
    return {
      action: 'increase_reps',
      rationaleCodes: targetRir !== undefined && avgRir !== undefined && avgRir > targetRir ? ['target_rir_exceeded'] : [],
      prescribedLoad,
      prescribedRepRange: repRange,
      prescribedSets: prescribedWorkingSets.length,
      targetRir,
    };
  }

  return {
    action: 'maintain',
    rationaleCodes: [],
    prescribedLoad,
    prescribedRepRange: repRange,
    prescribedSets: prescribedWorkingSets.length,
    targetRir,
  };
}

export function buildTrainingRecommendation(input: ExerciseProgressionInput): TrainingRecommendation {
  const decision = decideExerciseProgression(input);
  const generatedAt = input.generatedAt ?? new Date().toISOString();

  return {
    id: `${input.exerciseId}:${generatedAt}`,
    generatedAt,
    recommendationType: 'exercise_progression',
    exerciseId: input.exerciseId,
    prescribedLoad: decision.prescribedLoad,
    prescribedRepRange: decision.prescribedRepRange,
    prescribedSets: decision.prescribedSets,
    targetRir: decision.targetRir,
    action: decision.action,
    rationaleCodes: decision.rationaleCodes,
    inputsUsed: [
      'prescription',
      'completedSets',
      ...(input.previousPerformanceDropCount !== undefined ? ['previousPerformanceDropCount'] : []),
    ],
    version: ENGINE_VERSION,
    provenance: {
      engineVersion: ENGINE_VERSION,
      algorithm: 'deterministic_double_progression_v1',
      generatedFrom: ['local_workout_log'],
    },
  };
}
