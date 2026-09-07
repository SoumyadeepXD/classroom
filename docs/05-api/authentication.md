# API Specification: Authentication Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/login` | Email/password login with credentials verification | No |
| `POST` | `/api/v1/auth/refresh` | Exchange refresh token for new access token | No |
| `POST` | `/api/v1/auth/logout` | Invalidate current session and revoke refresh token | Yes |
| `POST` | `/api/v1/auth/mfa/challenge` | Verify TOTP code for MFA-enrolled accounts | No |
| `POST` | `/api/v1/auth/mfa/enable` | Initiate TOTP secret generation & QR code | Yes |
| `GET` | `/api/v1/auth/sso/{provider}/init` | Initiate institutional SAML/OIDC redirection | No |
| `POST` | `/api/v1/auth/sso/{provider}/callback`| Consume IdP assertion and complete SSO login | No |

---

## 2. Endpoint Details

### `POST /api/v1/auth/login`
Authenticates a user with email and password.

#### Request Body
```json
{
  "email": "elena.rostova@metropolitan.edu",
  "password": "SecurePassword123!",
  "institutionSlug": "metropolitan"
}
```

#### Response: Standard Login (MFA Disabled)
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "expiresIn": 900,
    "user": {
      "id": "0191c7a8-4235-7cb2-b430-c3d3170a7b45",
      "email": "elena.rostova@metropolitan.edu",
      "displayName": "Professor Elena Rostova",
      "systemRole": "USER"
    }
  }
}
```

#### Response: MFA Required (`403 Forbidden` / Challenge)
```json
{
  "data": {
    "mfaRequired": true,
    "mfaSessionToken": "mfa_sess_9a87dfb21"
  }
}
```

---

### `POST /api/v1/auth/mfa/challenge`
Verifies a 6-digit TOTP code against an active MFA session token.

#### Request Body
```json
{
  "mfaSessionToken": "mfa_sess_9a87dfb21",
  "totpCode": "482019"
}
```

#### Response
Returns the standard token pair on successful verification.
