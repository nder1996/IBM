package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.security.config;

import IBM.Colombia.Cia.S.C.A.IBM.application.dto.response.ApiResponse;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.exception.ErrorResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.lang.NonNull;


@RestControllerAdvice
public class ApiResponseWrapper implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(@NonNull MethodParameter returnType, @NonNull Class<? extends HttpMessageConverter<?>> converterType) {
        // Apply wrapping for JSON and String converters
        return MappingJackson2HttpMessageConverter.class.isAssignableFrom(converterType)
                || StringHttpMessageConverter.class.isAssignableFrom(converterType);
    }

    @Override
    public Object beforeBodyWrite(Object body, @NonNull MethodParameter returnType, @NonNull MediaType selectedContentType, @NonNull Class<? extends HttpMessageConverter<?>> selectedConverterType, @NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response) {
        if (body instanceof ApiResponse) {
            return body;
        }

        int status = HttpStatus.OK.value();
        if (response instanceof ServletServerHttpResponse) {
            status = ((ServletServerHttpResponse) response).getServletResponse().getStatus();
        }
        String message = (status == HttpStatus.OK.value())
                ? "Success"
                : (HttpStatus.resolve(status) != null ? HttpStatus.resolve(status).getReasonPhrase() : "Unknown Error");

        ApiResponse.Meta meta = ApiResponse.Meta.builder()
                .message(message)
                .statusCode(status)
                .path(request.getURI().getPath())
                .timestamp(java.time.Instant.now().toString())
                .build();

        // Check if the body represents an error
        Object data = null;
        ApiResponse.ErrorDetails error = null;
        if (status >= 400) { // Assuming HTTP status codes 4xx and 5xx represent errors
            if (body instanceof ApiResponse.ErrorDetails) {
                error = (ApiResponse.ErrorDetails) body;
            } else {
                error = ApiResponse.ErrorDetails.builder()
                        .code(body instanceof ErrorResponse ? ((ErrorResponse) body).getErrorCode() : "UNKNOWN_ERROR")
                        .description(body instanceof ErrorResponse ? ((ErrorResponse) body).getMessage() : "Unknown Error")
                        .build();
            }
        } else {
            data = body;
        }

        ApiResponse<Object> apiResponse = new ApiResponse<>(meta, data, error);

        // For String message converter, serialize to JSON string
        if (StringHttpMessageConverter.class.isAssignableFrom(selectedConverterType)) {
            try {
                return new ObjectMapper().writeValueAsString(apiResponse);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error serializando ApiResponse", e);
            }
        }
        return apiResponse;
    }

    private String serializeBody(Object body) {
        try {
            return new ObjectMapper().writeValueAsString(body);
        } catch (JsonProcessingException e) {
            return "Error serializing body: " + e.getMessage();
        }
    }
}
