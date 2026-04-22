# Architecture Diagram (Textual)

```
Client (Web, Mobile)
  -> CDN + Edge Cache
  -> API Gateway
     -> Auth Service (JWT/OAuth)
     -> Creative Orchestrator
        -> Reasoning Engine
        -> Constraint Controller
        -> Cultural Alignment
        -> Cross-Modal Consistency
        -> Model Router
     -> Memory Service
        -> Vector DB (Pinecone/Weaviate)
        -> SQL DB (Postgres)
     -> Feedback Service
        -> Preference Learner
     -> Asset Service
        -> Object Storage (S3)
  -> Observability (Logs, Traces)
```
# Chhaya AI – System Architecture

## Overview
Chhaya AI is a full-stack creative intelligence platform.

## Components
- **Frontend**: React + TypeScript (Vite), Firebase Auth
- **Backend**: Node.js / Express, JWT via Firebase Admin SDK
- **AI Services**: Gemini Pro (text), Stability SDXL (image), ElevenLabs (voice)
- **Storage**: Firebase Firestore (projects), JSON file (feedback dev)

## Data Flow
```
User → Firebase Auth → Frontend → Axios (Bearer) → Backend → AI Provider → Response
```
