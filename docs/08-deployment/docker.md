# Docker Containerization Strategy

## 1. Containerization Principles

1. **Multi-Stage Builds**: Separate compilation environments (JDK, Node build tooling) from lean runtime execution containers to minimize image sizes.
2. **Non-Root Execution**: Application processes must never run as `root` inside containers; dedicated service users (`classroom`) are created in each image.
3. **Deterministic Base Images**: Base images must be pinned to specific SHA-256 digests or exact version tags (e.g., `eclipse-temurin:21-jre-alpine`).

---

## 2. Image Architecture Blueprints

### 2.1 Backend API Container Blueprint
* **Stage 1 (Build)**:
  * Base: `eclipse-temurin:21-jdk-alpine`
  * Action: Mount dependency cache, execute package compilation, generate Spring Boot executable JAR.
* **Stage 2 (Runtime)**:
  * Base: `eclipse-temurin:21-jre-alpine`
  * Action: Copy extracted layers (`dependencies`, `spring-boot-loader`, `application`), configure JVM memory flags (`-XX:+UseZGC -XX:MaxRAMPercentage=75.0`), expose port `8080`, drop privileges to non-root user `spring`.

### 2.2 Web Application Container Blueprint
* **Stage 1 (Build)**:
  * Base: `node:20-alpine`
  * Action: Install monorepo dependencies, run Next.js standalone build (`output: "standalone"`).
* **Stage 2 (Runtime)**:
  * Base: `node:20-alpine`
  * Action: Copy standalone server bundle, static assets, expose port `3000`, run via `node server.js` under non-root user `nextjs`.

---

## 3. Container Security Hardening

* Read-only root filesystems where practical, with designated temporary write mounts (`/tmp`).
* Regular vulnerability scans via Trivy and GitHub Dependabot.
* Minimal attack surface by selecting Alpine Linux or Distroless container bases.
