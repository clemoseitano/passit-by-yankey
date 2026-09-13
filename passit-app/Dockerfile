FROM node:18-alpine AS build-frontend
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

FROM node:18-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend
COPY --from=build-frontend /app/frontend/dist ./backend/dist
EXPOSE 5001
CMD ["node", "backend/server.js"]
