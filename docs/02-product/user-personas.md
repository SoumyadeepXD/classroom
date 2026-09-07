# User Personas

To ensure user-centric product architecture, Classroom Platform is designed around four foundational personas representing primary user archetypes.

---

## 1. Persona 1: Professor Elena Rostova (The Educator)

```text
Role       : University Course Director / Senior Lecturer
Institution: Metropolitan University (Computer Science Dept)
Tech Savvy : High
Primary UI : Web Application (Desktop Chrome / Safari)
```

* **Goals**:
  * Organize complex course syllabi, lecture slides, and weekly coding assignments in one place.
  * Conduct interactive live lectures without having to launch and license external conferencing apps.
  * Grade student submissions efficiently using custom multi-dimensional rubrics.
  * Foster spontaneous student discussions without becoming overwhelmed by direct messages.
* **Pain Points**:
  * Dislikes switching between Blackboard (assignments) and Discord (informal student queries).
  * Struggles with large video recordings exceeding LMS file upload quotas.
  * Needs privacy boundaries between personal contact info and student communication.

---

## 2. Persona 2: Marcus Vance (The Student)

```text
Role       : Undergraduate Student (Sophomore)
Institution: Metropolitan University
Tech Savvy : Native / Very High
Primary UI : Web Application (Laptop) & Mobile Application (iOS)
```

* **Goals**:
  * Track assignment deadlines, upcoming live lectures, and grades effortlessly.
  * Ask questions in channel threads and collaborate on group projects with classmates in voice study rooms.
  * Upload homework files directly from a phone or laptop with guaranteed turn-in receipts.
  * Rewatch recorded lectures at 1.5x speed with chapter navigation before exams.
* **Pain Points**:
  * Forgets assignment deadlines when they are buried in clunky legacy LMS portals.
  * Frustrated when homework upload connections fail midway through a large submission.
  * Overwhelmed by fragmented notifications across email, LMS, and Discord servers.

---

## 3. Persona 3: Priya Sharma (The Teaching Assistant)

```text
Role       : Graduate Teaching Assistant & Lab Instructor
Institution: Metropolitan University
Tech Savvy : Very High
Primary UI : Web Application (Dual Monitor Workstation)
```

* **Goals**:
  * Host weekly lab sections in live voice rooms with screen-sharing and interactive whiteboards.
  * Grade large batches of homework submissions according to the professor's rubric.
  * Moderate text channels, pin critical announcements, and answer common lab questions.
* **Pain Points**:
  * Repeatedly answering the exact same question in private messages instead of a public thread.
  * Clunky LMS rubric interfaces that require 15 clicks per graded student.

---

## 4. Persona 4: Arthur Pendelton (The Institutional IT Administrator)

```text
Role       : Director of Academic Computing & Enterprise Systems
Institution: Metropolitan University
Tech Savvy : Systems & Infrastructure Specialist
Primary UI : Web Admin Portal & Command Line CLI
```

* **Goals**:
  * Deploy Classroom Platform on self-hosted campus servers to comply with student privacy laws.
  * Integrate university SAML 2.0 / Active Directory SSO for automated student/faculty onboarding.
  * Enforce strict role-based access control and monitor storage consumption across departments.
* **Pain Points**:
  * Third-party cloud SaaS vendors charging exorbitant per-student monthly licensing fees.
  * Privacy concerns with student recordings stored on overseas public clouds.
