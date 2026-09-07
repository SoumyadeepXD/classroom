# Core Backend API Service (`backend/api/`)

## 1. Purpose of the Directory
`backend/api/` contains the structural blueprint for the core backend API service of the Classroom Platform.

The proposed architecture utilizes **Spring Boot** to provide:
* High-throughput REST API endpoints for academic workflows and administrative operations.
* WebSocket servers for low-latency messaging, presence updates, and notification pushes.
* LiveKit server token minting, room orchestration, and webhook ingestion for live classes.
* Strict Role-Based and Attribute-Based Access Control (RBAC/ABAC).

## 2. Java Package Architecture (Proposed)

Package root: `com.classroom.platform`

```text
backend/api/
├── README.md
├── docs/                 # Service-specific implementation notes
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/classroom/platform/
    │   │       ├── config/           # Spring Boot configuration beans
    │   │       ├── security/         # Security filters, JWT authentication, RBAC
    │   │       ├── auth/             # Authentication domain
    │   │       ├── users/            # Users domain
    │   │       ├── institutions/     # Institutions domain (multi-tenancy)
    │   │       ├── classrooms/       # Classrooms & courses domain
    │   │       ├── channels/         # Channel management domain
    │   │       ├── messaging/        # Chat & real-time messaging domain
    │   │       ├── files/            # File management & storage domain
    │   │       ├── assignments/      # Assignments & rubrics domain
    │   │       ├── submissions/      # Submissions domain
    │   │       ├── grades/           # Gradebook & grading domain
    │   │       ├── live/             # Live class orchestration domain
    │   │       ├── recordings/       # Recording & playback domain
    │   │       ├── notifications/    # In-app and push notification domain
    │   │       ├── search/           # Search indexing & query domain
    │   │       ├── administration/   # System administration domain
    │   │       ├── common/           # Shared exceptions, pagination, utilities
    │   │       └── infrastructure/   # Database clients, Redis, MinIO, LiveKit clients
    │   └── resources/                # Application properties, templates, migration files
    └── test/
        └── java/                     # Unit and integration test suites
```

## 3. What Belongs Here
* Domain service definitions, controllers, entities, repositories, and DTOs (during implementation phase).
* Business validation rules, transactional boundaries, and security enforcement.
* Real-time socket handlers and event publishers.

## 4. What Does NOT Belong Here
* Frontend client UI logic (belongs in `apps/`).
* Standalone shell scripts (belongs in `scripts/`).
* Implementation code prior to official project kickoff.

## 5. Implementation Status Note
> [!IMPORTANT]
> No `.java` source files, build manifests (`pom.xml` / `build.gradle`), or configuration files are present at this time. The folder hierarchy serves strictly as a structural blueprint.
