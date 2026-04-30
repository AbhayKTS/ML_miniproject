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
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ 
          fontSize: 22, 
          background: 'linear-gradient(45deg, var(--accent), var(--accent-hover))', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          marginBottom: 4
        }}>
          Chhaya Studio
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
          <div className={`status-indicator ${backendOnline ? "online" : "offline"}`} />
          {backendOnline ? "Engine Connected" : "Local Mode"}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.end}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
              {item.desc && <span style={{ display: "block", fontSize: 11, opacity: 0.6, marginLeft: 26, marginTop: 2 }}>{item.desc}</span>}
            </NavLink>
          ))}
        </nav>

        <div>
          <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 12, marginLeft: 12 }}>
            Creative Suite
          </h4>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {STUDIO_NAV.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="avatar">
            U
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>User Profile</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {memory?.visualStyle ? memory.visualStyle.split(" ")[0] : "New"} Creator
            </div>
          </div>
        </div>
        <button className="button-ghost" onClick={handleSignOut} style={{ width: "100%", justifyContent: "center" }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
