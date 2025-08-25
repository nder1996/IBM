package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.client;

import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.exception.SoapAuthenticationException;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.*;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class RealAuthSoapClient {

    @Value("${soap.auth.endpoint:http://webhost:8085/back/auth}")
    private String soapEndpoint;

    public BackendResponse authenticate(String username, String password) {
        log.info("Iniciando autenticación SOAP real para usuario: {}", username);

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
}
