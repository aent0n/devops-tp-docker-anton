require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const promClient = require('prom-client');

const app = express();

// ✅ Configuration Prometheus
const register = promClient.register;

// Métriques par défaut (CPU, mémoire, event loop)
promClient.collectDefaultMetrics({ register });

// Counter — requêtes HTTP totales
const httpTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total requêtes HTTP',
    labelNames: ['method', 'route', 'status'],
});

// Histogram — durée des requêtes
const httpDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Durée des requêtes HTTP',
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1],
});

// Middleware d'instrumentation Prometheus
app.use((req, res, next) => {
    const end = httpDuration.startTimer();
    res.on('finish', () => {
        httpTotal.inc({ method: req.method, route: req.path, status: res.statusCode });
        end();
    });
    next();
});

// ✅ Secret depuis variable d'environnement
const SECRET = process.env.JWT_SECRET;

if (!SECRET || SECRET.length < 32) {
    console.error('JWT_SECRET must be set and at least 32 characters');
    process.exit(1);
}

// ✅ Sécurité
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// ✅ Rate limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts'
});

// ✅ Validation des entrées
app.post('/api/login',
    loginLimiter,
    [
        body('username').isString().trim().notEmpty(),
        body('password').isString().notEmpty().isLength({ min: 8 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Ici : vérification réelle avec bcrypt + DB
        if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
            const token = jwt.sign(
                { username },
                SECRET,
                { expiresIn: '1h' }
            );
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
);

// EXO 1: Ajoutons une vulnérabilité SQL Injection pour que Semgrep la détecte
app.get('/api/users', (req, res) => {
    const user = req.query.username;
    // Ceci est volontairement vulnérable à l'injection SQL
    const query = "SELECT * FROM users WHERE username = '" + user + "'";

    // on fait semblant de l'exécuter
    res.json({ message: "Recherche en cours", query });
});

// ✅ Endpoint de santé (sans infos sensibles)
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// ✅ Endpoint de métriques pour Prometheus
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});

// ✅ Pas d'endpoint de debug en production
if (process.env.NODE_ENV !== 'production') {
    app.get('/debug', (req, res) => {
        res.json({ message: 'Debug mode' });
    });
}

app.listen(3000, () => console.log('✅ Secure server running on port 3000'));
