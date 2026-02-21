import { useState } from "react";
import SectionHeader from "../SectionHeader";
import ControlSlider from "../ControlSlider";
import { generateImage, submitFeedback, Generation } from "../../api";
import { useApp } from "../../context/AppContext";

const STYLES = ["Painterly neon", "Concept art realism", "Anime-inspired cinematic", "Watercolour impressionist", "Photorealistic digital"];
const CULTURES = ["Coastal temple motifs", "Desert market patterns", "Nordic aurora palettes", "East Asian ink-wash", "Afro-futurist geometric"];
const MOODS = ["Luminous & hopeful", "Dark & mysterious", "Vibrant & energetic", "Calm & meditative", "Epic & dramatic"];

const ImageWorkspacePage = () => {
  const { memory, setLastGeneration, refreshMemory } = useApp();

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(memory?.visualStyle || STYLES[0]);
  const [culture, setCulture] = useState(memory?.culturalContext || CULTURES[0]);
  const [mood, setMood] = useState(MOODS[0]);
  const [variation, setVariation] = useState(64);
  const [texture, setTexture] = useState(70);
  const [colorHarmony, setColorHarmony] = useState(82);
  const [refFile, setRefFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Generation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const effectivePrompt = prompt || `${style} illustration: ${culture} scene, ${mood} mood`;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFeedbackSent(false);
    setRating(0);
    try {
      const gen = await generateImage(
        effectivePrompt,
        {
          tone: mood.toLowerCase(),
          culturalContext: culture.toLowerCase(),
          originality: variation,
          styleIntensity: texture,
        },
        [`style: ${style}`, `color harmony: ${colorHarmony}%`]
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
    try {
      await submitFeedback({ generationId: result.id, rating: r, signals: { acceptance: r >= 4 } });
      setFeedbackSent(true);
      await refreshMemory();
    } catch { /* ignore */ }
  };

  return (
    <div className="page">
      <SectionHeader
        title="Image Workspace"
        subtitle="Generate visual concepts aligned with your style, cultural filters, and thematic references."
      />

      <div className="split">
        <div className="panel controls">
          <div className="control-group">
            <label>Image Brief</label>
            <textarea
              rows={3}
              placeholder="Describe the scene, subject, or mood (optional – defaults use your style settings)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>Style Library</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              {STYLES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Cultural Filter</label>
            <select value={culture} onChange={(e) => setCulture(e.target.value)}>
              {CULTURES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Mood</label>
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              {MOODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Reference Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setRefFile(e.target.files?.[0] || null)} />
            {refFile && <span className="tag" style={{ marginTop: 6 }}>📎 {refFile.name}</span>}
          </div>
          <ControlSlider label="Variation Generator" value={variation} onChange={setVariation} />
          <ControlSlider label="Texture Fidelity" value={texture} onChange={setTexture} />
          <ControlSlider label="Color Harmony" value={colorHarmony} onChange={setColorHarmony} />

          <button
            className="button-primary"
            style={{ width: "100%", marginTop: 8 }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "🎨 Generating…" : "🎨 Generate Image Concept"}
          </button>
        </div>

        <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3>Image Concept Preview</h3>

          {error && (
            <div className="output-block" style={{ borderColor: "rgba(255,100,100,0.4)", color: "#ff9b9b" }}>
              ⚠ {error}
            </div>
          )}

          {loading && (
            <div className="output-block text-loading">
              <div className="loading-shimmer" style={{ height: 160, borderRadius: 12 }} />
              <div className="loading-shimmer" />
              <div className="loading-shimmer" style={{ width: "75%" }} />
            </div>
          )}

          {result && !loading && (
            <>
              {/* Simulated image preview box */}
              <div className="image-concept-box">
                <div className="image-concept-gradient" />
                <div className="image-concept-label">
                  <span className="tag">🖼 Image Prompt Generated</span>
                </div>
              </div>

              <div className="output-block" style={{ whiteSpace: "pre-wrap" }}>
                {result.output}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="tag">🎨 {result.reasoning.tone}</span>
                <span className="tag">🌍 {result.reasoning.culturalContext}</span>
                <span className="tag">⚡ {result.reasoning.riskBudget}</span>
              </div>

              <div className="card">
                <h4 style={{ marginBottom: 8 }}>Rate this concept</h4>
                <div style={{ display: "flex", gap: 6, fontSize: 26, cursor: "pointer" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => handleFeedback(s)}
                      style={{ color: s <= (hover || rating) ? "#ffd370" : "rgba(255,255,255,0.15)", transition: "color 0.15s" }}
                    >★</span>
                  ))}
                </div>
                {feedbackSent && <p style={{ color: "var(--accent-soft)", marginTop: 8, fontSize: 13 }}>✓ Chhaya updated your visual style memory.</p>}
              </div>
            </>
          )}

          {!result && !loading && !error && (
            <div className="output-block" style={{ color: "var(--text-muted)", textAlign: "center" }}>
              Your image concept prompt will appear here. Chhaya generates detailed prompts ready for Midjourney, DALL-E, or Stable Diffusion.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageWorkspacePage;
