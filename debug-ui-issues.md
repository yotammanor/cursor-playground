# Debug Plan: Cannot create a task from the UI

## Problem
Creating a task from the UI fails. No success navigation; likely an error occurs and is not surfaced.

## Observations
- Frontend `TaskCreate` posts `{ title, description?, user_id:number }` to `/api/tasks`.
- Backend `POST /api/tasks` expects `TaskCreate(user_id:int)` and validates that the `user_id` exists, otherwise returns 404.
- UI does not display `createMutation` errors; only navigates on success.
- Likely outcome: 404 "User not found" if the entered `user_id` does not exist.

## Hypotheses
1. User ID does not exist → backend returns 404; UI swallows error.
2. Less likely: 422 payload mismatch (does not appear in code).
3. Environment issue (proxy) unlikely; routes and proxy are correct.

## Reproduction & Investigation
- Navigate to `/tasks/new` and submit a task with a non-existing `user_id`.
- Open devtools Network panel:
  - Verify `POST /api/tasks` request/response status (expect 404 if user missing).
  - Inspect response body for "User with id X not found".
- Check Console for any JS errors from Zod or Axios.

### Backend sanity checks
- List users:
```bash
curl -s http://localhost:8000/api/users | jq '.[].id'
```
- If empty, create a user, then retry task creation:
```bash
curl -s -X POST http://localhost:8000/api/users \
  -H 'Content-Type: application/json' \
  -d '{"username":"alice","email":"alice@example.com","password":"pass"}' | jq .id
```
- Create a task with that user id:
```bash
USER_ID=<id-from-previous> \
curl -s -X POST http://localhost:8000/api/tasks \
  -H 'Content-Type: application/json' \
  -d "{\"title\":\"Test Task\",\"description\":\"from curl\",\"user_id\":${USER_ID}}" | jq .
```

## Proposed Fixes (no implementation yet)
1. Improve `TaskCreate` UX
   - Fetch users and render a dropdown/select instead of raw numeric `user_id` input.
   - Add `onError` handler to show API error messages (e.g., toast or inline error).
   - Disable submit when required fields are missing.
2. Optional Guardrails
   - Validate `user_id` exists before submit (using fetched users).
   - Pre-fill with first available user when list is non-empty.
3. QA
   - Add an integration test: create user via UI, then create task via UI, assert success and presence in tasks list.

## Definition of Done
- Submitting the form with a valid user creates the task and navigates back to `/tasks` where the task appears.
- Submitting with an invalid user shows a clear error and does not navigate.
- Automated test covers the happy path.
