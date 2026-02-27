import { useState, useEffect } from "react";
import SectionHeader from "../SectionHeader";
import ControlSlider from "../ControlSlider";
import { generateText, submitFeedback, Generation } from "../../api";
import { useApp } from "../../context/AppContext";
import { useLocation } from "react-router-dom";

const THEMES = ["Mythic futurism", "Urban folklore", "Hopepunk discovery", "Solarpunk utopia", "Biopunk nature"];
const TONES = ["Warm visionary", "Minimalist poetic", "Energetic optimistic", "Dark contemplative", "Playful surreal"];
const CULTURES = ["South Asian coastal", "Afro-futurist diaspora", "Nordic myth remix", "East Asian celestial", "Latin American magical"];
const GENRES = ["Short story", "Marketing copy", "Script / screenplay", "Essay / blog", "Song lyrics"];

const TextWorkspacePage = () => {
  const { refreshMemory, memory, setLastGeneration } = useApp();
  const location = useLocation();
  const visionFromLanding = location.state?.vision;

  const [prompt, setPrompt] = useState(visionFromLanding || (memory?.themes?.[0] ? `Write a story inspired by ${memory.themes[0]}` : ""));
  const [theme, setTheme] = useState(THEMES[0]);
  const [tone, setTone] = useState(memory?.tone || TONES[0]);
  const [culture, setCulture] = useState(memory?.culturalContext || CULTURES[0]);
  const [genre, setGenre] = useState(GENRES[0]);
  const [originality, setOriginality] = useState(72);
  const [complexity, setComplexity] = useState(58);
  const [refinement, setRefinement] = useState(84);

  useEffect(() => {
    if (visionFromLanding) {
      setPrompt(visionFromLanding);
    }
  }, [visionFromLanding]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Generation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Feedback state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [edits, setEdits] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setFeedbackSent(false);
    setRating(0);
    try {
      const gen = await generateText(
        prompt,
        { tone: tone.toLowerCase(), culturalContext: culture.toLowerCase(), originality, complexity },
        [`genre: ${genre}`, `theme: ${theme}`, `refinement level: ${refinement}`]
      );
      setResult(gen);
      setLastGeneration(gen);
    } catch (err: any) {
      setError(err.message || "Generation failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (r: number) => {
    if (!result || feedbackSent) return;
    setRating(r);
    console.log("Submitting rating:", r);
    try {
      await submitFeedback({ generationId: result.id, rating: r, edits, toneHint: tone.toLowerCase() });
      setFeedbackSent(true);
      await refreshMemory();
    } catch (err) {
      console.error("Feedback error:", err);
    }
  };

  const handleEditFeedback = async () => {
    if (!result || !edits.trim()) return;
    try {
      await submitFeedback({ generationId: result.id, edits, signals: { acceptance: true } });
      setFeedbackSent(true);
      await refreshMemory();
    } catch { /* ignore */ }
  };

  return (
    <div className="page">
      <SectionHeader
        title="Text Workspace"
        subtitle="Co-create stories, scripts, and copy with Chhaya's adaptive creative engine."
      />

      <div className="split">
        {/* Controls Panel */}
        <div className="panel controls">
          <div className="control-group">
            <label>Creative Brief</label>
            <textarea
              rows={4}
              placeholder="Describe the story, campaign, or script you want to co-create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>Genre</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              {GENRES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Theme</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              {THEMES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Tone &amp; Voice</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              {TONES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Cultural Context</label>
            <select value={culture} onChange={(e) => setCulture(e.target.value)}>
              {CULTURES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <ControlSlider label="Originality vs Consistency" value={originality} onChange={setOriginality} />
          <ControlSlider label="Structural Complexity" value={complexity} onChange={setComplexity} />
          <ControlSlider label="Multi-step Refinement" value={refinement} onChange={setRefinement} />

          <button
            className="button-primary"
            style={{ width: "100%", marginTop: 8 }}
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
          >
            {loading ? "✨ Generating…" : "✨ Generate with Chhaya"}
          </button>
        </div>

        {/* Output Panel */}
        <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3>Generated Draft</h3>

          {error && (
            <div className="output-block" style={{ borderColor: "rgba(255,100,100,0.4)", color: "#ff9b9b" }}>
              ⚠ {error}
            </div>
          )}

          {loading && (
            <div className="output-block text-loading">
              <div className="loading-shimmer" />
              <div className="loading-shimmer" style={{ width: "85%" }} />
              <div className="loading-shimmer" style={{ width: "92%" }} />
              <div className="loading-shimmer" style={{ width: "70%" }} />
            </div>
          )}

          {result && !loading && (
            <>
              <div className="output-block" style={{ whiteSpace: "pre-wrap" }}>
                {result.output}
              </div>

              {/* Reasoning tags */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="tag">🎨 {result.reasoning.tone}</span>
                {result.reasoning.themes.map((t) => (
                  <span className="tag" key={t}>📖 {t}</span>
                ))}
                <span className="tag">🌍 {result.reasoning.culturalContext}</span>
                <span className="tag">⚡ {result.reasoning.riskBudget} arc</span>
              </div>

              {/* Cross-modal anchors */}
              <div className="card" style={{ marginTop: 4 }}>
                <h4 style={{ marginBottom: 8, fontSize: 13, opacity: 0.7 }}>Cross-modal continuity</h4>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>🖼 {result.crossModal.visualAnchor}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>🎵 {result.crossModal.audioAnchor}</p>
              </div>

              {/* Feedback */}
              <div className="card">
                <h4 style={{ marginBottom: 10 }}>Rate this output</h4>
                <div style={{ display: "flex", gap: 6, fontSize: 26, cursor: "pointer" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleFeedback(s)}
                      style={{ color: s <= (hoverRating || rating) ? "#ffd370" : "rgba(255,255,255,0.15)", transition: "color 0.15s" }}
                    >★</span>
                  ))}
                </div>
                {!feedbackSent && (
                  <>
                    <textarea
                      rows={2}
                      placeholder="Paste edits or describe changes (Chhaya learns from this)…"
                      value={edits}
                      onChange={(e) => setEdits(e.target.value)}
                      style={{ marginTop: 10 }}
                    />
                    <button className="button-primary" style={{ marginTop: 8 }} onClick={handleEditFeedback}>
                      Submit edits
                    </button>
                  </>
                )}
                {feedbackSent && (
                  <p style={{ color: "var(--accent-soft)", marginTop: 8, fontSize: 13 }}>
                    ✓ Chhaya has learned from your feedback.
                  </p>
                )}
              </div>
            </>
          )}

          {!result && !loading && !error && (
            <div className="output-block" style={{ color: "var(--text-muted)", textAlign: "center" }}>
              Your generated draft will appear here. Set your constraints and hit ✨ Generate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextWorkspacePage;
