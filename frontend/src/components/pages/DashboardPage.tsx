import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../SectionHeader";
import { checkHealth, getStats, DashboardStats } from "../../api";
import { useApp } from "../../context/AppContext";

interface StatCard { label: string; value: string; sub: string; color: string; }

const QUICK_LINKS = [
  { to: "/app/text", label: "✍️ Text Workspace", desc: "Co-create stories, scripts, and copy" },
  { to: "/app/image", label: "🖼 Image Workspace", desc: "Generate visual concept prompts" },
  { to: "/app/audio", label: "🎵 Audio Workspace", desc: "Design soundscapes and music prompts" },
  { to: "/upload", label: "📤 Upload Video", desc: "Upload long-form video for highlight clipping" },
  { to: "/app/feedback", label: "⭐ Feedback", desc: "Rate & refine last generation" },
  { to: "/app/memory", label: "🧠 Creative Memory", desc: "Inspect and edit style vectors" },
];

const DashboardPage = () => {
  const { backendOnline, memory } = useApp();
  const [serverInfo, setServerInfo] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    checkHealth()
      .then((h) => setServerInfo(`${h.service} · online`))
      .catch(() => setServerInfo("backend · offline"));
    
    getStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const statsCards: StatCard[] = stats ? [
    { label: "Creative Sessions", value: String(stats.creativeSessions), sub: `text: ${stats.textGenerations} · image: ${stats.imageGenerations} · audio: ${stats.audioGenerations}`, color: "var(--accent)" },
    { label: "Feedback Loops", value: String(stats.feedbackLoops), sub: "ratings + edits captured", color: "var(--accent-2)" },
    { label: "Clips Generated", value: String(stats.clipsGenerated), sub: `from ${stats.videosUploaded} videos`, color: "var(--accent-3)" },
    { label: "Collaboration Index", value: stats.collaborationIndex, sub: "User-engine synergy", color: "#ff9b9b" },
  ] : [
    { label: "Creative Sessions", value: "—", sub: "loading...", color: "var(--accent)" },
    { label: "Feedback Loops", value: "—", sub: "loading...", color: "var(--accent-2)" },
    { label: "Clips Generated", value: "—", sub: "loading...", color: "var(--accent-3)" },
    { label: "Collaboration Index", value: "—", sub: "loading...", color: "#ff9b9b" },
  ];

  return (
    <div className="page">
      <SectionHeader
        title="Welcome back, Creator."
        subtitle="Chhaya is ready to co-create. Choose a workspace or upload a video to get started."
      />
      <p style={{ color: "var(--text-muted)", marginTop: 8, marginBottom: 16, fontSize: 14 }}>Your creative session continues where you left off.</p>

      {/* Backend status badge */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <span
          className="tag"
          style={{
            background: backendOnline ? "rgba(68,208,100,0.15)" : "rgba(255,100,100,0.15)",
            borderColor: backendOnline ? "rgba(68,208,100,0.4)" : "rgba(255,100,100,0.4)",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: backendOnline ? "#44d06f" : "#ff6b6b", display: "inline-block", marginRight: 6 }} />
          {serverInfo || "connecting…"}
        </span>
      </div>

      {/* Stat cards */}
      <div className="cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {statsCards.map((s) => (
          <div className="card" key={s.label}>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color, margin: "4px 0" }}>{s.value}</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Creative Memory snapshot */}
      {memory && (
        <div className="card" style={{ background: "linear-gradient(135deg, rgba(140,107,255,0.12), rgba(68,208,255,0.08))", borderColor: "rgba(140,107,255,0.2)" }}>
          <h3 style={{ marginBottom: 12 }}>🧠 Active Creative Memory</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="tag">🎨 {memory.tone}</span>
            {memory.themes.map((t) => <span className="tag" key={t}>📖 {t}</span>)}
            <span className="tag">🖼 {memory.visualStyle}</span>
            <span className="tag">🎵 {memory.audioStyle}</span>
            <span className="tag">🌍 {memory.culturalContext}</span>
            {memory.lock && <span className="tag" style={{ background: "rgba(255,211,112,0.15)", borderColor: "rgba(255,211,112,0.4)" }}>🔒 Locked</span>}
          </div>
          <Link to="/app/memory" className="ghost-button" style={{ marginTop: 14, display: "inline-block" }}>
            Edit memory profile →
          </Link>
        </div>
      )}

      {/* Quick-link grid */}
      <h3 style={{ marginTop: 8, marginBottom: -8 }}>Workspaces</h3>
      <div className="cards">
        {QUICK_LINKS.map((link) => (
          <Link key={link.to} to={link.to} style={{ textDecoration: "none" }}>
            <div className="card dashboard-quick-card">
              <h3>{link.label}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 6 }}>{link.desc}</p>
              <span className="tag" style={{ marginTop: 12 }}>Open →</span>
            </div>
          </Link>
        ))}
      </div>

      <h3 style={{ marginTop: 12, marginBottom: -8 }}>Viral Trends</h3>
      <div className="cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div className="card" style={{ background: "rgba(255,100,200,0.05)" }}>
          <h4>🎻 Bheegi Bheegi Raaton Mein</h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Kishore Kumar Digital Restoration is trending. High nostalgia factor.</p>
          <div className="progress-bar" style={{ marginTop: 10 }}><div className="progress" style={{ width: "95%", background: "var(--brand-gradient)" }} /></div>
        </div>
        <div className="card" style={{ background: "rgba(100,200,255,0.05)" }}>
          <h4>💃 Havana Sunset Mix</h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Tropical adaptive adaptation is peaking. Perfect for vertical shorts.</p>
          <div className="progress-bar" style={{ marginTop: 10 }}><div className="progress" style={{ width: "88%", background: "var(--brand-gradient)" }} /></div>
        </div>
        <div className="card" style={{ background: "rgba(255,200,100,0.05)" }}>
          <h4>🏰 Fairytale Folklore</h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Alexander Rybak's vibe has been reimagined for the Solarpunk theme.</p>
          <div className="progress-bar" style={{ marginTop: 10 }}><div className="progress" style={{ width: "82%", background: "var(--brand-gradient)" }} /></div>
        </div>
        <div className="card" style={{ background: "rgba(200,100,255,0.05)" }}>
          <h4>🔥 Nobody Came - Dhanda Nyoliwala</h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Haryana-to-Global creative flow. Style morphing in progress.</p>
          <div className="progress-bar" style={{ marginTop: 10 }}><div className="progress" style={{ width: "96%", background: "var(--brand-gradient)" }} /></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
