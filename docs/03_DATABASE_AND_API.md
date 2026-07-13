# ReLife AI — Complete Project Design Document
# Part 3: Folder Structure, Database Design & API Architecture

---

## 11. FOLDER STRUCTURE

### Objective
Define a professional, scalable project structure following Clean Architecture principles.

```
relife-ai/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI pipeline
│       ├── cd.yml                    # CD pipeline
│       └── lint.yml                  # Linting checks
│
├── docker/
│   ├── Dockerfile.backend           # Backend container
│   ├── Dockerfile.frontend          # Frontend build
│   ├── Dockerfile.scanner           # Scanner agent
│   ├── docker-compose.yml           # Full stack orchestration
│   ├── docker-compose.dev.yml       # Development overrides
│   └── nginx/
│       └── nginx.conf               # Reverse proxy config
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI app entry point
│   │   ├── config.py                # Configuration management
│   │   ├── dependencies.py          # Dependency injection setup
│   │   │
│   │   ├── api/                     # Presentation Layer
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── router.py        # API version router
│   │   │   │   ├── auth.py          # Auth endpoints
│   │   │   │   ├── users.py         # User endpoints
│   │   │   │   ├── devices.py       # Device endpoints
│   │   │   │   ├── scans.py         # Scan endpoints
│   │   │   │   ├── health.py        # Health score endpoints
│   │   │   │   ├── recommendations.py
│   │   │   │   ├── cv_analysis.py   # Computer Vision endpoints
│   │   │   │   ├── passport.py      # Digital passport endpoints
│   │   │   │   ├── carbon.py        # Carbon impact endpoints
│   │   │   │   ├── reports.py       # Report generation
│   │   │   │   ├── analytics.py     # Analytics dashboard
│   │   │   │   ├── marketplace.py   # Marketplace endpoints
│   │   │   │   └── admin.py         # Admin endpoints
│   │   │   └── middleware/
│   │   │       ├── __init__.py
│   │   │       ├── auth_middleware.py
│   │   │       ├── rate_limiter.py
│   │   │       ├── cors.py
│   │   │       └── logging_middleware.py
│   │   │
│   │   ├── domain/                  # Domain Layer (Entities & Business Logic)
│   │   │   ├── __init__.py
│   │   │   ├── entities/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── user.py
│   │   │   │   ├── device.py
│   │   │   │   ├── scan.py
│   │   │   │   ├── component.py
│   │   │   │   ├── health_score.py
│   │   │   │   ├── recommendation.py
│   │   │   │   ├── passport.py
│   │   │   │   ├── carbon_impact.py
│   │   │   │   └── marketplace_listing.py
│   │   │   ├── value_objects/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── component_type.py
│   │   │   │   ├── health_status.py
│   │   │   │   ├── recommendation_type.py
│   │   │   │   └── damage_severity.py
│   │   │   └── interfaces/
│   │   │       ├── __init__.py
│   │   │       ├── i_user_repository.py
│   │   │       ├── i_device_repository.py
│   │   │       ├── i_scan_repository.py
│   │   │       ├── i_health_service.py
│   │   │       ├── i_recommendation_service.py
│   │   │       ├── i_cv_service.py
│   │   │       └── i_llm_service.py
│   │   │
│   │   ├── services/                # Application Layer (Use Cases)
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── user_service.py
│   │   │   ├── device_service.py
│   │   │   ├── scan_service.py
│   │   │   ├── health_scoring_service.py
│   │   │   ├── recommendation_service.py
│   │   │   ├── cv_analysis_service.py
│   │   │   ├── llm_service.py
│   │   │   ├── carbon_service.py
│   │   │   ├── cost_estimation_service.py
│   │   │   ├── passport_service.py
│   │   │   ├── report_service.py
│   │   │   ├── analytics_service.py
│   │   │   └── marketplace_service.py
│   │   │
│   │   ├── infrastructure/          # Infrastructure Layer
│   │   │   ├── __init__.py
│   │   │   ├── database/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── session.py       # DB session management
│   │   │   │   ├── base.py          # SQLAlchemy base
│   │   │   │   └── migrations/      # Alembic migrations
│   │   │   │       ├── env.py
│   │   │   │       └── versions/
│   │   │   ├── repositories/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── user_repository.py
│   │   │   │   ├── device_repository.py
│   │   │   │   ├── scan_repository.py
│   │   │   │   ├── component_repository.py
│   │   │   │   ├── health_repository.py
│   │   │   │   ├── recommendation_repository.py
│   │   │   │   ├── passport_repository.py
│   │   │   │   └── analytics_repository.py
│   │   │   ├── external/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── openai_client.py
│   │   │   │   ├── ollama_client.py
│   │   │   │   └── geocoding_client.py
│   │   │   └── cache/
│   │   │       ├── __init__.py
│   │   │       └── redis_cache.py
│   │   │
│   │   ├── ml/                      # AI/ML Module
│   │   │   ├── __init__.py
│   │   │   ├── models/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── health_model.py
│   │   │   │   ├── rul_model.py     # Remaining Useful Life
│   │   │   │   ├── anomaly_model.py
│   │   │   │   └── damage_model.py  # CV damage detection
│   │   │   ├── pipelines/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── feature_pipeline.py
│   │   │   │   ├── inference_pipeline.py
│   │   │   │   └── training_pipeline.py
│   │   │   ├── explainers/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── shap_explainer.py
│   │   │   │   └── lime_explainer.py
│   │   │   ├── registry/
│   │   │   │   ├── __init__.py
│   │   │   │   └── model_registry.py
│   │   │   └── trained_models/      # Serialized models (.joblib, .pt)
│   │   │       ├── health_xgboost_v1.joblib
│   │   │       ├── rul_lightgbm_v1.joblib
│   │   │       ├── anomaly_iforest_v1.joblib
│   │   │       └── damage_yolov8_v1.pt
│   │   │
│   │   └── schemas/                 # Pydantic schemas (DTOs)
│   │       ├── __init__.py
│   │       ├── auth_schemas.py
│   │       ├── user_schemas.py
│   │       ├── device_schemas.py
│   │       ├── scan_schemas.py
│   │       ├── health_schemas.py
│   │       ├── recommendation_schemas.py
│   │       ├── cv_schemas.py
│   │       ├── passport_schemas.py
│   │       ├── carbon_schemas.py
│   │       └── report_schemas.py
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── unit/
│   │   │   ├── test_health_scoring.py
│   │   │   ├── test_recommendation.py
│   │   │   ├── test_carbon_service.py
│   │   │   └── test_cost_estimation.py
│   │   ├── integration/
│   │   │   ├── test_scan_flow.py
│   │   │   ├── test_api_endpoints.py
│   │   │   └── test_database.py
│   │   └── ml/
│   │       ├── test_health_model.py
│   │       ├── test_rul_model.py
│   │       └── test_cv_model.py
│   │
│   ├── scripts/
│   │   ├── seed_db.py               # Database seeding
│   │   ├── train_models.py          # ML training script
│   │   └── generate_synthetic.py    # Synthetic data generation
│   │
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── alembic.ini
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   │       ├── icons/
│   │       └── images/
│   │
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js
│   │   ├── App.css
│   │   │
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── ScoreGauge.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   └── Modal.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── HealthOverview.jsx
│   │   │   │   ├── ComponentCard.jsx
│   │   │   │   ├── ScoreChart.jsx
│   │   │   │   ├── RecommendationPanel.jsx
│   │   │   │   └── CarbonImpactWidget.jsx
│   │   │   ├── scanner/
│   │   │   │   ├── ScanWizard.jsx
│   │   │   │   ├── ScanProgress.jsx
│   │   │   │   ├── ComponentScanItem.jsx
│   │   │   │   └── ImageUploader.jsx
│   │   │   ├── passport/
│   │   │   │   ├── PassportView.jsx
│   │   │   │   ├── PassportQR.jsx
│   │   │   │   └── PassportHistory.jsx
│   │   │   ├── reports/
│   │   │   │   ├── FullReport.jsx
│   │   │   │   ├── ComponentReport.jsx
│   │   │   │   └── PDFExport.jsx
│   │   │   ├── marketplace/
│   │   │   │   ├── ListingCard.jsx
│   │   │   │   ├── MarketplaceGrid.jsx
│   │   │   │   └── RepairShopFinder.jsx
│   │   │   └── admin/
│   │   │       ├── UserManagement.jsx
│   │   │       ├── DeviceFleet.jsx
│   │   │       └── SystemAnalytics.jsx
│   │   │
│   │   ├── pages/                   # Page-Level Components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ScanPage.jsx
│   │   │   ├── DeviceDetailPage.jsx
│   │   │   ├── ReportPage.jsx
│   │   │   ├── PassportPage.jsx
│   │   │   ├── CarbonDashboardPage.jsx
│   │   │   ├── MarketplacePage.jsx
│   │   │   ├── RepairShopPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── hooks/                   # Custom React Hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useScan.js
│   │   │   ├── useDevice.js
│   │   │   └── useWebSocket.js
│   │   │
│   │   ├── services/                # API Service Layer
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── scanService.js
│   │   │   ├── deviceService.js
│   │   │   ├── reportService.js
│   │   │   └── analyticsService.js
│   │   │
│   │   ├── store/                   # State Management (Zustand/Redux)
│   │   │   ├── authStore.js
│   │   │   ├── scanStore.js
│   │   │   ├── deviceStore.js
│   │   │   └── uiStore.js
│   │   │
│   │   ├── utils/                   # Utility Functions
│   │   │   ├── constants.js
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   │
│   │   └── styles/                  # Global Styles
│   │       ├── tailwind.css
│   │       ├── globals.css
│   │       └── themes/
│   │           ├── dark.css
│   │           └── light.css
│   │
│   ├── tailwind.config.js
│   ├── package.json
│   └── vite.config.js
│
├── electron/
│   ├── main.js                      # Electron main process
│   ├── preload.js                   # Context bridge
│   ├── ipc/
│   │   ├── scannerIPC.js            # Scanner IPC handlers
│   │   └── updateIPC.js             # Auto-update handlers
│   └── package.json
│
├── scanner/                         # Local Python Scanner Agent
│   ├── __init__.py
│   ├── main.py                      # Scanner entry point
│   ├── orchestrator.py              # Scan orchestration
│   ├── scanners/
│   │   ├── __init__.py
│   │   ├── base_scanner.py          # Abstract base class
│   │   ├── battery_scanner.py
│   │   ├── storage_scanner.py
│   │   ├── ram_scanner.py
│   │   ├── cpu_scanner.py
│   │   ├── gpu_scanner.py
│   │   ├── network_scanner.py
│   │   ├── display_scanner.py
│   │   ├── audio_scanner.py
│   │   ├── input_scanner.py
│   │   ├── peripheral_scanner.py
│   │   ├── motherboard_scanner.py
│   │   └── cooling_scanner.py
│   ├── tests/
│   │   ├── test_battery_scanner.py
│   │   ├── test_storage_scanner.py
│   │   └── test_orchestrator.py
│   └── requirements.txt
│
├── ml/                              # ML Training & Experiments
│   ├── notebooks/
│   │   ├── 01_eda.ipynb
│   │   ├── 02_feature_engineering.ipynb
│   │   ├── 03_model_training.ipynb
│   │   ├── 04_cv_training.ipynb
│   │   └── 05_evaluation.ipynb
│   ├── data/
│   │   ├── raw/
│   │   ├── processed/
│   │   └── synthetic/
│   ├── configs/
│   │   ├── health_model_config.yaml
│   │   ├── rul_model_config.yaml
│   │   └── cv_model_config.yaml
│   └── scripts/
│       ├── train_health.py
│       ├── train_rul.py
│       ├── train_cv.py
│       └── evaluate.py
│
├── docs/
│   ├── architecture.md
│   ├── api_docs.md
│   ├── deployment.md
│   └── user_guide.md
│
├── .env.example
├── .gitignore
├── README.md
├── LICENSE
└── Makefile                         # Common commands
```

