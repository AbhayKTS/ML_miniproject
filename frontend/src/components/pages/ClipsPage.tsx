import { useState, useEffect } from "react";
import SectionHeader from "../SectionHeader";
import ClipCard from "../ClipCard";
import { getClips, ClipWithDetails } from "../../api";

const ClipsPage = () => {
  const [clips, setClips] = useState<ClipWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        const data = await getClips();
        setClips(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load clips");
        setClips([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClips();
  }, []);

  return (
    <div className="page">
      <SectionHeader
        title="Generated Clips"
        subtitle="Review the highlight reels, rename, regenerate captions, or send to the editor."
      />
      <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Tip: click Play to preview a clip before editing.</p>
      
      {loading && (
        <div style={{ color: "var(--text-muted)", padding: "40px 0", textAlign: "center" }}>
          Loading clips...
        </div>
      )}
      
      {error && (
        <div style={{ color: "#ff6b6b", padding: "20px", background: "rgba(255,107,107,0.1)", borderRadius: 8, marginTop: 16 }}>
          {error}
        </div>
      )}
      
      {!loading && !error && clips.length === 0 && (
        <div style={{ color: "var(--text-muted)", padding: "40px 0", textAlign: "center" }}>
          No clips generated yet. Upload a video to get started.
        </div>
      )}
      
      <div className="cards">
        {clips.map((clip) => (
          <ClipCard 
            key={clip.id} 
            title={clip.title} 
            duration={clip.duration} 
            status={clip.captionStyle ? `Captions: ${clip.captionStyle}` : "No captions"} 
          />
        ))}
      </div>
    </div>
  );
};

export default ClipsPage;
