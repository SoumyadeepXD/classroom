# Feature Matrix

This matrix maps capabilities across the 19 core product domains, indicating platform availability across client form factors and phased delivery targets.

---

## 1. Domain Capability Matrix

| Domain | Feature Capability | Web App | Mobile App | Admin Portal | Target Phase |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Authentication** | Email/Password & Session Tokens | Yes | Yes | Yes | Phase 1 |
| | Institutional SSO (SAML/OIDC) | Yes | Yes | Yes | Phase 1 |
| | Multi-Factor Authentication (TOTP) | Yes | Yes | Yes | Phase 1 |
| **Users** | Profile Customization & Avatars | Yes | Yes | No | Phase 1 |
| | Real-time Presence Indicators | Yes | Yes | No | Phase 2 |
| **Institutions** | Tenant Onboarding & Branding | No | No | Yes | Phase 1 |
| | Academic Calendar & Term Setup | No | No | Yes | Phase 1 |
| **Classrooms** | Course Creation & Syllabi Setup | Yes | View Only | Yes | Phase 1 |
| | Section Allocation & Archival | Yes | No | Yes | Phase 1 |
| **Membership** | Join Code Generation & Enrollment | Yes | Yes | Yes | Phase 1 |
| | Role Assignment & Roster Management| Yes | View Only | Yes | Phase 1 |
| **Channels** | Categorized Channel Trees | Yes | Yes | No | Phase 2 |
| | Voice & Stage Channel Creation | Yes | View Only | No | Phase 2 |
| **Messaging** | Rich-Text Chat & Code Highlighting | Yes | Yes | No | Phase 2 |
| | Threads, Reactions & Pinned Notes | Yes | Yes | No | Phase 2 |
| **Files** | Resumable Chunked File Uploads | Yes | Yes | No | Phase 2 |
| | Document Previews & Media Hub | Yes | Yes | No | Phase 2 |
| **Assignments** | Assignment Authoring & Rubrics | Yes | No | No | Phase 1 |
| | Due Date Calendaring & Deadlines | Yes | Yes | No | Phase 1 |
| **Submissions** | File Submission & Turn-In Workflow | Yes | Yes | No | Phase 1 |
| | Mobile Camera Document Scanner | No | Yes | No | Phase 4 |
| **Grades** | Multi-Criteria Rubric Grading | Yes | No | No | Phase 1 |
| | Student Gradebook & Feedback View | Yes | Yes | No | Phase 1 |
| **Live Classes** | Multi-party WebRTC Video Lectures | Yes | Yes | No | Phase 3 |
| | Screen Sharing & Raised Hand Queue | Yes | Yes | No | Phase 3 |
| | Interactive Breakout Rooms | Yes | Audio Only | No | Phase 3 |
| **Recordings** | Automated Egress Recording | Automated | Automated | Automated | Phase 3 |
| | Chaptered Video Playback & Seeking | Yes | Yes | No | Phase 3 |
| **Notifications** | Real-time WebSocket In-App Feed | Yes | Yes | Yes | Phase 2 |
| | Push Notifications (APNs / FCM) | No | Yes | No | Phase 4 |
| **Search** | Global Full-Text Search | Yes | Yes | No | Phase 5 |
| **Moderation** | Automated Filters & Mute Actions | Yes | Yes | Yes | Phase 2 |
| | Immutable Audit Log Inspection | No | No | Yes | Phase 5 |
| **Administration** | Health Dashboards & Metrics | No | No | Yes | Phase 5 |
| | Storage Quota & License Management | No | No | Yes | Phase 5 |
| **Security** | End-to-End Encryption at Rest/Transit | System | System | System | Phase 1 |
| | RBAC & ABAC Fine-Grained Rules | System | System | System | Phase 1 |
| **Deployment** | Multi-Target Docker Packaging | Cloud | Cloud | Self-Host | Phase 5 |
| | Air-Gapped Single-Node Runbook | N/A | N/A | Self-Host | Phase 5 |
