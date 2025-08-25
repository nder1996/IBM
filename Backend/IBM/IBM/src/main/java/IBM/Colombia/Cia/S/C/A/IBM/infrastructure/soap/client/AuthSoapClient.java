package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.client;

import IBM.Colombia.Cia.S.C.A.IBM.application.service.ImageBase64Service;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.exception.SoapAuthenticationException;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AuthSoapClient {

    @Value("${soap.auth.endpoint:http://webhost:8085/back/auth}")
    private String soapEndpoint;

    @Value("${soap.auth.mock:true}")
    private boolean useMock;

    private final ImageBase64Service imageBase64Service;

    @Autowired
    public AuthSoapClient(ImageBase64Service imageBase64Service) {
        this.imageBase64Service = imageBase64Service;
    }

    public BackendResponse authenticate(String username, String password) {
        log.info("Iniciando autenticación SOAP para usuario: {}", username);

        if (useMock) {
            return createMockResponse(username);
        }

        return callRealSoapService(username, password);
    }

    private BackendResponse callRealSoapService(String username, String password) {
        try {
            // Usar las clases generadas del WSDL
            BackendWsService service = new BackendWsService();
            BackendWs port = service.getBackend();

            // Configurar la autenticación básica en el cliente SOAP
            javax.xml.ws.BindingProvider bp = (javax.xml.ws.BindingProvider) port;
            java.util.Map<String, Object> requestContext = bp.getRequestContext();
            requestContext.put(javax.xml.ws.BindingProvider.USERNAME_PROPERTY, username);
            requestContext.put(javax.xml.ws.BindingProvider.PASSWORD_PROPERTY, password);
            requestContext.put(javax.xml.ws.BindingProvider.ENDPOINT_ADDRESS_PROPERTY, soapEndpoint);


            // Llamar al servicio usando parámetros y holders según la interfaz generada
            javax.xml.ws.Holder<Integer> resultCode = new javax.xml.ws.Holder<>();
            javax.xml.ws.Holder<String> firstName = new javax.xml.ws.Holder<>();
            javax.xml.ws.Holder<String> lastName = new javax.xml.ws.Holder<>();
            javax.xml.ws.Holder<Integer> age = new javax.xml.ws.Holder<>();
            javax.xml.ws.Holder<String> profilePhoto = new javax.xml.ws.Holder<>();
            javax.xml.ws.Holder<String> video = new javax.xml.ws.Holder<>();
            port.backend(username, password, resultCode, firstName, lastName, age, profilePhoto, video);
            BackendResponse response = new BackendResponse();
            response.setResultCode(resultCode.value);
            response.setFirstName(firstName.value);
            response.setLastName(lastName.value);
            response.setAge(age.value);
            response.setProfilePhoto(profilePhoto.value);
            response.setVideo(video.value);

            log.info("Respuesta SOAP exitosa para usuario: {}, resultCode: {}",
                    username, response.getResultCode());

            return response;

        } catch (UserDefinedException fault) {
            UserDefinedFault info = fault.getFaultInfo();
            log.error("Error SOAP definido por usuario: {}", info.getMessage());
            throw new SoapAuthenticationException("Autenticación fallida: " + info.getDetail());

        } catch (com.sun.xml.ws.client.ClientTransportException e) {
            log.error("Error de transporte SOAP. El servidor respondió con un error.", e);
            if (e.getMessage() != null && e.getMessage().contains("401")) {
                throw new SoapAuthenticationException("Credenciales SOAP inválidas o no proporcionadas.", e);
            }
            throw new SoapAuthenticationException("Error de comunicación con el servicio SOAP.", e);

        } catch (Exception e) {
            log.error("Error inesperado en llamada SOAP", e);
            throw new SoapAuthenticationException("Error de comunicación con servicio de autenticación", e);
        }
    }

    private BackendResponse createMockResponse(String username) {
        log.info("Usando respuesta SOAP simulada para usuario: {}", username);

        BackendResponse response = new BackendResponse();

        // Simular diferentes usuarios
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
    }


}
