# Chhaya API Documentation

> Base URL: `http://localhost:4000`

## Authentication

All routes except `/auth/*` and `/health` require a valid JWT in the `Authorization: Bearer <token>` header. Unauthenticated requests receive `401 Authentication required`.

### `POST /auth/signup`

Create a new account.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepass",
  "name": "User Name"
}
```

**Response (201):**
```json
{
  "user": { "id": "uuid", "email": "user@example.com", "name": "User Name" },
  "token": "jwt-token"
}
```

### `POST /auth/login`

**Body:**
```json
{ "email": "user@example.com", "password": "securepass" }
```

**Response (200):**
```json
{
  "user": { "id": "uuid", "email": "user@example.com", "name": "User Name" },
  "token": "jwt-token"
}
```

---

## Generation (requires auth)

### `POST /generate/text` | `POST /generate/image` | `POST /generate/audio`

**Body:**
```json
{
  "prompt": "A luminous harbor story",
  "controls": {
    "originality": 70,
    "tone": "warm visionary",
    "complexity": 60,
    "culturalContext": "coastal ritual",
    "styleIntensity": 50,
    "aiAutonomy": 70,
    "genre": "poetry",
    "narrativeStructure": "arc"
  },
  "constraints": ["keep hopeful"]
}
```

All `controls` fields are optional. `originality`, `complexity`, `styleIntensity`, `aiAutonomy` are 0-100. `prompt` max length 5000 chars.

**Response (200):**
```json
{
  "id": "uuid",
  "modality": "text",
  "prompt": "...",
  "output": "generated content...",
  "reasoning": { "tone": "...", "themes": [...], "constraints": [...] },
  "crossModal": { ... },
  "createdAt": "ISO-8601",
  "userId": "uuid"
}
```

---

## Feedback (requires auth)

### `POST /feedback`

**Body:**
```json
{
  "generationId": "uuid",
  "rating": 4,
  "edits": "made it brighter",
  "signals": { "reuse": true, "acceptance": true }
}
```

All fields optional. `rating` is 1-5. Feedback triggers automatic creative memory blending.

**Response (200):** The saved feedback entry.

---

## Creative Memory (requires auth)

### `GET /memory`

Returns the authenticated user's creative memory profile.

### `POST /memory/update`

**Body:**
```json
{
  "updates": {
    "tone": "dreamy",
    "themes": ["ocean", "night"],
    "visualStyle": "impressionist",
    "audioStyle": "ambient",
    "culturalContext": "Mediterranean",
    "lock": true
  }
}
```

When `lock: true`, memory is frozen and will not be modified by feedback blending until unlocked (`lock: false`).

---

## Projects (requires auth)

### `GET /projects`

List authenticated user's projects. Supports `?page=1&limit=20`.

### `POST /projects`

**Body:**
```json
{ "name": "My Project", "description": "optional description" }
```

**Response (201):** The created project.

---

## Video Pipeline (requires auth)

### `POST /upload`

Upload a video file. Accepts `multipart/form-data` with `video` field. Max size: 2GB. Allowed formats: `.mp4`, `.mov`, `.mkv`, `.webm`.

### `POST /generate-clips`

**Body:**
```json
{ "videoId": "uuid", "minDuration": 5, "maxDuration": 30 }
```

### `POST /generate-captions`

**Body:**
```json
{ "clipId": "uuid", "style": "bold" }
```

### `POST /export`

**Body:**
```json
{ "clipId": "uuid", "format": "mp4", "resolution": "1080p", "aspectRatio": "9:16" }
```

---

## Health

### `GET /health`

No auth required.

**Response:**
```json
{
  "status": "ok",
  "service": "chhaya-backend",
  "timestamp": "ISO-8601",
  "uptime": 123.456
}
```

---

## Rate Limits

| Endpoint Group | Window | Max Requests |
|---|---|---|
| `/auth/*` | 15 min | 30 |
| `/generate/*` | 15 min | 200 |
| `/feedback/*` | 15 min | 200 |

Exceeding limits returns `429 Too many requests`.

---

## Error Responses

All errors follow this shape:
```json
{ "error": "Human-readable message" }
```

| Status | Meaning |
|---|---|
| 400 | Invalid payload / validation error |
| 401 | Authentication required |
| 404 | Resource not found |
| 429 | Rate limited |
| 500 | Server error |
