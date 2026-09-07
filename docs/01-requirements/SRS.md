# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the **Classroom Platform**, formalizing system behavior, external interfaces, performance constraints, and architectural attributes according to the IEEE 830 standard.

### 1.2 Scope of the System
Classroom Platform is a multi-client, distributed academic management and collaboration system. It provides academic administration, synchronous text/audio/video communication, media streaming, and file management for educational institutions.

```mermaid
graph LR
    subgraph Clients
        WebClient[Next.js Web Browser]
        MobileClient[React Native App]
    end

    subgraph Boundaries["System Boundary"]
        API[Spring Boot Application Server]
        MediaSFU[LiveKit WebRTC Server]
        StorageCluster[(PostgreSQL + Redis + MinIO)]
    end

    subgraph External["External Systems"]
        IdP[SAML / OIDC Identity Providers]
        PushService[Apple APNs / Google FCM]
    end

    WebClient <-->|HTTPS / WSS| API
    MobileClient <-->|HTTPS / WSS| API
    WebClient <-->|WebRTC| MediaSFU
    MobileClient <-->|WebRTC| MediaSFU

    API <--> StorageCluster
    MediaSFU <--> StorageCluster
    API --> IdP
    API --> PushService
```

---

## 2. Overall Description

### 2.1 Product Perspective
Classroom Platform operates as a distributed client-server system. The server components are containerized and orchestratable via Docker. The system supports multi-tenant cloud operations or single-tenant on-premises deployments.

### 2.2 User Classes and Characteristics
* **Super Administrator**: Complete authority over platform configuration, tenants, and infrastructure health.
* **Institution Administrator**: Manages institutional accounts, academic terms, departments, and course creation.
* **Teacher / Instructor**: Author of courses, assignments, rubrics, channel hierarchies, and grades. Host of live classes.
* **Teaching Assistant (TA)**: Can grade assignments, moderate channels, and co-host live sessions.
* **Student**: Enrolled participant who joins channels, submits coursework, views grades, and attends live sessions.
* **Observer / Auditor**: Read-only participant without submission or voice privileges.

---

## 3. External Interface Requirements

### 3.1 User Interfaces
* Web client responsive down to 360px viewport width.
* Mobile client optimized for iOS 16+ and Android 12+.
* Full keyboard navigation and screen-reader accessibility meeting WCAG 2.1 AA standards.

### 3.2 Hardware Interfaces
* Audio input/output devices and video webcams interfacing through standard WebRTC APIs.
* Mobile camera and biometric sensors (TouchID, FaceID, Fingerprint).

### 3.3 Software Interfaces
* **Database**: PostgreSQL 16+ via JDBC connection pooling.
* **Cache & PubSub**: Redis 7+ via Lettuce/Jedis drivers.
* **Object Storage**: S3-compliant REST API via AWS SDK.
* **Live Streaming**: LiveKit server via Server SDK and WebRTC protocol.

---

## 4. System Features & Behavioral Contracts

### 4.1 Synchronous Channel Messaging
* **Trigger**: A user sends a message in a text channel.
* **Precondition**: User is an enrolled member with `SEND_MESSAGES` permission in the target channel.
* **Sequence**:
  1. Client sends message payload via WebSocket (`/ws/channels/{id}/messages`).
  2. Server validates authorization, sanitizes Markdown, and persists message in PostgreSQL.
  3. Server publishes message event to Redis topic `channel:{id}:events`.
  4. All subscribed API instances broadcast the event to connected WebSocket clients within 100 ms.

### 4.2 Assignment Turn-In Pipeline
* **Trigger**: A student submits files for an assignment.
* **Precondition**: Current timestamp is prior to the assignment lock date; student is enrolled.
* **Sequence**:
  1. Client requests presigned upload URL from API.
  2. Client uploads file chunks directly to MinIO/S3 object storage.
  3. Client calls `/api/v1/assignments/{id}/submissions` with file metadata.
  4. Server creates an immutable submission record, stores timestamp, and notifies instructors.

### 4.3 WebRTC Live Lecture Orchestration
* **Trigger**: Instructor initiates a live class session in a Stage channel.
* **Sequence**:
  1. Server invokes LiveKit API to provision room `class:{id}:room:{roomId}`.
  2. Server generates cryptographic room tokens with specified role grants (Publisher for instructor, Subscriber for students).
  3. Clients connect directly to LiveKit SFU via WebRTC peer connections.
  4. If recording is enabled, server signals LiveKit Egress to begin composite streaming into MinIO.
