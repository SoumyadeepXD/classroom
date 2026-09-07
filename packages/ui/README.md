# UI Component Package (`packages/ui/`)

## 1. Purpose of the Directory
`packages/ui/` represents the shared design system and component library for Classroom Platform. It provides accessible, theme-aware UI primitives (buttons, dialogs, inputs, avatars, tables, grade badges) designed to be shared across web interfaces and adaptive styling systems.

## 2. What Belongs Here
* Shared design tokens (color palette, typography scale, spacing tokens, elevation).
* Platform-agnostic component specifications and styling tokens.
* Storybook or component preview definitions (future).

## 3. What Does NOT Belong Here
* App-specific page components or monolithic screen containers (belongs in `apps/`).
* State stores or API fetching logic.
* Implementation code prior to approved scaffolding phase.

## 4. Relationship to Other Directories
* Consumed by `apps/web/` and adapts tokens for `apps/mobile/`.
* Implements design requirements defined in `docs/06-design/design-system.md`.
