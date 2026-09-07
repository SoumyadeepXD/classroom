# Entity Relationships & Referential Integrity

This document outlines the cardinality, cascading deletion behaviors, and referential integrity guarantees governing the PostgreSQL database.

---

## 1. Cardinality & Relationship Matrix

| Parent Entity | Child Entity | Cardinality | Delete Cascade Rule | Business Rationale |
| :--- | :--- | :---: | :---: | :--- |
| `institutions` | `classrooms` | 1 : N | `RESTRICT` | Prevent accidental erasure of complete institutional academic histories. |
| `institutions` | `users` | 1 : N | `RESTRICT` | Users must be deactivated rather than deleted to preserve audit logs. |
| `classrooms` | `channels` | 1 : N | `CASCADE` | Deleting a classroom removes its associated channel hierarchy. |
| `classrooms` | `assignments` | 1 : N | `RESTRICT` | Assignments containing student submissions cannot be hard-deleted. |
| `classrooms` | `enrollments` | 1 : N | `CASCADE` | Classroom deletion severs student/teacher roster associations. |
| `channels` | `messages` | 1 : N | `CASCADE` | Deleting an ephemeral channel clears its message stream. |
| `messages` | `messages` (Thread) | 1 : N | `SET NULL` / Soft Delete | Parent message deletion preserves thread context with a "[Message Deleted]" placeholder. |
| `assignments` | `submissions` | 1 : N | `RESTRICT` | Once student submissions exist, the assignment cannot be dropped. |
| `submissions` | `grades` | 1 : 1 | `RESTRICT` | Graded work is an official academic record and cannot be orphaned. |
| `live_sessions`| `recordings` | 1 : N | `SET NULL` | Removing a session record retains the underlying video archive. |

---

## 2. Integrity & Deletion Governance

### 2.1 Soft Deletion Pattern
* Critical educational records (`users`, `classrooms`, `messages`, `assignments`, `submissions`) enforce **soft deletion** via a `deleted_at TIMESTAMPTZ` column.
* Soft-deleted rows are excluded from application queries via default repository filters (`WHERE deleted_at IS NULL`).
* Historical audit queries and compliance inspections retain access to soft-deleted records.

### 2.2 Immutability Rules
* **Grades**: Once a grade is `released = true`, any subsequent modification generates an entry in the `grade_audit_log` table capturing the prior score, new score, modifying user ID, timestamp, and justification comment.
* **Submissions**: Once turned in, submission files cannot be overwritten in place; subsequent turn-ins increment the `version` counter and create a new submission record snapshot.
