# Mobile UI Layout Specifications

## 1. Overview & Touch-First Design

The mobile application (`apps/mobile`) targets iOS and Android smartphones and tablets. It is optimized for one-handed operation, clear readability on smaller touchscreens, and rapid access to notifications and active classes.

---

## 2. Core Mobile Navigation Patterns

* **Persistent Bottom Navigation Bar**:
  * **Home / Courses**: Enrolled classroom list with unread activity badges.
  * **Channels / Chat**: Quick switcher for recently active course discussions.
  * **Calendar / Tasks**: Aggregated assignment due dates across all courses.
  * **Notifications**: Activity center and direct mentions.
  * **Profile**: Presence toggle, settings, download manager.
* **Minimum Touch Target Size**: All interactive elements (buttons, channel links, reaction icons) must meet or exceed 44x44 points (iOS) and 48x48 dp (Android).

---

## 3. Specialized Mobile Screens

### 3.1 Mobile Live Class (Audio-First / Picture-in-Picture)
* High-visibility banner when a enrolled course begins a live lecture.
* Tapping banner joins with audio immediately connected; video is streamed in optimized mobile resolution (360p/720p).
* Supports native **Picture-in-Picture (PiP)** on iOS and Android so students can take notes in other apps while watching.
* Audio-only mode toggle reduces cellular data consumption by up to 90%.

### 3.2 Mobile Document Scanner & Submission
* Native camera view with edge-detection overlay.
* Auto-crops paper homework pages, applies contrast filtering, and converts multi-page captures into a single optimized PDF.
* Instant one-tap turn-in with vibrational haptic feedback.
