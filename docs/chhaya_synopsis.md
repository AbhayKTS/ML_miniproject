# Chhaya AI Synopsis

## 1.1 Area of Project

This project falls under the following research and engineering domains:

- Generative Artificial Intelligence: Using large language models and diffusion models for creative content synthesis.
- Adaptive Machine Learning: Building systems that evolve based on user feedback and behavioral signals.
- Full-Stack Web Engineering: Designing and implementing a complete client-server application with modern frameworks.
- Human-Computer Interaction (HCI): Creating intuitive, responsive user interfaces for AI-powered creative tools.
- Multi-Modal AI Systems: Integrating multiple AI services (text, image, audio) into a unified pipeline.

## 1.2 Technical Keywords

Generative AI, Adaptive Learning, Multimodal Content Generation, Creative Memory, Hugging Face API Key, MistralAI, Stability AI, ESPnet, Node.js, Express.js, React, TypeScript, Supabase, PostgreSQL, Firebase, JWT Authentication, CSRF Protection, REST API, Cross-Modal Planning, Feedback Loop, Personalization Engine

## 1.3 Project Idea

The central idea of Chhaya AI is to create an intelligent, adaptive creative studio where the AI learns and evolves with each user's unique creative style over time. Unlike static AI generators that produce the same generic outputs for identical prompts, Chhaya AI maintains a Creative Memory Profile per user that captures preferred tone, recurring themes, visual style, audio aesthetic, and cultural context.

Every time a user generates content and provides feedback (a rating or textual edits), the system's Adaptive Learning Engine updates their profile using model-assisted interpretation and heuristic fallbacks. On the next generation request, the updated profile is fed into the Creative Engine to produce outputs that are increasingly personalized and aligned with the user's creative vision.

The current system uses a Hugging Face API key-based provider workflow with the following generation modalities:

- Text: Generated using MistralAI.
- Image: Generated using Stability AI.
- Audio: Generated using ESPnet.

Note: Previous direct integrations (Gemini, RunwayML, ElevenLabs, and Suno) have been removed from the current synopsis and replaced by the above stack.

## 1.4 Motivation of the Project

The AI content market is growing rapidly, but creators still face major workflow gaps:

1. Most tools do not retain user preferences across sessions.
2. Most tools are single-modality (only text, image, or audio).
3. Few systems improve iteratively using structured user feedback.
4. Cross-modal consistency is weak across separate tools.

Chhaya AI addresses this by acting as a unified creative intelligence layer where user memory, feedback, and multi-modal generation are managed in one experience.

## 1.5 Literature Survey (Short)

### 1.5.1 Generative AI Foundations

- Brown et al. (2020, GPT-3): Established few-shot text generation at scale.
- Google DeepMind (2023, Gemini): Demonstrated multimodal model capability.
- Rombach et al. (2022, Stable Diffusion): Enabled practical high-quality text-to-image generation.

These works motivate Chhaya AI's generative architecture and provider-level integration strategy.

### 1.5.2 Adaptive and Personalized AI

- Amershi et al. (2014): Human-in-the-loop learning foundation.
- Riedl and Young (2010): Constraint-aware narrative planning.
- Jain et al. (2023): Feedback-guided personalization improves output quality.

These studies justify Chhaya AI's feedback loop and creative memory update design.

### 1.5.3 Multimodal Systems

- Radford et al. (2021, CLIP): Cross-modal semantic alignment.
- Borsos et al. (2023, AudioLM): High-quality audio generation insights.
- Ho et al. (2022, Video Diffusion): Practical video synthesis direction.

These references support Chhaya AI's goal of coherent cross-modal generation.

### 1.5.4 Existing Tools and Gap

Current tools are strong in isolated tasks but weak in persistent personalization and integrated multimodal creativity. Chhaya AI targets this gap by combining:

- multi-modal generation,
- adaptive creative memory,
- and feedback-driven personalization.

## 2.1.1 Goals and Objectives

Goal 1: Unified Multimodal Generation

- Integrate text, image, and audio generation in one platform via a Hugging Face API key-based provider workflow.
- Route text to MistralAI, image to Stability AI, and audio to ESPnet through a common backend orchestration layer.

Goal 2: Persistent Creative Memory

- Implement a per-user Creative Memory Profile storing tone, themes, visual style, audio style, and cultural context.
- Persist profiles using Supabase PostgreSQL with JSON-compatible structures.

Goal 3: Adaptive Learning Feedback Loop

- Allow users to submit ratings (1 to 5 stars) and textual edits after each generation.
- Use model-assisted feedback interpretation with heuristic fallback to update the creative memory profile.

Goal 4: Cross-Modal Planning

- Implement a Creative Engine that analyzes user intent from prompt plus memory, applies cultural alignment, and builds a cross-modal plan (narrative anchor, visual anchor, audio anchor) before dispatching generation.

Goal 5: Secure, Scalable Backend

- Implement JWT-based authentication with Firebase-backed identity integration.
- Apply Helmet headers, XSS protection, CSRF guard, and rate limiting (100 requests per 15 minutes).

Goal 6: Rich Frontend Experience

- Build a React/TypeScript frontend with studio pages for Landing, Authentication, Prompt Studio, Media Generation, Dashboard, and Project Management.

Goal 7: Project and Generation History

- Allow users to create and manage multiple creative projects with per-project generation history and reusable context.

## 2.1.2 Statement of Scope

In Scope:

- Text, image, and audio generation using third-party providers through a Hugging Face API key workflow.
- Persistent creative memory per user.
- Feedback collection and adaptive profile updates.
- JWT authentication with Firebase identity integration.
- Supabase PostgreSQL-backed storage.
- React/TypeScript frontend with full UI.
- REST API using Node.js and Express.
- Rate limiting, CSRF, XSS, and Helmet-based security.
- Multi-project and generation-history management.
- Analytics dashboard for usage and adaptation insights.

Out of Scope:

- Training custom generative models.
- Native mobile applications (iOS/Android).
- Offline or on-device AI generation.
- Full RLHF or fine-tuning pipelines (replaced by feedback blending).
- Post-generation advanced media editing workflows.
- Guaranteed real-time generation latency under all third-party API conditions.

## 2.2 Major Constraints

1. API Dependency: Full generation depends on valid provider access through the Hugging Face key path and configured endpoints for MistralAI, Stability AI, and ESPnet.
2. Cost: Third-party API usage has per-call costs that affect large-scale deployment.
3. Latency: Generation time varies by modality and provider queue/network conditions.
4. Rate Limits: External providers enforce independent rate limits in addition to the internal platform limiter.
5. Data Privacy: Creative memory and generation history can contain sensitive content; security depends on correct token handling and database access control.
6. Model Determinism: Outputs are non-deterministic; repeated requests may differ even with similar prompts and memory.
7. Browser Compatibility: The frontend targets modern browsers; legacy browsers may have reduced compatibility.

## 3. Methodologies of Problem Solving

### 3.1 Analysis

The analysis phase identified core user pain points in fragmented creative workflows: tool switching, inconsistent style, and weak personalization. Functional requirements were defined around multimodal generation, persistent user memory, secure authentication, and feedback-driven adaptation. Non-functional requirements included responsiveness, modularity, security, and API fault tolerance.

### 3.2 Design

The system was designed using a layered architecture:

- Frontend layer: React/TypeScript studio interface.
- API layer: Node.js/Express REST services for auth, generation, memory, feedback, and projects.
- Intelligence layer: creative reasoning and cross-modal planning.
- Data layer: Supabase/PostgreSQL for users, projects, memory profiles, and generation history.

Provider routing was designed around a Hugging Face API key workflow with MistralAI (text), Stability AI (image), and ESPnet (audio).

### 3.3 Development

Development followed incremental module delivery:

1. Authentication and session handling.
2. Prompt and generation APIs.
3. Creative memory profile persistence.
4. Feedback ingestion and adaptation logic.
5. Project management and history tracking.
6. UI integration for text, image, and audio workspaces.

Service adapters were implemented to isolate provider-specific logic, improving maintainability and future provider replacement.

### 3.4 Evaluation

