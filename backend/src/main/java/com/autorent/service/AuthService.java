package com.autorent.service;
import com.autorent.config.JwtUtils;
import com.autorent.dto.*;
import com.autorent.model.*;
import com.autorent.repository.ClienteRepository;
import com.autorent.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class AuthService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtils jwtUtils;
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email ou senha inválidos."));
        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new IllegalArgumentException("Email ou senha inválidos.");
        }
        String token = jwtUtils.generateToken(usuario.getEmail(), usuario.getRole().name(), usuario.getId());
        Long clienteId = null;
        if (usuario.getRole() == Role.ROLE_CLIENTE) {
            clienteId = clienteRepository.findByUsuario(usuario)
                    .map(Cliente::getId)
                    .orElse(null);
        }
        return new AuthResponse(token, usuario.getId(), usuario.getEmail(), usuario.getNome(), usuario.getRole(), clienteId);
    }
    @Transactional
    public AuthResponse registerCliente(RegisterClienteRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Já existe um usuário cadastrado com este e-mail.");
        }
        if (clienteRepository.existsByCpf(request.getCpf())) {
            throw new IllegalArgumentException("Já existe um cliente cadastrado com este CPF.");
        }
        Usuario usuario = new Usuario(
                request.getEmail(),
                passwordEncoder.encode(request.getSenha()),
                request.getNome(),
                Role.ROLE_CLIENTE
        );
        usuario = usuarioRepository.save(usuario);
        Cliente cliente = new Cliente(
                usuario,
                request.getRg(),
                request.getCpf(),
                request.getNome(),
                request.getEndereco(),
                request.getProfissao()
        );
        if (request.getRendimentos() != null && !request.getRendimentos().isEmpty()) {
            if (request.getRendimentos().size() > 3) {
                throw new IllegalArgumentException("O cliente pode registrar no máximo 3 entidades empregadoras e rendimentos.");
            }
            for (RendimentoDTO r : request.getRendimentos()) {
                RendimentoEmpregador rendimento = new RendimentoEmpregador(
                        cliente,
                        r.getEntidadeEmpregadora(),
                        r.getRendimentoMensal()
                );
                cliente.addRendimento(rendimento);
            }
        }
        cliente = clienteRepository.save(cliente);
        String token = jwtUtils.generateToken(usuario.getEmail(), usuario.getRole().name(), usuario.getId());
        return new AuthResponse(token, usuario.getId(), usuario.getEmail(), usuario.getNome(), usuario.getRole(), cliente.getId());
    }
    @Transactional
    public AuthResponse registerAgente(RegisterAgenteRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Já existe um usuário cadastrado com este e-mail.");
        }
        if (request.getRole() != Role.ROLE_AGENTE_EMPRESA && request.getRole() != Role.ROLE_AGENTE_BANCO) {
            throw new IllegalArgumentException("O perfil de agente deve ser ROLE_AGENTE_EMPRESA ou ROLE_AGENTE_BANCO.");
        }
        Usuario usuario = new Usuario(
                request.getEmail(),
                passwordEncoder.encode(request.getSenha()),
                request.getNome(),
                request.getRole()
        );
        usuario = usuarioRepository.save(usuario);
        String token = jwtUtils.generateToken(usuario.getEmail(), usuario.getRole().name(), usuario.getId());
        return new AuthResponse(token, usuario.getId(), usuario.getEmail(), usuario.getNome(), usuario.getRole(), null);
    }
}
