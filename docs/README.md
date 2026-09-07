# System Documentation (`docs/`)

Welcome to the comprehensive documentation suite for the **Classroom Platform**.

This directory serves as the single source of truth for the project's requirements, product vision, system architecture, database design, API contracts, engineering standards, deployment runbooks, and architectural decisions.

---

## 1. Documentation Index

The documentation is logically partitioned into ten numbered modules:

```text
docs/
├── 00-project/        # Vision, project glossary, and long-term milestones
├── 01-requirements/   # PRD, SRS, feature matrix, and acceptance criteria
├── 02-product/        # User personas, core user flows, and user stories
├── 03-architecture/   # System, backend, frontend, realtime, live-class, and security architectures
├── 04-database/       # Entity relationships, data schemas, and migration strategies
├── 05-api/            # REST API endpoints, WebSocket contracts, and domain specifications
├── 06-design/         # Design tokens, information architecture, web/mobile UX, and accessibility
├── 07-engineering/    # Coding conventions, testing strategies, logging, and observability
├── 08-deployment/     # Local development, containerization, production, and self-hosting runbooks
└── 09-decisions/      # Architectural Decision Records (ADR 001 - 005)
```

---

## 2. Core Product Domains

All documentation files adhere to a consistent terminology framework covering the 19 core domains:

1. **Authentication**: Identity verification, multi-factor auth, session lifecycle, institutional SSO.
2. **Users**: User profiles, roles, account management, presence states.
3. **Institutions**: Organizational tenancy, academic term calendars, institutional governance.
4. **Classrooms**: Academic course containers, syllabus structure, section allocations.
5. **Membership**: Course enrollment rosters, role assignments, join approvals.
6. **Channels**: Categorized communication streams (Text, Voice, Announcements, Live Stages).
7. **Messaging**: Real-time discussions, rich formatting, message threads, reactions.
8. **Files**: Secure object storage, file chunking, virus inspection, academic libraries.
9. **Assignments**: Homework tasks, due date scheduling, rubric criteria definition.
10. **Submissions**: Student artifact submission, version histories, turn-in workflows.
11. **Grades**: Rubric evaluations, scorecards, student feedback, gradebook analytics.
12. **Live Classes**: Low-latency WebRTC lectures, interactive stages, breakout rooms.
13. **Recordings**: Automated lecture capture, media transcoding, chapter indexing.
14. **Notifications**: Push notifications, in-app activity feeds, email digests.
15. **Search**: Full-text indexing across course materials, chats, and assignments.
16. **Moderation**: Content filtering, user muting, report auditing, role enforcement.
17. **Administration**: System health dashboards, tenant onboarding, audit logging.
18. **Security**: Data protection at rest and in transit, RBAC/ABAC authorization models.
19. **Deployment**: Containerized orchestration, cloud infrastructure, and self-hosting runbooks.

---

## 3. Maintenance Rules

* **Markdown First**: All documentation must be written in standard GitHub Flavored Markdown.
* **Diagrams**: All diagrams must be written using embedded `mermaid` syntax to ensure version traceability.
* **No Implementation Code**: Do not include operational application code or deployment credentials in documentation files.
