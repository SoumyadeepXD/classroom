# Accessibility & Inclusive Design (a11y)

## 1. Compliance Standard

Classroom Platform is committed to educational inclusion. All user interfaces across web and mobile must strictly satisfy **WCAG 2.1 Level AA** guidelines.

---

## 2. Core Accessibility Requirements

### 2.1 Color Contrast Ratios
* **Standard Text (14px - 18px)**: Minimum contrast ratio of 4.5:1 against background colors.
* **Large Text (>= 18px Bold or 24px Regular)**: Minimum contrast ratio of 3.0:1.
* **UI Components & Borders**: Minimum contrast ratio of 3.0:1 for active input boundaries and focus halos.
* Information must never be conveyed solely via color (e.g., late submissions must show an explicit text badge in addition to a red color).

### 2.2 Full Keyboard Navigation
* Every interactive feature (including channel switching, message reactions, video stage controls, and rubric scoring) must be 100% operable via keyboard alone.
* Focus indicators must be clearly visible (minimum 2px outline with high contrast offset).
* Skip links must be provided at the start of DOM trees (`Skip to Main Content`, `Skip to Navigation`).

### 2.3 Screen Reader & ARIA Semantics
* Semantic HTML5 landmark tags (`<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`).
* Dynamic live regions (`aria-live="polite"`) for incoming real-time chat messages and stage hand raises.
* Every icon-only button (e.g., mute mic, raise hand, send message) must have an explicit `aria-label`.

### 2.4 Live Lecture Accessibility
* Support for automated real-time closed captioning (STT) during WebRTC lectures.
* Transcript streams archived alongside recorded lectures for deaf or hard-of-hearing students.
