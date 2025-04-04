const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Configura la conexión a PostgreSQL usando la variable de entorno DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors({
  origin: 'https://auction-app-vert.vercel.app'
}));
app.use(express.json());

// Ruta de prueba para verificar que el backend está funcionando
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Ruta para listar subastas
app.get('/auctions', async (req, res) => {
  try {
    console.log('Intentando conectar a la base de datos...');
    const client = await pool.connect();
    console.log('Conexión a la base de datos exitosa');
    
    console.log('Ejecutando consulta SELECT * FROM auctions...');
    const result = await client.query('SELECT * FROM auctions');
    console.log('Consulta ejecutada, resultado:', result.rows);
    
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('Error en /auctions:', err.message, err.stack);
    res.status(500).send('Error al obtener subastas: ' + err.message);
  }
});

// Ruta para crear una subasta
app.post('/auctions', async (req, res) => {
  const { title, description, starting_price } = req.body;
  try {
    console.log('Creando subasta con datos:', { title, description, starting_price });
    const result = await pool.query(
      'INSERT INTO auctions (title, description, starting_price) VALUES ($1, $2, $3) RETURNING *',
      [title, description, starting_price]
    );
    console.log('Subasta creada:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error en POST /auctions:', err.message, err.stack);
    res.status(500).send('Error al crear subasta: ' + err.message);
  }
});

module.exports = app;