import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestError } from '../exception/ApplicationError';

/**
 * Middleware para validar DTOs
 * @param type Clase del DTO a validar
 */
export function validateDto(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convertir el objeto plano a una instancia de la clase
      const dtoObject = plainToInstance(type, req.body);
      
      // Validar el DTO
      const errors = await validate(dtoObject);
      
      if (errors.length > 0) {
        // Convertir errores a un formato más legible
        const formattedErrors = errors.map((error: ValidationError) => {
          const constraints = error.constraints ? Object.values(error.constraints) : ['Error de validación'];
          return {
            field: error.property,
            messages: constraints
          };
        });

        // Lanzar error con los detalles de validación
        throw new BadRequestError(
          `Error de validación: ${formattedErrors.map(e => `${e.field}: ${e.messages.join(', ')}`).join('; ')}`
        );
      }
      
      // Si no hay errores, continuar
      req.body = dtoObject;
      next();
    } catch (error) {
      next(error);
    }
  };
}
