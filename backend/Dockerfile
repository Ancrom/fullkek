FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm ci --workspace=backend

COPY backend/ ./backend/

RUN npm run build --workspace=backend

FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/backend/package*.json ./backend/
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/dist ./backend/dist

EXPOSE 3000

CMD ["node", "backend/dist/server.js"]
