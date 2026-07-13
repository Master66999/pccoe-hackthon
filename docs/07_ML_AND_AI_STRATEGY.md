# ReLife AI — Complete Project Design Document
# Part 7: ML Strategy, Feature Engineering & AI Decision Logic

---

## 32. ML MODEL SELECTION

### Objective
Select optimal ML models for each AI task with justification.

### Model Selection Matrix

```
╔══════════════════════════════════════════════════════════════════════════╗
║                      ML MODEL SELECTION                                  ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  TASK 1: COMPONENT HEALTH CLASSIFICATION                                ║
║  ┌────────────────────────────────────────────────────────────────┐     ║
║  │ Primary:   XGBoost Classifier                                  │     ║
║  │ Secondary: LightGBM Classifier                                 │     ║
║  │ Baseline:  Random Forest                                       │     ║
║  │                                                                │     ║
║  │ Why XGBoost:                                                   │     ║
║  │ ├─ Excellent with tabular/structured data                     │     ║
║  │ ├─ Handles missing values natively                            │     ║
║  │ ├─ Built-in regularization (prevents overfitting)             │     ║
║  │ ├─ Fast inference (critical for real-time scoring)            │     ║
║  │ └─ SHAP integration for explainability                        │     ║
║  │                                                                │     ║
║  │ Classes: [excellent, good, fair, poor, critical, failed]      │     ║
║  │ Input: 50+ engineered features per component                  │     ║
║  │ Output: Class label + probability distribution                │     ║
║  └────────────────────────────────────────────────────────────────┘     ║
║                                                                          ║
║  TASK 2: REMAINING USEFUL LIFE (RUL) PREDICTION                        ║
║  ┌────────────────────────────────────────────────────────────────┐     ║
║  │ Primary:   LightGBM Regressor                                  │     ║
║  │ Secondary: XGBoost Regressor                                   │     ║
║  │ Baseline:  Linear Regression                                   │     ║
║  │                                                                │     ║
║  │ Why LightGBM:                                                  │     ║
║  │ ├─ Faster training than XGBoost (leaf-wise growth)            │     ║
║  │ ├─ Better with large feature sets                             │     ║
║  │ ├─ Lower memory usage                                        │     ║
║  │ ├─ Handles categorical features directly                     │     ║
║  │ └─ Good generalization with proper tuning                     │     ║
║  │                                                                │     ║
║  │ Target: days_remaining (continuous, 0 to 3650)                │     ║
║  │ Evaluation: MAE, RMSE, R²                                    │     ║
║  └────────────────────────────────────────────────────────────────┘     ║
║                                                                          ║
║  TASK 3: ANOMALY DETECTION                                              ║
║  ┌────────────────────────────────────────────────────────────────┐     ║
║  │ Primary:   Isolation Forest                                    │     ║
║  │ Secondary: Local Outlier Factor (LOF)                          │     ║
║  │                                                                │     ║
║  │ Why Isolation Forest:                                          │     ║
║  │ ├─ Unsupervised (no labeled anomaly data needed)              │     ║
║  │ ├─ Efficient with high-dimensional data                       │     ║
║  │ ├─ Interpretable anomaly scores                               │     ║
║  │ └─ Robust to irrelevant features                              │     ║
║  │                                                                │     ║
║  │ Use case: Detect unusual performance patterns that may        │     ║
║  │ indicate hidden hardware issues                               │     ║
║  └────────────────────────────────────────────────────────────────┘     ║
║                                                                          ║
║  TASK 4: PHYSICAL DAMAGE DETECTION (Computer Vision)                    ║
║  ┌────────────────────────────────────────────────────────────────┐     ║
║  │ Primary:   YOLOv8n (nano)                                     │     ║
║  │ Secondary: YOLOv8s (small) for higher accuracy                │     ║
║  │                                                                │     ║
║  │ Why YOLOv8:                                                    │     ║
║  │ ├─ State-of-the-art real-time object detection                │     ║
║  │ ├─ Nano variant runs efficiently on CPU                       │     ║
║  │ ├─ Easy to train with custom datasets (Ultralytics)           │     ║
║  │ ├─ Multi-class detection in single pass                       │     ║
║  │ └─ Export to ONNX for fast cross-platform inference           │     ║
║  │                                                                │     ║
║  │ Classes: 9 damage types + no_damage                           │     ║
║  │ Input: 640×640 RGB image                                     │     ║
║  │ Output: Bounding boxes + class + confidence                   │     ║
║  └────────────────────────────────────────────────────────────────┘     ║
║                                                                          ║
║  TASK 5: NATURAL LANGUAGE EXPLANATION                                    ║
║  ┌────────────────────────────────────────────────────────────────┐     ║
║  │ Primary:   OpenAI GPT-4o-mini (API)                           │     ║
║  │ Fallback:  Ollama + Llama 3 (Local)                           │     ║
║  │ Minimal:   Template-based generation (no LLM needed)          │     ║
║  │                                                                │     ║
║  │ Strategy:                                                      │     ║
║  │ ├─ Structured prompt with scan results as context             │     ║
║  │ ├─ System prompt enforces consistent, professional tone       │     ║
║  │ ├─ Output in markdown format for rich rendering               │     ║
║  │ └─ Fallback to templates if API unavailable                   │     ║
║  └────────────────────────────────────────────────────────────────┘     ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 33. TRAINING STRATEGY

### Objective
Define the end-to-end ML training, validation, and deployment pipeline.

```
╔══════════════════════════════════════════════════════════════════════╗
║                      TRAINING STRATEGY                               ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  PHASE 1: DATA PREPARATION                                          ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ 1. Collect real scan data (pilot users + internal testing) │     ║
║  │ 2. Generate synthetic data (for initial model training)    │     ║
║  │ 3. Clean & validate (handle missing, outliers)             │     ║
║  │ 4. Feature engineering (50+ features per component)        │     ║
║  │ 5. Label encoding & target variable creation               │     ║
║  │ 6. Train/Validation/Test split: 70/15/15                  │     ║
║  │ 7. Stratified sampling for class balance                   │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  PHASE 2: MODEL TRAINING                                             ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ 1. Baseline model (Random Forest / Linear Regression)      │     ║
║  │ 2. Primary model training (XGBoost / LightGBM)            │     ║
║  │ 3. Hyperparameter tuning (Optuna / GridSearchCV)          │     ║
║  │ 4. Cross-validation (5-fold stratified)                    │     ║
║  │ 5. Ensemble if beneficial (VotingClassifier)               │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  PHASE 3: EVALUATION                                                 ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ Classification metrics:                                    │     ║
║  │ ├─ Accuracy, Precision, Recall, F1-Score                  │     ║
║  │ ├─ Confusion matrix analysis                              │     ║
║  │ └─ ROC-AUC (per class)                                    │     ║
║  │                                                            │     ║
║  │ Regression metrics:                                        │     ║
║  │ ├─ MAE, RMSE, R²                                         │     ║
║  │ └─ Residual analysis                                      │     ║
║  │                                                            │     ║
║  │ CV model metrics:                                          │     ║
║  │ ├─ mAP@50, mAP@50-95                                     │     ║
║  │ ├─ Precision/Recall per class                             │     ║
║  │ └─ Inference speed (FPS)                                  │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  PHASE 4: DEPLOYMENT & MONITORING                                    ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ 1. Serialize models (joblib for sklearn/XGBoost,           │     ║
║  │    .pt for PyTorch, ONNX for cross-platform)               │     ║
║  │ 2. Register in Model Registry with version tag             │     ║
║  │ 3. A/B testing with shadow mode deployment                 │     ║
║  │ 4. Monitor prediction drift (feature distribution)         │     ║
║  │ 5. Scheduled retraining (monthly or on performance drop)   │     ║
║  │ 6. Model rollback capability                               │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 34. DATASET REQUIREMENTS

