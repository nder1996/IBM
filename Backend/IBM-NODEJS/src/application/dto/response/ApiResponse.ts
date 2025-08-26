/**
 * Interfaz que define la estructura básica de respuestas de error
 */
export interface ErrorResponse {
  errorCode: string;
  statusCode: number;
  message: string;
}

/**
 * Clase genérica para estandarizar las respuestas de la API
 */
export class ApiResponse<T> {
  meta: Meta;
  data?: T;
  error?: ErrorDetails;

  constructor(meta: Meta, data?: T, error?: ErrorDetails) {
    this.meta = meta;
    this.data = data;
    this.error = error;
  }

  /**
   * Método para crear respuestas exitosas
   * @param data Datos a retornar
   * @param message Mensaje descriptivo
   * @param statusCode Código de estado HTTP
   * @param path Ruta de la petición
   * @returns Instancia de ApiResponse con los datos proporcionados
   */
  static success<T>(
    data: T,
    message: string = 'Operación exitosa',
    statusCode: number = 200,
    path: string = ''
  ): ApiResponse<T> {
    const meta = new Meta(message, statusCode, path, new Date().toISOString());
    return new ApiResponse<T>(meta, data);
  }

  /**
   * Método para crear respuestas de error
   * @param code Código de error
   * @param description Descripción del error
   * @param statusCode Código de estado HTTP
   * @param path Ruta de la petición
   * @returns Instancia de ApiResponse con los detalles del error
   */
  static error<T>(
    code: string,
    description: string,
    statusCode: number = 500,
    path: string = ''
  ): ApiResponse<T> {
    const meta = new Meta('Error', statusCode, path, new Date().toISOString());
    const error = new ErrorDetails(code, description);
    return new ApiResponse<T>(meta, undefined, error);
  }
}

/**
 * Clase para los metadatos de la respuesta
 */
export class Meta {
  message: string;
  statusCode: number;
  path: string;
  timestamp: string;

  constructor(
    message: string,
    statusCode: number,
    path: string,
    timestamp: string
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.path = path;
    this.timestamp = timestamp;
  }
}

/**
 * Clase para los detalles de error
 */
export class ErrorDetails {
  code: string;
  description: string;

  constructor(code: string, description: string) {
    this.code = code;
    this.description = description;
  }
}
