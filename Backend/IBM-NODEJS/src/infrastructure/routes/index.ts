// routes/index.ts
import { Router } from 'express';
import authRoutes from './auth';
import { JwtAuthMiddleware } from '../middleware/JwtAuthMiddleware';

const router = Router();



router.use('/auth', authRoutes);


router.get('/public', (req, res) => {
    res.json({ message: 'Acceso público desde index.ts' });
});


router.get('/protected', JwtAuthMiddleware, (req, res) => {
    res.json({ message: 'Acceso solo con token', user: req.user });
});

export default router;
