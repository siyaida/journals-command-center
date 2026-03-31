# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Backend runtime
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ .
# Copy built frontend into position for Express static serving
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist
EXPOSE 3200
CMD ["node", "index.js"]
