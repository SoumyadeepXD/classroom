# File Storage & Media Architecture

## 1. Overview & High-Capacity Storage Philosophy

In academic environments, students and faculty frequently exchange large binary files: project ZIP archives, high-resolution microscope scans, multi-gigabyte virtual machine images, and raw video recordings.

Classroom Platform avoids routing file binaries through the application server memory. Instead, it utilizes **direct-to-storage presigned upload and download pipelines** backed by **MinIO** or **AWS S3-compatible object storage**.

---

## 2. Presigned Multipart Upload Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Client as Web / Mobile Client
    participant API as Spring Boot API
    participant DB as PostgreSQL
    participant Storage as MinIO / S3 Object Storage
    participant Scanner as Async Antivirus Worker

    Client->>API: POST /api/v1/files/upload-initiate<br/>(filename, size, mimeType, checksum)
    API->>API: Validate MIME whitelist & quota
    API->>Storage: Initiate S3 Multipart Upload
    Storage-->>API: UploadId & Presigned Part URLs
    API->>DB: Insert File Record (Status: PENDING)
    API-->>Client: Return UploadId & Presigned Part URLs

    loop For Each File Chunk (5 MB - 50 MB)
        Client->>Storage: PUT Part URL with Binary Chunk
    end

    Client->>API: POST /api/v1/files/upload-complete<br/>(uploadId, partsETags)
    API->>Storage: Complete Multipart Upload
    API->>Scanner: Queue Antivirus & MIME Inspection Job
    API->>DB: Update File Record (Status: PROCESSING)
    API-->>Client: Acknowledge Upload Complete

    Note over Scanner,Storage: Background Asynchronous Processing
    Scanner->>Storage: Scan Object (ClamAV)
    Scanner-->>API: Scan Passed & Generate Thumbnail
    API->>DB: Update File Record (Status: AVAILABLE)
```

---

## 3. Storage Bucket Taxonomy

Storage is logically segregated into three distinct buckets to enforce security policies and lifecycle management:

| Bucket Name | Access Model | Content Type | Lifecycle Policy |
| :--- | :--- | :--- | :--- |
| `classroom-submissions` | Private (Presigned only) | Student homework turn-in artifacts | Immutable retention; locked after grading |
| `classroom-materials` | Institutional Private | Lecture slides, syllabi, course reading PDFs | Retained for course lifetime |
| `classroom-recordings` | Institutional Private | MP4 & HLS video streams from live lectures | Transcoded; auto-archived after 2 semesters |
| `classroom-public-assets` | Public Read | User avatars, course banner graphics | Cached globally via CDN |

---

## 4. File Security & Processing

1. **Direct Uploads**: Clients never push large binaries directly through Spring Boot HTTP threads, preventing JVM heap memory exhaustion.
2. **Virus & Malware Scanning**: Newly uploaded files remain in `PENDING_SCAN` state until an asynchronous worker scans the object with ClamAV. Infected files are quarantined and purged immediately.
3. **Magic Byte Inspection**: Content type validation is performed on the first 512 bytes of the uploaded file to prevent executable files masked with benign extensions (e.g., `.exe` disguised as `.pdf`).
