# PeerSolve

Learn by Solving Together.

## Tech stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Java, Spring Boot, Spring Security
- Database: MongoDB Atlas
- Authentication: JWT and BCrypt

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

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me` (Bearer token required)