---

## 12. DATABASE DESIGN

### Objective
Design a normalized (3NF+) PostgreSQL schema supporting all platform features.

### Core Tables

| Table | Description | Key Fields |
|---|---|---|
| `users` | Platform users | id, email, role, org_id |
| `organizations` | Enterprise organizations | id, name, type |
| `devices` | Registered laptops | id, user_id, serial, model, manufacturer |
| `scans` | Individual scan sessions | id, device_id, scan_type, status, timestamp |
| `component_results` | Per-component scan results | id, scan_id, component_type, raw_data, health_score |
| `health_scores` | Overall device health scores | id, scan_id, overall_score, grade |
| `recommendations` | AI recommendations | id, scan_id, type (4R), confidence, reasoning |
| `damage_assessments` | CV damage detection results | id, scan_id, image_url, damage_type, severity |
| `device_passports` | Digital Device Passports | id, device_id, passport_data, qr_code |
| `carbon_impacts` | Carbon savings calculations | id, scan_id, co2_saved, trees_equivalent |
| `repair_estimates` | Repair cost estimates | id, recommendation_id, component, cost_min, cost_max |
| `marketplace_listings` | Parts marketplace | id, device_id, component, condition, price |
| `audit_logs` | System audit trail | id, user_id, action, timestamp, details |

