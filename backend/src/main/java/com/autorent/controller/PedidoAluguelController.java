package com.autorent.controller;
import com.autorent.dto.AvaliacaoPedidoDTO;
import com.autorent.dto.ClienteDTO;
import com.autorent.dto.PedidoRequestDTO;
import com.autorent.model.PedidoAluguel;
import com.autorent.model.Role;
import com.autorent.model.Usuario;
import com.autorent.service.ClienteService;
import com.autorent.service.PedidoAluguelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/pedidos")
public class PedidoAluguelController {
    @Autowired
    private PedidoAluguelService pedidoService;
    @Autowired
    private ClienteService clienteService;
    @GetMapping
    public ResponseEntity<List<PedidoAluguel>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }
    @GetMapping("/meus")
    public ResponseEntity<?> listarMeusPedidos(@AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Não autenticado."));
        }
        try {
            ClienteDTO cliente = clienteService.buscarPorUsuarioId(usuario.getId());
            return ResponseEntity.ok(pedidoService.listarPorCliente(cliente.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<?> listarPorCliente(@PathVariable Long clienteId) {
        try {
            return ResponseEntity.ok(pedidoService.listarPorCliente(clienteId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pedidoService.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping
    public ResponseEntity<?> criarPedido(@AuthenticationPrincipal Usuario usuario,
                                         @Valid @RequestBody PedidoRequestDTO dto) {
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Não autenticado."));
        }
        try {
            ClienteDTO cliente = clienteService.buscarPorUsuarioId(usuario.getId());
            PedidoAluguel criado = pedidoService.criarPedido(cliente.getId(), dto);
            return ResponseEntity.ok(criado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PutMapping("/{id}/modificar")
    public ResponseEntity<?> modificarPedido(@PathVariable Long id,
                                            @AuthenticationPrincipal Usuario usuario,
                                            @Valid @RequestBody PedidoRequestDTO dto) {
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Não autenticado."));
        }
        try {
            ClienteDTO cliente = clienteService.buscarPorUsuarioId(usuario.getId());
            PedidoAluguel modificado = pedidoService.modificarPedidoCliente(id, cliente.getId(), dto);
            return ResponseEntity.ok(modificado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarPedido(@PathVariable Long id,
                                           @AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Não autenticado."));
        }
        try {
            ClienteDTO cliente = clienteService.buscarPorUsuarioId(usuario.getId());
            PedidoAluguel cancelado = pedidoService.cancelarPedidoCliente(id, cliente.getId());
            return ResponseEntity.ok(cancelado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PutMapping("/{id}/avaliar")
    public ResponseEntity<?> avaliarPedido(@PathVariable Long id,
                                          @AuthenticationPrincipal Usuario usuario,
                                          @Valid @RequestBody AvaliacaoPedidoDTO dto) {
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Não autenticado."));
        }
        if (usuario.getRole() != Role.ROLE_AGENTE_EMPRESA && usuario.getRole() != Role.ROLE_AGENTE_BANCO) {
            return ResponseEntity.status(403).body(Map.of("message", "Apenas agentes podem avaliar pedidos."));
        }
        try {
            PedidoAluguel avaliado = pedidoService.avaliarPedidoPorAgente(id, usuario.getNome(), dto);
            return ResponseEntity.ok(avaliado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
