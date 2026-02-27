import { useState, useEffect } from "react";
import SectionHeader from "../SectionHeader";
import ClipCard from "../ClipCard";

const ClipsPage = () => {
  const [clips, setClips] = useState([
    { id: "1", title: "Clip 01 · Viral Hook", duration: "00:32", status: "Captions: Karaoke Glow" },
    { id: "2", title: "Clip 02 · Key Insight", duration: "00:21", status: "Captions: Bold Contrast" },
    { id: "3", title: "Clip 03 · Surprise Moment", duration: "00:44", status: "Captions: Emoji Pop" },
  ]);

  return (
    <div className="page">
      <SectionHeader
        title="Generated Clips"
        subtitle="Review the highlight reels, rename, regenerate captions, or send to the editor."
      />
      <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Tip: click Play to preview a clip before editing.</p>
      <div className="cards">
        {clips.map((clip) => (
          <ClipCard key={clip.id} title={clip.title} duration={clip.duration} status={clip.status} />
        ))}
      </div>
    </div>
  );
};

export default ClipsPage;
