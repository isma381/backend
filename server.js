const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Configura la conexión a MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',          // Cambia esto según el host de Hostinger
  user: 'u529756086_381',         // Reemplaza con tu usuario de MySQL
  password: 'Lolatomiindiobella1!',   // Reemplaza con tu contraseña
  database: 'u529756086_44' // Reemplaza con el nombre de tu base de datos
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para listar subastas
app.get('/auctions', (req, res) => {
  connection.query('SELECT * FROM auctions', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener subastas');
      return;
    }
    res.json(results);
  });
});

// Ruta para crear una subasta
app.post('/auctions', (req, res) => {
  const { title, description, starting_price } = req.body;
  const query = 'INSERT INTO auctions (title, description, starting_price) VALUES (?, ?, ?)';
  connection.query(query, [title, description, starting_price], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al crear subasta');
      return;
    }
    res.json({ id: result.insertId, title, description, starting_price });
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en https://44.sudeka.com${port}`);
});