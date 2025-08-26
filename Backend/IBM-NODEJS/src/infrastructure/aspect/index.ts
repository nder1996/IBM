/**
 * Este archivo configura la programación orientada a aspectos (AOP) en todo el sistema.
 * Al importar este archivo se registran todos los decoradores y aspectos necesarios.
 */

import 'reflect-metadata';
import { transactionLogger } from '../logging/TransactionLoggingService';
import './LoggingAspect';

// Mensaje de inicialización
console.log('🚀 AOP Subsystem inicializado');

// Exportar todos los aspectos y decoradores
export * from './LoggingAspect';

// Exportar el logger de transacciones para uso directo
export { transactionLogger };

/**
 * Exportar un hook para registrar puntos clave en la aplicación
 * Se puede usar para registrar eventos importantes que no son capturados
 * automáticamente por los decoradores.
 */
export const AOP = {
    /**
     * Registra un evento manual en el sistema AOP
     */
    logEvent: (eventName: string, details?: any) => {
        const transactionId = transactionLogger.getOrCreateTransactionId();
        console.log(`🎯 Evento [${eventName}] registrado en transacción ${transactionId}`);
        if (details) {
            console.log('  Detalles:', details);
        }
    },
    
    /**
     * Inicia una nueva transacción manualmente
     */
    beginTransaction: (): string => {
        const transactionId = transactionLogger.createTransactionId();
        transactionLogger.setTransactionId(transactionId);
        console.log(`🌱 Transacción ${transactionId} iniciada manualmente`);
        return transactionId;
    },
    
    /**
     * Finaliza una transacción manualmente
     */
    endTransaction: (transactionId?: string) => {
        const id = transactionId || transactionLogger.getTransactionId();
        if (id) {
            console.log(`🏁 Transacción ${id} finalizada manualmente`);
            transactionLogger.clearTransactionId();
            transactionLogger.clearTransactionData(id);
        }
    }
};
