# Product User Stories

This document captures agile user stories organized by product domain, following the standard format:
> *As a [user persona], I want to [action], so that [business value / outcome].*

---

## 1. Domain User Stories

### 1.1 Authentication & Users
* **US-AUTH-01**: As an Institutional Student or Faculty member, I want to sign in with my university Single Sign-On (SSO) account, so that I don't need to maintain separate credentials.
* **US-AUTH-02**: As an Instructor, I want to enable Multi-Factor Authentication (TOTP), so that unauthorized parties cannot compromise my account or tamper with grades.
* **US-USER-01**: As a Student, I want to set custom presence statuses (`Studying`, `In Class`, `Offline`), so that my peers know when I am available for group work.

### 1.2 Classrooms & Channels
* **US-CLAS-01**: As an Instructor, I want to create a classroom with defined terms and syllabus links, so that my course materials and students are neatly organized.
* **US-CHAN-01**: As an Instructor, I want to create dedicated announcement channels where only faculty can post, so that critical notices are not lost in general chat.
* **US-CHAN-02**: As a Student, I want to jump into persistent voice study rooms with my project team, so that we can collaborate on assignments with screen sharing.

### 1.3 Messaging & Real-Time Interaction
* **US-MESS-01**: As a Student, I want to post questions with formatted code blocks and mathematical notation, so that instructors and classmates can read my questions clearly.
* **US-MESS-02**: As a Teaching Assistant, I want to reply to student inquiries in threads, so that the main channel remains focused and clutter-free.
* **US-MESS-03**: As a Student, I want to react to announcements with emoji acknowledgments, so that instructors know I have read the update.

### 1.4 Files & Media Hub
* **US-FILE-01**: As an Instructor, I want to upload 1+ GB video lectures and lab software bundles without upload failures, so that students have access to complete course resources.
* **US-FILE-02**: As a Student, I want to preview PDF lecture slides directly in my browser without downloading them, so that I can quickly review notes between classes.

### 1.5 Assignments, Submissions & Grades
* **US-ASGN-01**: As an Instructor, I want to define multi-criterion rubrics for an assignment, so that grading expectations are transparent to students.
* **US-SUBM-01**: As a Student, I want to submit multiple files for my homework and receive a cryptographically verifiable turn-in receipt, so that I have proof of timely submission.
* **US-GRAD-01**: As an Instructor, I want to grade submissions using an interactive rubric scorecard, so that I can provide detailed feedback quickly.
* **US-GRAD-02**: As a Student, I want to view my grade and private instructor feedback as soon as it is published, so that I can understand how to improve.

### 1.6 Live Classes & Recordings
* **US-LIVE-01**: As an Instructor, I want to host interactive live lectures with 100+ students, so that I can teach remote sections effectively.
* **US-LIVE-02**: As a Student, I want to "Raise Hand" in a live lecture to ask a question via microphone, so that the session feels like an in-person seminar.
* **US-RECD-01**: As a Student, I want to watch recorded lectures with chapter markers and variable playback speeds (0.75x to 2.0x), so that I can study efficiently for exams.

### 1.7 Administration & Moderation
* **US-MODR-01**: As a Teaching Assistant, I want to delete inappropriate messages and temporarily mute disruptive users in text channels, so that academic discourse remains respectful.
* **US-ADMN-01**: As an Institutional IT Administrator, I want to inspect system audit logs and storage consumption metrics, so that I can maintain operational compliance and cost control.
