package IBM.Colombia.Cia.S.C.A.IBM.shared;

public class ErrorDetailsValidation {

    private String message;
    private Object rejectedValue;

    public ErrorDetailsValidation() {
    }

    public ErrorDetailsValidation(String message, Object rejectedValue) {
        this.message = message;
        this.rejectedValue = rejectedValue;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getRejectedValue() {
        return rejectedValue;
    }

    public void setRejectedValue(Object rejectedValue) {
        this.rejectedValue = rejectedValue;
    }

    @Override
    public String toString() {
        return "ErrorDetailsValidation{" +
                "message='" + message + '\'' +
                ", rejectedValue=" + rejectedValue +
                '}';
    }
}
