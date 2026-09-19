# PeerSolve AI

PeerSolve is an adaptive coding-learning platform. Learners solve Java problems in a browser-based Monaco editor, run and submit their solutions, receive progressive guidance, track game-like learning progress, and work together in real time.

The repository contains two applications:

- `frontend/`: Next.js App Router application with React, TypeScript, Tailwind CSS, Monaco Editor, Yjs, and Axios.
- `backend/`: Spring Boot 3.4.3 API using Java 21, Spring Security, MongoDB, JWT authentication, Java execution, and WebSocket collaboration.

## Current Product Capabilities

- User registration, login, JWT authentication, and profile retrieval.
- Searchable Java problem library with difficulty and topic filters.
- Monaco-based Java editor with run, submit, execution results, and submission history.
- Mission-based adaptive learning with XP, levels, streaks, mastery, achievements, worlds, and boss battles.
- Progressive hints and deterministic mentor feedback based on source patterns and execution errors.
- Real-time peer coding through Yjs CRDT synchronization and a Spring WebSocket relay.
- Real-time text chat inside collaborative coding rooms.
- Follow and unfollow peers directly from the leaderboard.
- Local Java execution fallback and optional Judge0 execution.
- MongoDB persistence for users, problems, submissions, missions, game state, and collaboration sessions.

## Architecture

```text
Browser / Next.js
  | REST via Axios
  v
Spring Boot API
  |-- Controllers: HTTP endpoints and validation
  |-- Services: business rules and execution orchestration
  |-- Repositories: Spring Data MongoDB interfaces
  |-- Security: JWT authentication and authorization
  |-- WebSocket handler: collaboration message relay
  v
MongoDB Atlas

Browser Monaco + Yjs <--> WebSocket relay <--> Other collaborators

SubmissionService --> Judge0 when configured
                  --> local javac/java fallback otherwise
```

The backend starts in `backend/src/main/java/com/peersolve/PeerSolveApplication.java`. The frontend uses the Next.js App Router under `frontend/app`.

## Repository Guide

### Backend

- `config/`: application seeders, Spring Security configuration, and WebSocket registration.
- `controller/`: REST controllers and the shared exception handler.
- `dto/`: request and response contracts exposed by the API.
- `model/`: MongoDB documents and embedded value objects.
- `repository/`: Spring Data MongoDB repositories.
- `security/`: JWT creation and request authentication.
- `service/`: authentication, problem retrieval, code execution, game progression, collaboration, and mentor logic.
- `websocket/`: room-based collaboration message relay.
- `src/test`: service-level tests for mentor logic, collaboration, and problem filtering.

### Frontend

- `app/`: pages and route-specific UI.
- `components/`: shared navigation, auth, mentor, loading, result, and problem UI.
- `lib/api.ts`: Axios client and JWT header injection.
- `lib/auth.ts`: browser-side auth state stored in local storage.
- `lib/game-api.ts`: typed wrappers for game endpoints.
- `lib/collaboration.ts` and `lib/y-monaco.ts`: Yjs, awareness, WebSocket, and Monaco integration.
- `types/`: TypeScript API models.
- `app/globals.css`: global theme and utility styles.

Generated folders should not be edited: `frontend/.next`, `frontend/node_modules`, and `backend/target`.

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Product home page |
| `/login` | User login |
| `/register` | User registration |
| `/dashboard` | Profile, XP, streak, and practice statistics |
| `/world` | Learning worlds, missions, boss gates, and next recommendation |
| `/missions/[id]` | Mission editor, hints, submission, and mentor feedback |
| `/boss/[id]` | Multi-stage boss challenge |
| `/problems` | Searchable practice problem library |
| `/problems/[id]` | Personal or collaborative problem editor |
| `/skill-tree` | Skill mastery and prerequisites |
| `/leaderboard` | Ranked learner profiles |
| `/achievements` | Achievement collection |

Important frontend modules:

- `frontend/components/ai-mentor-card.tsx`: renders mentor feedback and requests progressive hints.
- `frontend/app/missions/[id]/page.tsx`: consumes mission attempts, hints, and mentor responses.
- `frontend/app/problems/[id]/page.tsx`: standard practice editor; it currently has no mentor panel.
- `frontend/lib/collaboration.ts`: creates the Yjs document, WebSocket connection, awareness state, reconnect behavior, and heartbeat.

## Backend REST API

All routes use the `http://localhost:8082` base URL by default. Routes marked `Auth` require a Bearer JWT.

### Authentication and users

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Create a user account |
| `POST` | `/api/auth/login` | No | Authenticate and return JWT plus user data |
| `GET` | `/api/users/me` | Yes | Return the current user |

### Problems, submissions, and dashboard

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/problems` | No | List problems; supports `difficulty`, `topic`, and `search` |
| `GET` | `/api/problems/{id}` | No | Get a problem detail |
| `POST` | `/api/submissions/run` | Yes | Execute code without creating a submission record |
| `POST` | `/api/submissions` | Yes | Execute and persist a submission |
| `GET` | `/api/submissions/my` | Yes | List the current user's submissions; supports `problemId` |
| `GET` | `/api/dashboard/stats` | Yes | Return attempted, solved, and acceptance statistics |

### Adaptive game

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/game/profile` | Yes | Get player XP, level, streak, mastery, and achievements |
| `GET` | `/api/game/worlds` | No | List worlds and mission summaries |
| `GET` | `/api/game/missions/{id}` | No | Get mission details and starter code |
| `POST` | `/api/game/missions/{id}/attempt` | Yes | Run a mission attempt and update progression |
| `POST` | `/api/game/missions/{id}/hint?tier={tier}` | Yes | Request a progressive hint |
| `GET` | `/api/game/boss/{id}` | No | Get a boss and its stages |
| `POST` | `/api/game/boss/{id}/stage/{stageNumber}` | Yes | Attempt a boss stage |
| `GET` | `/api/game/skill-tree` | Yes | Get skill-tree progress |
| `GET` | `/api/game/leaderboard` | No | Get leaderboard entries |
| `GET` | `/api/game/achievements` | No | Get achievement definitions and progress |
| `GET` | `/api/game/adaptive/next` | Yes | Get the next recommended challenge |

### Collaboration

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/collaboration/sessions` | Yes | Create a session |
| `GET` | `/api/collaboration/sessions/{sessionId}` | No | Read session metadata and current code snapshot |
| `POST` | `/api/collaboration/sessions/{sessionId}/join` | Yes | Join a session |
| `POST` | `/api/collaboration/sessions/{sessionId}/leave` | Yes | Leave a session |
| `PUT` | `/api/collaboration/sessions/{sessionId}/code` | Yes | Persist the latest code snapshot |

The WebSocket endpoint is `ws://localhost:8082/ws/collaboration`. The backend relays JSON messages by session and does not parse or persist the Yjs document. The frontend owns Yjs synchronization and Monaco binding.

The same WebSocket room also relays chat messages. Chat is intentionally action-based rather than keystroke-based: the client sends `{ "type": "chat", "text": "..." }`, and the server broadcasts the sender name, user ID, message text, and timestamp to the other room members. Messages are limited to 500 characters and are not persisted.

