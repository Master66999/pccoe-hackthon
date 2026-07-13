# ReLife AI — Complete Project Design Document
# Part 8: Security, Testing, Deployment & DevOps

---

## 38. SECURITY ARCHITECTURE

### Objective
Design a comprehensive security framework following industry best practices.

```
╔══════════════════════════════════════════════════════════════════════╗
║                     SECURITY ARCHITECTURE                            ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  AUTHENTICATION & AUTHORIZATION                                     ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ • JWT (RS256) with short-lived access tokens (15 min)     │     ║
║  │ • Refresh tokens (7 days) stored HTTP-only cookie          │     ║
║  │ • Password hashing: bcrypt (cost factor 12)               │     ║
║  │ • Role-Based Access Control (RBAC)                         │     ║
║  │ • Rate limiting: 100 req/min per user                      │     ║
║  │ • Account lockout after 5 failed login attempts           │     ║
║  │ • Password complexity enforcement (8+ chars, mixed)       │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  DATA PROTECTION                                                     ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ • HTTPS/TLS 1.3 for all API communications                │     ║
║  │ • AES-256 encryption for sensitive data at rest            │     ║
║  │ • PII minimization (collect only necessary data)          │     ║
║  │ • Database encryption (PostgreSQL TDE)                     │     ║
║  │ • Environment variables for secrets (never in code)       │     ║
║  │ • API key rotation policy (90 days)                        │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  APPLICATION SECURITY                                                ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ • Input validation (Pydantic schemas) on all endpoints    │     ║
║  │ • SQL injection prevention (SQLAlchemy ORM parameterized) │     ║
║  │ • XSS prevention (React's built-in escaping)              │     ║
║  │ • CSRF protection (SameSite cookies + CSRF tokens)        │     ║
║  │ • CORS whitelist (only allowed origins)                    │     ║
║  │ • File upload validation (type, size, virus scan)         │     ║
║  │ • Content Security Policy (CSP) headers                    │     ║
║  │ • Helmet.js-equivalent security headers                    │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  INFRASTRUCTURE SECURITY                                             ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ • Docker non-root containers                               │     ║
║  │ • Network segmentation (VPC, private subnets)             │     ║
║  │ • WAF (Web Application Firewall)                           │     ║
║  │ • DDoS protection (AWS Shield)                             │     ║
║  │ • Secrets management (AWS Secrets Manager)                 │     ║
║  │ • Container image vulnerability scanning                   │     ║
║  │ • Dependency vulnerability scanning (Dependabot/Snyk)     │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  AUDIT & COMPLIANCE                                                  ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ • Comprehensive audit logging (all CRUD operations)       │     ║
║  │ • GDPR compliance (data export, right to deletion)        │     ║
║  │ • ISO 27001 alignment                                      │     ║
║  │ • Regular penetration testing                              │     ║
║  │ • Security incident response plan                          │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 39. LOGGING

### Objective
Implement structured, centralized logging for debugging, monitoring, and audit trails.

```
╔══════════════════════════════════════════════════════════════════╗
║                      LOGGING ARCHITECTURE                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  LOGGING STACK:                                                  ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │ Application → Structlog → JSON → stdout → CloudWatch   │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                                                                  ║
║  LOG LEVELS:                                                     ║
║  ┌──────────┬────────────────────────────────────────────┐      ║
║  │ Level    │ Usage                                      │      ║
║  ├──────────┼────────────────────────────────────────────┤      ║
║  │ DEBUG    │ Detailed diagnostic info (dev only)        │      ║
║  │ INFO     │ Normal operations (scan started, completed)│      ║
║  │ WARNING  │ Recoverable issues (fallback triggered)    │      ║
║  │ ERROR    │ Failures (scan failed, API error)          │      ║
║  │ CRITICAL │ System-level failures (DB down, OOM)       │      ║
║  └──────────┴────────────────────────────────────────────┘      ║
║                                                                  ║
║  STRUCTURED LOG FORMAT:                                          ║
║  {                                                               ║
║    "timestamp": "2025-07-10T14:30:00Z",                        ║
║    "level": "INFO",                                              ║
║    "service": "scan_service",                                    ║
║    "event": "scan_completed",                                    ║
║    "user_id": "uuid",                                            ║
║    "device_id": "uuid",                                          ║
║    "scan_id": "uuid",                                            ║
║    "duration_ms": 45230,                                         ║
║    "components_scanned": 17,                                     ║
║    "health_score": 78.5,                                         ║
║    "correlation_id": "req-uuid"                                  ║
║  }                                                               ║
║                                                                  ║
║  KEY LOGGING POINTS:                                             ║
║  ├─ API request/response (method, path, status, duration)       ║
║  ├─ Authentication events (login, logout, token refresh)         ║
║  ├─ Scan lifecycle (started, component progress, completed)     ║
║  ├─ ML inference (model version, input shape, prediction time)  ║
║  ├─ CV analysis (image count, detections, confidence)           ║
║  ├─ LLM calls (prompt length, response length, latency)        ║
║  ├─ Database queries (slow query log > 100ms)                   ║
║  └─ Error details (stack trace, context)                         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Technology Used
- structlog (structured logging for Python)
- Python logging (stdlib)
- AWS CloudWatch / ELK Stack (log aggregation)
- Correlation IDs for request tracing

