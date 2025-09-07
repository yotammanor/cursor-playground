# Workflow for adding new feature


## 1. Understand And Research
- Ask the user clarifying questions as needed.
- Research - find existing relevant files and code, references for 3rd party libraries, and other interent sources (if relevant)


## 2. Plan
- Write a todo.md (descriptive name) with feature tasks. Be verbose, reference relevant decsisions, files and research findings.
- User should approve plan before moving forward

## 3. Setup
- Create feature branch: `git checkout -b feature/feature-name`
- Run `task doctor` to ensure environment is ready
- Run `task test && task lint` to validate the environment is green.


## 4. Development
- Implement feature following the plan
- Special attention to existing pattern and conventions.
- Prefer code reuse whenever possible.
- Use tools like playwright and local server (see `terminal.mdc` for server startup instructions) to verify changes behave as expected.


## 5. Test
- Implement tests only after development is completed
- Avoid monkeypatching when possible, prefer fakes and fixtures over mocks.

## 6. Quality Checks
- Run `task lint` to check code quality
- Run tests: `task test`
- Fix any issues found

## 7. Commit & Push
- Stage only relevant changes: `git add <specific-files>`
- Commit with format: `location: brief description`
- Push branch: `git push origin feature/feature-name`
- Create PR for review

## 8. Cleanup
- Delete feature branch after merge
- Update todo.md to mark tasks complete
- When user approves, delete the todo.md file for this task


# Guidelines

- Prefer code reuse whenever possible
- Don't adapt existing functionality without user approval.
