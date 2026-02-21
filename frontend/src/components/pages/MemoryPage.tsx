import { useState, useEffect } from "react";
import SectionHeader from "../SectionHeader";
import { getMemory, updateMemory, CreativeMemory } from "../../api";
import { useApp } from "../../context/AppContext";

const TONES = ["warm visionary", "minimalist poetic", "energetic optimistic", "dark contemplative", "playful surreal"];
const VISUAL_STYLES = ["painterly neon", "concept art realism", "anime-inspired cinematic", "watercolour impressionist", "photorealistic digital"];
const AUDIO_STYLES = ["airy synth", "ambient strings", "modular textures", "acoustic warmth", "electronic beats"];
const CULTURAL_CONTEXTS = ["coastal ritual", "afro-futurist diaspora", "nordic myth remix", "east asian celestial", "latin american magical"];

const MemoryPage = () => {
  const { memory: ctxMemory, setMemory: setCtxMemory, backendOnline } = useApp();

  const [memory, setMemory] = useState<CreativeMemory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [tone, setTone] = useState("");
  const [themes, setThemes] = useState("");
  const [visual, setVisual] = useState("");
  const [audio, setAudio] = useState("");
  const [culture, setCulture] = useState("");
  const [locked, setLocked] = useState(false);

  const fetchMemory = async () => {
    setLoading(true);
    try {
      const m = await getMemory();
      applyMemory(m);
    } catch {
      if (ctxMemory) applyMemory(ctxMemory);
    } finally {
      setLoading(false);
    }
  };

  const applyMemory = (m: CreativeMemory) => {
    setMemory(m);
    setTone(m.tone);
    setThemes(m.themes.join(", "));
    setVisual(m.visualStyle);
    setAudio(m.audioStyle);
    setCulture(m.culturalContext);
    setLocked(m.lock);
  };

  useEffect(() => {
    fetchMemory();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const updated = await updateMemory({
        tone,
        themes: themes.split(",").map((t) => t.trim()).filter(Boolean),
        visualStyle: visual,
        audioStyle: audio,
        culturalContext: culture,
        lock: locked,
      });
      applyMemory(updated);
      setCtxMemory(updated);
      setSaved(true);
    } catch (err: any) {
      setError(err.message || "Failed to save. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    await fetchMemory();
    setSaved(false);
  };

  return (
    <div className="page">
      <SectionHeader
        title="Creative Memory"
        subtitle="Inspect, edit, and lock the style vectors that guide Chhaya's generation strategy across sessions."
      />

      {!backendOnline && (
        <div className="card" style={{ borderColor: "rgba(255,200,100,0.4)", marginBottom: 16 }}>
          <p style={{ color: "#ffd370", fontSize: 14 }}>
            ⚠ Backend offline — showing default memory. Start the backend to persist preferences.
          </p>
        </div>
      )}

      <div className="cards">
        {/* Style Vector */}
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3>Style Vector</h3>
            {memory && (
              <span style={{ fontSize: 12, opacity: 0.5 }}>
                Last updated: {new Date(memory.updatedAt).toLocaleString()}
              </span>
            )}
          </div>

          <div className="split">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="control-group">
                <label>Tone &amp; Voice</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} disabled={locked}>
                  {TONES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="control-group">
                <label>Visual Style</label>
                <select value={visual} onChange={(e) => setVisual(e.target.value)} disabled={locked}>
                  {VISUAL_STYLES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="control-group">
                <label>Audio Style</label>
                <select value={audio} onChange={(e) => setAudio(e.target.value)} disabled={locked}>
                  {AUDIO_STYLES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="control-group">
                <label>Cultural Context</label>
                <select value={culture} onChange={(e) => setCulture(e.target.value)} disabled={locked}>
                  {CULTURAL_CONTEXTS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="control-group">
                <label>Active Themes (comma-separated)</label>
                <input
                  type="text"
                  value={themes}
                  onChange={(e) => setThemes(e.target.value)}
                  placeholder="mythic futurism, coastal ritual, hopepunk"
                  disabled={locked}
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="panel" style={{ background: "rgba(0,0,0,0.25)" }}>
              <h4 style={{ opacity: 0.7, marginBottom: 12 }}>Live Preview</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>TONE</p>
                  <span className="tag">{tone || "—"}</span>
                </div>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>THEMES</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(themes || "—").split(",").map((t, i) => (
                      <span className="tag" key={i}>📖 {t.trim()}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>VISUAL</p>
                  <span className="tag">🖼 {visual || "—"}</span>
                </div>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>AUDIO</p>
                  <span className="tag">🎵 {audio || "—"}</span>
                </div>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>CULTURE</p>
                  <span className="tag">🌍 {culture || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lock & Save */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20, flexWrap: "wrap" }}>
            <div className="toggle-row">
              <input
                type="checkbox"
                id="lock-memory"
                checked={locked}
                onChange={(e) => setLocked(e.target.checked)}
              />
              <label htmlFor="lock-memory" style={{ cursor: "pointer" }}>
                🔒 Lock preferences (prevent auto-adaptation)
              </label>
            </div>

            <button
              className="button-primary"
              onClick={handleSave}
              disabled={saving || loading}
              style={{ marginLeft: "auto" }}
            >
              {saving ? "Saving…" : "Save memory profile"}
            </button>
            <button className="ghost-button" onClick={handleReset} disabled={loading}>
              Reset
            </button>
          </div>

          {error && <p style={{ color: "#ff9b9b", marginTop: 12, fontSize: 13 }}>⚠ {error}</p>}
          {saved && <p style={{ color: "var(--accent-soft)", marginTop: 12, fontSize: 13 }}>✓ Memory profile saved and active.</p>}
        </div>

        {/* How memory works */}
        <div className="card">
          <h3>How Creative Memory Works</h3>
          <ul style={{ color: "var(--text-muted)", marginTop: 12, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            <li>Every generation reads your current memory profile</li>
            <li>High ratings (4–5★) reinforce and deepen your current tone</li>
            <li>Edit submissions teach Chhaya your structural preferences</li>
            <li>Locking freezes all auto-adaptation signals</li>
            <li>Memory persists across sessions via the backend store</li>
          </ul>
        </div>

        {/* History placeholder */}
        <div className="card">
          <h3>Recent Themes Applied</h3>
          <ul style={{ color: "var(--text-muted)", marginTop: 8, paddingLeft: 18, fontSize: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            {(themes || "mythic futurism").split(",").map((t, i) => (
              <li key={i}>{t.trim()}</li>
            ))}
            <li style={{ opacity: 0.5 }}>Updated from feedback on last session</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemoryPage;
