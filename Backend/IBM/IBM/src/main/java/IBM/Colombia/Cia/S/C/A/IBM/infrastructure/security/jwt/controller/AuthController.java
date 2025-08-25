package IBM.Colombia.Cia.S.C.A.IBM.infrastructure.security.jwt.controller;


import IBM.Colombia.Cia.S.C.A.IBM.application.dto.response.AuthResponse;
import IBM.Colombia.Cia.S.C.A.IBM.application.dto.response.ApiResponse;
import IBM.Colombia.Cia.S.C.A.IBM.application.dto.response.ApiResponse.Meta;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.security.jwt.dto.JwtRequest;
import IBM.Colombia.Cia.S.C.A.IBM.infrastructure.security.jwt.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody JwtRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Endpoint de autenticación funcionando");
    }

}
