# TP DevOps Docker - Anton

Ce repository contient le TP de déploiement automatisé avec Docker et GitHub Actions, incluant une pipeline avec TailwindCSS et un multi-stage build.
<img width="1900" height="1630" alt="image" src="https://github.com/user-attachments/assets/3ce81b17-5b5c-44cb-bf98-cef7387ea361" />


## Structure

```
devops-tp-docker-anton/
├── .github/
│   └── workflows/
│       └── docker-deploy.yml  # Workflow CI/CD
├── src/
│   ├── index.html            # HTML (avec classes Tailwind)
│   ├── input.css             # CSS source (directives Tailwind)
│   ├── output.css            # CSS compilé du build
│   └── app.js                # JavaScript
├── nginx/
│   └── nginx.conf            # Configuration Nginx
├── Dockerfile                # multistage Node build into Nginx run
├── package.json              # Dépendances Node.js (Tailwind)
├── tailwind.config.js        # Config Tailwind (pour le thème custom rétro)
├── .dockerignore             # Fichiers à exclure
└── README.md                 # Documentation
```

## Utilisation

### En Local (avec Docker)

1. Cloner le repo : `git clone https://github.com/anton/devops-tp-docker-anton`
2. Construire l'image (compiler le CSS automatiquement) : 
   ```bash
   docker build -t devops-tp-docker-anton .
   ```
3. Lancer le container : 
   ```bash
   docker run -d -p 8080:80 devops-tp-docker-anton
   ```
4. Accéder à http://localhost:8080

### Développement de la webapp sans docker

1. Installer les dépendances : `npm install`
2. Lancer le mode watch de Tailwind :
   ```bash
   npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
   ```
3. Ouvrir `src/index.html` dans votre navigateur.

## CI/CD

Le pipeline GitHub Actions a été mis à jour pour gérer le build multi-stage. Il construit et publie l'image optimisée sur GHCR.
