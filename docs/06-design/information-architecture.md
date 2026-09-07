# Information Architecture

## 1. Top-Level Spatial Layout

Classroom Platform uses a three-tier spatial navigation model designed to minimize cognitive overhead while navigating large courses.

```mermaid
graph TD
    subgraph Level1["Level 1: Institution & Course Rail (Far Left)"]
        Tenant[Institution Logo]
        CourseA[CS-201 Course Icon]
        CourseB[MATH-302 Course Icon]
        UserMe[User Profile & Settings]
    end

    subgraph Level2["Level 2: Classroom Workspace Sidebar"]
        CourseHeader[CS-201 Course Header & Term]
        AcademicTabs[Tabs: Stream | Coursework | People | Grades]
        ChannelCategories[Channel Categories & Voice Rooms]
    end

    subgraph Level3["Level 3: Primary Activity Canvas"]
        MainCanvas[Active Channel Chat / Live Stage / Assignment View]
    end

    subgraph Level4["Level 4: Contextual Drawer (Collapsible Right)"]
        ContextPanel[Thread Replies / Rubric Viewer / Active Attendees]
    end

    Level1 --> Level2
    Level2 --> Level3
    Level3 --> Level4
```

---

## 2. Classroom Workspace Navigation

When inside a specific course, the interface exposes four core navigation modes:

1. **Stream (Community & Channels)**:
   * Displays categorized text and voice channels.
   * Real-time discussions, threads, and spontaneous peer study tables.
2. **Coursework (Academic Hub)**:
   * Structured chronological syllabus view.
   * Grouped by modules/weeks: Assignments, Lecture Slide attachments, Readings.
3. **People (Roster & Sections)**:
   * Instructors, Teaching Assistants, and Student rosters grouped by section.
   * Presence indicators and direct message links.
4. **Grades (Evaluation Center)**:
   * For Students: Personal scorecard, rubric evaluations, instructor feedback.
   * For Teachers: Full gradebook grid with batch grading and CSV export.
