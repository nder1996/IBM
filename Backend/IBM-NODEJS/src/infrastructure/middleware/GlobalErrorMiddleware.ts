import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from '../exception/ApplicationError';
import { ValidationError } from 'class-validator';


export function globalErrorHandler(
  err: Error | ApplicationError | ValidationError[],
  req: Request,
  res: Response,
  next: NextFunction
) {



  if (Array.isArray(err) && err.length > 0 && err[0] instanceof ValidationError) {
    const validationErrors = err as ValidationError[];
    const errors = validationErrors.map(error => {
      const constraints = error.constraints ? Object.values(error.constraints) : ['Error de validación'];
      return {
        field: error.property,
        messages: constraints
      };
    });

    return res.status(400).json({
      meta: {
        message: 'Error de validación',
        statusCode: 400,
        path: req.path,
        timestamp: new Date().toISOString()
      },
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error en la validación de datos',
        details: errors
      }
    });
  }


  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      meta: {
        message: err.message,
        statusCode: err.statusCode,
        path: req.path,
        timestamp: new Date().toISOString()
      },
      error: {
        code: err.errorCode,
        message: err.message
      }
    });
  }


  return res.status(500).json({
    meta: {
      message: 'Error interno del servidor',
      statusCode: 500,
      path: req.path,
      timestamp: new Date().toISOString()
    },
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err instanceof Error ? err.message : 'Ha ocurrido un error inesperado'
    }
  });
}
