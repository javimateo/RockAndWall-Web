# ---- build: genera la web estática ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts evita descargar ffmpeg (solo lo usa el script local de vídeos)
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ---- web: nginx sirve la carpeta dist ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
