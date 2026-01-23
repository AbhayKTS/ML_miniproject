import { useState } from "react";
import SectionHeader from "../SectionHeader";
import UploadDropzone from "../UploadDropzone";
import ProgressList from "../ProgressList";
import { uploadVideo } from "../../api";

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploadedId, setUploadedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList) => {
    const selected = Array.from(fileList);
    setFiles(selected);
    setError(null);
    setProgress(0);

    if (!selected[0]) {
      return;
    }

    try {
      const result = await uploadVideo(selected[0], setProgress);
      setUploadedId(result.id);
    } catch (err) {
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <div className="page">
      <SectionHeader
        title="Upload Source Video"
        subtitle="Drag & drop a long-form video. Chhaya will detect highlights, remove silence, and prepare clips."
      />
      <div className="cards">
        <UploadDropzone
          onFilesSelected={handleFiles}
          hint="Supported: mp4, mov, mkv, webm · max 2GB"
        />
        <div className="panel">
          <h3>Upload Status</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
            {files.length ? files[0].name : "No file selected yet."}
          </p>
          {error && <p style={{ color: "#ff9b9b", marginTop: 12 }}>{error}</p>}
          {files.length > 0 && (
            <ProgressList
              items={[
                { label: "Uploading", value: progress },
                { label: "Validating", value: uploadedId ? 100 : 40 }
              ]}
            />
          )}
          {uploadedId && (
            <div style={{ marginTop: 16 }}>
              <span className="tag">Upload complete · Video ID {uploadedId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
