# ReLife AI — Complete Project Design Document
# Part 2: System Architecture & Diagrams

---

## 7. SYSTEM ARCHITECTURE

### Objective
Define the end-to-end system architecture following Clean Architecture, SOLID principles, and microservice-ready design.

### Explanation

ReLife AI uses a **Layered Clean Architecture** with clear separation of concerns. The system is designed as a modular monolith that can be decomposed into microservices as the platform scales.

### Architecture Layers

```
╔══════════════════════════════════════════════════════════════════════╗
║                    CLEAN ARCHITECTURE LAYERS                         ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ┌──────────────────────────────────────────────────────────────┐   ║
║  │                    PRESENTATION LAYER                         │   ║
║  │  ┌────────────┐  ┌─────────────┐  ┌───────────────────┐     │   ║
║  │  │ React UI   │  │ Electron    │  │ REST API Routes   │     │   ║
║  │  │ Components │  │ Shell       │  │ (FastAPI Routers) │     │   ║
║  │  └────────────┘  └─────────────┘  └───────────────────┘     │   ║
║  └──────────────────────────────────────────────────────────────┘   ║
║                              │                                       ║
║  ┌──────────────────────────────────────────────────────────────┐   ║
║  │                   APPLICATION LAYER                           │   ║
║  │  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐     │   ║
║  │  │ Use Cases  │  │ DTOs /       │  │ Service          │     │   ║
║  │  │ (Commands) │  │ Schemas      │  │ Interfaces       │     │   ║
║  │  └────────────┘  └──────────────┘  └──────────────────┘     │   ║
║  └──────────────────────────────────────────────────────────────┘   ║
║                              │                                       ║
║  ┌──────────────────────────────────────────────────────────────┐   ║
║  │                     DOMAIN LAYER                              │   ║
║  │  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐     │   ║
║  │  │ Entities   │  │ Value        │  │ Domain           │     │   ║
║  │  │ (Models)   │  │ Objects      │  │ Services         │     │   ║
║  │  └────────────┘  └──────────────┘  └──────────────────┘     │   ║
║  └──────────────────────────────────────────────────────────────┘   ║
║                              │                                       ║
║  ┌──────────────────────────────────────────────────────────────┐   ║
║  │                 INFRASTRUCTURE LAYER                           │   ║
║  │  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐     │   ║
║  │  │ Repository │  │ External     │  │ ML Model         │     │   ║
║  │  │ Impls      │  │ APIs         │  │ Inference        │     │   ║
║  │  └────────────┘  └──────────────┘  └──────────────────┘     │   ║
║  └──────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

### Design Patterns Applied

| Pattern | Application |
|---|---|
| Repository Pattern | Data access abstraction for all entities |
| Service Layer | Business logic encapsulation |
| Dependency Injection | FastAPI's `Depends()` for all services |
| Strategy Pattern | Interchangeable ML model backends |
| Observer Pattern | Event-driven scan progress updates |
| Factory Pattern | Scanner component creation |
| Command Pattern | Scan task orchestration |
| Adapter Pattern | OS-specific diagnostic adapters |

### SOLID Principles Mapping

| Principle | Implementation |
|---|---|
| **S**ingle Responsibility | Each scanner collects one component's data |
| **O**pen/Closed | New component scanners via plugin architecture |
| **L**iskov Substitution | All scanners implement `BaseComponentScanner` |
| **I**nterface Segregation | Separate interfaces for scanning, scoring, recommending |
| **D**ependency Inversion | Services depend on abstractions, not implementations |

---

## 8. HIGH-LEVEL ARCHITECTURE DIAGRAM

### Objective
Provide a comprehensive system overview showing all major components and their interactions.

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        ReLife AI — HIGH-LEVEL ARCHITECTURE                    ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   ┌─────────────────────────────────────────────────────────────────────┐    ║
║   │                         CLIENT LAYER                                 │    ║
║   │                                                                      │    ║
║   │   ┌──────────────────┐       ┌──────────────────────────────┐       │    ║
║   │   │   Electron App   │       │       React Frontend          │       │    ║
║   │   │  ┌─────────────┐ │       │  ┌──────────┐ ┌───────────┐  │       │    ║
║   │   │  │ Local Python │ │       │  │Dashboard │ │ Scanner   │  │       │    ║
║   │   │  │ Scanner      │ │       │  │  Views   │ │ Wizard    │  │       │    ║
║   │   │  │ Agent        │ │       │  └──────────┘ └───────────┘  │       │    ║
║   │   │  └──────┬───────┘ │       │  ┌──────────┐ ┌───────────┐  │       │    ║
║   │   │         │         │       │  │ Reports  │ │ CV Upload │  │       │    ║
║   │   │         │IPC      │       │  │ & Export │ │ Module    │  │       │    ║
║   │   │  ┌──────▼───────┐ │       │  └──────────┘ └───────────┘  │       │    ║
║   │   │  │ Electron     │ │       │  ┌──────────┐ ┌───────────┐  │       │    ║
║   │   │  │ Main Process │◄├───────┤► │ Admin    │ │ Passport  │  │       │    ║
║   │   │  └──────────────┘ │       │  │ Panel    │ │ Generator │  │       │    ║
║   │   └──────────────────┘       │  └──────────┘ └───────────┘  │       │    ║
║   │                               └──────────┬───────────────────┘       │    ║
║   └──────────────────────────────────────────┼──────────────────────────┘    ║
║                                               │ HTTPS / REST API             ║
║   ┌──────────────────────────────────────────▼──────────────────────────┐    ║
║   │                         API GATEWAY / BACKEND                        │    ║
║   │                                                                      │    ║
║   │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │    ║
║   │   │ Auth     │  │ Scanner  │  │ Health   │  │ Recommendation   │   │    ║
║   │   │ Service  │  │ Service  │  │ Scoring  │  │ Engine           │   │    ║
║   │   │ (JWT)    │  │          │  │ Service  │  │                  │   │    ║
║   │   └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │    ║
║   │                                                                      │    ║
║   │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │    ║
║   │   │ CV       │  │ LLM      │  │ Carbon   │  │ Device Passport  │   │    ║
║   │   │ Service  │  │ Service  │  │ Service  │  │ Service          │   │    ║
║   │   └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │    ║
║   │                                                                      │    ║
║   │              ┌─────────────────────────────────┐                    │    ║
║   │              │    FastAPI Application Server     │                    │    ║
║   │              │    (Uvicorn / Gunicorn)           │                    │    ║
║   │              └─────────────────────────────────┘                    │    ║
║   └──────────────────────┬──────────────────┬───────────────────────────┘    ║
║                          │                  │                                 ║
║   ┌──────────────────────▼───┐  ┌──────────▼────────────────────────────┐   ║
║   │     DATA LAYER           │  │          AI/ML LAYER                   │   ║
║   │                          │  │                                        │   ║
║   │  ┌──────────────────┐   │  │  ┌────────────┐  ┌─────────────────┐  │   ║
║   │  │   PostgreSQL     │   │  │  │ XGBoost    │  │  YOLOv8         │  │   ║
║   │  │   Database       │   │  │  │ LightGBM   │  │  Damage         │  │   ║
║   │  │                  │   │  │  │ Health     │  │  Detection      │  │   ║
║   │  │  • Users         │   │  │  │ Models     │  │  Model          │  │   ║
║   │  │  • Devices       │   │  │  └────────────┘  └─────────────────┘  │   ║
║   │  │  • Scans         │   │  │                                        │   ║
║   │  │  • Components    │   │  │  ┌────────────┐  ┌─────────────────┐  │   ║
║   │  │  • Reports       │   │  │  │ Isolation  │  │  OpenAI /       │  │   ║
║   │  │  • Passports     │   │  │  │ Forest     │  │  Local LLM     │  │   ║
║   │  │                  │   │  │  │ Anomaly    │  │  Explanation    │  │   ║
║   │  └──────────────────┘   │  │  │ Detection  │  │  Engine        │  │   ║
║   │                          │  │  └────────────┘  └─────────────────┘  │   ║
║   │  ┌──────────────────┐   │  │                                        │   ║
║   │  │   Redis Cache    │   │  │  ┌────────────────────────────────┐   │   ║
║   │  │   (Optional)     │   │  │  │    SHAP / LIME Explainers     │   │   ║
║   │  └──────────────────┘   │  │  └────────────────────────────────┘   │   ║
║   └──────────────────────────┘  └────────────────────────────────────────┘   ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## 9. LOW-LEVEL ARCHITECTURE DIAGRAM

### Objective
Detail the internal module interactions, data flow, and dependency graph.

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                   ReLife AI — LOW-LEVEL ARCHITECTURE                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ELECTRON MAIN PROCESS                                                    ║
║  ┌─────────────────────────────────────────────────────────────────────┐ ║
║  │                                                                     │ ║
║  │  ┌──────────────┐    ┌──────────────┐    ┌───────────────────┐    │ ║
║  │  │ IPC Handler  │◄──►│ Python       │◄──►│ Component         │    │ ║
║  │  │ (Bridge)     │    │ Scanner      │    │ Scanners          │    │ ║
║  │  └──────┬───────┘    │ Orchestrator │    │                   │    │ ║
║  │         │            └──────────────┘    │ ├─BatteryScanner  │    │ ║
║  │         │                                │ ├─StorageScanner  │    │ ║
║  │         │IPC Messages                    │ ├─RAMScanner      │    │ ║
║  │         │                                │ ├─CPUScanner      │    │ ║
║  │         ▼                                │ ├─GPUScanner      │    │ ║
║  │  ┌──────────────┐                       │ ├─NetworkScanner  │    │ ║
║  │  │ React        │                       │ ├─DisplayScanner  │    │ ║
║  │  │ Renderer     │                       │ ├─AudioScanner    │    │ ║
║  │  │ Process      │                       │ ├─InputScanner    │    │ ║
║  │  └──────────────┘                       │ └─PeripheralScan  │    │ ║
║  │                                          └───────────────────┘    │ ║
║  └─────────────────────────────────────────────────────────────────────┘ ║
║                  │                                                        ║
║                  │ HTTPS (REST API Calls)                                 ║
║                  ▼                                                        ║
║  FASTAPI BACKEND                                                          ║
║  ┌─────────────────────────────────────────────────────────────────────┐ ║
║  │                                                                     │ ║
║  │  API ROUTERS (Presentation Layer)                                   │ ║
║  │  ┌──────────┬──────────┬──────────┬──────────┬──────────────────┐ │ ║
║  │  │/auth     │/scan     │/health   │/devices  │/recommendations  │ │ ║
║  │  │/users    │/cv       │/passport │/reports  │/analytics        │ │ ║
║  │  └────┬─────┴────┬─────┴────┬─────┴────┬─────┴──────┬───────────┘ │ ║
║  │       │          │          │          │             │             │ ║
║  │  SERVICE LAYER (Application Layer)                                  │ ║
║  │  ┌──────────────────────────────────────────────────────────────┐  │ ║
║  │  │                                                              │  │ ║
║  │  │  AuthService ──► ScanService ──► HealthScoringService       │  │ ║
║  │  │       │               │                │                     │  │ ║
║  │  │       │               │                ▼                     │  │ ║
║  │  │  UserService    CVService      RecommendationService        │  │ ║
║  │  │       │               │                │                     │  │ ║
║  │  │       │               │                ▼                     │  │ ║
║  │  │  DeviceService  LLMService     CarbonService                │  │ ║
║  │  │       │               │                │                     │  │ ║
║  │  │       │               │                ▼                     │  │ ║
║  │  │  PassportService     │         CostEstimationService        │  │ ║
║  │  │       │               │                                      │  │ ║
║  │  └───────┼───────────────┼──────────────────────────────────────┘  │ ║
║  │          │               │                                         │ ║
║  │  REPOSITORY LAYER (Infrastructure Layer)                           │ ║
║  │  ┌──────────────────────────────────────────────────────────────┐  │ ║
║  │  │  UserRepository      │  ScanRepository                      │  │ ║
║  │  │  DeviceRepository    │  ComponentRepository                 │  │ ║
║  │  │  ReportRepository    │  PassportRepository                  │  │ ║
║  │  │  AnalyticsRepository │  RecommendationRepository            │  │ ║
║  │  └──────────────────────┴──────────────────────────────────────┘  │ ║
║  │          │                                                         │ ║
║  │          ▼                                                         │ ║
║  │  ┌──────────────────┐  ┌─────────────────────────────────────┐   │ ║
║  │  │   SQLAlchemy ORM │  │   ML Inference Engine                │   │ ║
║  │  │   ┌────────────┐ │  │   ┌────────────┐ ┌──────────────┐  │   │ ║
║  │  │   │ PostgreSQL │ │  │   │ Model      │ │ Feature      │  │   │ ║
║  │  │   │ Database   │ │  │   │ Registry   │ │ Pipeline     │  │   │ ║
║  │  │   └────────────┘ │  │   └────────────┘ └──────────────┘  │   │ ║
║  │  └──────────────────┘  └─────────────────────────────────────┘   │ ║
║  └─────────────────────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 10. COMPLETE DATA FLOW DIAGRAM

### Objective
Trace data from collection through processing to final output.

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                      ReLife AI — COMPLETE DATA FLOW                           ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  PHASE 1: DATA COLLECTION (Electron + Local Python)                          ║
║  ═══════════════════════════════════════════════                              ║
║                                                                               ║
║  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐      ║
║  │ WMI /   │   │ SMART   │   │ Battery │   │ Perf    │   │ User    │      ║
║  │ System  │   │ via     │   │ Win32   │   │ Counters│   │ Camera  │      ║
║  │ Info    │   │ pySMART │   │ API     │   │ psutil  │   │ Upload  │      ║
║  └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘      ║
║       │              │             │              │              │            ║
║       ▼              ▼             ▼              ▼              ▼            ║
║  ┌──────────────────────────────────────────────────────────────────────┐    ║
║  │                    RAW DATA AGGREGATOR                               │    ║
║  │                    (Python Scanner Agent)                             │    ║
║  └───────────────────────────────┬──────────────────────────────────────┘    ║
║                                  │                                           ║
║  PHASE 2: DATA TRANSMISSION                                                  ║
║  ═══════════════════════════                                                  ║
║                                  │                                           ║
║                                  ▼                                           ║
║  ┌──────────────────────────────────────────────────────────────────────┐    ║
║  │                    JSON PAYLOAD                                      │    ║
║  │  {                                                                   │    ║
║  │    "device_info": { model, manufacturer, serial, os_version },       │    ║
║  │    "battery": { cycle_count, health_pct, design_cap, full_cap },     │    ║
║  │    "storage": [{ smart_attrs, read_errors, temp, hours_on }],        │    ║
║  │    "ram": { total, speed, errors_detected },                         │    ║
║  │    "cpu": { model, temp, throttle_count, benchmark_score },          │    ║
║  │    "gpu": { model, vram, temp, driver_version },                     │    ║
║  │    "network": { wifi_signal, bluetooth_status },                     │    ║
║  │    "peripherals": { keyboard, touchpad, camera, mic, speakers },     │    ║
║  │    "display": { resolution, refresh_rate, dead_pixels_test },        │    ║
║  │    "images": [ base64_encoded_damage_photos ]                        │    ║
║  │  }                                                                   │    ║
║  └───────────────────────────────┬──────────────────────────────────────┘    ║
║                                  │ HTTPS POST /api/v1/scan                   ║
║                                  ▼                                           ║
║  PHASE 3: PROCESSING (FastAPI Backend)                                       ║
║  ═════════════════════════════════════                                        ║
║                                                                               ║
║  ┌──────────────────────────────────────────────────────────────────────┐    ║
║  │  ┌─────────────┐    ┌─────────────┐    ┌──────────────────────┐    │    ║
║  │  │ Validation  │───►│ Feature     │───►│ ML Inference         │    │    ║
║  │  │ & Cleaning  │    │ Engineering │    │                      │    │    ║
║  │  └─────────────┘    │             │    │ ├─Health Scorer      │    │    ║
║  │                     │ • Normalize │    │ ├─RUL Predictor      │    │    ║
║  │                     │ • Encode    │    │ ├─Anomaly Detector   │    │    ║
║  │                     │ • Derive    │    │ └─Damage Classifier  │    │    ║
║  │                     │ • Scale     │    └──────────┬───────────┘    │    ║
║  │                     └─────────────┘               │                │    ║
║  │                                                   ▼                │    ║
║  │  ┌─────────────────────────────────────────────────────────────┐   │    ║
║  │  │                 DECISION ENGINE                              │   │    ║
║  │  │  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │   │    ║
║  │  │  │ Health      │  │ Repairability│  │ 4R Recommendation │  │   │    ║
║  │  │  │ Score       │  │ Score        │  │                   │  │   │    ║
║  │  │  │ (0-100)     │  │ (0-100)      │  │ ├─REPAIR          │  │   │    ║
║  │  │  └──────┬──────┘  └──────┬───────┘  │ ├─REUSE           │  │   │    ║
║  │  │         │                │           │ ├─REFURBISH       │  │   │    ║
║  │  │         └────────┬───────┘           │ └─RECYCLE         │  │   │    ║
║  │  │                  ▼                   └───────────────────┘  │   │    ║
║  │  │  ┌──────────────────────────────┐                           │   │    ║
║  │  │  │ Cost/Value/Carbon Estimator  │                           │   │    ║
║  │  │  └──────────────────────────────┘                           │   │    ║
║  │  └─────────────────────────────────────────────────────────────┘   │    ║
║  └───────────────────────────────┬──────────────────────────────────────┘    ║
║                                  │                                           ║
║  PHASE 4: OUTPUT GENERATION                                                  ║
║  ══════════════════════════                                                   ║
║                                  ▼                                           ║
║  ┌──────────────────────────────────────────────────────────────────────┐    ║
║  │                                                                      │    ║
║  │  ┌───────────┐  ┌────────────┐  ┌──────────┐  ┌────────────────┐  │    ║
║  │  │ Health    │  │ AI Report  │  │ Digital  │  │ Carbon Impact  │  │    ║
║  │  │ Dashboard │  │ (LLM Gen) │  │ Passport │  │ Report         │  │    ║
║  │  └───────────┘  └────────────┘  └──────────┘  └────────────────┘  │    ║
║  │                                                                      │    ║
║  │  ┌───────────┐  ┌────────────┐  ┌──────────┐                      │    ║
║  │  │ Repair    │  │ Resale     │  │ PDF      │                      │    ║
║  │  │ Cost Est. │  │ Value Est. │  │ Export   │                      │    ║
║  │  └───────────┘  └────────────┘  └──────────┘                      │    ║
║  │                                                                      │    ║
║  └──────────────────────────────────────────────────────────────────────┘    ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

### Technology Used
- **Data Collection**: psutil, pySMART, wmi (Python), Win32 API
- **Transmission**: HTTPS, JSON, REST API
- **Processing**: FastAPI, NumPy, Pandas, Scikit-learn, XGBoost, LightGBM, PyTorch, OpenCV
- **Storage**: PostgreSQL via SQLAlchemy ORM
- **Output**: React, Chart.js/Recharts, PDF generation (ReportLab)

### Advantages
- Clear separation between collection, processing, and presentation
- Local scanning ensures privacy (raw data processed locally where possible)
- Modular pipeline allows independent component upgrades
- Async processing for non-blocking scans

### Challenges
- Windows API access may require elevated privileges for some telemetry
- SMART data access varies across storage controllers
- Real-time progress reporting across Electron IPC
