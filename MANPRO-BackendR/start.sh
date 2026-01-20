#!/bin/bash

# Start Node.js server in background
echo "Starting Node.js server..."
node server.js &

# Start Python service in background
echo "Starting Python service..."
cd python_service
uvicorn app:app --host 0.0.0.0 --port 8000 &
cd ..

# Start Nginx
echo "Starting Nginx..."
service nginx start

# Keep container alive by trailing logs
tail -f /var/log/nginx/access.log /var/log/nginx/error.log
