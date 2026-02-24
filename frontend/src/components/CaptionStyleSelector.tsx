const CaptionStyleSelector = () => {
  return (
    <div className="panel" style={{ display: "grid", gap: 16 }}>
      <h3>Caption Style</h3>
      <p style={{ color: "var(--text-muted)", marginTop: 6 }}>Choose a caption look for this clip</p>
      <div className="cards">
        <div className="mini-card">Karaoke Glow</div>
        <div className="mini-card">Bold Contrast</div>
        <div className="mini-card">Emoji Pop</div>
        <div className="mini-card">Outlined Minimal</div>
      </div>
    </div>
  );
};

export default CaptionStyleSelector;
