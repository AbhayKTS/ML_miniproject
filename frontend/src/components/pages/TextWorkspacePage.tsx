import ControlSlider from "../ControlSlider";
import SectionHeader from "../SectionHeader";

const TextWorkspacePage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Text Workspace"
        subtitle="Guide narrative structure, tone, cultural context, and originality."
      />
      <div className="split">
        <div className="panel controls">
          <div className="control-group">
            <label>Creative Brief</label>
            <textarea
              rows={5}
              placeholder="Describe the story, campaign, or script Chhaya should co-create."
            />
          </div>
          <div className="control-group">
            <label>Theme Selector</label>
            <select>
              <option>Mythic futurism</option>
              <option>Urban folklore</option>
              <option>Hopepunk discovery</option>
            </select>
          </div>
          <div className="control-group">
            <label>Tone & Voice</label>
            <select>
              <option>Warm visionary</option>
              <option>Minimalist poetic</option>
              <option>Energetic optimistic</option>
            </select>
          </div>
          <div className="control-group">
            <label>Cultural Context</label>
            <select>
              <option>South Asian coastal</option>
              <option>Afro-futurist diaspora</option>
              <option>Nordic myth remix</option>
            </select>
          </div>
          <ControlSlider label="Originality vs Consistency" value={72} />
          <ControlSlider label="Structural Complexity" value={58} />
          <ControlSlider label="Multi-step refinement" value={84} />
        </div>
        <div className="panel">
          <h3>Generated Draft</h3>
          <div className="output-block" style={{ marginTop: 12 }}>
            The harbor glows with layered lanterns as the tide breathes in. Chhaya
            frames the opening scene with reflective cadence, threading a hopeful
            arc across each paragraph while keeping the mythic motif intact. The
            protagonist’s voice stays warm, grounded in coastal ritual and future
            tech woven through whispered folklore.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextWorkspacePage;
