# Self-Hosted Deployment Infrastructure (`infrastructure/self-hosted/`)

## 1. Purpose of the Directory
`infrastructure/self-hosted/` contains structural blueprints, system prerequisite specifications, and orchestration topologies for running Classroom Platform on private, on-premises, or air-gapped institutional servers.

## 2. Self-Hosted Architecture Modes
1. **Single-Node All-In-One Topology**: Suitable for small schools, internal training labs, or home-lab self-hosters. All components (API, Web, DB, Redis, MinIO, LiveKit) run containerized on a single virtual or physical machine.
2. **Multi-Node Institutional Cluster**: Suitable for universities and regional academies requiring high availability, decoupled storage arrays, and dedicated media streaming nodes.

## 3. What Belongs Here
* Sizing guidelines (CPU, RAM, storage, network bandwidth requirements).
* Self-signed certificate and internal CA integration models.
* Automated offline/air-gapped installation guides.

## 4. What Does NOT Belong Here
* Live server credentials or private SSL certificates.
* Cloud-specific vendor templates (e.g., AWS CloudFormation).
