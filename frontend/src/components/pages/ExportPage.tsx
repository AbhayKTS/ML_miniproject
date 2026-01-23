import SectionHeader from "../SectionHeader";

const ExportPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Export & Publish"
        subtitle="Choose format, resolution, and download your final clip."
      />
      <div className="split">
        <div className="panel controls">
          <div className="control-group">
            <label>Format</label>
            <select>
              <option>MP4</option>
              <option>WEBM</option>
            </select>
          </div>
          <div className="control-group">
            <label>Aspect Ratio</label>
            <select>
              <option>9:16 (Shorts)</option>
              <option>1:1 (Square)</option>
              <option>16:9 (Landscape)</option>
            </select>
          </div>
          <div className="control-group">
            <label>Resolution</label>
            <select>
              <option>1080p</option>
              <option>720p</option>
            </select>
          </div>
          <button className="button-primary">Export clip</button>
        </div>
        <div className="panel">
          <h3>Export History</h3>
          <ul style={{ marginTop: 12, color: "var(--text-muted)", paddingLeft: 18 }}>
            <li>clip_viral_hook_01.mp4 — ready</li>
            <li>clip_key_insight_02.mp4 — rendering</li>
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
