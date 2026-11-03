package com.autorent.controller;
import com.autorent.dto.CreditoRequestDTO;
import com.autorent.model.ContratoCredito;
import com.autorent.model.Role;
import com.autorent.model.Usuario;
import com.autorent.service.ContratoCreditoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/creditos")
public class ContratoCreditoController {
    @Autowired
    private ContratoCreditoService creditoService;
    @GetMapping
    public ResponseEntity<List<ContratoCredito>> listarTodos() {
        return ResponseEntity.ok(creditoService.listarTodos());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(creditoService.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PutMapping("/{id}/avaliar")
    public ResponseEntity<?> avaliarCredito(@PathVariable Long id,
                                           @AuthenticationPrincipal Usuario usuario,
                                           @Valid @RequestBody CreditoRequestDTO dto) {
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Não autenticado."));
        }
        if (usuario.getRole() != Role.ROLE_AGENTE_BANCO) {
            return ResponseEntity.status(403).body(Map.of("message", "Apenas bancos agentes podem avaliar contratos de crédito."));
        }
        try {
            ContratoCredito avaliado = creditoService.avaliarCredito(id, dto);
            return ResponseEntity.ok(avaliado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
