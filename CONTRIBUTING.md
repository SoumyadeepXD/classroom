# Contributing to Classroom Platform

Thank you for your interest in contributing to the **Classroom Platform**. As this project bridges academic management, real-time collaboration, and streaming infrastructure, we maintain rigorous engineering, architectural, and documentation standards.

---

## 1. Project Status Notice

The Classroom Platform repository is currently in the **specification and architectural blueprint phase**. Active feature implementation has not yet begun. During this phase, contributions should primarily focus on:

* Refining architectural specifications under [`docs/03-architecture/`](file:///Users/soumyadeepxd/Developer/classroom/docs/03-architecture/README.md).
* Expanding domain requirements in [`docs/01-requirements/`](file:///Users/soumyadeepxd/Developer/classroom/docs/01-requirements/README.md).
* Submitting Architectural Decision Records (ADRs) under [`docs/09-decisions/`](file:///Users/soumyadeepxd/Developer/classroom/docs/09-decisions/README.md).
* Clarifying API contracts under [`docs/05-api/`](file:///Users/soumyadeepxd/Developer/classroom/docs/05-api/README.md).

---

## 2. Branching Strategy

We follow a structured trunk-based branching model.

* `main`: The single source of truth. Always kept in a deployable or validated state. Direct pushes are disabled.
* `feat/<issue-id>-<short-description>`: For new features or structural additions (e.g., `feat/102-webrtc-sfu-spec`).
* `fix/<issue-id>-<short-description>`: For bug fixes or specification corrections (e.g., `fix/108-rubric-schema-link`).
* `docs/<issue-id>-<short-description>`: For documentation additions or revisions (e.g., `docs/115-add-srs-requirements`).
* `refactor/<short-description>`: For structural reorganizations that do not introduce functional changes.

---

## 3. Issue Management

Before creating a pull request, open or link an existing GitHub issue:

1. **Bug Reports**: Use the [Bug Report Template](file:///.github/ISSUE_TEMPLATE/bug-report.md) for reporting unexpected behavior, broken specs, or inconsistencies.
2. **Feature Requests**: Use the [Feature Request Template](file:///.github/ISSUE_TEMPLATE/feature-request.md) for proposing new product capabilities or user-facing features.
3. **Technical Tasks**: Use the [Technical Task Template](file:///.github/ISSUE_TEMPLATE/technical-task.md) for architectural refactoring, infrastructure setups, or documentation updates.

Please ensure all issues explicitly reference the affected product domain (e.g., `Authentication`, `Classrooms`, `Live Classes`).

---

## 4. Pull Request (PR) Lifecycle

1. **Fork and Branch**: Create your branch from the latest `main`.
2. **Commit Messages**: Follow the Conventional Commits specification:
   ```text
   <type>(<scope>): <short summary>

   [optional body]

   [optional footer(s)]
   ```
   * *Types*: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
   * *Scopes*: One of the 19 core domains (e.g., `assignments`, `messaging`, `live`, `security`).
3. **PR Template**: Complete all sections of the [Pull Request Template](file:///.github/PULL_REQUEST_TEMPLATE.md).
4. **Draft PRs**: If your proposal is work-in-progress or requires feedback, open it as a Draft PR.

---

## 5. Code Review Guidelines

All proposals must undergo peer review prior to merging:

* **Two Approvals**: At least two core maintainer approvals are required for architectural changes.
* **Domain Integrity**: Ensure proposed changes do not violate domain boundaries (e.g., direct cross-domain database coupling).
* **Documentation Synchronization**: Any change to interfaces or schemas must be accompanied by updates to corresponding documentation in [`docs/`](file:///Users/soumyadeepxd/Developer/classroom/docs/README.md).
* **Tone and Collaboration**: Reviews must remain constructive, evidence-driven, and focused on system scalability and maintainability.

---

## 6. Documentation Requirements

* All new interfaces or conceptual services must be documented in Markdown.
* Diagrams must use native Mermaid syntax (````mermaid ... ````) to ensure maintainability in version control.
* Use exact domain terminology (e.g., *Classroom*, *Channel*, *Assignment*, *Submission*, *Grade*).
