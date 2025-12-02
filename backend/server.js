const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------
// 1. CONNEXION BASE DE DONNÉES (SÉCURISÉE)
// ----------------------------------------------------
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(express.json());

// ----------------------------------------------------
// 2. CORS DYNAMIQUE ET COMPLET
// ----------------------------------------------------
const ALLOWED_ORIGIN = process.env.FRONTEND_URL; // Lit l'URL de production Vercel
const allowedOrigins = [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://backend', // Pour Docker Compose local
    // Ajoutez l'URL temporaire Vercel, juste au cas où
    'https://tp-devops-test-1s6c5qscz-ayas-projects-48fbc321.vercel.app/' 
];

if (ALLOWED_ORIGIN) {
    // AJOUTE L'URL DE PRODUCTION (https://tp-devops-test.vercel.app)
    allowedOrigins.push(ALLOWED_ORIGIN);
}

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
// ----------------------------------------------------


// Endpoint /api (reste le même)
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello from Backend !',
    timestamp: new Date().toISOString(),
    client: req.get('Origin') || 'unknown',
    success: true
  });
});

// ----------------------------------------------------
// 3. ENDPOINT /db (TESTE RÉELLEMENT LA CONNEXION DB)
// ----------------------------------------------------
app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    // Tente de récupérer les utilisateurs (pour vérifier l'initialisation)
    const result = await client.query('SELECT name, email FROM users');
    client.release(); 
    
    res.json({
      message: 'Database connection successful and users retrieved!',
      users: result.rows,
      success: true
    });
  } catch (err) {
    console.error('Database Error:', err.message);
    res.status(500).json({
      message: 'Database connection failed or table missing',
      error: err.message,
      success: false
    });
  }
});
// ----------------------------------------------------


app.listen(PORT, () => {
  console.log(`Backend on port ${PORT}`);
});