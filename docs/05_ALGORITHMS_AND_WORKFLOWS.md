# ReLife AI — Complete Project Design Document
# Part 5: Algorithms, Scoring & Workflows

---

## 20. LAPTOP SCANNER WORKFLOW

### Objective
Define the complete step-by-step scanning process from user initiation to result display.

### Workflow Diagram

```
╔══════════════════════════════════════════════════════════════════════════╗
║                   LAPTOP SCANNER WORKFLOW                                ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  Step 1: USER INITIATES SCAN                                            ║
║  ┌───────────────────────────────────┐                                  ║
║  │ User clicks "Start Scan" button   │                                  ║
║  │ Select scan type: Full / Quick    │                                  ║
║  │ Optional: Upload damage photos    │                                  ║
║  └───────────────┬───────────────────┘                                  ║
║                  │                                                       ║
║  Step 2: ELECTRON TRIGGERS LOCAL SCANNER                                ║
║  ┌───────────────▼───────────────────┐                                  ║
║  │ Electron Main Process receives    │                                  ║
║  │ IPC message from React renderer   │                                  ║
║  │ Spawns Python scanner subprocess  │                                  ║
║  └───────────────┬───────────────────┘                                  ║
║                  │                                                       ║
║  Step 3: PYTHON SCANNER ORCHESTRATOR                                    ║
║  ┌───────────────▼───────────────────┐                                  ║
║  │ scanner/orchestrator.py           │                                  ║
║  │                                   │                                  ║
║  │ Sequential component scanning:    │                                  ║
║  │ ┌─────────────────────────────┐  │   Progress: [████░░░░░░] 40%    ║
║  │ │ 1. System Info (WMI)       │  │                                  ║
║  │ │ 2. Battery (Win32 API)     │  │   Each component scan:           ║
║  │ │ 3. Storage (pySMART/WMI)   │  │   ├─ Collect raw data           ║
║  │ │ 4. RAM (WMI/psutil)        │  │   ├─ Validate data              ║
║  │ │ 5. CPU (psutil/WMI)        │  │   ├─ Report progress via IPC    ║
║  │ │ 6. GPU (WMI)              │  │   └─ Handle errors gracefully    ║
║  │ │ 7. Network (WMI/netsh)    │  │                                  ║
║  │ │ 8. Display (WMI)          │  │                                  ║
║  │ │ 9. Audio (WMI)            │  │                                  ║
║  │ │ 10. Input Devices (WMI)   │  │                                  ║
║  │ │ 11. USB/Peripherals       │  │                                  ║
║  │ │ 12. Cooling (if avail.)   │  │                                  ║
║  │ │ 13. Motherboard (basic)   │  │                                  ║
║  │ └─────────────────────────────┘  │                                  ║
║  └───────────────┬───────────────────┘                                  ║
║                  │                                                       ║
║  Step 4: AGGREGATE & TRANSMIT                                           ║
║  ┌───────────────▼───────────────────┐                                  ║
║  │ All component data → JSON payload │                                  ║
║  │ Send to backend via HTTPS POST    │                                  ║
║  │ POST /api/v1/scans                │                                  ║
║  └───────────────┬───────────────────┘                                  ║
║                  │                                                       ║
║  Step 5: BACKEND PROCESSING                                             ║
║  ┌───────────────▼───────────────────┐                                  ║
║  │ FastAPI receives scan payload     │                                  ║
║  │ ├─ Validate schema               │                                  ║
║  │ ├─ Feature engineering            │                                  ║
║  │ ├─ ML inference (health scoring)  │                                  ║
║  │ ├─ CV analysis (if images)        │                                  ║
║  │ ├─ 4R recommendation engine       │                                  ║
║  │ ├─ Carbon impact calculation      │                                  ║
║  │ ├─ Cost/value estimation          │                                  ║
║  │ ├─ LLM explanation generation     │                                  ║
║  │ └─ Store all results              │                                  ║
║  └───────────────┬───────────────────┘                                  ║
║                  │                                                       ║
║  Step 6: DISPLAY RESULTS                                                 ║
║  ┌───────────────▼───────────────────┐                                  ║
║  │ React frontend receives response  │                                  ║
║  │ ├─ Animated health score reveal   │                                  ║
║  │ ├─ Component-by-component cards   │                                  ║
║  │ ├─ AI recommendation banner       │                                  ║
║  │ ├─ Carbon savings display         │                                  ║
║  │ └─ "Generate Passport" CTA        │                                  ║
║  └───────────────────────────────────┘                                  ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Scanner Component Details

| Component | Data Source | Key Metrics Collected |
|---|---|---|
| Battery | Win32_Battery, WMI | cycle_count, design_capacity, full_charge_capacity, health_pct, voltage, charge_rate |
| SSD/HDD | pySMART, WMI | SMART attributes, read_error_rate, reallocated_sectors, power_on_hours, temperature |
| RAM | WMI, psutil | total_gb, speed_mhz, type (DDR4/5), error_count, utilization |
| CPU | psutil, WMI | model, cores, clock_speed, temperature, throttle_events, benchmark_score |
| GPU | WMI | model, vram_mb, driver_version, temperature, utilization |
| Keyboard | User-assisted test | key_test_result (functional / keys_missing / unresponsive) |
| Display | WMI, user test | resolution, refresh_rate, dead_pixel_test (pass/fail) |
| Touchpad | User-assisted test | responsiveness_test (pass/fail), gesture_support |
| Camera | OpenCV capture test | functional (yes/no), resolution, clarity_score |
| Microphone | pyaudio test | functional (yes/no), noise_level_db |
| Speaker | pyaudio playback | functional (yes/no), distortion_test |
| WiFi | netsh, WMI | adapter_status, signal_strength, speed_mbps |
| Bluetooth | WMI | adapter_present, functional, version |
| USB Ports | WMI | ports_detected, ports_functional |
| Cooling Fan | WMI (OEM-specific) | rpm (if available), noise_level |
| Motherboard | WMI | manufacturer, model, bios_version, serial |

---

## 21. HEALTH SCORE ALGORITHM

### Objective
Define the weighted, multi-factor health scoring algorithm.

### Algorithm Design

```
╔══════════════════════════════════════════════════════════════════╗
║                  HEALTH SCORE ALGORITHM                          ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  OVERALL HEALTH SCORE = Σ (Component_Score × Weight)             ║
║                                                                  ║
║  Component Weights (total = 1.0):                                ║
║  ┌──────────────────┬────────┬───────────────────────────┐      ║
║  │ Component        │ Weight │ Justification              │      ║
║  ├──────────────────┼────────┼───────────────────────────┤      ║
║  │ Battery          │ 0.15   │ Critical for portability   │      ║
║  │ Storage (SSD/HDD)│ 0.15   │ Data integrity, speed     │      ║
║  │ CPU              │ 0.12   │ Core performance           │      ║
║  │ RAM              │ 0.10   │ Multitasking ability       │      ║
║  │ Display          │ 0.10   │ Primary interface          │      ║
║  │ GPU              │ 0.07   │ Graphics capability        │      ║
║  │ Motherboard      │ 0.07   │ Core system integrity      │      ║
║  │ Keyboard         │ 0.06   │ Input functionality        │      ║
║  │ Cooling Fan      │ 0.05   │ Thermal management         │      ║
║  │ WiFi             │ 0.04   │ Connectivity               │      ║
║  │ Touchpad         │ 0.03   │ Input alternative          │      ║
║  │ Camera           │ 0.02   │ Remote work essential      │      ║
║  │ Speaker          │ 0.02   │ Audio output               │      ║
║  │ Microphone       │ 0.01   │ Audio input                │      ║
║  │ Bluetooth        │ 0.005  │ Peripheral connectivity    │      ║
║  │ USB Ports        │ 0.005  │ Peripheral connectivity    │      ║
║  └──────────────────┴────────┴───────────────────────────┘      ║
║                                                                  ║
║  COMPONENT SCORE CALCULATION (per component):                    ║
║  ════════════════════════════════════════════                     ║
║                                                                  ║
║  component_score = ML_model.predict(feature_vector)              ║
║                                                                  ║
║  For Battery (example):                                          ║
║  Features:                                                       ║
║  ├─ health_pct = full_charge_cap / design_cap × 100             ║
║  ├─ cycle_count_normalized = cycle_count / max_expected_cycles   ║
║  ├─ charge_rate_degradation                                      ║
║  ├─ age_days                                                     ║
║  └─ voltage_stability                                            ║
║                                                                  ║
║  If ML model unavailable, fallback to rule-based:                ║
║  ┌────────────────────────────────────────┐                      ║
║  │ if health_pct > 80: score = 90-100    │                      ║
║  │ if health_pct 60-80: score = 70-89    │                      ║
║  │ if health_pct 40-60: score = 50-69    │                      ║
║  │ if health_pct 20-40: score = 30-49    │                      ║
║  │ if health_pct < 20:  score = 0-29     │                      ║
║  └────────────────────────────────────────┘                      ║
║                                                                  ║
║  GRADE MAPPING:                                                  ║
║  ┌────────┬────────────┬────────────────┐                       ║
║  │ Grade  │ Score Range │ Description    │                       ║
║  ├────────┼────────────┼────────────────┤                       ║
║  │ A+     │ 95-100     │ Excellent      │                       ║
║  │ A      │ 85-94      │ Very Good      │                       ║
║  │ B+     │ 75-84      │ Good           │                       ║
║  │ B      │ 65-74      │ Above Average  │                       ║
║  │ C+     │ 55-64      │ Average        │                       ║
║  │ C      │ 45-54      │ Below Average  │                       ║
║  │ D      │ 30-44      │ Poor           │                       ║
║  │ F      │ 0-29       │ Critical/Failed│                       ║
║  └────────┴────────────┴────────────────┘                       ║
║                                                                  ║
║  CRITICAL COMPONENT OVERRIDE:                                    ║
║  If ANY critical component (Battery, Storage, CPU, Motherboard)  ║
║  scores below 20, overall grade is capped at D regardless of     ║
║  other scores. This prevents misleading high scores when a       ║
║  core component has critically failed.                           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 22. REPAIRABILITY SCORE ALGORITHM

