# Mobile Application (`apps/mobile/`)

## 1. Purpose of the Directory
`apps/mobile/` represents the conceptual mobile application blueprint for Classroom Platform. It targets smartphones and tablets running iOS and Android, providing on-the-go access to classrooms, notifications, messaging, and live class participation.

The proposed architecture leverages **React Native** with **Expo**.

## 2. Directory Structure

```text
apps/mobile/
├── README.md             # Mobile application blueprint overview
├── assets/               # Mobile assets (app icons, splash screens, audio cues)
├── src/
│   ├── app/              # Expo Router or mobile screen navigation hierarchy
│   ├── components/       # Mobile-specific UI elements and native views
│   ├── features/         # Feature-based domain modules
│   │   ├── auth/           # Mobile authentication, biometric login, session store
│   │   ├── users/          # User profile, presence settings, device tokens
│   │   ├── classrooms/     # Course overview, section lists, offline syllabus
│   │   ├── channels/       # Channel lists, voice room drawers
│   │   ├── messaging/      # Chat feed, quick replies, push message handling
│   │   ├── files/          # File viewer, media caching, camera/attachment integration
│   │   ├── assignments/    # Assignment deadlines, status cards, push alerts
│   │   ├── submissions/    # Camera document scanner, submission upload progress
│   │   ├── grades/         # Grade viewer, feedback view
│   │   ├── live-classes/   # Mobile WebRTC live streaming room, PIP mode
│   │   ├── recordings/     # Video player, offline caching, playback speed
│   │   └── notifications/  # Local push notification listeners, notification feed
│   ├── hooks/            # Mobile-specific hooks (orientation, network state)
│   ├── lib/              # Mobile libraries and native bridge wrappers
│   ├── services/         # API clients and offline sync services
│   ├── stores/           # Mobile client state stores (e.g., Zustand/MMKV)
│   ├── types/            # Mobile-specific type definitions
│   └── utils/            # Mobile-specific formatters and utilities
└── tests/                # Mobile unit and component tests
```

## 3. What Belongs Here
* React Native screen components, native device integrations (camera, biometrics, audio).
* Mobile navigation layouts and push notification handlers.
* Offline caching and local SQLite/MMKV persistence logic.

## 4. What Does NOT Belong Here
* Web-specific DOM logic or HTML/CSS stylesheets (belongs in `apps/web/`).
* Heavy backend business transactions or SQL databases (belongs in `backend/`).
* Direct database connections (must communicate via `backend/api/`).
* Implementation code prior to approved scaffolding phase.

## 5. Relationship to Other Directories
* Consumes `packages/types` for API models and WebSocket events.
* Consumes `packages/utilities` for platform-agnostic formatters and date handlers.
* Communicates with `backend/api/` and LiveKit SFU instances.
