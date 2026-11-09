# 🎓 EduVault — Educational Achievement & Certificate Portfolio

A full-stack web application designed to store, organize, verify, and showcase your educational achievements, academic degrees, diplomas, semester results/marksheets, and professional certifications with attached verifiable documents (PDF, PNG, JPG, SVG).

---

## 🌐 Live Running Application

- **Frontend Web App**: **[http://localhost:5173](http://localhost:5173)** *(or [http://127.0.0.1:5173](http://127.0.0.1:5173))*
- **Backend API & Production App**: **[http://localhost:5001](http://localhost:5001)** *(or [http://127.0.0.1:5001](http://127.0.0.1:5001))*
- **API Status Endpoint**: **[http://localhost:5001/api/stats](http://localhost:5001/api/stats)**

---

## 📁 Clean Separated Folder Structure (`backend` & `frontend`)

```
protfolio/
├── package.json                         # Root runner orchestrating backend & frontend
├── README.md                            # Documentation
│
├── backend/                             # 📦 BACKEND FOLDER (Node.js + Express)
│   ├── package.json                     # Backend dependencies (express, cors, multer, uuid)
│   ├── server.js                        # Express server entry point & static routes
│   ├── config/
│   │   └── constants.js                 # Config constants & port settings
│   ├── controllers/
│   │   └── achievementController.js     # Business logic for achievements & stats
│   ├── middlewares/
│   │   └── upload.js                    # Multer upload engine (PDF, PNG, JPG, SVG)
│   ├── models/
│   │   └── db.js                        # Persistent JSON storage database layer
│   ├── routes/
│   │   └── achievementRoutes.js         # API route endpoints
│   ├── data/
│   │   └── achievements.json            # Auto-saved achievement records
│   └── uploads/                         # Storage directory for uploaded documents
│
└── frontend/                            # 🎨 FRONTEND FOLDER (React 19 + Vite + Tailwind CSS)
    ├── package.json                     # Frontend dependencies
    ├── vite.config.js                   # Vite config with proxy to backend port 5001
    ├── index.html                       # HTML5 entry with fonts & meta
    └── src/
        ├── main.jsx                     # React DOM entry
        ├── App.jsx                      # Main dashboard, search & filter coordinator
        ├── index.css                    # Tailwind CSS styling
        ├── services/
        │   └── api.js                   # API wrapper for backend endpoints
        └── components/
            ├── Navbar.jsx               # Header bar & public view toggle
            ├── StatsOverview.jsx        # Analytics cards & verification KPIs
            ├── AchievementCard.jsx      # Card display with document thumbnail preview
            ├── AchievementModal.jsx     # Upload / edit form modal with file drag & drop
            ├── DocumentViewerModal.jsx  # Full-screen certificate & PDF preview lightbox
            ├── DeleteConfirmModal.jsx   # Deletion confirmation modal
            └── PublicPortfolioView.jsx  # Shareable showcase & printable resume view
```

---

## 🛠️ How to Run

### Method 1: Run Both Together from Root
```bash
npm run dev
```
This automatically starts both `backend` (port 5001) and `frontend` (port 5173).

---

### Method 2: Run Separately in Individual Terminals

#### Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

#### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
