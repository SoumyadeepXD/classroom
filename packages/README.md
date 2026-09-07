# Shared Packages (`packages/`)

## 1. Purpose of the Directory
The `packages/` directory holds shared internal libraries, types, configurations, and utilities that are consumed across multiple applications (`apps/web`, `apps/mobile`) and development tooling.

Using a monorepo package structure prevents code duplication, ensures atomic interface updates across frontend surfaces, and establishes a single source of truth for design tokens and domain models.

## 2. Shared Packages Overview

```text
packages/
├── README.md             # Shared packages overview
├── ui/                   # Reusable UI component primitives & design tokens
├── types/                # TypeScript interface definitions for API & domain models
├── config/               # Shared ESLint, Prettier, TypeScript, and Tailwind configurations
└── utilities/            # Platform-agnostic helpers, validators, and formatters
```

## 3. What Belongs Here
* Platform-agnostic utilities (date math, formatting, string sanitization).
* Shared data contracts and payload schemas.
* Shared design system primitives and style configs.

## 4. What Does NOT Belong Here
* Application-specific business logic or routing (belongs in `apps/`).
* Server database drivers or ORM entities (belongs in `backend/`).
* Implementation code prior to approved scaffolding phase.
