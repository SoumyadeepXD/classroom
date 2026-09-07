# PostgreSQL Infrastructure (`infrastructure/postgres/`)

## 1. Purpose of the Directory
`infrastructure/postgres/` houses topology designs, memory tuning profiles (`postgresql.conf`), and replication specifications for PostgreSQL, the primary ACID-compliant relational data store.

## 2. Technical Profile (Proposed)
* **Engine**: PostgreSQL 16+
* **Capabilities**: JSONB support for unstructured metadata, full-text search indexes, transactional consistency for grades and submissions.
* **High Availability**: Primary-replica streaming replication, automated failover support.

## 3. What Belongs Here
* Database engine tuning parameters (shared buffers, work memory, checkpoint intervals).
* Read-replica routing architecture and connection pool targets.
* Volume snapshot and WAL archiving strategies.

## 4. What Does NOT Belong Here
* Table DDL schemas (belongs in `docs/04-database/schema.md`).
* Application JPA entities or migrations.
