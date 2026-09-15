# PeerSolve

Learn by Solving Together.

## Tech stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Java, Spring Boot, Spring Security
- Database: MongoDB Atlas
- Authentication: JWT and BCrypt

## Phase 2 features

- Seeded coding problem library with title/topic/difficulty filters
- Java solution editor powered by Monaco
- Isolated Judge0 execution integration
- Authenticated runs, saved submissions, history, and dashboard progress

## Running locally

Copy `.env.example` to `.env` and fill in the MongoDB and JWT values. For the backend, set its environment variables in your terminal.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at http://localhost:8080 and Swagger is at http://localhost:8080/swagger-ui/index.html.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random signing secret (32+ characters) |
| `JWT_EXPIRATION` | JWT lifetime in milliseconds; defaults to 86400000 |
| `NEXT_PUBLIC_API_URL` | Browser-visible backend URL; defaults to http://localhost:8080 |
| `JUDGE0_URL` | Judge0 `submissions` API URL, e.g. `https://judge0-ce.p.rapidapi.com/submissions` |
| `JUDGE0_API_KEY` | Judge0 or RapidAPI credential; leave blank only for a self-hosted unauthenticated Judge0 instance |
| `JUDGE0_API_HOST` | Required by RapidAPI Judge0, e.g. `judge0-ce.p.rapidapi.com` |

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me` (Bearer token required)
- `GET /api/problems` and `GET /api/problems/{id}`
- `POST /api/submissions/run`, `POST /api/submissions`, and `GET /api/submissions/my` (Bearer token required)
- `GET /api/dashboard/stats` (Bearer token required)
