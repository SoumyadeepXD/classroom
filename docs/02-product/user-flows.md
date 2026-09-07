# Core User Flows

This document details the primary user journeys across the **Classroom Platform**, mapping user interactions across web and mobile interfaces.

---

## 1. Flow 1: Course Onboarding & Classroom Setup (Instructor)

```mermaid
sequenceDiagram
    autonumber
    actor Instructor as Professor Elena
    participant Web as Web Frontend
    participant API as Backend API
    participant DB as PostgreSQL

    Instructor->>Web: Click "Create New Classroom"
    Web->>Instructor: Present Course Details Form
    Instructor->>Web: Enter Title, Code, Term, Syllabus
    Web->>API: POST /api/v1/classrooms
    API->>DB: Insert Classroom, Sections & Default Channels
    API-->>Web: Return Classroom Object with Join Code
    Web->>Instructor: Render Classroom Dashboard & Shareable Join Code
    Instructor->>Web: Configure Custom Categories & Voice Rooms
    Web->>API: POST /api/v1/classrooms/{id}/channels
    API-->>Web: Channel Tree Updated in Real-Time
```

---

## 2. Flow 2: Assignment Lifecycle (Publish, Submit, Grade)

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Professor Elena
    actor Student as Marcus Vance
    participant Web as Web / Mobile App
    participant API as Backend API
    participant Storage as MinIO Storage
    participant DB as PostgreSQL

    Note over Teacher,DB: Step A: Assignment Creation
    Teacher->>Web: Create Assignment with Rubric & Due Date
    Web->>API: POST /api/v1/assignments
    API->>DB: Save Assignment & Rubric Rules
    API-->>Student: Push Notification: "New Assignment Published"

    Note over Student,DB: Step B: Student Turn-In
    Student->>Web: Open Assignment & Upload Project Files
    Web->>API: POST /api/v1/files/presign-upload
    API-->>Web: Presigned S3 Upload URL
    Web->>Storage: Direct Multipart Binary Upload
    Web->>API: POST /api/v1/assignments/{id}/submissions
    API->>DB: Save Submission Record (Timestamped)
    API-->>Student: Issue Turn-In Receipt

    Note over Teacher,DB: Step C: Evaluation & Feedback
    Teacher->>Web: Open Submission in Gradebook View
    Web->>Storage: Stream File Preview
    Teacher->>Web: Enter Rubric Scores & Private Feedback
    Web->>API: POST /api/v1/submissions/{id}/grade
    API->>DB: Commit Grade & Recalculate Weighted Average
    API-->>Student: Push Notification: "Grade Published"
```

---

## 3. Flow 3: Live Class Stage & Automated Recording

```mermaid
sequenceDiagram
    autonumber
    actor Instructor as Professor Elena
    actor Student as Marcus Vance
    participant Web as Client App
    participant API as Backend API
    participant SFU as LiveKit SFU
    participant Egress as LiveKit Egress
    participant MinIO as Object Storage

    Instructor->>Web: Click "Start Live Class" on Stage Channel
    Web->>API: POST /api/v1/classrooms/{id}/live-classes/start
    API->>SFU: Create Room & Issue Host Token
    API-->>Web: Return WebRTC Session Token
    Web->>SFU: Connect WebRTC Peer Connection (Publish Audio/Video)
    API->>Egress: Start Composite Egress Recording

    Student->>Web: Join Live Lecture
    Web->>API: POST /api/v1/classrooms/{id}/live-classes/join
    API-->>Web: Return Viewer Token
    Web->>SFU: Connect WebRTC (Subscribe to Instructor Stream)

    Student->>Web: Click "Raise Hand"
    Web->>API: POST /api/v1/live-classes/{id}/raise-hand
    API-->>Instructor: Notification: "Marcus raised hand"
    Instructor->>Web: Promote Marcus to Speaker
    Web->>API: POST /api/v1/live-classes/{id}/promote
    API->>SFU: Update Marcus Grant to Publisher
    Marcus->>SFU: Publish Audio/Video Question

    Instructor->>Web: End Live Session
    Web->>API: POST /api/v1/live-classes/{id}/end
    API->>SFU: Close Room
    API->>Egress: Stop Egress Recording
    Egress->>MinIO: Flush MP4 Video & HLS Manifest
    API->>API: Index Recording in Classroom Academic Library
```
