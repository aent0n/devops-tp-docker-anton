# TP DevOps Docker - Anton

Ce repository contient le TP de déploiement automatisé avec Docker et GitHub Actions.

## Structure

```
devops-tp-docker-anton/
├── .github/
│   └── workflows/
│       └── docker-deploy.yml  # Workflow CI/CD
├── src/
│   ├── index.html            # Page principale
│   ├── style.css             # Styles
│   └── app.js                # JavaScript
├── nginx/
│   └── nginx.conf            # Configuration Nginx
├── Dockerfile                # Instructions Docker
├── .dockerignore            # Fichiers à exclure
└── README.md                 # Documentation
```

## Utilisation

1. Cloner le repo : `git clone https://github.com/anton/devops-tp-docker-anton`
2. Construire l'image : `docker build -t devops-tp-docker-anton .`
3. Lancer le container : `docker run -d -p 8080:80 devops-tp-docker-anton`
4. Accéder à http://localhost:8080

## CI/CD

Le pipeline GitHub Actions construit et publie l'image sur GHCR automatiquement.