Evaluation was performed through functional testing and workflow validation:

- Correct routing of each modality to its target provider.
- Memory update quality after rating and edit feedback.
- Security middleware behavior (JWT, CSRF, XSS, rate limiting).
- Usability checks for end-to-end generation and project history.

The prototype demonstrates stable orchestration and progressively better personalization over repeated sessions.

## 4. Outcome

The project delivers a working adaptive creative platform that unifies text, image, and audio generation in one interface. It maintains per-user memory, updates preferences from feedback, and provides project-level history for continuity. The result is a more personalized and coherent creative workflow compared to isolated single-purpose tools.

## 5. Applications

Chhaya AI can be applied in:

- Marketing and campaign content ideation.
- Story and script drafting for creators.
- Audio concept generation for podcasts and short media.
- Visual concept generation for social and brand design teams.
- Rapid prototyping for game and narrative design.

## 6. Hardware Resources Required

- Development machine: 8 GB RAM minimum (16 GB recommended).
- Multi-core CPU for concurrent frontend/backend workflow.
- Stable internet connection for third-party API calls.
- Optional GPU not mandatory (inference is API-driven).

## 7. Software Resources Required

- Operating System: Windows/Linux/macOS.
- Runtime and tools: Node.js, npm, Git, Python (optional scripting).
- Frontend stack: React, TypeScript, Vite.
- Backend stack: Node.js, Express.js.
- Database/auth services: Supabase/PostgreSQL, Firebase.
- AI integrations: Hugging Face API key workflow, MistralAI, Stability AI, ESPnet.

## 8. Project Model Analysis

The project follows an iterative Agile model with short implementation cycles and continuous feedback integration. Each sprint targets one vertical slice (API + UI + validation), reducing integration risk and enabling early testing of adaptive behavior.

### 8.1 Reconciled Estimates

The following estimates are reconciled specifically for Chhaya AI as a full-stack, API-orchestrated multimodal product with a 3-member team.

1. Cost Estimate: Rs 1,36,000 (prototype phase, 12 months)

Table 8.1: Cost Estimation for Chhaya AI

| Cost (in Rs) | Description |
|---|---|
| 36,000 | Backend and deployment infrastructure (VM/container hosting, logs, bandwidth) |
| 18,000 | Supabase/PostgreSQL managed usage and backups |
| 42,000 | Hugging Face-based inference/API usage (MistralAI, ESPnet routing overhead) |
| 30,000 | Stability AI image generation credits and burst usage |
| 10,000 | Tooling, domain, and miscellaneous DevOps overhead |

Total estimated operational + integration cost for 12 months: Rs 1,36,000.

2. Time Estimate: 10 to 12 months

- Core MVP build (auth, memory, generation flow, feedback loop): 4 months
- Integration hardening, security, and project/history modules: 3 months
- Testing, optimization, and final reporting/deployment: 3 to 5 months

### 8.2 Cost Estimation using COCOMO Model

Since Chhaya AI is developed by a small team with moderately flexible requirements and iterative delivery, Organic COCOMO is used.

Assumption for this project: KLOC = 14.0 (combined backend services, frontend app logic, and integration code).

1. Effort Applied

Effort defines the amount of labor required to complete the project and is measured in person-months.

E = a_b (KLOC)^b_b

E = 2.4 x (14.0)^1.05

E = 38.34 PM

2. Development Time

Development time is the total duration required to complete the project and is proportional to effort.

D = c_b (E)^d_b

D = 2.5 x (38.34)^0.38

D = 9.99 months

3. People Required

The required team size is computed from effort and development time.

P = E / D

P = 38.34 / 9.99

P = 3.84 (approximately 4 people equivalent)

Interpretation for this project:

- COCOMO suggests around 4 full-time equivalent developers for about 10 months.
- With a 3-member academic team and part-time constraints, a practical calendar of 10 to 12 months is reasonable.
- The model aligns with the reconciled timeline and confirms feasibility for prototype-to-demo completion.

## 9. Risk Management w.r.t. NP Hard Analysis

Chhaya AI faces a combinatorial optimization challenge: for every request, the system must balance user prompt intent, memory profile preferences, safety constraints, and provider-specific limits. Solving this optimally for all combinations of controls, styles, and outputs is practically intractable at runtime. Therefore, the platform uses bounded decision rules, staged processing, and feedback-guided adaptation instead of exhaustive global optimization.

The risk strategy is divided into three layers:

- Preventive controls at input and authentication level.
- Runtime controls in orchestration, retries, and fallback paths.
- Corrective controls via logs, monitoring, and post-generation feedback updates.

### 9.1 Risk Identification

1. External provider disruption

Availability issues or quality fluctuations in text/image/audio providers can directly impact generation quality and response time.

2. Provider contract mismatch

Changes in request schema, parameter names, model versions, or API behavior can break integrations without warning.

3. Credential and key mismanagement

Improperly scoped or expired API keys can block generation and create reliability incidents.

4. Personalization drift

Noisy feedback, contradictory edits, or low-quality signals can distort creative memory profiles.

5. Cross-modal incoherence

Text, image, and audio outputs can diverge in mood, style, or cultural alignment if anchors are not enforced.

6. Security and abuse risks

Token misuse, malformed payloads, prompt injection attempts, or request flooding can degrade service reliability.

7. Cost volatility

Unbounded request volume or expensive generation settings can exceed expected operating budgets.

### 9.2 Risk Analysis

1. High impact, medium likelihood: provider dependency

Mitigation: provider adapter abstraction, strict response validation, timeout/retry policy, and controlled degradation behavior.

2. High impact, low-medium likelihood: security incidents

Mitigation: JWT validation, CSRF guard, Helmet, XSS sanitization, and rate limiting with alerting.

3. Medium impact, high likelihood: latency variability

Mitigation: asynchronous workflow design, request status visibility in UI, and non-blocking generation states.

4. Medium impact, medium likelihood: memory drift

Mitigation: weighted feedback blending, bounded profile updates, and periodic normalization of memory attributes.

5. Medium impact, medium likelihood: budget overrun

Mitigation: per-user usage thresholds, provider-level request caps, and cost telemetry dashboards.

6. Medium impact, low-medium likelihood: architectural coupling

Mitigation: clean service boundaries, versioned interfaces, and adapter-based integration to reduce rewrite cost.

## 10. Project Schedule

The project schedule follows iterative delivery with defined stabilization milestones. Each phase combines frontend and backend work so integration issues are discovered early rather than at the end.

### 10.1 Project Task Set

1. Foundation and planning

- Requirement validation and scope freeze.
- Architecture definition and repository setup.
- Environment and key management strategy.

2. Core platform services

- Authentication and access control flows.
- Project, generation, and memory schemas.
- Baseline API route structure and validation.

3. Adaptive intelligence layer

- Creative memory read/write flows.
- Feedback capture and profile update logic.
- Cross-modal planning and anchor generation.

4. Multimodal integration

- Text generation integration.
- Image generation integration.
- Audio generation integration.
- Unified response shaping and error handling.

5. Productization and hardening

- Dashboard and history UX refinement.
- Security middleware and abuse controls.
- Test execution and bug closure.
- Documentation and final report preparation.

### 10.2 Timeline Chart

Month 1 to 2

- Planning, architecture, and baseline project scaffolding.

Month 3 to 4

- Authentication, core APIs, project entities, and initial UI shells.

Month 5 to 6

- Memory system, feedback loop, and adaptive learning pipeline.

Month 7 to 8

- Multimodal provider integration and orchestration refinement.

Month 9 to 10

- Cross-modal consistency improvements, analytics/dashboard updates, and reliability tuning.

Month 11 to 12

- Security hardening, end-to-end validation, optimization, and report finalization.

## 11. Introduction

Chhaya AI is an adaptive creative platform designed to unify multimodal content generation and user-specific personalization in a single workflow. Instead of isolated one-off generation, the system treats creativity as a longitudinal process where each interaction improves future results.

The platform combines three core ideas:

- Memory continuity across sessions.
- Feedback-driven adaptation.
- Cross-modal coherence across generated assets.

