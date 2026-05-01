import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../SectionHeader";
import { useApp } from "../../context/AppContext";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

const ExportPage = () => {
  const { lastGeneration } = useApp();
  const navigate = useNavigate();
  const [format, setFormat] = useState("MP4 (Video)");
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    if (!lastGeneration) {
      alert("No generation found. Generate content in a workspace first.");
      return;
    }
    setExporting(true);
    
    try {
      // 1. Publish to Firestore
      const user = auth.currentUser;
      const docData = {
        title: `Chhaya ${lastGeneration.modality.charAt(0).toUpperCase() + lastGeneration.modality.slice(1)} Generation`,
        description: lastGeneration.prompt || "User generated content via Chhaya AI.",
        type: lastGeneration.modality,
        url: lastGeneration.output?.startsWith("data:") ? "#" : lastGeneration.output || "#",
        publishedAt: new Date().toISOString(),
        author: user?.displayName || user?.email || "Anonymous Creator",
        authorId: user?.uid || "anonymous",
      };
      
      await addDoc(collection(db, "published_content"), docData);
      
      setExported(true);

      // 2. Trigger a real browser download
      if (lastGeneration.output.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = lastGeneration.output;
        const ext = lastGeneration.modality === "image" ? "jpg"
          : lastGeneration.modality === "audio" ? "wav" : "txt";
        link.download = `chhaya_export_${Date.now()}.${ext}`;
        link.click();
      }
    } catch (e) {
      console.error("Failed to publish:", e);
      alert("Failed to publish to community resources.");
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadLast = () => {
    if (!lastGeneration?.output.startsWith("data:")) {
      alert("No downloadable content yet. Generate an image or audio first.");
      return;
    }
    const link = document.createElement("a");
    link.href = lastGeneration.output;
    const ext = lastGeneration.modality === "image" ? "jpg"
      : lastGeneration.modality === "audio" ? "wav" : "txt";
    link.download = `chhaya_${lastGeneration.modality}_${Date.now()}.${ext}`;
    link.click();
  };

  return (
    <div className="page">
      <SectionHeader
        title="Export & Publish"
        subtitle="Finalize your creative asset and download the high-fidelity render."
      />
      <div className="split">
        <div className="panel controls">
          <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 13 }}>Customize your generation before downloading</p>
          <div className="control-group">
            <label>Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option>MP4 (Video)</option>
              <option>PNG/JPG (Image)</option>
              <option>WAV/MP3 (Audio)</option>
              <option>TXT (Draft)</option>
            </select>
          </div>
          <div className="control-group">
            <label>Canvas / Layout</label>
            <select>
              <option>Shorts (9:16)</option>
              <option>Social (1:1)</option>
              <option>Cinematic (16:9)</option>
            </select>
          </div>
          <div className="control-group">
            <label>Quality</label>
            <select>
              <option>High Fidelity (1080p+)</option>
              <option>Standard (720p)</option>
              <option>Draft (480p)</option>
            </select>
          </div>
          {exported && <p style={{ color: "var(--accent-soft)", fontSize: 13, marginBottom: 8 }}>✓ Export complete — file downloaded</p>}
          <button className="button-primary" onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting…" : "Finalize & Export"}
          </button>
        </div>
        <div className="panel">
          <h3>Generation History</h3>
          {lastGeneration ? (
            <ul style={{ marginTop: 12, color: "var(--text-muted)", paddingLeft: 18, fontSize: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <li>chhaya_{lastGeneration.modality}_{lastGeneration.id.slice(0, 6)} — ready</li>
            </ul>
          ) : (
            <p style={{ color: "var(--text-muted)", marginTop: 12, fontSize: 14 }}>
              No exports yet. <span style={{ color: "var(--accent)", cursor: "pointer" }} onClick={() => navigate("/app")}>Generate content first →</span>
            </p>
          )}
          <button className="ghost-button" style={{ marginTop: 16 }} onClick={handleDownloadLast}>
            Download last export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
