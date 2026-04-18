import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { signOut } from "../../firebase";

const NAV = [
  { to: "/app", label: "📊 Overview", end: true },
  { to: "/app/prompts", label: "✨ Prompt Studio" },
  { to: "/app/generation", label: "🎬 Media Generation" },
  { to: "/export", label: "🚀 Publish" },
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

<<<<<<< HEAD
      {/* Main Pipeline Nav */}
      <div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>STUDIO PIPELINE</p>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              {n.label}
=======
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
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
            </NavLink>
          ))}
          {/* We added Settings as its own main nav option at the bottom */}
          <NavLink to="/app/settings">
            ⚙️ Settings
          </NavLink>
        </nav>

<<<<<<< HEAD

      {/* Memory widget */}
      {memory && (
        <div className="mini-card" style={{ textAlign: "left" }}>
          <p style={{ fontSize: 10, opacity: 0.5, marginBottom: 6, letterSpacing: 0.5 }}>ACTIVE MEMORY</p>
          <p style={{ fontSize: 12, fontWeight: 600 }}>{memory.tone}</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {memory.themes.slice(0, 2).join(", ")}
          </p>
          {memory.lock && <p style={{ fontSize: 11, color: "#ffd370", marginTop: 4 }}>🔒 Locked</p>}
=======
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
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
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
import React from 'react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Generate', path: '/generate' },
  { label: 'Projects', path: '/projects' },
  { label: 'Memory', path: '/memory' },
  { label: 'Analytics', path: '/analytics' },
];

export const Sidebar: React.FC = () => (
  <aside className="sidebar">
    <div className="logo">Chhaya AI</div>
    <nav>
      {NAV_ITEMS.map(item => (
        <a key={item.path} href={item.path}>{item.label}</a>
      ))}
    </nav>
  </aside>
);
