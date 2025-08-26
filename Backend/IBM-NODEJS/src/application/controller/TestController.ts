import { Request, Response, Router } from 'express';

const router = Router();

// Endpoint de prueba (GET)
router.get('/test', (_req: Request, res: Response) => {
  res.json({ message: 'Endpoint de prueba GET funcionando correctamente' });
});

// Endpoint de prueba (POST)
router.post('/test', (_req: Request, res: Response) => {
  res.json({ message: 'Endpoint de prueba POST funcionando correctamente' });
});

export default router;
