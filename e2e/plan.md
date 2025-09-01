# Playwright E2E Migration Plan (JavaScript-based)

## Decision
- Use Playwright (TS) in a dedicated root-level `e2e/` project for E2E only.
- Isolate dependencies under `e2e/` with its own `package.json` and lockfile.
- Cover core full‑stack flows (frontend + web‑api + worker).

## Target Structure
```text
/e2e/
  package.json             # isolated deps (@playwright/test, typescript)
  playwright.config.ts     # webServer (frontend+API), baseURL, retries, workers (Playwright test parallelism)
  global-setup.ts          # start worker service, reset DB (optional but recommended)
  global-teardown.ts       # ensure clean shutdown (if needed)
  fixtures/
    test-data.ts
    auth.ts
  tests/
    core-flows/
      navigation.spec.ts
      users.spec.ts
      tasks.spec.ts
```

## Orchestration with existing Taskfiles
- Frontend: `task app:dev` (Vite at http://localhost:5173)
- API: `task api:run` (Uvicorn at http://localhost:8000)
- Worker: `task worker:run` (no HTTP; manage via `global-setup.ts`)

### In `playwright.config.ts`
- `webServer`: start both frontend and API in parallel using array form:
  - `{ command: 'task app:dev', url: 'http://localhost:5173', reuseExistingServer: true }`
  - `{ command: 'task web-api:run', url: 'http://localhost:8000', reuseExistingServer: true }`
- `use.baseURL`: `http://localhost:5173`
- Reasonable `timeout`, `expect.timeout`, `retries`, and `workers` for CI

### In `global-setup.ts`
- Spawn `task worker:run` as a background process
- Reset DB state (remove/recreate SQLite, run migrations, or call a reset endpoint)
- On teardown, kill spawned processes and clean artifacts

## Dependencies (isolated under `e2e/`)
- Required: `@playwright/test`
- Useful: `typescript`, `tsx` (or `ts-node`), `dotenv`
- Install browsers per project: `yarn dlx playwright install --with-deps` (run inside `e2e/`)

## Root `Taskfile.yml` tasks
- Add:
  - `e2e:deps`: `(cd e2e && yarn install)`
  - `e2e:browsers`: `(cd e2e && yarn dlx playwright install --with-deps)`
  - `e2e:test`: `(cd e2e && yarn playwright test)`
  - `e2e:test:ui`: `(cd e2e && yarn playwright test --ui)`
  - `e2e:report`: `(cd e2e && yarn playwright show-report)`
- Aggregate:
  - Update root `test` to run: `python:test` + `app:test` (unit) + `e2e:test`
  - Keep `test:parallel` serializing `e2e:test` to avoid port conflicts

## App cleanup
- In `app/package.json`:
  - Remove `@playwright/test` and scripts: `test:e2e`, `test:api`, `test:ui`
- Delete `app/playwright.config.*`
- Ensure `app` tests are unit/component only (Vitest)

## Migration from current app tests
1. Create `/e2e` JS/TS project (structure above)
2. Move only core flows from `app/tests/integration/`:
   - `navigation.test.js` → `e2e/tests/core-flows/navigation.spec.ts`
   - `user-management.test.js` → `e2e/tests/core-flows/users.spec.ts`
   - `task-management.test.js` → `e2e/tests/core-flows/tasks.spec.ts`
   - Drop or rewrite `search.test.js` unless it’s a core flow
3. Remove root `@playwright/test` devDep (if present) and add it under `e2e/package.json`
4. Update `README.md` with new e2e location and commands

## CI
- Run `task e2e:deps` and `task e2e:browsers`
- Cache Playwright browsers and Yarn cache
- Ensure ports 5173/8000 are free; `reuseExistingServer` handles local dev

## Risks & mitigations
- Port collisions → rely on `reuseExistingServer`; clearly document stopping services before CI
- Worker readiness → use retries/log wait in `global-setup.ts`
- DB leakage → per-run reset in `global-setup.ts`

## Checklist
- [ ] Create `/e2e` project with `package.json`, `playwright.config.ts`, optional setup/teardown
- [ ] Configure `webServer` (frontend+API) and `baseURL`
- [ ] Implement worker spawn and DB reset in `global-setup.ts`
- [ ] Move core flow tests into `e2e/tests/core-flows/` and convert to `.spec.ts`
- [ ] Remove Playwright from `app/package.json` and delete `app/playwright.config.*`
- [ ] Remove root `@playwright/test` devDep and add under `e2e/package.json`
- [ ] Add `e2e:*` tasks in root `Taskfile.yml`; include in aggregate `test`
- [ ] Update `README.md` with e2e commands and structure
