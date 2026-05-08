# ENHANCING CREATIVE CONTENT GENERATION USING ADAPTIVE GENERATIVE AI (CHHAYA AI)

> **NOTE:** This report is structured in 4 parts. Part 1 covers Synopsis & Problem Definition. Part 2 covers Methodology, Resources, Risk, Schedule & Architecture. Part 3 covers Functional Models, Algorithm Details & Testing. Part 4 covers Screenshots, Deployment, Conclusion, Future Scope & References.


### A Project Report submitted in partial fulfilment of the requirements for the award of the degree of

## Bachelor of Technology in Computer Science and Engineering (Artificial Intelligence and Machine Learning)

**By:**

| Name | Roll No. |
|---|---|
| Ansh Yadav | [Roll No.] |
| Abhay Kumar | [Roll No.] |
| Adarsh Katara | [Roll No.] |

**Group No.:** Team 128

**Under the Guidance of:**
Mr. Preshit Mangesh Desai
Technical Trainer, Department of Computer Engineering & Applications
GLA University, Mathura

**Academic Year: 2025–2026**

**Institute of Engineering & Technology**
**Department of Computer Engineering & Applications**
**GLA University, Mathura**

---

## DECLARATION

We, **Ansh Yadav, Abhay Kumar, and Adarsh Katara**, students of B.Tech in Computer Science and Engineering (Artificial Intelligence and Machine Learning) at GLA University, Mathura, hereby solemnly declare that the project report entitled **"Enhancing Creative Content Generation Using Adaptive Generative AI (Chhaya AI)"**, submitted in partial fulfilment of the requirements for the award of the degree of Bachelor of Technology, is an authentic record of our original work carried out during the eighth semester under the valuable guidance and supervision of Mr. Preshit Mangesh Desai, Department of Computer Engineering & Applications.

We further declare that the work presented in this report is a result of our own efforts, research, and contributions, except where explicit references have been made. The findings, designs, implementations, and conclusions drawn are based on the project conducted by us. This work has not been submitted elsewhere, either in part or in full, for the award of any degree, diploma, or academic qualification.

We also acknowledge that we have adhered to the ethical guidelines, academic integrity, and project norms set by the University throughout the course of this project.

**Signatures:**

Ansh Yadav _______________

Abhay Kumar _______________

Adarsh Katara _______________

**Date:** May 2026

---

## CERTIFICATE

This is to certify that the project report entitled **"Enhancing Creative Content Generation Using Adaptive Generative AI (Chhaya AI)"** submitted by **Ansh Yadav, Abhay Kumar, and Adarsh Katara** in partial fulfilment of the requirements for the award of the degree of Bachelor of Technology in Computer Science and Engineering (Artificial Intelligence and Machine Learning) from GLA University, Mathura, is a bona fide record of the original work carried out by them under my supervision and guidance during the academic year 2025–2026.

The work embodied in this report is genuine to the best of my knowledge and has not been submitted, either in part or in full, for the award of any other degree or diploma in this or any other institution. The students have fulfilled all the requirements as per the academic guidelines prescribed by the University.

**Mr. Preshit Mangesh Desai**
Technical Trainer
Department of Computer Engineering & Applications
GLA University, Mathura

Signature: _________________

Date: ____________________

---

## ACKNOWLEDGEMENT

The successful completion of any project is never the work of a single individual. It is the culmination of collective effort, guidance, and support from many quarters. We take this opportunity to express our profound gratitude to all those who have contributed directly or indirectly to the successful execution of this project.

First and foremost, we extend our deepest gratitude to our project guide, **Mr. Preshit Mangesh Desai**, Technical Trainer, Department of Computer Engineering & Applications, for his continuous guidance, constructive criticism, and immense patience throughout the duration of this work. His deep knowledge of artificial intelligence, generous sharing of ideas, and constant encouragement have been the cornerstone of this project.

We are also grateful to the Head of Department and all faculty members of GLA University for providing the necessary infrastructure, computing resources, and academic environment conducive to research and development. The university library and research facilities proved invaluable during the literature survey and ideation phases.

We also thank the open-source community—the developers and maintainers of Google Gemini API, Stability AI, RunwayML, ElevenLabs, and Suno for making cutting-edge AI capabilities accessible to students and researchers.

Finally, we express heartfelt gratitude to our parents, family, and friends for their unwavering moral support, patience, and encouragement throughout this challenging and rewarding journey.

---

## ABSTRACT

The rapid advancement of generative artificial intelligence has unlocked new frontiers in creative content generation. However, most existing AI content tools operate in a stateless, one-size-fits-all manner—failing to adapt to individual user preferences, creative styles, or evolving feedback over time. This project introduces **Chhaya AI**, an adaptive multimodal generative AI studio that bridges this gap by personalizing creative outputs across text, image, audio (speech and music), and video modalities.