### Objective
Define data requirements for training all ML models.

| Dataset | Size (MVP) | Size (Production) | Source | Format |
|---|---|---|---|---|
| Battery Health | 5,000 samples | 50,000+ | Synthetic + real scans | CSV/Parquet |
| Storage SMART | 10,000 samples | 100,000+ | Backblaze dataset + synthetic | CSV/Parquet |
| CPU Performance | 5,000 samples | 50,000+ | Benchmarks + synthetic | CSV/Parquet |
| RAM Diagnostics | 3,000 samples | 30,000+ | Synthetic + memtest results | CSV/Parquet |
| Peripheral Status | 2,000 samples | 20,000+ | Survey + synthetic | CSV/Parquet |
| Physical Damage Images | 5,000 images | 50,000+ | Repair shop photos + web scrape | YOLO format |
| RUL Labels | 3,000 samples | 30,000+ | Longitudinal tracking + synthetic | CSV/Parquet |

### Synthetic Data Generation Strategy

```python
# Example: Synthetic Battery Data Generator
def generate_battery_data(n_samples=5000):
    """
    Generates realistic synthetic battery health data.
    
    Distributions based on real-world battery degradation curves:
    - cycle_count: follows usage patterns (0-1500)
    - health_pct: degrades with cycles (exponential decay)
    - design_capacity: manufacturer specs (40-80 Wh)
    - full_charge_capacity: health_pct × design_capacity
    - temperature: normal operation range (25-45°C)
    - charge_rate: degrades slightly with age
    - age_days: correlated with cycle_count
    
    Labels:
    - health_status: derived from health_pct thresholds
    - rul_days: derived from degradation curve projection
    """
```

