# ==================================
# Stage 1: Build CSS with tailwind
# ==================================
FROM node:lts-alpine AS builder

WORKDIR /app

# Copier les fichiers de config
COPY package.json ./
COPY tailwind.config.js ./

# Installer les dépendances
RUN npm install

# Copier les sources (HTML + Input CSS)
COPY src/ ./src/

# Build du CSS
RUN npm run build:css

# ==================================
# Stage 2: Production Image (Hardened)
# ==================================
# Utiliser une version spécifique (pas latest)
FROM nginx:1.25.4-alpine

# Métadonnées
LABEL maintainer="TP DevOps"
LABEL description="Application DevOps sécurisée"
LABEL org.opencontainers.image.source="https://github.com/anton/devops-tp-docker-anton"

# Créer un utilisateur non-root
RUN addgroup -g 1000 -S appgroup && \
    adduser -u 1000 -S appuser -G appgroup

# Installer uniquement les dépendances nécessaires
RUN apk add --no-cache \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Copier la configuration Nginx
COPY --chown=appuser:appgroup nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers static depuis le builder
COPY --from=builder --chown=appuser:appgroup /app/src/index.html /usr/share/nginx/html/
COPY --from=builder --chown=appuser:appgroup /app/src/app.js /usr/share/nginx/html/
COPY --from=builder --chown=appuser:appgroup /app/src/output.css /usr/share/nginx/html/

# Définir les permissions appropriées
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Modifier les permissions pour nginx
RUN touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/cache/nginx

# Passer à l'utilisateur non-root
USER appuser

# Exposer le port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
