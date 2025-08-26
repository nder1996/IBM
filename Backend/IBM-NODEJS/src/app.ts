// src/app.ts - VERSIÓN CON SISTEMA AOP SIMPLIFICADO
import express, { Request, Response } from 'express';
import cors from 'cors';
import 'reflect-metadata';

// ✅ IMPORTAR SISTEMA AOP SIMPLIFICADO
import './infrastructure/aspect/SimpleLoggingAspect';

import apiResponseMiddleware from './infrastructure/middleware/ApiResponseMiddleware';
import { globalErrorHandler } from './infrastructure/middleware/GlobalErrorMiddleware';
// ✅ IMPORTAR MIDDLEWARE SIMPLIFICADO
import { simpleLoggingMiddleware } from './infrastructure/middleware/SimpleLoggingMiddleware';
import router from './infrastructure/routes/index';

// Crear instancia de Express
const app = express();
const port = process.env.PORT || 3000;

// =======================================
// CONFIGURACIÓN DE MIDDLEWARES
// =======================================

// Parseo de JSON
app.use(express.json());

// CORS
app.use(cors({ 
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

// ✅ APLICAR MIDDLEWARE DE LOGGING SIMPLIFICADO
app.use(simpleLoggingMiddleware);

// Estandarización de respuestas API
app.use(apiResponseMiddleware);

// =======================================
// CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS
// =======================================
app.use('/resources', express.static('resources'));
app.use('/resources', express.static('src/infrastructure/resources'));

// =======================================
// CONFIGURACIÓN DE RUTAS
// =======================================
app.use('/api', router);

// Ruta raíz
app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    message: '🚀 IBM-NODEJS con Sistema AOP Simplificado!',
    version: '2.0-simplified',
    endpoints: {
      auth: '/api/auth/login',
      protected: '/api/protected',
      public: '/api/public'
    }
  });
});

// =======================================
// MANEJO GLOBAL DE ERRORES
// =======================================
app.use(globalErrorHandler);

// =======================================
// INICIALIZACIÓN DEL SERVIDOR
// =======================================
app.listen(port, () => {
  console.log('');
  console.log('🌟=============================================🌟');
  console.log('🚀            IBM-NODEJS INICIADO             🚀');
  console.log('🌟=============================================🌟');
  console.log(`📡 Puerto: ${port}`);
  console.log(`🌐 URL: http://localhost:${port}`);
  console.log(`🔐 Login: POST http://localhost:${port}/api/auth/login`);
  console.log(`📋 Usuarios disponibles en: users.json`);
  console.log('📊 Logging automático: ✅ HABILITADO');
  console.log('🌟=============================================🌟');
  console.log('');
});