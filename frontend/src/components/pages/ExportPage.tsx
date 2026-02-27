import SectionHeader from "../SectionHeader";

const ExportPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Export & Publish"
        subtitle="Finalize your creative asset and download the high-fidelity render."
      />
      <div className="split">
        <div className="panel controls">
          <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 13 }}>Customize your generation before downloading</p>
          <div className="control-group">
            <label>Format</label>
            <select>
              <option>MP4 (Video)</option>
              <option>PNG/JPG (Image)</option>
              <option>WAV/MP3 (Audio)</option>
              <option>TXT (Draft)</option>
            </select>
          </div>
          <div className="control-group">
            <label>Canvas / Layout</label>
            <select>
              <option>Shorts (9:16)</option>
              <option>Social (1:1)</option>
              <option>Cinematic (16:9)</option>
            </select>
          </div>
          <div className="control-group">
            <label>Quality</label>
            <select>
              <option>High Fidelity (1080p+)</option>
              <option>Standard (720p)</option>
              <option>Draft (480p)</option>
            </select>
          </div>
          <button className="button-primary">Finalize &amp; Export</button>
        </div>
        <div className="panel">
          <h3>Generation History</h3>
          <ul style={{ marginTop: 12, color: "var(--text-muted)", paddingLeft: 18 }}>
            <li>chhaya_story_01.mp4 — ready</li>
            <li>chhaya_visual_concept_02.png — ready</li>
            <li>chhaya_audio_track_03.wav — rendering</li>
          </ul>
          <button className="ghost-button" style={{ marginTop: 16 }}>
            Download last export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
