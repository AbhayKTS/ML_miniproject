FROM node:20-alpine

# Install FFmpeg for video processing
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy application source
COPY src/ src/
COPY workers/ workers/
COPY schema.sql .

# Create data directory for JSON file store fallback
RUN mkdir -p data/temp

# Non-root user for security
RUN addgroup -S chhaya && adduser -S chhaya -G chhaya
RUN chown -R chhaya:chhaya /app
USER chhaya

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["node", "src/index.js"]
