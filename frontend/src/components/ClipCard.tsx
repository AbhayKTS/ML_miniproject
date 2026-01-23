type ClipCardProps = {
  title: string;
  duration: string;
  status: string;
};

const ClipCard = ({ title, duration, status }: ClipCardProps) => {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>{title}</h3>
        <span className="tag">{duration}</span>
      </div>
      <p style={{ color: "var(--text-muted)", marginTop: 8 }}>{status}</p>
      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <button className="button-primary">Play</button>
        <button className="ghost-button">Rename</button>
        <button className="ghost-button">Regenerate captions</button>
        <button className="ghost-button">Send to editor</button>
      </div>
    </div>
  );
};

export default ClipCard;
