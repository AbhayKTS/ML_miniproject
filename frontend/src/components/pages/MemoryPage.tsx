import SectionHeader from "../SectionHeader";

const MemoryPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Creative Memory"
        subtitle="Inspect and lock the style vectors guiding Chhaya's output."
      />
      <div className="cards">
        <div className="card">
          <h3>Style Vector</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
            Narrative arc: hopeful mythic · Visual palette: neon painterly · Audio:
            airy synth
          </p>
          <div style={{ marginTop: 12 }}>
            <span className="tag">Locked preferences</span>
          </div>
        </div>
        <div className="card">
          <h3>Recent Themes</h3>
          <ul style={{ color: "var(--text-muted)", marginTop: 8, paddingLeft: 18 }}>
            <li>Harbor rituals and lunar festivals</li>
            <li>Coastal myth + future tech</li>
            <li>Reflective, hopeful narration</li>
          </ul>
        </div>
        <div className="card">
          <h3>Modify Preferences</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
            Adjust tonal lock-ins or unlock areas for experimentation.
          </p>
          <button className="button-primary" style={{ marginTop: 12 }}>
            Edit memory profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryPage;
