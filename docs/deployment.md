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
