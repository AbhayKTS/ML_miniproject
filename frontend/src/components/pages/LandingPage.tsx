import { Link } from "react-router-dom";
import Card from "../Card";
import SectionHeader from "../SectionHeader";

const LandingPage = () => {
  return (
    <div>
      <section className="hero">
        <div>
          <span className="tag">AI Video Clipping Platform</span>
          <h2>Chhaya — QuickReel-style highlights in minutes.</h2>
          <p>
            Upload long-form content and let Chhaya detect viral moments, auto
            caption, and export platform-ready clips with smart framing and
            templates.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 16 }}>
            <Link className="button-primary" to="/upload">
              Start clipping
            </Link>
            <span className="tag">Auto captions + smart crop</span>
          </div>
        </div>
        <div className="showcase">
          <div className="showcase-card">
            <h3>Highlight Detection</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
              Detect speaker activity, excitement, and silence for 15–60s clips.
            </p>
          </div>
          <div className="showcase-card" style={{ animationDelay: "1s" }}>
            <h3>Auto Captions</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
              Whisper-powered transcription with karaoke, bold, and emoji styles.
            </p>
          </div>
          <div className="showcase-card" style={{ animationDelay: "2s" }}>
            <h3>Smart Editing</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
              Face tracking, auto-zoom emphasis, and export-ready templates.
            </p>
          </div>
        </div>
      </section>

      <section className="page">
        <SectionHeader
          title="Clipping Modules"
          subtitle="Upload, process, review, and export in one streamlined flow."
        />
        <div className="cards">
          <Card
            title="Upload & Process"
            description="Drag, drop, and validate long-form content with progress tracking."
            footer={<span className="tag">Scene + silence detection</span>}
          />
          <Card
            title="Clip Review"
            description="Audit clips, rename, regenerate captions, and send to editor."
            footer={<span className="tag">Highlight scoring</span>}
          />
          <Card
            title="Editor + Export"
            description="Apply templates, overlays, and export multiple formats."
            footer={<span className="tag">9:16, 1:1, 16:9</span>}
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
