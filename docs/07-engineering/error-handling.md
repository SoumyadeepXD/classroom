# Error Handling Architecture

## 1. Unified Error Philosophy

The Classroom Platform enforces a centralized, predictable error handling strategy across all services and client applications:
* **No Raw Stack Traces**: Internal server stack traces or database error messages must never be leaked to clients.
* **Standardized JSON Schema**: All HTTP error responses adhere to the RFC 7807 problem details specification.
* **Deterministic Error Codes**: Machine-readable string codes accompany every failure, enabling frontend localization and automated client handling.

---

## 2. Backend Error Taxonomy (Spring Boot)

### 2.1 Centralized Exception Handling
All exceptions are intercepted by a global `@ControllerAdvice` component:
* `BusinessException`: Base unchecked exception carrying a domain error code and HTTP status.
* `EntityNotFoundException` (`404 Not Found`): Thrown when an ID does not exist or user lacks permission to perceive existence.
* `AuthorizationException` (`403 Forbidden`): Thrown when an authenticated user attempts an unauthorized action.
* `ValidationException` (`400 Bad Request`): Thrown when Spring `@Valid` DTO validation constraints fail.

### 2.2 Standard Error Codes Catalog

| Error Code | HTTP Status | Description |
| :--- | :---: | :--- |
| `AUTHENTICATION_REQUIRED` | 401 | Missing or invalid bearer token |
| `INSUFFICIENT_PERMISSIONS`| 403 | Caller lacks required role or ownership |
| `CLASSROOM_NOT_FOUND` | 404 | Classroom ID does not exist |
| `ASSIGNMENT_LOCKED` | 400 | Submissions closed; deadline passed lock date |
| `FILE_TOO_LARGE` | 413 | File size exceeds tenant bucket quota |
| `MALWARE_DETECTED` | 422 | Uploaded file failed antivirus scan |
| `STAGE_ROOM_FULL` | 429 | WebRTC room participant capacity reached |

---

## 3. Frontend Error Handling (Web & Mobile)

* **React Error Boundaries**: Feature modules (e.g., live lecture stage, chat feed) are wrapped in granular React error boundaries. A crash in the chat component does not crash the active live video stream.
* **Network Query Error Handling**: TanStack Query global error handlers intercept `401 Unauthorized` responses and trigger automatic token refresh or redirect to the login screen.
* **Optimistic Rollbacks**: If a real-time message or reaction fails to persist on the server, the client UI rolls back the optimistic update and displays a retry prompt.
