package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.exception;

import org.springframework.http.HttpStatus;

public class CustomException extends RuntimeException{

    private final String errorCode;
    private final HttpStatus status;

    public CustomException(String message, String errorCode, HttpStatus status) {
        this.errorCode = errorCode;
        this.status = status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }

    public static CustomException notFound(String message) {
        return new CustomException(message, "NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    public static CustomException badRequest(String message) {
        return new CustomException(message, "BAD_REQUEST", HttpStatus.BAD_REQUEST);
    }
}
