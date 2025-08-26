// AuthService.ts

import fs from "fs";
import path from "path";
import { JwtUtil } from "../JwtUtil";
import { AuthResponse, TokenInfo, SoapData } from "../../../../application/dto/response/AuthResponse";
import { ImageBase64Service } from "../../../../application/services/ImageBase64Service";
import { BadRequestError, ResourceNotFoundError } from "../../../../infrastructure/exception/ApplicationError";
import { Service } from "../../../aspect/LoggingAspect";
import userRepository from "../../../../domain/repositories/UserRepository";

/**
 * Servicio de autenticación con AOP aplicado
 * @Service() aplica interceptores a todos los métodos de la clase
 */
@Service()
export class AuthService {
    private jwtUtil: JwtUtil;

    constructor() {
        this.jwtUtil = new JwtUtil();
    }

    async authenticate(username: string, password: string): Promise<AuthResponse> {
        if (!username) {
            throw new BadRequestError("El nombre de usuario es requerido");
        }
        const user = await userRepository.findByUsername(username);
        if (!user) {
            throw new ResourceNotFoundError("Usuario", username);
        }
        console.log('Iniciando generación de token para el usuario:', username);
        const token = this.jwtUtil.generateToken(username);
        let profilePhotoBase64 = user.response.profilePhoto;
        if (user.response.profilePhoto && !user.response.profilePhoto.startsWith('data:image')) {
            const imagePath = path.join(process.cwd(), 'resources', 'images', path.basename(user.response.profilePhoto));
            const alternateImagePath = path.join(process.cwd(), 'src', 'infrastructure', 'resources', 'images', path.basename(user.response.profilePhoto));
            try {
                let base64Data = await ImageBase64Service.convertImageToBase64Async(imagePath);
                if (!base64Data) {
                    base64Data = await ImageBase64Service.convertImageToBase64Async(alternateImagePath);
                }
                if (base64Data) {
                    const extension = path.extname(user.response.profilePhoto).substring(1) || 'png';
                    profilePhotoBase64 = `data:image/${extension};base64,${base64Data}`;
                }
            } catch (error) {
                console.error('Error al convertir imagen a base64:', error);
            }
        }
        
        return new AuthResponse(
            new TokenInfo(token, "Bearer"),
            new SoapData(
                user.response.resultCode,
                user.response.firstName,
                user.response.lastName,
                user.response.age,
                profilePhotoBase64,
                user.response.video
            )
        );
    }
}

