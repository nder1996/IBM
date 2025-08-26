import { AuthService } from "../service/AuthService";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../../../application/dto/request/AuthRequest";
import { Controller, LogMethod } from "../../../aspect/LoggingAspect";

@Controller()
export class AuthController {
    @LogMethod()
    static async login(req: Request<{}, {}, AuthRequest>, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;
            const authService = new AuthService();
            const response = await authService.authenticate(username, password);
            
            // Verificar que la respuesta sea correcta
            console.log('Respuesta de autenticación:', JSON.stringify(response, null, 2));
            
            // Si llegamos aquí, la autenticación fue exitosa
            res.status(200).json(response);
        } catch (error) {
            // Pasar el error al middleware de manejo de errores global
            next(error);
        }
    }
}
