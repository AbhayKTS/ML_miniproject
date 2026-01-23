import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div>
        <h1>Chhaya Studio</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
          AI video clipping + creator studio
        </p>
      </div>
      <nav>
        <NavLink to="/app" end>
          Overview
        </NavLink>
        <NavLink to="/upload">Upload</NavLink>
        <NavLink to="/processing">Processing</NavLink>
        <NavLink to="/clips">Clips</NavLink>
        <NavLink to="/editor">Editor</NavLink>
        <NavLink to="/export">Export</NavLink>
      </nav>
      <div className="card">
        <h3 style={{ marginBottom: 8 }}>Quick Reel</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: 12 }}>
          Auto-detect highlights and generate captions.
        </p>
        <button className="button-primary">Start processing</button>
      </div>
    </aside>
  );
};

export default Sidebar;
