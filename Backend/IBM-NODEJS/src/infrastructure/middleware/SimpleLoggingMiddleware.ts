// src/infrastructure/middleware/SimpleLoggingMiddleware.ts
import { Request, Response, NextFunction } from 'express';

/**
 * ========================================
 * MIDDLEWARE DE LOGGING SIMPLIFICADO
 * ========================================
 * Reemplaza el complejo TransactionLoggingMiddleware
 * con una versión simple y clara
 */

/**
 * Middleware para logging de requests HTTP
 * - Registra todas las peticiones entrantes
 * - Mide tiempo de respuesta
 * - Muestra códigos de estado con iconos
 */
export function simpleLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const requestInfo = `${req.method} ${req.originalUrl || req.url}`;
    
    // 📩 Log de request entrante
    console.log(`📩 [${timestamp}] Request: ${requestInfo}`);
    
    // Log adicional para requests con body (POST, PUT, PATCH)
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        // Sanitizar el body para no mostrar passwords
        const sanitizedBody = sanitizeRequestBody(req.body);
        console.log(`   📋 Body:`, sanitizedBody);
    }
    
    // Interceptar el método res.send() para capturar la respuesta
    const originalSend = res.send;
    res.send = function(body): Response {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const status = res.statusCode;
        
        // Determinar icono según código de estado
        let statusIcon = '✅'; // 200-299
        if (status >= 400 && status < 500) statusIcon = '⚠️';  // 400-499
        if (status >= 500) statusIcon = '❌'; // 500+
        
        // 📤 Log de response
        const responseInfo = `${requestInfo} → ${status} (${duration}ms)`;
        console.log(`📤 [${new Date().toISOString()}] Response: ${responseInfo} ${statusIcon}`);
        
        // Log adicional para errores
        if (status >= 400) {
            console.log(`   ⚠️  Error details: Status ${status}`);
        }
        
        // Ejecutar el método original
        return originalSend.call(this, body);
    };
    
    // Continuar con la cadena de middleware
    next();
}

/**
 * Función auxiliar para sanitizar el cuerpo de la request
 * Oculta campos sensibles como passwords
 */
function sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') {
        return body;
    }
    
    const sanitized = { ...body };
    
    // Lista de campos sensibles a ocultar
    const sensitiveFields = ['password', 'contraseña', 'token', 'secret', 'key'];
    
    for (const field of sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '***HIDDEN***';
        }
    }
    
    return sanitized;
}

/**
 * Middleware de logging con configuración personalizable
 * Versión extendida para casos específicos
 */
export function createLoggingMiddleware(options: {
    showBody?: boolean;
    showHeaders?: boolean;
    excludePaths?: string[];
} = {}) {
    const { showBody = true, showHeaders = false, excludePaths = [] } = options;
    
    return (req: Request, res: Response, next: NextFunction) => {
        // Skip logging para paths excluidos
        if (excludePaths.some(path => req.originalUrl?.includes(path))) {
            return next();
        }
        
        const startTime = Date.now();
        const timestamp = new Date().toISOString();
        const requestInfo = `${req.method} ${req.originalUrl || req.url}`;
        
        console.log(`📩 [${timestamp}] ${requestInfo}`);
        
        // Mostrar headers si está habilitado
        if (showHeaders) {
            console.log(`   📋 Headers:`, sanitizeHeaders(req.headers));
        }
        
        // Mostrar body si está habilitado
        if (showBody && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
            console.log(`   📄 Body:`, sanitizeRequestBody(req.body));
        }
        
        // Interceptar respuesta
        const originalSend = res.send;
        res.send = function(body): Response {
            const duration = Date.now() - startTime;
            const status = res.statusCode;
            const statusIcon = status >= 400 ? (status >= 500 ? '❌' : '⚠️') : '✅';
            
            console.log(`📤 [${new Date().toISOString()}] ${requestInfo} → ${status} (${duration}ms) ${statusIcon}`);
            
            return originalSend.call(this, body);
        };
        
        next();
    };
}

/**
 * Sanitizar headers (ocultar Authorization, cookies, etc.)
 */
function sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    
    for (const header of sensitiveHeaders) {
        if (sanitized[header]) {
            sanitized[header] = '***HIDDEN***';
        }
    }
    
    return sanitized;
}