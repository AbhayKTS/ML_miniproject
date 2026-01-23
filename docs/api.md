# Chhaya API Documentation

## Auth
- `POST /auth/signup` → { email, password, name }
- `POST /auth/login` → { email, password }

## Generation
- `POST /generate/text`
- `POST /generate/image`
- `POST /generate/audio`

Payload:
```
{
  "userId": "optional",
  "prompt": "...",
  "controls": {
    "originality": 70,
    "tone": "warm visionary",
    "complexity": 60,
    "culturalContext": "coastal ritual"
  },
  "constraints": ["keep hopeful"]
}
```

## Feedback
- `POST /feedback`

Payload:
```
{
  "userId": "optional",
  "generationId": "uuid",
  "rating": 1-5,
  "edits": "optional",
  "signals": { "reuse": true, "acceptance": true }
}
```

## Memory
- `GET /memory`
- `POST /memory/update`

## Projects
- `GET /projects`
- `POST /projects`
