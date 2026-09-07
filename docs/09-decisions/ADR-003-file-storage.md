# ADR-003: Direct-to-Storage Presigned Upload Pipeline

* **Status**: `PROPOSED`
* **Date**: 2026-09-08
* **Deciders**: Architecture Working Group, Infrastructure Team

---

## 1. Context & Problem Statement

Academic file sharing involves large, bursty payloads: students submitting multi-gigabyte virtual machine images or CAD files before deadlines, faculty uploading high-definition lecture recordings, and laboratory course software distributions.

Streaming binary file data through application servers (e.g., standard multipart form uploads through Spring Boot) causes:
* Severe JVM heap memory pressure and potential `OutOfMemoryError` failures.
* Thread starvation on application servers while waiting on slow mobile upload connections.
* Double bandwidth consumption (client-to-server, then server-to-storage).

---

## 2. Proposed Architectural Decision

We propose implementing **Direct-to-Storage Presigned Multipart Uploads** using **MinIO / AWS S3-compatible APIs**:

1. **Upload Initiation**:
   * The client requests an upload intent from Spring Boot (`POST /api/v1/files/upload/initiate`) providing filename, size, checksum, and MIME type.
   * The backend validates quotas, permissions, and filename safety, initiates an S3 multipart upload, and returns a list of presigned part URLs.
2. **Direct Transfer**:
   * The client streams chunks (5 MB to 50 MB) directly to MinIO/S3 using standard HTTP `PUT`.
   * The application server handles zero bytes of binary file traffic.
3. **Upload Finalization & Scanning**:
   * Upon completing chunk transfers, the client notifies the backend (`POST /api/v1/files/upload/complete`).
   * The backend finalizes the multipart object in S3, marks the file as `PROCESSING`, and emits an asynchronous event to trigger an automated ClamAV antivirus scan before releasing the file for classroom downloads.

---

## 3. Consequences

### Positive
* Backend application nodes remain lean and stateless, operating with predictable memory footprints.
* Resumable uploads: If a network blip interrupts a 2 GB file upload, only the failing 10 MB chunk is retried.
* Scalability: Storage I/O scales independently from business logic computation.

### Negative / Challenges
* Clients require logic for chunked uploads and part coordination.
* Object storage endpoints must support proper Cross-Origin Resource Sharing (CORS) configurations for web browser uploads.
