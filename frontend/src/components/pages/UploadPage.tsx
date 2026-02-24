import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../SectionHeader";
import UploadDropzone from "../UploadDropzone";
import ProgressList from "../ProgressList";
import { uploadVideo, requestClipGeneration } from "../../api";

const UploadPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [clipJobId, setClipJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "uploading" | "done" | "clipping" | "ready">("idle");

  const handleFiles = async (fileList: FileList) => {
    const selected = Array.from(fileList);
    if (!selected[0]) return;
    setFiles(selected);
    setError(null);
    setProgress(0);
    setStage("uploading");

    try {
      const result = await uploadVideo(selected[0], setProgress);
      setVideoId(result.id);
      setStage("done");
    } catch (err) {
      setError("Upload failed. Make sure the backend is running and the file is a valid video format.");
      setStage("idle");
    }
  };

  const handleGenerateClips = async () => {
    if (!videoId) return;
    setStage("clipping");
    setError(null);
    try {
      const job = await requestClipGeneration(videoId, 15, 60);
      setClipJobId(job.jobId);
      setStage("ready");
    } catch (err: any) {
      setError(err.message || "Clip generation failed");
      setStage("done");
    }
  };

  const handleGoToProcessing = () => navigate("/processing");

  const progressItems = stage === "uploading" || stage === "done" || stage === "clipping" || stage === "ready"
    ? [
      { label: "Uploading", value: stage === "uploading" ? progress : 100 },
      { label: "Validating format", value: stage === "done" || stage === "clipping" || stage === "ready" ? 100 : 40 },
      { label: "Generating clips", value: stage === "clipping" ? 55 : stage === "ready" ? 100 : 0 },
    ]
    : [];

  return (
    <div className="page">
      <SectionHeader
        title="Upload Source Video"
        subtitle="Drag & drop a long-form video. Chhaya will detect highlights, remove silence, and prepare clips."
      />
      <div className="cards">
        <UploadDropzone
          onFilesSelected={handleFiles}
          hint="Supported: MP4, MOV, MKV, WEBM — max 2GB; contact admin for larger uploads"
        />
        <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h3>Upload Status</h3>
          <p style={{ color: "var(--text-muted)" }}>
            {files.length ? files[0].name : "No file selected yet."}
          </p>

          {error && <p style={{ color: "#ff9b9b" }}>⚠ {error}</p>}

          {progressItems.length > 0 && (
            <ProgressList items={progressItems} />
          )}

          {videoId && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span className="tag">✓ Video ID: {videoId.slice(0, 8)}…</span>
            </div>
          )}

          {stage === "done" && (
            <button className="button-primary" onClick={handleGenerateClips}>
              ✂️ Generate Clips
            </button>
          )}

          {stage === "clipping" && (
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Analysing video for highlight segments…</p>
            </div>
          )}

          {stage === "ready" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="tag" style={{ alignSelf: "flex-start" }}>
                ✓ Clip job started · {clipJobId?.slice(0, 8)}
              </span>
              <button className="button-primary" onClick={handleGoToProcessing}>
                View Processing →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
