import fs from 'fs';
import path from 'path';


export class LoggingService {
    private static instance: LoggingService;
    private logFilePath: string;


    private static readonly ICONS = {
        INFO: '🔵 ',
        SUCCESS: '✅ ',
        WARNING: '⚠️ ',
        ERROR: '❌ ',
        AUTH_SUCCESS: '🔑 ',
        AUTH_FAIL: '🔒 ',
        VALIDATION_ERROR: '📋 ',
        REQUEST: '📩 ',
        RESPONSE: '📤 ',
        SERVICE_CALL: '🔄 ',
        CONTROLLER: '🎮 ',
        DATABASE: '💾 ',
        TOKEN: '🎟️ ',
        USER: '👤 ',
        TIME: '⏱️ '
    };

    private constructor() {
     
        const logsDir = path.join(process.cwd(), 'resources', 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
        
    
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        this.logFilePath = path.join(logsDir, `auth-${formattedDate}.log`);
    }



    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

   

    private log(type: keyof typeof LoggingService.ICONS, message: string, details?: any): void {
        const timestamp = new Date().toISOString();
        const icon = LoggingService.ICONS[type] || LoggingService.ICONS.INFO;
        
        let logMessage = `${icon} [${timestamp}] ${message}`;
        
     
        if (details) {

            if (details instanceof Error) {
                logMessage += `\n    Mensaje: ${details.message}`;
                if (details.stack) {
                    logMessage += `\n    Stack: ${details.stack.split('\n').slice(1).join('\n    ')}`;
                }
            } else if (typeof details === 'object') {
                // Para objetos, convertirlos a string bonito
                logMessage += `\n    ${JSON.stringify(details, null, 4).replace(/\n/g, '\n    ')}`;
            } else {
                logMessage += `\n    ${details}`;
            }
        }
        

        fs.appendFileSync(this.logFilePath, logMessage + '\n\n');
        

    }


    public logAuthRequest(username: string): void {
        this.log('REQUEST', `Solicitud de autenticación recibida`, { username });
    }
    
    public logAuthSuccess(username: string): void {
        this.log('AUTH_SUCCESS', `Autenticación exitosa`, { username });
    }
    
    public logAuthFailure(username: string, reason: string): void {
        this.log('AUTH_FAIL', `Autenticación fallida`, { username, reason });
    }
    
    public logTokenGeneration(username: string): void {
        this.log('TOKEN', `Token JWT generado para usuario`, { username });
    }
    
    public logValidationError(error: any): void {
        this.log('VALIDATION_ERROR', `Error de validación de datos`, error);
    }
    
    public logControllerAction(controller: string, action: string, params?: any): void {
        this.log('CONTROLLER', `${controller}.${action} invocado`, params);
    }
    
    public logServiceAction(service: string, method: string, params?: any): void {
        this.log('SERVICE_CALL', `${service}.${method} invocado`, params);
    }
    
    public logResponseSent(statusCode: number, body?: any): void {
        this.log('RESPONSE', `Respuesta enviada con código ${statusCode}`, body);
    }
    
    public logError(error: Error): void {
        this.log('ERROR', `Error capturado`, error);
    }
    
    public logPerformance(operation: string, timeMs: number): void {
        this.log('TIME', `Rendimiento medido`, { operation, timeMs: `${timeMs}ms` });
    }
}
