# Infrastructure Specifications (`infrastructure/`)

## 1. Purpose of the Directory
The `infrastructure/` directory contains structural blueprints and architecture declarations for deploying, orchestrating, and operating the Classroom Platform across cloud and self-hosted environments.

## 2. Directory Layout

```text
infrastructure/
├── README.md             # Infrastructure overview
├── docker/               # Container image specifications (backend, web, mobile)
├── database/             # Database initialization and management blueprints
├── postgres/             # PostgreSQL high-availability and cluster blueprints
├── redis/                # Redis cluster, sentinel, and persistence specs
├── minio/                # MinIO S3-compatible object storage topology
├── livekit/              # LiveKit SFU media streaming server infrastructure
├── reverse-proxy/        # Nginx/Envoy edge routing and TLS termination
├── monitoring/           # Prometheus, Grafana, and OpenTelemetry blueprints
├── environments/         # Environment target definitions (dev, staging, prod)
└── self-hosted/          # Self-hosted / on-premise single-node and multi-node blueprints
```

## 3. What Belongs Here
* Containerization definitions and base image strategies.
* Reverse proxy routing rules, SSL/TLS termination designs, and ingress definitions.
* High availability, replication, and persistence specifications for databases and storage.
* Observability and telemetry infrastructure blueprints.

## 4. What Does NOT Belong Here
* Application business logic (belongs in `backend/` or `apps/`).
* Plaintext credentials, live secrets, or private certificates.
* Executable Dockerfiles or docker-compose files prior to official infrastructure scaffolding phase.

## 5. Relationship to Other Directories
* Supports running `backend/api/` and `apps/web/`.
* Aligns with deployment guides in `docs/08-deployment/`.
