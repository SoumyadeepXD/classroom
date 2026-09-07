# API Specification: Administration Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :---: |
| `GET`  | `/api/v1/admin/health` | Deep system health & subsystem connectivity | `SUPER_ADMIN` |
| `GET`  | `/api/v1/admin/audit-logs` | Query chronological audit & security log | `ADMIN` |
| `GET`  | `/api/v1/admin/usage` | Inspect storage and live room bandwidth metrics | `ADMIN` |
| `POST` | `/api/v1/admin/users/{id}/ban` | Suspend or ban a user account | `ADMIN` |

---

## 2. Endpoint Details

### `GET /api/v1/admin/health`
Inspects database connectivity, Redis ping, MinIO bucket accessibility, and LiveKit SFU node status.

#### Response
```json
{
  "data": {
    "status": "UP",
    "components": {
      "database": { "status": "UP", "details": { "database": "PostgreSQL", "poolActive": 8 } },
      "redis": { "status": "UP", "details": { "latencyMs": 1.2 } },
      "storage": { "status": "UP", "details": { "accessibleBuckets": 3 } },
      "livekit": { "status": "UP", "details": { "nodes": 2, "activeRooms": 14 } }
    },
    "timestamp": "2026-09-08T10:00:00Z"
  }
}
```

---

### `GET /api/v1/admin/audit-logs`
Queries the immutable administrative log.

#### Query Parameters
* `actorId`: Filter by initiating user
* `action`: Filter by action type (e.g., `GRADE_MODIFIED`, `USER_MUTED`, `CHANNEL_DELETED`)
* `since`: ISO timestamp

#### Response
```json
{
  "data": [
    {
      "id": "0191c840-9999-7000-8000-000000000001",
      "actor": { "id": "0191c7a8-...", "displayName": "Professor Elena Rostova" },
      "action": "GRADE_MODIFIED",
      "targetEntity": "Grade:0191c805",
      "details": { "oldScore": 88.0, "newScore": 95.0, "reason": "Regrade request granted for Lab 1" },
      "timestamp": "2026-09-08T09:45:00Z"
    }
  ]
}
```
