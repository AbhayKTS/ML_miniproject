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
      </div>
    </div>
  );
};

export default AppShell;