### 11.1 Purpose and Scope of Document

This document provides a structured technical description of Chhaya AI, covering requirements, architecture, methodologies, module design, risk controls, and implementation outcomes. It serves both as an engineering reference and as an academic artifact for design rationale and traceability.

Scope of this document includes:

- Functional and non-functional requirements.
- Service architecture and data flow.
- Module-level design decisions.
- Security and reliability considerations.
- Scheduling and delivery assumptions.

### 11.2 Use Case View

Primary actor: authenticated creator.

Supporting actors: provider APIs, database services, and orchestration workers.

Main use-case groups:

1. Identity and access

- Register, login, and maintain authenticated session.

2. Creative workflow

- Create/select project.
- Configure style and controls.
- Generate text, image, and audio outputs.

3. Adaptation workflow

- Submit ratings and edits.
- Update memory profile.
- Re-generate with refined personalization.

4. Continuity workflow

- View generation history.
- Reuse prior outputs and project context.

## 12. Functional Model and Description

The functional model organizes system behavior into a deterministic orchestration pipeline with adaptive layers. Every generation request passes through validation, context enrichment, planning, provider dispatch, persistence, and optional feedback assimilation.

### 12.1 Data Flow Diagram

Logical data flow for a generation request:

1. Client captures prompt, controls, and project context.
2. Request is sent to API with auth token.
3. API verifies identity and validates payload schema.
4. Memory service retrieves user creative profile.
5. Creative engine computes intent and cross-modal anchors.
6. Generation service routes request to target provider.
7. Output and metadata are persisted under project history.
8. Response is returned to UI for display and interaction.
9. User feedback is submitted and merged into memory profile.

### 12.2 Activity Diagram

End-to-end activity progression:

Start -> Authenticate -> Select/Create Project -> Enter Prompt and Controls -> Generate -> View Result -> Provide Feedback -> Update Memory -> Iterate or End Session.

This activity loop is central to personalization and ensures each cycle improves subsequent outputs.

### 12.3 Non-Functional Requirements

1. Performance

- Interactive operations must remain responsive under normal user load.
- Generation pipelines must avoid blocking UI through asynchronous handling.

2. Reliability

- Failed provider calls should return structured errors.
- Recovery paths should preserve request context and avoid data loss.

3. Security

- JWT-based route protection for authenticated operations.
- CSRF and XSS defenses for request and content handling.
- Rate limiting and request shaping for abuse prevention.

4. Maintainability

- Modular services and adapters to isolate provider-specific logic.
- Consistent API contracts to reduce regression risk.

5. Scalability

- Stateless API design with database-backed continuity.
- Capability to scale compute and provider request throughput independently.

6. Usability

- Low-friction generation and feedback UI loops.
- Clear state feedback for success, pending operations, and errors.

### 12.4 Sequence Diagram

Generation and feedback sequence:

1. User submits prompt from frontend.
2. Frontend sends authenticated request to API.
3. API validates token and payload.
4. Memory service returns user profile context.
5. Creative engine builds plan and anchors.
6. Provider adapter executes generation request.
7. API stores output and returns normalized response.
8. Frontend renders result and captures feedback.
9. Feedback API updates memory profile.
10. Subsequent generation uses updated profile.

## 13. System Architecture

Chhaya AI follows a layered, service-oriented architecture.

1. Presentation Layer

- React and TypeScript application for studio workflows and dashboards.

2. Application Layer

- Express-based APIs for auth, generation, feedback, memory, and project management.

3. Intelligence Layer

- Creative planning engine for intent parsing, profile fusion, and cross-modal anchors.

4. Integration Layer

- Provider adapters that translate internal request contracts to external API formats.

5. Data Layer

- Supabase/PostgreSQL persistence for users, projects, history, and profile memory.

This decomposition minimizes coupling and supports independent evolution of UI, orchestration, provider connectors, and storage logic.

## 14. Architectural Design (Modules)

### 14.1 Module 1: User Authentication and Session Management

This module handles identity lifecycle and secure access.

Core responsibilities:

- User registration and login workflows.
- JWT issuance and verification.
- Route-level authorization for protected APIs.
- Session continuity across client navigation.

Design rationale:

- Authentication is isolated to reduce security blast radius.
- Identity context is attached early so downstream modules remain stateless.

### 14.2 Module 2: Creative Memory System

This module persists and serves per-user creative context.

Core responsibilities:

- Store tone, themes, style preferences, and cultural context.
- Retrieve memory state before each generation.
- Update profile fields after feedback assimilation.

Design rationale:

- Memory is treated as first-class data to ensure continuity across sessions.
- Profile fields are constrained to avoid uncontrolled personalization drift.

### 14.3 Module 3: Adaptive Learning Engine

This module transforms feedback into actionable profile updates.

Core responsibilities:

- Accept ratings and edit notes.
- Infer preference shifts from user signals.
- Merge updates using bounded heuristics and consistency checks.

Design rationale:

- Adaptive behavior is separated from generation routing so it can evolve independently.
- Update rules prioritize stability and incremental change over abrupt profile shifts.

### 14.4 Module 4: Multimodal Generation Pipeline

This module orchestrates generation requests from planning to provider execution.

Core responsibilities:

- Validate request schema and controls.
- Fuse prompt context with memory profile.
- Create cross-modal anchors for consistency.
- Route requests to text, image, and audio adapters.
- Normalize responses into a unified output contract.

Design rationale:

- Adapter pattern isolates provider-specific protocol changes.
- Unified output shape simplifies frontend integration and history storage.

### 14.5 Module 5: Project and History Management

This module manages continuity of creative work over time.

Core responsibilities:

- Create and organize user projects.
- Persist generated outputs with metadata.
- Provide retrieval and browsing of prior generations.
- Support iterative refinement from historical context.

Design rationale:

- Project-level boundaries improve organization and contextual reuse.
- History-first design enables measurable adaptation and reproducible workflows.

## 15. Tools and Technologies Used

This section documents the technology stack employed throughout development, deployment, and runtime operation of Chhaya AI.

### 15.1 Programming Languages and Runtimes

- JavaScript (Node.js 18+): Backend runtime for Express.js API server and service orchestration.
- TypeScript (4.9+): Frontend and tooling language for type-safe React components and utilities.
- Python (3.9+): Auxiliary scripting for report generation, data processing, and offline analysis.
- SQL (PostgreSQL 13+): Database schema, migrations, and query language for data persistence.

### 15.2 Frontend Framework and Libraries

- React 18: Component-based UI library for rendering interactive creative studio interfaces.
- TypeScript 4.9+: Type annotations for React components, props, and hooks.
- Vite 4+: Bundler and dev server for fast HMR and optimized production builds.
- Firebase SDK: Client-side authentication integration for Google Sign-in and ID token management.
- PostCSS + Tailwind CSS: Utility-first CSS framework for responsive design and theming.
- React Router: Client-side navigation and route management.

### 15.3 Backend Framework and Middleware

- Express.js 4.18+: REST API framework and request routing.
- Helmet 7+: Security headers middleware (COOP: "same-origin-allow-popups", CSP, X-Frame-Options).
- jsonwebtoken 9+: JWT token issuance and verification for session authentication.
- CSRF Guard: Custom CSRF token validation middleware for protected mutating operations.
- XSS-Clean: Request sanitization to prevent injected malicious code execution.
- Express Rate Limit: Per-IP request throttling (100 req/15 min) to prevent abuse.
- dotenv: Environment variable management for API keys and configuration.

### 15.4 AI/Generation Providers and SDKs

- Hugging Face API: Provider aggregation layer using API key-based authentication for model access.
- MistralAI (via Hugging Face): Large language model for text generation (instruction-following, few-shot, chat completions).
- Stability AI (via API): Diffusion model for text-to-image generation with style and control parameters.
- ESPnet (via Hugging Face): Speech synthesis and audio generation from text prompts.

### 15.5 Database and Persistence

- Supabase: PostgreSQL-managed cloud database with role-based access control (RLS).
- PostgreSQL 13+: Relational database schema for users, projects, generations, feedback, and memory profiles.
- Migrations: Version-controlled schema changes managed through custom migration scripts.

