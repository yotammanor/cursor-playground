# Task Management Application - Progress Tracker

## Project Roadmap

### Phase 1: Development Environment and Tooling
- [x] Learn about uv (for python versions, venv and deps), https://taskfile.dev/, docker, and how to use them together. document in a dedicate file.
- [ ] Set up a local development environment of the backend services with `uv` and `Taskfile`.
- [ ] Set up reproducible builds for each service using `Docker` and `Taskfile`
- [ ] Make sure dev requirements are properly separated from production requirements
- [ ] Make sure common dependencies are properly shared between services
- [ ] Replace `npm` with `yarn` in the frontend setup
- [ ] Integrate `yarn` with the `Taskfile` for managing frontend dependencies and scripts
- [ ] Make sure all services can be run locally with a single command (e.g., `task dev`), alongside broker and database services
- [ ] Make sure all services can be built with a single command (e.g., `task build`)
- [ ] Configure `Taskfile` to:
  - [ ] Test all
  - [ ] Build all
  - [ ] Lint all
  - [ ] Deploy all

### Phase 2: Core Feature Implementation
- [ ] Make the worker and api services communicate via the broker, on simple tasks.
- [ ] Set up a broker for Celery (e.g., Redis or RabbitMQ) using docker, and integrate into local dev env.
- [ ] Track progress of tasks in the UI

### Phase 3: Automation and CI/CD
- [ ] Set up GitHub Actions for CI/CD
- [ ] Configure workflows for building, testing, and deploying services - such that it calls on the taskfile to run the tests, build, and deploy

### Phase 4: Application Enhancement
- [ ] Add authentication and authorization
- [ ] Implement pagination for users and tasks lists
- [ ] Add sorting and filtering options
- [ ] Improve error handling and user feedback
- [ ] Add form validation with better user feedback

### Phase 5: Testing Infrastructure Enhancement
- [ ] **Playwright App Doctor Integration**
  - [ ] Add Playwright browser installation checks to app doctor
  - [ ] Verify Playwright browsers are properly installed and accessible
  - [ ] Check Playwright configuration file exists and is valid
  - [ ] Validate Playwright test environment setup
  - [ ] Add Playwright version compatibility checks
  - [ ] Verify Playwright test dependencies are installed
  - [ ] Add Playwright test data setup verification
  - [ ] Check Playwright test server configurations
  - [ ] Validate Playwright test file structure and naming conventions
  - [ ] Add Playwright test environment health checks (API endpoints, frontend server)
  - [ ] Implement Playwright test database setup verification
  - [ ] Add Playwright test cleanup verification
  - [ ] Check Playwright test reporting configuration
  - [ ] Verify Playwright test parallel execution setup
  - [ ] Add Playwright test debugging tools verification
  - [ ] Implement Playwright test performance monitoring setup
  - [ ] Add Playwright test accessibility audit setup
  - [ ] Check Playwright test visual regression setup (if needed)
  - [ ] Verify Playwright test mobile/tablet testing setup
  - [ ] Add Playwright test CI/CD integration verification

#### **Playwright App Doctor Implementation Plan**

**Priority 1: Core Playwright Setup Verification**
1. **Browser Installation Check**
   - Verify Playwright browsers are installed: `npx playwright install --dry-run`
   - Check if browsers are accessible: `npx playwright --version`
   - Validate browser binaries exist in expected locations

2. **Configuration Validation**
   - Check `playwright.config.js` exists and is valid JSON/JS
   - Verify required configuration sections (projects, webServer, use)
   - Validate baseURL configurations match expected ports (5174, 8000)

3. **Dependencies Check**
   - Verify `@playwright/test` is installed in package.json
   - Check Playwright version compatibility with Node.js version
   - Validate all required dev dependencies are installed

**Priority 2: Test Environment Health Checks**
4. **Test Infrastructure Validation**
   - Verify test directory structure exists (`tests/integration/`, `tests/unit/`)
   - Check test file naming conventions are followed
   - Validate test data setup scripts exist and are executable

5. **Server Configuration Verification**
   - Test frontend dev server can start on port 5174
   - Test API server can start on port 8000
   - Verify CORS configuration allows cross-origin requests
   - Check database connection for test environment

**Priority 3: Advanced Testing Features**
6. **Test Execution Environment**
   - Verify parallel test execution configuration
   - Check test reporting setup (HTML, line reporters)
   - Validate test retry and timeout configurations
   - Test debugging tools availability (UI mode, trace viewer)

7. **Performance and Quality Checks**
   - Verify accessibility testing setup
   - Check performance monitoring capabilities
   - Validate screenshot and video capture settings
   - Test mobile/tablet viewport configurations