---

## 35. FEATURE ENGINEERING

### Objective
Define the feature engineering pipeline for each component type.

### Feature Categories

```
╔══════════════════════════════════════════════════════════════════╗
║                    FEATURE ENGINEERING                            ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  CATEGORY 1: RAW FEATURES (Direct from scan)                    ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ Battery: cycle_count, design_cap, full_charge_cap,       │   ║
║  │          voltage, charge_rate, temperature                │   ║
║  │ Storage: smart_5, smart_9, smart_187, smart_188,         │   ║
║  │          smart_197, smart_198, temperature, power_on_hrs  │   ║
║  │ CPU: clock_speed, core_count, temperature, utilization   │   ║
║  │ RAM: total_gb, speed_mhz, utilization, error_count       │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  CATEGORY 2: DERIVED FEATURES (Calculated)                      ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ battery_health_pct = full_charge / design × 100          │   ║
║  │ battery_cycle_ratio = cycle_count / max_expected_cycles  │   ║
║  │ storage_age_years = power_on_hours / 8760                │   ║
║  │ storage_error_rate = reallocated_sectors / total_sectors  │   ║
║  │ cpu_thermal_throttle_ratio = throttle_events / uptime    │   ║
║  │ ram_utilization_avg = mean(utilization_samples)           │   ║
║  │ overall_age_days = (current_date - purchase_date).days   │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  CATEGORY 3: INTERACTION FEATURES                                ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ battery_stress = cycle_count × (1 - health_pct/100)     │   ║
║  │ cpu_gpu_thermal = cpu_temp × gpu_temp / 1000             │   ║
║  │ storage_risk = error_rate × age_years                    │   ║
║  │ overall_degradation = Σ(component_health × weight)       │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  CATEGORY 4: STATISTICAL FEATURES (if historical data)          ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ health_trend_slope = linear_regression_slope(history)    │   ║
║  │ health_volatility = std(health_scores)                   │   ║
║  │ degradation_acceleration = 2nd_derivative(health_curve)  │   ║
║  │ anomaly_frequency = anomaly_count / scan_count           │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  NORMALIZATION:                                                  ║
║  ├─ MinMaxScaler for bounded features (0-1)                    ║
║  ├─ StandardScaler for unbounded features                      ║
║  └─ RobustScaler for features with outliers                    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 36. AI DECISION LOGIC

### Objective
Define the hybrid rule-based + ML decision engine for 4R recommendations.

```
╔══════════════════════════════════════════════════════════════════════╗
║                     AI DECISION LOGIC (4R ENGINE)                    ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  INPUT:                                                              ║
║  ├─ overall_health_score (0-100)                                    ║
║  ├─ repairability_score (0-100)                                     ║
║  ├─ component_health_map {component: score}                         ║
║  ├─ damaged_components_count                                        ║
║  ├─ estimated_repair_cost                                           ║
║  ├─ estimated_device_value                                          ║
║  ├─ device_age_years                                                ║
║  ├─ physical_damage_severity                                        ║
║  └─ rul_days                                                        ║
║                                                                      ║
║  DECISION TREE:                                                      ║
║  ═══════════════                                                     ║
║                                                                      ║
║              ┌──────────────────────────┐                           ║
║              │ overall_health_score?     │                           ║
║              └───────────┬──────────────┘                           ║
║         ┌────────────────┼────────────────┐                         ║
║         ▼                ▼                ▼                         ║
║    ┌─────────┐     ┌──────────┐    ┌──────────┐                   ║
║    │ > 80    │     │ 40-80    │    │ < 40     │                   ║
║    │ (Good)  │     │ (Medium) │    │ (Poor)   │                   ║
║    └────┬────┘     └────┬─────┘    └────┬─────┘                   ║
║         │               │               │                           ║
║         ▼               ▼               ▼                           ║
║    ┌─────────┐   ┌───────────┐   ┌───────────────┐               ║
║    │ Physical │   │ repair_   │   │ repairability │               ║
║    │ damage?  │   │ cost vs   │   │ _score?       │               ║
║    └──┬──┬───┘   │ device    │   └──┬──────┬─────┘               ║
║       │  │       │ value?    │      │      │                       ║
║       ▼  ▼       └──┬──┬────┘      ▼      ▼                       ║
║    No  Yes      <30% >30%      > 40    < 40                       ║
║    │    │        │     │         │       │                           ║
║    ▼    ▼        ▼     ▼         ▼       ▼                           ║
║  ┌────┐┌────┐ ┌────┐┌─────┐  ┌─────┐ ┌─────────┐                 ║
║  │REUS││REFU│ │REPA││REFUR│  │REFUR│ │ RECYCLE │                 ║
║  │E   ││RBIS│ │IR  ││BISH │  │BISH │ │         │                 ║
║  └────┘│H   │ └────┘└─────┘  └─────┘ └─────────┘                 ║
║        └────┘                                                       ║
║                                                                      ║
║  CONFIDENCE SCORING:                                                 ║
║  confidence = model_probability × data_completeness_factor          ║
║  ├─ data_completeness = scanned_components / total_components       ║
║  └─ If confidence < 0.6, flag as "Low Confidence — verify manually"║
║                                                                      ║
║  MULTI-RECOMMENDATION OUTPUT:                                        ║
║  Always return ranked list of all 4 options with confidence:        ║
║  [                                                                   ║
║    { "type": "REPAIR",    "priority": 1, "confidence": 0.87 },     ║
║    { "type": "REUSE",     "priority": 2, "confidence": 0.72 },     ║
║    { "type": "REFURBISH", "priority": 3, "confidence": 0.45 },     ║
║    { "type": "RECYCLE",   "priority": 4, "confidence": 0.12 }      ║
║  ]                                                                   ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 37. EXPLAINABLE AI APPROACH

