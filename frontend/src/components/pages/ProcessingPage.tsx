import { useState, useEffect } from "react";
import SectionHeader from "../SectionHeader";
import ProgressList from "../ProgressList";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipWithDetails, getClips } from "../../api";

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
  { label: "Quality check", value: 0 },
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
  const location = useLocation();
  const [stages, setStages] = useState(INITIAL_STAGES);
  const [notes, setNotes] = useState<string[]>([LIVE_NOTES[0]]);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const [tick, setTick] = useState(0);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisClips, setAnalysisClips] = useState<ClipWithDetails[]>([]);

  const activeVideoId = location.state?.videoId || localStorage.getItem("chhaya_active_video_id") || "";

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setAnalysisLoading(true);
        const clips = await getClips(activeVideoId || undefined);
        setAnalysisClips(clips);

        if (clips.length > 0) {
          const longestClip = [...clips].sort(
            (a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime)
          )[0];

          setStages([
            { label: "Scene detection", value: 100, note: `${clips.length} highlight segments mapped` },
            { label: "Speaker activity analysis", value: 100, note: "Speech regions isolated" },
            { label: "Emotion scoring", value: 100, note: "Peak moments prioritized" },
            { label: "Highlight extraction", value: 100, note: `${clips.length} clips prepared` },
            { label: "Silence removal", value: 100, note: "Quiet gaps trimmed" },
            { label: "Caption generation", value: 100, note: "Ready for caption styling" },
            { label: "Quality check", value: 100, note: `Longest clip ${longestClip.duration}` },
          ]);

          setNotes([
            activeVideoId
              ? `Analysis complete for video ${activeVideoId.slice(0, 8)}…`
              : "Analysis complete for the latest processed source.",
            `${clips.length} highlight clips were generated automatically.`,
            `Primary opener: ${clips[0].title} (${clips[0].duration}).`,
            longestClip ? `Longest retained moment: ${longestClip.title} (${longestClip.duration}).` : "All clips normalized for short-form review.",
            "Clips are ready to preview, caption, and send into the editor."
          ]);
          setRunning(false);
          setDone(true);
        } else {
          setRunning(false);
          setDone(false);
          setNotes(["Analysis has not produced clips yet. Generate clips from the Source page first."]);
        }

        setAnalysisError(null);
      } catch (error) {
        setAnalysisError(error instanceof Error ? error.message : "Failed to load analysis results");
        setRunning(false);
        setDone(false);
      } finally {
        setAnalysisLoading(false);
      }
    };

    fetchAnalysis();
  }, [activeVideoId]);

  useEffect(() => {
    if (!running || activeVideoId) return;
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
  }, [running, activeVideoId]);

  const handleReset = () => {
    if (activeVideoId) {
      window.location.reload();
      return;
    }

    setDone(false);
    setStages(INITIAL_STAGES);
    setTick(0);
    setNotes([LIVE_NOTES[0]]);
    setRunning(true);
  };

  return (
    <div className="page">
      <SectionHeader
        title="Processing Pipeline"
        subtitle="Chhaya is detecting highlights, removing silence, and generating captions in real-time."
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button className="button-primary" onClick={handleReset} disabled={running}>
          {running ? "⚙️ Processing…" : done ? (activeVideoId ? "🔄 Refresh Analysis" : "🔄 Re-run pipeline") : "▶ Start Pipeline"}
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
            {analysisLoading
              ? "Loading the latest analysis results…"
              : activeVideoId
                ? "Your latest analysis is shown below once clip generation completes."
                : "Estimated time: 3–6 minutes depending on video length."}
          </p>
          <ProgressList
            items={stages.map((s) => ({ label: s.label, value: Math.round(s.value) }))}
          />
          {analysisError && (
            <div style={{ color: "#ff9b9b", marginTop: 14 }}>
              ⚠ {analysisError}
            </div>
          )}
          {done && (
            <div style={{ marginTop: 16 }}>
              <span className="tag" style={{ background: "rgba(68,208,100,0.12)", borderColor: "rgba(68,208,100,0.35)" }}>
                ✓ Pipeline complete
              </span>
            </div>
          )}
        </div>

        <div className="panel">
          <h3>{activeVideoId ? "Analysis Summary" : "Live Notes"}</h3>
          <ul style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, paddingLeft: 18 }}>
            {notes.map((n, i) => (
              <li key={i} style={{ color: i === notes.length - 1 ? "var(--text-primary)" : "var(--text-muted)", fontSize: 14, transition: "color 0.3s" }}>
                {n}
              </li>
            ))}
          </ul>

          {analysisClips.length > 0 && (
            <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
              {analysisClips.map((clip) => (
                <div
                  key={clip.id}
                  className="card"
                  style={{ padding: 12, border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <strong style={{ fontSize: 14 }}>{clip.title}</strong>
                    <span className="tag">{clip.duration}</span>
                  </div>
                  <p style={{ marginTop: 8, color: "var(--text-muted)", fontSize: 13 }}>
                    Segment: {clip.startTime}s → {clip.endTime}s · Status: {clip.status}
                  </p>
                </div>
              ))}
            </div>
          )}

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
