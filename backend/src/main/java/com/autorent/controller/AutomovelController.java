package com.autorent.controller;
import com.autorent.dto.AutomovelDTO;
import com.autorent.model.TipoProprietario;
import com.autorent.service.AutomovelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/automoveis")
public class AutomovelController {
    @Autowired
    private AutomovelService automovelService;
    @GetMapping
    public ResponseEntity<List<AutomovelDTO>> listarTodos() {
        return ResponseEntity.ok(automovelService.listarTodos());
    }
    @GetMapping("/disponiveis")
    public ResponseEntity<List<AutomovelDTO>> listarDisponiveis() {
        return ResponseEntity.ok(automovelService.listarDisponiveis());
    }
    @GetMapping("/proprietario/{tipo}")
    public ResponseEntity<List<AutomovelDTO>> listarPorProprietario(@PathVariable TipoProprietario tipo) {
        return ResponseEntity.ok(automovelService.listarPorTipoProprietario(tipo));
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(automovelService.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody AutomovelDTO dto) {
        try {
            return ResponseEntity.ok(automovelService.criar(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody AutomovelDTO dto) {
        try {
            return ResponseEntity.ok(automovelService.atualizar(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            automovelService.deletar(id);
            return ResponseEntity.ok(Map.of("message", "Automóvel removido com sucesso."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
