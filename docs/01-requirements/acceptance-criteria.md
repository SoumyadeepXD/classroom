# Acceptance Criteria & Definition of Done

This document establishes formal, testable acceptance criteria across the core domains of the **Classroom Platform**. These criteria serve as the benchmark for feature completion during future implementation sprints.

---

## 1. Definition of Done (DoD)

A user story or technical task is considered **Done** only when:
1. **Specification Alignment**: The implementation satisfies all functional and non-functional requirements in `PRD.md` and `SRS.md`.
2. **Domain Integrity**: All domain boundaries are preserved without leaky cross-package couplings.
3. **Automated Testing**: Unit tests pass with >= 80% coverage; integration and API contract tests pass.
4. **Security Hardening**: Authorization checks (RBAC/ABAC) are verified with negative test cases; inputs are sanitized.
5. **Documentation Synchronization**: API documentation under `docs/05-api/` and schemas under `docs/04-database/` reflect all changes.

---

## 2. Acceptance Criteria by Domain

### 2.1 Authentication & Users
* **AC-AUTH-01**: Given valid credentials, when a user logs in, then a cryptographically signed JWT access token (15m expiry) and refresh token (7d expiry) are issued.
* **AC-AUTH-02**: Given an expired access token, when a client calls `/api/v1/auth/refresh`, then a new access token is returned without user re-authentication.
* **AC-USER-01**: Given an active WebSocket connection, when a user becomes inactive for 5 minutes, their presence state automatically transitions from `ONLINE` to `IDLE`.

### 2.2 Classrooms & Membership
* **AC-CLAS-01**: When an instructor creates a classroom, a default `General` text channel and `Announcements` channel are provisioned automatically.
* **AC-MEMB-01**: When a student enters a valid 8-character join code, they are enrolled with the `STUDENT` role and receive immediate access to the classroom channels.

### 2.3 Channels & Messaging
* **AC-CHAN-01**: Given an announcement channel, students can read messages but cannot publish or reply unless granted explicit permissions.
* **AC-MESS-01**: When a user sends a message containing Markdown or code blocks, all connected channel members receive the parsed event within 100 ms via WebSocket.
* **AC-MESS-02**: When a parent message is deleted by an instructor, all nested thread replies and attachments are soft-deleted and an audit log event is generated.

### 2.4 Assignments, Submissions & Grades
* **AC-ASGN-01**: When an assignment due date passes, subsequent submission attempts are marked `LATE` or rejected according to the assignment's late-submission policy.
* **AC-SUBM-01**: A student can upload up to 10 files (max 2 GB per file) per submission. Uploads must support chunked resumability.
* **AC-GRAD-01**: When a teacher assigns rubric scores and releases grades, the student receives an immediate notification, and the classroom gradebook recalculates weighted averages.

### 2.5 Live Classes & Recordings
* **AC-LIVE-01**: Up to 100 students can join a live stage channel simultaneously with active audio/video latency below 300 ms.
* **AC-LIVE-02**: When a student clicks "Raise Hand", an indicator appears in the instructor's moderation queue; the instructor can promote the student to speaker with one click.
* **AC-RECD-01**: When a live lecture ends, LiveKit Egress must finalize the composite MP4 recording, upload it to MinIO, and make it available in the classroom library within 5 minutes.
