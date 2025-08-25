package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.security.service;

import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.client.MockAuthSoapClient;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.soap.BackendResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class MockUserDetailsService implements UserDetailsService {

    private final MockAuthSoapClient mockAuthSoapClient;

    @Autowired
    public MockUserDetailsService(MockAuthSoapClient mockAuthSoapClient) {
        this.mockAuthSoapClient = mockAuthSoapClient;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            // Obtener información del usuario usando el servicio SOAP simulado
            BackendResponse response = mockAuthSoapClient.authenticate(username);

            // Si el código de resultado no es 200, el usuario no existe o hay otro problema
            if (response.getResultCode() != 200) {
                throw new UsernameNotFoundException("Usuario no encontrado: " + username);
            }

            // Crear un UserDetails con la información del usuario
            // Usamos una contraseña codificada por defecto ya que sabemos que es una simulación
            // En un entorno real, usaríamos la contraseña real del usuario
            return new User(
                username,
                "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG", // "password" codificado con BCrypt
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
            );

        } catch (Exception e) {
            throw new UsernameNotFoundException("Error al cargar usuario: " + username, e);
        }
    }
}
