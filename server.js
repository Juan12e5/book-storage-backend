const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

process.loadEnvFile()

const DATABASE_URL = process.env.DATABASE_URL

mongoose.connect(DATABASE_URL, {

}).then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

app.listen(3000, () => {
    console.log('Servidor activo en la localiazción:  http://localhost:3000');
});

// Rutas de login y libros
const authRoutes = require('./Routes/auth');
const bookRoutes = require('./Routes/books');

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
