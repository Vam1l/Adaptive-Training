import assert from 'node:assert/strict';
import test from 'node:test';
import { decideExerciseProgression } from './engine.ts';
import type { ExercisePrescription } from './types.ts';

const prescription: ExercisePrescription = {
  exerciseId: 'bench',
  intent: 'strength',
  loadIncrement: 5,
  rationaleCodes: [],
  sets: [
    { setType: 'working', targetWeight: 145, targetRepsMin: 6, targetRepsMax: 8, targetRir: 2 },
    { setType: 'working', targetWeight: 145, targetRepsMin: 6, targetRepsMax: 8, targetRir: 2 },
    { setType: 'working', targetWeight: 145, targetRepsMin: 6, targetRepsMax: 8, targetRir: 2 },
  ],
};

test('pain takes precedence and recommends substitution', () => {
  const result = decideExerciseProgression({
    exerciseId: 'bench',
    prescription,
    completedSets: [{ weight: 145, reps: 6, rir: 2, painFlag: true }],
  });
  assert.equal(result.action, 'substitute_exercise');
  assert.deepEqual(result.rationaleCodes, ['pain_reported']);
});

test('top of rep range with target RIR increases load', () => {
  const result = decideExerciseProgression({
    exerciseId: 'bench',
    prescription,
    completedSets: [
      { weight: 145, reps: 8, rir: 2 },
      { weight: 145, reps: 8, rir: 2 },
      { weight: 145, reps: 8, rir: 2 },
    ],
  });
  assert.equal(result.action, 'increase_load');
  assert.equal(result.prescribedLoad, 150);
});

test('room in rep range with adequate RIR increases reps', () => {
  const result = decideExerciseProgression({
    exerciseId: 'bench',
    prescription,
    completedSets: [
      { weight: 145, reps: 7, rir: 3 },
      { weight: 145, reps: 7, rir: 3 },
      { weight: 145, reps: 6, rir: 3 },
    ],
  });
  assert.equal(result.action, 'increase_reps');
});

test('meaningful RIR miss reduces load', () => {
  const result = decideExerciseProgression({
    exerciseId: 'bench',
    prescription,
    completedSets: [
      { weight: 145, reps: 6, rir: 0 },
      { weight: 145, reps: 6, rir: 0 },
      { weight: 145, reps: 6, rir: 0 },
    ],
  });
  assert.equal(result.action, 'reduce_load');
  assert.deepEqual(result.rationaleCodes, ['target_rir_missed']);
});

test('repeated performance decline reduces load', () => {
  const result = decideExerciseProgression({
    exerciseId: 'bench',
    prescription,
    completedSets: [{ weight: 145, reps: 6, rir: 2 }],
    previousPerformanceDropCount: 2,
  });
  assert.equal(result.action, 'reduce_load');
  assert.deepEqual(result.rationaleCodes, ['repeated_performance_drop']);
});
