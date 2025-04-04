const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Configura la conexión a PostgreSQL usando la variable de entorno DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones a Neon
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para listar subastas
app.get('/auctions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM auctions');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener subastas');
  }
});

// Ruta para crear una subasta
app.post('/auctions', async (req, res) => {
  const { title, description, starting_price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO auctions (title, description, starting_price) VALUES ($1, $2, $3) RETURNING *',
      [title, description, starting_price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear subasta');
  }
});

// Exporta la aplicación para que Vercel la use como función serverless
module.exports = app;