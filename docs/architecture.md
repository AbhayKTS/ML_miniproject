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
