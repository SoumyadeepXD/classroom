# API Specifications & Contracts (`docs/05-api/`)

This directory documents the external and internal API contracts for the Classroom Platform. It covers REST endpoints, WebSocket real-time event interfaces, and LiveKit WebRTC signaling protocols.

## API Documentation Index

1. [**api-overview.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/api-overview.md): API conventions, versioning, standard headers, rate limits, and error payloads.
2. [**authentication.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/authentication.md): Authentication endpoints, MFA challenges, session refresh, and SSO callbacks.
3. [**users.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/users.md): User profile management, avatar updates, and presence endpoints.
4. [**institutions.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/institutions.md): Tenant administration, department management, and academic term setup.
5. [**classrooms.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/classrooms.md): Course CRUD, join codes, syllabus management, and section allocations.
6. [**channels.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/channels.md): Channel trees, category groupings, and permission overrides.
7. [**messaging.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/messaging.md): Chat persistence, message threads, reactions, and WebSocket event contracts.
8. [**files.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/files.md): Presigned multipart upload initiation, chunk completion, and asset streaming.
9. [**assignments.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/assignments.md): Assignment authoring, rubric criteria definitions, and deadline rules.
10. [**submissions.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/submissions.md): Student turn-in endpoints, revision tracking, and submission receipts.
11. [**grades.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/grades.md): Rubric scorecards, private feedback, grade release, and gradebook exports.
12. [**live-classes.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/live-classes.md): Live lecture room provisioning, WebRTC token minting, and stage moderation.
13. [**recordings.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/recordings.md): Recording archive playback, chapter markers, and HLS stream manifests.
14. [**notifications.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/notifications.md): Notification feed retrieval, read receipts, and device token registration.
15. [**search.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/search.md): Global multi-entity full-text search endpoints.
16. [**administration.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/administration.md): Platform telemetry, tenant governance, and security audit log queries.
