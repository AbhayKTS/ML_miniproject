# Creative Memory Logic

Chhaya stores long-term creative identity via a hybrid relational + vector memory. Each generation updates a memory profile using:
- Style vectors (embedding of user prompts, edits)
- Tone preferences
- Cultural motifs
- Feedback signals

Memory update cycle:
1. Retrieve memory profile for user.
2. Blend current intent with memory (weighted by confidence).
3. Apply feedback-driven adjustments.
4. Persist updated vectors and metadata.
