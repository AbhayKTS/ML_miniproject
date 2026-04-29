import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const NAV = [
  { to: "/app", label: "📊 Overview", end: true },
  { to: "/app/prompts", label: "✨ Prompt Studio" },
  { to: "/app/generation", label: "🎬 Media Generation" },
  { to: "/export", label: "🚀 Publish" },
];

const Sidebar = () => {
  const { backendOnline, memory } = useApp();

  return (
    <aside className="sidebar">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: "var(--brand-gradient)",
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14, flexShrink: 0,
            fontWeight: 800
          }}>▶</div>
          <h1 className="gradient-text" style={{ fontSize: 17, letterSpacing: 1, fontWeight: 900 }}>CHHAYA Studio</h1>
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

      {/* Main Pipeline Nav */}
      <div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>STUDIO PIPELINE</p>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              {n.label}
            </NavLink>
          ))}
          {/* We added Settings as its own main nav option at the bottom */}
          <NavLink to="/app/settings">
            ⚙️ Settings
          </NavLink>
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
