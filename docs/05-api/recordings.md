# API Specification: Recordings Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :---: |
| `GET`  | `/api/v1/classrooms/{id}/recordings` | List published class recordings | Enrolled Member |
| `GET`  | `/api/v1/recordings/{id}` | Get recording playback details & chapter markers | Enrolled Member |
| `POST` | `/api/v1/recordings/{id}/chapters` | Add chapter marker / topic index | `TEACHER` |
| `DELETE`| `/api/v1/recordings/{id}` | Delete or archive a recording | `TEACHER` / `ADMIN` |

---

## 2. Endpoint Details

### `GET /api/v1/recordings/{id}`
Returns playback metadata and chapter indices for a lecture.

#### Response
```json
{
  "data": {
    "id": "0191c820-7777-7000-8000-000000000001",
    "title": "Lecture 04: Paging & Virtual Memory Architecture",
    "durationSeconds": 4820,
    "recordedAt": "2026-09-08T14:00:00Z",
    "playbackUrl": "https://storage.classroom.domain/classroom-recordings/hls/lec_04/master.m3u8",
    "chapters": [
      { "timeSeconds": 0, "title": "Introduction & Recap" },
      { "timeSeconds": 720, "title": "Single-Level vs Multi-Level Page Tables" },
      { "timeSeconds": 2100, "title": "Translation Lookaside Buffer (TLB) Mechanics" },
      { "timeSeconds": 3600, "title": "Student Q&A and Homework 1 Tips" }
    ]
  }
}
```
