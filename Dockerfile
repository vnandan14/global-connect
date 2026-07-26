FROM node:20-alpine AS build

WORKDIR /app

# Copy root and package manifests
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend static bundle
RUN npm run build --prefix frontend

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["npm", "run", "start", "--prefix", "backend"]
