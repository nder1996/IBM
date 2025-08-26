import { ErrorResponse } from '../../application/dto/response/ApiResponse';


export class ApplicationError extends Error implements ErrorResponse {
  errorCode: string;
  statusCode: number;

  constructor(message: string, errorCode: string = 'UNKNOWN_ERROR', statusCode: number = 500) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    

    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}


export class ResourceNotFoundError extends ApplicationError {
  constructor(resource: string, id?: string) {
    const message = id 
      ? `El recurso ${resource} con id ${id} no fue encontrado` 
      : `El recurso ${resource} no fue encontrado`;
    super(message, 'RESOURCE_NOT_FOUND', 404);
  }
}


export class BadRequestError extends ApplicationError {
  constructor(message: string) {
    super(message, 'BAD_REQUEST', 400);
  }
}


export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}


export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'No autorizado') {
    super(message, 'UNAUTHORIZED', 401);
  }
}


export class ForbiddenError extends ApplicationError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 'FORBIDDEN', 403);
  }
}
