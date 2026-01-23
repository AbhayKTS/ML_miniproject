import ControlSlider from "../ControlSlider";
import SectionHeader from "../SectionHeader";

const AudioWorkspacePage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Audio Workspace"
        subtitle="Design soundscapes with mood, tempo, and instrumentation presets."
      />
      <div className="split">
        <div className="panel controls">
          <div className="control-group">
            <label>Mood Selector</label>
            <select>
              <option>Dreamy ambience</option>
              <option>Uplifted cinematic</option>
              <option>Reflective minimal</option>
            </select>
          </div>
          <div className="control-group">
            <label>Tempo</label>
            <select>
              <option>72 BPM — slow tide</option>
              <option>96 BPM — steady pulse</option>
              <option>120 BPM — energized</option>
            </select>
          </div>
          <div className="control-group">
            <label>Instrumentation</label>
            <select>
              <option>Synth pads + hand percussion</option>
              <option>Ambient strings + flute</option>
              <option>Modular textures + vocal chops</option>
            </select>
          </div>
          <ControlSlider label="Atmospheric Density" value={68} />
          <ControlSlider label="Rhythmic Complexity" value={54} />
        </div>
        <div className="panel">
          <h3>Audio Prompt</h3>
          <div className="output-block" style={{ marginTop: 12 }}>
            Compose a dreamy coastal ambience at 72 BPM with airy synth pads,
            hand percussion, and gentle wave textures. Maintain a warm, reflective
            tone consistent with the narrative arc.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioWorkspacePage;
