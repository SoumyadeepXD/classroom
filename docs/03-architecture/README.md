# System Architecture & Technical Specifications (`docs/03-architecture/`)

This directory contains the foundational technical specifications, architectural blueprints, subsystem decoupling patterns, and infrastructure topologies for the Classroom Platform.

## Architecture Documents

1. [**system-architecture.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/03-architecture/system-architecture.md): Overall system topology, boundaries, cross-cutting concerns, and tier responsibilities.
2. [**backend-architecture.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/03-architecture/backend-architecture.md): Spring Boot service architecture, domain boundaries, transaction management, and persistence patterns.
3. [**frontend-architecture.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/03-architecture/frontend-architecture.md): Next.js web and React Native mobile client architectures, state management, and component hierarchies.
4. [**database-architecture.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/03-architecture/database-architecture.md): Relational data modeling principles, PostgreSQL optimization, JSONB strategies, and connection pooling.
5. [**realtime-architecture.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/03-architecture/realtime-architecture.md): WebSocket connection lifecycle, Redis Pub/Sub event backplane, and message delivery guarantees.
6. [**live-class-architecture.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/03-architecture/live-class-architecture.md): LiveKit WebRTC SFU streaming architecture, room topologies, and automated Egress recording pipelines.
7. [**file-storage-architecture.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/03-architecture/file-storage-architecture.md): MinIO/S3 object storage, presigned chunked multipart uploads, and virus scanning pipelines.
8. [**security-architecture.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/03-architecture/security-architecture.md): RBAC/ABAC authorization models, token lifecycles, encryption standards, and threat model analysis.
9. [**deployment-architecture.md**](file:///Users/soumyadeepxd/Developer/classroom/docs/03-architecture/deployment-architecture.md): Cloud-native multi-node clustering versus self-hosted single-box deployment topologies.
