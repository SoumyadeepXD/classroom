# Web Application (`apps/web/`)

## 1. Purpose of the Directory
`apps/web/` represents the conceptual web application blueprint for Classroom Platform. It provides a browser-based user experience for students, teachers, teaching assistants, and institutional administrators.

The proposed architecture leverages **Next.js** with server-side rendering (SSR), static optimization, and streaming client components.

## 2. Directory Structure

```text
apps/web/
├── README.md             # Web application blueprint overview
├── public/               # Static web assets (fonts, icons, public branding)
├── src/
│   ├── app/              # Next.js App Router routing structure (future)
│   ├── components/       # Application-specific UI components
│   ├── features/         # Feature-based domain modules
│   │   ├── auth/           # Login, MFA, registration, session management
│   │   ├── users/          # Profiles, settings, user cards
│   │   ├── institutions/   # Tenant switching, institutional branding
│   │   ├── classrooms/     # Course overview, syllabi, section navigation
│   │   ├── channels/       # Text, voice, and announcement channel trees
│   │   ├── messaging/      # Real-time chat, thread feeds, reactions
│   │   ├── files/          # File uploads, previews, academic library
│   │   ├── assignments/    # Task creation, rubric viewers, due dates
│   │   ├── submissions/    # Student file turn-in, revision history
│   │   ├── grades/         # Gradebook, student feedback, score cards
│   │   ├── live-classes/   # WebRTC live lecture rooms, stage management
│   │   ├── recordings/     # Lecture archive playback, chapter navigation
│   │   ├── notifications/  # Notification center, badge indicators
│   │   ├── search/         # Unified global search interface
│   │   └── administration/ # Admin console, user management, audit logs
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Third-party client wrappers and initialization
│   ├── services/         # API client abstractions and network calls
│   ├── stores/           # Client-side state stores (e.g., Zustand/Jotai)
│   ├── types/            # Web-specific type extensions
│   └── utils/            # Web-specific helper functions
└── tests/                # Web unit, component, and integration tests
```

## 3. What Belongs Here
* Domain features and pages for browser consumption.
* Web-specific client state management, routing, and UI layout compositions.
* Browser-level caching and service worker definitions.

## 4. What Does NOT Belong Here
* Mobile-specific native code or React Native primitives (belongs in `apps/mobile/`).
* Business domain entities or backend persistence logic (belongs in `backend/`).
* Shared cross-client logic or agnostic UI components (belongs in `packages/ui`).
* Implementation code prior to approved scaffolding phase.

## 5. Relationship to Other Directories
* Consumes `packages/ui` for standardized components and design system tokens.
* Consumes `packages/types` for API response payloads and model contracts.
* Interacts directly with `backend/api/` via HTTP/REST, WebSocket, and LiveKit WebRTC connections.
