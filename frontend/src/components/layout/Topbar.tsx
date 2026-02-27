import { useApp } from "../../context/AppContext";

const Topbar = () => {
  const { memory } = useApp();

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, opacity: 0.9 }}>
          CHHAYA · <span style={{ opacity: 0.6 }}>Adaptive Intelligence</span>
        </h2>
        <div className="ai-pulse-dot" title="Chhaya engine is active" />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span className="tag">Creative sync: Active</span>
        <span className="tag" style={{ background: "rgba(255, 211, 112, 0.2)", borderColor: "rgba(255, 211, 112, 0.35)" }}>
          Tone: {memory?.tone || "Warm visionary"}
        </span>
      </div>
    </header>
  );
};

export default Topbar;
