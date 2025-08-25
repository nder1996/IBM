package IBM.Colombia.Cia.S.C.A.IBM.application.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {
    private Integer id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    @NotBlank(message = "El password es obligatorio")
    @Size(max = 100, message = "El password no puede exceder 100 caracteres")
    private String password;

    @NotBlank(message = "el email es obligatoria")
    private String email;
}
