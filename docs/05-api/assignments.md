# API Specification: Assignments Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :---: |
| `GET`  | `/api/v1/classrooms/{id}/assignments` | List all assignments in a classroom | Enrolled Member |
| `POST` | `/api/v1/classrooms/{id}/assignments` | Create a new assignment with rubric | `TEACHER` |
| `GET`  | `/api/v1/assignments/{id}` | Get assignment details and rubric | Enrolled Member |
| `PATCH`| `/api/v1/assignments/{id}` | Update instructions, due dates, rubric | `TEACHER` |
| `DELETE`| `/api/v1/assignments/{id}` | Delete assignment (if no submissions) | `TEACHER` |

---

## 2. Endpoint Details

### `POST /api/v1/classrooms/{id}/assignments`
Publishes an assignment with instructions, attachments, deadlines, and an optional grading rubric.

#### Request Body
```json
{
  "title": "Homework 1: Virtual Memory Simulation",
  "description": "Implement a 2-level page table simulation in C/C++...",
  "dueDate": "2026-09-20T23:59:00Z",
  "lockDate": "2026-09-22T23:59:00Z",
  "maxPoints": 100.0,
  "allowLateSubmissions": true,
  "latePenaltyPercentagePerDay": 10.0,
  "attachmentFileIds": ["0191c7f0-0000-7000-8000-000000000005"],
  "rubric": [
    {
      "criteriaId": "crit_correctness",
      "title": "Algorithm Correctness",
      "description": "Page fault handler passes all standard benchmark tests",
      "maxPoints": 60.0
    },
    {
      "criteriaId": "crit_performance",
      "title": "Memory Footprint & Speed",
      "description": "Page table metadata memory remains under 64 KB",
      "maxPoints": 25.0
    },
    {
      "criteriaId": "crit_style",
      "title": "Code Clarity & Documentation",
      "description": "Clear comments and consistent formatting",
      "maxPoints": 15.0
    }
  ]
}
```

#### Response
```text
HTTP/1.1 201 Created
```
*(Triggers WebSocket notification: `assignment.published`)*
