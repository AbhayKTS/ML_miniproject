const Topbar = () => {
  return (
    <header className="topbar">
      <div>
  <strong>Chhaya: Your Creative Shadow</strong>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span className="tag">Creative sync: Active</span>
        <span className="tag" style={{ background: "rgba(255, 211, 112, 0.2)", borderColor: "rgba(255, 211, 112, 0.35)" }}>
          Tone: Warm visionary
        </span>
      </div>
    </header>
  );
};

export default Topbar;
