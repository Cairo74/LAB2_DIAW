package com.autorent.service;
import com.autorent.dto.ClienteDTO;
import com.autorent.dto.RendimentoDTO;
import com.autorent.model.Cliente;
import com.autorent.model.RendimentoEmpregador;
import com.autorent.model.Usuario;
import com.autorent.repository.ClienteRepository;
import com.autorent.repository.RendimentoEmpregadorRepository;
import com.autorent.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RendimentoEmpregadorRepository rendimentoRepository;
    public List<ClienteDTO> listarTodos() {
        return clienteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    public ClienteDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com ID: " + id));
        return toDTO(cliente);
    }
    public ClienteDTO buscarPorUsuarioId(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + usuarioId));
        Cliente cliente = clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new IllegalArgumentException("Perfil de cliente não associado a este usuário."));
        return toDTO(cliente);
    }
    @Transactional
    public ClienteDTO atualizar(Long id, ClienteDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com ID: " + id));
        cliente.setNome(dto.getNome());
        cliente.setRg(dto.getRg());
        cliente.setEndereco(dto.getEndereco());
        cliente.setProfissao(dto.getProfissao());
        if (dto.getRendimentos() != null) {
            if (dto.getRendimentos().size() > 3) {
                throw new IllegalArgumentException("O cliente só pode registrar até 3 entidades empregadoras e rendimentos.");
            }
            cliente.getRendimentos().clear();
            for (RendimentoDTO r : dto.getRendimentos()) {
                RendimentoEmpregador rend = new RendimentoEmpregador(cliente, r.getEntidadeEmpregadora(), r.getRendimentoMensal());
                cliente.addRendimento(rend);
            }
        }
        Cliente salvo = clienteRepository.save(cliente);
        return toDTO(salvo);
    }
    @Transactional
    public void deletar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com ID: " + id));
        clienteRepository.delete(cliente);
    }
    public ClienteDTO toDTO(Cliente c) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(c.getId());
        if (c.getUsuario() != null) {
            dto.setUsuarioId(c.getUsuario().getId());
            dto.setEmail(c.getUsuario().getEmail());
        }
        dto.setRg(c.getRg());
        dto.setCpf(c.getCpf());
        dto.setNome(c.getNome());
        dto.setEndereco(c.getEndereco());
        dto.setProfissao(c.getProfissao());
        dto.setRendaTotal(c.getRendaTotal());
        if (c.getRendimentos() != null) {
            dto.setRendimentos(c.getRendimentos().stream().map(r ->
                    new RendimentoDTO(r.getId(), r.getEntidadeEmpregadora(), r.getRendimentoMensal())
            ).collect(Collectors.toList()));
        }
        return dto;
    }
}
