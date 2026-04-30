import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import DashboardPage from "./components/pages/DashboardPage";
import TextWorkspacePage from "./components/pages/TextWorkspacePage";
import ImageWorkspacePage from "./components/pages/ImageWorkspacePage";
import AudioWorkspacePage from "./components/pages/AudioWorkspacePage";
import FeedbackPage from "./components/pages/FeedbackPage";
import MemoryPage from "./components/pages/MemoryPage";
import UploadPage from "./components/pages/UploadPage";
import ProcessingPage from "./components/pages/ProcessingPage";
import ClipsPage from "./components/pages/ClipsPage";
import EditorPage from "./components/pages/EditorPage";
import ExportPage from "./components/pages/ExportPage";
import AppShell from "./components/layout/AppShell";
import LoginPage from "./components/pages/LoginPage";
import { useApp } from "./context/AppContext";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<AuthGuard><AppShell /></AuthGuard>}>
        <Route index element={<DashboardPage />} />
        <Route path="text" element={<TextWorkspacePage />} />
        <Route path="image" element={<ImageWorkspacePage />} />
        <Route path="audio" element={<AudioWorkspacePage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="memory" element={<MemoryPage />} />
      </Route>
      <Route path="/upload" element={<AuthGuard><AppShell /></AuthGuard>}>
        <Route index element={<UploadPage />} />
      </Route>
      <Route path="/processing" element={<AuthGuard><AppShell /></AuthGuard>}>
        <Route index element={<ProcessingPage />} />
      </Route>
      <Route path="/clips" element={<AuthGuard><AppShell /></AuthGuard>}>
        <Route index element={<ClipsPage />} />
      </Route>
      <Route path="/editor" element={<AuthGuard><AppShell /></AuthGuard>}>
        <Route index element={<EditorPage />} />
      </Route>
      <Route path="/export" element={<AuthGuard><AppShell /></AuthGuard>}>
        <Route index element={<ExportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