### Objective
Ensure all AI decisions are transparent, interpretable, and trustworthy.

```
╔══════════════════════════════════════════════════════════════════════╗
║                   EXPLAINABLE AI (XAI) APPROACH                      ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  LAYER 1: MODEL-LEVEL EXPLAINABILITY (SHAP)                        ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ SHAP (SHapley Additive exPlanations)                       │     ║
║  │                                                            │     ║
║  │ Global: Feature importance ranking across all predictions  │     ║
║  │ Local: Per-prediction feature contribution breakdown       │     ║
║  │                                                            │     ║
║  │ Example SHAP output for a single device:                   │     ║
║  │ ┌──────────────────────────────────────────────────┐      │     ║
║  │ │ Feature              │ Impact │ Direction        │      │     ║
║  │ ├──────────────────────┼────────┼──────────────────┤      │     ║
║  │ │ battery_health_pct   │ +18.5  │ ↓ Lowers score   │      │     ║
║  │ │ storage_error_rate   │ +2.1   │ ↓ Lowers score   │      │     ║
║  │ │ cpu_temp             │ -0.5   │ ↑ Normal range   │      │     ║
║  │ │ ram_speed            │ -1.2   │ ↑ Good speed     │      │     ║
║  │ └──────────────────────────────────────────────────┘      │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  LAYER 2: INSTANCE-LEVEL EXPLAINABILITY (LIME)                      ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ LIME (Local Interpretable Model-agnostic Explanations)     │     ║
║  │                                                            │     ║
║  │ Generates simple linear model around each prediction       │     ║
║  │ to show which features most influenced the decision        │     ║
║  │                                                            │     ║
║  │ Used for: Individual component health explanations         │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  LAYER 3: NATURAL LANGUAGE EXPLANATION (LLM)                        ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ LLM generates human-readable reports from structured data  │     ║
║  │                                                            │     ║
║  │ Prompt Template:                                           │     ║
║  │ "You are ReLife AI, a laptop health assessment expert.     │     ║
║  │  Given the following scan results and SHAP explanations,  │     ║
║  │  generate a clear, professional report explaining:        │     ║
║  │  1. Overall device health status                          │     ║
║  │  2. Key findings per component                            │     ║
║  │  3. Why the recommendation was made                       │     ║
║  │  4. Estimated costs and carbon impact                     │     ║
║  │  5. Recommended next steps"                               │     ║
║  │                                                            │     ║
║  │ Example Output:                                            │     ║
║  │ "Your Dell XPS 15 received a health score of 78/100 (B+). │     ║
║  │  The battery is the primary concern at 62% health with    │     ║
║  │  520 charge cycles. All other components are performing    │     ║
║  │  well. We recommend replacing the battery ($45-65), which │     ║
║  │  would extend the laptop's useful life by approximately   │     ║
║  │  2 years and save an estimated 335 kg of CO2 compared     │     ║
║  │  to purchasing a new laptop."                             │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  TRANSPARENCY PRINCIPLES:                                            ║
║  ├─ Never claim 100% accuracy — always show confidence scores       ║
║  ├─ Always show which data sources informed the decision            ║
║  ├─ Flag when data is incomplete or uncertain                       ║
║  ├─ Provide "How was this calculated?" expandable sections         ║
║  └─ Log all model versions and feature inputs for auditability     ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

### Advantages
- Multi-layered explainability (technical + user-friendly)
- SHAP provides mathematically rigorous feature attribution
- LLM layer makes complex results accessible to non-technical users
- Builds trust through transparency

### Challenges
- SHAP computation can be slow for large models (use approximate methods)
- LLM may hallucinate — output must be grounded in actual data
- Balance between detail and simplicity in explanations
