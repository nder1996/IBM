// src/infrastructure/aspect/LoggingAspect.ts - VERSIÓN ARREGLADA Y SIMPLE
import 'reflect-metadata';

/**
 * Decorador simple para logging
 */
export function LogMethod() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function (...args: any[]) {
            const className = target.constructor.name;
            const methodName = propertyKey;
            
            console.log(`🚀 ${className}.${methodName} - INICIANDO`);
            
            try {
                const result = await originalMethod.apply(this, args);
                console.log(`✅ ${className}.${methodName} - COMPLETADO`);
                return result;
            } catch (error) {
                console.error(`❌ ${className}.${methodName} - ERROR:`, error);
                throw error;
            }
        };
        
        return descriptor;
    };
}

/**
 * Decorador para aplicar logging a toda una clase
 */
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

// Decoradores específicos - AHORA SÍ FUNCIONAN
export const Service = () => LogClass();
export const Controller = () => LogClass();
export const Repository = () => LogClass();
export const Timed = () => LogMethod();