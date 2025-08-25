package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.security.aspect;


import IBM.Colombia.Cia.S.C.A.IBM.application.service.FileLoggingService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.UUID;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    private enum OperationState {
        STARTED("🚀", "Iniciando", "\u001B[34m"),
        IN_PROGRESS("⚙️", "En proceso", "\u001B[36m"),
        COMPLETED("✅", "Completado", "\u001B[32m"),
        WARNING("⚠️", "Advertencia", "\u001B[33m"),
        ERROR("❌", "Error", "\u001B[31m"),
        TERMINATED("🛑", "Terminado", "\u001B[35m");

        final String emoji;
        final String description;
        final String color;
        private static final String RESET = "\u001B[0m";

        OperationState(String emoji, String description, String color) {
            this.emoji = emoji;
            this.description = description;
            this.color = color;
        }
    }

    @Pointcut("(within(@org.springframework.web.bind.annotation.RestController *) || " +
            "within(@org.springframework.stereotype.Service *) || " +
            "within(@org.springframework.stereotype.Repository *)) && " +
            "!within(IBM.Colombia.Cia.S.C.A.IBM.application.service.FileLoggingService)")
    public void springBeanPointcut() {}

    @Around("springBeanPointcut()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        // Verificación adicional para evitar interceptar FileLoggingService
        if (className.contains("FileLoggingService")) {
            return joinPoint.proceed();
        }

        Object[] args = joinPoint.getArgs();

        // 🔥 NUEVO: ID único de transacción
        String transactionId = getOrCreateTransactionId();
        long startTime = System.currentTimeMillis();

        // 🔥 NUEVO: Contexto HTTP
        String httpInfo = getHttpContext();

        MDC.put("transactionId", transactionId);
        MDC.put("className", className);
        MDC.put("methodName", methodName);

        try {
            logTransactionState(OperationState.STARTED, className, methodName, transactionId, httpInfo, args);
            logTransactionState(OperationState.IN_PROGRESS, className, methodName, transactionId, httpInfo, null);

            Object result = joinPoint.proceed();

            // 🔥 NUEVO: Duración calculada
            long duration = System.currentTimeMillis() - startTime;
            logTransactionState(OperationState.COMPLETED, className, methodName, transactionId,
                    "Duration: " + duration + "ms", result);

            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            String errorInfo = "Duration: " + duration + "ms | Error: " + e.getMessage();

            if (e instanceof RuntimeException) {
                logTransactionState(OperationState.WARNING, className, methodName, transactionId, errorInfo, null);
            } else {
                logTransactionState(OperationState.ERROR, className, methodName, transactionId, errorInfo, null);
            }
            throw e;
        } finally {
            long totalDuration = System.currentTimeMillis() - startTime;
            logTransactionState(OperationState.TERMINATED, className, methodName, transactionId,
                    "Total Duration: " + totalDuration + "ms", null);
            MDC.clear();
        }
    }

    // Inyectar FileLoggingService
    @Autowired
    private FileLoggingService fileLoggingService;

    // Modificar logTransactionState para ser más eficiente
    private void logTransactionState(OperationState state, String className, String methodName,
                                     String transactionId, String contextInfo, Object details) {
        String timestamp = Instant.now().toString();
        String message = String.format("🏷️  TXN[%s] | %s %s: %s.%s | ⏰ %s | 📍 %s",
                transactionId,
                state.emoji,
                state.description,
                className.substring(className.lastIndexOf('.') + 1), // Solo nombre clase
                methodName,
                timestamp,
                contextInfo != null ? contextInfo : ""
        );

        // Solo logear a archivo en estados importantes para evitar sobrecarga
        boolean shouldLogToFile = state == OperationState.ERROR ||
                                 state == OperationState.WARNING ||
                                 state == OperationState.COMPLETED ||
                                 state == OperationState.STARTED;

        switch (state) {
            case ERROR -> {
                logger.error(message + (details != null ? " | 📄 Details: {}" : ""), details);
                if (shouldLogToFile) {
                    safeLogToFile(transactionId, message + (details != null ? " | Details: " + details : ""));
                }
            }
            case WARNING -> {
                logger.warn(message + (details != null ? " | 📄 Details: {}" : ""), details);
                if (shouldLogToFile) {
                    safeLogToFile(transactionId, message + (details != null ? " | Details: " + details : ""));
                }
            }
            default -> {
                logger.info(message + (details != null ? " | 📄 Details: {}" : ""),
                        details != null ? sanitizeForLog(details) : "");
                if (shouldLogToFile) {
                    safeLogToFile(transactionId, message + (details != null ? " | Details: " + sanitizeForLog(details) : ""));
                }
            }
        }
    }

    // Método seguro para evitar ciclos infinitos
    private void safeLogToFile(String transactionId, String message) {
        try {
            if (fileLoggingService != null) {
                fileLoggingService.writeTransactionLog(transactionId, message);
            }
        } catch (Exception e) {
            // Solo log a consola, no al archivo para evitar recursión
            logger.warn("No se pudo escribir al archivo de log: {}", e.getMessage());
        }
    }

    // 🔥 NUEVO: Obtener o crear ID de transacción
    private String getOrCreateTransactionId() {
        String existingId = MDC.get("transactionId");
        if (existingId != null) {
            return existingId;
        }
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // 🔥 NUEVO: Obtener contexto HTTP
    private String getHttpContext() {
        try {
            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpServletRequest request = attributes.getRequest();
            return String.format("🌐 %s %s | 📡 %s",
                    request.getMethod(),
                    request.getRequestURI(),
                    request.getRemoteAddr());
        } catch (Exception e) {
            return "🔧 Non-HTTP Context";
        }
    }

    // 🔥 NUEVO: Sanitizar datos sensibles para logs
    private Object sanitizeForLog(Object data) {
        if (data == null) return null;
        String str = data.toString();
        // Ocultar passwords
        if (str.toLowerCase().contains("password")) {
            return "***SENSITIVE_DATA_HIDDEN***";
        }
        // Limitar tamaño del log
        return str.length() > 200 ? str.substring(0, 200) + "..." : str;
    }
}
