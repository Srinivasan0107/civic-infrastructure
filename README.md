# Civic Infrastructure Memory & Recurring Failure Intelligence

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local%208.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org)

An AI-assisted municipal decision-support system connecting citizen complaints, photographs, dates, geospatial coordinates, permanent physical asset identifiers, field inspections, and maintenance work orders into an enduring institutional timeline.

---

## 1. Project Mission & Capabilities

Traditional municipal grievance portals discard critical institutional history as soon as an individual complaint ticket is marked resolved. When the same pothole re-emerges weeks later or a culvert repeatedly floods during monsoon rainfall, municipal teams treat each event as an isolated incident.

**Civic Infrastructure Memory** transforms civic operations by:
- **Asset-Centric Memory**: Linking all grievances and field events to **permanent physical asset identities** (`RD-0001` for road corridors, `DR-0001` for stormwater drains, `SL-0001` for streetlights, `FP-0001` for footpaths, `PT-0001` for sanitation).
- **Multilingual Semantic Intelligence**: Using multilingual BERT / E5 embeddings with cross-language candidate matching across **Kannada (ಕನ್ನಡ), Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), and English**.
- **Real-Time Duplicate & Recurrence Detection**: Detecting existing corridor defects dynamically as citizens type grievances, displaying live similarity percentages, spatial distance, and historical recurrence numbers.
- **Multimodal Image Intelligence**: Storing photographic evidence in MongoDB GridFS (`media_files`), running YOLO defect detection (RDD2022 road defect taxonomy: `D00` longitudinal crack, `D10` transverse crack, `D20` alligator crack, `D40` pothole) and DINOv2 visual embeddings.
- **Incident Clustering**: Grouping spatial-temporal reports into **recurring incident clusters** without destructively merging records across distant locations.
- **Explainable Prioritization (0–100)**: Computing transparent priority scores showing exact factor contributions (recurrence count, days since incident, severity, corridor criticality) rather than uncalibrated failure probabilities.
- **Dual-Surface Web Application**:
  - Accessible **Citizen Public Portal** with institutional branding, announcement ticker, glassmorphic buttons, grievance registration with live date-time synchronisation, and citizen grievance tracking.
  - Comprehensive **Municipal Command Center** with interactive maps, asset timelines, semantic audit ledger, photo evidence gallery, and CSV export capabilities.

---

## 2. Architecture & Tech Stack

```mermaid
flowchart TD
    Citizen[Citizen / Public] -->|Browser| Web[Vite React Frontend :5173]
    Officer[Municipal Officer] -->|Browser| Web
    Web -->|REST API| API[FastAPI Backend :8000]
    API -->|Async Motor| DB[(MongoDB Atlas Cloud / Local :27017)]
    API -->|GridFS Chunks| GridFS[GridFS: dataset_files & media_files]
    API -->|Semantic Inference| BERT[Multilingual MiniLM / E5 Model]
    API -->|Computer Vision| YOLO[YOLO RDD2022 Defect Detector]
    API -->|Visual Embeddings| DINO[DINOv2 Visual Representations]
```

### Stack Components:
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS with Glassmorphism & Claymorphism, React Router v6, TanStack Query, `react-i18next`, Lucide Icons, Recharts, MapLibre GL.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, Motor (Async PyMongo), GridFS, NumPy, Scikit-learn, Sentence Transformers, Pillow, Pandas.
- **Database**: MongoDB Atlas Cloud (`civic_memory`) or Local MongoDB 8.x via Docker Compose.
- **Supported Languages**: English (`en`), Kannada (`kn`), Hindi (`hi`), Tamil (`ta`), Telugu (`te`).

---

## 3. Repository Structure

