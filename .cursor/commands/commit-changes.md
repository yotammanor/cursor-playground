# Commit Changes


## Overview

Commit to source control the requested unsaved changes.

This command explicitly defers to `version-control.mdc` for all version control behavior. By default, require manual approval before committing; if the user instructs "auto approve", bypass manual approval and proceed to commit.

## Steps
1. **Identify Scope**
  - If user requests specifically a set of changes, address that.
  - Otherwise, identify the different elements to commit separately. May be more than one descrete set of changes.
2. **For each scope of changes:**
  1. Undetstand changes
  2. Run `task lint`.
  3. stage only the relevant changes.
  4. prepare a oneline, clear and consice commit message.
  5. unless instructed "auto approve", present staged changes and the proposed message for review and await explicit approval per `version-control.mdc`.
  6. commit.
3. **Print the commit messages** created by this change
 

**Guidelines**
- NEVER delete uncommitted changes or untracked files.
- UNTRACKED FILES - ask before adding.
- defer to version-control.mdc re version control
- honor "auto approve" instruction to bypass manual approval; otherwise, require approval before committing
