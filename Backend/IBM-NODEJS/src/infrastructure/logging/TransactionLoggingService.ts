import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

// Extender el objeto global para almacenar el ID de transacción
declare global {
    var currentTransactionId: string | undefined;
}

/**
 * Enumeration para estados de operación
 */
export enum OperationState {
    STARTED = 'STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    TERMINATED = 'TERMINATED'
}

/**
 * Configuración para representación visual de estados
 */
interface StateConfig {
    emoji: string;
    description: string;
    color: (text: string) => string;
}

/**
 * Servicio para logging de transacciones
 */
export class TransactionLoggingService {
    private static instance: TransactionLoggingService;
    private logFilePath: string;
    private transactionData: Map<string, any> = new Map();

    // Configuración visual de estados
    private static readonly STATE_CONFIG: Record<OperationState, StateConfig> = {
        [OperationState.STARTED]: {
            emoji: '🚀',
            description: 'Iniciando',
            color: chalk.blue
        },
        [OperationState.IN_PROGRESS]: {
            emoji: '⚙️',
            description: 'En proceso',
            color: chalk.cyan
        },
        [OperationState.COMPLETED]: {
            emoji: '✅',
            description: 'Completado',
            color: chalk.green
        },
        [OperationState.WARNING]: {
            emoji: '⚠️',
            description: 'Advertencia',
            color: chalk.yellow
        },
        [OperationState.ERROR]: {
            emoji: '❌',
            description: 'Error',
            color: chalk.red
        },
        [OperationState.TERMINATED]: {
            emoji: '🛑',
            description: 'Terminado',
            color: chalk.magenta
        }
    };

