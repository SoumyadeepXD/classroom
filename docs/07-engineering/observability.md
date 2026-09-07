# Observability & Metrics Architecture

## 1. Observability Pillars

Classroom Platform implements the three pillars of modern cloud-native observability:
1. **Metrics**: Real-time numerical timeseries data collected via **Prometheus**.
2. **Distributed Tracing**: Request timing profiles across services collected via **OpenTelemetry**.
3. **Dashboards & Alerts**: Visual status monitors and paging alerts configured in **Grafana**.

---

## 2. Core Service Metrics (Prometheus)

Spring Boot Actuator exposes standard `/actuator/prometheus` scrape targets:

| Metric Name | Type | Description | Alert Threshold |
| :--- | :--- | :--- | :--- |
| `http.server.requests` | Timer | Latency and throughput of REST endpoints | p95 > 250 ms |
| `websocket.active.connections` | Gauge | Currently connected WebSocket client sessions | Spike > 10,000 / node |
| `hikaricp.connections.active` | Gauge | Active PostgreSQL database connections in pool | > 85% pool capacity |
| `jvm.memory.used` | Gauge | JVM heap memory consumption | > 85% for 5 mins |
| `livekit.room.count` | Gauge | Number of active live classes | N/A (Capacity monitoring) |
| `livekit.participant.count` | Gauge | Active WebRTC video/audio participants | N/A |
| `storage.upload.failure.count` | Counter | Failed multipart file uploads | > 5 failures / min |

---

## 3. Health Checks & Probes

* **Liveness Probe (`/actuator/health/liveness`)**: Returns `200 OK` if the JVM is alive and processing requests.
* **Readiness Probe (`/actuator/health/readiness`)**: Returns `200 OK` only when PostgreSQL connection pool, Redis cache ping, and MinIO storage connectivity are fully established. If a database disconnect occurs, the pod is automatically removed from the ingress load balancer.