### Objective
Quantify how repairable a laptop is, considering component replaceability, cost, and availability.

### Algorithm

```
╔══════════════════════════════════════════════════════════════════════╗
║                 REPAIRABILITY SCORE ALGORITHM                        ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  REPAIRABILITY SCORE (0-100) = Σ (Factor × Weight)                  ║
║                                                                      ║
║  Factor Weights:                                                     ║
║  ┌──────────────────────────┬────────┬──────────────────────────┐   ║
║  │ Factor                   │ Weight │ Description               │   ║
║  ├──────────────────────────┼────────┼──────────────────────────┤   ║
║  │ Component Accessibility  │ 0.25   │ Can it be opened/replaced?│   ║
║  │ Part Availability        │ 0.20   │ Are parts available?      │   ║
║  │ Repair Cost Ratio        │ 0.20   │ Cost vs. replacement value│   ║
║  │ Damaged Component Count  │ 0.15   │ How many need repair?     │   ║
║  │ Component Modularity     │ 0.10   │ Soldered vs. socketed?    │   ║
║  │ Documentation Available  │ 0.10   │ iFixit teardown exists?   │   ║
║  └──────────────────────────┴────────┴──────────────────────────┘   ║
║                                                                      ║
║  SCORING LOGIC:                                                      ║
║                                                                      ║
║  1. Component Accessibility (0-100):                                 ║
║     Determined by device manufacturer/model lookup table             ║
║     ├─ Easily accessible (ThinkPad-style): 90-100                   ║
║     ├─ Standard screws: 70-89                                        ║
║     ├─ Proprietary screws: 40-69                                     ║
║     └─ Glued/soldered: 0-39                                          ║
║                                                                      ║
║  2. Part Availability (0-100):                                       ║
║     Based on device age and popularity                               ║
║     ├─ Common model, < 3 years: 90-100                              ║
║     ├─ Common model, 3-5 years: 60-89                               ║
║     ├─ Rare model or > 5 years: 30-59                               ║
║     └─ Discontinued/unavailable: 0-29                                ║
║                                                                      ║
║  3. Repair Cost Ratio (0-100):                                       ║
║     ratio = estimated_repair_cost / new_device_cost                  ║
║     ├─ ratio < 0.15: score = 90-100 (very affordable)              ║
║     ├─ ratio 0.15-0.30: score = 70-89                               ║
║     ├─ ratio 0.30-0.50: score = 40-69                               ║
║     └─ ratio > 0.50: score = 0-39 (not worth repairing)            ║
║                                                                      ║
║  4. Damaged Component Count (0-100):                                 ║
║     ├─ 0-1 damaged: 90-100                                          ║
║     ├─ 2-3 damaged: 60-89                                           ║
║     ├─ 4-5 damaged: 30-59                                           ║
║     └─ 6+ damaged: 0-29                                             ║
║                                                                      ║
║  5. Component Modularity (0-100):                                    ║
║     ├─ All modular (upgradeable RAM, M.2 SSD): 90-100              ║
║     ├─ Partially modular: 50-89                                     ║
║     └─ Fully soldered (ultrabooks): 0-49                            ║
║                                                                      ║
║  6. Documentation Available (0-100):                                 ║
║     ├─ Official service manual + iFixit: 90-100                     ║
║     ├─ Community guides available: 50-89                            ║
║     └─ No documentation: 0-49                                       ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 23. CARBON SAVING ALGORITHM

### Objective
Quantify the environmental impact of repair/reuse vs. disposal decisions.

### Algorithm

```
╔══════════════════════════════════════════════════════════════════════╗
║                   CARBON SAVING ALGORITHM                            ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  CONSTANTS (based on industry research):                             ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ MANUFACTURING_CO2_KG = 350          # kg CO2 per laptop   │     ║
║  │ ANNUAL_USE_CO2_KG = 50              # kg CO2 per year use │     ║
║  │ RECYCLING_CO2_KG = 30               # kg CO2 to recycle   │     ║
║  │ REPAIR_CO2_KG = 15                  # kg CO2 for repair   │     ║
║  │ E_WASTE_TOXIN_KG = 0.5             # kg toxic per laptop  │     ║
║  │ WATER_LITERS_PER_LAPTOP = 190000   # liters in mfg       │     ║
║  │ RARE_EARTH_GRAMS = 30              # grams per laptop     │     ║
║  │ TREE_CO2_KG_PER_YEAR = 22          # kg CO2 absorbed/tree │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  CARBON SAVINGS CALCULATION:                                         ║
║  ═══════════════════════════                                         ║
║                                                                      ║
║  if recommendation == REPAIR or REFURBISH:                           ║
║     extended_life_years = predicted_RUL_days / 365                   ║
║     co2_saved = MANUFACTURING_CO2_KG - REPAIR_CO2_KG                ║
║               - (ANNUAL_USE_CO2_KG × extended_life_years)            ║
║     water_saved = WATER_LITERS_PER_LAPTOP × 0.9                     ║
║     waste_prevented_kg = device_weight_kg                            ║
║                                                                      ║
║  if recommendation == REUSE:                                         ║
║     co2_saved = MANUFACTURING_CO2_KG                                 ║
║     water_saved = WATER_LITERS_PER_LAPTOP                            ║
║     waste_prevented_kg = device_weight_kg                            ║
║                                                                      ║
║  if recommendation == RECYCLE:                                       ║
║     co2_saved = MANUFACTURING_CO2_KG × 0.2   # material recovery    ║
║               - RECYCLING_CO2_KG                                     ║
║     rare_earth_recovered = RARE_EARTH_GRAMS                         ║
║     toxins_prevented = E_WASTE_TOXIN_KG                              ║
║                                                                      ║
║  DERIVED METRICS:                                                    ║
║  trees_equivalent = co2_saved / TREE_CO2_KG_PER_YEAR                ║
║  energy_saved_kwh = co2_saved × 2.3  # average grid factor          ║
║  car_miles_equivalent = co2_saved / 0.411  # kg CO2 per mile        ║
║                                                                      ║
║  EXAMPLE OUTPUT:                                                     ║
║  ┌─────────────────────────────────────────────────────────────┐    ║
║  │ By repairing this laptop instead of replacing it:            │    ║
║  │                                                              │    ║
║  │  🌍 CO2 Saved:        335 kg                                │    ║
║  │  🌳 Trees Equivalent: 15.2 trees for one year               │    ║
║  │  💧 Water Saved:      171,000 liters                        │    ║
║  │  ⚡ Energy Saved:     770.5 kWh                             │    ║
║  │  🚗 Like NOT driving: 815 miles                             │    ║
║  │  ♻️  E-waste prevented: 2.1 kg                              │    ║
║  └─────────────────────────────────────────────────────────────┘    ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 24. REMAINING LIFE ESTIMATION LOGIC

