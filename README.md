# PeerSolve

Learn by Solving Together.

PeerSolve is an AI-powered adaptive coding learning platform that analyzes how learners solve problems—not just whether their code is correct. It detects misconceptions, provides targeted guidance, and adapts the next learning step based on their progress.

## Tech stack

- Frontend: Next.js, TypeScript, Tailwind CSS, Monaco Editor
- Backend: Java, Spring Boot, Spring Security
- Database: MongoDB Atlas
- Authentication: JWT and BCrypt
- Code Execution: Judge0 with local JDK fallback
- AI Learning Layer: ADA-7 Mentor and misconception analysis

## Phase 2 features

- Adaptive coding practice with topic and difficulty-based problems
- Java coding workspace powered by Monaco
- Judge0 execution with local JDK fallback
- AI-powered solution analysis and misconception detection
- Progressive hints and targeted micro-challenges
- Adaptive next-problem recommendations
- Topic-wise mastery and learning progress
- Multi-stage Mastery Challenges: Diagnose, Fix, Optimize, Explain
- Submission history, XP, streaks, and learning achievements

## Running locally

Copy `.env.example` to `.env` and configure the MongoDB, JWT, and Judge0 values.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at [http://localhost:8082](http://localhost:8082).

## Environment variables

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random signing secret (32+ characters) |
| `JWT_EXPIRATION` | JWT lifetime in milliseconds; defaults to 86400000 |
| `NEXT_PUBLIC_API_URL` | Browser-visible backend URL; defaults to `http://localhost:8082` |
| `JUDGE0_URL` | Judge0 submissions API URL |
| `JUDGE0_API_KEY` | Judge0 or RapidAPI credential |
| `JUDGE0_API_HOST` | Required when using RapidAPI Judge0 |

## API

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me` (Bearer token required)

### Coding practice

- `GET /api/problems`
- `GET /api/problems/{id}`
- `POST /api/submissions/run`
- `POST /api/submissions`
- `GET /api/submissions/my` (Bearer token required)
- `GET /api/dashboard/stats` (Bearer token required)

### Adaptive learning

- `GET /api/game/profile` (Bearer token required)
- `GET /api/game/worlds`
- `GET /api/game/missions/{id}`
- `POST /api/game/missions/{id}/attempt` (Bearer token required)
- `POST /api/game/missions/{id}/hint` (Bearer token required)
- `GET /api/game/adaptive/next` (Bearer token required)
- `GET /api/game/skill-tree` (Bearer token required)
- `GET /api/game/leaderboard`
- `GET /api/game/achievements`
