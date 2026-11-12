# Coding assessment workflow

The coding UI reads questions directly from `src/data/codingQuestions.js`; it does not duplicate or replace the bank. Candidate navigation filters by language, concept, and available difficulty. Instructions appear before the question timer starts. Question drafts, start timestamps, submission markers, and focus events are kept in this browser's `localStorage` so refreshes preserve local state. This is frontend continuity only: authoritative sessions, deadlines, scores, ownership checks, and submissions must be enforced and persisted by the backend.

## Execution and backend dependency

This repository contains no Spring Boot/Maven backend or code execution service. Compile / Run and Submit therefore report that no code was executed or submission recorded unless an API is configured. There is no browser-side compiler or mock successful result.

Set `VITE_ASSESSMENT_API_URL` to the origin of a secured assessment backend to enable these expected endpoints:

- `POST /api/assessments/start` — create/resume an authenticated candidate session from language, concept, and question IDs.
- `POST /api/assessments/execute` — execute `{questionId, language, code, input}` in an isolated sandbox and return only policy-approved results.
- `POST /api/assessments/submit` — evaluate and persist `{questionId, language, code}` idempotently; enforce ownership and server deadlines.
- `POST /api/assessments/events` — record a timestamped proctoring event for the authenticated session.
- `POST /api/assessments/end` — finalize a session and return authoritative results.

The frontend uses same-origin credentials (`credentials: include`) and does not add JWT storage. Adapt endpoint paths and payloads in `src/services/codingAssessment.js` and `src/pages/candidate/coding/CodingQuestion.jsx` to the backend API contract when that backend is added. The server must validate language/question membership, code and payload sizes, rate limits, session ownership, deadlines, hidden tests, and score calculations. Run untrusted code only in a separately managed sandbox with network disabled and CPU, memory, process, and wall-time limits; never run candidate code in the Spring process. Configure sandbox credentials on the backend using environment variables. No execution language can be reported as tested/supported until the isolated service is installed and verified. The question bank includes starter code for multiple languages, but backend execution support is not present here.

## Assessment settings

- `VITE_QUESTION_DURATION_SECONDS` — per-question duration; defaults to 1200 seconds.
- `VITE_ASSESSMENT_DURATION_SECONDS` — optional total duration; unset or zero disables the frontend total timer.
- `VITE_CAMERA_REQUIRED` — set to `true` only when camera access is a required, disclosed policy; otherwise permission is optional.
- `VITE_FULLSCREEN_REQUIRED` — set to `true` to prevent assessment start when the browser cannot enter fullscreen; defaults to `false`, which allows a clear warning and continues in the window.
- `VITE_ASSESSMENT_API_URL` — secured assessment backend origin described above.

These Vite values are public frontend configuration, not secrets or enforcement controls. A production backend must independently enforce policy and deadlines. Camera preview is permission based; this frontend does not record or upload images. It records focus loss in local browser state (and attempts the events endpoint when configured). Face detection/counting, server-side proctoring review, retries, authoritative results, recruiter access controls, and an execution sandbox still require backend/infrastructure implementation.

## Local verification

Install dependencies with `npm install`, set optional Vite variables in a local `.env` file, then run `npm run dev`. `npm run build` and `npm run lint` are the available frontend checks. This repository has no backend tests.
