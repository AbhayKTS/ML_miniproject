import SectionHeader from "../SectionHeader";
import ClipCard from "../ClipCard";

const ClipsPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Generated Clips"
        subtitle="Review the highlight reels, rename, regenerate captions, or send to the editor."
      />
      <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Tip: click Play to preview a clip before editing.</p>
      <div className="cards">
        <ClipCard title="Clip 01 · Viral Hook" duration="00:32" status="Captions: Karaoke Glow" />
        <ClipCard title="Clip 02 · Key Insight" duration="00:21" status="Captions: Bold Contrast" />
        <ClipCard title="Clip 03 · Surprise Moment" duration="00:44" status="Captions: Emoji Pop" />
      </div>
    </div>
  );
};

export default ClipsPage;