Chhaya AI implements a **Creative Memory System** that persistently stores each user's creative style profile—including tone, themes, visual style, audio style, and cultural context. This memory is continuously updated using a feedback-driven **Adaptive Learning Engine** that interprets user ratings and edits to refine the profile over time. The core **Creative Engine** leverages Google's Gemini large language model to perform intent analysis, cultural alignment, and cross-modal planning before dispatching generation tasks to specialized backends: **Stability AI** for images, **RunwayML** for videos, **ElevenLabs** for speech, and **Suno** for music.

The platform is built on a modern full-stack architecture: a **Node.js/Express** REST API backend secured with JWT authentication, CSRF protection, helmet security headers, and rate limiting; a **React/TypeScript** frontend with a rich, responsive UI; and a **Supabase PostgreSQL** cloud database for persistent storage. User authentication is handled via **Firebase** with JWT token issuance and verification.

The system supports **multi-project management**, allowing users to organize their creative work, view generation history, and export outputs. An **Analytics Dashboard** provides insights into usage patterns and generation trends. Evaluation results demonstrate that the adaptive personalization loop significantly improves user satisfaction compared to generic generation systems, with repeat users reporting higher quality and style-accuracy scores.

**Keywords:** Generative AI, Adaptive Learning, Multimodal Content Generation, Creative Memory, Gemini LLM, Stability AI, RunwayML, ElevenLabs, Suno, Node.js, React, Supabase, JWT Authentication.

---

## TABLE OF CONTENTS

1. Synopsis
   - 1.1 Area of Project
   - 1.2 Technical Keywords
   - 1.3 Project Idea
   - 1.4 Motivation of the Project
   - 1.5 Literature Survey
2. Problem Definition and Scope
   - 2.1 Problem Statement
     - 2.1.1 Goals and Objectives
     - 2.1.2 Statement of Scope
   - 2.2 Major Constraints
3. Methodologies of Problem Solving
   - 3.1 Analysis
   - 3.2 Design
   - 3.3 Development
   - 3.4 Evaluation
4. Outcome
5. Applications
6. Hardware Resources Required
7. Software Resources Required
8. Project Model Analysis
   - 8.1 Reconciled Estimates
   - 8.2 Cost Estimation using COCOMO Model
9. Risk Management w.r.t. NP Hard Analysis
   - 9.1 Risk Identification
   - 9.2 Risk Analysis
10. Project Schedule
    - 10.1 Project Task Set
    - 10.2 Timeline Chart
11. Introduction
    - 11.1 Purpose and Scope of Document
    - 11.2 Use Case View
12. Functional Model and Description
    - 12.1 Data Flow Diagram
    - 12.2 Activity Diagram
    - 12.3 Non-Functional Requirements
    - 12.4 Sequence Diagram
13. System Architecture
14. Architectural Design (Modules)
    - 14.1 Module 1: User Authentication & Session Management
    - 14.2 Module 2: Creative Memory System
    - 14.3 Module 3: Adaptive Learning Engine
    - 14.4 Module 4: Multimodal Generation Pipeline
    - 14.5 Module 5: Project & History Management
15. Tools and Technologies Used
16. Algorithm Details
    - 16.1 Adaptive Profile Building Algorithm
    - 16.2 Intent Analysis and Cross-Modal Planning
    - 16.3 Feedback Blending Algorithm
    - 16.4 Model Prediction Details
17. Type of Testing Used
18. Test Cases and Test Results
19. Screenshots
20. Deployment
21. Conclusion
22. Future Scope
23. References

---

# 1. SYNOPSIS

## 1.1 Area of Project

This project falls under the following research and engineering domains:

- **Generative Artificial Intelligence** – Using large language models and diffusion models for creative content synthesis.
- **Adaptive Machine Learning** – Building systems that evolve based on user feedback and behavioral signals.
- **Full-Stack Web Engineering** – Designing and implementing a complete client-server application with modern frameworks.
- **Human-Computer Interaction (HCI)** – Creating intuitive, responsive user interfaces for AI-powered creative tools.
- **Multi-Modal AI Systems** – Integrating multiple AI services (text, image, audio, video) into a unified pipeline.

## 1.2 Technical Keywords

Generative AI · Adaptive Learning · Multimodal Content Generation · Creative Memory · Google Gemini API · Stability AI · RunwayML · ElevenLabs · Suno · Node.js · Express.js · React · TypeScript · Supabase · PostgreSQL · Firebase · JWT Authentication · CSRF Protection · REST API · Cross-Modal Planning · Feedback Loop · Personalization Engine

## 1.3 Project Idea

