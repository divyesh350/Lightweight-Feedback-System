# 1. Build the frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# 2. Build the backend
FROM python:3.10-slim AS backend-build
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# 3. Final image
FROM python:3.10-slim
WORKDIR /app

# Copy backend code
COPY --from=backend-build /app/backend /app/backend

# Copy frontend build into backend's static directory
COPY --from=frontend-build /app/frontend/dist /app/backend/app/static

# Set environment variables (optional)
ENV PYTHONUNBUFFERED=1

# Expose backend port (change if needed)
EXPOSE 5000

# Start backend (adjust as needed)
CMD ["python", "backend/app/main.py"]
