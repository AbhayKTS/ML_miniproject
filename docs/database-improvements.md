# Database Improvements (PostgreSQL Ready)

This project now includes PostgreSQL-ready repository patterns using parameterized SQL.

## Tables
- users
- feedback
- content_history

## Security Approach
- Use parameterized queries ($1, $2, ...) for all writes/reads
- Do not interpolate user input directly into SQL strings
- Store structured metadata/signals as JSON/JSONB

## Files
- backend/src/services/postgresClient.js
- backend/src/repositories/postgres/contentRepository.js

## Migration Direction
1. Keep JSON file store for local demo fallback.
2. Enable DATABASE_URL in production.
3. Add pg dependency and create migration scripts.
4. Route writes to PostgreSQL repository in generation/feedback services.
