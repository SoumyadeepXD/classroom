# Self-Hosting & On-Premises Runbook

## 1. Overview & Self-Hosting Mission

Educational institutions frequently require complete data sovereignty due to national regulations, campus policies, or air-gapped network configurations. Classroom Platform provides a streamlined, **self-hosted single-node or clustered deployment** powered by Docker Compose.

---

## 2. Hardware & Operating System Requirements

* **Operating System**: Ubuntu 22.04 LTS / 24.04 LTS, Debian 12, or RHEL 9.
* **Minimum Specifications** (Up to 250 active students, 3 concurrent live lectures):
  * **CPU**: 4 Cores (x86_64 or ARM64)
  * **Memory**: 8 GB RAM
  * **Disk**: 120 GB SSD/NVMe (expandable for recordings and submissions)
  * **Network**: 100 Mbps uplink with public IPv4 address (for WebRTC NAT traversal)

---

## 3. Network & Firewall Port Allocation

For full functionality on self-hosted servers, the following ports must be accessible:

| Port | Protocol | Purpose | Visibility |
| :--- | :---: | :--- | :--- |
| `80` | TCP | HTTP (ACME Let's Encrypt challenge & redirect) | Public |
| `443` | TCP | HTTPS (Web UI, REST API, WebSocket) | Public |
| `7881` | TCP | LiveKit WebRTC TCP fallback | Public |
| `50000-50200` | UDP | LiveKit WebRTC Media Audio/Video Tracks | Public |
| `5432` | TCP | PostgreSQL Database | Internal Only (Loopback) |
| `6379` | TCP | Redis Cache | Internal Only (Loopback) |
| `9000/9001` | TCP | MinIO S3 API & Admin Console | Internal Only (Loopback) |

---

## 4. Air-Gapped & Offline Deployments

For military academies, research institutes, or air-gapped networks without public internet:
1. **Container Tarballs**: Base container images are exported into tar archives on an internet-connected staging host (`docker save`) and transferred via secure physical media.
2. **Internal CA Certificates**: Nginx reverse proxy integrates with the institution's private Certificate Authority (Internal Root CA) rather than public ACME/Let's Encrypt.
3. **Local STUN/TURN**: A local CoTURN server instance is deployed within the campus intranet to handle LAN-only WebRTC routing without external STUN lookups.
