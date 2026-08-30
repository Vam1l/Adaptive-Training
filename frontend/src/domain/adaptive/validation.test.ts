import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeRir,
  normalizeRpe,
  validateCompletedTrainingSet,
  validateReadinessCheckIn,
  validateRir,
  validateRpe,
  validateTrainingSetPrescription,
} from './validation.ts';

test('RIR accepts boundaries', () => {
  assert.doesNotThrow(() => validateRir(0));
  assert.doesNotThrow(() => validateRir(10));
  assert.doesNotThrow(() => validateRir(undefined));
});

test('RIR rejects values outside 0-10', () => {
  assert.throws(() => validateRir(-0.1), RangeError);
  assert.throws(() => validateRir(10.1), RangeError);
});

test('RPE accepts 1-10 and rejects outside range', () => {
  assert.doesNotThrow(() => validateRpe(1));
  assert.doesNotThrow(() => validateRpe(10));
  assert.throws(() => validateRpe(0), RangeError);
  assert.throws(() => validateRpe(11), RangeError);
});

test('readiness scales are 1-5', () => {
  assert.doesNotThrow(() => validateReadinessCheckIn({ recordedAt: new Date().toISOString(), sleepQuality: 1, stress: 5, painRegions: [] }));
  assert.throws(() => validateReadinessCheckIn({ recordedAt: new Date().toISOString(), motivation: 6, painRegions: [] }), RangeError);
});

test('RIR and RPE are independently optional', () => {
  assert.doesNotThrow(() => validateCompletedTrainingSet({ reps: 5 }));
  assert.doesNotThrow(() => validateCompletedTrainingSet({ reps: 5, rir: 2 }));
  assert.doesNotThrow(() => validateCompletedTrainingSet({ reps: 5, rpe: 8 }));
});

test('normalizers clamp finite values', () => {
  assert.equal(normalizeRir(-2), 0);
  assert.equal(normalizeRir(12), 10);
  assert.equal(normalizeRpe(0), 1);
  assert.equal(normalizeRpe(12), 10);
});

test('prescription validates rep-range ordering', () => {
  assert.doesNotThrow(() => validateTrainingSetPrescription({ setType: 'working', targetRepsMin: 6, targetRepsMax: 8, targetRir: 2 }));
  assert.throws(() => validateTrainingSetPrescription({ setType: 'working', targetRepsMin: 10, targetRepsMax: 8 }), RangeError);
});
