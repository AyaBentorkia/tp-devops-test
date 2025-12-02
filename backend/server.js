const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const pool = new Pool({
    connectionString:`postgresql://tp_devops_db_user:MQ91ypW5RDZcwvWkGHFqqVw1SLbjWPKE@dpg-d4nbgmm3jp1c73aiso5g-a.oregon-postgres.render.com/tp_devops_db` , 
    ssl: {
        rejectUnauthorized: false // Requis par Render pour les connexions SSL
    }
});
// Permettre JSON dans le body
app.use(express.json());

// CORS pour localhost et conteneurs
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://backend',
    'https://tp-devops-test-1s6c5qscz-ayas-projects-48fbc321.vercel.app/'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Endpoint /api
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello from Backend !',
    timestamp: new Date().toISOString(),
    client: req.get('Origin') || 'unknown',
    success: true
  });
});

// Endpoint /db (pour tests CI/CD ou curl)
app.get('/db', (req, res) => {
  res.json({
    message: 'Database endpoint OK',
    timestamp: new Date().toISOString(),
    success: true
  });
});

app.listen(PORT, () => {
  console.log(`Backend on port ${PORT}`);
});


