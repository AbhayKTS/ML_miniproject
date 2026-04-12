# Chhaya API Reference

## Authentication
All endpoints marked 🔒 require a Firebase Bearer token.

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | – | Health check |
| POST | /auth/register | – | Register (Firebase client) |
| GET | /auth/me | 🔒 | Current user info |
| POST | /generate/text | 🔒 | Generate text via Gemini |
| GET | /memory | 🔒 | Get creative memory |
| POST | /memory | 🔒 | Update creative memory |
| DELETE | /memory | 🔒 | Clear creative memory |
