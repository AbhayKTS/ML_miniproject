import { useState } from "react";
import SectionHeader from "../SectionHeader";
import { submitFeedback } from "../../api";
import { useApp } from "../../context/AppContext";

const FeedbackPage = () => {
  const { lastGeneration, memory, refreshMemory } = useApp();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [edits, setEdits] = useState("");
  const [toneHint, setToneHint] = useState("");
  const [reuse, setReuse] = useState(false);
  const [acceptance, setAcceptance] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!rating && !edits.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await submitFeedback({
        generationId: lastGeneration?.id,
        rating: rating || undefined,
        edits: edits || undefined,
        toneHint: toneHint || undefined,
        signals: { reuse, acceptance },
      });
      setSubmitted(true);
      await refreshMemory();
    } catch (err: any) {
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setEdits("");
    setToneHint("");
    setReuse(false);
    setAcceptance(false);
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="page">
      <SectionHeader
        title="Feedback Panel"
        subtitle="Guide Chhaya with explicit ratings and edit-based refinement. Every signal improves future generations."
      />

      {lastGeneration ? (
        <div className="card" style={{ marginBottom: 20, padding: 16 }}>
          <h4 style={{ fontSize: 13, opacity: 0.6, marginBottom: 6 }}>Last generation ({lastGeneration.modality})</h4>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
            {lastGeneration.output.slice(0, 200)}…
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <span className="tag">🎨 {lastGeneration.reasoning.tone}</span>
            <span className="tag">📖 {lastGeneration.reasoning.themes[0]}</span>
            <span className="tag" style={{ fontSize: 11, opacity: 0.6 }}>ID: {lastGeneration.id.slice(0, 8)}</span>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 20, opacity: 0.6 }}>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            No recent generation found. Go to Text, Image, or Audio workspace to generate content first.
          </p>
        </div>
      )}

      <div className="cards">
        {/* Star Rating */}
        <div className="card">
          <h3>Rate this result</h3>
          <div style={{ display: "flex", gap: 8, fontSize: 32, cursor: "pointer", marginTop: 12 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(s)}
                style={{
                  color: s <= (hover || rating) ? "#ffd370" : "rgba(255,255,255,0.15)",
                  transition: "color 0.15s, transform 0.1s",
                  transform: s <= (hover || rating) ? "scale(1.2)" : "scale(1)",
                  display: "inline-block"
                }}
              >★</span>
            ))}
          </div>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 13 }}>
            {rating === 0 ? "Click a star to rate" : rating >= 4 ? "Great! Chhaya will reinforce this style." : "Got it — Chhaya will adapt."}
          </p>

          <div className="control-group" style={{ marginTop: 16 }}>
            <label>Tone guidance (optional)</label>
            <input
              type="text"
              placeholder="e.g. 'more hopeful', 'less abstract'"
              value={toneHint}
              onChange={(e) => setToneHint(e.target.value)}
            />
          </div>

          <div className="toggle-row" style={{ marginTop: 12 }}>
            <input type="checkbox" id="cb-reuse" checked={reuse} onChange={(e) => setReuse(e.target.checked)} />
            <label htmlFor="cb-reuse" style={{ cursor: "pointer" }}>I would reuse this output</label>
          </div>
          <div className="toggle-row" style={{ marginTop: 8 }}>
            <input type="checkbox" id="cb-accept" checked={acceptance} onChange={(e) => setAcceptance(e.target.checked)} />
            <label htmlFor="cb-accept" style={{ cursor: "pointer" }}>I accepted this as final</label>
          </div>
        </div>

        {/* Edit-based Adaptation */}
        <div className="card">
          <h3>Edit-based Adaptation</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 13 }}>
            Paste your edited version below. Chhaya learns from the diff to improve alignment on the next generation.
          </p>
          <textarea
            rows={7}
            placeholder="Paste your edited text here... Chhaya detects the changes and updates its creative strategy."
            value={edits}
            onChange={(e) => setEdits(e.target.value)}
            style={{ marginTop: 12 }}
          />
        </div>

        {/* Submit & Status */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h3>Submit Feedback</h3>
          {error && <p style={{ color: "#ff9b9b", fontSize: 13 }}>⚠ {error}</p>}
          {submitted ? (
            <div>
              <p style={{ color: "var(--accent-soft)", fontSize: 14 }}>
                ✓ Feedback applied. Chhaya's creative memory has been updated.
              </p>
              <div style={{ marginTop: 12 }}>
                <h4 style={{ fontSize: 13, opacity: 0.7 }}>Current memory state</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  {memory && (
                    <>
                      <span className="tag">🎨 {memory.tone}</span>
                      {memory.themes.map((t) => <span className="tag" key={t}>📖 {t}</span>)}
                      <span className="tag">🌍 {memory.culturalContext}</span>
                    </>
                  )}
                </div>
              </div>
              <button className="ghost-button" style={{ marginTop: 16 }} onClick={handleReset}>
                Submit more feedback
              </button>
            </div>
          ) : (
            <button
              className="button-primary"
              onClick={handleSubmit}
              disabled={loading || (!rating && !edits.trim())}
            >
              {loading ? "Submitting…" : "Submit feedback to Chhaya"}
            </button>
          )}

          <div className="mini-card">
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              Chhaya uses reinforcement-style adaptation — no retraining required. Each feedback signal shapes future generation strategies within the same session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
