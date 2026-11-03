package com.autorent.controller;
import com.autorent.dto.*;
import com.autorent.model.Usuario;
import com.autorent.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping("/register-cliente")
    public ResponseEntity<?> registerCliente(@Valid @RequestBody RegisterClienteRequest request) {
        try {
            AuthResponse response = authService.registerCliente(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping("/register-agente")
    public ResponseEntity<?> registerAgente(@Valid @RequestBody RegisterAgenteRequest request) {
        try {
            AuthResponse response = authService.registerAgente(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Não autenticado."));
        }
        return ResponseEntity.ok(Map.of(
                "id", usuario.getId(),
                "email", usuario.getEmail(),
                "nome", usuario.getNome(),
                "role", usuario.getRole()
        ));
    }
}
