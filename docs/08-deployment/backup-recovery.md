# Backup & Disaster Recovery Runbook

## 1. Data Protection Objectives

* **Recovery Point Objective (RPO)**: < 15 minutes (maximum data loss window in disaster).
* **Recovery Time Objective (RTO)**: < 60 minutes (maximum system restore time).

---

## 2. Backup Architecture & Cadence

```mermaid
graph TD
    subgraph "PostgreSQL Tier"
        PG[(PostgreSQL Primary)] -->|Continuous Stream| WAL[Write-Ahead Logs (WAL-G)]
        PG -->|Daily Snapshot 02:00 UTC| DailyDump[Encrypted Full Base Dump]
    end

    subgraph "Object Storage Tier"
        MinIO[(MinIO Object Storage)] -->|Nightly Delta Sync| RemoteS3[(Offsite Cold S3 Storage)]
    end

    WAL --> RemoteS3
    DailyDump --> RemoteS3
```

### 2.1 Database Backups (PostgreSQL)
* **Continuous Archiving**: Continuous WAL (Write-Ahead Log) archiving via `pg_receivewal` or `WAL-G` to offsite storage enables Point-in-Time Recovery (PITR) to any second within a 30-day retention window.
* **Daily Logical Dump**: `pg_dump` compressed snapshot taken every night at 02:00 UTC, encrypted with GPG, and copied to isolated cloud/cold storage.

### 2.2 Object Storage Backups (MinIO)
* Submission files and recordings in MinIO are protected via asynchronous bucket replication or scheduled nightly differential sync (`rclone` / `mc mirror`) to offsite secondary storage.

---

## 3. Disaster Recovery Restoration Procedure

### 3.1 Restoring Database to Specific Timestamp
1. Stop the application server: `docker compose stop api`.
2. Provision empty PostgreSQL data directory: `/var/lib/classroom/postgres`.
3. Fetch base backup and WAL logs from offsite archive.
4. Configure `recovery.signal` and `target_time = '2026-09-08 14:30:00 UTC'`.
5. Start PostgreSQL container; monitor recovery logs until target replay is complete.
6. Restart API service and verify data consistency.

### 3.2 Scheduled Restoration Testing
A disaster recovery drill must be performed quarterly in a staging sandbox to verify backup archive integrity and validate that RTO/RPO targets are satisfied.
