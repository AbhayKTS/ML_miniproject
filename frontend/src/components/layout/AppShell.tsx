import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppShell = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-area">
        <Topbar />
        <main className="page">
          <Outlet />
        </main>
        <footer style={{
          padding: "20px 32px",
          borderTop: "1px solid var(--border)",
          fontSize: 12,
          color: "var(--text-muted)",
          textAlign: "center"
        }}>
          CHHAYA · Adaptive Generative AI Collaborator · 2026
        </footer>
      </div>
    </div>
  );
};

export default AppShell;
