import SectionHeader from "../SectionHeader";
import ProgressList from "../ProgressList";

const ProcessingPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Processing Pipeline"
        subtitle="Chhaya is detecting highlights, removing silence, and generating captions."
      />
      <div className="split">
        <div className="panel">
          <h3>Pipeline Stages</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
            Estimated time: 3-6 minutes depending on video length.
          </p>
          <ProgressList
            items={[
              { label: "Scene detection", value: 100 },
              { label: "Speaker activity", value: 84 },
              { label: "Emotion scoring", value: 72 },
              { label: "Clip extraction", value: 56 },
              { label: "Captioning", value: 42 }
            ]}
          />
        </div>
        <div className="panel">
          <h3>Live Notes</h3>
          <ul style={{ marginTop: 12, color: "var(--text-muted)", paddingLeft: 18 }}>
            <li>Detected 9 high-energy segments.</li>
            <li>Silence removal estimated at 14% saved runtime.</li>
            <li>Auto crop framing to 9:16 portrait.</li>
            <li>Preparing 5 clips between 18-42 seconds.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
