# API Specification: Users Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/users/me` | Fetch authenticated user profile & preferences | Yes |
| `PATCH`| `/api/v1/users/me` | Update display name, bio, timezone, pronouns | Yes |
| `PUT`  | `/api/v1/users/me/presence` | Update real-time presence indicator | Yes |
| `POST` | `/api/v1/users/me/avatar` | Assign uploaded file asset as user avatar | Yes |
| `GET`  | `/api/v1/users/{id}` | Fetch public profile card for another user | Yes |

---

## 2. Endpoint Details

### `GET /api/v1/users/me`
Retrieves full profile details for the authenticated caller.

#### Response
```json
{
  "data": {
    "id": "0191c7a8-4235-7cb2-b430-c3d3170a7b45",
    "institutionId": "0191c7a0-0000-7000-8000-000000000001",
    "email": "marcus.vance@metropolitan.edu",
    "displayName": "Marcus Vance",
    "pronouns": "he/him",
    "bio": "Sophomore CS student passionate about distributed systems.",
    "timezone": "America/New_York",
    "avatarUrl": "https://storage.classroom.domain/classroom-public-assets/avatars/user-101.png",
    "presenceStatus": "ONLINE",
    "systemRole": "USER",
    "createdAt": "2026-08-15T09:00:00Z"
  }
}
```

---

### `PUT /api/v1/users/me/presence`
Updates the caller's presence status and broadcasts an event to mutual classrooms.

#### Request Body
```json
{
  "status": "IN_CLASS",
  "customMessage": "Attending CS-201 Lecture"
}
```
*(Status enum values: `ONLINE`, `IDLE`, `IN_CLASS`, `DO_NOT_DISTURB`, `OFFLINE`)*

#### Response
```text
HTTP/1.1 200 OK
```
*(Triggers WebSocket event: `user.presence.updated`)*