### 15.6 Authentication and Authorization

- Firebase Authentication: Identity provider for email/password and OAuth 2.0 (Google).
- JWT (JSON Web Tokens): Backend session tokens issued on successful Firebase credential exchange.
- Supabase Row Level Security (RLS): Database-level authorization to restrict queries to authenticated user data.

### 15.7 Testing and Quality Assurance

- Jest 29+: Unit and integration testing framework for service logic and middleware.
- Supertest: HTTP assertion library for API endpoint testing.
- Custom test suites: Covered in test files such as errorLogger.test.js and creativeEngine.test.js.

### 15.8 Development and DevOps Tools

- Git: Distributed version control with GitHub as central repository.
- GitHub Actions: CI/CD pipeline automation for test execution, linting, and deployment.
- npm/Node Package Manager: Dependency management and script automation.
- VS Code: Primary IDE with extensions for TypeScript, ESLint, and debugger integration.
- Docker (optional): Containerized deployment for consistent environment replication.

### 15.9 Logging and Monitoring

- Custom error logger: Structured error capture with context and stack traces (errorLogger.js).
- Console logging: Development-time debugging and trace output.
- Environment-based verbosity: Production vs. development log levels via NODE_ENV.

### 15.10 API Documentation and Communication

- OpenAPI/Swagger (planned): API schema documentation for provider integrations and REST endpoints.
- Markdown documentation: Architecture, deployment, and module design documentation.
- Inline code comments: Service logic documentation with algorithm pseudocode.

## 16. Algorithm Details

This section provides formal descriptions of the core algorithms driving Chhaya AI's adaptive and generative behavior.

### 16.1 Adaptive Profile Building Algorithm

**Purpose:** Transform user feedback signals (ratings, edits, interactions) into incremental updates to the creative memory profile without introducing drift or instability.

**Input:** Current profile state P, feedback signal F (rating 1-5, edit vector E, or interaction metadata).

**Algorithm:**

```
FUNCTION UpdateCreativeProfile(P, F):
  
  1. Parse feedback signal F
     IF F.type == "rating" THEN
        sentiment = NORMALIZE(F.value, 1, 5)  // 1=poor, 5=excellent
        confidence = 0.7  // Medium confidence
     ELSE IF F.type == "edit" THEN
        confidence = 0.9  // High confidence for explicit edits
        sentiment = INFER_FROM_EDITS(F.edits)  // Heuristic: tone change, length, keywords
     ELSE
        confidence = 0.5, sentiment = 0
     END IF

  2. Extract preference signals from sentiment
     IF sentiment >= 4.0 THEN
        signal = { "liked": true, "tone": F.detected_tone, "themes": F.keywords }
     ELSE IF sentiment <= 2.0 THEN
        signal = { "disliked": true, "avoid_tone": F.detected_tone }
     ELSE
        signal = { "neutral": true }
     END IF

  3. Merge into profile with bounds
     FOR EACH field in signal DO
        delta = (signal[field] - P[field]) * confidence
        P[field] = P[field] + CLAMP(delta, -0.15, 0.15)  // Bounded updates
     END FOR

  4. Normalize profile fields to [0, 1] range
     FOR EACH field in P DO
        P[field] = NORMALIZE(P[field], min=0, max=1)
     END FOR

  5. Record update timestamp and return updated profile
     P.last_updated = NOW()
     RETURN P
```

**Design rationale:**

- Feedback is weighted by confidence level (explicit edits > ratings > inferred signals).
- Updates are bounded (±0.15) to prevent noisy feedback from causing abrupt personality shifts.
- Profile normalization maintains numeric stability and prevents unbounded drift.
- Timestamp tracking enables time-decay prioritization if desired in future iterations.

**Fallback behavior:** If edit parsing fails or signal is ambiguous, default to neutral (no update) rather than corrupting profile state.

### 16.2 Intent Analysis and Cross-Modal Planning Algorithm

**Purpose:** Analyze user prompt and creative profile to generate cross-modal anchors (unified theme, tone, and style directives) that ensure coherence across text, image, and audio outputs.

**Input:** User prompt P, current creative profile C, generation controls G (mood, duration, style overrides).

**Algorithm:**

```
FUNCTION GenerateIntentAndAnchors(P, C, G):

  1. Parse and enrich user prompt
     tokens = TOKENIZE(P)
     intent_keywords = EXTRACT_INTENT_KEYWORDS(tokens)  // e.g., ["motivational", "short", "energetic"]
     modalities = PARSE_MODALITIES(P)  // Requested: text, image, audio, video

  2. Merge prompt keywords with creative profile
     user_tone = INFER_TONE(P)
     profile_tone = C.preferred_tone OR "neutral"
     
     merged_tone = BLEND_TONES(user_tone, profile_tone, weight=0.6)  // 60% user intent, 40% profile
     merged_themes = MERGE_LISTS(intent_keywords, C.themes, deduplicate=true)
     merged_style = G.style_override OR C.visual_style OR "default"

  3. Generate cross-modal anchors (unified directives)
     anchor = {
        "tone": merged_tone,
        "primary_theme": merged_themes[0],  // Highest priority theme
        "secondary_themes": merged_themes[1:3],
        "style_descriptor": merged_style,
        "cultural_context": C.cultural_context,
        "length_guidance": PARSE_LENGTH(P, G.duration),
        "creative_goal": INFER_GOAL(intent_keywords)  // e.g., "inspire", "inform", "entertain"
     }

  4. Validate anchor coherence
     IF NOT CoherenceCheck(anchor) THEN
        RESET anchor to conservative defaults (neutral tone, minimal override)
     END IF

  5. Return intent object and anchors
     RETURN {
        "intent_keywords": intent_keywords,
        "modalities": modalities,
        "anchors": anchor,
        "confidence_score": CalculateConfidence(P, C)
     }
```

**Design rationale:**

- Tone and theme blending prioritizes user intent (60%) while respecting profile history (40%).
- Anchors are explicit, parseable directives (not free-form text) to ensure provider compatibility.
- Primary/secondary themes enable multi-faceted content planning without explosion of constraints.
- Coherence validation prevents malformed anchors from reaching providers.

**Provider integration:** Anchors are translated into provider-specific parameters:
- Text: Prompt prefix with tone/goal ("Write a [merged_tone] article about [primary_theme]...").
- Image: Stable Diffusion prompt embedding tone descriptors and style keywords.
- Audio: ESPnet synthesis control codes for voice characteristics and pacing.

### 16.3 Feedback Blending Algorithm

**Purpose:** Reconcile multiple or conflicting feedback signals (user ratings, system inferences, override edits) into a single authoritative memory state without creating contradictions.

**Input:** Existing profile state P, vector of feedback signals F[] (may be contradictory), conflict resolution strategy S.

**Algorithm:**

```
FUNCTION BlendFeedbackIntoMemory(P, F[], S):

  1. Group feedback by modality and type
     text_feedback = FILTER(F[], modality="text")
     image_feedback = FILTER(F[], modality="image")
     audio_feedback = FILTER(F[], modality="audio")
     global_feedback = FILTER(F[], modality="global")

  2. Detect and flag contradictions
     FOR EACH (fi, fj) in CombinationOf(F[]) DO
        IF CONTRADICTS(fi, fj) THEN
           conflict_log.ADD({ signals: [fi, fj], severity: CalculateSeverity(fi, fj) })
        END IF
     END FOR

  3. Resolve conflicts using strategy S
     IF S == "latest_wins" THEN
        resolved_feedback = F[ARGMAX(F[], timestamp)]
     ELSE IF S == "weighted_average" THEN
        resolved_feedback = WEIGHTED_AVERAGE(F[], weights=[confidence, recency])
     ELSE IF S == "user_override" THEN
        resolved_feedback = F[is_explicit_edit=true] OR F[timestamp=MAX]
     ELSE
        resolved_feedback = F[0]  // Default: first signal
     END IF

  4. Apply resolved feedback to profile using bounded updates
     updated_profile = UpdateCreativeProfile(P, resolved_feedback)

  5. Log resolution and return
     RETURN {
        "updated_profile": updated_profile,
        "conflicts_resolved": conflict_log.size(),
        "strategy_used": S
     }
```

