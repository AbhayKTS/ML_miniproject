type ProgressListProps = {
  items: { label: string; value: number }[];
};

const ProgressList = ({ items }: ProgressListProps) => {
  return (
    <div className="panel" style={{ display: "grid", gap: 16 }} aria-live="polite" role="status">
      {items.map((item) => (
        <div key={item.label}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{item.label}</span>
            <span style={{ color: "var(--text-muted)" }}>{item.value}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${item.value}%` }} aria-valuenow={item.value} aria-valuemin={0} aria-valuemax={100} role="progressbar" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressList;
