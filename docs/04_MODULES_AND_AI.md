# ReLife AI — Complete Project Design Document
# Part 4: Backend, Frontend, AI & Computer Vision Modules

---

## 16. BACKEND MODULES

### Objective
Define all backend service modules with their responsibilities and interfaces.

### Module Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                    BACKEND MODULE MAP                             ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │                   API LAYER (Routers)                      │ ║
║  │  auth │ users │ devices │ scans │ health │ recs │ cv │ ... │ ║
║  └───┬────┬───────┬────────┬───────┬────────┬──────┬──────────┘ ║
║      │    │       │        │       │        │      │            ║
║  ┌───▼────▼───────▼────────▼───────▼────────▼──────▼──────────┐ ║
║  │                  SERVICE LAYER                              │ ║
║  │                                                             │ ║
║  │  Module              │ Responsibility                       │ ║
║  │  ────────────────────┼──────────────────────────────        │ ║
║  │  AuthService         │ JWT issue/verify, password hash      │ ║
║  │  UserService         │ CRUD, profile management             │ ║
║  │  DeviceService       │ Device registration & management     │ ║
║  │  ScanService         │ Orchestrate scan data processing     │ ║
║  │  HealthScoringService│ Calculate health & repairability     │ ║
║  │  RecommendationSvc   │ Generate 4R recommendations          │ ║
║  │  CVAnalysisService   │ Process images through YOLO          │ ║
║  │  LLMService          │ Generate explanations via LLM        │ ║
║  │  CarbonService       │ Calculate environmental impact       │ ║
║  │  CostEstimationSvc   │ Repair cost & resale estimation      │ ║
║  │  PassportService     │ Generate/verify device passports     │ ║
║  │  ReportService       │ Compile & export reports             │ ║
║  │  AnalyticsService    │ Aggregate platform analytics         │ ║
║  │  MarketplaceService  │ Manage listings (design phase)       │ ║
║  │                                                             │ ║
║  └───┬─────────────────────────────────────────────────────────┘ ║
║      │                                                           ║
║  ┌───▼─────────────────────────────────────────────────────────┐ ║
║  │                REPOSITORY LAYER                              │ ║
║  │                                                              │ ║
║  │  UserRepository ──► SQLAlchemy ──► PostgreSQL               │ ║
║  │  DeviceRepository                                            │ ║
║  │  ScanRepository                                              │ ║
║  │  ComponentRepository                                         │ ║
║  │  HealthRepository                                            │ ║
║  │  RecommendationRepository                                    │ ║
║  │  PassportRepository                                          │ ║
║  │  AnalyticsRepository                                         │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

### Key Backend Module Details

**ScanService (Core Orchestrator)**
```python
class ScanService:
    """
    Orchestrates the complete scan processing pipeline.
    
    Flow:
    1. Validate incoming scan payload (Pydantic)
    2. Create scan record in DB
    3. Process each component's raw data through feature pipeline
    4. Run ML inference for health scoring per component
    5. Calculate overall health score
    6. Generate repairability score
    7. Run 4R recommendation engine
    8. If images present, trigger CV analysis
    9. Calculate carbon impact
    10. Estimate repair cost and resale value
    11. Generate LLM explanation
    12. Store all results
    13. Return comprehensive results to client
    """
```

**HealthScoringService**
```python
class HealthScoringService:
    """
    Calculates health scores using weighted ML model outputs.
    
    - Per-component health score (0-100)
    - Overall device health score (weighted average)
    - Health grade (A+ to F)
    - Trend analysis (improving/stable/declining/critical)
    """
```

**RecommendationService**
```python
class RecommendationService:
    """
    Hybrid rule-based + ML recommendation engine.
    
    Decision Matrix:
    - Health Score > 80: REUSE (as-is or minor repair)
    - Health Score 50-80: REPAIR or REFURBISH
    - Health Score 25-50: REFURBISH (if cost-effective) or RECYCLE
    - Health Score < 25: RECYCLE
    
    Also considers:
    - Repair cost vs. replacement cost ratio
    - Component availability
    - Device age and market value
    - Environmental impact of each option
    """
```

