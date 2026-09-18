# PeerSolve

**Learn by Solving Together.**

PeerSolve is an AI-powered adaptive coding learning platform that analyzes how learners solve problems—not just whether their code is correct. It detects misconceptions, provides targeted guidance, and adapts the next learning step based on their progress.

It also enables learners to move beyond individual practice through **real-time peer-to-peer collaborative coding**, allowing multiple learners to work together in the same coding workspace.

## Tech Stack

* **Frontend:** Next.js, TypeScript, Tailwind CSS, Monaco Editor
* **Backend:** Java, Spring Boot, Spring Security
* **Database:** MongoDB Atlas
* **Authentication:** JWT and BCrypt
* **Code Execution:** Judge0 with local JDK fallback
* **AI Learning Layer:** ADA-7 Mentor and misconception analysis
* **Real-Time Collaboration:** Yjs CRDT and Spring WebSocket

## Phase 2 Features

### Adaptive Learning

* Adaptive coding practice with topic and difficulty-based problems
* Java coding workspace powered by Monaco Editor
* Judge0 execution with local JDK fallback
* AI-powered solution analysis and misconception detection
* Progressive hints and targeted micro-challenges
* Adaptive next-problem recommendations
* Topic-wise mastery and learning progress
* Multi-stage Mastery Challenges:

  * Diagnose
  * Fix
  * Optimize
  * Explain
* Submission history, XP, streaks, and learning achievements

### Collaborative Coding

PeerSolve now supports two coding modes:

#### 1. Personal Solving

A private coding workspace where learners can independently solve problems, run their code, submit solutions, and use the existing adaptive learning features.

#### 2. Peer-to-Peer Collaboration

A real-time collaborative coding workspace designed for learning together.

* Create a collaborative coding session
* Join an existing session using a shareable session link
* Real-time code synchronization between collaborators
* Conflict-free collaborative editing using **Yjs CRDT**
* WebSocket-based real-time communication
* Collaborator presence indicators
* Shared coding workspace using Monaco Editor
* Run and submit code from the collaborative workspace
* Leave a collaborative session when finished

## How Collaboration Works

PeerSolve uses **Yjs CRDT** to synchronize code changes between collaborators.

```text
Learner A
    │
    ▼
Monaco Editor
    │
    ▼
   Yjs
    │
    ▼
WebSocket
    │
    ▼
Spring Boot Backend
    │
    ▼
WebSocket
    │
    ▼
   Yjs
    │
    ▼
Monaco Editor
    ▲
    │
Learner B
```

Each collaborator works on the same shared document. Changes are synchronized through the real-time collaboration layer while Yjs handles concurrent document updates.

## Running Locally

Copy `.env.example` to `.env` and configure the MongoDB, JWT, and Judge0 values.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at:

```text
http://localhost:8082
```

The collaboration WebSocket endpoint is:

```text
ws://localhost:8082/ws/collaboration
```

## Environment Variables

| Variable              | Purpose                                                          |
| --------------------- | ---------------------------------------------------------------- |
| `MONGODB_URI`         | MongoDB Atlas connection string                                  |
| `JWT_SECRET`          | Long random signing secret (32+ characters)                      |
| `JWT_EXPIRATION`      | JWT lifetime in milliseconds; defaults to `86400000`             |
| `NEXT_PUBLIC_API_URL` | Browser-visible backend URL; defaults to `http://localhost:8082` |
| `JUDGE0_URL`          | Judge0 submissions API URL                                       |
| `JUDGE0_API_KEY`      | Judge0 or RapidAPI credential                                    |
| `JUDGE0_API_HOST`     | Required when using RapidAPI Judge0                              |

## API

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/users/me` — Bearer token required

### Coding Practice

* `GET /api/problems`
* `GET /api/problems/{id}`
* `POST /api/submissions/run`
* `POST /api/submissions`
* `GET /api/submissions/my` — Bearer token required
* `GET /api/dashboard/stats` — Bearer token required

### Adaptive Learning

* `GET /api/game/profile` — Bearer token required
* `GET /api/game/worlds

