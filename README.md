# TP DevOps Docker - Anton

Ce repository contient le TP de déploiement automatisé avec Docker et GitHub Actions, incluant une pipeline moderne avec **Tailwind CSS** et un **Multi-Stage Build**.

## Structure

```
devops-tp-docker-anton/
├── .github/
│   └── workflows/
│       └── docker-deploy.yml  # Workflow CI/CD
├── src/
│   ├── index.html            # HTML avec classes Tailwind
│   ├── input.css             # CSS source (directives Tailwind)
│   ├── output.css            # (Généré) CSS compilé
│   └── app.js                # JavaScript
├── nginx/
│   └── nginx.conf            # Configuration Nginx
├── Dockerfile                # Multi-stage: Node build -> Nginx run
├── package.json              # Dépendances Node.js (Tailwind)
├── tailwind.config.js        # Config Tailwind (Theme Retro)
├── .dockerignore             # Fichiers à exclure
└── README.md                 # Documentation
```

## Utilisation

### En Local (avec Docker)

1. Cloner le repo : `git clone https://github.com/anton/devops-tp-docker-anton`
2. Construire l'image (cela va compiler le CSS automatiquement) : 
   ```bash
   docker build -t devops-tp-docker-anton .
   ```
3. Lancer le container : 
   ```bash
   docker run -d -p 8080:80 devops-tp-docker-anton
   ```
4. Accéder à http://localhost:8080

### Développement (sans Docker)

Si vous voulez modifier le CSS sans reconstruire l'image à chaque fois :

1. Installer les dépendances : `npm install`
2. Lancer le mode watch de Tailwind :
   ```bash
   npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
   ```
3. Ouvrir `src/index.html` dans votre navigateur.

## CI/CD

Le pipeline GitHub Actions a été mis à jour pour gérer le build multi-stage. Il construit et publie l'image optimisée sur GHCR.