### Technology Used
- FastAPI (async web framework)
- SQLAlchemy 2.0 (async ORM)
- Pydantic v2 (validation)
- Alembic (migrations)
- python-jose (JWT)
- passlib[bcrypt] (password hashing)
- celery (optional async tasks)

---

## 17. FRONTEND MODULES

### Objective
Define all React frontend modules, pages, and component hierarchy.

### Module Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                    FRONTEND MODULE MAP                           ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │                    APP SHELL                              │   ║
║  │  ┌────────┐ ┌──────────────────────────────────┐         │   ║
║  │  │Sidebar │ │          Main Content Area        │         │   ║
║  │  │        │ │  ┌──────────────────────────────┐ │         │   ║
║  │  │ • Home │ │  │   ROUTER (React Router v6)   │ │         │   ║
║  │  │ • Scan │ │  │                              │ │         │   ║
║  │  │ • Dash │ │  │  Page Components:            │ │         │   ║
║  │  │ • Devs │ │  │  ├─ DashboardPage            │ │         │   ║
║  │  │ • Rept │ │  │  ├─ ScanPage                 │ │         │   ║
║  │  │ • Pass │ │  │  ├─ DeviceDetailPage         │ │         │   ║
║  │  │ • CO2  │ │  │  ├─ ReportPage               │ │         │   ║
║  │  │ • Shop │ │  │  ├─ PassportPage             │ │         │   ║
║  │  │ • Mkt  │ │  │  ├─ CarbonDashboardPage     │ │         │   ║
║  │  │ • Adm  │ │  │  ├─ MarketplacePage          │ │         │   ║
║  │  │ • Set  │ │  │  ├─ AnalyticsPage            │ │         │   ║
║  │  │        │ │  │  └─ AdminPage                │ │         │   ║
║  │  └────────┘ │  └──────────────────────────────┘ │         │   ║
║  │             └──────────────────────────────────┘         │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  COMPONENT LIBRARY                                               ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │                                                          │   ║
║  │  Common          │ Dashboard        │ Scanner            │   ║
║  │  ───────         │ ─────────        │ ───────            │   ║
║  │  Header          │ HealthOverview   │ ScanWizard         │   ║
║  │  Sidebar         │ ComponentCard    │ ScanProgress       │   ║
║  │  Footer          │ ScoreChart       │ ComponentScanItem  │   ║
║  │  LoadingSpinner  │ RecPanel         │ ImageUploader      │   ║
║  │  ProgressBar     │ CarbonWidget     │                    │   ║
║  │  ScoreGauge      │ TrendChart       │ Passport           │   ║
║  │  StatusBadge     │ ComponentGrid    │ ─────────          │   ║
║  │  Modal           │                  │ PassportView       │   ║
║  │  Card            │ Reports          │ PassportQR         │   ║
║  │  Toast           │ ───────          │ PassportHistory    │   ║
║  │  DataTable       │ FullReport       │                    │   ║
║  │  Pagination      │ ComponentReport  │ Admin              │   ║
║  │  SearchBar       │ PDFExport        │ ─────              │   ║
║  │  FilterPanel     │ ShareReport      │ UserManagement     │   ║
║  │                  │                  │ DeviceFleet        │   ║
║  │                  │                  │ SystemAnalytics    │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  STATE MANAGEMENT (Zustand)                                      ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  authStore: { user, token, login(), logout() }           │   ║
║  │  scanStore: { scans, progress, startScan(), results }    │   ║
║  │  deviceStore: { devices, selectedDevice, fetch() }       │   ║
║  │  uiStore: { theme, sidebarOpen, notifications }          │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Technology Used
- React 18 (with hooks & Suspense)
- Tailwind CSS (utility-first styling)
- React Router v6 (client-side routing)
- Zustand (lightweight state management)
- Recharts (data visualization)
- React Hook Form + Zod (form validation)
- Axios (HTTP client)
- Framer Motion (animations)
- react-qr-code (QR generation)
- jspdf + html2canvas (PDF export)

