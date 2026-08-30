import type { TrainingRecommendation } from './types.ts';

const rationaleText: Record<string, string> = {
  upper_rep_threshold_met: 'You reached the top of the prescribed rep range while preserving the target effort.',
  target_rir_exceeded: 'You finished with more reps in reserve than the target, suggesting room to progress.',
  target_rir_missed: 'The completed sets were meaningfully harder than the target effort.',
  repeated_performance_drop: 'Performance has declined across repeated exposures.',
  elevated_fatigue: 'Fatigue is elevated relative to your recent baseline.',
  pain_reported: 'Pain was reported during the exercise.',
  high_external_training_load: 'Recent non-lifting training load is high.',
  deload_due: 'A deload trigger has been reached.',
};

export function explainRecommendation(recommendation: TrainingRecommendation): string {
  if (recommendation.rationaleCodes.length === 0) {
    return `Action: ${recommendation.action.replaceAll('_', ' ')}. No additional progression trigger was met.`;
  }

  return recommendation.rationaleCodes
    .map((code) => rationaleText[code] ?? code.replaceAll('_', ' '))
    .join(' ');
}
