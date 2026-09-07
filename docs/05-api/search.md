# API Specification: Search Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Scope |
| :--- | :--- | :--- | :---: |
| `GET`  | `/api/v1/search` | Global multi-entity full-text search | User Permitted Scope |
| `GET`  | `/api/v1/classrooms/{id}/search` | Scoped search within a specific course | Enrolled Member |

---

## 2. Endpoint Details

### `GET /api/v1/classrooms/{id}/search`
Executes full-text search across messages, assignment titles, materials, and recordings within a classroom.

#### Query Parameters
* `q`: Search query string (e.g., `q=virtual+memory`)
* `types`: Comma-separated filters (`MESSAGES`, `ASSIGNMENTS`, `FILES`, `RECORDINGS`)
* `limit`: Max results per category (default: 10)

#### Response
```json
{
  "data": {
    "assignments": [
      {
        "id": "0191c7f5-2222-7000-8000-000000000001",
        "title": "Homework 1: Virtual Memory Simulation",
        "dueDate": "2026-09-20T23:59:00Z"
      }
    ],
    "messages": [
      {
        "id": "0191c7d5-8888-7000-8000-000000000099",
        "channelName": "homework-help",
        "contentSnippet": "...how does the **virtual memory** simulation handle TLB misses?...",
        "createdAt": "2026-09-10T11:20:00Z"
      }
    ],
    "recordings": [
      {
        "id": "0191c820-7777-7000-8000-000000000001",
        "title": "Lecture 04: Paging & Virtual Memory Architecture",
        "timestampOffset": 720
      }
    ]
  }
}
```