---

## 18. AI MODULES

### Objective
Define all AI/ML modules, their architectures, and integration patterns.

### AI Module Architecture

```
╔══════════════════════════════════════════════════════════════════════╗
║                        AI MODULE ARCHITECTURE                        ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ┌────────────────────────────────────────────────────────────────┐ ║
║  │                    MODEL REGISTRY                              │ ║
║  │                                                                │ ║
║  │  Manages model versioning, loading, and lifecycle              │ ║
║  │  Supports hot-swapping models without downtime                 │ ║
║  │                                                                │ ║
║  │  Models:                                                       │ ║
║  │  ┌──────────────┬──────────────┬────────────┬──────────────┐ │ ║
║  │  │ Health       │ RUL          │ Anomaly    │ Damage       │ │ ║
║  │  │ Classifier   │ Regressor    │ Detector   │ Detector     │ │ ║
║  │  │              │              │            │              │ │ ║
║  │  │ XGBoost      │ LightGBM     │ Isolation  │ YOLOv8       │ │ ║
║  │  │ LightGBM     │ XGBoost      │ Forest     │ PyTorch      │ │ ║
║  │  │              │              │            │              │ │ ║
║  │  │ Input:       │ Input:       │ Input:     │ Input:       │ │ ║
║  │  │ Component    │ Time-series  │ Perf       │ Device       │ │ ║
║  │  │ features     │ metrics      │ metrics    │ images       │ │ ║
║  │  │              │              │            │              │ │ ║
║  │  │ Output:      │ Output:      │ Output:    │ Output:      │ │ ║
║  │  │ Health class │ Days left    │ Anomaly    │ Damage type  │ │ ║
║  │  │ (0-100)      │ (integer)    │ score      │ + bbox       │ │ ║
║  │  └──────────────┴──────────────┴────────────┴──────────────┘ │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                              │                                       ║
║  ┌───────────────────────────▼────────────────────────────────────┐ ║
║  │                  FEATURE PIPELINE                              │ ║
║  │                                                                │ ║
║  │  Raw Scan Data → Clean → Normalize → Engineer → Feature Vec   │ ║
║  │                                                                │ ║
║  │  Steps:                                                        │ ║
║  │  1. Missing value imputation (median/mode)                    │ ║
║  │  2. Outlier detection & capping                               │ ║
║  │  3. Feature normalization (MinMax / Standard)                 │ ║
║  │  4. Derived features (ratios, deltas, age calculations)       │ ║
║  │  5. Categorical encoding (component types, statuses)          │ ║
║  │  6. Feature selection (importance-based)                      │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                              │                                       ║
║  ┌───────────────────────────▼────────────────────────────────────┐ ║
║  │                  INFERENCE PIPELINE                             │ ║
║  │                                                                │ ║
║  │  Feature Vector → Model Predict → Post-Process → Results      │ ║
║  │                                                                │ ║
║  │  1. Load model from registry                                  │ ║
║  │  2. Run inference (batch or single)                           │ ║
║  │  3. Apply calibration                                         │ ║
║  │  4. Generate confidence scores                                │ ║
║  │  5. Run SHAP/LIME for explainability                         │ ║
║  │  6. Package results with explanations                         │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                              │                                       ║
║  ┌───────────────────────────▼────────────────────────────────────┐ ║
║  │                  EXPLAINABILITY MODULE                          │ ║
║  │                                                                │ ║
║  │  ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐  │ ║
║  │  │ SHAP        │   │ LIME         │   │ LLM Explanation  │  │ ║
║  │  │ (Global +   │   │ (Local       │   │ (Natural         │  │ ║
║  │  │  Local)     │   │  Instance)   │   │  Language)       │  │ ║
║  │  └─────────────┘   └──────────────┘   └──────────────────┘  │ ║
║  └────────────────────────────────────────────────────────────────┘ ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

### AI Model Details

| Model | Algorithm | Task | Input Features | Output |
|---|---|---|---|---|
| HealthClassifier | XGBoost/LightGBM | Multi-class | 50+ component metrics | Score 0-100, Grade |
| RULPredictor | LightGBM/XGBoost | Regression | Time-series + static | Days remaining |
| AnomalyDetector | Isolation Forest | Unsupervised | Performance metrics | Anomaly score |
| DamageDetector | YOLOv8-nano | Object Detection | Device images | Damage class + bbox |
| LLMExplainer | OpenAI/Ollama | Text Generation | Structured results | Natural language report |

---

## 19. COMPUTER VISION MODULES

### Objective
Define the CV pipeline for physical damage detection.

### CV Pipeline Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║              COMPUTER VISION PIPELINE                             ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  User Uploads Photo(s)                                           ║
║         │                                                        ║
║         ▼                                                        ║
║  ┌──────────────────┐                                           ║
║  │ IMAGE PRE-        │                                           ║
║  │ PROCESSING        │                                           ║
║  │                   │                                           ║
║  │ • Resize (640x640)│                                           ║
║  │ • Normalize       │                                           ║
║  │ • Color correct   │                                           ║
║  │ • Validate format │                                           ║
║  └────────┬─────────┘                                           ║
║           ▼                                                      ║
║  ┌──────────────────┐                                           ║
║  │ YOLOv8 INFERENCE │                                           ║
║  │                   │                                           ║
║  │ Classes:          │                                           ║
║  │ ├─ crack          │                                           ║
║  │ ├─ dent           │                                           ║
║  │ ├─ scratch        │                                           ║
║  │ ├─ broken_hinge   │                                           ║
║  │ ├─ screen_damage  │                                           ║
║  │ ├─ missing_key    │                                           ║
║  │ ├─ liquid_damage  │                                           ║
║  │ ├─ discoloration  │                                           ║
║  │ └─ no_damage      │                                           ║
║  └────────┬─────────┘                                           ║
║           ▼                                                      ║
║  ┌──────────────────┐                                           ║
║  │ POST-PROCESSING  │                                           ║
║  │                   │                                           ║
║  │ • NMS filtering   │                                           ║
║  │ • Confidence thresh│                                          ║
║  │ • Severity mapping │                                          ║
║  │ • Bbox annotation  │                                          ║
║  └────────┬─────────┘                                           ║
║           ▼                                                      ║
║  ┌──────────────────┐                                           ║
║  │ SEVERITY SCORING │                                           ║
║  │                   │                                           ║
║  │ none     → 100   │                                           ║
║  │ minor    → 75    │                                           ║
║  │ moderate → 50    │                                           ║
║  │ severe   → 25    │                                           ║
║  │ critical → 0     │                                           ║
║  └────────┬─────────┘                                           ║
║           ▼                                                      ║
║  ┌──────────────────┐                                           ║
║  │ RESULT           │                                           ║
║  │                   │                                           ║
║  │ • Annotated image │                                           ║
║  │ • Damage list     │                                           ║
║  │ • Severity scores │                                           ║
║  │ • Physical score  │                                           ║
║  │ • Confidence vals │                                           ║
║  └──────────────────┘                                           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Dataset Requirements for CV

| Requirement | Detail |
|---|---|
| Dataset Size | 5,000–10,000 annotated images (MVP) |
| Classes | 9 damage types + no_damage |
| Annotation | YOLO format (class x_center y_center w h) |
| Sources | Curated from repair shop photos, synthetic augmentation |
| Augmentation | Rotation, flip, brightness, blur, crop |
| Model | YOLOv8n (nano) for fast inference |
| Input Size | 640×640 pixels |
| Inference Time | < 100ms per image (GPU), < 500ms (CPU) |

### Technology Used
- OpenCV (image preprocessing)
- PyTorch (deep learning runtime)
- Ultralytics YOLOv8 (object detection)
- Albumentations (data augmentation)
- LabelImg / Roboflow (annotation tools)
