import 'reflect-metadata';
import { transactionLogger, OperationState } from '../logging/TransactionLoggingService';

/**
 * Decorador que intercepta las llamadas a métodos para registrar logs de transacciones
 * Equivalente a @Around en Spring AOP
 * 
 * @example
 * ```
 * @LogMethod()
 * public async findUser(userId: string): Promise<User> {
 *   // El método será interceptado automáticamente
 * }
 * ```
 */
export function LogMethod() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // Guardar la referencia al método original
        const originalMethod = descriptor.value;
        
        // Reemplazar el método con un wrapper
        descriptor.value = async function (...args: any[]) {
            // Determinar si el método es estático o de instancia
            const isStatic = typeof target === 'function';
            const className = isStatic ? target.name : target.constructor.name;
            const methodName = propertyKey;
            
            // Obtener o crear ID de transacción
            const transactionId = transactionLogger.getOrCreateTransactionId();
            const startTime = Date.now();
            
            try {
                // Registrar inicio de la operación
                transactionLogger.logTransactionState(
                    OperationState.STARTED, 
                    className, 
                    methodName, 
                    undefined, 
                    args.length > 0 ? args : undefined
                );
                
                // Marcar la operación como en progreso
                transactionLogger.logTransactionState(
                    OperationState.IN_PROGRESS, 
                    className, 
                    methodName
                );
                
                // Ejecutar el método original
                const result = await originalMethod.apply(this, args);
                
                // Registrar finalización exitosa
                const duration = Date.now() - startTime;
                transactionLogger.logTransactionState(
                    OperationState.COMPLETED, 
                    className, 
                    methodName, 
                    `Duration: ${duration}ms`, 
                    result
                );
                
                // Devolver el resultado original
                return result;
            } catch (error) {
                // Registrar error
                const duration = Date.now() - startTime;
                const errorInfo = `Duration: ${duration}ms | Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
                
                if (error instanceof Error && error.name === 'ValidationError') {
                    transactionLogger.logTransactionState(
                        OperationState.WARNING, 
                        className, 
                        methodName, 
                        errorInfo, 
                        error
                    );
                } else {
                    transactionLogger.logTransactionState(
                        OperationState.ERROR, 
                        className, 
                        methodName, 
                        errorInfo, 
                        error
                    );
                }
                
                // Re-lanzar el error original
                throw error;
            } finally {
                // Registrar terminación en cualquier caso
                const totalDuration = Date.now() - startTime;
                transactionLogger.logTransactionState(
                    OperationState.TERMINATED, 
                    className, 
                    methodName, 
                    `Total Duration: ${totalDuration}ms`
                );
                
                // Limpiar datos de transacción
                transactionLogger.clearTransactionData(transactionId);
            }
        };
        
        return descriptor;
    };
}

/**
 * Decorador que marca una clase para que todos sus métodos sean interceptados
 * Equivalente a @Aspect en Spring AOP
 * 
 * @example
 * ```
 * @LogClass()
 * export class UserService {
 *   // Todos los métodos de la clase serán interceptados
 * }
 * ```
 */
export function LogClass() {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        // Obtener todos los nombres de métodos del prototipo
        const propertyNames = Object.getOwnPropertyNames(constructor.prototype);
        
        // Iterar sobre todos los métodos (excepto el constructor)
        for (const propertyName of propertyNames) {
            if (propertyName === 'constructor') continue;
            
            // Obtener el descriptor del método
            const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, propertyName);
            
            // Verificar si es un método y no está ya decorado
            if (descriptor && typeof descriptor.value === 'function') {
                // Aplicar el decorador LogMethod a este método
                const newDescriptor = LogMethod()(constructor.prototype, propertyName, descriptor);
                
                // Actualizar el descriptor en el prototipo
                Object.defineProperty(constructor.prototype, propertyName, newDescriptor);
            }
        }
        
        return constructor;
    };
}

/**
 * Decorador específico para controladores
 * Intercepta y registra automáticamente todas las operaciones en controladores
 * 
 * @example
 * ```
 * @Controller()
 * export class UserController {
 *   // Todos los métodos del controlador serán interceptados
 * }
 * ```
 */
export function Controller() {
    return LogClass();
}

/**
 * Decorador específico para servicios
 * Intercepta y registra automáticamente todas las operaciones en servicios
 * 
 * @example
 * ```
 * @Service()
 * export class UserService {
 *   // Todos los métodos del servicio serán interceptados
 * }
 * ```
 */
export function Service() {
    return LogClass();
}

/**
 * Decorador específico para repositorios
 * Intercepta y registra automáticamente todas las operaciones en repositorios
 * 
 * @example
 * ```
 * @Repository()
 * export class UserRepository {
 *   // Todos los métodos del repositorio serán interceptados
 * }
 * ```
 */
export function Repository() {
    return LogClass();
}

/**
 * Decorador para medir el rendimiento de un método
 * Registra específicamente el tiempo de ejecución
 * 
 * @example
 * ```
 * @Timed()
 * public async findAllUsers(): Promise<User[]> {
 *   // El tiempo de ejecución será registrado
 * }
 * ```
 */
export function Timed() {
    return LogMethod();
}
