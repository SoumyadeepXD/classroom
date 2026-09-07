# API Specification: Institutions Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :---: |
| `GET`  | `/api/v1/institutions/{id}` | Retrieve institutional configuration & branding | Public / Member |
| `PATCH`| `/api/v1/institutions/{id}` | Update tenant settings, logos, and features | `INSTITUTION_ADMIN` |
| `GET`  | `/api/v1/institutions/{id}/terms` | List configured academic terms | Member |
| `POST` | `/api/v1/institutions/{id}/terms` | Create an academic term (e.g., Fall 2026) | `INSTITUTION_ADMIN` |
| `GET`  | `/api/v1/institutions/{id}/departments` | List institutional departments | Member |

---

## 2. Endpoint Details

### `GET /api/v1/institutions/{id}`
Retrieves public and member-facing branding for an institution.

#### Response
```json
{
  "data": {
    "id": "0191c7a0-0000-7000-8000-000000000001",
    "name": "Metropolitan University",
    "slug": "metropolitan",
    "domain": "metropolitan.edu",
    "settings": {
      "primaryColor": "#0F4C81",
      "logoUrl": "https://storage.classroom.domain/classroom-public-assets/metro_logo.png",
      "ssoEnabled": true,
      "allowedEmailDomains": ["metropolitan.edu", "alumni.metropolitan.edu"]
    }
  }
}
```

---

### `POST /api/v1/institutions/{id}/terms`
Provisions a new academic term boundary for courses.

#### Request Body
```json
{
  "name": "Fall 2026",
  "startDate": "2026-09-01",
  "endDate": "2026-12-20"
}
```

#### Response
```text
HTTP/1.1 201 Created
```
