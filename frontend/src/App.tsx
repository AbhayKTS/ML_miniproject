import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import DashboardPage from "./components/pages/DashboardPage";
import TextWorkspacePage from "./components/pages/TextWorkspacePage";
import ImageWorkspacePage from "./components/pages/ImageWorkspacePage";
import AudioWorkspacePage from "./components/pages/AudioWorkspacePage";
import FeedbackPage from "./components/pages/FeedbackPage";
import MemoryPage from "./components/pages/MemoryPage";
import AppShell from "./components/layout/AppShell";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="text" element={<TextWorkspacePage />} />
        <Route path="image" element={<ImageWorkspacePage />} />
        <Route path="audio" element={<AudioWorkspacePage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="memory" element={<MemoryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
