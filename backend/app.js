const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importando o CORS
const connectDB = require('./config/db');
const personRoutes = require('./routes/personRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Conectar ao MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Adicionando CORS para permitir requisições do frontend
app.use(cors()); // Permite todas as origens

// Se quiser permitir apenas um domínio específico, use:
// app.use(cors({ origin: 'http://127.0.0.1:5500' }));

// Rotas
app.use('/api/persons', personRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
