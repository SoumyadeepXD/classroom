# API Specification: Submissions Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :---: |
| `GET`  | `/api/v1/assignments/{id}/submissions` | List all submissions for an assignment | `TEACHER` / `TA` |
| `GET`  | `/api/v1/assignments/{id}/submissions/me` | Fetch caller's submission & version history | `STUDENT` |
| `POST` | `/api/v1/assignments/{id}/submissions` | Submit work (files, notes) | `STUDENT` |
| `GET`  | `/api/v1/submissions/{id}` | Inspect a specific student submission | Author / Grader |
| `POST` | `/api/v1/submissions/{id}/unsubmit` | Retract submission before deadline | Author |

---

## 2. Endpoint Details

### `POST /api/v1/assignments/{id}/submissions`
Submits student work for evaluation.

#### Request Body
```json
{
  "studentNotes": "Included additional tests in tests/custom_test.c",
  "fileIds": [
    "0191c7e0-9999-7000-8000-000000000001"
  ]
}
```

#### Response: Cryptographically Verifiable Turn-In Receipt
```json
{
  "data": {
    "submissionId": "0191c800-4444-7000-8000-000000000001",
    "assignmentId": "0191c7f5-2222-7000-8000-000000000001",
    "studentId": "0191c7a8-4235-7cb2-b430-c3d3170a7b45",
    "status": "SUBMITTED",
    "version": 1,
    "submittedAt": "2026-09-18T14:22:10Z",
    "turnInReceipt": {
      "receiptCode": "RCPT-9982-AC9B",
      "sha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "issuedAt": "2026-09-18T14:22:10Z"
    }
  }
}
```