---

## 40. ERROR HANDLING

### Objective
Implement comprehensive error handling with graceful degradation.

```
╔══════════════════════════════════════════════════════════════════╗
║                     ERROR HANDLING STRATEGY                       ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ERROR HIERARCHY:                                                ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ BaseReLifeException                                      │   ║
║  │ ├── AuthenticationError (401)                            │   ║
║  │ │   ├── InvalidCredentialsError                          │   ║
║  │ │   ├── TokenExpiredError                                │   ║
║  │ │   └── InsufficientPermissionsError (403)              │   ║
║  │ ├── ValidationError (422)                                │   ║
║  │ │   ├── InvalidScanDataError                             │   ║
║  │ │   └── InvalidImageFormatError                          │   ║
║  │ ├── ResourceNotFoundError (404)                          │   ║
║  │ │   ├── DeviceNotFoundError                              │   ║
║  │ │   ├── ScanNotFoundError                                │   ║
║  │ │   └── UserNotFoundError                                │   ║
║  │ ├── ScanError (500)                                      │   ║
║  │ │   ├── ComponentScanFailedError                         │   ║
║  │ │   ├── ScanTimeoutError                                 │   ║
║  │ │   └── InsufficientPermissionsError                     │   ║
║  │ ├── MLInferenceError (500)                               │   ║
║  │ │   ├── ModelNotLoadedError                              │   ║
║  │ │   ├── FeaturePipelineError                             │   ║
║  │ │   └── PredictionError                                  │   ║
║  │ ├── CVAnalysisError (500)                                │   ║
║  │ │   ├── ImageProcessingError                             │   ║
║  │ │   └── ModelInferenceError                              │   ║
║  │ ├── ExternalServiceError (502)                           │   ║
║  │ │   ├── LLMAPIError                                      │   ║
║  │ │   └── GeocodingAPIError                                │   ║
║  │ └── DatabaseError (500)                                  │   ║
║  │     ├── ConnectionError                                  │   ║
║  │     └── IntegrityError                                   │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  ERROR RESPONSE FORMAT (RFC 7807):                               ║
║  {                                                               ║
║    "type": "https://api.relife.ai/errors/scan-failed",         ║
║    "title": "Component Scan Failed",                             ║
║    "status": 500,                                                ║
║    "detail": "Battery scanner failed: WMI access denied",       ║
║    "instance": "/api/v1/scans/uuid",                            ║
║    "correlation_id": "req-uuid",                                 ║
║    "timestamp": "2025-07-10T14:30:00Z"                          ║
║  }                                                               ║
║                                                                  ║
║  GRACEFUL DEGRADATION:                                           ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ If battery scanner fails → Skip, mark as "unavailable"  │   ║
║  │ If ML model fails → Fall back to rule-based scoring     │   ║
║  │ If LLM API fails → Use template-based explanations      │   ║
║  │ If CV model fails → Skip damage, note in report         │   ║
║  │ If DB write fails → Queue for retry, return partial     │   ║
║  │ If external API fails → Use cached/default values       │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 41. TESTING STRATEGY

### Objective
Define comprehensive testing at all levels.

```
╔══════════════════════════════════════════════════════════════════╗
║                      TESTING PYRAMID                              ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║                        ┌──────────┐                              ║
║                        │  E2E     │  5-10 tests                 ║
║                        │  Tests   │  (Playwright)               ║
║                       ┌┴──────────┴┐                             ║
║                       │ Integration │  30-50 tests              ║
║                       │   Tests     │  (pytest + TestClient)    ║
║                      ┌┴─────────────┴┐                           ║
║                      │   Unit Tests   │  200+ tests             ║
║                      │                │  (pytest + jest)        ║
║                     ┌┴────────────────┴┐                         ║
║                     │  ML Model Tests   │  50+ tests            ║
║                     │                   │  (pytest)             ║
║                     └───────────────────┘                        ║
║                                                                  ║
║  UNIT TESTS (Backend - pytest):                                  ║
║  ├─ Health scoring algorithm correctness                        ║
║  ├─ Repairability score calculation                             ║
║  ├─ Carbon savings calculation                                  ║
║  ├─ RUL estimation logic                                        ║
║  ├─ Feature engineering pipeline                                ║
║  ├─ Cost estimation logic                                       ║
║  ├─ JWT token generation/validation                             ║
║  ├─ Pydantic schema validation                                  ║
║  └─ Business rule validation                                    ║
║                                                                  ║
║  UNIT TESTS (Frontend - Jest + React Testing Library):           ║
║  ├─ Component rendering                                         ║
║  ├─ User interactions (click, type)                             ║
║  ├─ State management (Zustand stores)                           ║
║  ├─ API service layer mocking                                   ║
║  └─ Form validation                                             ║
║                                                                  ║
║  INTEGRATION TESTS:                                              ║
║  ├─ Full scan flow (submit → process → results)                ║
║  ├─ Auth flow (register → login → protected route)             ║
║  ├─ Device lifecycle (create → scan → passport)                ║
║  ├─ API endpoint testing with test database                     ║
║  └─ ML pipeline integration (feature → inference → output)     ║
║                                                                  ║
║  ML MODEL TESTS:                                                 ║
║  ├─ Model loading and inference shape validation                ║
║  ├─ Prediction range validation (scores within 0-100)          ║
║  ├─ Edge case handling (all zeros, all max, missing data)      ║
║  ├─ Performance benchmarks (inference < 100ms)                 ║
║  ├─ Regression tests (known input → expected output)           ║
║  └─ CV model accuracy on test set (mAP > 0.7)                 ║
║                                                                  ║
║  E2E TESTS (Playwright):                                         ║
║  ├─ User registration and login flow                            ║
║  ├─ Complete scan workflow                                      ║
║  ├─ Dashboard visualization rendering                           ║
║  ├─ Report generation and PDF export                            ║
║  └─ Passport generation and QR code display                    ║
║                                                                  ║
║  COVERAGE TARGET: ≥ 80% overall, 95% for scoring algorithms   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 42. DEPLOYMENT ARCHITECTURE

