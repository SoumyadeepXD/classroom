# Git Workflow & Release Governance

## 1. Branching Model

Classroom Platform adheres to **Trunk-Based Development** with short-lived feature branches:

* `main`: The single production-ready trunk. Direct pushes are disabled. Protected by CI quality gates.
* Feature branches: Branched directly off `main` and merged via squash-and-merge PRs.
  * `feat/<issue-id>-<description>`: New functional capabilities (e.g., `feat/204-rubric-eval-endpoint`).
  * `fix/<issue-id>-<description>`: Bug fixes and security patches (e.g., `fix/212-websocket-reconnect`).
  * `docs/<issue-id>-<description>`: Documentation additions and revisions.
  * `refactor/<description>`: Code structure improvements without functional change.

---

## 2. Conventional Commit Standards

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<domain-scope>): <imperative summary>

[optional detailed body explaining technical reasoning]

[optional issue reference: Fixes #123]
```

### Allowed Types
* `feat`: A new user-facing or platform capability.
* `fix`: A bug fix.
* `docs`: Documentation changes only.
* `style`: Code style changes (whitespace, formatting) with no logic change.
* `refactor`: Code change that neither fixes a bug nor adds a feature.
* `perf`: Code change that improves performance.
* `test`: Adding missing tests or correcting existing tests.
* `chore`: Build tasks, package updates, or repository maintenance.

### Allowed Scopes
Must strictly be one of the 19 core domains (e.g., `auth`, `users`, `classrooms`, `channels`, `messaging`, `files`, `assignments`, `submissions`, `grades`, `live`, `recordings`, `notifications`, `search`, `moderation`, `admin`, `security`, `deployment`).

---

## 3. Pull Request Gates

Before any PR can be merged into `main`, it must pass:
1. **Automated Linter & Type Check**: Zero warnings or errors.
2. **Automated Test Suite**: 100% unit and integration test pass rate.
3. **Peer Review**: At least two code approvals from core domain maintainers.
4. **Documentation Check**: Any public API or schema change must include corresponding doc updates in `docs/`.
