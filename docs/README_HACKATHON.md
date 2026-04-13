# Chhaya AI - Hackathon Technical README

## Project Overview
Chhaya AI is a multi-modal creative platform that generates text, image, and audio outputs while adapting future generations based on user feedback.

## Architecture
- Frontend: React + Vite client applications
- Backend: Express API with controller-service-repository layering
- AI Engine: adaptive profile and prompt control modules
- Data: JSON store for local dev, Supabase/PostgreSQL-ready integrations

### Backend Clean Architecture Mapping
- Controllers: request orchestration and response shaping
- Services: generation, feedback blending, domain workflows
- Repositories: feedback and generation persistence abstractions
- Models: domain objects represented through typed payload structures
- Middleware: authentication, request context, rate limiting, error handling

## Setup
1. Backend
- cd backend
- npm install
- npm run dev

2. Frontend
- cd frontend
- npm install
- npm run dev

## Security Controls
- JWT authentication and route guards
- Role-aware token claims for authorization expansion
- Helmet security headers
- XSS sanitization
- Configurable CORS policy
- Global API rate limiter
- Optional CSRF header guard via environment flags

## Adaptive Learning Flow
1. User submits feedback with rating and edits.
2. Feedback is stored in repository layer.
3. Adaptive engine summarizes feedback trends.
4. Adaptive profile adjusts tone/originality/complexity defaults.
5. Next generation request uses adaptive controls automatically.

## API Endpoints (Core)
- POST /auth/signup
- POST /auth/login
- POST /generate/text
- POST /generate/image
- POST /generate/audio
- POST /generate/workflow/triplet
- POST /feedback
- GET /memory
- POST /memory/update

## Evaluation Improvements Delivered
- Modular backend boundaries with new controllers, repositories, middleware, and ai-engine layers
- Feedback-aware adaptive generation profile
- Integrated text-image-audio workflow endpoint
- Structured request error handling and correlation ids
- Documentation improved for architecture transparency
