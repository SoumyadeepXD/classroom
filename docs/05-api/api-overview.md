# API Overview & Global Conventions

## 1. Protocol & Architectural Style

The Classroom Platform exposes a RESTful HTTP API over HTTPS (TLS 1.3) combined with a WebSocket gateway for bidirectional real-time events.

* **Base URL**: `https://api.classroom.domain/api/v1`
* **Realtime WebSocket URL**: `wss://api.classroom.domain/ws`
* **Media Signaling URL**: `wss://live.classroom.domain`

---

## 2. Standard Headers

| Header | Description | Required |
| :--- | :--- | :---: |
| `Authorization` | Bearer token format: `Bearer <jwt_access_token>` | Yes (authenticated routes) |
| `Content-Type` | Standard payload format: `application/json` | Yes (for POST/PUT/PATCH) |
| `X-Request-Id` | Unique client-generated or edge-generated tracing UUID | Recommended |
| `X-Institution-Id` | Explicit tenant identifier context for multi-tenant users | Optional |

---

## 3. Standard Response & Error Envelopes

### Success Envelope (Single Entity)
```text
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": { ... entity fields ... },
  "meta": {
    "timestamp": "2026-09-08T10:00:00Z",
    "requestId": "req_88f91a2bc"
  }
}
```

### Paginated List Envelope
```text
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [ ... array of entities ... ],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "totalElements": 142,
    "totalPages": 6,
    "hasNext": true
  }
}
```

### Error Envelope
```text
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
  "error": {
    "code": "INVALID_SUBMISSION_DEADLINE",
    "message": "Submissions for this assignment closed at 2026-09-07T23:59:00Z.",
    "details": [
      { "field": "submittedAt", "issue": "Timestamp is past lockDate" }
    ],
    "timestamp": "2026-09-08T10:00:00Z",
    "requestId": "req_88f91a2bc"
  }
}
```

---

## 4. Standard HTTP Status Codes

* `200 OK`: Request succeeded.
* `201 Created`: Resource successfully created.
* `204 No Content`: Action succeeded with no return payload.
* `400 Bad Request`: Validation error or malformed payload.
* `401 Unauthorized`: Missing or invalid bearer authentication token.
* `403 Forbidden`: Authenticated user lacks permission for this resource.
* `404 Not Found`: Resource does not exist.
* `409 Conflict`: Resource collision (e.g., join code already exists).
* `429 Too Many Requests`: Rate limit threshold exceeded.
* `500 Internal Server Error`: Unhandled server exception.
