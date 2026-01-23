import Card from "../Card";
import SectionHeader from "../SectionHeader";

const DashboardPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Welcome back, Creator."
        subtitle="Your creative memory has been synced with the last three sessions."
      />
      <div className="cards">
        <Card
          title="Ongoing Project: Sky Harbor Anthology"
          description="Drafting Chapter 4 with cinematic pacing and warm futurism."
          footer={<span className="tag">Last updated 2 hours ago</span>}
        />
        <Card
          title="Quick Create"
          description="Start a new creative session with adaptive defaults and mood presets."
          footer={<button className="button-primary">Launch</button>}
        />
        <Card
          title="Creative Preferences"
          description="Tone: reflective + hopeful. Visuals: painterly neon. Audio: airy synth."
          footer={<span className="tag">Memory confidence 92%</span>}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
