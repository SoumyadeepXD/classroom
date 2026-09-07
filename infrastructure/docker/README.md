# Docker Container Infrastructure (`infrastructure/docker/`)

## 1. Purpose of the Directory
`infrastructure/docker/` defines the containerization strategy and directory structure for building reproducible Docker images for the various platform subsystems.

## 2. Directory Structure

```text
infrastructure/docker/
├── README.md             # Containerization overview
├── backend/              # Multi-stage build blueprints for Spring Boot API
├── web/                  # Multi-stage build blueprints for Next.js web application
└── mobile/               # Containerized build blueprints for mobile bundling (Expo/Android)
```

## 3. What Belongs Here
* Multi-stage build documentation and specifications.
* Base image selections (e.g., Eclipse Temurin JRE for backend, Node Alpine for web).
* Layer caching strategies and container hardening guidelines.

## 4. What Does NOT Belong Here
* Concrete application source code.
* Runtime environment `.env` secrets.
* Executable Dockerfiles prior to scaffolding phase.