### Objective
Predict the remaining useful life (RUL) of a laptop and its critical components.

### Algorithm

```
╔══════════════════════════════════════════════════════════════════════╗
║              REMAINING USEFUL LIFE (RUL) ESTIMATION                  ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  APPROACH: Hybrid ML + Heuristic                                    ║
║                                                                      ║
║  ML Model (Primary):                                                 ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │ Model: LightGBM Regressor                                 │     ║
║  │ Target: days_remaining (continuous)                        │     ║
║  │                                                            │     ║
║  │ Features per component:                                    │     ║
║  │ ├─ current_health_score                                   │     ║
║  │ ├─ degradation_rate (score change per time)               │     ║
║  │ ├─ usage_hours_per_day                                    │     ║
║  │ ├─ power_on_hours_total                                   │     ║
║  │ ├─ age_days                                               │     ║
║  │ ├─ component_specific_metrics                             │     ║
║  │ └─ environmental_factors                                  │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  Heuristic Fallback (when insufficient data):                       ║
║  ┌────────────────────────────────────────────────────────────┐     ║
║  │                                                            │     ║
║  │  BATTERY RUL:                                              │     ║
║  │  max_cycles = 1000 (typical)                               │     ║
║  │  remaining_cycles = max_cycles - current_cycle_count       │     ║
║  │  cycles_per_day = avg_cycles_per_day (from usage pattern)  │     ║
║  │  rul_days = remaining_cycles / cycles_per_day              │     ║
║  │  Adjusted by: health_pct degradation curve                 │     ║
║  │                                                            │     ║
║  │  STORAGE RUL:                                              │     ║
║  │  For SSD: Based on TBW (Total Bytes Written) vs rated TBW │     ║
║  │  For HDD: Based on SMART predictive failure flag,          │     ║
║  │           reallocated sectors trend, power-on hours         │     ║
║  │  rul_days = (rated_tbw - current_tbw) / daily_write_rate  │     ║
║  │                                                            │     ║
║  │  CPU/GPU RUL:                                              │     ║
║  │  Based on thermal throttling frequency,                    │     ║
║  │  benchmark degradation, and typical lifespan curves        │     ║
║  │  rul_days = typical_lifespan - age_days                    │     ║
║  │  Adjusted by: thermal_factor × usage_intensity_factor      │     ║
║  │                                                            │     ║
║  │  DISPLAY/KEYBOARD/OTHER:                                   │     ║
║  │  Based on current functional status and age                │     ║
║  │  If functional: rul = max(typical_lifespan - age, 0)      │     ║
║  │  If degraded: rul = estimated based on degradation rate    │     ║
║  │                                                            │     ║
║  └────────────────────────────────────────────────────────────┘     ║
║                                                                      ║
║  OVERALL DEVICE RUL:                                                 ║
║  ═══════════════════                                                 ║
║  device_rul = MIN(critical_component_ruls)                           ║
║                                                                      ║
║  Where critical components = [battery, storage, cpu, motherboard]    ║
║                                                                      ║
║  The overall device RUL is limited by the shortest-lived             ║
║  critical component (weakest link model).                            ║
║                                                                      ║
║  OUTPUT:                                                             ║
║  ┌─────────────────────────────────────────────────────────────┐    ║
║  │ Component        │ RUL (days) │ RUL (months) │ Confidence  │    ║
║  │ ─────────────────┼────────────┼──────────────┼──────────── │    ║
║  │ Battery          │ 245        │ 8.2          │ 0.82        │    ║
║  │ SSD              │ 1,460      │ 48.7         │ 0.91        │    ║
║  │ CPU              │ 1,825      │ 60.8         │ 0.75        │    ║
║  │ ─────────────────┼────────────┼──────────────┼──────────── │    ║
║  │ OVERALL DEVICE   │ 245        │ 8.2          │ 0.78        │    ║
║  │ (limited by battery)                                       │    ║
║  └─────────────────────────────────────────────────────────────┘    ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 25. MARKETPLACE WORKFLOW (Design Only)

### Workflow

```
╔══════════════════════════════════════════════════════════════════╗
║                  MARKETPLACE WORKFLOW                             ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  SELLER FLOW:                                                    ║
║  ┌───────────┐    ┌──────────────┐    ┌──────────────────┐     ║
║  │ Complete  │───►│ Auto-populate│───►│ Set Price        │     ║
║  │ Device    │    │ Listing from │    │ (AI-suggested    │     ║
║  │ Scan      │    │ Scan Results │    │  based on health)│     ║
║  └───────────┘    └──────────────┘    └────────┬─────────┘     ║
║                                                 │               ║
║                                                 ▼               ║
║                                       ┌──────────────────┐     ║
║                                       │ Attach Digital   │     ║
║                                       │ Device Passport  │     ║
║                                       │ (trust badge)    │     ║
║                                       └────────┬─────────┘     ║
║                                                 │               ║
║                                                 ▼               ║
║                                       ┌──────────────────┐     ║
║                                       │ Listing Goes     │     ║
║                                       │ Live             │     ║
║                                       └──────────────────┘     ║
║                                                                  ║
║  BUYER FLOW:                                                     ║
║  ┌───────────┐    ┌──────────────┐    ┌──────────────────┐     ║
║  │ Browse    │───►│ View Health  │───►│ Verify Digital   │     ║
║  │ Listings  │    │ Score &      │    │ Passport via     │     ║
║  │           │    │ Details      │    │ QR Code          │     ║
║  └───────────┘    └──────────────┘    └────────┬─────────┘     ║
║                                                 │               ║
║                                                 ▼               ║
║                                       ┌──────────────────┐     ║
║                                       │ Contact Seller   │     ║
║                                       │ / Purchase       │     ║
║                                       └──────────────────┘     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 26. DIGITAL DEVICE PASSPORT WORKFLOW

