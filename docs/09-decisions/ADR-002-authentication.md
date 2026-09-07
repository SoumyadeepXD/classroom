# ADR-002: Authentication & Token Lifecycle Architecture

* **Status**: `PROPOSED`
* **Date**: 2026-09-08
* **Deciders**: Architecture Working Group, Security Team

---

## 1. Context & Problem Statement

Classroom Platform serves diverse educational organizations ranging from individual tutoring groups to major universities with tens of thousands of students.

Key requirements include:
* Supporting local credentials (email/password with Argon2id hashing) alongside enterprise Single Sign-On (SAML 2.0 and OpenID Connect).
* Mandatory or optional Multi-Factor Authentication (TOTP / WebAuthn).
* Fast stateless verification on incoming API requests without hammering the database on every HTTP call.
* Immediate revocation capability if an account is compromised or a user is deactivated.

---

## 2. Proposed Architectural Decision

We propose a **hybrid JWT + Redis token lifecycle architecture**:

1. **Access Tokens (JWT)**:
   * Asymmetrically signed using RS256 or Ed25519.
   * Short expiration lifespan: **15 minutes**.
   * Encodes user ID, tenant/institution ID, and system role.
   * Verified statelessly by Spring Boot API filters and LiveKit token verifiers without database lookups.
2. **Refresh Tokens (Opaque UUIDs)**:
   * Secure, random 256-bit UUID strings.
   * Long expiration lifespan: **7 days**.
   * Stored securely hashed (SHA-256) in Redis with automatic TTL expiration.
   * Subject to **Single-Use Rotation**: Using a refresh token invalidates it and issues a fresh token pair. If a revoked refresh token is presented, all sessions for that user family are terminated immediately.
3. **Session Revocation**:
   * Storing active refresh tokens in Redis allows instant global logout by deleting the user's Redis session keys.

---

## 3. Consequences

### Positive
* High throughput: 99% of API requests verify JWTs statelessly in memory.
* High security: Short 15-minute access token window limits exposure if a token leaks.
* Instant revocation: Redis-backed refresh tokens allow immediate session termination.

### Negative / Challenges
* Access tokens cannot be revoked before their 15-minute expiration unless a Redis token blocklist is queried (which introduces small latency overhead).
