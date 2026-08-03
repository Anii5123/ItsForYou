# "For You" — Personalized Friendship Day Gift Website

A multi-tenant, story-driven MERN stack application designed to author, deliver, and monitor personalized interactive digital gift experiences for friends. 

Each experience is accessible via a unique, unguessable URL (`/:randomId/:friendSlug`) featuring an 11-step emotional journey (Hero → Greeting → Interactive Prompt → Memory Timeline → Photo Gallery → Custom Voice Note → Surprise Gift → Poem → Feedback → Reflections → Grand Climax) backed by real-time analytics and an Admin CMS.

---

## 🌟 Key Features

- **Multi-Tenant Experience CMS:** Author, customize, preview, duplicate, and publish unlimited friend experiences.
- **Unguessable Secret Links:** Private 8-character `nanoid` keys with strict secrecy guards (identical generic 404 on any mismatch).
- **Playful Evasive "No" Button:** Bounds-aware cursor/touch dodging capped at $N=5$ attempts with playful teasing.
- **Server-Authoritative Resume:** Seamless progress persistence (`currentStep`) with a warm "Welcome back!" micro-banner.
- **Custom Waveform Audio Player:** Styled audio player for custom voice note messages.
- **Real-Time Live Monitor:** Live indicator badge tracking active visitors (polls every 5s).
- **Automated SMTP Email Alerts:** Instant Gmail notifications sent when a friend completes their journey and submits reflection responses.
- **Visual Analytics Dashboard:** Visual step dwell bar charts, completion funnel charts, and reflection cards.

---

## 🚀 Tech Stack

- **Frontend:** React 18 (Vite), React Router v6, Tailwind CSS, Framer Motion, Axios, Zustand.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose ODM), JWT Authentication, `nanoid`.
- **Media & Email:** Cloudinary signed direct uploads, Nodemailer + Gmail SMTP.
- **Deployment:** Render (Backend API) + Vercel (Frontend SPA) + MongoDB Atlas (Database).

---

## 📁 Repository Structure

```text
us/
├── docker-compose.yml
├── README.md
├── PROJECT_PLAN.md
├── PHASE1_CONTEXT.md
├── PHASE2_CONTEXT.md
├── PHASE3_CONTEXT.md
├── backend/
│   ├── Dockerfile
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   ├── config/ (db.js, cloudinary.js, mailer.js)
│   ├── models/ (Admin, FriendPage, VisitSession, PageVisit, TimelineEventView, GalleryEvent, VoiceNoteEvent, PoemEvent, FeedbackResponse)
│   ├── middleware/ (auth.js, errorHandler.js)
│   ├── controllers/ (authController.js, pageController.js, uploadController.js, analyticsController.js)
│   ├── routes/ (authRoutes.js, pageRoutes.js, uploadRoutes.js, publicRoutes.js, analyticsRoutes.js)
│   └── scripts/ (seedAdmin.js, testMailer.js)
└── frontend/
    ├── Dockerfile
    ├── vercel.json
    ├── package.json
    └── src/
        ├── api/ (client.js, authApi.js, pagesApi.js, uploadApi.js, analyticsApi.js)
        ├── store/ (authStore.js, friendStore.js)
        ├── components/ (ui/, admin/, friend/)
        └── pages/ (admin/, friend/, NotFoundPage.jsx)
```

---

## 🛠️ Local Development Setup

### Option A: Standard Local Setup

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   *Create `.env` file (see `.env.example`):*
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/foryou
   JWT_SECRET=super_secret_jwt_key
   CLIENT_URL=http://localhost:5173
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=aniip5122003@gmail.com
   SMTP_PASS=jprycrvndimtmspf
   ```

2. **Seed Initial Admin User:**
   ```bash
   node scripts/seedAdmin.js
   ```
   *Default Admin:* `admin@foryou.com` / `Admin@123456`

3. **Start Backend Server:**
   ```bash
   npm run dev
   ```

4. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173/admin/login` in your browser.

---

### Option B: Local Setup via Docker Compose

Run the entire application (MongoDB + Express Backend + React Frontend) using Docker:

```bash
docker-compose up --build
```

- **Frontend:** `http://localhost`
- **Backend API:** `http://localhost:5000`
- **MongoDB:** `localhost:27017`

---

## 🌐 Production Deployment Guide

### 1. Database (MongoDB Atlas)
- Create a free cluster on MongoDB Atlas.
- Add Network Access IP: `0.0.0.0/0` (Allow access from anywhere).
- Copy your `MONGO_URI` connection string.

### 2. Deploy Backend on Render
- Create a **Web Service** on Render pointing to root directory `backend`.
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Add Environment Variables:** `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `SMTP_*`, `CLOUDINARY_*`.
- Open Render Shell and run `node scripts/seedAdmin.js` to seed admin.

### 3. Deploy Frontend on Vercel
- Create a project on Vercel pointing to root directory `frontend`.
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Add Environment Variable:** `VITE_API_BASE_URL` = `https://your-backend.onrender.com`

---

## 🔐 API Reference Matrix

| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/auth/login` | Public | Admin Login |
| `GET` | `/api/admin/pages` | Admin JWT | List all friend experiences with stats |
| `POST` | `/api/admin/pages` | Admin JWT | Create draft friend page (generates nanoid) |
| `GET` | `/api/f/:randomId/:friendSlug` | Public | **Secret Link Validation** |
| `POST` | `/api/f/:randomId/session` | Public | Telemetry: Start/resume visitor session |
| `POST` | `/api/f/:randomId/heartbeat` | Public | Telemetry: Session heartbeat pulse |
| `POST` | `/api/f/:randomId/feedback` | Public | Telemetry: Submit reflections & send SMTP email |
| `GET` | `/api/admin/pages/:id/analytics` | Admin JWT | Aggregated analytics & reflection answers |
| `GET` | `/api/admin/pages/:id/live` | Admin JWT | Real-Time live visitor monitoring |
