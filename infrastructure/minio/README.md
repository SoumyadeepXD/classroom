# MinIO Object Storage Infrastructure (`infrastructure/minio/`)

## 1. Purpose of the Directory
`infrastructure/minio/` contains deployment blueprints for MinIO, a high-performance, S3-compatible distributed object storage server. MinIO provides persistence for assignment submissions, course materials, media files, and recorded live lectures.

## 2. Technical Profile (Proposed)
* **API Compatibility**: Amazon S3 API v4
* **Use Cases**:
  * Persistent storage for student assignment submissions.
  * Shared classroom course materials, syllabi, and lecture slide decks.
  * Live class recording chunks (MP4/HLS) written by LiveKit Egress.
  * Direct-to-storage presigned upload and download URLs.

## 3. What Belongs Here
* Bucket taxonomy blueprints (`classroom-submissions`, `classroom-materials`, `classroom-recordings`).
* Bucket lifecycle policies (cold storage archiving, auto-expiring temporary uploads).
* Distributed MinIO cluster and erasure coding topology specifications.

## 4. What Does NOT Belong Here
* Application S3 client code (belongs in `backend/api/`).
* Plaintext access keys or secret keys.
