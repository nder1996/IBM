const express = require('express');
const helloController = require('./src/application/controllers/helloController');
const testController = require('./src/application/controllers/testController');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Ruta básica
app.get('/', (req, res) => {
  res.send('API REST en Node.js');
});

// Ruta que utiliza el controlador
app.get('/api/hola', helloController.getHello);

// Ruta de prueba
app.get('/api/test', testController.getTest);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
