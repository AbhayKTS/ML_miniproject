#!/bin/bash

# Kill any existing server
lsof -i :4000 | awk 'NR!=1 {print $2}' | xargs -r kill -9
sleep 1

# Start server
echo "1. Start the backend server and confirm it starts without any errors"
npm run dev > server.log 2>&1 &
SERVER_PID=$!
sleep 3
if ps -p $SERVER_PID > /dev/null; then
    echo "PASS"
    echo "Server started successfully (PID: $SERVER_PID)"
else
    echo "FAIL"
    echo "Server failed to start. Logs:"
    cat server.log
    exit 1
fi

EMAIL="user_${RANDOM}@example.com"

# Test signup
echo -e "\n2. Test signup"
SIGNUP_RES=$(curl -s -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"test\",\"email\":\"$EMAIL\",\"password\":\"password123\"}")

TOKEN=$(echo $SIGNUP_RES | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "PASS"
    echo "Response: $SIGNUP_RES"
else
    echo "FAIL"
    echo "Response: $SIGNUP_RES"
fi

# Test login
echo -e "\n3. Test login"
LOGIN_RES=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"password123\"}")

LOGIN_TOKEN=$(echo $LOGIN_RES | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$LOGIN_TOKEN" ]; then
    echo "PASS"
    echo "Response: $LOGIN_RES"
else
    echo "FAIL"
    echo "Response: $LOGIN_RES"
fi

# Test image generation
echo -e "\n4. Test image generation"
IMAGE_RES=$(curl -s -X POST http://localhost:4000/generate/image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"prompt":"A magical forest", "controls": {"theme": "fantasy"}}')

# Extract output length to verify it's a real base64 string
IMAGE_BASE64=$(echo $IMAGE_RES | grep -o '"output":"[^"]*' | cut -d'"' -f4)

if [[ "$IMAGE_BASE64" == data:image/* ]]; then
    echo "PASS"
    echo "Response (truncated output): $(echo $IMAGE_RES | cut -c 1-200)..."
else
    echo "FAIL"
    echo "Response: $IMAGE_RES"
fi

# Test audio generation
echo -e "\n5. Test audio generation"
AUDIO_RES=$(curl -s -X POST http://localhost:4000/generate/audio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"prompt":"Epic synth wave", "controls": {"mood": "epic"}}')

AUDIO_BASE64=$(echo $AUDIO_RES | grep -o '"output":"[^"]*' | cut -d'"' -f4)

if [[ "$AUDIO_BASE64" == data:audio/* ]]; then
    echo "PASS"
    echo "Response (truncated output): $(echo $AUDIO_RES | cut -c 1-200)..."
else
    echo "FAIL"
    echo "Response: $AUDIO_RES"
fi

# Test protected routes
echo -e "\n6. Test protected routes"
PROJECTS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/projects)
UPLOAD_CODE=$(curl -s -X POST -o /dev/null -w "%{http_code}" http://localhost:4000/upload)

if [ "$PROJECTS_CODE" == "401" ] && [ "$UPLOAD_CODE" == "401" ]; then
    echo "PASS"
    echo "GET /projects -> $PROJECTS_CODE"
    echo "POST /upload -> $UPLOAD_CODE"
else
    echo "FAIL"
    echo "GET /projects -> $PROJECTS_CODE"
    echo "POST /upload -> $UPLOAD_CODE"
fi

# Cleanup
kill -9 $SERVER_PID
