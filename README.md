<div align="center">

<br/>

```
███████╗██╗   ██╗███████╗███╗   ██╗████████╗    ███╗   ███╗ ██████╗ ██████╗
██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝    ████╗ ████║██╔════╝ ██╔══██╗
█████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║       ██╔████╔██║██║  ███╗██████╔╝
██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║       ██║╚██╔╝██║██║   ██║██╔══██╗
███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║       ██║ ╚═╝ ██║╚██████╔╝██║  ██║
╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝  ╚═╝       ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝
```

### Full‑Stack Event Management System

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<br/>

> **Discover · Register · Check‑In · Review** — A production-grade event platform built end-to-end as a major full‑stack project.

<br/>

[Features](#-key-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Demo Accounts](#-demo-accounts) · [Architecture](#-project-structure) · [Deployment](#-deployment)

---

</div>

<br/>

## 🌟 Overview

**EventManager** is a complete, production-ready event management platform that bridges the gap between event organizers and attendees. Customers can discover events, register with one click, download beautifully branded **QR-coded PDF tickets**, and post reviews. Organizers get a full dashboard to create and manage events, view participant lists, export CSVs, and perform **real-time check-ins** via Socket.IO — all in a responsive, dark-mode-ready UI.

<br/>

## 🛠 Tech Stack

<div align="center">

### Backend

| | Technology | Purpose |
|---|---|---|
| <img src="https://skillicons.dev/icons?i=nodejs" width="30"/> | **Node.js 18+** | Runtime environment |
| <img src="https://skillicons.dev/icons?i=express" width="30"/> | **Express.js** | REST API framework |
| <img src="https://skillicons.dev/icons?i=mongodb" width="30"/> | **MongoDB + Mongoose** | Database & ODM |
| <img src="https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white" height="24"/> | **JSON Web Tokens** | Authentication & authorization |
| <img src="https://skillicons.dev/icons?i=socketio" width="30"/> | **Socket.IO** | Real-time bidirectional events |

### Frontend

| | Technology | Purpose |
|---|---|---|
| <img src="https://skillicons.dev/icons?i=react" width="30"/> | **React 18** | UI library |
| <img src="https://skillicons.dev/icons?i=vite" width="30"/> | **Vite** | Lightning-fast dev bundler |
| <img src="https://skillicons.dev/icons?i=tailwind" width="30"/> | **Tailwind CSS** | Utility-first styling |
| <img src="https://skillicons.dev/icons?i=react" width="30"/> | **React Router** | Client-side routing |
| <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white" height="24"/> | **Axios** | HTTP client |

### Tooling & DevX

| | Technology | Purpose |
|---|---|---|
| <img src="https://skillicons.dev/icons?i=eslint" width="30"/> | **ESLint + Prettier** | Linting & formatting |
| <img src="https://img.shields.io/badge/Nodemon-76D04B?style=flat&logo=nodemon&logoColor=white" height="24"/> | **Nodemon** | Auto-restart dev server |
| <img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=flat&logo=postcss&logoColor=white" height="24"/> | **PostCSS** | CSS transformations |
| <img src="https://img.shields.io/badge/jsPDF-FF0000?style=flat&logoColor=white" height="24"/> | **jsPDF + html2canvas** | Branded PDF ticket generation |

</div>

<br/>

## ✨ Key Features

<table>
<tr>
<td width="33%" valign="top">

### 👤 Customers
- 🔍 Browse & discover events
- 📝 Register for events instantly
- 🎫 Download branded **PDF tickets with QR codes**
- ⭐ Post event reviews & ratings
- 🌙 Full dark mode support

</td>
<td width="33%" valign="top">

### 🎪 Organizers
- ➕ Create & manage events
- 👥 View participant lists
- 📊 Export attendee data as **CSV**
- 📡 **Real-time QR check-in** via Socket.IO
- 📈 Live event statistics

</td>
<td width="33%" valign="top">

### 🔧 Admin
- ✅ Approve / reject event submissions
- 🏠 Homepage recommendations engine
- 📉 Platform-wide statistics
- 🔔 Toast notifications
- 📱 Fully responsive UI

</td>
</tr>
</table>

<br/>

## 📁 Project Structure

```
Event-management-system/
│
├── backend/                    # Express API + Socket.IO server
│   ├── src/
│   │   ├── controllers/        # Route handler logic
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Auth, error handling
│   │   ├── socket/             # Socket.IO event handlers
│   │   └── seed.js             # Database seeder
│   ├── .env                    # Environment config (see below)
│   └── package.json
│
└── frontend/                   # Vite + React application
    ├── src/
    │   ├── pages/              # Route-level page components
    │   ├── hooks/              # Custom React hooks
    │   │   ├── useTicketPDF    # PDF ticket generation
    │   │   └── useQrCheckIn    # Live Socket.IO check-in
    │   └── components/         # Reusable UI components
    └── package.json
```

<br/>

## 🚀 Getting Started

### Prerequisites

- ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white) **Node.js 18+**
- ![MongoDB](https://img.shields.io/badge/MongoDB-local_or_Atlas-47A248?style=flat&logo=mongodb&logoColor=white) **MongoDB** (local or connection string)

---

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Event-management-system

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

Create a `backend/.env` file:

```env
PORT=5050
MONGODB_URI=mongodb://localhost:27017/eventmanager
JWT_SECRET=supersecret
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Run Locally

Open **two terminals**:

```bash
# Terminal A — Backend
cd backend
npm run dev
# → Server running at http://localhost:5050
```

```bash
# Terminal B — Frontend
cd frontend
npm run dev
# → App running at http://localhost:5173
```

### 4. Seed Demo Data *(optional)*

```bash
cd backend
node src/seed.js
```

<br/>

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👤 Customer | `customer@example.com` | `password` |
| 🎪 Organizer | `organizer@example.com` | `password` |
| 🔧 Admin | `admin@example.com` | `password` |

<br/>

## 🪝 Notable Custom Hooks

```ts
// Generate a fully branded, QR-embedded PDF ticket from HTML
const { downloadTicket } = useTicketPDF();

// Perform real-time QR / ID check-ins with live Socket.IO status
const { checkIn, status } = useQrCheckIn(eventId);
```

<br/>

## 📜 Scripts

### Backend (`backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with **nodemon** (hot reload) |

### Frontend (`frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start **Vite** dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |

<br/>

## 🌐 Deployment

1. **Set environment variables** — `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`
2. **Frontend** — Build with `npm run build` and serve the `dist/` directory via any static host (Vercel, Netlify, Nginx, CDN)
3. **Backend** — Run as a managed service with **PM2** or containerize with **Docker**; ensure CORS is configured to allow your frontend origin

```bash
# Example: run backend with PM2
pm2 start src/index.js --name eventmanager-api
```

<br/>

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

<br/>

**Built with 💙 as a flagship full-stack project**

*If you found this project helpful, please consider giving it a ⭐*

<br/>

[![Node.js](https://skillicons.dev/icons?i=nodejs,express,mongodb,react,vite,tailwind,js)](https://skillicons.dev)

</div>
