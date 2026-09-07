# Automation & Operational Scripts (`scripts/`)

## 1. Purpose of the Directory
The `scripts/` directory is designed to house automation, database seeding, deployment assistance, operational maintenance, and disaster recovery scripts.

## 2. Directory Structure

```text
scripts/
├── README.md             # Scripts directory overview
├── development/          # Developer environment bootstrap & cleanup scripts
├── database/             # Schema migration triggers, demo data seeds, and vacuuming
├── deployment/           # Image building, version tagging, and cluster promotion
├── maintenance/          # Storage pruning, orphan file sweepers, audit log archiving
└── self-hosted/          # Self-hosted setup wizards, backup scripts, and diagnostics
```

## 3. What Belongs Here
* Maintenance routines, backup automation, and test data seeding scripts.
* CLI setup helpers for self-hosted system administrators.

## 4. What Does NOT Belong Here
* Application business logic (belongs in `backend/` or `apps/`).
* CI/CD pipeline definitions (belongs in `.github/`).
* Plaintext credentials or secrets.
* Executable shell scripts prior to official scripting phase.
