# ADR-004: Real-Time Messaging Gateway & Redis Pub/Sub Backplane

* **Status**: `PROPOSED`
* **Date**: 2026-09-08
* **Deciders**: Architecture Working Group, Real-Time Team

---

## 1. Context & Problem Statement

Classroom discussions require fluid, Discord-style interaction: immediate chat delivery, typing indicators, reactions, and live presence updates across web and mobile clients.

To support this across a clustered multi-instance Spring Boot deployment:
* Clients must maintain persistent, low-overhead WebSocket connections.
* An event published by a user connected to Node 1 must instantly reach a peer connected to Node 3.
* If a client momentarily disconnects (e.g., mobile network transition), they must reliably recover unread messages.

---

## 2. Proposed Architectural Decision

We propose establishing a **Spring WebSocket gateway backed by a distributed Redis Pub/Sub backplane**:

1. **Client Connection**:
   * Clients connect to `/ws` over TLS-secured WebSockets (`wss://`).
   * STOMP protocol (or raw lightweight JSON framing) is used for message dispatch and topic subscriptions (`/topic/channels.{channelId}`).
2. **Horizontal Fan-Out via Redis Pub/Sub**:
   * When an API node receives a new message, it persists it in PostgreSQL and immediately publishes a JSON event payload to Redis channel `classroom:channel:{channelId}`.
   * All API instances subscribed to the Redis channel receive the event and broadcast it down to their locally connected WebSocket sessions.
3. **Presence Tracking**:
   * Ephemeral heartbeats refresh Redis keys with a 60-second TTL (`presence:user:{userId}`).
   * Presence changes are fanned out to relevant classroom members.
4. **Offline Catch-Up**:
   * Reconnecting clients query the REST endpoint `/api/v1/channels/{id}/messages?since={lastKnownId}` to fetch any messages missed during the disconnection window.

---

## 3. Consequences

### Positive
* Sub-100ms message propagation across geographically distributed clusters.
* Clustered API instances remain decoupled; any node can handle any user's connection.
* Minimal memory overhead on the application tier.

### Negative / Challenges
* Redis Pub/Sub does not persist messages; persistent delivery guarantees rely on the PostgreSQL database record combined with client catch-up queries.
