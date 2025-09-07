# Commit Changes


## Overview

Commit to source control the requested unsaved changes

## Steps
1. **Identify Scope**
  - If user requests specifically a set of changes, address that.
  - Otherwise, identify the different elements to commit separately. May be more than one descrete set of changes.
2. **For each scope of changes:**
  1. Undetstand changes
  2. Run `task format`.
  3. stage only the relevant changes.
  4. commit with a oneline, clear and consice commit message.
3. **Print the commit messages** created by this change
 

**Guidelines**
- NEVER delete uncommitted changes or untracked files.
- UNTRACKED FILES - ask before adding.
- defer to @versionControl.mdc re version control
