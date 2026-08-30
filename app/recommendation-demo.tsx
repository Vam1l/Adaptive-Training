import { ScrollView, Text, View } from 'react-native';
import { buildTrainingRecommendation } from '../src/domain/adaptive/engine';
import { explainRecommendation } from '../src/domain/adaptive/explain';
import type { ExercisePrescription } from '../src/domain/adaptive/types';

const prescription: ExercisePrescription = {
  exerciseId: 'bench_press',
  intent: 'strength',
  loadIncrement: 5,
  rationaleCodes: [],
  sets: [
    { setType: 'working', targetWeight: 145, targetRepsMin: 6, targetRepsMax: 8, targetRir: 2, restSeconds: 180 },
    { setType: 'working', targetWeight: 145, targetRepsMin: 6, targetRepsMax: 8, targetRir: 2, restSeconds: 180 },
    { setType: 'working', targetWeight: 145, targetRepsMin: 6, targetRepsMax: 8, targetRir: 2, restSeconds: 180 },
  ],
};

export default function RecommendationDemo() {
  const recommendation = buildTrainingRecommendation({
    exerciseId: 'bench_press',
    prescription,
    completedSets: [
      { weight: 145, reps: 8, rir: 2 },
      { weight: 145, reps: 8, rir: 2 },
      { weight: 145, reps: 8, rir: 2 },
    ],
    generatedAt: '2026-08-29T12:00:00.000Z',
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Next recommendation</Text>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 18 }}>Bench press</Text>
        <Text>Action: {recommendation.action.replaceAll('_', ' ')}</Text>
        <Text>Next load: {recommendation.prescribedLoad ?? 'unchanged'}</Text>
        <Text>
          Reps: {recommendation.prescribedRepRange?.min ?? '—'}–{recommendation.prescribedRepRange?.max ?? '—'}
        </Text>
        <Text>Target RIR: {recommendation.targetRir ?? '—'}</Text>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: '600' }}>Why?</Text>
        <Text>{explainRecommendation(recommendation)}</Text>
      </View>
    </ScrollView>
  );
}