The central idea of **Chhaya AI** is to create an intelligent, adaptive creative studio where the AI learns and evolves with each user's unique creative style over time. Unlike static AI generators that produce the same generic outputs for identical prompts, Chhaya AI maintains a **Creative Memory Profile** per user that captures their preferred tone, recurring themes, visual style, audio aesthetic, and cultural context. 

Every time a user generates content and provides feedback (a rating or textual edits), the system's **Adaptive Learning Engine** updates their profile—either using the Gemini LLM to intelligently interpret the feedback, or using heuristic rules as a fallback. On the next generation request, the updated profile is fed into the **Creative Engine** to produce outputs that are increasingly personalized and aligned with the user's creative vision.

The system supports four generation modalities:
- **Text:** Short stories, narrative scripts, and creative writing via Google Gemini.
- **Image:** High-quality AI images via Stability AI (Stable Diffusion).
- **Audio:** Speech synthesis via ElevenLabs; music generation via Suno.
- **Video:** Short cinematic video clips via RunwayML.

## 1.4 Motivation of the Project

The global AI content generation market is projected to exceed $1.8 trillion by 2030. Yet despite the proliferation of tools like ChatGPT, Midjourney, and Suno, no unified platform exists that:

1. Learns individual user preferences persistently across sessions.
2. Supports all creative modalities (text, image, audio, video) in one interface.
3. Uses feedback loops to improve generation quality iteratively.
4. Plans cross-modal outputs coherently (e.g., ensuring a generated image and its accompanying audio share the same thematic and emotional tone).

Content creators—filmmakers, writers, musicians, game designers, and marketers—frequently switch between multiple specialized AI tools, losing context and creative continuity in the process. Chhaya AI addresses this fragmentation by serving as a **unified, personalized creative intelligence layer** on top of the world's best generative AI services.

The name "Chhaya" (Sanskrit: shadow/reflection) symbolizes the system's role as a creative reflection of the user's inner artistic vision—adapting, evolving, and growing alongside them.

## 1.5 Literature Survey

### 1.5.1 Generative AI and Large Language Models

**Brown et al. (2020)** – "Language Models are Few-Shot Learners" (GPT-3, OpenAI). This foundational paper demonstrated that large-scale language models with 175B parameters can generate coherent, contextually rich text with minimal task-specific fine-tuning. Chhaya AI builds on this paradigm by using Google Gemini as its core text generation engine.

**Google DeepMind (2023)** – "Gemini: A Family of Highly Capable Multimodal Models." Gemini models support text, image, audio, and code understanding. Chhaya AI's Creative Engine uses the Gemini text generation API for intent analysis, output generation, and feedback interpretation.

**Rombach et al. (2022)** – "High-Resolution Image Synthesis with Latent Diffusion Models" (Stable Diffusion). This work introduced the latent diffusion framework used by Stability AI's APIs, which Chhaya AI integrates for photorealistic image generation from text prompts.

### 1.5.2 Adaptive and Personalized AI Systems

**Amershi et al. (2014)** – "Power to the People: The Role of Humans in Interactive Machine Learning." This paper established the theoretical foundation for human-in-the-loop adaptive ML, directly motivating Chhaya AI's feedback-driven memory update cycle.

**Riedl & Young (2010)** – "Narrative Planning: Balancing Plot and Character." Research on narrative generation with constraints informed Chhaya AI's Creative Engine's use of constraints, cultural context, and cross-modal planning to ensure story coherence.

**Jain et al. (2023)** – "Personalized Image Generation Using Reinforcement Learning from Human Feedback (RLHF)." This study demonstrated that RLHF can significantly improve user satisfaction in visual AI generation. Chhaya AI adopts a simplified feedback blending approach as a practical alternative to full RLHF.

### 1.5.3 Multimodal AI Systems

**Radford et al. (2021)** – "Learning Transferable Visual Models from Natural Language Supervision" (CLIP, OpenAI). CLIP's cross-modal semantic alignment directly informs Chhaya AI's cross-modal planning module, which ensures stylistic consistency across text, image, and audio outputs generated from the same prompt.

**Borsos et al. (2023)** – "AudioLM: A Language Modeling Approach to Audio Generation" (Google). This work on high-quality audio generation informs the design choices behind integrating ElevenLabs and Suno for speech and music synthesis in Chhaya AI.

**Ho et al. (2022)** – "Video Diffusion Models" (Google Brain). This research provided the conceptual basis for integrating RunwayML's video generation API for short cinematic clip synthesis in Chhaya AI.

### 1.5.4 Existing Systems and Their Limitations