```
civic-infrastructure/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app entry point & CORS
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic Settings
│   │   │   ├── database.py          # Motor async client & GridFS setup
│   │   │   └── logging.py           # Structured logger
│   │   ├── models/                  # Pydantic v2 schemas
│   │   │   ├── common.py            # DataStatus, Verification, GeoJSON
│   │   │   ├── assets.py            # Asset & Timeline schemas
│   │   │   ├── complaints.py        # Grievance schema with ISO UTC serializer
│   │   │   ├── semantic.py          # SemanticSearch & Match models
│   │   │   ├── clusters.py          # IncidentCluster schemas
│   │   │   ├── prioritization.py    # AssetRiskSnapshot & Components
│   │   │   ├── media.py             # Attachment, ImageDetection, VisualMatch
│   │   │   └── overview.py          # KPI & DataQuality models
│   │   ├── repositories/            # Data access layer
│   │   │   ├── base.py
│   │   │   ├── assets.py
│   │   │   ├── complaints.py
│   │   │   ├── semantic.py
│   │   │   ├── clusters.py
│   │   │   ├── prioritization.py
│   │   │   └── media.py
│   │   ├── services/                # Business logic & AI pipelines
│   │   │   ├── semantic_service.py  # BERT embedding & cosine similarity
│   │   │   ├── image_service.py     # YOLO & DINOv2 adapters
│   │   │   ├── priority_service.py  # Rule-based 0-100 scoring
│   │   │   └── report_service.py    # CSV export service
│   │   └── api/v1/routers/          # REST API endpoints
│   ├── scripts/                     # Indexing and database setup scripts
│   ├── tests/                       # Pytest unit & integration tests
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Environment configuration template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/               # KpiCard, ServiceCard
│   │   │   ├── common/              # LanguageSelector, DataStatusBadge
│   │   │   └── layout/              # PublicHeader, PublicFooter, DashboardShell
│   │   ├── pages/
│   │   │   ├── public/              # Home, Services, About, Report, Announcements
│   │   │   ├── citizen/             # ComplaintsPage, ComplaintDetailPage
│   │   │   ├── auth/                # LoginPage
│   │   │   └── dashboard/           # Overview, Map, Assets, Semantic, Photos,
│   │   │                            # Clusters, Predictive, Maintenance, Reports
│   │   ├── locales/                 # Curated translations for 5 languages
│   │   │   ├── en/translation.json  # English
│   │   │   ├── kn/translation.json  # Kannada (ಕನ್ನಡ)
│   │   │   ├── hi/translation.json  # Hindi (हिंदी)
│   │   │   ├── ta/translation.json  # Tamil (தமிழ்)
│   │   │   └── te/translation.json  # Telugu (తెలుగు)
│   │   ├── services/api/            # Typed Axios client & endpoints
│   │   ├── utils/                   # formatting.ts (Locale & Timezone normalizer)
│   │   └── routes/index.tsx         # React Router v6 definition
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
├── docker-compose.yml               # MongoDB & Backend full stack compose
└── README.md
```

---

## 4. REST API Contract (`/api/v1`)

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | `GET` | `/api/v1/health` | App & MongoDB connectivity check |
| **Overview** | `GET` | `/api/v1/overview` | Municipal operational KPIs & active counts |
| **Assets** | `GET` | `/api/v1/assets` | Filterable civic asset registry with GeoJSON coordinates |
| | `GET` | `/api/v1/assets/{id}` | Full asset profile, type, ward & attributes |
| | `GET` | `/api/v1/assets/{id}/timeline` | Chronological event memory timeline |
| | `GET` | `/api/v1/assets/{id}/risk` | Transparent 0–100 risk snapshot breakdown |
| **Complaints** | `GET` | `/api/v1/complaints` | Paginated grievance records sorted by date |
| | `POST` | `/api/v1/complaints` | Citizen complaint submission with BERT recurrence linkage |
| **Semantic** | `POST` | `/api/v1/semantic/search` | Multilingual complaint candidate discovery |
| | `GET` | `/api/v1/semantic/matches` | Reviewable similar complaint candidate pairs |
| | `POST` | `/api/v1/semantic/matches/{id}/review` | Human review: confirm/reject same problem |
| **Clusters** | `GET` | `/api/v1/clusters` | Spatial-temporal incident clusters |
| | `POST` | `/api/v1/clusters/{id}/review` | Cluster merge, split, or confirmation |
| **Prioritization**| `GET` | `/api/v1/prioritization` | Ranked asset inspection queue with explainable factors |
| **Media** | `POST` | `/api/v1/media/attachments` | Multipart photograph upload to GridFS bucket |
| | `GET` | `/api/v1/media/attachments/{id}/analysis` | YOLO defect detections & DINOv2 embeddings |
| | `GET` | `/api/v1/media/attachments/{id}/stream` | Streaming media access from GridFS |
| **Visual** | `GET` | `/api/v1/visual/matches` | Historical photo comparison candidates |
| | `POST` | `/api/v1/visual/matches/{id}/review` | Photo recurrence verification |
| **Reports** | `GET` | `/api/v1/reports/export` | Downloadable CSV ledgers (assets, complaints, audits) |
| **Announcements**| `GET` | `/api/v1/announcements` | Public notices & infrastructure advisories |

