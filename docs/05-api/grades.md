# API Specification: Grades Domain

## 1. Domain Endpoints Overview

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/submissions/{id}/grades` | Grade a submission with rubric scores | `TEACHER` / `TA` |
| `GET`  | `/api/v1/submissions/{id}/grades` | Retrieve grade breakdown & feedback | Student / Grader |
| `POST` | `/api/v1/assignments/{id}/grades/release` | Release all published grades to students | `TEACHER` |
| `GET`  | `/api/v1/classrooms/{id}/gradebook` | Fetch complete classroom grade matrix | `TEACHER` |
| `GET`  | `/api/v1/classrooms/{id}/gradebook/export` | Export gradebook to CSV | `TEACHER` |

---

## 2. Endpoint Details

### `POST /api/v1/submissions/{id}/grades`
Applies an evaluation to a submission.

#### Request Body
```json
{
  "totalScore": 95.0,
  "privateFeedback": "Excellent memory simulation. Your page replacement logic is exceptionally clean.",
  "rubricBreakdown": {
    "crit_correctness": { "pointsAwarded": 60.0, "feedback": "All tests passed without error." },
    "crit_performance": { "pointsAwarded": 22.0, "feedback": "Memory footprint slightly exceeded target under high load." },
    "crit_style": { "pointsAwarded": 13.0, "feedback": "Minor indentation irregularities." }
  },
  "releaseImmediately": true
}
```

#### Response
```text
HTTP/1.1 200 OK
```
*(Triggers notification: `grade.published` if released)*
