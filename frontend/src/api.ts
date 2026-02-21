// ============================================================
//  Chhaya Frontend API Client
//  All calls go to the backend at localhost:4000
// ============================================================

const API_BASE = "http://localhost:4000";

// ── Helper ─────────────────────────────────────────────────
const req = async <T>(path: string, opts?: RequestInit): Promise<T> => {
  const token = localStorage.getItem("chhaya_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts?.headers as Record<string, string> | undefined),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
};

// ── Auth ───────────────────────────────────────────────────
export interface AuthResult {
  token: string;
  user: { id: string; name: string; email: string };
}

export const registerUser = (name: string, email: string, password: string) =>
  req<AuthResult>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const loginUser = (email: string, password: string) =>
  req<AuthResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// ── Video Upload ────────────────────────────────────────────
export const uploadVideo = (file: File, onProgress?: (value: number) => void) => {
  return new Promise<{ id: string; filename: string }>((resolve, reject) => {
    const formData = new FormData();
    formData.append("video", file);
    const token = localStorage.getItem("chhaya_token");

    const request = new XMLHttpRequest();
    request.open("POST", `${API_BASE}/upload`);
    if (token) request.setRequestHeader("Authorization", `Bearer ${token}`);
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

// ── Clip Generation ─────────────────────────────────────────
export interface ClipJob {
  jobId: string;
  videoId: string;
  status: string;
  clips: Clip[];
}

export interface Clip {
  id: string;
  videoId: string;
  title: string;
  startTime: number;
  endTime: number;
  aspectRatio: string;
  status: string;
}

export const requestClipGeneration = (
  videoId: string,
  minDuration?: number,
  maxDuration?: number
) =>
  req<ClipJob>("/generate-clips", {
    method: "POST",
    body: JSON.stringify({ videoId, minDuration, maxDuration }),
  });

// ── Captions ────────────────────────────────────────────────
export interface Caption {
  id: string;
  clipId: string;
  style: string;
  transcript: string;
  wordTimestamps: { word: string; start: number; end: number }[];
}

export const requestCaptions = (clipId: string, style?: string) =>
  req<Caption>("/generate-captions", {
    method: "POST",
    body: JSON.stringify({ clipId, style }),
  });

// ── Export ──────────────────────────────────────────────────
export interface ExportRecord {
  id: string;
  clipId: string;
  format: string;
  resolution: string;
  status: string;
  outputPath: string;
}

export const requestExport = (clipId: string, format: string, resolution: string, aspectRatio?: string) =>
  req<ExportRecord>("/export", {
    method: "POST",
    body: JSON.stringify({ clipId, format, resolution, aspectRatio }),
  });

// ── Generate (Text / Image / Audio) ─────────────────────────
export interface GenerationControls {
  tone?: string;
  culturalContext?: string;
  originality?: number;
  complexity?: number;
  theme?: string;
  genre?: string;
  styleIntensity?: number;
  mood?: string;
  tempo?: string;
  instrumentation?: string;
}

export interface Generation {
  id: string;
  modality: string;
  prompt: string;
  output: string;
  reasoning: {
    tone: string;
    themes: string[];
    culturalContext: string;
    originality: number;
    complexity: number;
    riskBudget: string;
  };
  crossModal: {
    narrativeAnchor: string;
    visualAnchor: string;
    audioAnchor: string;
  };
  createdAt: string;
  userId: string;
}

export const generateText = (
  prompt: string,
  controls?: GenerationControls,
  constraints?: string[]
) =>
  req<Generation>("/generate/text", {
    method: "POST",
    body: JSON.stringify({ prompt, controls, constraints }),
  });

export const generateImage = (
  prompt: string,
  controls?: GenerationControls,
  constraints?: string[]
) =>
  req<Generation>("/generate/image", {
    method: "POST",
    body: JSON.stringify({ prompt, controls, constraints }),
  });

export const generateAudio = (
  prompt: string,
  controls?: GenerationControls,
  constraints?: string[]
) =>
  req<Generation>("/generate/audio", {
    method: "POST",
    body: JSON.stringify({ prompt, controls, constraints }),
  });

// ── Feedback ────────────────────────────────────────────────
export interface FeedbackEntry {
  id: string;
  userId: string;
  generationId: string;
  rating: number;
  edits: string;
  signals: { reuse?: boolean; acceptance?: boolean };
  createdAt: string;
}

export const submitFeedback = (payload: {
  generationId?: string;
  rating?: number;
  edits?: string;
  toneHint?: string;
  signals?: { reuse?: boolean; acceptance?: boolean };
}) =>
  req<FeedbackEntry>("/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ── Creative Memory ──────────────────────────────────────────
export interface CreativeMemory {
  userId: string;
  tone: string;
  themes: string[];
  visualStyle: string;
  audioStyle: string;
  culturalContext: string;
  lock: boolean;
  updatedAt: string;
}

export const getMemory = (userId?: string) =>
  req<CreativeMemory>(`/memory${userId ? `?userId=${userId}` : ""}`);

export const updateMemory = (updates: Partial<Omit<CreativeMemory, "userId" | "updatedAt">>) =>
  req<CreativeMemory>("/memory/update", {
    method: "POST",
    body: JSON.stringify({ updates }),
  });

// ── Projects ─────────────────────────────────────────────────
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
}

export const getProjects = () => req<Project[]>("/projects");

export const createProject = (name: string, description?: string) =>
  req<Project>("/projects", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });

// ── Health ────────────────────────────────────────────────────
export const checkHealth = () =>
  req<{ status: string; service: string }>("/health");
