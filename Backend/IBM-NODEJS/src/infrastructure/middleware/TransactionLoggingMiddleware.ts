import { Request, Response, NextFunction } from 'express';
import { transactionLogger, OperationState } from '../logging/TransactionLoggingService';

/**
 * Middleware para interceptar y registrar todas las solicitudes HTTP
 * Equivalente a una parte del comportamiento de LoggingAspect en Spring
 */
export function transactionLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
    // Generar un ID de transacción único
    const transactionId = transactionLogger.createTransactionId();
    transactionLogger.setTransactionId(transactionId);
    
    // Guardar la hora de inicio
    const startTime = Date.now();
    
    // Obtener información del contexto HTTP
    const httpContext = transactionLogger.getHttpContext(req);
    
    // Establecer el ID de transacción en los headers de respuesta
    res.setHeader('X-Transaction-ID', transactionId);
    
    // Añadir el ID de transacción al objeto de solicitud para que esté disponible en otros middlewares
    (req as any).transactionId = transactionId;
    
    // Registrar inicio de la solicitud
    transactionLogger.logTransactionState(
        OperationState.STARTED,
        'HttpRequest', 
        req.method,
        httpContext,
        {
            path: req.path,
            params: req.params,
            query: req.query,
            // Solo incluir el cuerpo en solicitudes POST/PUT/PATCH
            body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined,
            // Solo incluir headers importantes
            headers: sanitizeHeaders(req.headers)
        }
    );

    // Interceptar el método res.send para registrar la respuesta
    const originalSend = res.send;
    res.send = function(body): Response {
        // Calcular duración
        const duration = Date.now() - startTime;
        
        // Registrar finalización de la solicitud
        const state = res.statusCode >= 400 ? OperationState.WARNING : OperationState.COMPLETED;
        
        // Simplificar el body de la respuesta
        let logBody;
        try {
            // Si es un JSON, solo tomar el meta o los primeros campos
            if (typeof body === 'string' && body.startsWith('{')) {
                const parsedBody = JSON.parse(body);
                // Solo incluir la metadata o un resumen
                logBody = parsedBody.meta || 
                          (Object.keys(parsedBody).length > 5 ? 
                             { summary: `Respuesta con ${Object.keys(parsedBody).length} campos` } : 
                             parsedBody);
            } else {
                // Si no es JSON o es muy largo, omitir
                logBody = typeof body === 'string' && body.length > 200 ? 
                         `[Respuesta con ${body.length} caracteres]` : body;
            }
        } catch (e) {
            logBody = `[Respuesta no procesable: ${typeof body}]`;
        }
        
        transactionLogger.logTransactionState(
            state,
            'HttpResponse',
            req.method,
            `${httpContext} | Status: ${res.statusCode} | Duration: ${duration}ms`,
            logBody
        );
        
        // Limpiar el ID de transacción
        transactionLogger.clearTransactionId();
        
        // Ejecutar el método original
        return originalSend.call(this, body);
    };
    
    // Continuar con la cadena de middleware
    next();
}

/**
 * Sanitiza los headers para el log (elimina información sensible)
 */
function sanitizeHeaders(headers: any): any {
    if (!headers) return {};
    
    // Solo incluir headers importantes
    const importantHeaders = [
        'content-type', 'user-agent', 'accept', 'host', 
        'origin', 'referer', 'content-length'
    ];
    
    const sanitized: any = {};
    
    // Incluir solo headers importantes
    importantHeaders.forEach(header => {
        if (headers[header]) {
            sanitized[header] = headers[header];
        }
    });
    
    // Incluir headers de autorización pero sanitizados
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'password', 'token'];
    
    sensitiveHeaders.forEach(header => {
        if (headers[header]) {
            sanitized[header] = '***REDACTED***';
        }
    });
    
    return sanitized;
}

export default transactionLoggingMiddleware;