```
╔══════════════════════════════════════════════════════════════════════╗
║                   DEPLOYMENT ARCHITECTURE (AWS)                      ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ┌─────────────────────────────────────────────────────────────┐   ║
║  │                        INTERNET                              │   ║
║  └────────────────────────┬────────────────────────────────────┘   ║
║                           │                                         ║
║  ┌────────────────────────▼────────────────────────────────────┐   ║
║  │                    CloudFront CDN                            │   ║
║  │              (Static assets + caching)                       │   ║
║  └────────────────────────┬────────────────────────────────────┘   ║
║                           │                                         ║
║  ┌────────────────────────▼────────────────────────────────────┐   ║
║  │                Application Load Balancer                     │   ║
║  │                    (HTTPS termination)                        │   ║
║  └──────────┬──────────────────────────┬───────────────────────┘   ║
║             │                          │                            ║
║  ┌──────────▼──────────┐   ┌──────────▼──────────┐               ║
║  │   ECS Fargate       │   │   ECS Fargate       │               ║
║  │   (Backend API)     │   │   (ML Inference)    │               ║
║  │                     │   │                     │               ║
║  │   FastAPI + Uvicorn │   │   Model Serving     │               ║
║  │   Auto-scaling      │   │   GPU instances     │               ║
║  │   2-10 tasks        │   │   (for CV)          │               ║
║  └──────────┬──────────┘   └──────────┬──────────┘               ║
║             │                          │                            ║
║  ┌──────────▼──────────────────────────▼──────────────────────┐   ║
║  │                    VPC (Private Subnet)                     │   ║
║  │                                                             │   ║
║  │  ┌────────────────┐  ┌──────────────┐  ┌──────────────┐  │   ║
║  │  │  RDS PostgreSQL│  │  ElastiCache │  │  S3 Bucket   │  │   ║
║  │  │  (Multi-AZ)    │  │  (Redis)     │  │  (Images,    │  │   ║
║  │  │                │  │  (Sessions,  │  │   Models,    │  │   ║
║  │  │  Primary +     │  │   Cache)     │  │   Reports)   │  │   ║
║  │  │  Read Replica  │  │              │  │              │  │   ║
║  │  └────────────────┘  └──────────────┘  └──────────────┘  │   ║
║  │                                                             │   ║
║  └─────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
║  ELECTRON APP DISTRIBUTION:                                          ║
║  ┌─────────────────────────────────────────────────────────────┐   ║
║  │ • electron-builder for packaging (.exe, .msi)               │   ║
║  │ • Auto-update via electron-updater (S3 hosted)              │   ║
║  │ • Code signing (Windows Authenticode)                        │   ║
║  │ • GitHub Releases for distribution                           │   ║
║  └─────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 43. CI/CD PIPELINE

```
╔══════════════════════════════════════════════════════════════════════╗
║                      CI/CD PIPELINE                                  ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  TRIGGER: Push to main / Pull Request                               ║
║                                                                      ║
║  ┌──────────────────────────────────────────────────────────────┐  ║
║  │  STAGE 1: BUILD & LINT                                       │  ║
║  │  ├─ Python: flake8, black, isort, mypy                      │  ║
║  │  ├─ JavaScript: ESLint, Prettier                             │  ║
║  │  ├─ Backend: pip install, build check                        │  ║
║  │  └─ Frontend: npm install, build check                       │  ║
║  └──────────────────────┬───────────────────────────────────────┘  ║
║                         ▼                                            ║
║  ┌──────────────────────────────────────────────────────────────┐  ║
║  │  STAGE 2: TEST                                               │  ║
║  │  ├─ Backend unit tests (pytest --cov)                        │  ║
║  │  ├─ Frontend unit tests (jest --coverage)                    │  ║
║  │  ├─ ML model tests (pytest ml/)                              │  ║
║  │  ├─ Integration tests (pytest integration/)                  │  ║
║  │  └─ Coverage check (fail if < 80%)                           │  ║
║  └──────────────────────┬───────────────────────────────────────┘  ║
║                         ▼                                            ║
║  ┌──────────────────────────────────────────────────────────────┐  ║
║  │  STAGE 3: SECURITY SCAN                                      │  ║
║  │  ├─ Dependency vulnerability scan (safety, npm audit)        │  ║
║  │  ├─ SAST scan (Bandit for Python, ESLint security rules)    │  ║
║  │  └─ Docker image scan (Trivy)                                │  ║
║  └──────────────────────┬───────────────────────────────────────┘  ║
║                         ▼                                            ║
║  ┌──────────────────────────────────────────────────────────────┐  ║
║  │  STAGE 4: BUILD & PUSH (main branch only)                   │  ║
║  │  ├─ Build Docker images (backend, frontend)                  │  ║
║  │  ├─ Push to ECR (AWS Container Registry)                     │  ║
║  │  └─ Tag with git SHA and version                             │  ║
║  └──────────────────────┬───────────────────────────────────────┘  ║
║                         ▼                                            ║
║  ┌──────────────────────────────────────────────────────────────┐  ║
║  │  STAGE 5: DEPLOY                                             │  ║
║  │  ├─ Deploy to staging (auto)                                 │  ║
║  │  ├─ Run E2E tests against staging                            │  ║
║  │  ├─ Deploy to production (manual approval)                   │  ║
║  │  └─ Health check verification                                │  ║
║  └──────────────────────────────────────────────────────────────┘  ║
║                                                                      ║
║  TOOLS: GitHub Actions, Docker, AWS ECR, AWS ECS                    ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 44. DOCKER ARCHITECTURE

