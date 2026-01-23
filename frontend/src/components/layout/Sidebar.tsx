import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div>
        <h1>Chhaya Studio</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
          Adaptive multi-modal creativity
        </p>
      </div>
      <nav>
        <NavLink to="/app" end>
          Overview
        </NavLink>
        <NavLink to="/app/text">Text Workspace</NavLink>
        <NavLink to="/app/image">Image Workspace</NavLink>
        <NavLink to="/app/audio">Audio Workspace</NavLink>
        <NavLink to="/app/feedback">Feedback Lab</NavLink>
        <NavLink to="/app/memory">Creative Memory</NavLink>
      </nav>
      <div className="card">
        <h3 style={{ marginBottom: 8 }}>Quick Create</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: 12 }}>
          Launch a new project with adaptive defaults.
        </p>
        <button className="button-primary">Start fresh</button>
      </div>
    </aside>
  );
};

export default Sidebar;
