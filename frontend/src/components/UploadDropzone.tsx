import { ChangeEvent, DragEvent } from "react";

type UploadDropzoneProps = {
  onFilesSelected: (files: FileList) => void;
  hint?: string;
};

// Note: This dropzone is intentionally small and focused — it accepts video files only.
// The server enforces file-size limits and accepted codecs; client-side hints help the user.
const UploadDropzone = ({ onFilesSelected, hint }: UploadDropzoneProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(event.target.files);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) {
      onFilesSelected(event.dataTransfer.files);
    }
  };

  return (
    <div
      className="dropzone"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div>
        <h3>Drag & drop your video</h3>
        <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
          {hint || "MP4, MOV, MKV, or WEBM · up to 2GB — we'll auto-transcode if needed"}
        </p>
      </div>
      <label className="button-primary" style={{ marginTop: 16 }}>
        Select file
        <input type="file" accept="video/*" onChange={handleChange} hidden />
      </label>
    </div>
  );
};

export default UploadDropzone;
