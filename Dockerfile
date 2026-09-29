# ---- build: genera la web (páginas estáticas + el servidor del chat) ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts evita descargar ffmpeg (solo lo usa el script local de vídeos)
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ---- web: Node sirve las páginas y responde en /api/chat ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=80
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 80
# La clave de la API se pone en Coolify como variable de entorno: ANTHROPIC_API_KEY
CMD ["node", "./dist/server/entry.mjs"]
