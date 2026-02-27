import { useState, useEffect } from "react";
import SectionHeader from "../SectionHeader";
import ControlSlider from "../ControlSlider";
import { generateAudio, submitFeedback, Generation } from "../../api";
import { useApp } from "../../context/AppContext";
import { useLocation } from "react-router-dom";

const MOODS = ["Romantic Latin", "Tropical party", "Dreamy ambience", "Uplifted cinematic", "Reflective minimal", "Tense dramatic", "Joyful playful"];
const TEMPOS = ["60 BPM — meditative", "72 BPM — slow tide", "96 BPM — steady pulse", "120 BPM — energized", "140 BPM — intense"];
const INSTRUMENTATION = [
  "Classical guitar + Shakers",
  "Reggaeton beats + Bass",
  "Synth pads + hand percussion",
  "Ambient strings + flute",
  "Modular textures + vocal chops",
];

const AudioWorkspacePage = () => {
  const { memory, setLastGeneration, refreshMemory } = useApp();
  const location = useLocation();
  const visionFromLanding = location.state?.vision;

  const [prompt, setPrompt] = useState(visionFromLanding || "");
  const [mood, setMood] = useState(memory?.audioStyle || MOODS[0]);
  const [tempo, setTempo] = useState(TEMPOS[1]);
  const [instrument, setInstrument] = useState(INSTRUMENTATION[0]);
  const [density, setDensity] = useState(68);
  const [rhythmic, setRhythmic] = useState(54);
  const [culturalBlend, setCulturalBlend] = useState(60);

  useEffect(() => {
    if (visionFromLanding) {
      setPrompt(visionFromLanding);
    }
  }, [visionFromLanding]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Generation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Simulated playback
  const [playing, setPlaying] = useState(false);
  const [playPosition, setPlayPosition] = useState(0);

  const effectivePrompt = prompt || `Compose a ${mood.toLowerCase()} soundscape with ${instrument}`;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFeedbackSent(false);
    setRating(0);
    setPlaying(false);
    setPlayPosition(0);
    try {
      const gen = await generateAudio(
        effectivePrompt,
        {
          mood: mood.toLowerCase(),
          tempo,
          instrumentation: instrument,
          originality: density,
          complexity: rhythmic,
        },
        [`cultural blend: ${culturalBlend}%`, `instrumentation: ${instrument}`]
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
      await submitFeedback({ generationId: result.id, rating: r });
      setFeedbackSent(true);
      await refreshMemory();
    } catch { /* ignore */ }
  };

  const togglePlay = () => {
    if (!result) return;
    const newPlaying = !playing;
    setPlaying(newPlaying);
    console.log(newPlaying ? "Playback started" : "Playback paused");
    // Simulate playhead advancement
    if (newPlaying) {
      let pos = playPosition;
      const interval = setInterval(() => {
        pos += 1;
        setPlayPosition(pos);
        if (pos >= 100) { clearInterval(interval); setPlaying(false); setPlayPosition(0); }
      }, 120);
    }
  };

  return (
    <div className="page">
      <SectionHeader
        title="Audio Workspace"
        subtitle="Design adaptive soundscapes with mood, tempo, and cultural instrumentation presets."
      />

      <div className="split">
        <div className="panel controls">
          <div className="control-group">
            <label>Audio Brief (optional)</label>
            <textarea
              rows={3}
              placeholder="Describe the scene or emotion you want to score…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>Mood</label>
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              {MOODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Tempo</label>
            <select value={tempo} onChange={(e) => setTempo(e.target.value)}>
              {TEMPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Instrumentation</label>
            <select value={instrument} onChange={(e) => setInstrument(e.target.value)}>
              {INSTRUMENTATION.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
          <ControlSlider label="Atmospheric Density" value={density} onChange={setDensity} />
          <ControlSlider label="Rhythmic Complexity" value={rhythmic} onChange={setRhythmic} />
          <ControlSlider label="Cultural Blend" value={culturalBlend} onChange={setCulturalBlend} />

          <button
            className="button-primary"
            style={{ width: "100%", marginTop: 8 }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "🎵 Composing…" : "🎵 Generate Audio Prompt"}
          </button>
        </div>

        <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3>Audio Prompt &amp; Playback</h3>

          {error && (
            <div className="output-block" style={{ borderColor: "rgba(255,100,100,0.4)", color: "#ff9b9b" }}>
              ⚠ {error}
            </div>
          )}

          {loading && (
            <div className="output-block text-loading">
              <div className="audio-wave-placeholder">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="wave-bar" style={{ height: `${20 + Math.sin(i * 0.8) * 20 + Math.random() * 20}px` }} />
                ))}
              </div>
              <div className="loading-shimmer" />
              <div className="loading-shimmer" style={{ width: "80%" }} />
            </div>
          )}

          {result && !loading && (
            <>
              {/* Simulated Waveform player */}
              <div className="audio-player">
                <button className="audio-play-btn" onClick={togglePlay}>
                  {playing ? "⏸" : "▶"}
                </button>
                <div className="audio-waveform">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className={`wave-bar${i / 40 * 100 <= playPosition ? " wave-bar--active" : ""}`}
                      style={{ height: `${15 + Math.abs(Math.sin(i * 0.6)) * 30 + (i % 4 === 0 ? 15 : 0)}px` }}
                    />
                  ))}
                </div>
                <span className="audio-time">
                  {Math.floor(playPosition * 0.6)}s / 60s
                </span>
              </div>

              <div className="output-block" style={{ whiteSpace: "pre-wrap" }}>
                🎵 <strong>Prompt for your DAW or AI music tool:</strong>
                {"\n\n"}{result.output}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="tag">🎼 {mood}</span>
                <span className="tag">🥁 {tempo}</span>
                <span className="tag">🎸 {instrument.split("+")[0].trim()}</span>
              </div>

              <div className="card">
                <h4 style={{ marginBottom: 8 }}>Rate this composition prompt</h4>
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
                {feedbackSent && <p style={{ color: "var(--accent-soft)", marginTop: 8, fontSize: 13 }}>✓ Audio style preference updated.</p>}
              </div>
            </>
          )}

          {!result && !loading && !error && (
            <div className="output-block" style={{ color: "var(--text-muted)", textAlign: "center" }}>
              Your audio prompt will appear here — ready to paste into Suno, Udio, or your DAW.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioWorkspacePage;
