const API_BASE = "http://localhost:4000";

export const uploadVideo = (file: File, onProgress?: (value: number) => void) => {
  return new Promise<{ id: string; filename: string }>((resolve, reject) => {
    const formData = new FormData();
    formData.append("video", file);

    const request = new XMLHttpRequest();
    request.open("POST", `${API_BASE}/upload`);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(JSON.parse(request.responseText));
      } else {
        reject(new Error("Upload failed"));
      }
    };
    request.onerror = () => reject(new Error("Upload failed"));
    request.send(formData);
  });
};

export const requestClipGeneration = async (videoId: string) => {
  const response = await fetch(`${API_BASE}/generate-clips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId })
  });
  return response.json();
};

export const requestCaptions = async (clipId: string) => {
  const response = await fetch(`${API_BASE}/generate-captions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clipId })
  });
  return response.json();
};

export const requestExport = async (clipId: string, format: string, resolution: string) => {
  const response = await fetch(`${API_BASE}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clipId, format, resolution })
  });
  return response.json();
};
