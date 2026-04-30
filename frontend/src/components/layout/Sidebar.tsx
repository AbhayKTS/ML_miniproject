import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { signOut } from "../../firebase";

const NAV = [
  { to: "/app", label: "📊 Overview", end: true },
  { to: "/upload", label: "🎞️ Source", desc: "Upload long-form" },
  { to: "/processing", label: "🧬 Analysis" },
  { to: "/clips", label: "🎬 Generation" },
  { to: "/editor", label: "✨ Polishing" },
  { to: "/export", label: "🚀 Publish" },
];

const STUDIO_NAV = [
  { to: "/app/text", label: "📜 Scripting" },
  { to: "/app/image", label: "🌉 Visuals" },
  { to: "/app/audio", label: "🎼 Scoring" },
  { to: "/app/feedback", label: "💎 Refine" },
  { to: "/app/memory", label: "🧠 Mindset" },
];

const Sidebar = () => {
  const { backendOnline, memory, logout } = useApp();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem("chhaya_token");
      logout();
      navigate("/login");
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };

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

      <div style={{ marginTop: "auto", paddingTop: "20px" }}>
        <button 
          onClick={handleSignOut}
          style={{ width: "100%", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", padding: "8px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", transition: "all 0.2s" }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
