import SectionHeader from "../SectionHeader";
import Timeline from "../Timeline";
import CaptionStyleSelector from "../CaptionStyleSelector";

const EditorPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Editor Workspace"
        subtitle="Fine-tune adaptive overlays, templates, and framing before finalizing your vision."
      />
      <div className="split">
        <div className="panel">
          <h3>Preview</h3>
          <div className="video-preview">Adaptive preview with safe zones</div>
          <Timeline />
        </div>
        <div className="panel" style={{ display: "grid", gap: 16 }}>
          <CaptionStyleSelector />
          <div className="panel" style={{ display: "grid", gap: 12 }}>
            <h3>Overlay Controls</h3>
            <label>Headline</label>
            <input type="text" placeholder="Enter headline to overlay on generation" />
            <label>Color + Font</label>
            <div style={{ display: "flex", gap: 12 }}>
              <select>
                <option>Outfit (Brand)</option>
                <option>Inter</option>
                <option>Space Grotesk</option>
              </select>
              <input type="color" defaultValue="#8c6bff" />
            </div>
            <label>Template</label>
            <select>
              <option>CHHAYA Adaptive</option>
              <option>Clean Aesthetic</option>
              <option>Minimalist Floating</option>
            </select>
            <label>Background Ambience</label>
            <div className="toggle-row">
              <input type="checkbox" defaultChecked />
              <span>Enable creative sync track</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
