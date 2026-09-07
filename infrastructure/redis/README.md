# Redis Infrastructure (`infrastructure/redis/`)

## 1. Purpose of the Directory
`infrastructure/redis/` contains infrastructure models for Redis, which acts as the high-throughput, in-memory caching tier, session store, and real-time Pub/Sub broker for multi-instance WebSocket synchronization.

## 2. Technical Profile (Proposed)
* **Engine**: Redis 7+
* **Primary Use Cases**:
  * Distributed caching of user sessions, permissions, and classroom rosters.
  * Pub/Sub messaging backplane for propagating WebSocket events across clustered API instances.
  * Ephemeral user presence tracking (online, idle, in-class).
  * Distributed rate limiting and lock acquisition.

## 3. What Belongs Here
* Redis Sentinel / Cluster topology blueprints.
* Memory eviction policies (`volatile-lru` / `allkeys-lru`) and persistence configurations (AOF/RDB).
* Key namespace conventions and TTL strategies.

## 4. What Does NOT Belong Here
* Application Redis client code (belongs in `backend/api/src/main/java/com/classroom/platform/infrastructure/`).
