type ClipCardProps = {
  title: string;
  duration: string;
  status: string;
};

// ClipCard: displays a generated clip with quick actions (play, rename, captions, edit).
// Keep UI simple here; the editor receives the clip for deeper editing.
const ClipCard = ({ title, duration, status }: ClipCardProps) => {
  // Note: status shows the active caption style for quick scanning by editors.
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>{title}</h3>
        <span className="tag">{duration}</span>
      </div>
      <p style={{ color: "var(--text-muted)", marginTop: 8 }}>{status}</p>
      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <button className="button-primary">Preview</button>
        <button className="ghost-button">Edit title</button>
        <button className="ghost-button">Regenerate captions</button>
        <button className="ghost-button">Open in editor</button>
      </div>
    </div>
  );
};

export default ClipCard;
