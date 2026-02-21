import { useState, useEffect } from "react";
import SectionHeader from "../SectionHeader";
import ProgressList from "../ProgressList";
import { useNavigate } from "react-router-dom";

interface PipelineStage {
  label: string;
  value: number;
  note?: string;
}

const INITIAL_STAGES: PipelineStage[] = [
  { label: "Scene detection", value: 0 },
  { label: "Speaker activity analysis", value: 0 },
  { label: "Emotion scoring", value: 0 },
  { label: "Highlight extraction", value: 0 },
  { label: "Silence removal", value: 0 },
  { label: "Caption generation", value: 0 },
];

const LIVE_NOTES = [
  "Scanning for high-energy segments…",
  "Detected speech activity in 3 audio tracks.",
  "Emotion scoring: excitement peaks at t=00:42.",
  "Auto-crop framing to 9:16 portrait applied.",
  "Silence removal: ~14% runtime saved.",
  "Preparing 5 highlight clips (18–42 seconds each).",
  "Karaoke-style captions ready for clip #1.",
  "All 5 clips staged for review. ✓",
];

const ProcessingPage = () => {
  const navigate = useNavigate();
  const [stages, setStages] = useState(INITIAL_STAGES);
  const [notes, setNotes] = useState<string[]>([LIVE_NOTES[0]]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [tick, setTick] = useState(0);

  const startSimulation = () => {
    setRunning(true);
    setDone(false);
    setStages(INITIAL_STAGES);
    setNotes([LIVE_NOTES[0]]);
    setTick(0);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTick((t) => {
        const next = t + 1;
        setStages((prev) =>
          prev.map((s, i) => ({
            ...s,
            value: Math.min(100, i * 17 <= next * 10 ? Math.min(100, (next - i * 1.7) * 15) : 0),
          }))
        );
        if (next % 8 === 0 && next / 8 < LIVE_NOTES.length) {
          setNotes((n) => [...n, LIVE_NOTES[Math.floor(next / 8)]]);
        }
        if (next >= 70) {
          clearInterval(id);
          setRunning(false);
          setDone(true);
          setStages(INITIAL_STAGES.map((s) => ({ ...s, value: 100 })));
          setNotes(LIVE_NOTES.slice(0, 8));
        }
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="page">
      <SectionHeader
        title="Processing Pipeline"
        subtitle="Chhaya is detecting highlights, removing silence, and generating captions in real-time."
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button className="button-primary" onClick={startSimulation} disabled={running}>
          {running ? "⚙️ Processing…" : done ? "🔄 Re-run pipeline" : "▶ Start Pipeline"}
        </button>
        {done && (
          <button className="button-primary" onClick={() => navigate("/clips")}>
            View Clips →
          </button>
        )}
      </div>

      <div className="split">
        <div className="panel">
          <h3>Pipeline Stages</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 14 }}>
            Estimated time: 3–6 minutes depending on video length.
          </p>
          <ProgressList
            items={stages.map((s) => ({ label: s.label, value: Math.round(s.value) }))}
          />
          {done && (
            <div style={{ marginTop: 16 }}>
              <span className="tag" style={{ background: "rgba(68,208,100,0.12)", borderColor: "rgba(68,208,100,0.35)" }}>
                ✓ Pipeline complete
              </span>
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Live Notes</h3>
          <ul style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, paddingLeft: 18 }}>
            {notes.map((n, i) => (
              <li key={i} style={{ color: i === notes.length - 1 ? "var(--text-primary)" : "var(--text-muted)", fontSize: 14, transition: "color 0.3s" }}>
                {n}
              </li>
            ))}
          </ul>

          {running && (
            <div className="processing-pulse" style={{ marginTop: 20 }}>
              <div className="pulse-dot" />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Processing…</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
