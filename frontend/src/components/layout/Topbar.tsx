import { useApp } from "../../context/AppContext";

const Topbar = () => {
  const { memory } = useApp();

  return (
    <header className="topbar">
      <div>
        <strong>CHHAYA · Adaptive Intelligence</strong>
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
