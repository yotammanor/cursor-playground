# Fix Lint


## Overview

Execute the full lint suite and systematically fix any failures, ensuring coding standards.


## Steps
1. **Identify Scope**
  - assume root, unless explicitly asked for a sepecific subdir.
2. **Run Lint**
  - using `task lint`.
4. **Analyze failures**
  - Consider what is the cause of each issue, and plan a fix
5. **Fix issues systematically**
  - Start with the most critical failures
  - Fix one issue at a time
  - Re-run lint after each fix
6. **Verify validity of code changes**
  - after changing code, run related tests



**Guidelines**
- You should never change linter rules without permission.
- If fixes are non-trivial, higlight and consult.
- apply rules re taskfiles.mdc and terminal.mdc