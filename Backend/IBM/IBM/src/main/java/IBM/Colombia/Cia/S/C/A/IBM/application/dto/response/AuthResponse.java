package IBM.Colombia.Cia.S.C.A.IBM.application.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private TokenInfo token;
    @JsonProperty("user_information")
    private SoapData userInformation;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TokenInfo {
        private String token;
        private String type = "Bearer";
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SoapData {
        private int resultCode;
        private String firstName;
        private String lastName;
        private int age;
        private String profilePhoto;
        private String video;
    }
}
