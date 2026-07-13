# ReLife AI — Complete Project Design Document
# Part 6: User Journey, UI Wireframes & Screens

---

## 28. USER JOURNEY

### Objective
Map the complete user journey from discovery to ongoing engagement.

```
╔══════════════════════════════════════════════════════════════════════════╗
║                        USER JOURNEY MAP                                  ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  PHASE 1: AWARENESS & ONBOARDING                                       ║
║  ┌─────────────────────────────────────────────────────────────────┐    ║
║  │                                                                 │    ║
║  │  1. User notices laptop is slow/degrading                       │    ║
║  │  2. Discovers ReLife AI via web/word-of-mouth                   │    ║
║  │  3. Downloads Electron app                                      │    ║
║  │  4. Creates account (email + password)                          │    ║
║  │  5. Sees onboarding tutorial (3 slides)                         │    ║
║  │     ├─ "Scan your laptop in 2 minutes"                         │    ║
║  │     ├─ "Get AI-powered health analysis"                        │    ║
║  │     └─ "Know whether to repair, reuse, or recycle"            │    ║
║  │                                                                 │    ║
║  └─────────────────────────────────────────────────────────────────┘    ║
║                                │                                         ║
║  PHASE 2: FIRST SCAN                                                    ║
║  ┌─────────────────────────────▼───────────────────────────────────┐    ║
║  │                                                                 │    ║
║  │  6. Clicks "Start My First Scan" (prominent CTA)               │    ║
║  │  7. Selects scan type: Full Scan (recommended) or Quick Scan   │    ║
║  │  8. Optional: Upload photos of physical damage                 │    ║
║  │  9. Scan begins — animated progress screen shows each step     │    ║
║  │     ├─ "Checking Battery..." ✓                                 │    ║
║  │     ├─ "Analyzing Storage..." ✓                                │    ║
║  │     ├─ "Testing Network..." ⟳ (spinning)                      │    ║
║  │     └─ ... (all 13+ components)                                │    ║
║  │  10. Scan completes (60-120 seconds for full scan)             │    ║
║  │                                                                 │    ║
║  └─────────────────────────────────────────────────────────────────┘    ║
║                                │                                         ║
║  PHASE 3: RESULTS & INSIGHTS                                            ║
║  ┌─────────────────────────────▼───────────────────────────────────┐    ║
║  │                                                                 │    ║
║  │  11. Health Score reveal (animated gauge: 0 → 78, Grade: B+)   │    ║
║  │  12. Component-by-component breakdown cards                     │    ║
║  │      ├─ Battery: 62% (⚠ Warning)                              │    ║
║  │      ├─ SSD: 95% (✓ Excellent)                                │    ║
║  │      └─ ... each with color-coded status                       │    ║
║  │  13. AI Recommendation banner: "REPAIR RECOMMENDED"            │    ║
║  │      └─ "Replace battery to extend life by ~2 years"          │    ║
║  │  14. Cost analysis: "Repair: $45-65 vs New laptop: $800+"     │    ║
║  │  15. Carbon impact: "Repairing saves 335 kg CO2 🌍"          │    ║
║  │  16. AI-generated explanation (LLM):                           │    ║
║  │      "Your laptop is in good overall condition..."             │    ║
║  │                                                                 │    ║
║  └─────────────────────────────────────────────────────────────────┘    ║
║                                │                                         ║
║  PHASE 4: ACTION                                                         ║
║  ┌─────────────────────────────▼───────────────────────────────────┐    ║
║  │                                                                 │    ║
║  │  17. User takes action based on recommendation:                 │    ║
║  │      ├─ [Find Repair Shop] → Repair shop finder page           │    ║
║  │      ├─ [List on Marketplace] → Create listing flow            │    ║
║  │      ├─ [Download Report] → PDF export                         │    ║
║  │      └─ [Generate Passport] → Digital Device Passport          │    ║
║  │  18. Optional: Share passport QR with buyer/technician         │    ║
║  │                                                                 │    ║
║  └─────────────────────────────────────────────────────────────────┘    ║
║                                │                                         ║
║  PHASE 5: ONGOING ENGAGEMENT                                            ║
║  ┌─────────────────────────────▼───────────────────────────────────┐    ║
║  │                                                                 │    ║
║  │  19. Periodic re-scan (monthly/quarterly reminders)             │    ║
║  │  20. Track health trend over time                               │    ║
║  │  21. View carbon savings cumulative dashboard                   │    ║
║  │  22. Manage multiple devices (family/fleet)                     │    ║
║  │  23. Share results & refer others                               │    ║
║  │                                                                 │    ║
║  └─────────────────────────────────────────────────────────────────┘    ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 29. UI WIREFRAMES (ASCII)

### Landing / Login Page

```
┌─────────────────────────────────────────────────────────────┐
│                        ReLife AI                             │
│              "Don't Throw It Away."                          │
│           "Know What Can Be Saved."                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │      ┌───────────────────────────────────┐          │    │
│  │      │         Email Address             │          │    │
│  │      └───────────────────────────────────┘          │    │
│  │      ┌───────────────────────────────────┐          │    │
│  │      │         Password                  │          │    │
│  │      └───────────────────────────────────┘          │    │
│  │                                                     │    │
│  │      ┌───────────────────────────────────┐          │    │
│  │      │           LOGIN                   │          │    │
│  │      └───────────────────────────────────┘          │    │
│  │                                                     │    │
│  │      Don't have an account? Sign Up                 │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  🌍 Extending laptop lifespans, reducing e-waste             │
└─────────────────────────────────────────────────────────────┘
```

### Main Dashboard

```
┌──────────────────────────────────────────────────────────────────────┐
│  ☰ ReLife AI                           🔔  👤 John Doe  ⚙️          │
├──────────┬───────────────────────────────────────────────────────────┤
│          │                                                           │
│  📊 Dash │   DASHBOARD                                              │
│          │                                                           │
│  🔍 Scan │   ┌──────────────────┐  ┌──────────────────────────┐    │
│          │   │  HEALTH SCORE    │  │  LAST SCAN               │    │
│  💻 My   │   │                  │  │                          │    │
│  Devices │   │    ┌────────┐    │  │  Device: Dell XPS 15     │    │
│          │   │    │  78    │    │  │  Date: Jul 10, 2025      │    │
│  📋 Rpts │   │    │  B+    │    │  │  Components: 17 scanned  │    │
│          │   │    └────────┘    │  │  Issues: 2 detected      │    │
│  🪪 Pass │   │  (Gauge Chart)   │  │                          │    │
│          │   └──────────────────┘  └──────────────────────────┘    │
│  🌍 CO2  │                                                           │
│          │   COMPONENT HEALTH                                        │
│  🏪 Mkt  │   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│          │   │🔋 Batt │ │💾 SSD  │ │🧠 RAM  │ │⚡ CPU  │          │
│  📊 Anlyt│   │  62%   │ │  95%   │ │  88%   │ │  91%   │          │
│          │   │  ⚠️    │ │  ✅    │ │  ✅    │ │  ✅    │          │
│  ⚙️ Admin│   └────────┘ └────────┘ └────────┘ └────────┘          │
│          │   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│  ⚙️ Set  │   │🖥 Disp │ │🎮 GPU  │ │📡 WiFi │ │⌨ Keyb  │          │
│          │   │  85%   │ │  90%   │ │  97%   │ │  100%  │          │
│          │   │  ✅    │ │  ✅    │ │  ✅    │ │  ✅    │          │
│          │   └────────┘ └────────┘ └────────┘ └────────┘          │
│          │                                                           │
│          │   AI RECOMMENDATION                                       │
│          │   ┌──────────────────────────────────────────────────┐   │
│          │   │  🔧 REPAIR RECOMMENDED                           │   │
│          │   │                                                  │   │
│          │   │  Replace battery ($45-65) to extend laptop       │   │
│          │   │  life by approximately 2 years.                  │   │
│          │   │                                                  │   │
│          │   │  🌍 Carbon Savings: 335 kg CO2                  │   │
│          │   │  💰 Repair vs Replace: Save $735+                │   │
│          │   │                                                  │   │
│          │   │  [Find Repair Shop]  [Download Report]           │   │
│          │   └──────────────────────────────────────────────────┘   │
│          │                                                           │
└──────────┴───────────────────────────────────────────────────────────┘
```

### Scan Progress Screen

```
┌──────────────────────────────────────────────────────────────────────┐
│  ☰ ReLife AI                           🔔  👤 John Doe  ⚙️          │
├──────────┬───────────────────────────────────────────────────────────┤
│          │                                                           │
│  Sidebar │   SCANNING YOUR LAPTOP                                    │
│          │                                                           │
│          │   ████████████████████░░░░░░░░░░░  65%                   │
│          │                                                           │
│          │   ┌─────────────────────────────────────────────────┐    │
│          │   │                                                 │    │
│          │   │  ✅ System Information     ........... Done     │    │
│          │   │  ✅ Battery Health         ........... Done     │    │
│          │   │  ✅ Storage (SSD)          ........... Done     │    │
│          │   │  ✅ RAM                    ........... Done     │    │
│          │   │  ✅ CPU                    ........... Done     │    │
│          │   │  ✅ GPU                    ........... Done     │    │
│          │   │  ✅ Network (WiFi)         ........... Done     │    │
│          │   │  ✅ Network (Bluetooth)    ........... Done     │    │
│          │   │  ⟳  Display               ........... Running  │    │
│          │   │  ○  Audio (Speakers)       ........... Pending  │    │
│          │   │  ○  Audio (Microphone)     ........... Pending  │    │
│          │   │  ○  Input (Keyboard)       ........... Pending  │    │
│          │   │  ○  Input (Touchpad)       ........... Pending  │    │
│          │   │  ○  Camera                 ........... Pending  │    │
│          │   │  ○  USB Ports              ........... Pending  │    │
│          │   │  ○  Cooling                ........... Pending  │    │
│          │   │  ○  Motherboard            ........... Pending  │    │
│          │   │                                                 │    │
│          │   └─────────────────────────────────────────────────┘    │
│          │                                                           │
│          │   Estimated time remaining: ~45 seconds                   │
│          │                                                           │
│          │   [Cancel Scan]                                           │
│          │                                                           │
└──────────┴───────────────────────────────────────────────────────────┘
```

### Carbon Impact Dashboard

```
┌──────────────────────────────────────────────────────────────────────┐
│  ☰ ReLife AI                           🔔  👤 John Doe  ⚙️          │
├──────────┬───────────────────────────────────────────────────────────┤
│          │                                                           │
│  Sidebar │   🌍 CARBON IMPACT DASHBOARD                              │
│          │                                                           │
│          │   YOUR ENVIRONMENTAL IMPACT                                │
│          │   ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│          │   │ 🌍         │ │ 🌳         │ │ 💧         │           │
│          │   │ 335 kg     │ │ 15.2       │ │ 171K L     │           │
│          │   │ CO2 Saved  │ │ Trees Equiv│ │ Water Saved│           │
│          │   └────────────┘ └────────────┘ └────────────┘           │
│          │   ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│          │   │ ⚡         │ │ 🚗         │ │ ♻️         │           │
│          │   │ 770 kWh    │ │ 815 mi     │ │ 2.1 kg     │           │
│          │   │ Energy Sav.│ │ Car Miles  │ │ E-waste    │           │
│          │   └────────────┘ └────────────┘ └────────────┘           │
│          │                                                           │
│          │   IMPACT OVER TIME                                        │
│          │   ┌──────────────────────────────────────────────────┐   │
│          │   │  350│          ___________                        │   │
│          │   │  300│         /                                   │   │
│          │   │  250│        /                                    │   │
│          │   │  200│   ____/                                     │   │
│          │   │  150│  /                                          │   │
│          │   │  100│ /                                           │   │
│          │   │   50│/                                            │   │
│          │   │    0└──────────────────────────────               │   │
│          │   │     Jan  Mar  May  Jul  Sep  Nov                 │   │
│          │   └──────────────────────────────────────────────────┘   │
│          │                                                           │
│          │   COMMUNITY LEADERBOARD                                   │
│          │   ┌──────────────────────────────────────────────────┐   │
│          │   │  1. GreenTech Corp     .... 12,450 kg CO2 saved │   │
│          │   │  2. EcoRepair Hub      .... 8,320 kg CO2 saved  │   │
│          │   │  3. You ⭐             .... 335 kg CO2 saved    │   │
│          │   └──────────────────────────────────────────────────┘   │
│          │                                                           │
└──────────┴───────────────────────────────────────────────────────────┘
```

### Digital Device Passport

```
┌──────────────────────────────────────────────────────────────────────┐
│  ☰ ReLife AI                           🔔  👤 John Doe  ⚙️          │
├──────────┬───────────────────────────────────────────────────────────┤
│          │                                                           │
│  Sidebar │   🪪 DIGITAL DEVICE PASSPORT                              │
│          │                                                           │
│          │   ┌──────────────────────────────────────────────────┐   │
│          │   │                                                  │   │
│          │   │  ┌──────────┐   PASSPORT: RL-2025-A8F2-9D1C    │   │
│          │   │  │          │                                    │   │
│          │   │  │  QR CODE │   Device: Dell XPS 15 9520        │   │
│          │   │  │          │   Serial: FXRT2K3                 │   │
│          │   │  │          │   Owner: John Doe                 │   │
│          │   │  └──────────┘                                    │   │
│          │   │                                                  │   │
│          │   │  CURRENT STATUS                                  │   │
│          │   │  Health: 78/100 (B+)  │  Status: Active         │   │
│          │   │  Last Scan: Jul 10, 2025                        │   │
│          │   │                                                  │   │
│          │   │  HEALTH HISTORY                                  │   │
│          │   │  ┌──────────────────────────────────────┐       │   │
│          │   │  │ Jan 2025: 85 (A)  ████████████████▌  │       │   │
│          │   │  │ Apr 2025: 82 (B+) ████████████████   │       │   │
│          │   │  │ Jul 2025: 78 (B+) ███████████████    │       │   │
│          │   │  └──────────────────────────────────────┘       │   │
│          │   │                                                  │   │
│          │   │  COMPONENT SUMMARY                               │   │
│          │   │  Battery: ⚠ 62%  │ Storage: ✅ 95%             │   │
│          │   │  RAM: ✅ 88%      │ CPU: ✅ 91%                 │   │
│          │   │                                                  │   │
│          │   │  CARBON IMPACT: 335 kg CO2 saved 🌍             │   │
│          │   │                                                  │   │
│          │   │  [Download PDF]  [Share Link]  [Print]           │   │
│          │   │                                                  │   │
│          │   └──────────────────────────────────────────────────┘   │
│          │                                                           │
└──────────┴───────────────────────────────────────────────────────────┘
```

---

## 30. DASHBOARD DESIGN

### Dashboard Components Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                   DASHBOARD DESIGN SYSTEM                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  DESIGN TOKENS:                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ Colors (Dark Mode Primary):                              │   ║
║  │ ├─ Background:  #0F172A (slate-900)                     │   ║
║  │ ├─ Surface:     #1E293B (slate-800)                     │   ║
║  │ ├─ Primary:     #10B981 (emerald-500)  // eco-green     │   ║
║  │ ├─ Secondary:   #3B82F6 (blue-500)                      │   ║
║  │ ├─ Warning:     #F59E0B (amber-500)                     │   ║
║  │ ├─ Danger:      #EF4444 (red-500)                       │   ║
║  │ ├─ Text:        #F8FAFC (slate-50)                      │   ║
║  │ └─ Muted:       #94A3B8 (slate-400)                     │   ║
║  │                                                          │   ║
║  │ Typography:                                              │   ║
║  │ ├─ Font: Inter (Google Fonts)                           │   ║
║  │ ├─ Headings: 600-700 weight                             │   ║
║  │ └─ Body: 400-500 weight                                  │   ║
║  │                                                          │   ║
║  │ Spacing: 4px base unit (Tailwind default)               │   ║
║  │ Border Radius: 12px (rounded-xl)                        │   ║
║  │ Shadows: Layered glass-morphism effect                   │   ║
║  │ Animations: Framer Motion (spring-based)                 │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  WIDGET LIBRARY:                                                 ║
║  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐      ║
║  │ ScoreGauge     │ │ ComponentCard  │ │ TrendChart     │      ║
║  │                │ │                │ │                │      ║
║  │ Animated arc   │ │ Icon + score   │ │ Line chart     │      ║
║  │ 0-100 with     │ │ + status       │ │ with gradient  │      ║
║  │ color gradient │ │ badge + detail │ │ fill area      │      ║
║  └────────────────┘ └────────────────┘ └────────────────┘      ║
║  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐      ║
║  │ CarbonWidget   │ │ RecPanel       │ │ StatusTimeline │      ║
║  │                │ │                │ │                │      ║
║  │ CO2 counter    │ │ Recommendation │ │ Scan history   │      ║
║  │ with tree      │ │ card with CTA  │ │ timeline with  │      ║
║  │ animation      │ │ buttons        │ │ score markers  │      ║
║  └────────────────┘ └────────────────┘ └────────────────┘      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 31. COMPLETE SCREEN LIST

### All Screens

| # | Screen | Route | Auth | Description |
|---|---|---|---|---|
| 1 | Landing Page | `/` | No | Marketing page with CTA |
| 2 | Login | `/login` | No | Email/password login |
| 3 | Register | `/register` | No | Account creation |
| 4 | Forgot Password | `/forgot-password` | No | Password reset request |
| 5 | Reset Password | `/reset-password/:token` | No | Set new password |
| 6 | Onboarding | `/onboarding` | Yes | 3-step intro wizard |
| 7 | Dashboard | `/dashboard` | Yes | Main health overview |
| 8 | Start Scan | `/scan` | Yes | Scan type selection |
| 9 | Scan Progress | `/scan/progress` | Yes | Real-time scan progress |
| 10 | Scan Results | `/scan/results/:scanId` | Yes | Full scan results |
| 11 | My Devices | `/devices` | Yes | Device list |
| 12 | Device Detail | `/devices/:deviceId` | Yes | Single device view |
| 13 | Component Detail | `/devices/:id/component/:type` | Yes | Deep-dive into component |
| 14 | Reports | `/reports` | Yes | Report list |
| 15 | Full Report | `/reports/:scanId` | Yes | Comprehensive report |
| 16 | PDF Export | `/reports/:scanId/pdf` | Yes | Downloadable PDF |
| 17 | Device Passport | `/passport/:deviceId` | Yes | Digital passport view |
| 18 | Passport Verify | `/passport/verify/:passportId` | No | Public passport verification |
| 19 | Carbon Dashboard | `/carbon` | Yes | Environmental impact |
| 20 | Marketplace | `/marketplace` | Yes | Parts & device marketplace |
| 21 | Create Listing | `/marketplace/create` | Yes | List a device/part |
| 22 | Listing Detail | `/marketplace/:listingId` | Yes | View listing |
| 23 | Repair Shop Finder | `/repair-shops` | Yes | Find nearby repair shops |
| 24 | Analytics | `/analytics` | Admin | Platform analytics |
| 25 | Admin Panel | `/admin` | Admin | System administration |
| 26 | User Management | `/admin/users` | Admin | Manage users |
| 27 | Device Fleet | `/admin/devices` | Admin | Fleet management |
| 28 | System Health | `/admin/system` | Admin | System monitoring |
| 29 | Audit Logs | `/admin/logs` | Admin | Activity logs |
| 30 | Settings | `/settings` | Yes | User preferences |
| 31 | Profile | `/settings/profile` | Yes | Edit profile |
| 32 | Notifications | `/settings/notifications` | Yes | Notification prefs |
| 33 | CV Upload | `/scan/cv-upload` | Yes | Upload damage photos |
| 34 | CV Results | `/scan/cv-results/:scanId` | Yes | Damage detection results |
| 35 | 404 Not Found | `/*` | No | Error page |
