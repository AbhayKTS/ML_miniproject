import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const NAV = [
  { to: "/app", label: "📊 Overview", end: true },
  { to: "/upload", label: "📤 Upload" },
  { to: "/processing", label: "⚙️ Processing" },
  { to: "/clips", label: "✂️ Clips" },
  { to: "/editor", label: "🎬 Editor" },
  { to: "/export", label: "📦 Export" },
];

const STUDIO_NAV = [
  { to: "/app/text", label: "✍️ Text" },
  { to: "/app/image", label: "🖼 Image" },
  { to: "/app/audio", label: "🎵 Audio" },
  { to: "/app/feedback", label: "⭐ Feedback" },
  { to: "/app/memory", label: "🧠 Memory" },
];

const Sidebar = () => {
  const { backendOnline, memory } = useApp();

  return (
    <aside className="sidebar">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14, flexShrink: 0
          }}>▶</div>
          <h1 style={{ fontSize: 17 }}>Chhaya Studio</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: backendOnline ? "#44d06f" : "#ff6b6b",
            display: "inline-block", flexShrink: 0
          }} />
          <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
            {backendOnline ? "backend online" : "backend offline"}
          </p>
        </div>
      </div>

      {/* Video pipeline nav */}
      <div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>VIDEO PIPELINE</p>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Creative studio nav */}
      <div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>CREATIVE STUDIO</p>
        <nav>
          {STUDIO_NAV.map((n) => (
            <NavLink key={n.to} to={n.to}>{n.label}</NavLink>
          ))}
        </nav>
      </div>

      {/* Memory widget */}
      {memory && (
        <div className="mini-card" style={{ textAlign: "left" }}>
          <p style={{ fontSize: 10, opacity: 0.5, marginBottom: 6, letterSpacing: 0.5 }}>ACTIVE MEMORY</p>
          <p style={{ fontSize: 12, fontWeight: 600 }}>{memory.tone}</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {memory.themes.slice(0, 2).join(", ")}
          </p>
          {memory.lock && <p style={{ fontSize: 11, color: "#ffd370", marginTop: 4 }}>🔒 Locked</p>}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