```
╔══════════════════════════════════════════════════════════════════╗
║                    DOCKER ARCHITECTURE                           ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  docker-compose.yml:                                             ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │                                                          │   ║
║  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   ║
║  │  │   nginx      │  │   backend    │  │   frontend   │  │   ║
║  │  │   :80/:443   │  │   :8000      │  │   :3000      │  │   ║
║  │  │              │──│►             │  │   (dev only) │  │   ║
║  │  │  Reverse     │  │  FastAPI +   │  │   React      │  │   ║
║  │  │  Proxy       │  │  Uvicorn     │  │   Dev Server │  │   ║
║  │  └──────────────┘  └──────┬───────┘  └──────────────┘  │   ║
║  │                           │                              │   ║
║  │              ┌────────────┼────────────┐                 │   ║
║  │              │            │            │                 │   ║
║  │  ┌───────────▼──┐  ┌─────▼──────┐  ┌─▼────────────┐   │   ║
║  │  │   postgres   │  │   redis    │  │   ml_worker  │   │   ║
║  │  │   :5432      │  │   :6379    │  │   (optional) │   │   ║
║  │  │              │  │            │  │              │   │   ║
║  │  │  PostgreSQL  │  │  Cache +   │  │  ML model    │   │   ║
║  │  │  15-alpine   │  │  Sessions  │  │  inference   │   │   ║
║  │  └──────────────┘  └────────────┘  └──────────────┘   │   ║
║  │                                                          │   ║
║  │  Volumes:                                                │   ║
║  │  ├─ postgres_data (persistent)                          │   ║
║  │  ├─ redis_data (persistent)                             │   ║
║  │  ├─ ml_models (shared model files)                      │   ║
║  │  └─ uploads (user-uploaded images)                      │   ║
║  │                                                          │   ║
║  │  Networks:                                               │   ║
║  │  ├─ frontend_net (nginx ↔ frontend)                    │   ║
║  │  ├─ backend_net (nginx ↔ backend ↔ db ↔ redis)       │   ║
║  │  └─ ml_net (backend ↔ ml_worker)                       │   ║
║  │                                                          │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  DOCKERFILE BEST PRACTICES:                                      ║
║  ├─ Multi-stage builds (minimize image size)                    ║
║  ├─ Non-root user execution                                     ║
║  ├─ .dockerignore for build context optimization                ║
║  ├─ Health checks for all services                              ║
║  ├─ Pinned base image versions                                  ║
║  └─ Layer caching optimization (requirements before code)       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```
