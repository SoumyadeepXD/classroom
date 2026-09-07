# API Specification: Files Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/files/upload/initiate` | Initiate S3/MinIO multipart direct upload | Yes |
| `POST` | `/api/v1/files/upload/complete` | Finalize upload after all parts are sent | Yes |
| `GET`  | `/api/v1/files/{id}` | Get metadata, status, and preview URLs | Yes |
| `GET`  | `/api/v1/files/{id}/download` | Retrieve presigned S3 download URL | Yes |

---

## 2. Endpoint Details

### `POST /api/v1/files/upload/initiate`
Requests authorization and presigned S3 URLs to upload a file directly to object storage in parts.

#### Request Body
```json
{
  "filename": "Operating_Systems_Lab1.zip",
  "fileSizeBytes": 52428800,
  "mimeType": "application/zip",
  "targetBucket": "classroom-submissions",
  "partCount": 5
}
```

#### Response
```json
{
  "data": {
    "fileId": "0191c7e0-9999-7000-8000-000000000001",
    "uploadId": "mp_upload_88ab12e",
    "partUrls": [
      { "partNumber": 1, "uploadUrl": "https://storage.classroom.domain/classroom-submissions/...?partNumber=1" },
      { "partNumber": 2, "uploadUrl": "https://storage.classroom.domain/classroom-submissions/...?partNumber=2" },
      { "partNumber": 3, "uploadUrl": "https://storage.classroom.domain/classroom-submissions/...?partNumber=3" },
      { "partNumber": 4, "uploadUrl": "https://storage.classroom.domain/classroom-submissions/...?partNumber=4" },
      { "partNumber": 5, "uploadUrl": "https://storage.classroom.domain/classroom-submissions/...?partNumber=5" }
    ]
  }
}
```

---

### `POST /api/v1/files/upload/complete`
Informs the server that all parts have been uploaded to MinIO/S3 and triggers background antivirus validation.

#### Request Body
```json
{
  "fileId": "0191c7e0-9999-7000-8000-000000000001",
  "uploadId": "mp_upload_88ab12e",
  "parts": [
    { "partNumber": 1, "eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"" },
    { "partNumber": 2, "eTag": "\"a12b8cd98f00b204e9800998ecf8427f\"" },
    { "partNumber": 3, "eTag": "\"c34c8cd98f00b204e9800998ecf8427g\"" },
    { "partNumber": 4, "eTag": "\"e56d8cd98f00b204e9800998ecf8427h\"" },
    { "partNumber": 5, "eTag": "\"g78e8cd98f00b204e9800998ecf8427i\"" }
  ]
}
```

#### Response
```json
{
  "data": {
    "fileId": "0191c7e0-9999-7000-8000-000000000001",
    "status": "PROCESSING",
    "message": "File upload finalized. Antivirus scan in progress."
  }
}
```
