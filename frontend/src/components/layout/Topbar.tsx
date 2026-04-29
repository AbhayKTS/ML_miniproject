import { useApp } from "../../context/AppContext";
import { Link } from "react-router-dom";

const Topbar = () => {
  const { memory } = useApp();

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, opacity: 0.9 }}>
          CHHAYA · <span style={{ opacity: 0.6 }}>Adaptive Studio</span>
        </h2>
        <div className="smart-pulse-dot" title="Chhaya engine is active" />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link
          to="/"
          className="tag"
          style={{
            textDecoration: "none",
            cursor: "pointer",
            background: "rgba(255,255,255,0.08)",
            color: "var(--text-primary)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
        >
          🏠 Return Home
        </Link>
        <span className="tag">Creative sync: Active</span>
        <span className="tag" style={{ background: "rgba(255, 211, 112, 0.2)", borderColor: "rgba(255, 211, 112, 0.35)" }}>
          Tone: {memory?.tone || "Warm visionary"}
        </span>
      </div>
    </header>
  );
};

export default Topbar;
