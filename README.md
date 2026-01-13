# TP DevOps & DevSecOps - Anton

> **Rapport de TP pour l'évaluation**
> Ce dépôt contient la réalisation combinée du **TP1 (Déploiement Automatisé)** et du **TP2 (Sécurisation DevSecOps)**.

[![Build, Scan and Push Docker Image](https://github.com/aent0n/devops-tp-docker-anton/actions/workflows/docker-deploy.yml/badge.svg)](https://github.com/aent0n/devops-tp-docker-anton/actions/workflows/docker-deploy.yml)
[![CodeQL](https://github.com/aent0n/devops-tp-docker-anton/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/aent0n/devops-tp-docker-anton/actions/workflows/codeql-analysis.yml)

## 📌 Synthèse du Projet

Ce projet est une application web conteneurisée (Nginx) avec un pipeline CI/CD complet et sécurisé.

### 🎨 TP1 : Modernisation & Conteneurisation
- **Web App Retro** : Utilisation de **Tailwind CSS** avec une config custom (`tailwind.config.js`) pour un look "Terminal CRT".
- **Docker Multi-Stage** :
  - `Stage 1` (Node.js) : Compilation des assets Tailwind.
  - `Stage 2` (Nginx) : Image finale ultra-légère (Alpine) sans Node.js.
- **CI/CD** : Workflow GitHub Actions déclenché sur `push` (test) et `tags` (release).

### 🛡️ TP2 : Pipeline DevSecOps (Sécurité)
Nous avons transformé le pipeline DevOps classique en une **"Security Fortress"** :

1.  **SAST (Analyse du Code)** : Workflow **CodeQL** activé pour détecter les failles dans le JS.
2.  **SCA (Dépendances)** :
    - **Dependabot** configuré pour surveiller npm, Docker et Actions.
    - **Remédiation** : Correction des vulnérabilités critiques (Express, Lodash) via mise à jour `package.json`.
3.  **Container Security** :
    - **Hadolint** : Linting du Dockerfile pour forcer les bonnes pratiques.
    - **Trivy** : Scanner de vulnérabilités intégré dans le pipeline de build.
        - *Break the build* : Le pipeline échoue automatiquement si une faille CRITICAL est trouvée.
    - **SBOM** : Génération d'un inventaire logiciel (Software Bill of Materials) avec **Syft/Anchore**.
4.  **Hardening** :
    - **Non-Root** : L'image tourne avec un utilisateur `appuser` (UID 1000).
    - **Nginx Headers** : Protection XSS, Anti-Clickjacking et CSP stricts.

---

## 🤯 Difficultés Rencontrées (Post-Mortem)

Ce TP ne s'est pas fait sans douleur. Voici les principaux obstacles techniques surmontés :

1.  **L'enfer des versions CodeQL** :
    *   *Problème* : GitHub a déprécié CodeQL v3 super vite.
    *   *Solution* : Obligé de migrer vers v4 en plein milieu du TP pour éviter les warnings.

2.  **Docker Build vs Trivy** :
    *   *Problème* : L'option `load: true` de l'action `docker/build-push-action` faisait planter le chargement de l'image (erreur binaire étrange) à cause des nouvelles attestations de provenance de Docker.
    *   *Solution* : J'ai dû abandonner l'action officielle pour repasser sur des commandes **shell manuelles** (`docker build` + `docker save`) pour générer un tarball propre pour le scan.

3.  **SBOM & Tags** :
    *   *Problème* : L'action de génération de SBOM échouait ("manifest unknown").
    *   *Solution* : C'était une désynchronisation entre le tag poussé (chaîne courte) et le SHA complet attendu par Syft. J'ai forcé le push du tag `raw` (SHA complet) dans les métadonnées.

4.  **Sécurité Alpine** :
    *   *Problème* : L'image de base `nginx:alpine` trainait trop de failles.
    *   *Solution* : Upgrade vers `nginx:1.27-alpine` + un `apk upgrade` explicite dans le Dockerfile.

---

## 👨‍🏫 Guide pour l'Évaluateur

Voici comment vérifier le travail réalisé :

### 1. Vérifier l'Historique CI/CD (La preuve du travail)
Allez dans l'onglet **Actions**. Vous verrez l'évolution :
- ❌ **Builds Rouges** : Correspondant à l'étape d'injection volontaire de vulnérabilités. Le scanner Trivy a bloqué le pipeline.
- ✅ **Dernier Build Vert** : Après correction des dépendances (`package.json`) et de l'image de base (`Dockerfile`).
- 📦 **Artefacts** : Vous pouvez télécharger le fichier `sbom.spdx.json` généré à la fin du workflow.

### 2. Tester l'Image
L'image est publique sur le GitHub Container Registry :
```bash
docker run -d -p 8080:8080 ghcr.io/aent0n/devops-tp-docker-anton:latest
```
*Accédez à http://localhost:8080 pour voir le dashboard et le "Health Check" visuel.*

## Structure du Projet

```
devops-tp-docker-anton/
├── .github/
│   ├── workflows/     # Pipelines (CodeQL + Docker Deploy)
│   └── dependabot.yml # Bot de mises à jour
├── src/               # Code source (HTML/JS/Tailwind)
├── nginx/             # Config Nginx sécurisée
├── Dockerfile         # Multi-stage Hardened
├── .hadolint.yaml     # Config Linter Docker
└── README.md          # Ce rapport
```
