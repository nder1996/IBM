import { ErrorResponse } from '../../application/dto/response/ApiResponse';

/**
 * Clase base para representar errores de la aplicación
 * Similar a la clase ErrorResponse en Java
 */
export class ApplicationError extends Error implements ErrorResponse {
  errorCode: string;
  statusCode: number;

  constructor(message: string, errorCode: string = 'UNKNOWN_ERROR', statusCode: number = 500) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    
    // Esto es necesario debido a cómo funciona la herencia de Error en TypeScript
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

/**
 * Error para representar recursos no encontrados
 */
export class ResourceNotFoundError extends ApplicationError {
  constructor(resource: string, id?: string) {
    const message = id 
      ? `El recurso ${resource} con id ${id} no fue encontrado` 
      : `El recurso ${resource} no fue encontrado`;
    super(message, 'RESOURCE_NOT_FOUND', 404);
  }
}

/**
 * Error para representar solicitudes inválidas
 */
export class BadRequestError extends ApplicationError {
  constructor(message: string) {
    super(message, 'BAD_REQUEST', 400);
  }
}

/**
 * Error para representar conflictos (por ejemplo, al intentar crear un recurso que ya existe)
 */
export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

/**
 * Error para representar problemas de autenticación
 */
export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'No autorizado') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

/**
 * Error para representar problemas de autorización
 */
export class ForbiddenError extends ApplicationError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 'FORBIDDEN', 403);
  }
}
