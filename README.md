# 🛡️ Threat2Risk AI Engine

> **From Security Alerts to Explainable Risk Intelligence**  
> *Investigate · Correlate · Understand · Quantify · Act*

---

## 📌 Executive Summary

**Threat2Risk AI** is an enterprise-grade AI/ML cybersecurity investigation and business risk intelligence platform. It bridges the critical gap between technical security alerts (SIEM, EDR, Firewall) and executive-level business risk decisions.

By transforming raw security telemetry into correlated attack stories, graph-based blast radius maps, and financial risk scores, Threat2Risk AI empowers SOC analysts, CISOs, and risk teams to respond faster and mitigate business impact effectively.

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  RAW SECURITY LOGS     │ ───► │      ATTACK STORY      │ ───► │     BUSINESS RISK      │ ───► │  REMEDIATION & ACTION  │
│  SIEM / EDR / Network  │      │ Correlation & MITRE    │      │ Financial Loss & SLA   │      │ What-If Control Sims   │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

---

## 💻 Tech Stack

### 🚀 Frontend (SOC Command Center UI)
* **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Cyberpunk / Dark SOC Design System
* **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid state transitions & cyber boot sequences
* **Data Visualization**: [Recharts](https://recharts.org/) for risk trend graphs, radar charts, & severity distributions
* **Icons**: [Lucide React](https://lucide.dev/)
* **Document Generation**: Custom client-side PDF Executive Report Generator (`jspdf` / canvas integration)

### ⚙️ Backend (AI Engine & API)
* **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
* **Server**: [Uvicorn](https://www.uvicorn.org/) (ASGI Server)
* **Machine Learning**: [Scikit-Learn](https://scikit-learn.org/) + `joblib` (Trained Threat-to-Risk Scoring Model)
* **Graph Modeling**: [NetworkX](https://networkx.org/) for dynamic Attack Graph construction & Blast Radius calculation
* **Data Validation**: [Pydantic v2](https://docs.pydantic.dev/) for strict payload contracts
* **Testing**: [Pytest](https://docs.pytest.org/) for engine unit tests

---

## ✨ Key Features & Capabilities

* 🎯 **SOC Command Center Dashboard**: Real-time operational overview with live risk scores, incident queues, and asset vulnerability breakdown.
* 🕸️ **Interactive Attack Graph Canvas**: Visual representation of lateral movement, compromised nodes, entry vectors, and blast radius propagation.
* 🤖 **AI Investigation Assistant**: Natural language cyber analyst engine providing grounded evidence citations and contextual Q&A.
* 📊 **Explainable Risk Intelligence**: Translates technical vulnerabilities into estimated financial loss ($ USD), operational disruption hours, and SLA breach probability.
* 🛡️ **MITRE ATT&CK Framework Mapping**: Auto-maps telemetry events to MITRE tactics (Initial Access, Privilege Escalation, Exfiltration) and techniques.
* 📋 **GRC & What-If Simulation**: Simulates the risk reduction impact of deploying controls like DB DLP, Network Microsegmentation, and Enforcement of MFA.
* 🔐 **Secure Analyst Access**: Analyst registration and authentication system with persistent local identity verification.

---

## 📁 Repository Structure

```
threat2risk-ai/
├── backend/                       # Python FastAPI Backend
│   ├── app/
│   │   ├── api/                   # REST API routes (/api/incidents, /api/ai/chat, etc.)
│   │   ├── engines/               # Core Intelligence Engines
│   │   │   ├── ai/                # AI Investigation Assistant
│   │   │   ├── correlation/       # Event correlation & normalization
│   │   │   ├── grc/               # GRC control gap analyzer
│   │   │   ├── ingestion/         # Log ingestion & parser
│   │   │   ├── investigation/     # NetworkX Attack Graph & Blast Radius
│   │   │   ├── mitre/             # MITRE ATT&CK mapper
│   │   │   ├── ml/                # Scikit-Learn trained risk model (.joblib)
│   │   │   ├── recommendations/   # Remediation playbook generator
│   │   │   └── risk/              # Financial loss & explainable risk engine
│   │   ├── ledger/                # Cryptographic evidence ledger
│   │   ├── schemas/               # Pydantic data schemas
│   │   └── main.py                # FastAPI Application Entrypoint
│   ├── tests/                     # Unit tests
│   ├── Procfile                   # Deployment configuration (Railway/Heroku)
│   └── requirements.txt           # Python dependencies
│
├── frontend/                      # Next.js 14 Frontend UI
│   ├── src/
│   │   ├── app/                   # App Router pages (Dashboard, Incidents, AI, Risk, GRC)
│   │   ├── components/            # UI components, Layouts, & Cyber Backgrounds
│   │   ├── data/                  # Analyst database & simulation datasets
│   │   ├── hooks/                 # Custom React hooks & audio effects
│   │   ├── lib/                   # API client integrations
│   │   └── types/                 # TypeScript type declarations
│   ├── package.json               # Node.js dependencies & scripts
│   └── tailwind.config.js         # Custom cyber color theme & utility classes
│
├── data/                          # Sample golden scenario telemetry logs
├── .gitignore                     # Git exclusion settings
└── README.md                      # Project documentation
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
* **Python**: `3.10` or higher
* **Node.js**: `18.0` or higher
* **npm**: `9.0` or higher

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/threat2risk-ai.git
cd threat2risk-ai
```

### 2️⃣ Start the Backend API (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
> The API will be live at `http://localhost:8000`. API Documentation is available at `http://localhost:8000/docs`.

### 3️⃣ Start the Frontend App (Next.js)
Open a new terminal window:
```bash
cd threat2risk-ai/frontend
npm install
npm run dev
```
> The SOC Command Center will be live at **`http://localhost:4000`**.

---

## ☁️ Cloud Deployment (Railway.com)

This repository is optimized for 1-click deployment on **[Railway.com](https://railway.com)**:

1. **Push to GitHub**: Push this repository to your GitHub account.
2. **Deploy Backend**:
   - Create a new project on Railway from GitHub repo.
   - Set Root Directory to `/backend`.
   - Railway auto-detects Python and executes the `Procfile` (`uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
3. **Deploy Frontend**:
   - Add a second service from the same repo.
   - Set Root Directory to `/frontend`.
   - Set Environment Variable: `NEXT_PUBLIC_API_URL` = `https://<your-backend-railway-url>.up.railway.app/api`.
   - Railway builds (`npm run build`) and serves Next.js on `$PORT`.

---

## 📜 License

This project is licensed under the **MIT License**.
