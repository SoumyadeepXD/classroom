# ADR-001: Proposed Core Technology Stack Selection

* **Status**: `PROPOSED`
* **Date**: 2026-09-08
* **Deciders**: Architecture Working Group
* **Consulted**: Engineering Team, Product Team

---

## 1. Context & Problem Statement

Classroom Platform requires an enterprise-ready, maintainable, highly concurrent technology foundation capable of supporting:
1. Complex transactional academic workflows (courses, rubrics, submissions, gradebooks, institutional audits).
2. Low-latency real-time collaboration (text channels, chat threads, presence, notifications).
3. Low-latency interactive video lectures (WebRTC stages, screen sharing, recording pipelines).
4. Multi-client support across web browsers, iOS, and Android.
5. Dual deployment models: hyperscale multi-tenant cloud and single-box self-hosted on-premises instances.

We need to establish a proposed technology direction for prototyping and evaluation before generating implementation source code.

---

## 2. Proposed Architectural Decision

We propose adopting the following technology stack for evaluation:

* **Backend API**: **Spring Boot (Java 21 LTS)**
  * *Rationale*: Strong type safety, mature ecosystem, enterprise security integrations, battle-tested concurrency, and native support for relational databases and WebSocket servers.
* **Web Frontend**: **Next.js (React 19 / TypeScript)**
  * *Rationale*: Server-side rendering (SSR), fast initial page loads, rich component ecosystem, and optimal developer ergonomics for complex desktop productivity layouts.
* **Mobile Frontend**: **React Native / Expo (TypeScript)**
  * *Rationale*: Single unified codebase targeting iOS and Android with near-native performance, background audio capabilities, camera document scanning, and shared TypeScript types with the web app.
* **Relational Database**: **PostgreSQL 16+**
  * *Rationale*: Rock-solid ACID guarantees for grades and submissions, combined with rich `JSONB` support for semi-structured rubrics and permissions.
* **Cache & Realtime PubSub**: **Redis 7+**
  * *Rationale*: In-memory speed for session state, ephemeral presence tracking, distributed rate limiting, and low-latency Pub/Sub event broadcasting across API instances.
* **Object Storage**: **MinIO / AWS S3-compatible storage**
  * *Rationale*: High-capacity binary file persistence with direct-to-storage presigned upload/download pipelines and seamless self-hosted deployment.
* **Media Streaming (SFU)**: **LiveKit**
  * *Rationale*: Modern, open-source WebRTC Selective Forwarding Unit supporting simulcast, mobile SDKs, automated composite recording via LiveKit Egress, and straightforward self-hosting.
* **Containerization**: **Docker & Docker Compose**
  * *Rationale*: Standardized packaging across development, CI/CD, cloud clustering, and one-click self-hosting.

---

## 3. Consequences & Trade-offs

### Positive
* Clear separation of concerns between media streaming (LiveKit), caching/events (Redis), and business logic (Spring Boot).
* High code reuse across frontend clients via shared TypeScript packages in `packages/`.
* Complete self-hostability without reliance on proprietary third-party cloud APIs.

### Negative / Challenges
* Maintaining a multi-language stack (Java backend, TypeScript frontends) requires cross-discipline developer skill sets.
* Operating LiveKit SFU media nodes on-premises requires careful UDP port allocation and network NAT configuration.
