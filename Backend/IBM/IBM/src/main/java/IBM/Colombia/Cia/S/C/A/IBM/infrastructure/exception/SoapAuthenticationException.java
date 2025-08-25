package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.exception;

public class SoapAuthenticationException extends RuntimeException {
    public SoapAuthenticationException(String message) {
        super(message);
    }

    public SoapAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}