---

## 5. Quickstart & Installation Instructions

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & `npm`
- **MongoDB** (MongoDB Atlas Cloud connection or local MongoDB 8.x)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Srinivasan0107/civic-infrastructure.git
cd civic-infrastructure
```

---

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in the root (or `backend/.env`):
```bash
cp .env.example backend/.env
```
Set your MongoDB connection URI (e.g., MongoDB Atlas Cloud or local):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=civic_memory
```

---

### Step 3: Run the Backend (Terminal 1)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API will be live at: **http://127.0.0.1:8000**
- Interactive Swagger Documentation: **http://127.0.0.1:8000/docs**

---

### Step 4: Run the Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
- Web Application will be live at: **http://localhost:5173**

---

### Step 5 (Alternative): Run Combined Frontend + Backend (Single Port)
You can run both the React frontend and FastAPI backend under a single unified server on port `8000`:
```bash
# Option A: Python build script
python build.py
cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# Option B: Node / npm scripts
npm run build
npm start
```
- Unified Application & Portal: **http://127.0.0.1:8000**
- API Endpoints: **http://127.0.0.1:8000/api/v1**
- Interactive Swagger Documentation: **http://127.0.0.1:8000/docs**

---

### Step 6: Run Automated Tests
```bash
# Backend pytest suite
python -m pytest backend/tests -o asyncio_mode=auto

# Frontend TypeScript compilation & production build
cd frontend
npm run build
```

---

## 6. Cloud Deployment Guide (Render & Vercel)

### A. Deploy Backend to Render (FastAPI)
1. Go to **[Render Dashboard](https://dashboard.render.com/)** and click **New +** &rarr; **Web Service**.
2. Connect your repository: `Srinivasan0107/civic-infrastructure`.
3. Configure the service settings:
   - **Name**: `civic-infrastructure-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Region**: Any (e.g. `Oregon (US West)` or `Singapore`)
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables** in Render:
   - `MONGODB_URI`: `mongodb+srv://Civic:SAI2006@cluster0.fr0tkwo.mongodb.net/?retryWrites=true&w=majority`
   - `MONGODB_DATABASE`: `civic_memory`
   - `PYTHON_VERSION`: `3.11.9`
   - `APP_ENV`: `production`
5. Click **Create Web Service**. Your API will be live at `https://civic-infrastructure-backend.onrender.com`.

---

### B. Deploy Frontend to Vercel (React + Vite)
1. Go to **[Vercel Dashboard](https://vercel.com/new)** and click **Add New...** &rarr; **Project**.
2. Import the `Srinivasan0107/civic-infrastructure` GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable** in Vercel:
   - `VITE_API_BASE_URL`: `https://civic-infrastructure-backend.onrender.com/api/v1` *(Replace with your actual Render URL)*
5. Click **Deploy**. Vercel will build the React application and deploy it with automatic SPA route rewrites configured via `vercel.json`.

---

## 7. Truthfulness, Privacy & Provenance Guarantees

- **No Artificial Live Data**: All demo records are explicitly tagged with `verification.status = "synthetic_demo"`.
- **Candidate Evidence Only**: Neither semantic text similarity nor DINOv2 image similarity automatically merges assets; they are presented as candidates for human engineer review.
- **Explainable Scores**: Priority scores represent weighted rule components (`0–100`) and are never misrepresented as calibrated failure probabilities.
- **Privacy Controls**: Personal complainant details are excluded from operational dashboards; media uploads strip sensitive EXIF data on output streams.

---

## 8. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
