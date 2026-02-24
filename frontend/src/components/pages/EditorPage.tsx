import SectionHeader from "../SectionHeader";
import Timeline from "../Timeline";
import CaptionStyleSelector from "../CaptionStyleSelector";

const EditorPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Editor Workspace"
        subtitle="Fine-tune captions, overlays, templates, and framing before export."
      />
      <div className="split">
        <div className="panel">
          <h3>Preview</h3>
          <div className="video-preview">Video preview with safe zones</div>
          <Timeline />
        </div>
        <div className="panel" style={{ display: "grid", gap: 16 }}>
          <CaptionStyleSelector />
          <div className="panel" style={{ display: "grid", gap: 12 }}>
            <h3>Overlay Controls</h3>
            <label>Headline</label>
            <input type="text" placeholder="Enter headline to overlay on clip" />
            <label>Color + Font</label>
            <div style={{ display: "flex", gap: 12 }}>
              <select>
                <option>Inter Bold</option>
                <option>Montserrat SemiBold</option>
                <option>Space Grotesk</option>
              </select>
              <input type="color" defaultValue="#8c6bff" />
            </div>
            <label>Template</label>
            <select>
              <option>QuickReel Viral</option>
              <option>Clean Podcast</option>
              <option>Minimal Caption</option>
            </select>
            <label>Background Audio</label>
            <div className="toggle-row">
              <input type="checkbox" defaultChecked />
              <span>Enable ambient track</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