### Social follows

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/social/users/{userId}/follow` | Yes | Follow another user |
| `DELETE` | `/api/social/users/{userId}/follow` | Yes | Unfollow another user |

The leaderboard includes `isFollowing` for the authenticated user. Follow state is stored as IDs in the user's `followingIds` field. The leaderboard remains publicly readable, while follow and unfollow mutations require authentication.

## Main Backend Data Flow

### Mission learning

1. The frontend loads a mission through `GET /api/game/missions/{id}`.
2. The learner requests optional progressive hints.
3. The frontend submits code through `POST /api/game/missions/{id}/attempt`.
4. `GameService` executes the mission test cases and updates the player profile.
5. `AiMentorService` analyzes the attempt using authored misconception rules, source heuristics, and execution output.
6. The response contains mentor feedback, XP/progression data, and any achievements.

### Personal practice

1. `/problems` loads the problem list.
2. `/problems/[id]` loads problem details and submission history.
3. The Monaco editor holds the current Java source.
4. Run calls `/api/submissions/run`; submit calls `/api/submissions`.
5. `SubmissionService` delegates execution to `Judge0Service` and persists authenticated submissions.

### Collaboration

1. A user creates or joins a REST session.
2. The frontend opens a WebSocket for that session.
3. Yjs produces document and awareness updates.
4. Spring relays updates to other room members.
5. The frontend binds the shared Yjs text to Monaco.
6. A code snapshot is persisted explicitly after run or submit.
7. Chat messages are sent through the same room WebSocket and rendered in the collaboration panel.

## Authentication and Security Notes

- Passwords are hashed with BCrypt.
- JWTs contain the user ID as subject and the email as a claim.
- The frontend stores the JWT and user data in browser local storage.
- Axios adds `Authorization: Bearer <token>` to API requests.
- CORS defaults to `http://localhost:3000` and is configurable.
- CSRF is disabled because the API uses stateless bearer authentication.
- WebSocket connections currently identify users through query parameters and are not JWT-validated by the WebSocket handler.
- WebSocket origins are currently permissive. Tighten both identity and origin validation before production deployment.
- Never commit `.env`, MongoDB credentials, JWT secrets, Judge0 credentials, or future AI provider keys.

## Configuration

The backend imports the optional root `.env` file through `backend/src/main/resources/application.properties`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret; use a long random value |
| `JWT_EXPIRATION` | No | JWT lifetime in milliseconds; default `86400000` |
| `SERVER_PORT` | No | Backend port; default `8082` |
| `CORS_ALLOWED_ORIGIN` | No | Allowed frontend origin; default `http://localhost:3000` |
| `JUDGE0_URL` | No | Judge0 API URL; empty means local execution fallback |
| `JUDGE0_API_KEY` | No | Judge0 credential |
| `JUDGE0_API_HOST` | No | RapidAPI Judge0 host when required |
| `NEXT_PUBLIC_API_URL` | No | Frontend API base URL; default `http://localhost:8082` |

There is currently no tracked `.env.example`; create a local `.env` from the variables above and keep it uncommitted.

## Local Development

### Prerequisites

- Java 21.
- Maven 3.9+ or the Maven wrapper if added later.
- Node.js compatible with the installed Next.js version.
- MongoDB Atlas or a local MongoDB instance.
- A JDK available on `PATH` if using local Java execution.

### Start the backend

```powershell
cd backend
mvn spring-boot:run
```

The API runs at `http://localhost:8082`.

### Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

The web application runs at `http://localhost:3000`.

### Build and test

```powershell
cd frontend
npm run build
```

```powershell
cd backend
mvn test
mvn package
```

The frontend currently has no visible automated test suite. The backend has service tests for mentor logic, problem filtering, and collaboration. Controller, security, Judge0, WebSocket, and end-to-end coverage should be added as the product stabilizes.

## Current AI Implementation

The current AI-looking behavior is implemented in `backend/src/main/java/com/peersolve/service/AiMentorService.java`, but it is not connected to an external AI model.

It currently provides:

- Fixed success and failure feedback.
- Mission-authored regex misconception rules.
- A lightweight nested-loop heuristic for expected `O(n)` solutions.
- String matching for common Java errors such as `ArrayIndexOutOfBoundsException`, `NullPointerException`, and `StackOverflowError`.
- Progressive hints taken from mission data.
- Keyword-based explanation scoring for boss stages.
- Rule-based adaptive challenge selection from mastery and completion state.

This is a useful deterministic fallback and should remain responsible for correctness, test pass/fail, XP, and progression. An external model should improve explanations and coaching, but it should never decide whether code passed or grant XP by itself.

## Recommended AI Integration

### Best first feature: post-attempt code mentor

