# API Specification: Live Classes Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/channels/{id}/live/start` | Start live class session on a stage channel | `TEACHER` |
| `POST` | `/api/v1/channels/{id}/live/join` | Join active live class & get LiveKit token | Enrolled Member |
| `POST` | `/api/v1/live-sessions/{id}/raise-hand` | Signal desire to speak (student) | Participant |
| `POST` | `/api/v1/live-sessions/{id}/promote` | Grant temporary speaker rights to student | `TEACHER` / `TA` |
| `POST` | `/api/v1/live-sessions/{id}/end` | Conclude live class and trigger recording | `TEACHER` |

---

## 2. Endpoint Details

### `POST /api/v1/channels/{id}/live/join`
Requests entry into an active live classroom session and obtains a WebRTC token.

#### Response
```json
{
  "data": {
    "liveSessionId": "0191c810-6666-7000-8000-000000000001",
    "roomName": "class_cs201_stage_lecture",
    "serverUrl": "wss://live.classroom.domain",
    "participantToken": "eyJhbGciOiJSUzI1NiIsIn...",
    "grants": {
      "canPublish": false,
      "canSubscribe": true,
      "canPublishData": true
    },
    "recordingActive": true
  }
}
```

---

### `POST /api/v1/live-sessions/{id}/raise-hand`
Queues a participant into the instructor's moderation roster.

#### Response
```text
HTTP/1.1 200 OK
```
*(Triggers WebSocket broadcast to host: `live.hand.raised`)*
