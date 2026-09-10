<div align="center">

# 🛡️ HSE Safety Intelligence & SIF-Guard Platform

**Next-Generation Health, Safety & Environment (HSE) Intelligence Platform with Automated SIF Precursor Detection, Barrier Degradation Analytics & IOGP Life-Saving Rules Compliance**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-lightgrey.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748.svg?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

[Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Tech Stack](#-technology-stack)

</div>

---

## 📌 Overview

The **HSE Safety Intelligence Platform** is an enterprise-grade safety platform designed for high-risk industrial environments (Oil & Gas, Construction, Energy, Manufacturing, Heavy Logistics). It converts unstructured safety event descriptions, near misses, and hazard observations into structured, actionable safety intelligence.

### The Core Problem Solved
Traditional safety reporting relies on lagging indicators (recordable injury rates) that fail to prevent catastrophic events. The HSE Safety Intelligence Platform introduces a proactive paradigm:
- **SIF Precursor Identification**: Detects low-consequence events with high potential for Serious Injuries or Fatalities (SIF).
- **Barrier Degradation Analysis**: Evaluates control failures across critical physical and administrative barriers.
- **IOGP Life-Saving Rules Mapping**: Automatically correlates events with international safety rules (IOGP LSR).
- **Executive Command Center**: Delivers real-time risk heatmaps, hazard frequencies, facility analytics, and pattern recognition.

---

## ✨ Key Features

### 1. 📊 Executive HSE Command Center (Dashboard)
- **Real-Time KPIs**: Track Total Reports, SIF Potential Rate, High-Risk Volume, Queue Backlog, and Corrective Action Status.
- **Dynamic SIF Donut Visualization**: SVG-based proportion analysis of evaluated SIF precursors vs. non-SIF events.
- **Risk Distribution Heatmap**: Color-coded breakdown across Critical, High, Medium, and Low risk tiers.
- **Safety Reports Trend Timeline**: Interactive multi-series timeline tracking reporting volume and SIF precursor trends over time.
- **Hazard & LSR Frequency Meters**: Dual-layer progress bars identifying top exposures (e.g., Working at Height, Energy Isolation, Confined Space).
- **Site & Facility Analytics**: Compare performance across operational sites with SIF ratio overlays.
- **Live AI Safety Signals**: Real-time contextual alerts and recommended preventive actions.

### 2. 🤖 AI-Powered SIF Analysis Engine
- Converts narrative field descriptions into structured JSON intelligence:
  $$\text{Safety Report Narrative} \xrightarrow{\quad\text{AI Reasoning Engine}\quad} \begin{cases} \text{SIF Potential (Yes/No + Confidence Score)} \\ \text{Risk Level (Low / Medium / High / Critical)} \\ \text{Primary Hazards \& Exposure Vectors} \\ \text{Control Failures \& Barrier Degradation} \\ \text{IOGP Life-Saving Rules Alignment} \\ \text{Potential Consequences \& Reasoning Explanation} \end{cases}$$
- Provides transparent, auditable explanations for safety officers.

### 3. 📝 End-to-End Safety Report Lifecycle
- **Submit Safety Report Form**: Dynamic input validation for site, department, activity, contractor type, work phase, and event date.
- **Report Audit Register**: Paginated audit table with multi-dimensional filtering (Site, Department, Activity, Date Range, Risk, SIF).
- **Lifecycle Timeline**: Complete status tracking (`PENDING` $\rightarrow$ `ANALYZING` $\rightarrow$ `ANALYZED` / `FAILED`).
- **Interactive Inspection**: Detailed view of original field narrative alongside the latest versioned AI analysis.

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React 19 + Vite)                │
│   Dashboard UI • Safety Reports • SIF Intelligence • Patterns  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP / JSON (Port 5173 ➔ 3000)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Backend (Node.js + Express 5)                  │
│       Controllers • Middleware (Zod Validation) • Services      │
└────────────────────────────────┬────────────────────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│        Prisma ORM 6           │       │    AI / NLP Analysis Engine   │
│   MySQL / PostgreSQL Database │       │    (FastAPI / Python Service) │
└───────────────────────────────┘       └───────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Bundler & Dev Server**: Vite 8
- **Routing**: React Router DOM 7
- **Icons**: Lucide React
- **Styling**: Vanilla Modern CSS Design System (Dark Mode, HSL Color Tokens, Glassmorphism, Micro-Animations)

### Backend
- **Runtime**: Node.js 22 LTS
- **Server Framework**: Express 5
- **ORM**: Prisma 6 (Type-safe database abstraction)
- **Validation**: Zod schema validation on requests & AI outputs
- **Development**: `ts-node-dev` with live reload

### Database
- **Primary Engines**: MySQL / PostgreSQL (Configurable via `DATABASE_URL`)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` ([Download Node.js](https://nodejs.org/))
- **Database**: Local or cloud MySQL (or PostgreSQL) instance
- **Package Manager**: `npm` (included with Node.js)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/nishit546/SIH-backend.git
cd SIH-backend
```

---

### Step 2: Configure Environment Variables

