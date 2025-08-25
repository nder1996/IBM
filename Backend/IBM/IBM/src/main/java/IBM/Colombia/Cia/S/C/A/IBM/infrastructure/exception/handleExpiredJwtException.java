package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.exception;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class handleExpiredJwtException extends RuntimeException{
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleExpiredJwtException(ExpiredJwtException ex) {
        ErrorResponse error = new ErrorResponse(
                "TOKEN_EXPIRED",
                "JWT token has expired",
                HttpStatus.UNAUTHORIZED.value()
        );
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }



}
