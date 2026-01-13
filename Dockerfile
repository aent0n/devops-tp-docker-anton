FROM nginx:alpine

# Métadonnées
LABEL maintainer="TP DevOps"
LABEL description="Application DevOps containerisée avec Nginx"

# Copier la configuration Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de l'application
COPY src/ /usr/share/nginx/html/

# Exposer le port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
