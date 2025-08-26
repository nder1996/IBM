// src/infrastructure/middleware/SimpleLoggingMiddleware.ts
import { Request, Response, NextFunction } from 'express';


export function simpleLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const requestInfo = `${req.method} ${req.originalUrl || req.url}`;
    

    console.log(`📩 [${timestamp}] Request: ${requestInfo}`);
    

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        const sanitizedBody = sanitizeRequestBody(req.body);
        console.log(`   📋 Body:`, sanitizedBody);
    }
    

    const originalSend = res.send;
    res.send = function(body): Response {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const status = res.statusCode;
        

        let statusIcon = '✅'; // 200-299
        if (status >= 400 && status < 500) statusIcon = '⚠️';  // 400-499
        if (status >= 500) statusIcon = '❌'; // 500+
        
        // 📤 Log de response
        const responseInfo = `${requestInfo} → ${status} (${duration}ms)`;
        console.log(`📤 [${new Date().toISOString()}] Response: ${responseInfo} ${statusIcon}`);
        
        if (status >= 400) {
            console.log(`   ⚠️  Error details: Status ${status}`);
        }
        
        return originalSend.call(this, body);
    };
    

    next();
}


function sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') {
        return body;
    }
    
    const sanitized = { ...body };
    

    const sensitiveFields = ['password', 'contraseña', 'token', 'secret', 'key'];
    
    for (const field of sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '***HIDDEN***';
        }
    }
    
    return sanitized;
}


export function createLoggingMiddleware(options: {
    showBody?: boolean;
    showHeaders?: boolean;
    excludePaths?: string[];
} = {}) {
    const { showBody = true, showHeaders = false, excludePaths = [] } = options;
    
    return (req: Request, res: Response, next: NextFunction) => {

        if (excludePaths.some(path => req.originalUrl?.includes(path))) {
            return next();
        }
        
        const startTime = Date.now();
        const timestamp = new Date().toISOString();
        const requestInfo = `${req.method} ${req.originalUrl || req.url}`;
        
        console.log(`📩 [${timestamp}] ${requestInfo}`);
        
   
        if (showHeaders) {
            console.log(`   📋 Headers:`, sanitizeHeaders(req.headers));
        }
        

        if (showBody && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
            console.log(`   📄 Body:`, sanitizeRequestBody(req.body));
        }
        

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