**Implementation Notes:**
- Add these checks to the existing `app:doctor` task in `app/Taskfile.yml`
- Use silent mode for individual checks to avoid cluttering output
- Provide clear error messages with installation instructions
- Consider adding a separate `test:doctor` task for test-specific checks
- Integrate with existing health check endpoints for API validation

## Completed Tasks

### Project Setup
- [x] Scaffolded project structure based on README.md specifications
- [x] Created common service with shared models, schemas, and utilities
- [x] Implemented FastAPI api service with user and task endpoints
- [x] Set up Celery worker service with task processing capabilities
- [x] Created React frontend with TypeScript and Vite

### Frontend Development
- [x] Migrated from Chakra UI to Shadcn UI and Tailwind CSS v4
- [x] Updated README.md to document UI framework decision
- [x] Implemented React components for layout, navigation, and pages
- [x] Created user and task management interfaces
- [x] Set up React Router for navigation
- [x] Configured React Query for API data fetching
- [x] Added proper TypeScript types for all components and API responses

### Backend Development
- [x] Implemented SQLAlchemy models for User and Task entities
- [x] Created Pydantic schemas for data validation
- [x] Set up FastAPI endpoints for CRUD operations
- [x] Configured CORS to allow frontend requests (updated to support port 5174)
- [x] Implemented database initialization and connection management
- [x] Added utility functions for password hashing and validation

### Testing
- [x] Set up Playwright for end-to-end testing
- [x] Created navigation and search test scripts
- [x] Implemented and fixed user management flow test
- [x] Verified user creation, viewing, and deletion functionality

### Version Control
- [x] Initialized Git repository
- [x] Created .gitignore file
- [x] Made initial commit with all project files
- [x] Created remote GitHub repository (yotammanor/cursor-playground)
- [x] Pushed code to GitHub (including all previous changes)

### E2E Migration to JS Playwright
- [ ] Create `/e2e` JS project with `package.json`, `playwright.config.ts`, and optional `global-setup.ts`
- [ ] Configure Playwright `webServer` to start frontend (`task app:dev`) and API (`task web-api:run`); manage worker in `global-setup.ts` with readiness polling
- [ ] Implement DB reset step (remove/recreate SQLite or call reset endpoint/migrations) in `global-setup.ts`
- [ ] Move core flows from `app/tests/integration/` → `e2e/tests/core-flows/` and convert to `.spec.ts`
- [ ] Remove Playwright dep/scripts from `app/package.json`; delete `app/playwright.config.js`
- [ ] Remove root `@playwright/test` devDep; add under `e2e/package.json`
- [ ] Add root tasks: `e2e:deps` (cd e2e && yarn install), `e2e:browsers` (cd e2e && yarn dlx playwright install --with-deps), `e2e:test` (cd e2e && yarn playwright test), `e2e:test:ui`, `e2e:report`
- [ ] Update root `test` aggregate to include `e2e:test` after Python+app unit tests
- [ ] Update `README.md` with new e2e commands and structure

### Shadcn UI Migration
- [x] Migrate remaining UI to shadcn components
  - [x] Add missing shadcn components to `app/src/components/ui`: `badge`, `alert`, `alert-dialog`, `select`, `skeleton`, `toast`, `breadcrumb`, `separator`
  - [x] Replace status pills with `Badge` in `app/src/pages/Tasks.tsx`, `app/src/pages/TaskDetail.tsx`, `app/src/pages/UserDetail.tsx` (map: done → success, wip → secondary, failed → destructive, default → secondary)
  - [x] Replace browser `confirm()` with `AlertDialog` in `app/src/pages/TaskDetail.tsx`, `app/src/pages/UserDetail.tsx`
  - [x] Use `Alert` for error states across list/detail pages instead of plain text with red classes
  - [x] Add `Skeleton` loaders for list and detail pages during `isLoading`
  - [x] Keep current form state management (useState) - forms are simple enough and work well
  - [x] Replace numeric `user_id` field with `Select` populated from users API in `app/src/pages/TaskCreate.tsx`
  - [x] Add `Toast` notifications for create/update/delete success and failure flows
  - [x] Optional: add `Breadcrumb` to detail pages; use `Separator` between sections; standardize `Badge` variants in a small helper
  - [x] Update tests and selectors to reflect UI changes (cards/badges/dialogs/toasts)
  - [x] Add deps as needed: `@radix-ui/react-alert-dialog`, `@radix-ui/react-select`, and toast per shadcn preset; update `app/README.md` accordingly
