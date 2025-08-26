import { Router } from 'express';
import { AuthController } from '../security/jwt/controller/AuthController';
import { validateDto } from '../middleware/DtoValidationMiddleware';
import { AuthRequest } from '../../application/dto/request/AuthRequest';

const router = Router();


router.post('/login', validateDto(AuthRequest), AuthController.login);

export default router;