### Database Schema (SQL)

```sql
-- Users & Authentication
CREATE TABLE organizations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    type            VARCHAR(50) NOT NULL CHECK (type IN (
                        'individual','repair_shop','refurbisher',
                        'enterprise','educational','recycler')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'user'
                    CHECK (role IN ('user','technician','admin','super_admin')),
    organization_id UUID REFERENCES organizations(id),
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org ON users(organization_id);

-- Devices
CREATE TABLE devices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    serial_number   VARCHAR(100),
    manufacturer    VARCHAR(100) NOT NULL,
    model           VARCHAR(200) NOT NULL,
    device_type     VARCHAR(50) DEFAULT 'laptop',
    os_version      VARCHAR(100),
    purchase_date   DATE,
    warranty_expiry DATE,
    current_status  VARCHAR(30) DEFAULT 'active'
                    CHECK (current_status IN (
                        'active','repair','listed','recycled','decommissioned')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_devices_user ON devices(user_id);
CREATE INDEX idx_devices_serial ON devices(serial_number);

-- Scans
CREATE TABLE scans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id       UUID NOT NULL REFERENCES devices(id),
    initiated_by    UUID NOT NULL REFERENCES users(id),
    scan_type       VARCHAR(30) NOT NULL DEFAULT 'full'
                    CHECK (scan_type IN ('full','quick','component','cv_only')),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN (
                        'pending','in_progress','completed','failed','cancelled')),
    started_at      TIMESTAMP WITH TIME ZONE,
    completed_at    TIMESTAMP WITH TIME ZONE,
    scan_duration_ms INTEGER,
    scanner_version VARCHAR(20),
    raw_payload     JSONB,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scans_device ON scans(device_id);
CREATE INDEX idx_scans_status ON scans(status);
CREATE INDEX idx_scans_created ON scans(created_at DESC);

-- Component Scan Results
CREATE TABLE component_results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id         UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    component_type  VARCHAR(30) NOT NULL
                    CHECK (component_type IN (
                        'battery','ssd','hdd','ram','cpu','gpu',
                        'keyboard','display','touchpad','camera',
                        'microphone','speaker','wifi','bluetooth',
                        'usb_ports','cooling_fan','motherboard')),
    status          VARCHAR(20) NOT NULL DEFAULT 'unknown'
                    CHECK (status IN (
                        'excellent','good','fair','poor','critical','failed','unknown')),
    health_score    DECIMAL(5,2) CHECK (health_score >= 0 AND health_score <= 100),
    raw_metrics     JSONB NOT NULL,
    anomalies       JSONB,
    remaining_life_days INTEGER,
    confidence      DECIMAL(4,3) CHECK (confidence >= 0 AND confidence <= 1),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comp_results_scan ON component_results(scan_id);
CREATE INDEX idx_comp_results_type ON component_results(component_type);

-- Health Scores
CREATE TABLE health_scores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id         UUID UNIQUE NOT NULL REFERENCES scans(id),
    overall_score   DECIMAL(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    grade           VARCHAR(2) NOT NULL CHECK (grade IN ('A+','A','B+','B','C+','C','D','F')),
    category_scores JSONB NOT NULL,  -- {battery: 85, storage: 92, ...}
    weighted_breakdown JSONB NOT NULL,
    trend           VARCHAR(15) CHECK (trend IN ('improving','stable','declining','critical')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations
CREATE TABLE recommendations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id         UUID NOT NULL REFERENCES scans(id),
    recommendation_type VARCHAR(20) NOT NULL
                    CHECK (recommendation_type IN ('repair','reuse','refurbish','recycle')),
    priority        INTEGER NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 4),
    confidence      DECIMAL(4,3) NOT NULL,
    reasoning       TEXT NOT NULL,
    ai_explanation  TEXT,
    estimated_repair_cost_min DECIMAL(10,2),
    estimated_repair_cost_max DECIMAL(10,2),
    estimated_resale_value    DECIMAL(10,2),
    components_affected JSONB,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_recommendations_scan ON recommendations(scan_id);

-- Damage Assessments (Computer Vision)
CREATE TABLE damage_assessments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id         UUID NOT NULL REFERENCES scans(id),
    image_url       VARCHAR(500) NOT NULL,
    damage_type     VARCHAR(50) NOT NULL
                    CHECK (damage_type IN (
                        'crack','dent','scratch','broken_hinge',
                        'screen_damage','missing_key','liquid_damage',
                        'discoloration','no_damage')),
    severity        VARCHAR(20) NOT NULL
                    CHECK (severity IN ('none','minor','moderate','severe','critical')),
    confidence      DECIMAL(4,3) NOT NULL,
    bounding_box    JSONB,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digital Device Passports
CREATE TABLE device_passports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id       UUID UNIQUE NOT NULL REFERENCES devices(id),
    passport_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code_url     VARCHAR(500),
    passport_data   JSONB NOT NULL,
    scan_history    JSONB,
    is_verified     BOOLEAN DEFAULT FALSE,
    issued_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at      TIMESTAMP WITH TIME ZONE
);

-- Carbon Impact
CREATE TABLE carbon_impacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id         UUID NOT NULL REFERENCES scans(id),
    recommendation_id UUID REFERENCES recommendations(id),
    co2_saved_kg    DECIMAL(10,3) NOT NULL,
    co2_manufacturing_kg DECIMAL(10,3),
    co2_if_recycled_kg   DECIMAL(10,3),
    energy_saved_kwh     DECIMAL(10,3),
    water_saved_liters   DECIMAL(10,3),
    trees_equivalent     DECIMAL(6,2),
    life_extended_days   INTEGER,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace Listings (Design Only)
CREATE TABLE marketplace_listings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id       UUID NOT NULL REFERENCES devices(id),
    seller_id       UUID NOT NULL REFERENCES users(id),
    listing_type    VARCHAR(20) NOT NULL
                    CHECK (listing_type IN ('whole_device','component','parts_bundle')),
    component_type  VARCHAR(30),
    condition       VARCHAR(20) NOT NULL,
    price           DECIMAL(10,2) NOT NULL,
    description     TEXT,
    health_score    DECIMAL(5,2),
    passport_id     UUID REFERENCES device_passports(id),
    status          VARCHAR(20) DEFAULT 'active'
                    CHECK (status IN ('active','sold','expired','cancelled')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID,
    details         JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

---

## 13. ER DIAGRAM (ASCII)

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    ReLife AI — ENTITY RELATIONSHIP DIAGRAM                    ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ┌──────────────────┐                        ┌──────────────────┐            ║
║  │  organizations   │                        │   audit_logs     │            ║
║  │──────────────────│                        │──────────────────│            ║
║  │ PK id            │                        │ PK id            │            ║
║  │    name           │                        │ FK user_id       │            ║
║  │    type           │                        │    action        │            ║
║  └────────┬─────────┘                        │    entity_type   │            ║
║           │ 1:N                               │    details       │            ║
║           ▼                                   └──────────────────┘            ║
║  ┌──────────────────┐        ┌──────────────────────┐                        ║
║  │     users         │        │  marketplace_listings │                        ║
║  │──────────────────│        │──────────────────────│                        ║
║  │ PK id            │        │ PK id                │                        ║
║  │    email          │        │ FK device_id         │                        ║
║  │    password_hash  │        │ FK seller_id         │                        ║
║  │    role           │        │ FK passport_id       │                        ║
║  │ FK organization_id│        │    listing_type      │                        ║
║  └────────┬─────────┘        │    price              │                        ║
║           │ 1:N               └──────────────────────┘                        ║
║           ▼                              ▲                                    ║
║  ┌──────────────────┐                    │                                    ║
║  │    devices        │────────────────────┘                                   ║
║  │──────────────────│                                                        ║
║  │ PK id            │                                                        ║
║  │ FK user_id       │──────────────────────────────┐                         ║
║  │    serial_number  │                              │ 1:1                     ║
║  │    manufacturer   │                              ▼                         ║
║  │    model          │                    ┌──────────────────┐               ║
║  │    current_status │                    │ device_passports  │               ║
║  └────────┬─────────┘                    │──────────────────│               ║
║           │ 1:N                           │ PK id            │               ║
║           ▼                               │ FK device_id     │               ║
║  ┌──────────────────┐                    │    passport_number│               ║
║  │     scans         │                    │    passport_data  │               ║
║  │──────────────────│                    └──────────────────┘               ║
║  │ PK id            │                                                        ║
║  │ FK device_id     │                                                        ║
║  │ FK initiated_by  │                                                        ║
║  │    scan_type      │                                                        ║
║  │    status         │                                                        ║
║  │    raw_payload    │                                                        ║
║  └────────┬─────────┘                                                        ║
║           │                                                                   ║
║     ┌─────┼──────────┬──────────────┬────────────────┐                      ║
║     │     │          │              │                │                      ║
║     │ 1:N │      1:N │          1:1 │            1:N │                      ║
║     ▼     │          ▼              ▼                ▼                      ║
║  ┌────────┴────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐           ║
║  │ component   │ │ damage   │ │ health   │ │ recommendations  │           ║
║  │ _results    │ │ _assess  │ │ _scores  │ │                  │           ║
║  │─────────────│ │──────────│ │──────────│ │──────────────────│           ║
║  │ PK id       │ │ PK id    │ │ PK id    │ │ PK id            │           ║
║  │ FK scan_id  │ │FK scan_id│ │FK scan_id│ │ FK scan_id       │           ║
║  │ comp_type   │ │ image_url│ │ overall  │ │ rec_type         │           ║
║  │ status      │ │ dmg_type │ │ grade    │ │ confidence       │           ║
║  │ health_score│ │ severity │ │ category │ │ reasoning        │           ║
║  │ raw_metrics │ │ confid.  │ │ _scores  │ │ repair_cost      │           ║
║  │ remaining   │ │ bbox     │ │ trend    │ │ resale_value     │           ║
║  │ _life_days  │ └──────────┘ └──────────┘ └────────┬─────────┘           ║
║  └─────────────┘                                     │ 1:1                  ║
║                                                      ▼                      ║
║                                            ┌──────────────────┐            ║
║                                            │  carbon_impacts   │            ║
║                                            │──────────────────│            ║
║                                            │ PK id            │            ║
║                                            │ FK scan_id       │            ║
║                                            │ FK recommendation│            ║
║                                            │    _id           │            ║
║                                            │ co2_saved_kg     │            ║
║                                            │ trees_equivalent │            ║
║                                            └──────────────────┘            ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## 14. API ARCHITECTURE

### Objective
Define the RESTful API design following best practices for versioning, authentication, and documentation.

### API Design Principles

| Principle | Implementation |
|---|---|
| Versioning | URL-based: `/api/v1/` |
| Authentication | Bearer JWT tokens (RS256) |
| Content Type | `application/json` |
| Pagination | Cursor-based for large datasets |
| Rate Limiting | 100 req/min (user), 1000 req/min (enterprise) |
| Error Format | RFC 7807 Problem Details |
| Documentation | OpenAPI 3.0 (auto-generated by FastAPI) |
| CORS | Configurable per environment |

### API Architecture Diagram

```
╔═══════════════════════════════════════════════════════════════╗
║                    API ARCHITECTURE                            ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  Client Request                                                ║
║       │                                                        ║
║       ▼                                                        ║
║  ┌─────────────┐                                              ║
║  │   CORS      │  Middleware Chain                             ║
║  │   Filter    │                                               ║
║  └──────┬──────┘                                              ║
║         ▼                                                      ║
║  ┌─────────────┐                                              ║
║  │   Rate      │                                               ║
║  │   Limiter   │                                               ║
║  └──────┬──────┘                                              ║
║         ▼                                                      ║
║  ┌─────────────┐                                              ║
║  │   Request   │                                               ║
║  │   Logger    │                                               ║
║  └──────┬──────┘                                              ║
║         ▼                                                      ║
║  ┌─────────────┐     ┌──────────────────┐                     ║
║  │   JWT Auth  │────►│ Token Validation │                     ║
║  │   Guard     │     │ Role Check       │                     ║
║  └──────┬──────┘     └──────────────────┘                     ║
║         ▼                                                      ║
║  ┌─────────────┐     ┌──────────────────┐                     ║
║  │   Request   │────►│ Pydantic Schema  │                     ║
║  │   Validator │     │ Validation       │                     ║
║  └──────┬──────┘     └──────────────────┘                     ║
║         ▼                                                      ║
║  ┌─────────────────────────────────────────────────────────┐  ║
║  │                    API ROUTERS                           │  ║
║  │                                                          │  ║
║  │  /api/v1/auth/*      /api/v1/scan/*    /api/v1/health/* │  ║
║  │  /api/v1/devices/*   /api/v1/cv/*      /api/v1/reports/*│  ║
║  │  /api/v1/passport/*  /api/v1/carbon/*  /api/v1/admin/*  │  ║
║  └──────────┬──────────────────────────────────────────────┘  ║
║              ▼                                                 ║
║  ┌──────────────────────┐                                     ║
║  │   Service Layer      │                                     ║
║  │   (Business Logic)   │                                     ║
║  └──────────┬───────────┘                                     ║
║              ▼                                                 ║
║  ┌──────────────────────┐                                     ║
║  │   Repository Layer   │                                     ║
║  │   (Data Access)      │                                     ║
║  └──────────┬───────────┘                                     ║
║              ▼                                                 ║
║  ┌──────────────────────┐                                     ║
║  │   PostgreSQL / Redis │                                     ║
║  └──────────────────────┘                                     ║
║                                                                ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 15. REST API LIST

### Authentication APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | User login, returns JWT | No |
| POST | `/api/v1/auth/refresh` | Refresh JWT token | Yes |
| POST | `/api/v1/auth/logout` | Invalidate token | Yes |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No |
| POST | `/api/v1/auth/reset-password` | Reset password with token | No |

### User APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users/me` | Get current user profile | Yes |
| PUT | `/api/v1/users/me` | Update user profile | Yes |
| GET | `/api/v1/users/{id}` | Get user by ID | Admin |
| GET | `/api/v1/users` | List all users (paginated) | Admin |
| DELETE | `/api/v1/users/{id}` | Deactivate user | Admin |

### Device APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/devices` | Register a new device | Yes |
| GET | `/api/v1/devices` | List user's devices | Yes |
| GET | `/api/v1/devices/{id}` | Get device details | Yes |
| PUT | `/api/v1/devices/{id}` | Update device info | Yes |
| DELETE | `/api/v1/devices/{id}` | Remove device | Yes |
| GET | `/api/v1/devices/{id}/history` | Get device scan history | Yes |

### Scan APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/scans` | Submit scan data | Yes |
| GET | `/api/v1/scans/{id}` | Get scan results | Yes |
| GET | `/api/v1/scans/{id}/status` | Get scan processing status | Yes |
| GET | `/api/v1/scans/device/{device_id}` | List scans for device | Yes |
| DELETE | `/api/v1/scans/{id}` | Cancel/delete scan | Yes |

### Health Score APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/health/{scan_id}` | Get health score for scan | Yes |
| GET | `/api/v1/health/{scan_id}/components` | Component-level scores | Yes |
| GET | `/api/v1/health/{scan_id}/trend` | Health score trend | Yes |
| GET | `/api/v1/health/{scan_id}/explanation` | AI explanation | Yes |

### Recommendation APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/recommendations/{scan_id}` | Get 4R recommendations | Yes |
| GET | `/api/v1/recommendations/{scan_id}/cost` | Get repair cost estimate | Yes |
| GET | `/api/v1/recommendations/{scan_id}/resale` | Get resale value estimate | Yes |

### Computer Vision APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/cv/analyze` | Upload images for damage detection | Yes |
| GET | `/api/v1/cv/{assessment_id}` | Get CV analysis results | Yes |

### Digital Passport APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/passport/{device_id}/generate` | Generate passport | Yes |
| GET | `/api/v1/passport/{device_id}` | Get device passport | Yes |
| GET | `/api/v1/passport/verify/{passport_number}` | Verify passport (public) | No |
| PUT | `/api/v1/passport/{device_id}` | Update passport | Yes |

### Carbon Impact APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/carbon/{scan_id}` | Get carbon impact for scan | Yes |
| GET | `/api/v1/carbon/dashboard` | Aggregated carbon dashboard | Yes |
| GET | `/api/v1/carbon/leaderboard` | Community carbon leaderboard | Yes |

### Report APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/reports/{scan_id}` | Get full report | Yes |
| GET | `/api/v1/reports/{scan_id}/pdf` | Download PDF report | Yes |
| GET | `/api/v1/reports/{scan_id}/share` | Get shareable report link | Yes |

### Analytics & Admin APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/analytics/overview` | Platform analytics overview | Admin |
| GET | `/api/v1/analytics/devices` | Device fleet analytics | Admin |
| GET | `/api/v1/analytics/environmental` | Environmental impact stats | Admin |
| GET | `/api/v1/admin/users` | Manage users | Admin |
| GET | `/api/v1/admin/system` | System health | Admin |
| GET | `/api/v1/admin/audit-logs` | View audit logs | Admin |

### Marketplace APIs (Design Only)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/marketplace/listings` | Create listing | Yes |
| GET | `/api/v1/marketplace/listings` | Browse listings | Yes |
| GET | `/api/v1/marketplace/repair-shops` | Find repair shops | Yes |