    private constructor() {
        // Crear directorio de logs si no existe
        const logsDir = path.join(process.cwd(), 'src', 'infrastructure', 'resources', 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
        
        // Definir ruta del archivo de logs con fecha actual
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        this.logFilePath = path.join(logsDir, `transactions-${formattedDate}.log`);
    }

    /**
     * Obtener la instancia del servicio de logs (patrón Singleton)
     */
    public static getInstance(): TransactionLoggingService {
        if (!TransactionLoggingService.instance) {
            TransactionLoggingService.instance = new TransactionLoggingService();
        }
        return TransactionLoggingService.instance;
    }

    /**
     * Genera un nuevo ID de transacción o devuelve uno existente
     */
    public getOrCreateTransactionId(): string {
        const existingId = this.getTransactionId();
        if (existingId) {
            return existingId;
        }
        return this.createTransactionId();
    }

    /**
     * Crea un nuevo ID de transacción
     */
    public createTransactionId(): string {
        return `TXN-${uuidv4().substring(0, 8).toUpperCase()}`;
    }

    /**
     * Obtiene el ID de transacción actual (si existe)
     */
    public getTransactionId(): string | undefined {
        return global.currentTransactionId;
    }

    /**
     * Establece el ID de transacción actual en el contexto global
     */
    public setTransactionId(id: string): void {
        global.currentTransactionId = id;
    }

    /**
     * Limpia el ID de transacción actual
     */
    public clearTransactionId(): void {
        delete global.currentTransactionId;
    }

    /**
     * Guarda datos temporales asociados a una transacción
     */
    public setTransactionData(transactionId: string, key: string, value: any): void {
        if (!this.transactionData.has(transactionId)) {
            this.transactionData.set(transactionId, {});
        }
        this.transactionData.get(transactionId)[key] = value;
    }

    /**
     * Obtiene datos temporales asociados a una transacción
     */
    public getTransactionData(transactionId: string, key: string): any {
        return this.transactionData.has(transactionId) 
            ? this.transactionData.get(transactionId)[key] 
            : undefined;
    }

    /**
     * Limpia los datos de una transacción
     */
    public clearTransactionData(transactionId: string): void {
        this.transactionData.delete(transactionId);
    }

    /**
     * Registra el estado de una transacción
     */
    public logTransactionState(
        state: OperationState,
        className: string,
        methodName: string,
        contextInfo?: string,
        details?: any
    ): void {
        const transactionId = this.getOrCreateTransactionId();
        const timestamp = new Date().toISOString();
        const stateConfig = TransactionLoggingService.STATE_CONFIG[state];
        
        // Extraer solo el nombre de la clase sin el namespace
        const shortClassName = className.substring(className.lastIndexOf('.') + 1);
        
        // Formatear el mensaje de log
        const message = `🏷️  TXN[${transactionId}] | ${stateConfig.emoji} ${stateConfig.description}: ${shortClassName}.${methodName} | ⏰ ${timestamp}${contextInfo ? ` | 📍 ${contextInfo}` : ''}`;
        
        // Procesar detalles según método específico
        let processedDetails: any = undefined;
        
        // Método específico: UserRepository.loadUsers
        if (shortClassName === 'UserRepository' && methodName === 'loadUsers') {
            if (details && Array.isArray(details)) {
                processedDetails = `[Datos de ${details.length} usuarios cargados]`;
            } else {
                processedDetails = `[No se pudieron cargar los usuarios]`;
            }
        }
        // Método específico: AuthService.login
        else if (shortClassName === 'AuthService' && methodName === 'login') {
            if (details && typeof details === 'object' && details.username) {
                processedDetails = `Usuario "${details.username}" autenticado`;
            } else {
                processedDetails = details;
            }
        }
        // Caso general: sanitizar
        else if (details !== undefined) {
            processedDetails = this.sanitizeForLog(details);
        }
        
        // Log a consola con colores
        if (processedDetails) {
            console.log(stateConfig.color(message), ' | 📄 Details:', processedDetails);
        } else {
            console.log(stateConfig.color(message));
        }
        
        // Log a archivo solo en estados importantes
        const shouldLogToFile = state === OperationState.ERROR || 
                              state === OperationState.WARNING ||
                              state === OperationState.COMPLETED ||
                              state === OperationState.STARTED;
        
        if (shouldLogToFile) {
            this.writeToFile(message, processedDetails);
        }
    }

    /**
     * Escribe un mensaje de log en el archivo
     */
    private writeToFile(message: string, details?: any): void {
        try {
            let logEntry = message;
            
            // Limitar la cantidad de detalles escritos en el archivo
            if (details) {
                if (typeof details === 'object') {
                    // Simplificar los detalles para el archivo de log
                    const simplifiedDetails = this.simplifyForFileLog(details);
                    logEntry += ` | 📄 Details: ${JSON.stringify(simplifiedDetails)}`;
                } else {
                    // Si no es un objeto, truncar si es muy largo
                    const detailsStr = String(details);
                    logEntry += ` | 📄 Details: ${detailsStr.length > 500 ? detailsStr.substring(0, 500) + '...' : detailsStr}`;
                }
            }
            
            fs.appendFileSync(this.logFilePath, logEntry + '\n\n');
        } catch (error) {
            console.warn('No se pudo escribir al archivo de log:', error);
        }
    }
    
    /**
     * Simplifica un objeto para guardarlo en el archivo de log
     */
    private simplifyForFileLog(data: any): any {
        // Si es nulo o indefinido, devolver tal cual
        if (data === null || data === undefined) return data;
        
        // Si es un string ya procesado
        if (typeof data === 'string' && 
           (data.startsWith('[') || data.startsWith('Usuario'))) {
            return data;
        }
        
        // Si es un error, solo extraer mensaje y stack
        if (data instanceof Error) {
            return {
                message: data.message,
                stack: data.stack ? (data.stack.split('\n').slice(0, 3).join('\n') + '...') : undefined
            };
        }
        
        // Si no es un objeto, devolver tal cual
        if (typeof data !== 'object') return data;
        
        // Detectar si es una lista de usuarios
        if (Array.isArray(data) && data.length > 0 && 
            data[0] && typeof data[0] === 'object' && 
            'username' in data[0] && 'response' in data[0]) {
            return `[Lista de ${data.length} usuarios cargados]`;
        }
        
        // Para arrays, limitar a los primeros elementos
        if (Array.isArray(data)) {
            return data.length > 2 ? 
                `[Array con ${data.length} elementos]` : data;
        }
        
        // Para objetos, extraer solo propiedades importantes
        const result: any = {};
        const keys = Object.keys(data);
        
        // Limitar a las primeras 5 propiedades
        const keysToInclude = keys.slice(0, 5);
        
        for (const key of keysToInclude) {
            const value = data[key];
            
            // Tratar valores de forma específica según su tipo
            if (value === null || value === undefined) {
                result[key] = value;
            } else if (typeof value === 'object') {
                // Para objetos anidados, solo indicar su tipo
                if (Array.isArray(value)) {
                    result[key] = `[Array con ${value.length} elementos]`;
                } else {
                    result[key] = `[Objeto]`;
                }
            } else if (typeof value === 'string' && value.length > 50) {
                // Truncar strings largos
                result[key] = value.substring(0, 50) + '...';
            } else {
                result[key] = value;
            }
        }
        
        // Indicar si hay más propiedades
        if (keys.length > 5) {
            result['...'] = `y ${keys.length - 5} propiedades más`;
        }
        
        return result;
    }

    /**
     * Sanitiza los datos para logging (oculta información sensible)
     */
    private sanitizeForLog(data: any, depth: number = 0, maxDepth: number = 3): any {
        // Prevenir recursión infinita estableciendo un límite de profundidad más bajo
        if (depth > maxDepth) return "[Objeto anidado]";
        
        // Para null o undefined, devolver como está
        if (data === null || data === undefined) return data;
        
        // Si es un tipo primitivo, devolver directamente
        if (typeof data !== 'object') {
            // Si es un string, ocultar contraseñas y limitar tamaño
            if (typeof data === 'string') {
                if (data.toLowerCase().includes('password') || 
                    data.toLowerCase().includes('contraseña')) {
                    return '***SENSITIVE_DATA_HIDDEN***';
                }
                return data.length > 100 ? data.substring(0, 100) + '...' : data;
            }
            return data;
        }
        
        // Si es un error, extraer solo mensaje y stack
        if (data instanceof Error) {
            return {
                message: data.message,
                stack: data.stack
            };
        }
        
        // Detectar objetos que podrían causar recursión o son internos de Node/Express
        // Devolver un resumen en lugar de procesar estos objetos
        const internalObjectNames = [
            '_events', '_eventsCount', '_maxListeners', 'socket', 'connection', 
            'client', 'parser', '_readableState', '_writableState', 'req', 'res',
            'app', 'httpVersionMajor', 'httpVersionMinor', 'httpVersion', 'complete',
            'rawHeaders', 'rawTrailers', 'aborted', 'upgrade', 'statusCode', 'statusMessage',
            '_consuming', '_dumped', 'next', 'baseUrl', 'originalUrl', '_parsedUrl'
        ];
        
        // Ignorar por completo objetos internos complejos
        for (const key of internalObjectNames) {
            if (key in data) {
                return depth === 0 ? this.sanitizeTopLevelObjectSimplified(data) : "[Objeto interno]";
            }
        }
        
        // ** NUEVO: Detectar si estamos procesando el resultado de UserRepository.loadUsers **
        if (depth === 0 && Array.isArray(data) && data.length > 0 && 
            data[0] && typeof data[0] === 'object' && 
            'username' in data[0] && 'response' in data[0]) {
            return `[Lista de ${data.length} usuarios cargados]`;
        }
        
        // Si es un array, simplificarlo mucho más que antes
        if (Array.isArray(data)) {
            // Nivel superior: solo indicar cantidad de elementos
            if (depth === 0 && data.length > 2) {
                return `[Array con ${data.length} elementos]`;
            }
            // Nivel anidado: mostrar mínimo
            else if (data.length > 3) {
                return `[Array con ${data.length} elementos]`;
            }
            // Arrays pequeños: procesar
            return data.map(item => this.sanitizeForLog(item, depth + 1, maxDepth));
        }
        
        // Para objetos normales, sanitizar solo propiedades básicas
        const sanitized: any = {};
        
        // En nivel superior, reducir aún más la información para objetos grandes
        const maxKeys = depth === 0 ? 5 : 3;
        const keysToProcess = Object.keys(data).slice(0, maxKeys);
        
        for (const key of keysToProcess) {
            // Ocultar propiedades sensibles
            if (key.toLowerCase().includes('password') || 
                key.toLowerCase().includes('contraseña') ||
                key.toLowerCase().includes('token') ||
                key.toLowerCase().includes('secret')) {
                sanitized[key] = '***SENSITIVE_DATA_HIDDEN***';
            } 
            // Ignorar funciones y símbolos
            else if (typeof data[key] === 'function' || typeof data[key] === 'symbol') {
                // No incluir en el log
            }
            // Para objetos anidados, solo indicar tipo
            else if (typeof data[key] === 'object' && data[key] !== null) {
                if (Array.isArray(data[key])) {
                    sanitized[key] = `[Array: ${data[key].length} elementos]`;
                } else {
                    sanitized[key] = `[Objeto]`;
                }
            }
            // Valores primitivos
            else {
                try {
                    sanitized[key] = data[key];
                } catch (e) {
                    sanitized[key] = "[Error al procesar]";
                }
            }
        }
        
        // Indicar si hay más propiedades
        if (Object.keys(data).length > maxKeys) {
            sanitized["..."] = `y ${Object.keys(data).length - maxKeys} propiedades más`;
        }
        
        return sanitized;
    }
    
    /**
     * Versión simplificada para objetos complejos de nivel superior
     * Extrae solo la información básica relevante
     */
    private sanitizeTopLevelObjectSimplified(data: any): any {
        // Para objetos de solicitud HTTP, extraer solo información esencial
        if (data.method && data.path) {
            return {
                path: data.path || data.url,
                method: data.method,
                params: data.params || {},
                query: data.query || {},
                body: this.sanitizeRequestBody(data.body),
                headers: this.sanitizeRequestHeaders(data.headers)
            };
        }
        
        // Para otros objetos, extraer las propiedades básicas de forma segura
        const result: any = {};
        const basicProps = ['id', 'name', 'type', 'status', 'message', 'code', 'timestamp'];
        
        for (const prop of basicProps) {
            if (prop in data) {
                result[prop] = data[prop];
            }
        }
        
        // Si no hay propiedades básicas, indicar que es un objeto complejo
        if (Object.keys(result).length === 0) {
            return "[Objeto complejo - detalles omitidos]";
        }
        
        return result;
    }
    
    /**
     * Sanitiza específicamente el cuerpo de la solicitud
     */
    private sanitizeRequestBody(body: any): any {
        if (!body) return {};
        
        // Si es un tipo primitivo, devolver como está
        if (typeof body !== 'object') return body;
        
        const sanitized: any = {};
        for (const key in body) {
            // Ocultar propiedades sensibles
            if (key.toLowerCase().includes('password') || 
                key.toLowerCase().includes('contraseña') ||
                key.toLowerCase().includes('token') ||
                key.toLowerCase().includes('secret')) {
                sanitized[key] = '***SENSITIVE_DATA_HIDDEN***';
            } else {
                sanitized[key] = body[key];
            }
        }
        
        return sanitized;
    }
    
    /**
     * Sanitiza específicamente los headers de la solicitud
     */
    private sanitizeRequestHeaders(headers: any): any {
        if (!headers) return {};
        
        const sanitized: any = {};
        const sensitiveHeaders = [
            'authorization', 'cookie', 'x-api-key', 'password', 
            'token', 'secret', 'credentials', 'api-key'
        ];
        
        // Seleccionar solo headers importantes
        const importantHeaders = [
            'content-type', 'user-agent', 'accept', 'host', 
            'origin', 'referer', 'content-length'
        ];
        
        for (const header of importantHeaders) {
            if (headers[header]) {
                sanitized[header] = headers[header];
            }
        }
        
        // Marcar headers sensibles como redactados
        for (const header of sensitiveHeaders) {
            if (headers[header]) {
                sanitized[header] = '***REDACTED***';
            }
        }
        
        return sanitized;
    }

    /**
     * Obtiene información del contexto HTTP (si existe)
     */
    public getHttpContext(req?: any): string {
        try {
            if (req) {
                return `🌐 ${req.method} ${req.url} | 📡 ${req.ip || req.connection.remoteAddress}`;
            }
            return '🔧 Non-HTTP Context';
        } catch (error) {
            return '🔧 Non-HTTP Context';
        }
    }
}

// Exportar una instancia del servicio
export const transactionLogger = TransactionLoggingService.getInstance();
