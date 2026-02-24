import { ReactNode } from "react";

type CardProps = {
  title: string;
  description: string;
  footer?: ReactNode;
};

const Card = ({ title, description, footer }: CardProps) => {
  return (
    <div className="card" role="group" aria-label={`module: ${title}`}>
      <h3>{title}</h3>
      <p style={{ color: "var(--text-muted)", marginTop: 8 }}>{description}</p>
      {footer && <div style={{ marginTop: 12 }}>{footer}</div>}
    </div>
  );
};

export default Card;
