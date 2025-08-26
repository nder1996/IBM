import express, { Request, Response } from 'express';
import cors from 'cors';
import 'reflect-metadata'; // Importar reflect-metadata para habilitar decoradores

// Importar el sistema AOP completo
import './infrastructure/aspect';

import apiResponseMiddleware from './infrastructure/middleware/ApiResponseMiddleware';
import { globalErrorHandler } from './infrastructure/middleware/GlobalErrorMiddleware';
import transactionLoggingMiddleware from './infrastructure/middleware/TransactionLoggingMiddleware';
import router from './infrastructure/routes/index';

// Crear una instancia de Express
const app = express();

// Configurar el puerto, usando la variable de entorno o el 3000 por defecto
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración global de CORS (puedes personalizar el origen)
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));

// Aplicar middleware para logging de transacciones
app.use(transactionLoggingMiddleware);

// Aplicar middleware de respuesta estandarizada para todas las rutas
app.use(apiResponseMiddleware); // Usar la referencia directamente, no llamar como función

// Configurar middleware para servir archivos estáticos
app.use('/resources', express.static('resources')); // Servir archivos desde la carpeta resources en la raíz
app.use('/resources', express.static('src/infrastructure/resources')); // Servir archivos desde la carpeta resources en src

// Usar el router para manejar los endpoints
app.use('/api', router);

// Definir rutas; por ejemplo, una ruta raíz
app.get('/', (_req: Request, res: Response) => {
  res.send('Bienvenido a IBM-NODEJS!');
});

// Registrar el middleware global de manejo de errores (debe ser después de todas las rutas)
app.use(globalErrorHandler);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

// ... Módulos adicionales y configuración según se requiera ...