The highest-value first integration is an on-demand **AI Code Coach** shown after a learner runs or submits code. It should explain the first meaningful failure, identify the likely concept involved, and suggest one next action without revealing the full solution.

Use this existing flow:

```text
Mission or problem submission
  -> deterministic test execution
  -> rule-based diagnosis from AiMentorService
  -> optional LLM explanation and coaching
  -> structured mentor response
  -> ai-mentor-card.tsx or a new practice mentor panel
```

The initial user-facing features should be:

1. Explain the first failing test in plain language.
2. Identify a likely misconception, such as off-by-one bounds, missing duplicate handling, or quadratic complexity.
3. Give a progressive next step rather than a complete solution.
4. Answer a learner's explicit question about the current code.
5. Compare the submitted approach with the required time and space complexity after the attempt.

### Backend location

Keep `AiMentorService` as the domain-facing service, but split its responsibilities into an interface and implementations:

```text
service/mentor/MentorAnalysisService.java
service/mentor/RuleBasedMentorAnalysisService.java
service/mentor/LlmMentorAnalysisService.java
service/mentor/MentorAnalysisResult.java
service/mentor/MentorPromptFactory.java
```

Suggested contract:

```java
public interface MentorAnalysisService {
    MentorAnalysisResult analyze(MentorAnalysisContext context);
}
```

`RuleBasedMentorAnalysisService` should contain the current regex, error, hint, and heuristic logic. `LlmMentorAnalysisService` should call the selected provider only when configured and fall back to the rule-based result on timeout, quota exhaustion, invalid output, or provider failure.

### Best invocation points

1. `GameService`, immediately after mission execution and before constructing `MissionAttemptResponse`.
2. `SubmissionService`, after `/api/submissions/run` or `/api/submissions`, for the standard practice editor.
3. A new authenticated `MentorController` for an explicit question or re-analysis request.

Do not call an AI provider on every keystroke. Analyze on user actions such as `Ask Mentor`, `Explain Failure`, or after a completed run. This controls cost, latency, and privacy risk.

### Suggested API

Add a dedicated endpoint rather than exposing provider details to the frontend:

```text
POST /api/mentor/analyze
```

Example request:

```json
{
  "problemId": "problem-id",
  "missionId": "mission-id",
  "code": "public class Main { ... }",
  "question": "Why does this fail on duplicate values?",
  "executionStatus": "WRONG_ANSWER",
  "executionMessage": "expected 3 but received 2",
  "failingTest": "[1, 1, 2]",
  "hintsUsed": 1
}
```

Example response:

```json
{
  "diagnosisCode": "DUPLICATE_HANDLING",
  "message": "Your lookup records only one occurrence, so the second value is skipped.",
  "evidence": ["The map is updated after the match check"],
  "suggestedAction": "Trace the input [1, 1, 2] and decide when each value enters the lookup.",
  "nextHintTier": 2,
  "confidence": 0.87,
  "fallbackUsed": false,
  "modelVersion": "provider-model-version"
}
```

The frontend can add a reusable `MentorPanel` next to the existing result area in `frontend/app/problems/[id]/page.tsx` and reuse `frontend/components/ai-mentor-card.tsx` for mission pages. Add a typed `mentorApi.analyze()` wrapper to `frontend/lib/game-api.ts` or a new `frontend/lib/mentor-api.ts`.

### Provider integration boundary

Do not put an AI API key in Next.js or browser code. The browser should call the Spring Boot API, and the backend should call the provider. Add provider configuration to backend environment variables, for example:

```text
AI_PROVIDER=disabled
AI_API_KEY=
AI_MODEL=
AI_BASE_URL=
AI_TIMEOUT_MS=10000
AI_MAX_REQUESTS_PER_MINUTE=20
```

Use a Spring HTTP client or the provider's official Java SDK. The provider-specific code belongs behind `LlmMentorAnalysisService`, so the rest of the application is independent of OpenAI, Azure OpenAI, or another model vendor.

### Prompt and output rules

The prompt should include only the minimum structured context:

