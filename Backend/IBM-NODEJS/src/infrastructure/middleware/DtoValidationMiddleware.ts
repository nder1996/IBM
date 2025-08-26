import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestError } from '../exception/ApplicationError';


export function validateDto(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoObject = plainToInstance(type, req.body);
      const errors = await validate(dtoObject);
      if (errors.length > 0) {
        const formattedErrors = errors.map((error: ValidationError) => {
          const constraints = error.constraints ? Object.values(error.constraints) : ['Error de validación'];
          return {
            field: error.property,
            messages: constraints
          };
        });
        throw new BadRequestError(
          `Error de validación: ${formattedErrors.map(e => `${e.field}: ${e.messages.join(', ')}`).join('; ')}`
        );
      }
      
      req.body = dtoObject;
      next();
    } catch (error) {
      next(error);
    }
  };
}
