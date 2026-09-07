# API Specification: Messaging Domain

## 1. REST Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET`  | `/api/v1/channels/{id}/messages` | Paginated message history (cursor-based) | Channel Member |
| `POST` | `/api/v1/channels/{id}/messages` | Post a new message (REST fallback) | Channel Member |
| `GET`  | `/api/v1/messages/{id}/thread` | Fetch nested replies for a parent message | Channel Member |
| `POST` | `/api/v1/messages/{id}/reactions` | Toggle emoji reaction on a message | Channel Member |
| `DELETE`| `/api/v1/messages/{id}` | Delete a message (author or moderator) | Author / Moderator |

---

## 2. WebSocket Realtime Events

WebSocket connections communicate via JSON frames over `/ws`.

### 2.1 Sending a Message (Client -> Server)
* **Destination**: `/app/channels.{channelId}.send`
```json
{
  "content": "Does anyone know when Homework 1 is due?",
  "parentMessageId": null,
  "attachmentIds": ["0191c7d0-3333-7000-8000-000000000001"]
}
```

### 2.2 Message Broadcast Event (Server -> Clients)
* **Topic**: `/topic/channels.{channelId}`
```json
{
  "eventType": "MESSAGE_CREATED",
  "data": {
    "id": "0191c7d5-8888-7000-8000-000000000099",
    "channelId": "0191c7c0-2222-7000-8000-000000000002",
    "author": {
      "id": "0191c7a8-4235-7cb2-b430-c3d3170a7b45",
      "displayName": "Marcus Vance",
      "avatarUrl": "https://storage.classroom.domain/classroom-public-assets/avatars/user-101.png"
    },
    "content": "Does anyone know when Homework 1 is due?",
    "parentMessageId": null,
    "threadCount": 0,
    "reactions": {},
    "attachments": [],
    "createdAt": "2026-09-08T10:15:00Z"
  }
}
```

### 2.3 Reaction Event (Server -> Clients)
* **Topic**: `/topic/channels.{channelId}`
```json
{
  "eventType": "REACTION_UPDATED",
  "data": {
    "messageId": "0191c7d5-8888-7000-8000-000000000099",
    "emoji": "👍",
    "count": 4,
    "userIds": ["0191c7a8-4235-7cb2-b430-c3d3170a7b45"]
  }
}
```