#### Backend Environment:
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/sih_backend"

# AI Service Configuration
AI_PROVIDER=mock
AI_SERVICE_URL=http://127.0.0.1:8000
AI_REQUEST_TIMEOUT_MS=10000
AI_MODEL_VERSION=sif-nlp-v2.1
```

#### Frontend Environment:
Create `frontend/.env` (or copy from `frontend/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK=false
```

---

### Step 3: Install Dependencies & Setup Database

```bash
# 1. Setup Backend
cd backend
npm install
npm run prisma:generate
npm run prisma:push    # Or npm run prisma:migrate to apply schema migrations

# 2. Setup Frontend
cd ../frontend
npm install
```

---

### Step 4: Run the Application

Open two terminal windows:

#### Terminal 1 — Backend (Port `3000`):
```bash
cd backend
npm run dev
```

#### Terminal 2 — Frontend (Port `5173`):
```bash
cd frontend
npm run dev
```

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📡 API Reference

### Safety Reports (`/api/reports`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/reports` | Submit a new safety report |
| `GET` | `/api/reports` | Get paginated safety reports list with metadata |
| `GET` | `/api/reports/:id` | Get single safety report details with latest analysis |
| `POST` | `/api/reports/:id/analyze` | Trigger AI SIF precursor and barrier evaluation |
| `DELETE` | `/api/reports/:id` | Delete a safety report and associated cascades |

### Executive Dashboard (`/api/dashboard`)

| Method | Endpoint | Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | `site`, `department`, `activity`, `from`, `to` | Key KPI metrics & action counts |
| `GET` | `/api/dashboard/sif-distribution` | `site`, `department`, `from`, `to` | SIF precursor proportion statistics |
| `GET` | `/api/dashboard/risk-distribution`| `site`, `department`, `from`, `to` | Incidents grouped by risk level |
| `GET` | `/api/dashboard/hazards` | `limit`, `site`, `from`, `to` | Top hazard frequency rankings |
| `GET` | `/api/dashboard/iogp-rules` | `limit`, `site`, `from`, `to` | IOGP Life-Saving Rules violation counts |
| `GET` | `/api/dashboard/sites` | `from`, `to` | Facility-level report and SIF metrics |
| `GET` | `/api/dashboard/trends` | `period` (`daily`\|`weekly`\|`monthly`) | Incident & SIF precursor timeline |

---

## 📂 Project Structure

```
SIH-backend/
├── .env.example                     # Root environment configuration template
├── .gitignore                       # Git ignore patterns
├── CHANGELOG.md                     # Versioning history & release notes
├── CODE_OF_CONDUCT.md               # Contributor Covenant Code of Conduct
├── CONTRIBUTING.md                  # Development and contribution guidelines
├── LICENSE                          # MIT License
├── README.md                        # Platform documentation (this file)
├── SECURITY.md                      # Vulnerability reporting & security policy
│
├── backend/                         # Node.js + Express Backend
│   ├── prisma/
│   │   └── schema.prisma            # Prisma schema models & enums
│   ├── src/
│   │   ├── config/                  # Database & AI engine config
│   │   ├── controllers/             # Express request controllers
│   │   ├── middleware/              # Zod validation & error middleware
│   │   ├── routes/                  # REST route definitions
│   │   ├── services/                # Business logic & AI orchestration
│   │   ├── types/                   # TypeScript interfaces & DTOs
│   │   ├── utils/                   # Custom error classes & helpers
│   │   ├── validators/              # Zod validation schemas
│   │   ├── app.ts                   # Express application setup
│   │   └── server.ts                # Server bootstrap entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                        # React 19 + Vite Frontend
    ├── src/
    │   ├── api/                     # Centralized API Client (apiClient.ts)
    │   ├── components/              # Modular UI Component Library
    │   │   ├── analysis/            # SIF badges, barrier breakdown, tags
    │   │   ├── common/              # Skeletons, ErrorState, EmptyState, RiskBadge
    │   │   ├── dashboard/           # KPI cards, charts, donut, tables, insights
    │   │   ├── layout/              # Navbar, Sidebar, PageContainer
    │   │   └── reports/             # Submit form, audit filters, report table
    │   ├── pages/                   # Application Screen Pages
    │   │   ├── DashboardPage.tsx    # Command Center
    │   │   ├── SubmitReportPage.tsx # Report Intake
    │   │   ├── ReportsListPage.tsx  # Audit Register
    │   │   ├── ReportDetailPage.tsx # Lifecycle View
    │   │   ├── AnalysisResultPage.tsx# SIF Intelligence Screen
    │   │   └── PatternsPage.tsx     # Emerging Patterns
    │   ├── services/                # Frontend API Service Layer
    │   ├── types/                   # TypeScript Domain Models
    │   ├── App.tsx                  # Root Routing & Layout
    │   └── index.css                # Enterprise Dark-Theme Design System
    ├── package.json
    └── vite.config.ts
```

---

## 🔒 Security

Please review our [Security Policy](./SECURITY.md) to report any security concerns or vulnerabilities.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).