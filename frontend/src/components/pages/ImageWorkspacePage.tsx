import ControlSlider from "../ControlSlider";
import SectionHeader from "../SectionHeader";

const ImageWorkspacePage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Image Workspace"
        subtitle="Align imagery with your style library, references, and cultural filters."
      />
      <div className="split">
        <div className="panel controls">
          <div className="control-group">
            <label>Style Library</label>
            <select>
              <option>Painterly neon</option>
              <option>Concept art realism</option>
              <option>Anime-inspired cinematic</option>
            </select>
          </div>
          <div className="control-group">
            <label>Cultural Filters</label>
            <select>
              <option>Coastal temple motifs</option>
              <option>Desert market patterns</option>
              <option>Nordic aurora palettes</option>
            </select>
          </div>
          <div className="control-group">
            <label>Reference Image</label>
            <input type="file" />
          </div>
          <ControlSlider label="Variation Generator" value={64} />
          <ControlSlider label="Texture Fidelity" value={70} />
          <ControlSlider label="Color Harmony" value={82} />
        </div>
        <div className="panel">
          <h3>Image Concept Preview</h3>
          <div className="output-block" style={{ marginTop: 12 }}>
            Image output placeholder — layered shoreline, luminous festival lanterns,
            soft painterly strokes with cinematic lighting.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageWorkspacePage;
