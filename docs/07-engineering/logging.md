# Logging Architecture & Privacy Controls

## 1. Structured Logging Standards

All platform logs must be emitted as single-line, structured **JSON objects** to stdout. This enables automated ingestion, indexing, and querying by log aggregation pipelines (e.g., Loki, OpenSearch, Elasticsearch).

### Standard JSON Log Fields
```json
{
  "timestamp": "2026-09-08T10:15:32.412Z",
  "level": "INFO",
  "service": "classroom-api",
  "traceId": "c89f01ab3284",
  "spanId": "9a71b2ef",
  "userId": "0191c7a8-4235-7cb2-b430-c3d3170a7b45",
  "institutionId": "0191c7a0-0000-7000-8000-000000000001",
  "logger": "com.classroom.platform.assignments.AssignmentService",
  "message": "Assignment published successfully",
  "assignmentId": "0191c7f5-2222-7000-8000-000000000001"
}
```

---

## 2. Distributed Tracing & Correlation IDs

* Every incoming HTTP request and WebSocket handshake is assigned a unique `X-Request-Id` / `traceId` at the reverse proxy edge.
* Spring Boot propagates this identifier across thread boundaries via MDC (Mapped Diagnostic Context).
* When the API interacts with PostgreSQL, Redis, MinIO, or LiveKit, the trace identifier is passed along, providing end-to-end distributed traceability.

---

## 3. Privacy & Personally Identifiable Information (PII) Masking

In compliance with educational privacy regulations (FERPA and GDPR):
* **Forbidden in Logs**:
  * Passwords, password hashes, and MFA secrets.
  * Bearer JWT access tokens and refresh tokens.
  * Credit card or billing details.
  * Plaintext homework submissions or student essay bodies.
* **Masking Rules**:
  * Email addresses must be masked when logged at DEBUG/INFO levels (e.g., `m***s@metropolitan.edu`).
  * IP addresses must be truncated or anonymized in long-term stored logs.