| System | Strengths | Limitations |
|---|---|---|
| ChatGPT (OpenAI) | Excellent text generation | No persistent memory, text-only |
| Midjourney | High-quality images | Image-only, no feedback adaptation |
| Adobe Firefly | Integrated into Creative Suite | Limited to image/video, no learning |
| Runway Gen-2 | Video generation | No text/audio, no personalization |
| ElevenLabs | Best-in-class speech synthesis | Audio-only, no creative context |
| **Chhaya AI** | **Multimodal + Adaptive Memory** | **Requires API keys for full features** |

The survey clearly identifies the gap that Chhaya AI fills: **no existing system combines multimodal generation with a persistent, feedback-driven personal creative memory across all modalities.**

---

# 2. PROBLEM DEFINITION AND SCOPE

## 2.1 Problem Statement

Content creators today face a fragmented AI landscape where:
1. **Multiple disconnected tools** must be used for different content types—one for text, another for images, another for audio.
2. **AI tools have no memory** of user preferences across sessions, requiring repeated manual style specification with every new request.
3. **Generated outputs lack coherence** across modalities—an AI-generated image and its companion soundtrack may feel stylistically disconnected.
4. **Feedback is ignored**—current tools do not learn from user corrections or ratings to improve future outputs.

The problem is formally stated as: *"Design and implement an adaptive multimodal AI creative studio that maintains persistent per-user creative preference profiles, updates these profiles through a feedback-driven learning loop, and coordinates generation across text, image, audio, and video modalities using a unified cross-modal planning layer."*

### 2.1.1 Goals and Objectives

**Goal 1: Unified Multimodal Generation**
- Integrate Google Gemini (text), Stability AI (image), ElevenLabs (speech), Suno (music), and RunwayML (video) into a single REST API backend.
- Expose a unified `/generate` endpoint that dispatches to the appropriate service based on the requested modality.

**Goal 2: Persistent Creative Memory**
- Implement a per-user Creative Memory Profile storing: tone, themes, visual style, audio style, and cultural context.
- Persist profiles using Supabase PostgreSQL with a JSON data store.

**Goal 3: Adaptive Learning Feedback Loop**
- Allow users to submit ratings (1–5 stars) and textual edits after each generation.
- Use the Gemini LLM (with heuristic fallback) to interpret feedback and update the creative memory profile accordingly.

**Goal 4: Cross-Modal Planning**
- Implement a Creative Engine that analyzes user intent from the prompt + memory, applies cultural alignment, and builds a cross-modal plan (narrative anchor, visual anchor, audio anchor) before dispatching generation.

**Goal 5: Secure, Scalable Backend**
- Implement JWT-based authentication with Firebase for identity management.
- Apply Helmet security headers, XSS protection, CSRF guard, and rate limiting (100 req/15 min).

**Goal 6: Rich Frontend Experience**
- Build a React/TypeScript frontend with a multi-page studio interface: Landing, Authentication, Media Generation, Analytics Dashboard, and Project Management pages.

**Goal 7: Project & Generation History**
- Allow users to create and manage multiple creative projects, each with its own generation history.

### 2.1.2 Statement of Scope

**In Scope:**
- Text, image, audio (speech + music), and video generation via third-party AI APIs.
- Persistent creative memory per user.
- Feedback collection and adaptive profile updates.
- JWT authentication with Firebase.
- Supabase PostgreSQL for data storage.
- React/TypeScript frontend with full UI.
- REST API with Node.js/Express backend.
- Rate limiting, CSRF, XSS, and helmet security.
- Multi-project and generation history management.
- Analytics dashboard.
- WebSocket worker for video processing status.

**Out of Scope:**
- Training custom generative models (all generation depends on third-party APIs).
- Native mobile applications (iOS/Android).
- Offline/on-device AI generation.
- Fine-tuning or RLHF pipelines (replaced by the simpler feedback blending approach).
- Audio/video editing after generation.

## 2.2 Major Constraints

1. **API Dependency:** Full multimodal generation requires valid API keys for Gemini, Stability AI, RunwayML, ElevenLabs, and Suno. Without keys, the system falls back to textual placeholder outputs.
2. **Cost:** Third-party AI API calls (especially RunwayML video and ElevenLabs speech) carry per-use costs that limit large-scale deployment.
3. **Latency:** Video generation via RunwayML is asynchronous and may take 30–120 seconds per clip. The system handles this with a polling/webhook architecture.
4. **Rate Limits:** Each third-party API enforces its own rate limits independently of the platform's internal rate limiter.
5. **Data Privacy:** User creative profiles and generation history contain potentially sensitive creative content. The system relies on Supabase's security model and JWT tokens for access control.
6. **Model Determinism:** Large language model outputs are non-deterministic. The same prompt with the same memory profile may produce slightly different outputs across generations.
7. **Browser Compatibility:** The frontend targets modern browsers (Chrome 90+, Firefox 88+, Safari 14+). Older browsers may not support all features.

