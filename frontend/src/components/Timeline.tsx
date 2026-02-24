const Timeline = () => {
  return (
    <div className="timeline" role="region" aria-label="Clip timeline">
      <div className="timeline-track" />
      <div className="timeline-clip" style={{ left: "10%", width: "20%" }}>
        Hook
      </div>
      <div className="timeline-clip" style={{ left: "35%", width: "30%" }}>
        Peak
      </div>
      <div className="timeline-clip" style={{ left: "70%", width: "15%" }}>
        CTA
      </div>
    </div>
  );
};

export default Timeline;
