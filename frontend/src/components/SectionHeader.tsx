import { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  rightContent?: ReactNode;
};

const SectionHeader = ({ title, subtitle, rightContent }: SectionHeaderProps) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
      <div>
        <h2 style={{ fontSize: 26, margin: 0 }}>{title}</h2>
        <p style={{ color: "var(--text-muted)", marginTop: 6, margin: 0 }}>{subtitle}</p>
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
};

export default SectionHeader;
