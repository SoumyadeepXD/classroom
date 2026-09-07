# LiveKit Media Streaming Infrastructure (`infrastructure/livekit/`)

## 1. Purpose of the Directory
`infrastructure/livekit/` provides deployment and scaling specifications for LiveKit, an open-source, WebRTC-based Selective Forwarding Unit (SFU) designed for high-concurrency audio, video, screen-sharing, and recording pipelines.

## 2. Technical Profile (Proposed)
* **Components**:
  * **LiveKit Server**: WebRTC SFU handling low-latency audio/video routing.
  * **LiveKit Egress**: Headless composite recorder that renders virtual classrooms and saves MP4/HLS streams directly into MinIO/S3.
  * **LiveKit Ingress**: RTMP/WHIP ingestion gateway for broadcast streams.
* **Network Requirements**:
  * TCP port 7880 (HTTP / WebSocket signaling)
  * TCP port 7881 (WebRTC over TCP fallback)
  * UDP port range 50000-60000 (WebRTC media streams)

## 3. What Belongs Here
* LiveKit server configuration blueprints (`livekit.yaml` specs).
* TURN/STUN server allocation guidelines for NAT traversal.
* Egress service deployment blueprints for automated class recording.

## 4. What Does NOT Belong Here
* Client-side WebRTC SDK code (belongs in `apps/web/` and `apps/mobile/`).
* LiveKit token generation logic (belongs in `backend/api/`).