**Design rationale:**

- Multi-signal grouping accommodates scenarios where user provides feedback across multiple generations or channels.
- Explicit contradiction detection prevents silent inconsistency that could confuse future adaptation.
- Strategy-based resolution is pluggable: teams can adjust conflict resolution per business rules.
- Bounded updates (from Algorithm 16.1) are reused to maintain numeric stability.

**Fallback behavior:** On unresolvable conflicts, log and preserve existing profile; do not corrupt state.

### 16.4 Model Prediction Details

**Purpose:** Describe the request dispatch, response normalization, and error handling flow for multimodal provider integration.

**Algorithm:**

```
FUNCTION GenerateWithProviders(intent_object, anchors, modality_requests):

  1. Validate request schema
     FOR EACH request in modality_requests DO
        IF NOT ValidateRequest(request) THEN
           RETURN error_response("invalid_payload")
        END IF
     END FOR

  2. Build provider-specific prompts from anchors
     FOR EACH modality, request in modality_requests DO
        provider_prompt = TranslateAnchors(anchors, modality)  // Modality-specific translation
        
        IF modality == "text" THEN
           provider_config = { model: "mistral-large", temperature: 0.7, max_tokens: 500 }
           request_payload = BuildMistralRequest(provider_prompt, provider_config)
        
        ELSE IF modality == "image" THEN
           provider_config = { model: "stable-diffusion-3", steps: 30, scale: 7.5 }
           request_payload = BuildStabilityRequest(provider_prompt, provider_config)
        
        ELSE IF modality == "audio" THEN
           provider_config = { model: "espnet-v2", voice: anchors.voice_profile, rate: 0.95 }
           request_payload = BuildESPnetRequest(provider_prompt, provider_config)
        
        END IF
        
        payloads[modality] = request_payload
     END FOR

  3. Execute provider requests with timeout and retry
     results = {}
     FOR EACH modality, payload in payloads DO
        TRY
           response = CallProviderAPI(modality, payload, timeout=30s, retries=2)
           results[modality] = response
        
        CATCH ProviderError AS err
           IF err.status == 429 THEN  // Rate limited
              results[modality] = { error: "rate_limited", retry_after: err.retry_after }
           ELSE IF err.status == 503 THEN  // Service unavailable
              results[modality] = { error: "provider_unavailable", fallback: GetCachedOrDefault(modality) }
           ELSE
              results[modality] = { error: err.message }
           END IF
        END CATCH
     END FOR

  4. Normalize responses to unified contract
     normalized_output = {
        "generation_id": UUID(),
        "timestamp": NOW(),
        "text": NormalizeTextResponse(results.text),
        "image": NormalizeImageResponse(results.image),
        "audio": NormalizeAudioResponse(results.audio),
        "metadata": {
           "anchors_applied": anchors,
           "profile_influence": CalculateInfluence(anchors, intent_object),
           "errors": [r for r in results if r.error],
           "provider_latencies": ExtractLatencies(results)
        }
     }

  5. Persist output to history
     StoreInDatabase(generation_id, normalized_output, user_id, project_id)

  6. Return response
     RETURN normalized_output
```

**Response Normalization Examples:**

- Text: Strip provider metadata, map output to { "content": text, "tokens_used": n, "model": version }.
- Image: Convert to standard format (PNG), store base64 or URL reference, extract metadata (dimensions, seed).
- Audio: Convert to WAV/MP3, store duration and sample rate, include playback metadata.

**Error Handling Hierarchy:**

1. Schema validation errors (4xx): Return immediately with clear error message.
2. Provider authentication errors (401): Log and escalate; do not retry.
3. Provider rate limiting (429): Queue for retry with backoff.
4. Provider unavailability (503): Return cached similar output or fallback heuristic.
5. Timeout errors: Return partial response (text-only if image/audio timeout) or retry budget exhausted.

**Design rationale:**

- Provider abstraction via unified interface decouples upstream logic from external API churn.
- Retry logic with differentiated strategies respects provider constraints (rate limits, availability).
- Normalization ensures frontend receives consistent contract regardless of provider details.
- Error persistence in metadata enables auditing and future adaptive behavior (e.g., preferring faster providers).

## 17. Workflow Diagrams

This section provides visual representations of key system workflows to clarify operational flow and data movement.

### 17.1 User Journey Activity Diagram

```
                       START
                         |
                    [Authenticate]
                         |
                    /<------->\
                   /           \
              [Email]      [Google OAuth]
                   \           /
                    \<------->/
                         |
                    [Authenticated?]
                        / \
                      NO   YES
                      |     |
                   [Error] [Session Created]
                      |     |
                         [Navigate to Dashboard]
                         |
                   [Select/Create Project]
                         |
              [Enter Prompt + Select Modalities]
                         |
                    [Configure Style/Mood]
                         |
                     [Submit Request]
                         |
                    [Generate Content]
                    (text, image, audio)
                         |
                  [Display Results]
                         |
                  [User Provides Feedback]
                    /   |   \
              [Rate] [Edit] [Thumbs]
                    \   |   /
                         |
                 [Update Memory Profile]
                         |
                    [Save to History]
                         |
                /<-------><------->\
               /                     \
          [Iterate]             [End Session]
           /                        |
        [Re-generate         [Logout]
        with Updated            |
        Profile]             [END]
           \
            \<-------\
                     |
```

