# API Specification: Classrooms Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :---: |
| `GET`  | `/api/v1/classrooms` | List classrooms caller is enrolled in | Authenticated |
| `POST` | `/api/v1/classrooms` | Create a new classroom course | `TEACHER` / `ADMIN` |
| `GET`  | `/api/v1/classrooms/{id}` | Get classroom details, syllabus, and stats | Enrolled Member |
| `PATCH`| `/api/v1/classrooms/{id}` | Update title, syllabus, description | `TEACHER` |
| `POST` | `/api/v1/classrooms/join` | Enroll via 8-character join code | Authenticated |
| `POST` | `/api/v1/classrooms/{id}/archive` | Archive course at conclusion of term | `TEACHER` / `ADMIN` |

---

## 2. Endpoint Details

### `POST /api/v1/classrooms`
Creates a course container and provisions default channel trees (`#general`, `#announcements`).

#### Request Body
```json
{
  "name": "Introduction to Computer Systems",
  "courseCode": "CS-201",
  "termId": "0191c7a4-0000-7000-8000-000000000010",
  "syllabus": "# CS-201 Syllabus\n\nWelcome to Computer Systems...",
  "sectionNames": ["Lecture 01", "Lab Section A", "Lab Section B"]
}
```

#### Response
```json
{
  "data": {
    "id": "0191c7b0-8112-78a0-9c2b-421098a54321",
    "name": "Introduction to Computer Systems",
    "courseCode": "CS-201",
    "joinCode": "SYS-9842",
    "archived": false,
    "createdAt": "2026-09-08T10:00:00Z"
  }
}
```

---

### `POST /api/v1/classrooms/join`
Enrolls the caller into a classroom using a valid join code.

#### Request Body
```json
{
  "joinCode": "SYS-9842"
}
```

#### Response
```json
{
  "data": {
    "classroomId": "0191c7b0-8112-78a0-9c2b-421098a54321",
    "role": "STUDENT",
    "enrolledAt": "2026-09-08T10:05:00Z"
  }
}
```
