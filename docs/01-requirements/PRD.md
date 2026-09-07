# Product Requirements Document (PRD)

## 1. Document Control
* **Product**: Classroom Platform
* **Version**: 1.0.0-Draft
* **Status**: Approved for Architecture & Scaffolding Planning

---

## 2. Problem Statement & Strategic Objective

Higher education institutions, vocational academies, and remote learning organizations struggle with fractured workflows across isolated tools. Students juggle 3–5 different logins daily, resulting in late homework, fragmented communication, and disengagement.

**Strategic Objective**: Deliver a unified, self-hostable learning environment that combines academic rigor (assignments, rubrics, grading), fluid community interaction (channels, chat, voice), and live media streaming (WebRTC lectures, recordings) in a single platform.

---

## 3. Core Functional Requirements by Domain

### 3.1 Authentication & Identity
* **PRD-AUTH-01**: Support email/password, institutional SSO (Google Workspace, Microsoft Entra ID, SAML 2.0), and TOTP-based Multi-Factor Authentication.
* **PRD-AUTH-02**: Enforce secure session token rotation and refresh token revocation.

### 3.2 Users & Profiles
* **PRD-USER-01**: Provide rich user profiles with display names, pronouns, avatars, academic bios, and timezone settings.
* **PRD-USER-02**: Support real-time presence indicators (`Online`, `Idle`, `In Class`, `Do Not Disturb`, `Offline`).

### 3.3 Institutions & Tenancy
* **PRD-INST-01**: Support multi-tenancy with isolated academic terms, departments, domain-based auto-join rules, and institutional branding.

### 3.4 Classrooms & Membership
* **PRD-CLAS-01**: Provide course creation with syllabi, sections, and customizable channel categories.
* **PRD-MEMB-01**: Support role assignment (`Teacher`, `TA`, `Student`, `Observer`) and enrollment via join codes, direct invites, or CSV bulk import.

### 3.5 Channels & Messaging
* **PRD-CHAN-01**: Support Text Channels, Announcement Channels (restricted posting), Voice Channels, and Live Stage Channels.
* **PRD-MESS-01**: Provide rich Markdown text editing, code block syntax highlighting, message threads, reactions, pinned messages, and `@mentions`.

### 3.6 Files & Academic Media Library
* **PRD-FILE-01**: Enable chunked, resumable file uploads of arbitrary size (PDF, ZIP, MP4, CAD) backed by S3/MinIO.
* **PRD-FILE-02**: Provide inline file previews for images, PDF documents, code snippets, and audio/video files.

### 3.7 Assignments, Submissions & Grades
* **PRD-ASGN-01**: Support assignment creation with due dates, late-submission policies, multi-criterion rubrics, and file attachments.
* **PRD-SUBM-01**: Enable student file uploads, versioned resubmissions, and submission receipts.
* **PRD-GRAD-01**: Provide a comprehensive gradebook, rubric-based score calculation, private student feedback, and CSV grade export.

### 3.8 Live Classes & Recordings
* **PRD-LIVE-01**: Deliver WebRTC-powered virtual classrooms supporting 100+ concurrent audio/video participants per room.
* **PRD-LIVE-02**: Provide moderator stage controls: Raised Hand queue, mute all, screen share, and breakout rooms.
* **PRD-RECD-01**: Automatically capture and transcode live sessions into adaptive bitrate HLS/MP4 streams with chapter markers.

### 3.9 Notifications & Global Search
* **PRD-NOTF-01**: Deliver real-time notifications for assignment deadlines, grades, mentions, and class start events across web and mobile.
* **PRD-SRCH-01**: Provide unified full-text search across messages, course documents, assignment titles, and transcripts.

### 3.10 Moderation & Administration
* **PRD-MODR-01**: Provide automated profanity filtering, message moderation, user mutes, and audit logs.
* **PRD-ADMN-01**: Provide an administrative console for user lifecycle management, storage usage quotas, and system health monitoring.

---

## 4. Non-Functional Requirements (NFRs)

| Category | Requirement | Target Metric |
| :--- | :--- | :--- |
| **Performance** | API response latency (p95) | < 150 ms for transactional endpoints |
| **Realtime** | Chat message delivery latency | < 100 ms to connected clients |
| **Media Latency** | WebRTC live video latency | < 300 ms end-to-end |
| **Availability** | System uptime (cloud deployment) | 99.9% excluding scheduled maintenance |
| **Security** | Data encryption | TLS 1.3 in transit; AES-256 at rest |
| **Compliance** | Educational data compliance | Adherence to FERPA and GDPR principles |
