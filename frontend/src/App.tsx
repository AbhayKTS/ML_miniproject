import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import AuthPage from "./components/pages/AuthPage";
import DashboardPage from "./components/pages/DashboardPage";
import PromptWorkspacePage from "./components/pages/PromptWorkspacePage";
import MediaGenerationPage from "./components/pages/MediaGenerationPage";
import FeedbackPage from "./components/pages/FeedbackPage";
import SettingsPage from "./components/pages/SettingsPage";
import UploadPage from "./components/pages/UploadPage";
import ProcessingPage from "./components/pages/ProcessingPage";
import ClipsPage from "./components/pages/ClipsPage";
import EditorPage from "./components/pages/EditorPage";
import ExportPage from "./components/pages/ExportPage";
import AppShell from "./components/layout/AppShell";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="prompts" element={<PromptWorkspacePage />} />
        <Route path="generation" element={<MediaGenerationPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="/upload" element={<AppShell />}>
        <Route index element={<UploadPage />} />
      </Route>
      <Route path="/processing" element={<AppShell />}>
        <Route index element={<ProcessingPage />} />
      </Route>
      <Route path="/clips" element={<AppShell />}>
        <Route index element={<ClipsPage />} />
      </Route>
      <Route path="/editor" element={<AppShell />}>
        <Route index element={<EditorPage />} />
      </Route>
      <Route path="/export" element={<AppShell />}>
        <Route index element={<ExportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

// internal refactor and optimization updates
