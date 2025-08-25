package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.security.jwt.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class JwtRequest {
    private static final long serialVersionUID = 5926468583005150707L;

    @NotBlank(message = "El username es obligatorio")
    @Size(max = 100, message = "El username no puede exceder 100 caracteres")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    /*@Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
            message = "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales"
    )*/
    private String password;

    // Constructor sin argumentos (generado por @NoArgsConstructor)
    public JwtRequest() {
    }

    public JwtRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }


    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
