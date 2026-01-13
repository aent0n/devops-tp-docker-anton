# ==================================
# Stage 1: Build CSS with Tailwind
# ==================================
FROM node:lts-alpine as builder

WORKDIR /app

# Copier les fichiers de config
COPY package.json ./
COPY tailwind.config.js ./

# Installer les dépendances
RUN npm install

# Copier les sources (HTML + Input CSS)
COPY src/ ./src/

# Build du CSS (génère src/output.css)
RUN npm run build:css

# ==================================
# Stage 2: Production Image
# ==================================
FROM nginx:alpine

# Métadonnées
LABEL maintainer="TP DevOps"
LABEL description="Une Application DevOps dans un style rétro (ajout de Tailwind)"

# Copier la configuration Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers static depuis le builder
# On prend le HTML et le JS
COPY --from=builder /app/src/index.html /usr/share/nginx/html/
COPY --from=builder /app/src/app.js /usr/share/nginx/html/
# ET on prend le CSS compilé
COPY --from=builder /app/src/output.css /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
