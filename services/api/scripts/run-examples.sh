#!/bin/bash

# Example script showing different ways to run the API service with custom ports

echo "🚀 API Service Port Configuration Examples"
echo "========================================"
echo ""

echo "1. Run on default port (8000):"
echo "   task dev"
echo ""

echo "2. Run on custom port (9000):"
echo "   PORT=9000 task dev"
echo ""

echo "3. Run in production mode on custom port (9000):"
echo "   PORT=9000 task run:prod"
echo ""

echo "4. Set port as environment variable:"
echo "   export PORT=9000"
echo "   task dev"
echo ""

echo "5. Run on different ports for different environments:"
echo "   # Development"
echo "   PORT=8000 task dev"
echo "   # Staging"
echo "   PORT=8001 task run:prod"
echo "   # Production"
echo "   PORT=8002 task run:prod"
echo ""

echo "6. Check what would be executed (dry run):"
echo "   PORT=9000 task dev -n"
echo ""

echo "Note: The PORT environment variable overrides the default port 8000."
echo "If no PORT is set, the service will run on port 8000."
