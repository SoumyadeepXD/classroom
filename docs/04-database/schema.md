# Conceptual Database Schema

This document specifies the conceptual database tables, column data types, default constraints, and domain indexes for the PostgreSQL persistence layer.

---

## 1. Domain: Institutions & Multi-Tenancy

### `institutions`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PK, DEFAULT uuid_generate_v7() | Unique institution identifier |
| `name` | `VARCHAR(255)` | NOT NULL | Official name of the university or academy |
| `slug` | `VARCHAR(100)` | NOT NULL, UNIQUE | URL-safe slug for subdomains |
| `domain` | `VARCHAR(255)` | NULL | Primary email domain for auto-onboarding |
| `settings` | `JSONB` | NOT NULL, DEFAULT '{}' | Tenant-specific feature flags and branding |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW() | Timestamp of record creation |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW() | Timestamp of last update |

### `academic_terms`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PK | Unique term identifier |
| `institution_id` | `UUID` | FK -> `institutions.id`, NOT NULL | Owning institution |
| `name` | `VARCHAR(100)` | NOT NULL | Name (e.g., "Fall 2026", "Semester 1") |
| `start_date` | `DATE` | NOT NULL | Term start date |
| `end_date` | `DATE` | NOT NULL | Term conclusion date |

---

## 2. Domain: Users & Identities

### `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PK | Unique user identifier |
| `institution_id` | `UUID` | FK -> `institutions.id`, NOT NULL | Home institution |
| `email` | `VARCHAR(255)` | NOT NULL, UNIQUE | User email address |
| `password_hash` | `VARCHAR(255)` | NULL | Argon2id/BCrypt hash (NULL if SSO) |
| `display_name` | `VARCHAR(100)` | NOT NULL | Full display name |
| `avatar_file_id` | `UUID` | NULL | Reference to avatar file asset |
| `system_role` | `VARCHAR(50)` | NOT NULL | `SUPER_ADMIN`, `ADMIN`, `USER` |
| `mfa_enabled` | `BOOLEAN` | NOT NULL, DEFAULT FALSE | Whether TOTP MFA is active |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW() | Account registration timestamp |

---

## 3. Domain: Classrooms & Channels

### `classrooms`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PK | Unique classroom identifier |
| `institution_id` | `UUID` | FK -> `institutions.id`, NOT NULL | Owning institution |
| `term_id` | `UUID` | FK -> `academic_terms.id`, NULL | Associated academic term |
| `name` | `VARCHAR(255)` | NOT NULL | Course title (e.g., "Intro to Algorithms") |
| `course_code` | `VARCHAR(50)` | NOT NULL | Academic code (e.g., "CS-201") |
| `join_code` | `VARCHAR(16)` | NOT NULL, UNIQUE | Alphanumeric enrollment code |
| `syllabus` | `TEXT` | NULL | Markdown-formatted course syllabus |
| `archived` | `BOOLEAN` | NOT NULL, DEFAULT FALSE | Whether the course is concluded |

### `channels`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PK | Unique channel identifier |
| `classroom_id` | `UUID` | FK -> `classrooms.id`, NOT NULL | Parent classroom |
| `category_id` | `UUID` | FK -> `channel_categories.id`, NULL | Organizational category |
| `name` | `VARCHAR(100)` | NOT NULL | Channel name (e.g., "lecture-questions") |
| `type` | `VARCHAR(30)` | NOT NULL | `TEXT`, `VOICE`, `ANNOUNCEMENT`, `STAGE` |
| `position` | `INTEGER` | NOT NULL, DEFAULT 0 | Display sort order in sidebar |

---

## 4. Domain: Messaging

### `messages`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PK | Monotonically sortable message identifier |
| `channel_id` | `UUID` | FK -> `channels.id`, NOT NULL | Target channel |
| `user_id` | `UUID` | FK -> `users.id`, NOT NULL | Author of the message |
| `parent_message_id` | `UUID` | FK -> `messages.id`, NULL | Parent message if in a thread |
| `content` | `TEXT` | NOT NULL | Markdown text body |
| `pinned` | `BOOLEAN` | NOT NULL, DEFAULT FALSE | Whether pinned by instructor |
| `metadata` | `JSONB` | NOT NULL, DEFAULT '{}' | Edit history, mention tags, embeds |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW() | Message posting timestamp |
| `deleted_at` | `TIMESTAMPTZ` | NULL | Soft-deletion timestamp |

---

## 5. Domain: Assignments, Submissions & Grades

### `assignments`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PK | Unique assignment identifier |
| `classroom_id` | `UUID` | FK -> `classrooms.id`, NOT NULL | Parent classroom |
| `title` | `VARCHAR(255)` | NOT NULL | Assignment title |
| `description` | `TEXT` | NULL | Detailed instructions & requirements |
| `due_date` | `TIMESTAMPTZ` | NOT NULL | Submission deadline |
| `lock_date` | `TIMESTAMPTZ` | NULL | Hard cutoff date after which no submissions are accepted |
| `max_points` | `NUMERIC(6,2)` | NOT NULL, DEFAULT 100.00 | Maximum possible points |
| `rubric_data` | `JSONB` | NOT NULL, DEFAULT '[]' | Evaluation criteria and rubric point weights |

### `submissions`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PK | Unique submission identifier |
| `assignment_id` | `UUID` | FK -> `assignments.id`, NOT NULL | Parent assignment |
| `student_id` | `UUID` | FK -> `users.id`, NOT NULL | Submitting student |
| `status` | `VARCHAR(30)` | NOT NULL | `DRAFT`, `SUBMITTED`, `LATE`, `GRADED` |
| `version` | `INTEGER` | NOT NULL, DEFAULT 1 | Submission revision counter |
| `submitted_at` | `TIMESTAMPTZ` | NOT NULL | Timestamp of formal turn-in |

### `grades`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PK | Unique grade record identifier |
| `submission_id` | `UUID` | FK -> `submissions.id`, NOT NULL, UNIQUE | Associated submission |
| `graded_by_user_id`| `UUID` | FK -> `users.id`, NOT NULL | Instructor or TA who graded |
| `score` | `NUMERIC(6,2)` | NOT NULL | Final awarded score |
| `rubric_breakdown` | `JSONB` | NOT NULL, DEFAULT '{}' | Scores assigned per rubric criterion |
| `private_feedback` | `TEXT` | NULL | Direct private comments to student |
| `released` | `BOOLEAN` | NOT NULL, DEFAULT FALSE | Whether visible to the student |
| `graded_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW() | Timestamp of grading |
