import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta';

export function JwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado', error: 'UNAUTHORIZED' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado', error: 'FORBIDDEN' });
        }
        req.user = user;
        next();
    });
}