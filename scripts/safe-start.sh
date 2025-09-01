#!/bin/bash

# Safe Start Script - Prevents duplicate server instances
# Usage: ./safe-start.sh <service> <port> <command>

set -e

SERVICE_NAME=$1
PORT=$2
shift 2
COMMAND="$@"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Get process info for port
get_port_info() {
    local port=$1
    local pid=$(lsof -Pi :$port -sTCP:LISTEN -t 2>/dev/null | head -n1)
    if [ -n "$pid" ]; then
        local cmd=$(ps -p $pid -o comm= 2>/dev/null || echo "unknown")
        echo "PID $pid ($cmd)"
    else
        echo "unknown process"
    fi
}

# Main logic
if check_port $PORT; then
    echo -e "${YELLOW}⚠️  Port $PORT is already in use for $SERVICE_NAME${NC}"
    echo -e "   Running process: $(get_port_info $PORT)"
    echo -e "   ${BLUE}The server is already running. Skipping start.${NC}"
    echo ""
    echo -e "   To restart, first stop the existing server:"
    echo -e "   ${YELLOW}kill $(lsof -Pi :$PORT -sTCP:LISTEN -t 2>/dev/null | head -n1)${NC}"
    echo ""
    exit 0
else
    echo -e "${GREEN}✅ Starting $SERVICE_NAME on port $PORT${NC}"
    echo -e "   Command: $COMMAND"
    echo ""
    
    # Execute the command
    exec $COMMAND
fi
