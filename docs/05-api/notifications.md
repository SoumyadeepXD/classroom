# API Specification: Notifications Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET`  | `/api/v1/notifications` | Paginated user notification feed | Yes |
| `POST` | `/api/v1/notifications/{id}/read` | Mark individual notification as read | Yes |
| `POST` | `/api/v1/notifications/read-all` | Mark all unread notifications as read | Yes |
| `POST` | `/api/v1/notifications/devices` | Register mobile APNs/FCM device token | Yes |
| `DELETE`| `/api/v1/notifications/devices/{token}`| Unregister device token on logout | Yes |

---

## 2. Endpoint Details

### `GET /api/v1/notifications`
Retrieves chronological notifications for the user.

#### Response
```json
{
  "data": [
    {
      "id": "0191c830-1111-7000-8000-000000000001",
      "type": "ASSIGNMENT_DUE_SOON",
      "title": "Homework 1 Due in 24 Hours",
      "message": "Homework 1: Virtual Memory Simulation is due tomorrow at 23:59.",
      "read": false,
      "linkUrl": "/classrooms/0191c7b0/assignments/0191c7f5",
      "createdAt": "2026-09-19T23:59:00Z"
    }
  ]
}
```

---

### `POST /api/v1/notifications/devices`
Registers a mobile device for push alerts.

#### Request Body
```json
{
  "deviceToken": "fcm_token_998abcf12...",
  "platform": "IOS"
}
```
*(Platform enum: `IOS`, `ANDROID`)*
