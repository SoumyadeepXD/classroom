# Monitoring & Observability Infrastructure (`infrastructure/monitoring/`)

## 1. Purpose of the Directory
`infrastructure/monitoring/` defines blueprints for system metrics collection, distributed tracing, log aggregation, and alert management across all platform tiers.

## 2. Observability Stack (Proposed)
* **Metrics**: Prometheus scraping Spring Boot Actuator, LiveKit metrics, and PostgreSQL/Redis exporters.
* **Dashboards**: Grafana dashboards for system health, API latencies, active WebRTC rooms, and error rates.
* **Tracing**: OpenTelemetry (OTel) collectors feeding Jaeger or Tempo for end-to-end request tracing.
* **Logging**: Structured JSON logging aggregated into OpenSearch, Loki, or Elasticsearch.

## 3. What Belongs Here
* Prometheus scrape configuration specs.
* Grafana dashboard JSON layout definitions (future).
* Alertmanager threshold definitions (e.g., elevated error rates, disk exhaustion).

## 4. What Does NOT Belong Here
* Application log statements (belongs in source code).
* Secret tokens or telemetry credentials.
