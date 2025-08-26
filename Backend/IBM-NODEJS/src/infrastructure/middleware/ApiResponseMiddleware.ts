// ApiResponseMiddleware.ts
// Middleware to wrap API responses

import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from 'http';

// Define the structure for the API response
interface Meta {
    message: string;
    statusCode: number;
    path: string;
    timestamp: string;
}

interface ApiResponse<T = any> {
    meta: Meta;
    data?: T;
    error?: any;
}

function apiResponseMiddleware(req: Request, res: Response, next: NextFunction) {
    // Preserve the original res.json method
    const originalJson = res.json.bind(res);

    res.json = (body?: any): Response => {
        // If the response is already wrapped, do not wrap again
        if (body && body.meta && (body.data !== undefined || body.error !== undefined)) {
            return originalJson(body);
        }

        const status = res.statusCode || 200;
        const message = status === 200 ? 'Success' : (STATUS_CODES[status] || 'Error');
        
        const meta: Meta = {
            message,
            statusCode: status,
            path: req.path,
            timestamp: new Date().toISOString()
        };

        const apiResponse: ApiResponse = { meta };

        if (status >= 400) {
            apiResponse.error = body;
        } else {
            apiResponse.data = body;
            apiResponse.error = null; // Agregar siempre error: null en respuestas exitosas
        }

        return originalJson(apiResponse);
    };

    next();
}

export default apiResponseMiddleware;
