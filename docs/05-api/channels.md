# API Specification: Channels Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :---: |
| `GET`  | `/api/v1/classrooms/{id}/channels` | Fetch channel tree and categories | Enrolled Member |
| `POST` | `/api/v1/classrooms/{id}/categories` | Create a category (e.g., "Lectures") | `TEACHER` |
| `POST` | `/api/v1/classrooms/{id}/channels` | Create a channel in a classroom | `TEACHER` |
| `PATCH`| `/api/v1/channels/{id}` | Rename channel or update permissions | `TEACHER` |
| `DELETE`| `/api/v1/channels/{id}` | Delete channel | `TEACHER` |

---

## 2. Endpoint Details

### `GET /api/v1/classrooms/{id}/channels`
Returns the categorized channel hierarchy for rendering the navigation sidebar.

#### Response
```json
{
  "data": {
    "categories": [
      {
        "id": "0191c7c0-1111-7000-8000-000000000001",
        "name": "General Information",
        "position": 0,
        "channels": [
          { "id": "0191c7c0-2222-7000-8000-000000000001", "name": "announcements", "type": "ANNOUNCEMENT", "position": 0 },
          { "id": "0191c7c0-2222-7000-8000-000000000002", "name": "general-chat", "type": "TEXT", "position": 1 }
        ]
      },
      {
        "id": "0191c7c0-1111-7000-8000-000000000002",
        "name": "Live Class & Study Rooms",
        "position": 1,
        "channels": [
          { "id": "0191c7c0-2222-7000-8000-000000000003", "name": "main-lecture-stage", "type": "STAGE", "position": 0 },
          { "id": "0191c7c0-2222-7000-8000-000000000004", "name": "study-room-1", "type": "VOICE", "position": 1 }
        ]
      }
    ]
  }
}
```

---

### `POST /api/v1/classrooms/{id}/channels`
Provisions a new channel.

#### Request Body
```json
{
  "categoryId": "0191c7c0-1111-7000-8000-000000000002",
  "name": "homework-help",
  "type": "TEXT"
}
```
*(Types: `TEXT`, `VOICE`, `ANNOUNCEMENT`, `STAGE`)*
