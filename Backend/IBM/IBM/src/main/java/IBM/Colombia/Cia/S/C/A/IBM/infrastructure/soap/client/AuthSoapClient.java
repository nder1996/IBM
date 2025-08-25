package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.client;

import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.BackendResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AuthSoapClient {

    @Value("${soap.auth.mock:true}")
    private boolean useMock;

    private final RealAuthSoapClient realAuthSoapClient;
    private final MockAuthSoapClient mockAuthSoapClient;

    @Autowired
    public AuthSoapClient(RealAuthSoapClient realAuthSoapClient, MockAuthSoapClient mockAuthSoapClient) {
        this.realAuthSoapClient = realAuthSoapClient;
        this.mockAuthSoapClient = mockAuthSoapClient;
    }

    public BackendResponse authenticate(String username, String password) {
        log.info("Iniciando autenticación SOAP para usuario: {}", username);
        try {
            if (useMock) {
                return mockAuthSoapClient.authenticate(username);
            }
            return realAuthSoapClient.authenticate(username, password);
        } catch (Exception e) {
            log.error("❌ Error en autenticación SOAP para usuario {}: {}", username, e.getMessage());
            return null;
        }
    }
}