### 17.2 Data Flow Diagram (Generation Request)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENT (React)                               │
│  [User enters prompt, selects modalities, applies style controls]           │
│  [Attaches JWT token to request]                                            │
└──────────────────────────┬──────────────────────────────────────────────────┘
                           │
                    (HTTP POST /generate/*)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SERVER (Express.js)                                   │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ Route Handler (requireAuth, validation middleware)              │       │
│  │  - Verify JWT token                                             │       │
│  │  - Validate request schema                                      │       │
│  │  - Extract user_id, project_id, modality list                   │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                           │                                                  │
│                           ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ Creative Engine (Intent Analysis)                               │       │
│  │  - Parse user prompt                                            │       │
│  │  - Extract intent keywords and modalities                       │       │
│  │  - Blend with creative profile                                  │       │
│  │  - Generate cross-modal anchors                                 │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                           │                                                  │
│            ┌──────────────┴──────────────┬──────────────┐                   │
│            │                             │              │                   │
│            ▼                             ▼              ▼                   │
│  ┌──────────────────┐        ┌──────────────────┐  ┌──────────────────┐   │
│  │ Memory Service   │        │ Generation       │  │ Validation       │   │
│  │                  │        │ Service          │  │ Service          │   │
│  │ - Fetch user     │        │                  │  │                  │   │
│  │   creative       │        │ - Translate      │  │ - Schema check   │   │
│  │   profile        │        │   anchors to     │  │ - Control range  │   │
│  │ - Return profile │        │   provider       │  │ - Rate limit     │   │
│  │   state          │        │   prompts        │  │                  │   │
│  └──────────────────┘        └──────────────────┘  └──────────────────┘   │
│            │                             │                                  │
│            └──────────────┬──────────────┴──────────────────────────┐       │
│                           │                                        │       │
│                           ▼                                        │       │
│  ┌────────────────────────────────────────────────────────────┐   │       │
│  │ Generation Dispatch (Parallel or Sequential)               │   │       │
│  │                                                             │   │       │
│  │  IF text_requested THEN                                    │   │       │
│  │    → MistralAI (via Hugging Face API)                      │   │       │
│  │  IF image_requested THEN                                   │   │       │
│  │    → Stability AI (via API)                                │   │       │
│  │  IF audio_requested THEN                                   │   │       │
│  │    → ESPnet (via Hugging Face API)                         │   │       │
│  │                                                             │   │       │
│  │  [Timeout: 30s, Retries: 2, Handle 429/503 errors]        │   │       │
│  └─────────────────────────┬──────────────────────────────────┘   │       │
│                            │                                        │       │
│                            ▼                                        │       │
│  ┌──────────────────────────────────────────────────────────┐      │       │
│  │ Response Normalization                                   │      │       │
│  │  - Convert outputs to unified format                     │      │       │
│  │  - Extract metadata (tokens, latency, dimensions)        │      │       │
│  │  - Include profile influence and error details           │      │       │
│  └──────────────────────────────────────────────────────────┘      │       │
│                            │                                        │       │
│                            ▼                                        │       │
│  ┌──────────────────────────────────────────────────────────┐      │       │
│  │ Persistence Layer (Supabase/PostgreSQL)                  │      │       │
│  │  - Store generation record                               │      │       │
│  │  - Link to user, project, and generation_id              │      │       │
│  │  - Save output blobs (text, image, audio URLs)           │      │       │
│  │  - Record timestamp, anchors, and metadata               │      │       │
│  └──────────────────────────────────────────────────────────┘      │       │
│                            │                                        │       │
└────────────────────────────┼────────────────────────────────────────┘       │
                             │
                      (HTTP 200 JSON Response)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT (React)                                    │
│  [Display text, image, audio outputs]                                       │
│  [Show metadata and generation details]                                     │
│  [Capture user feedback (ratings, edits)]                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 17.3 Feedback and Memory Update Sequence

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ SEQUENCE: User Feedback → Memory Update → Next Generation                    │
└──────────────────────────────────────────────────────────────────────────────┘

1. USER → FRONTEND: [Provide Feedback]
   (Rating 1-5 or Edit text or Mark favorites)
   
2. FRONTEND → SERVER (POST /feedback):
   { generation_id, user_id, rating, edit_notes, modality }
   + JWT Token

3. SERVER: [Validate Feedback Request]
   - Extract generation record
   - Verify user ownership
   - Parse feedback signal

4. SERVER → MEMORY SERVICE: [Update Profile]
   - Retrieve current profile
   - Apply feedback blending algorithm (16.3)
   - Resolve any conflicts
   - Persist updated profile to database

5. MEMORY SERVICE → DATABASE: [Store Updated Profile]
   - Save new tone, themes, style attributes
   - Record timestamp
   - Maintain version history

6. SERVER → FRONTEND: [Success Response]
   { status: "updated", profile_changes: [...] }

7. [On Next Generation Request]:
   CREATIVE ENGINE retrieves NEW profile
   └─→ Intent Analysis (16.2) uses updated profile
   └─→ Anchors reflect latest user preferences
   └─→ Next output is more personalized

```

### 17.4 Error Handling and Recovery Flow

```
[Provider API Call]
        │
        ▼
    [Success?]
      / \
    YES  NO
    │     │
    ├──► [Check HTTP Status Code]
    │         │
    │     ┌───┼───┬───┬─────────────┐
    │     │   │   │   │             │
    │     ▼   ▼   ▼   ▼             ▼
    │    401 403 429 503           Other
    │     │   │   │   │            (4xx/5xx)
    │     │   │   │   │             │
    │     │   │   │   ├─► [Backoff  ├─► [Exhausted
    │     │   │   │   │   + Retry]  │   Retries]
    │     │   │   │   │   (max 2)   │   │
    │     │   │   │   │   │         │   │
    │     │   │   │   │   ▼         │   ▼
    │     │   │   │   │ [Success?]  │ [Fallback:
    │     │   │   │   │  / \        │  Cached or
    │     │   │   │   ├─YES NO      │  Heuristic]
    │     │   │   │   ▼  │         │   │
    │     │   │   │  [Continue]    │   └─────┐
    │     │   │   │              │   │         │
    │     │   │   └──────────────────┼────────┤
    │     │   │                      │         │
    │     │   └──────────────────────┤         │
    │     │                          │         │
    │     └──────────────────────────┼         │
    │                                │         │
    └────────────────────────────────┴─────────┘
                     │
                     ▼
         [Log Error + Context]
         [Persist Error to DB]
         [Alert on monitoring]
                     │
                     ▼
         [Return Error Response]
         to Client with Status Code
                     │
                     ▼
         [Client Displays Error]
         & Retry Option to User
```

### 17.5 Authentication Flow (Firebase + JWT Exchange)

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React)                        │
│  [AuthPage.tsx]                                         │
└─────────────────────────────────────────────────────────┘
        │
        ├─► [Email/Password Login]
        │         │
        │         ▼
        │   Firebase Auth SDK
        │   (signInWithEmailAndPassword)
        │         │
        │         └─► Firebase Service
        │
        │
        ├─► [OR] Google Sign-In
        │         │
        │         ▼
        │   Firebase Auth SDK
        │   (signInWithPopup + GoogleAuthProvider)
        │         │
        │         ▼
        │   Google OAuth Consent Screen
        │   (Popup)
        │         │
        │         └─► Return GoogleAuthResult
        │
        ├─ Common Endpoint:
        │
        │   Extract Firebase ID Token
        │   POST /auth/firebase
        │   { idToken, displayName, email }
        │
        └───────────────────────┐
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │  SERVER (Express.js)     │
                    │  [authService.js]        │
                    │                          │
                    │  1. Verify Firebase ID   │
                    │     Token Signature      │
                    │  2. Extract User Data    │
                    │  3. Create/Update User   │
                    │     in Database          │
                    │  4. Issue JWT Token      │
                    │     (7-day expiry)       │
                    │  5. Return JWT to Client │
                    └──────────────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │  DATABASE (Supabase)     │
                    │  [users table]           │
                    │                          │
                    │  Store/Update:           │
                    │  - user_id (UUID)        │
                    │  - email                 │
                    │  - display_name          │
                    │  - created_at            │
                    │  - firebase_uid          │
                    └──────────────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │  Response to Client      │
                    │  { jwt, user: {...}}     │
                    └──────────────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │  FRONTEND (React)        │
                    │                          │
                    │  1. Store JWT in        │
                    │     localStorage        │
                    │  2. Set Authorization   │
                    │     header for future   │
                    │     requests            │
                    │  3. Redirect to         │
                    │     /app (dashboard)    │
                    └──────────────────────────┘

[Subsequent Requests]
  │
  ├─► All API calls include:
  │   Authorization: Bearer {jwt}
  │
  └─► Server middleware:
      - Verify JWT signature
      - Extract user_id
      - Attach user context to request
      - Allow or deny based on RLS policies
```
## 18. Deployment

Chhaya AI is deployed on Firebase infrastructure, leveraging managed services for scalability, security, and reduced operational overhead.

### 18.1 Firebase Hosting (Frontend)

**Configuration:**

- Project: Hosted on Firebase Hosting with custom domain (optional).
- Build process: React TypeScript + Vite compiled to static HTML, CSS, and JavaScript bundles.
- Deployment workflow:
  1. Run `npm run build` in frontend directory (output → `dist/`).
  2. Execute `firebase deploy --only hosting` from project root.
  3. Firebase uploads compiled artifacts to CDN.
  4. Updates routing rules defined in `firebase.json`.

**Routing:**

- SPA fallback: All non-file requests route to `index.html` for React Router client-side navigation.
- Static assets cached with long TTL (1 year for versioned bundles).
- API requests proxied to backend via CORS-enabled endpoints.

**Environment:**

- Firebase configuration injected at build time via `.env.local` (Firebase API key, project ID, auth domain).
- Runtime API endpoint resolved from environment variables in `frontend/src/firebase.ts`.

### 18.2 Firebase Cloud Functions (Backend Alternative)

**Note:** Current deployment uses Node.js on a managed platform (e.g., Google Cloud Run or similar), but Firebase Cloud Functions is an alternative for serverless deployment.

**If using Cloud Functions:**

- Express.js app wrapped in Cloud Functions entrypoint.
- Automatic scaling based on request volume.
- Cold start latency: 1-5 seconds for JavaScript functions.
- Environment variables managed via Firebase CLI or Cloud console.

**Current Deployment (Recommended for Chhaya):**

- Backend runs on Google Cloud Run (managed container service).
- Docker image built from backend Dockerfile containing Node.js + Express stack.
- Automatic scaling: 0-100 instances based on CPU/memory utilization.
- Health check endpoint: `GET /health` (returns `{ status: "ok" }`).

### 18.3 Firebase Realtime Database / Firestore (Data Layer)

**Current Stack:** Supabase PostgreSQL is primary; Firebase Realtime Database is optional for real-time features.

**If integrating Firebase for real-time:**

- Firestore (NoSQL) or Realtime Database used for ephemeral data (generation status, active sessions).
- Main user, project, and history data persisted in Supabase PostgreSQL for relational consistency.
- Hybrid approach: Firebase for real-time UI updates, Supabase for authoritative data store.

### 18.4 Firebase Authentication (Identity Service)

**Status:** Fully integrated and in production.

**Configuration:**

- Firebase project created and configured via Firebase Console.
- Email/Password provider enabled.
- Google OAuth 2.0 provider configured with OAuth consent screen.
- Client ID and API key generated and added to `.env.local`.

**Backend Integration:**

- Firebase Admin SDK initialized in backend with service account key (`serviceAccountKey.json`).
- Token verification performed in auth middleware (`backend/src/utils/auth.js`).
- JWT exchange endpoint: `POST /auth/firebase` accepts Firebase ID tokens and issues backend JWT.

### 18.5 Environment and Secrets Management

**Frontend (.env.local):**

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_PROJECT_ID=chhaya-ai
VITE_FIREBASE_AUTH_DOMAIN=chhaya-ai.firebaseapp.com
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
VITE_API_BASE_URL=https://api.chhaya.example.com
```

**Backend (.env):**

```
NODE_ENV=production
PORT=4000
JWT_SECRET=your-super-secret-key
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./serviceAccountKey.json
HUGGING_FACE_API_KEY=hf_...
STABILITY_AI_API_KEY=sk-...
ESPNET_API_KEY=esps_...
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://your-instance.supabase.co
SUPABASE_ANON_KEY=eyJ0eXAi...
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAi...
CORS_ORIGIN=https://chhaya.example.com
```

**Storage:**

- Secrets stored in Firebase Console → Project Settings → Service Accounts → Environment Variables.
- CI/CD pipeline (GitHub Actions) retrieves secrets from repository secrets and injects into deployment.

### 18.6 Continuous Integration and Deployment (CI/CD)

**GitHub Actions Workflow:**

1. **Trigger:** Push to `main` branch.
2. **Build:**
   - Install dependencies (`npm install` for frontend and backend).
   - Run linter and type checks (`npm run lint`, `tsc --noEmit`).
   - Execute test suite (`npm run test`).
3. **Deploy:**
   - Frontend: Build and deploy to Firebase Hosting.
   - Backend: Build Docker image and push to Google Artifact Registry.
   - Trigger Cloud Run service update with new image.
4. **Verification:**
   - Health check endpoint polled to confirm deployment success.
   - Smoke tests run against production endpoints.

**Rollback:** Deployment is atomic; if health checks fail, previous version remains active.

### 18.7 Monitoring and Logging

**Firebase Console:**

- Real-time metrics: request count, response times, error rates.
- Custom dashboards for tracking user growth, generation success rate, and API latency.

**Cloud Logging (Google Cloud):**

- Structured logs from Node.js application streamed to Cloud Logging.
- Error logs include stack traces and request context.
- Custom log levels: INFO, WARN, ERROR, DEBUG (controlled by `NODE_ENV`).

**Alerting:**

- Alert policy triggered if:
  - Error rate > 5% over 5-minute window.
  - Response time P99 > 3 seconds.
  - Backend service unavailable (health check fails).

### 18.8 Security Considerations for Firebase Deployment

1. **API Key Scoping:**
   - Frontend API key restricted to authentication and hosting origins.
   - Backend service account key stored securely and not embedded in client code.

2. **CORS Configuration:**
   - Backend CORS policy allows requests only from Firebase Hosting domain and custom domain.
   - Credentials mode: `include` for cookies/auth headers.

3. **HTTPS Enforcement:**
   - Firebase Hosting automatically serves HTTPS.
   - Backend enforces HTTPS redirects (Helmet middleware).

4. **Rate Limiting:**
   - Express middleware limits requests to 100 per 15 minutes per IP.
   - Firebase Realtime Database rules enforce read/write limits per user.

5. **Data Residency:**
   - Firebase services (Auth, Hosting) default to US multi-region.
   - Supabase PostgreSQL can be region-locked (e.g., EU, US, Asia).

### 18.9 Disaster Recovery and Backups

1. **Database Backups:**
   - Supabase automated daily snapshots with 30-day retention.
   - Manual backups exportable via Supabase dashboard.

2. **Code Backups:**
   - Git repository mirrors to GitHub and GitLab for redundancy.

3. **Configuration Backups:**
   - Firebase project settings exported and stored in version control.

4. **RTO / RPO:**
   - Recovery Time Objective (RTO): ~15 minutes (redeploy from latest passing CI build).
   - Recovery Point Objective (RPO): ~1 day (latest database backup).

### 18.10 Cost Estimation (Firebase + Cloud Run)

**Monthly Operating Costs (Estimated):**

- Firebase Hosting: $5-20 (static hosting + CDN, based on traffic).
- Cloud Run: $10-100 (compute, based on concurrent instances and invocations).
- Cloud Logging: $0.50 (logging within free tier for small projects).
- Supabase Database: $25 (PostgreSQL, 2 GB storage).
- Firebase Authentication: Free (up to 50,000 monthly active users).
- Provider API costs (MistralAI, Stability AI, ESPnet): Variable, based on generation volume.

**Total Estimated:** $40-200/month for development; $500-2000/month at scale (10k+ MAU).

## 19. Conclusion

Chhaya AI represents a complete implementation of adaptive, multimodal content generation with persistent personalization. The system successfully integrates generative AI providers (MistralAI, Stability AI, ESPnet) via a unified Hugging Face API key workflow, delivering coherent text, image, and audio outputs that evolve with each user's creative preferences.

### 19.1 Key Achievements

1. **Unified Creative Platform:**
   - Single interface for text, image, and audio generation.
   - Cross-modal anchors ensure thematic and stylistic coherence across modalities.

2. **Personalization Engine:**
   - Adaptive Creative Memory system learns tone, themes, and style preferences.
   - Feedback blending algorithm reconciles user ratings and edits into profile updates.
   - Incremental adaptation prevents drift while enabling gradual personality refinement.

3. **Robust Architecture:**
   - Service-oriented design with provider adapters isolates external API changes.
   - Comprehensive error handling: graceful degradation, retry logic, fallback behaviors.
   - Security hardened: JWT authentication, CSRF/XSS protection, rate limiting, RLS database policies.

4. **Firebase Deployment:**
   - Scalable, serverless infrastructure on Firebase Hosting + Cloud Run.
   - Managed identity service (Firebase Auth) + Supabase PostgreSQL for authoritative data.
   - CI/CD automation via GitHub Actions with atomic rollback capability.

5. **Complete Documentation:**
   - Technical architecture, module design, and algorithm specifications.
   - Workflow diagrams clarifying end-to-end system behavior.
   - Deployment and operational runbooks.

### 19.2 Technical Strengths

- **Modularity:** Five independent modules (auth, memory, learning, generation, history) enable parallel development and independent evolution.
- **Testability:** Decoupled services facilitate unit testing, mocking, and integration validation.
- **Extensibility:** Provider adapter pattern enables seamless integration of new AI models without core logic changes.
- **Observability:** Structured logging, health checks, and monitoring enable rapid issue detection and resolution.

### 19.3 Project Impact

Chhaya AI addresses a gap in the creative AI market: most tools lack continuity and personalization. By maintaining per-user memory profiles and adaptive learning, Chhaya AI enables creators to achieve consistent, evolving creative outputs aligned to their unique vision. This drives user retention and differentiation in a crowded generative AI landscape.

### 19.4 Performance Metrics (Target)

- **Generation Latency:** Text < 2s, Image < 5s, Audio < 3s.
- **Error Rate:** < 1% for valid requests; < 5% including provider timeouts/unavailability.
- **Uptime:** 99.5% (Firebase SLA).
- **Scalability:** Support 10,000+ concurrent users with linear cost growth.

## 20. Future Scope

This section outlines potential enhancements and evolutionary paths for Chhaya AI beyond the current implementation.

### 20.1 Advanced Personalization

1. **Multi-Dimensional Profiles:**
   - Separate memory profiles for different creative contexts (e.g., "sci-fi narratives", "product photography").
   - Context-aware profile switching based on detected user intent or explicit project selection.

2. **Collaborative Memory:**
   - Team-based profiles where multiple users contribute feedback to shared memory.
   - Style blending across team members with conflict resolution policies.

3. **Temporal Personalization:**
   - Time-decay weighting: recent feedback influences profile more than historical data.
   - Seasonal or trend-based profile adjustments (e.g., adapting to emerging art styles).

### 20.2 Enhanced Generation Capabilities

1. **Video Generation:**
   - Integration with video synthesis providers (e.g., RunwayML, Pika Labs).
   - Cross-modal anchor extension to video (motion, pacing, scene transitions).

2. **Multimodal Editing:**
   - In-canvas editing for images with AI-assisted inpainting/outpainting.
   - Text editing with AI-assisted paraphrasing and tone adjustment.
   - Audio editing with vocal correction and style transfer.

3. **Advanced Model Selection:**
   - Automatic model selection based on quality/speed tradeoffs per request.
   - A/B testing framework for comparing outputs from different models.
   - Cost optimization: route requests to cheaper providers when quality thresholds are met.

### 20.3 Creative Workflow Enhancements

1. **Project Templates:**
   - Pre-defined workflows for common use cases (social media content, marketing materials, storytelling).
   - Template-specific memory profiles and generation presets.

2. **Batch Generation:**
   - Queue multiple generation requests (e.g., "generate 5 variations on theme X").
   - Parallel execution with unified result aggregation and ranking.

3. **Iterative Refinement:**
   - Multi-turn generation where outputs are refined through successive prompts.
   - Explicit constraint editing (e.g., "make character taller", "shift mood darker").

### 20.4 Community and Monetization

1. **Shared Gallery:**
   - Public sharing of generated works with attribution and licensing metadata.
   - Community style marketplace: monetize popular profiles and templates.

2. **Credit System:**
   - Freemium model: free tier with limited monthly generations, paid tiers with higher quotas.
   - Cost-per-generation model reflecting true provider costs.

3. **Analytics Dashboard:**
   - Creator statistics: total generations, popular styles, audience engagement.
   - Provider cost breakdown and usage trends.

### 20.5 AI/ML Enhancements

1. **Fine-Tuned Models:**
   - Option to fine-tune generation models on user's prior outputs for hyper-personalization.
   - Transfer learning from popular creator profiles to cold-start new users.

2. **Explainability:**
   - Visualize which profile attributes influenced a given generation.
   - Attention maps showing which input keywords drove which output features.

3. **Bias Mitigation:**
   - Monitor generation diversity; alert if model outputs converge to narrow style.
   - Proactive profile reset recommendations if personalization degrades quality.

### 20.6 Infrastructure and Operations

1. **Multi-Region Deployment:**
   - Regional replicas in Europe, Asia-Pacific, and Americas for latency optimization.
   - Cross-region replication for disaster recovery.

2. **Offline-First Mobile:**
   - Native iOS/Android apps with local-first storage (SQLite).
   - Sync memory profiles and history when connectivity restored.

3. **Advanced Observability:**
   - Distributed tracing across services using OpenTelemetry.
   - Custom metrics for generation success rate by modality and model.
   - SLO-based alerting with error budgets.

### 20.7 Privacy and Compliance

1. **GDPR / Data Residency:**
   - User data export and deletion capabilities.
   - Regional data storage options (e.g., EU data center).

2. **Audit Trail:**
   - Complete audit log of all generation requests, feedback, and profile changes.
   - Tamper-proof logging for compliance scenarios.

3. **Differential Privacy:**
   - Optional noise injection into memory profiles to protect user privacy.
   - Federated learning where profiles remain on-device and only gradients are shared.

## 21. References

### 21.1 Academic and Industry Publications

- Brown, T., Mann, B., Ryder, N., et al. (2020). *Language Models are Few-Shot Learners.* Neural Information Processing Systems (NeurIPS). OpenAI.
- Rombach, R., Blattmann, A., Lorenz, D., Esser, P., Ommer, B. (2022). *High-Resolution Image Synthesis with Latent Diffusion Models.* In *Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR).*
- Devlin, J., Chang, M. W., Lee, K., Toutanova, K. (2019). *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding.* In *Proceedings of NAACL-HLT 2019.*
- OpenAI. (2023). *GPT-4 Technical Report.* arXiv preprint arXiv:2303.08774.
- Google DeepMind. (2023). *Gemini: A Family of Highly Capable Multimodal Models.* Technical Report.
- Tunstall, L., Blythe, D., Belkada, Y., de la Rosa, J., Ilic, S., Passos, A., et al. (2023). *Efficient Fine-Tuning of Large Language Models with QLoRA.* arXiv preprint arXiv:2305.14314.

### 21.2 Technology Documentation

- Express.js Official Documentation: https://expressjs.com/
- React Official Documentation: https://react.dev/
- Firebase Documentation: https://firebase.google.com/docs/
- PostgreSQL Official Documentation: https://www.postgresql.org/docs/
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Vite Official Documentation: https://vitejs.dev/
- Supabase Documentation: https://supabase.com/docs
- Hugging Face Hub Documentation: https://huggingface.co/docs
- MistralAI API Documentation: https://docs.mistral.ai/
- Stability AI Documentation: https://platform.stability.ai/docs/
- ESPnet Documentation: https://espnet.github.io/espnet/

### 21.3 Standards and Best Practices

- RFC 7519: *JSON Web Token (JWT).* Internet Engineering Task Force (IETF). 2015.
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OAuth 2.0 Authorization Framework: RFC 6749.
- OpenAPI 3.0 Specification: https://spec.openapis.org/oas/v3.0.3
- REST API Best Practices: Microsoft REST API Guidelines.
- Clean Code and Software Architecture: Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design.* Prentice Hall.

### 21.4 Project-Specific Resources

- GitHub Repository: https://github.com/AbhayKTS/ML_miniproject
- Project Documentation: `/docs/` folder in repository.
- Architecture and System Overview: `docs/architecture.md`, `docs/system-overview.md`.
- Deployment Guide: `docs/deployment.md`.
- API Documentation: `docs/api.md`.
- Creative Memory System: `docs/creative-memory.md`.
- Frontend UX: `docs/frontend-ux.md`.
- Testing Strategy: `docs/testing.md`.
- Database Schema: `backend/schema.sql`.

### 21.5 Tools and Libraries Used

- **Web Framework:** Express.js 4.18+
- **Frontend Library:** React 18 + TypeScript 4.9+
- **Bundler:** Vite 4+
- **Authentication:** Firebase 9+ SDKs
- **Database:** Supabase (PostgreSQL 13+)
- **API Clients:** Axios, Fetch API, native HTTPS client
- **Testing:** Jest 29+, Supertest
- **Code Quality:** ESLint, Prettier, TypeScript compiler
- **DevOps:** GitHub Actions, Docker, Firebase CLI
- **Security:** Helmet 7+, JWT (jsonwebtoken 9+), XSS-Clean
- **Logging:** Winston, Custom error logger
- **Cloud Provider:** Google Firebase, Google Cloud Run

### 21.6 Acknowledgments

Chhaya AI was developed as a capstone project by:

- **Ansh Yadav** – Team Lead, Backend Architecture & API Design
- **Abhay Kumar** – Frontend Development & UI/UX Implementation
- **Adarsh Katara** – AI Integration & Adaptive Learning Engine

Special thanks to the open-source community for frameworks, libraries, and tools that made this project possible. We acknowledge the generative AI research advances from OpenAI, Google DeepMind, Meta, and the broader machine learning community that enable projects like this.