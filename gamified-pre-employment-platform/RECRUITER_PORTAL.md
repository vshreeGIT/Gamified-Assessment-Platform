# SkillQuest recruiter portal

## Repository findings

This checkout contains a React/Vite frontend only. There is no Java source tree, Maven `pom.xml`, Spring Security configuration, Mongo repository/model, or API service implementation. The previous recruiter dashboard used fixed sample candidates, scores, and assessments; the auth/recruiter service modules were empty. The recruiter UI now uses authenticated API calls, displays returned data only, and reports unavailable services instead of using sample records.

## Frontend routes

- `/recruiter/login` — authenticates through the shared auth API and checks the returned role.
- `/recruiter/dashboard`
- `/recruiter/assessments`
- `/recruiter/assessments/create`
- `/recruiter/assessments/:assessmentId`
- `/recruiter/assessments/:assessmentId/edit`
- `/recruiter/candidates`
- `/recruiter/candidates/:candidateId`
- `/recruiter/results`
- `/recruiter/analytics`
- `/recruiter/settings`

All recruiter pages check `GET /api/auth/me` and require a `recruiter` role. This client-side check is only a navigation guard. Each endpoint below must independently enforce authentication, role, recruiter ownership/tenant scope, and data visibility.

## Backend configuration and API contract

Set `VITE_API_BASE_URL` to the secured API origin. Requests use same-origin credentials and do not store JWTs in the browser. An existing session-cookie/JWT convention should be implemented by the backend. Without the API, data pages show errors/empty states and write controls explain or report that the backend is unavailable. No recruiter records or result values are seeded by this frontend.

For local frontend-only review, `.env.local` enables `VITE_RECRUITER_MOCK_MODE=true`. The mock is available only in Vite development mode, bypasses all recruiter API requests, accepts any non-empty email and password, and uses clearly labeled sample data. Demo changes are temporary and reset on reload. Remove that setting from `.env.local` to return to the real API behavior. Never use the mock mode as authentication or data storage in a deployed build.

Expected endpoints used by the UI:

- `GET /api/auth/me`, `POST /api/auth/login`, `POST /api/auth/logout`
- `GET /api/recruiter/dashboard` returning real metrics, recent assessments/activity, score distribution
- `GET /api/recruiter/assessments` with search, status, type, technology, sort; `POST` create; `GET/PUT/DELETE /api/recruiter/assessments/{id}`; `POST /{id}/publish`, `/{id}/close`, `/{id}/duplicate`
- `GET /api/recruiter/candidates` with search/filter/sort; `GET /{candidateId}`; `PATCH /{candidateId}/decision`
- `GET /api/recruiter/results` with filters, sort, and pagination
- `GET /api/recruiter/analytics` with assessment, technology, and date filters
- `GET/PUT /api/recruiter/settings`

The response contract uses JSON with either a resource object or `{data: resource}`, lists as arrays or `{items: [...]}` / `{content: [...]}`, and error bodies with a safe `message`. Login must establish the existing secure session and return the authenticated user/role. Recruiter creation is not exposed in registration; provisioning must be administrative. The server must reject candidate access even if a client bypasses the route guard.

## Supported functionality and missing dependencies

- Assessment creation and preview use the existing coding question bank and language/concept mapping. Only coding is enabled because this checkout contains no persisted evaluator for recruiter-created aptitude/skill assessments. Question marks are not fabricated.
- Assessment management, publication, duplication, closing, deletion, candidate assignment, candidate decisions, result ranking, and settings writes depend on the backend. Actions call the endpoints above and show errors; deleting a draft requires confirmation. Candidate assignment is not exposed as a successful action because no assignment endpoint or candidate invitation model exists here.
- CSV exports are generated from the result/analytics rows returned to the active view. The API must enforce which candidate fields the recruiter may see.
- Candidate profile detail is limited to fields and proctoring events returned by the API. The UI does not invent event or skill breakdown data.

The Java backend, MongoDB persistence/indexes, role authorization, tenant ownership checks, recruiter API tests, and invitation/assignment behavior still need to be implemented in the backend repository. No backend build or recruiter API integration test can run from this frontend-only checkout.

## Verification

Frontend checks: `npm run build` and `npm run lint`. There is no frontend test script in `package.json` and no backend project in this checkout.
