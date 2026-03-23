FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm ci --workspace=backend

COPY backend/ ./backend/

RUN npm run build --workspace=backend

WORKDIR /app/backend

EXPOSE 3000
CMD ["node", "backend/dist/server.js"]
