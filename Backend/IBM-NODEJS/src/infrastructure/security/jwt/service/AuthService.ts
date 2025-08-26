// AuthService.ts

import fs from "fs";
import path from "path";
import { JwtUtil } from "../JwtUtil";
import { AuthResponse, TokenInfo, SoapData } from "../../../../application/dto/response/AuthResponse";
import { ImageBase64Service } from "../../../../application/services/ImageBase64Service";
import { BadRequestError, ResourceNotFoundError } from "../../../../infrastructure/exception/ApplicationError";
import { Service } from "../../../aspect/LoggingAspect";
import userRepository from "../../../database/UserRepository";

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
        // Validar entrada
        if (!username) {
            throw new BadRequestError("El nombre de usuario es requerido");
        }
        
        // Buscar el usuario usando el repositorio
        const user = await userRepository.findByUsername(username);

        if (!user) {
            throw new ResourceNotFoundError("Usuario", username);
        }
        
        // Usuario válido, generar token
        const token = this.jwtUtil.generateToken(username);
        
        // Convertir la ruta de la imagen a base64
        let profilePhotoBase64 = user.response.profilePhoto;
        
        // Intentar convertir la imagen a base64 si es una ruta válida
        if (user.response.profilePhoto && !user.response.profilePhoto.startsWith('data:image')) {
            // Construir la ruta completa al archivo
            const imagePath = path.join(process.cwd(), 'resources', 'images', path.basename(user.response.profilePhoto));
            const alternateImagePath = path.join(process.cwd(), 'src', 'infrastructure', 'resources', 'images', path.basename(user.response.profilePhoto));
            
            // Intentar convertir la imagen principal o la alternativa
            try {
                // Usar el método asíncrono y esperar su resultado
                let base64Data = await ImageBase64Service.convertImageToBase64Async(imagePath);
                if (!base64Data) {
                    base64Data = await ImageBase64Service.convertImageToBase64Async(alternateImagePath);
                }
                
                // Si se logró convertir, formatear como data URL
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
  