- Problem statement, constraints, and expected complexity.
- Submitted code, bounded by a strict size limit.
- Test result summary and first relevant failure.
- Existing deterministic diagnosis.
- The learner's explicit question.

Require structured JSON output validated against a DTO. The model must:

- Never claim that code passed when the executor says it failed.
- Never change XP, completion, or submission status.
- Never provide a full solution unless the product explicitly introduces that mode.
- Cite evidence from the supplied code or execution result.
- Return a safe fallback when it is uncertain.

### Persistence and learning analytics

Add a separate `MissionAttempt` or `MentorAnalysis` MongoDB document rather than expanding `PlayerProfile` with unbounded history. Store:

- User, problem, and mission IDs.
- A code hash rather than unnecessary full source where possible.
- Test status and error category.
- Hints used and requested question.
- Rule-based diagnosis and model diagnosis.
- Provider/model version and prompt version.
- Latency, fallback flag, and timestamp.

This data can later support better recommendations based on repeated misconceptions, hint dependency, time-to-solve trends, and weak topics.

### Security and reliability requirements

Before enabling a live provider:

- Require authentication for AI endpoints.
- Enforce request, code, and question length limits.
- Add per-user rate limits and provider timeouts.
- Redact secrets and credentials from submitted code before sending it externally.
- Validate ownership of problem, mission, and collaboration session context.
- Log model metadata and failure reasons without logging API keys or raw sensitive code.
- Cache identical analyses when appropriate.
- Keep deterministic feedback available when the provider is unavailable.
- Obtain collaborator consent before sending shared workspace code to an external provider.

## Recommended AI Feature Roadmap

### Phase 1: useful and low risk

- Add `POST /api/mentor/analyze`.
- Add post-run `Explain Failure` to the standard problem page.
- Keep execution, scoring, XP, and progression deterministic.
- Return structured diagnosis, evidence, next action, and confidence.
- Add provider timeout and rule-based fallback.

### Phase 2: personalized learning

- Persist attempt and mentor telemetry.
- Detect repeated misconceptions across problems.
- Improve `/api/game/adaptive/next` using observed error categories and mastery trends.
- Recommend a targeted micro-challenge instead of only the next uncompleted mission.
- Add learner controls for hint strength and explanation style.

### Phase 3: collaborative mentor

- Add an explicit `Ask Mentor` action in collaborative sessions.
- Analyze only the saved shared snapshot and selected execution result.
- Display feedback to all participants or only the requesting user based on a clear privacy choice.
- Never stream every Yjs update to the model.

### Phase 4: content and evaluation

- Use retrieval over approved problem explanations and curriculum material.
- Version prompts and evaluate responses against labeled misconception examples.
- Track acceptance, learner follow-up success, latency, cost, and fallback rate.
- Add automated tests for provider failure, malformed model JSON, rate limits, and prompt-injection attempts.

## Testing Status and Gaps

Existing backend tests:

- `AiMentorServiceTest`: solved attempts, misconception rules, progressive hints, and explanation scoring.
- `ProblemServiceTest`: difficulty, topic, search filtering, and invalid difficulty.
- `CollaborationServiceTest`: session creation, missing sessions, join, and leave.

Recommended next tests:

- Controller integration tests for auth, submissions, mentor, and game endpoints.
- Security tests for unauthenticated and cross-user requests.
- `Judge0Service` tests for remote success, local fallback, timeout, and compiler failure.
- WebSocket tests for room isolation, join/leave, ping/pong, and malformed messages.
- Frontend tests for auth, mission submission, mentor states, and collaboration reconnects.
- End-to-end smoke tests covering register, solve, submit, request mentor feedback, and logout.

## Development Principles

- Keep code correctness and progression rules deterministic.
- Treat AI as an explainability and coaching layer.
- Keep provider credentials server-side.
- Prefer structured contracts over free-form model text.
- Bound AI calls by explicit user actions.
- Preserve a useful experience when MongoDB, Judge0, WebSocket, or the AI provider is unavailable.
- Do not edit generated build output.