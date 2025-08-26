import 'reflect-metadata';


export function LogMethod() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = function (...args: any[]) {
            const className = target.constructor.name;
            const methodName = propertyKey;
            // Extraer ID de transacción del contexto si existe (como en req.transactionId)
            let txnId = '';
            let transactionIdValue = '';
            
            // Verificar si alguno de los argumentos es un objeto de solicitud con transactionId
            if (args && args.length > 0) {
                for (const arg of args) {
                    if (arg && typeof arg === 'object' && arg.transactionId) {
                        transactionIdValue = arg.transactionId;
                        txnId = `🏷️ TXN[${transactionIdValue}] `;
                        break;
                    }
                }
            }
            
            // Si no hay ID de transacción, crear uno nuevo
            if (!transactionIdValue) {
                transactionIdValue = `TXN-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
                txnId = `🏷️ TXN[${transactionIdValue}] `;
                
                // Intentar asignar el ID de transacción al objeto de solicitud si existe
                if (args && args.length > 0) {
                    for (const arg of args) {
                        if (arg && typeof arg === 'object' && 
                            (arg.url || arg.method || arg.path || arg.headers)) {
                            arg.transactionId = transactionIdValue;
                            break;
                        }
                    }
                }
            }
            
            console.log(`🚀 ${txnId}${className}.${methodName} - INICIANDO`);
            
            try {
                const result = originalMethod.apply(this, args);
                
                // Verificar si el resultado es una Promise
                if (result && typeof result.then === 'function') {
                    // Método asíncrono - manejar con .then()
                    return result
                        .then((resolvedResult: any) => {
                            console.log(`✅ ${txnId}${className}.${methodName} - COMPLETADO (ASYNC)`);
                            return resolvedResult;
                        })
                        .catch((error: any) => {
                            console.error(`❌ ${txnId}${className}.${methodName} - ERROR (ASYNC):`, error);
                            throw error;
                        });
                } else {
                    // Método síncrono - retornar directamente
                    console.log(`✅ ${txnId}${className}.${methodName} - COMPLETADO (SYNC)`);
                    return result;
                }
            } catch (error) {
                console.error(`❌ ${txnId}${className}.${methodName} - ERROR (SYNC):`, error);
                throw error;
            }
        };
        
        return descriptor;
    };
}


export function LogClass() {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        const propertyNames = Object.getOwnPropertyNames(constructor.prototype);
        
        for (const propertyName of propertyNames) {
            if (propertyName === 'constructor') continue;
            
            const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, propertyName);
            if (descriptor && typeof descriptor.value === 'function') {
                const newDescriptor = LogMethod()(constructor.prototype, propertyName, descriptor);
                Object.defineProperty(constructor.prototype, propertyName, newDescriptor);
            }
        }
        
        return constructor;
    };
}


export const Service = () => LogClass();
export const Controller = () => LogClass();
export const Repository = () => LogClass();
export const Timed = () => LogMethod();