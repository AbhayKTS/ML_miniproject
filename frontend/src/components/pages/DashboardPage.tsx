import Card from "../Card";
import SectionHeader from "../SectionHeader";

const DashboardPage = () => {
  return (
    <div className="page">
      <SectionHeader
        title="Welcome back, Creator."
        subtitle="Your latest video is ready for highlight detection and captioning."
      />
      <div className="cards">
        <Card
          title="Current Project: Podcast Episode 12"
          description="42-minute episode · 5 highlight clips pending review."
          footer={<span className="tag">Processing 68%</span>}
        />
        <Card
          title="Quick Upload"
          description="Drag & drop a new video to auto-generate clips and captions."
          footer={<button className="button-primary">Upload video</button>}
        />
        <Card
          title="Clip Style Defaults"
          description="Aspect: 9:16 · Captions: Karaoke Glow · Templates: Viral"
          footer={<span className="tag">Auto-zoom enabled</span>}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
