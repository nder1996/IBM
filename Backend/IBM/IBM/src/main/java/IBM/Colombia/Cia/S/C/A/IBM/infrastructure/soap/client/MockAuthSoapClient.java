package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.client;

import IBM.Colombia.Cia.S.C.A.IBM.application.service.ImageBase64Service;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.BackendResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class MockAuthSoapClient {

    private final ImageBase64Service imageBase64Service;

    @Autowired
    public MockAuthSoapClient(ImageBase64Service imageBase64Service) {
        this.imageBase64Service = imageBase64Service;
    }

    public BackendResponse authenticate(String username) {
        log.info("Usando respuesta SOAP simulada para usuario: {}", username);
        BackendResponse response = new BackendResponse();
        try {
            switch (username.toLowerCase()) {
                case "juan.perez":
                    response.setResultCode(200);
                    response.setFirstName("Juan");
                    response.setLastName("Pérez");
                    response.setAge(25);
                    response.setProfilePhoto(imageBase64Service.getImageAsBase64("static/images/avatar_1.png"));
                    response.setVideo("https://youtube.com/shorts/OplrL_DT7bM?si=RqfilkcZrkCLsV9e");
                    break;

                case "maria.gonzalez":
                    response.setResultCode(200);
                    response.setFirstName("María");
                    response.setLastName("González");
                    response.setAge(30);
                    response.setProfilePhoto(imageBase64Service.getImageAsBase64("static/images/avatar_2.png"));
                    response.setVideo("https://www.youtube.com/shorts/4CYkhXIDxeQ?feature=share");
                    break;

                case "carlos.rodriguez":
                    response.setResultCode(200);
                    response.setFirstName("Carlos");
                    response.setLastName("Rodríguez");
                    response.setAge(28);
                    response.setProfilePhoto(imageBase64Service.getImageAsBase64("static/images/avatar_3.png"));
                    response.setVideo("https://youtube.com/shorts/3dx1dBzM7ZY?si=fRN0Cl2b9SEU5BQx");
                    break;

                case "ana.martinez":
                    response.setResultCode(200);
                    response.setFirstName("Ana");
                    response.setLastName("Martínez");
                    response.setAge(35);
                    response.setProfilePhoto(imageBase64Service.getImageAsBase64("static/images/avatar_4.png"));
                    response.setVideo("https://youtube.com/shorts/MiWzebtC_Zo?si=R22s2fk9S2q-2AIs");
                    break;

                case "luis.fernandez":
                    response.setResultCode(200);
                    response.setFirstName("Luis");
                    response.setLastName("Fernández");
                    response.setAge(42);
                    response.setProfilePhoto(imageBase64Service.getImageAsBase64("static/images/avatar_5.png"));
                    response.setVideo("9bZkp7q19f0");
                    break;

                case "sofia.lopez":
                    response.setResultCode(200);
                    response.setFirstName("Sofía");
                    response.setLastName("López");
                    response.setAge(27);
                    response.setProfilePhoto(imageBase64Service.getImageAsBase64("static/images/avatar_2.png"));
                    response.setVideo("https://youtube.com/shorts/4kj3g9Y-spg?si=kBdfSCpieflO3CVn");
                    break;

                case "diego.morales":
                    response.setResultCode(200);
                    response.setFirstName("Diego");
                    response.setLastName("Morales");
                    response.setAge(33);
                    response.setProfilePhoto(imageBase64Service.getImageAsBase64("static/images/avatar_3.png"));
                    response.setVideo("https://youtube.com/shorts/SvwcGmYNuoE?si=AaWrfc-gTBQPgbvV");
                    break;
                default:
                    response.setResultCode(401);
                    response.setFirstName("Usuario");
                    response.setLastName("No Encontrado");
                    response.setAge(0);
                    response.setProfilePhoto("");
                    response.setVideo("Usuario no encontrado en el sistema.");
            }

            return response;

        } catch (Exception e) {
            log.error("Error al procesar la autenticación simulada para el usuario: {}", username, e);
            response.setResultCode(500);
            response.setFirstName("Error");
            response.setLastName("Sistema");
            response.setAge(0);
            response.setProfilePhoto("");
            response.setVideo("SYSTEM ERROR");
            return response;
        }
    }
}
