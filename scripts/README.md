# Safe Start Scripts

## Overview

The `safe-start.sh` script prevents multiple instances of the same service from running simultaneously, solving the friction caused by multiple agents/terminals trying to start local development servers.

## How It Works

1. **Port Check**: Before starting a service, the script checks if the specified port is already in use
2. **Duplicate Prevention**: If a port is occupied, it shows information about the running process and exits gracefully
3. **Safe Start**: If the port is free, it starts the service normally

## Usage

The script is automatically integrated into the Taskfile commands:

```bash
# Frontend (port 5174)
cd app && task dev

# API (port 8000) 
cd services/api && task dev
```

## Manual Usage

```bash
./scripts/safe-start.sh "Service Name" <port> <command>

# Example:
./scripts/safe-start.sh "My Service" 3000 npm start
```

## Benefits

- **No Port Conflicts**: Prevents "Address already in use" errors
- **Clear Feedback**: Shows which process is using the port
- **Graceful Handling**: Exits cleanly instead of crashing
- **Agent-Friendly**: Multiple agents can safely try to start services
- **Simple**: No complex session management or configuration

## What Happens When Port is Occupied

```
⚠️  Port 8000 is already in use for API Service
   Running process: PID 12345 (uvicorn)
   The server is already running. Skipping start.

   To restart, first stop the existing server:
   kill 12345
```

## Integration

The script is integrated into:
- `app/Taskfile.yml` - Frontend development server
- `services/api/Taskfile.yml` - API development server

No changes needed to existing workflows - just run `task dev` as usual.
