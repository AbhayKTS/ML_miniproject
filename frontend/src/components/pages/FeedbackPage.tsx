import SectionHeader from "../SectionHeader";

const FeedbackPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Feedback Panel"
        subtitle="Guide Chhaya with explicit ratings and edit-based refinement."
      />
      <div className="cards">
        <div className="card">
          <h3>Rate this output</h3>
          <div style={{ fontSize: 24, marginTop: 12 }}>★★★★★</div>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
            Your ratings update tone alignment and pacing preferences.
          </p>
        </div>
        <div className="card">
          <h3>Improve</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
            Request a refinement with new constraints or cultural adjustments.
          </p>
          <button className="button-primary" style={{ marginTop: 12 }}>
            Regenerate with constraints
          </button>
        </div>
        <div className="card">
          <h3>Edit-based Adaptation</h3>
          <textarea
            rows={6}
            placeholder="Paste edits here to teach Chhaya your desired changes."
            style={{ marginTop: 12 }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
