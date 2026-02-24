type SectionHeaderProps = {
  title: string;
  subtitle: string;
};

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <div>
      <h2 style={{ fontSize: 26 }}>{title}</h2>
      <p style={{ color: "var(--text-muted)", marginTop: 6 }}>{subtitle}</p>
    </div>
  );
};

export default SectionHeader;