### Workflow

```
╔══════════════════════════════════════════════════════════════════════╗
║              DIGITAL DEVICE PASSPORT WORKFLOW                        ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  GENERATION:                                                         ║
║  ┌───────────┐    ┌──────────────┐    ┌──────────────────────┐     ║
║  │ Complete  │───►│ Compile      │───►│ Generate Passport    │     ║
║  │ First     │    │ Device       │    │                      │     ║
║  │ Scan      │    │ Profile      │    │ • Unique Passport ID │     ║
║  └───────────┘    └──────────────┘    │ • QR Code            │     ║
║                                       │ • Device specs       │     ║
║                                       │ • Health history     │     ║
║                                       │ • Scan timeline      │     ║
║                                       │ • Recommendation log │     ║
║                                       │ • Carbon impact      │     ║
║                                       │ • Ownership history  │     ║
║                                       │ • Repair records     │     ║
║                                       └──────────┬───────────┘     ║
║                                                   │                  ║
║  UPDATE (on each subsequent scan):                │                  ║
║  ┌───────────┐    ┌──────────────┐                ▼                  ║
║  │ New Scan  │───►│ Append to    │───►  ┌──────────────────┐        ║
║  │ Completed │    │ History      │      │ Updated Passport │        ║
║  └───────────┘    └──────────────┘      └──────────────────┘        ║
║                                                                      ║
║  VERIFICATION:                                                       ║
║  ┌───────────┐    ┌──────────────┐    ┌──────────────────────┐     ║
║  │ Scan QR   │───►│ Public       │───►│ View Verified       │     ║
║  │ Code      │    │ Verification │    │ Device History      │     ║
║  └───────────┘    │ Endpoint     │    │ (read-only)         │     ║
║                   └──────────────┘    └──────────────────────┘     ║
║                                                                      ║
║  PASSPORT DATA STRUCTURE:                                            ║
║  {                                                                   ║
║    "passport_number": "RL-2025-XXXX-XXXX",                         ║
║    "device": { "serial", "model", "manufacturer" },                 ║
║    "current_health": { "score": 78, "grade": "B+" },               ║
║    "scan_history": [                                                 ║
║      { "date": "2025-01-15", "score": 85, "grade": "A" },          ║
║      { "date": "2025-07-10", "score": 78, "grade": "B+" }          ║
║    ],                                                                ║
║    "components": { ... per-component health ... },                   ║
║    "recommendations": [ ... ],                                       ║
║    "carbon_impact": { "total_co2_saved": 335 },                    ║
║    "repair_history": [ ... ],                                        ║
║    "verified": true,                                                 ║
║    "issued_at": "2025-01-15T10:00:00Z",                            ║
║    "last_updated": "2025-07-10T14:30:00Z"                          ║
║  }                                                                   ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 27. AUTHENTICATION WORKFLOW

### Workflow

```
╔══════════════════════════════════════════════════════════════════╗
║                AUTHENTICATION WORKFLOW                           ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  REGISTRATION:                                                   ║
║  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─────────────┐ ║
║  │ User     │──►│ Validate │──►│ Hash     │──►│ Create User │ ║
║  │ Sign Up  │   │ Email &  │   │ Password │   │ in DB       │ ║
║  │ Form     │   │ Password │   │ (bcrypt) │   │ Return JWT  │ ║
║  └──────────┘   └──────────┘   └──────────┘   └─────────────┘ ║
║                                                                  ║
║  LOGIN:                                                          ║
║  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─────────────┐ ║
║  │ User     │──►│ Verify   │──►│ Generate │──►│ Return      │ ║
║  │ Login    │   │ Creds    │   │ JWT Pair │   │ Access +    │ ║
║  │ Form     │   │ (bcrypt) │   │ (RS256)  │   │ Refresh     │ ║
║  └──────────┘   └──────────┘   └──────────┘   └─────────────┘ ║
║                                                                  ║
║  TOKEN STRUCTURE:                                                ║
║  ┌──────────────────────────────────────────────────────────┐  ║
║  │ Access Token (15 min expiry):                            │  ║
║  │ {                                                        │  ║
║  │   "sub": "user_uuid",                                    │  ║
║  │   "email": "user@example.com",                           │  ║
║  │   "role": "user",                                        │  ║
║  │   "org_id": "org_uuid",                                  │  ║
║  │   "exp": 1735689600,                                     │  ║
║  │   "iat": 1735688700                                      │  ║
║  │ }                                                        │  ║
║  │                                                          │  ║
║  │ Refresh Token (7 day expiry):                            │  ║
║  │ { "sub": "user_uuid", "type": "refresh", "exp": ... }   │  ║
║  └──────────────────────────────────────────────────────────┘  ║
║                                                                  ║
║  PROTECTED ROUTE ACCESS:                                         ║
║  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─────────────┐ ║
║  │ API      │──►│ Extract  │──►│ Validate │──►│ Inject User │ ║
║  │ Request  │   │ Bearer   │   │ JWT &    │   │ into Request│ ║
║  │ + Token  │   │ Token    │   │ Check    │   │ Context     │ ║
║  └──────────┘   └──────────┘   │ Expiry   │   └─────────────┘ ║
║                                 │ + Role   │                    ║
║                                 └──────────┘                    ║
║                                                                  ║
║  ROLE-BASED ACCESS:                                              ║
║  ┌────────────┬──────────────────────────────────────────────┐  ║
║  │ Role       │ Permissions                                  │  ║
║  ├────────────┼──────────────────────────────────────────────┤  ║
║  │ user       │ Own devices, scans, reports                  │  ║
║  │ technician │ All user + shared devices in org             │  ║
║  │ admin      │ All tech + user mgmt, analytics, org config  │  ║
║  │ super_admin│ All admin + system config, all orgs          │  ║
║  └────────────┴──────────────────────────────────────────────┘  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```
