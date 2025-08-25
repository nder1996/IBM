package IBM.Colombia.Cia.S.C.A.IBM.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private Meta meta;
    private T data;
    private ErrorDetails error;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Meta {
        private String message;
        private Integer statusCode;
        private String path;
        private String timestamp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ErrorDetails {
        private String code;
        private String description;
    }
}
