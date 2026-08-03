# Phase 1 Context — Completed Backend Data Layer & Admin CMS Engine

> **STATUS:** Phase 1 **COMPLETED & VERIFIED** (Build Passing cleanly with zero errors)

---

## 1. Executive Summary & Status
Phase 1 established the complete backend data layer, RESTful API endpoints, Mongoose schema models, JWT admin security system, Cloudinary direct upload integration, and the React Admin CMS Authoring Dashboard.

All models, controllers, routes, and CMS components have been created, tested, and verified via automated build checks and database seed scripts.

---

## 2. Completed Backend Architecture (`backend/`)

### 2.1 Server & Environment
- **Server Entrypoint:** [server.js](file:///c:/Projects/Innovative/us/backend/server.js) running Express on port 5000 with CORS, JSON body parsers, and rate limiting (`express-rate-limit`).
- **Database Connection:** [config/db.js](file:///c:/Projects/Innovative/us/backend/config/db.js) connected to MongoDB Atlas / Local MongoDB.
- **Seeded Admin Account:** Executed via [scripts/seedAdmin.js](file:///c:/Projects/Innovative/us/backend/scripts/seedAdmin.js)
  - **Email:** `admin@foryou.com`
  - **Password:** `Admin@123456`

### 2.2 Ready & Exported Mongoose Schemas

#### Core Experience Schema: `FriendPage` ([models/FriendPage.js](file:///c:/Projects/Innovative/us/backend/models/FriendPage.js))
- `randomId`: 8-char nanoid string (indexed, unique, unguessable key).
- `friendSlug`: string (lowercase, URL-safe).
- `friendName`: string.
- `status`: enum (`'draft'`, `'published'`, `'archived'`).
- `theme`: `{ key: string, customColors: { primary, secondary, background, text, accent } }`.
- `backgroundMusicUrl`: string (audio link).
- `heroMessage`: string (Opening header).
- `friendshipDayMessage`: string (Greeting text).
- `timelineEvents`: Array of `{ order, title, description, date, imageUrl }`.
- `galleryImages`: Array of `{ url, caption }`.
- `voiceNoteUrl`: string (audio link).
- `poemStanzas`: Array of stanza strings.
- `surpriseGiftContent`: `{ type, title, body, imageUrl, linkUrl }`.
- `endingMessage`: string (Climax message).
- `currentStep`: number (Server-authoritative step index, default: 1).
- `publishedAt`: Date.

#### Analytics Schemas (Prepared for Phase 2 & 3 Logging)
- `VisitSession` ([models/VisitSession.js](file:///c:/Projects/Innovative/us/backend/models/VisitSession.js)): `friendPageId`, `sessionId`, `isFirstVisit`, `startedAt`, `lastActivityAt`, `deviceInfo`, `totalTimeSeconds`, `completed`.
- `PageVisit` ([models/PageVisit.js](file:///c:/Projects/Innovative/us/backend/models/PageVisit.js)): `sessionId`, `friendPageId`, `pageKey`, `durationSeconds`, `maxScrollPercent`, `skipped`, `completed`.
- `TimelineEventView` ([models/TimelineEventView.js](file:///c:/Projects/Innovative/us/backend/models/TimelineEventView.js)): `sessionId`, `friendPageId`, `eventIndex`, `viewed`, `durationSeconds`.
- `GalleryEvent` ([models/GalleryEvent.js](file:///c:/Projects/Innovative/us/backend/models/GalleryEvent.js)): `sessionId`, `friendPageId`, `imageIndex`, `opened`, `durationSeconds`, `openCount`.
- `VoiceNoteEvent` ([models/VoiceNoteEvent.js](file:///c:/Projects/Innovative/us/backend/models/VoiceNoteEvent.js)): `sessionId`, `friendPageId`, `played`, `paused`, `completed`, `percentListened`, `replayCount`.
- `PoemEvent` ([models/PoemEvent.js](file:///c:/Projects/Innovative/us/backend/models/PoemEvent.js)): `sessionId`, `friendPageId`, `stanzasCompleted`, `totalDurationSeconds`, `completionPercent`.
- `FeedbackResponse` ([models/FeedbackResponse.js](file:///c:/Projects/Innovative/us/backend/models/FeedbackResponse.js)): `friendPageId`, `sessionId`, `likedGift`, `likedMostText`, `didntLikeText`, `reflectionAnswers`.

---

## 3. Implemented API Endpoint Matrix

| Method | Endpoint | Protection | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/auth/login` | Public | Admin JWT Login |
| `GET` | `/api/admin/pages` | Admin JWT | List all friend experiences with stats |
| `POST` | `/api/admin/pages` | Admin JWT | Create draft experience (generates nanoid) |
| `GET` | `/api/admin/pages/:id` | Admin JWT | Get page details for editor |
| `PUT` | `/api/admin/pages/:id` | Admin JWT | Save page edits |
| `POST` | `/api/admin/pages/:id/duplicate` | Admin JWT | Duplicate experience with fresh nanoid |
| `DELETE` | `/api/admin/pages/:id` | Admin JWT | Delete experience |
| `POST` | `/api/admin/pages/:id/publish` | Admin JWT | Toggle draft/published status |
| `POST` | `/api/admin/upload-signature` | Admin JWT | Generates Cloudinary upload signature |
| `GET` | `/api/f/:randomId/:friendSlug` | Public | **Secret Link Validation for Phase 2** (Returns page data or generic 404) |

---

## 4. Completed Frontend Admin CMS (`frontend/`)

### 4.1 UI & Design System
- **Framework:** React 18 + Vite + Tailwind CSS + Lucide Icons + Framer Motion.
- **Glassmorphism Theme:** Custom `.glass-panel`, `.glass-input`, custom scrollbars, and editorial font styling (`Cinzel`, `Playfair Display`, `Plus Jakarta Sans`).
- **Production Build Verified:** `npm run build` passing cleanly.

### 4.2 Auth & Store
- [store/authStore.js](file:///c:/Projects/Innovative/us/frontend/src/store/authStore.js): Persistent Zustand state managing JWT token and admin user profile in `localStorage`.
- [api/client.js](file:///c:/Projects/Innovative/us/frontend/src/api/client.js): Axios instance with automatic `Authorization: Bearer <token>` header injection.

### 4.3 CMS Pages & Components
- **[LoginPage.jsx](file:///c:/Projects/Innovative/us/frontend/src/pages/admin/LoginPage.jsx)**: Admin sign-in screen.
- **[DashboardPage.jsx](file:///c:/Projects/Innovative/us/frontend/src/pages/admin/DashboardPage.jsx)**: Overview cards, experience card grid, quick stats, unique link generator, create modal, duplicate & delete handlers.
- **[PageEditorPage.jsx](file:///c:/Projects/Innovative/us/frontend/src/pages/admin/PageEditorPage.jsx)**: Full authoring CMS with tabs:
  - Hero & Greetings
  - Theme Picker (`rose_gold`, `midnight_dark`, `pastel_bloom`, `emerald_friendship`) & Background Audio URL
  - Interactive Memory Timeline Editor (order swapping & photo upload)
  - Gallery Masonry Uploader
  - Custom Voice Note Player & Audio Uploader
  - Poem Stanza Editor & Surprise Gift Builder
  - Ending Message
- **[LivePreviewModal.jsx](file:///c:/Projects/Innovative/us/frontend/src/components/admin/LivePreviewModal.jsx)**: CMS live preview modal.

---

## 5. Phase 2 Handoff Interface & Guidelines

When implementing **Phase 2 (The Friend-Facing Cinematic Journey)**, the following Phase 1 exports and endpoints are ready to be consumed directly:

1. **Public Fetch API:**  
   `fetchPublicPage(randomId, friendSlug)` from [api/pagesApi.js](file:///c:/Projects/Innovative/us/frontend/src/api/pagesApi.js) calls `GET /api/f/:randomId/:friendSlug`.
2. **Secret Route Path:**  
   Route pattern: `/:randomId/:friendSlug` handled by [App.jsx](file:///c:/Projects/Innovative/us/frontend/src/App.jsx).
3. **Step Navigation Engine:**  
   Internal step controller (Steps 1 to 11) using `FriendPage.currentStep` for server-authoritative progress resume.
4. **Theming Data:**  
   Read `pageData.theme` (`key` and `customColors`) to dynamically style the friend experience background, cards, text, and accents.
