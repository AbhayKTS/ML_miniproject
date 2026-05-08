#!/bin/bash
lsof -i :4000 | awk 'NR!=1 {print $2}' | xargs -r kill -9
lsof -i :5173 | awk 'NR!=1 {print $2}' | xargs -r kill -9
cd backend
npm run dev &
cd ../frontend
npm run dev &
