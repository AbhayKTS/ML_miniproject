-- Chhaya core schema (Supabase / PostgreSQL)
-- Run this in Supabase SQL Editor to create all tables.
-- Updated: March 2026 — added JSONB fields, new controls, indexes.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  intent_snapshot TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS creative_memory (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  tone TEXT,
  themes JSONB DEFAULT '[]'::jsonb,
  visual_style TEXT,
  audio_style TEXT,
  cultural_context TEXT,
  genre TEXT,
  narrative_structure TEXT,
  style_intensity INTEGER DEFAULT 50,
  ai_autonomy INTEGER DEFAULT 50,
  locked BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS text_generations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  prompt TEXT,
  output TEXT,
  reasoning JSONB,
  cross_modal JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS image_generations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  prompt TEXT,
  output TEXT,
  reasoning JSONB,
  cross_modal JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audio_generations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  prompt TEXT,
  output TEXT,
  reasoning JSONB,
  cross_modal JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedback_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  generation_id TEXT,
  rating INTEGER,
  edits TEXT,
  signals JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  type TEXT,
  uri TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  filename TEXT,
  source_path TEXT,
  status TEXT DEFAULT 'uploaded',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clip_jobs (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clips (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL,
  title TEXT,
  start_time REAL,
  end_time REAL,
  aspect_ratio TEXT,
  output_path TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS captions (
  id TEXT PRIMARY KEY,
  clip_id TEXT NOT NULL,
  style TEXT,
  transcript TEXT,
  word_timestamps JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clip_id) REFERENCES clips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exports (
  id TEXT PRIMARY KEY,
  clip_id TEXT NOT NULL,
  format TEXT DEFAULT 'mp4',
  resolution TEXT DEFAULT '1080p',
  aspect_ratio TEXT DEFAULT '9:16',
  output_path TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clip_id) REFERENCES clips(id) ON DELETE CASCADE
);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_user ON creative_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_text_gen_user ON text_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_image_gen_user ON image_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_gen_user ON audio_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_gen ON feedback_logs(generation_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_project ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_videos_user ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_clip_jobs_video ON clip_jobs(video_id);
CREATE INDEX IF NOT EXISTS idx_clips_video ON clips(video_id);
CREATE INDEX IF NOT EXISTS idx_captions_clip ON captions(clip_id);
CREATE INDEX IF NOT EXISTS idx_exports_clip ON exports(clip_id);
