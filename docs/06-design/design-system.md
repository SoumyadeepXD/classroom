# Design System Specifications

## 1. Overview & Visual Identity

The Classroom Platform design system provides a clear, high-legibility interface suited for hours of daily academic focus. It blends Discord's spatial hierarchy with Google Classroom's clarity and Telegram's crisp typography.

---

## 2. Color Tokens

### 2.1 Core Neutral Scale
* **Surface Background**: Light: `#F8FAFC` (`slate-50`) | Dark: `#0F172A` (`slate-900`)
* **Elevated Surface (Cards, Drawers)**: Light: `#FFFFFF` | Dark: `#1E293B` (`slate-800`)
* **Subtle Borders**: Light: `#E2E8F0` (`slate-200`) | Dark: `#334155` (`slate-700`)
* **Text Primary**: Light: `#0F172A` (`slate-900`) | Dark: `#F8FAFC` (`slate-50`)
* **Text Secondary**: Light: `#64748B` (`slate-500`) | Dark: `#94A3B8` (`slate-400`)

### 2.2 Semantic & Brand Accents
* **Academic Primary (Sapphire)**: `#2563EB` (`blue-600`) - Primary buttons, active tabs, highlights.
* **Live Broadcast (Crimson)**: `#DC2626` (`red-600`) - Live indicator badges, recording tally.
* **Success / Grade Passed (Emerald)**: `#16A34A` (`green-600`) - Submitted status, passing scores.
* **Warning / Due Soon (Amber)**: `#D97706` (`amber-600`) - Due date within 24h, late flags.
* **Voice Active (Violet)**: `#7C3AED` (`violet-600`) - Voice connected, speaking halo.

---

## 3. Typography Scale

* **Font Family**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
* **Monospace (Code & Rubrics)**: JetBrains Mono, "Fira Code", monospace.

| Token | Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `text-xs` | 12px | 16px | Regular / Medium | Timestamps, metadata, badges |
| `text-sm` | 14px | 20px | Regular / Medium | Chat messages, input labels, channel names |
| `text-base` | 16px | 24px | Regular | Standard body text, syllabus content |
| `text-lg` | 18px | 28px | SemiBold | Card headings, assignment titles |
| `text-xl` | 20px | 28px | Bold | Section headers, modal titles |
| `text-2xl` | 24px | 32px | Bold | Page titles, classroom header titles |

---

## 4. Spacing & Elevation

* **Base Grid**: 4px standard grid (4, 8, 12, 16, 24, 32, 48, 64px).
* **Border Radius**: Small (`4px`) for badges, Base (`8px`) for inputs/buttons, Large (`12px`) for cards/modals.
* **Elevation**:
  * `elevation-0`: Flat surfaces.
  * `elevation-1`: Subtle drop shadow for hover cards.
  * `elevation-2`: Modal dialogs and dropdown menus.
  * `elevation-3`: Fixed floating action elements and raised hand toasts.
