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
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}
