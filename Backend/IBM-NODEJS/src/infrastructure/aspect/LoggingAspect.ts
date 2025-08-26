import 'reflect-metadata';


export function LogMethod() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = function (...args: any[]) {
            const className = target.constructor.name;
            const methodName = propertyKey;
            
            console.log(`🚀 ${className}.${methodName} - INICIANDO`);
            
            try {
                const result = originalMethod.apply(this, args);
                
                // Verificar si el resultado es una Promise
                if (result && typeof result.then === 'function') {
                    // Método asíncrono - manejar con .then()
                    return result
                        .then((resolvedResult: any) => {
                            console.log(`✅ ${className}.${methodName} - COMPLETADO (ASYNC)`);
                            return resolvedResult;
                        })
                        .catch((error: any) => {
                            console.error(`❌ ${className}.${methodName} - ERROR (ASYNC):`, error);
                            throw error;
                        });
                } else {
                    // Método síncrono - retornar directamente
                    console.log(`✅ ${className}.${methodName} - COMPLETADO (SYNC)`);
                    return result;
                }
            } catch (error) {
                console.error(`❌ ${className}.${methodName} - ERROR (SYNC):`, error);
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