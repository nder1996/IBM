package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.security.jwt.service;


import IBM.Colombia.Cia.S.C.A.IBM.application.dto.response.AuthResponse;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.client.AuthSoapClient;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.BackendResponse;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.security.jwt.JwtUtil;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.security.jwt.dto.JwtRequest;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.exception.SoapAuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthSoapClient authSoapClient;

    @Autowired
    private JwtUtil jwtTokenUtil;


    public AuthResponse login(JwtRequest request) {
        BackendResponse soapResp = authSoapClient.authenticate(request.getUsername(), request.getPassword());
        if (soapResp.getResultCode() != 200) {
            throw new SoapAuthenticationException("Autenticación SOAP fallida: código " + soapResp.getResultCode());
        }
        UserDetails userDetails = User.withUsername(request.getUsername())
            .password("")
            .authorities("USER")
            .build();
        String token = jwtTokenUtil.generateToken(userDetails);
        return new AuthResponse(
            new AuthResponse.TokenInfo(token, "Bearer"),
            new AuthResponse.SoapData(
                soapResp.getResultCode(),
                soapResp.getFirstName(),
                soapResp.getLastName(),
                soapResp.getAge(),
                soapResp.getProfilePhoto(),
                soapResp.getVideo()
            )
        );
    }
}
