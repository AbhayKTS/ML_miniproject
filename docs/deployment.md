# Deployment Guide

## Local Development
1. Install dependencies in `frontend` and `backend`.
2. Start backend on port 4000.
3. Start frontend on port 5173.

## Cloud Deployment
- API Gateway + Auth: AWS API Gateway + Cognito or Auth0
- Backend services: containerized Node.js services on ECS/Kubernetes
- Vector DB: Pinecone/Weaviate
- Object storage: S3 with CDN (CloudFront)
- Observability: OpenTelemetry + CloudWatch / Datadog

## Environment Variables
- `JWT_SECRET`
- `PORT`
# Deployment Guide

## Backend (Render)
1. Connect GitHub repo to Render
2. Set build command: `cd backend && npm install`
3. Set start command: `node src/index.js`
4. Add all `.env` variables in Render dashboard

## Frontend (Vercel)
1. Set root to `frontend/`
2. Build: `npm run build`
3. Output: `dist/`
4. Set `VITE_API_BASE_URL` env var to your Render backend URL

## CORS
Update `CORS_ORIGIN` in backend env to match your Vercel domain.
