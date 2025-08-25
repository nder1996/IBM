package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.exception;

public class ErrorResponse {

    private String errorCode;
    private String message;
    private int statusCode;

    public ErrorResponse() { }

    public ErrorResponse(String errorCode, String message, int statusCode) {
        this.errorCode = errorCode;
        this.message = message;
        this.statusCode = statusCode;
    }

    // Getters y setters
    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }


}
