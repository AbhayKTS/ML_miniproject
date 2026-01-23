import { Link } from "react-router-dom";
import Card from "../Card";
import SectionHeader from "../SectionHeader";

const LandingPage = () => {
  return (
    <div>
      <section className="hero">
        <div>
          <span className="tag">Adaptive Multi-Modal Creative Intelligence</span>
          <h2>Chhaya — Your Creative Shadow.</h2>
          <p>
            Chhaya collaborates with you to craft stories, imagery, and soundscapes
            that evolve with your style. It listens, remembers, and refines with
            every creative cycle.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 16 }}>
            <Link className="button-primary" to="/app">
              Enter Studio
            </Link>
            <span className="tag">Live memory + feedback loops</span>
          </div>
        </div>
        <div className="showcase">
          <div className="showcase-card">
            <h3>Multi-Modal Narrative</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
              A coastal sci-fi tale with tonal harmony across text, imagery, and
              ambient audio cues.
            </p>
          </div>
          <div className="showcase-card" style={{ animationDelay: "1s" }}>
            <h3>Creative Refinement Cycles</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
              Iterate with adaptive constraints, originality sliders, and
              cultural context filters.
            </p>
          </div>
          <div className="showcase-card" style={{ animationDelay: "2s" }}>
            <h3>Living Memory Core</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
              Chhaya learns your narrative arcs, visual styles, and sonic
              palette over time.
            </p>
          </div>
        </div>
      </section>

      <section className="page">
        <SectionHeader
          title="Creative Modules"
          subtitle="Each workspace stays aligned with your creative intent and memory."
        />
        <div className="cards">
          <Card
            title="Text Studio"
            description="Generate scripts, stories, and campaigns with tone and structure controls."
            footer={<span className="tag">Narrative arcs + tone sliders</span>}
          />
          <Card
            title="Image Studio"
            description="Produce concept art with cultural filters and style libraries."
            footer={<span className="tag">Reference + variation engine</span>}
          />
          <Card
            title="Audio Studio"
            description="Design sonic worlds with mood, tempo, and instrumentation presets."
            footer={<span className="tag">Scene-based ambience</span>}
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
