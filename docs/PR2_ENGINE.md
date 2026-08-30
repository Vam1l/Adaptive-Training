# PR2 deterministic progression engine

## Scope

PR2 implements exercise-level progression from completed working sets and a prescription. It does not yet calculate mesocycles, readiness, recovery, or multi-sport fatigue.

## Initial rules

1. Pain flag -> substitute exercise.
2. No completed working sets -> no change.
3. Repeated performance drop -> reduce load.
4. All working sets at/above upper rep target while meeting target RIR -> increase load.
5. Some room to progress within the rep range while meeting target RIR -> increase reps.
6. Target RIR missed by a meaningful margin -> reduce load.
7. Otherwise -> maintain.

These rules are deliberately explicit so they can be tested and revised without model opacity.
