# Web UI Layout Specifications

## 1. Desktop Layout & Responsive Breakpoints

The web application (`apps/web`) is optimized for widescreen desktop and laptop displays (1280px to 1920px+), while maintaining fluid responsiveness down to tablet (768px) and mobile viewport widths (360px).

| Viewport Category | Width Range | Layout Adaptation |
| :--- | :--- | :--- |
| **Wide Desktop** | >= 1440px | Full 4-pane view: Course Rail + Channel Sidebar + Canvas + Context Drawer |
| **Standard Desktop** | 1024px - 1439px | 3-pane view: Rail + Sidebar + Canvas; Drawer overlays or toggles |
| **Tablet** | 768px - 1023px | Collapsible sidebar; canvas expands to fill width |
| **Mobile Web** | < 768px | Bottom navigation sheet; single-pane full screen with slide-over drawers |

---

## 2. Key Screen Blueprints

### 2.1 The Gradebook View (Instructor)
* Dense data table displaying enrolled students along rows and assignments along columns.
* Fast keyboard navigation: Arrow keys move across cells; Enter opens the quick-grade rubric popover.
* Visual color coding: Green (graded), Yellow (turned in, unreviewed), Red (missing/past due).

### 2.2 Live Stage Lecture Interface
* **Stage Area**: Dominates the canvas (16:9 ratio), spotlighting instructor video or screen-shared CAD/slides.
* **Speaker Strip**: Floating thumbnail strip displaying active co-hosts and students with raised hands.
* **Integrated Side-Chat**: Real-time lecture questions stream synchronized with the live video timeline.
* **Presenter Bar**: Bottom toolbar with Mute, Camera, Screen Share, Whiteboard, Breakout Rooms, and End Call buttons.
