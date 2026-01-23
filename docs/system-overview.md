# Chhaya — Adaptive Multi-Modal Creative Intelligence System

## System Overview
Chhaya is a creative co-creation platform that collaborates with users across text, image, and audio. The platform maintains a persistent creative memory, enforces cultural and tonal alignment, and adapts from explicit and implicit feedback.

## System Architecture (Textual Diagram)
```
[Client UI]
  |-> Web App (Landing, Dashboard, Workspaces)
  |-> Auth + Session
  V
[API Gateway]
  |-> Auth Service
  |-> Generation Orchestrator
  |-> Creative Memory Service
  |-> Feedback & Preference Engine
  |-> Project & Asset Service
  V
[AI/ML Layer]
  |-> Creative Reasoning Engine
  |-> Constraint-Aware Creativity Module
  |-> Cultural & Tonal Alignment
  |-> Cross-Modal Consistency Engine
  V
[Data Layer]
  |-> SQL DB (core entities)
  |-> Vector DB (style embeddings)
  |-> Object Storage (assets)
  |-> Analytics + Logs
```

## Workflow Summary
1. User submits prompt + controls.
2. Intent analysis merges with creative memory.
3. Constraints and cultural alignment are enforced.
4. Multi-modal generation produces outputs.
5. Feedback loops update preferences and memory.

## Component Diagram (Textual)
```
UI Shell -> API Gateway -> Services
Services: Auth | Projects | Generation | Memory | Feedback
AI Engines: Reasoning | Style | Constraint | Cross-Modal
Datastores: SQL | Vector | Object Storage | Logs
```
