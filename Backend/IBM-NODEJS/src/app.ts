
import express, { Request, Response } from 'express';
import cors from 'cors';
import 'reflect-metadata';




import apiResponseMiddleware from './infrastructure/middleware/ApiResponseMiddleware';
import { globalErrorHandler } from './infrastructure/middleware/GlobalErrorMiddleware';

import { simpleLoggingMiddleware } from './infrastructure/middleware/SimpleLoggingMiddleware';
import router from './infrastructure/routes/index';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use(simpleLoggingMiddleware);


app.use(apiResponseMiddleware);



app.use('/resources', express.static('resources'));
app.use('/resources', express.static('src/infrastructure/resources'));


app.use('/api', router);


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



app.use(globalErrorHandler);


app.listen(port, () => {
  console.log('');
  console.log('🌟=============================================🌟');
  console.log('🚀            IBM-NODEJS INICIADO             🚀');
  console.log('🌟=============================================🌟');
  console.log(`📡 Puerto: ${port}`);
  console.log(`🌐 URL: http://localhost:${port}`);
  console.log(`📋 Usuarios disponibles en: users.json`);
  console.log('📊 Logging automático: ✅ HABILITADO');
  console.log('🌟=============================================🌟');
  console.log('');
});