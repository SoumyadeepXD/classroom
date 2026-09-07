# Database Infrastructure (`infrastructure/database/`)

## 1. Purpose of the Directory
`infrastructure/database/` contains infrastructure definitions, volume mount strategies, connection pooling baselines, and provisioning blueprints for the platform's data layer.

## 2. What Belongs Here
* Provisioning blueprints for database clusters.
* Connection pool sizing guidelines (e.g., HikariCP settings).
* Database initialization scripts and volume backup specifications.

## 3. What Does NOT Belong Here
* Application ORM entities or repositories (belongs in `backend/api/`).
* SQL migration scripts (belongs in `docs/04-database/` or backend resources).
* Hardcoded database credentials or production connection URIs.
