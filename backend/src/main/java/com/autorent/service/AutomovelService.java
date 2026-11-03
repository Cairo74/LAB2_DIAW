package com.autorent.service;
import com.autorent.dto.AutomovelDTO;
import com.autorent.model.Automovel;
import com.autorent.model.TipoProprietario;
import com.autorent.repository.AutomovelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class AutomovelService {
    @Autowired
    private AutomovelRepository automovelRepository;
    public List<AutomovelDTO> listarTodos() {
        return automovelRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
    public List<AutomovelDTO> listarDisponiveis() {
        return automovelRepository.findByDisponivelTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }
    public List<AutomovelDTO> listarPorTipoProprietario(TipoProprietario tipo) {
        return automovelRepository.findByTipoProprietario(tipo).stream().map(this::toDTO).collect(Collectors.toList());
    }
    public AutomovelDTO buscarPorId(Long id) {
        Automovel auto = automovelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Automóvel não encontrado com ID: " + id));
        return toDTO(auto);
    }
    @Transactional
    public AutomovelDTO criar(AutomovelDTO dto) {
        if (automovelRepository.findByMatricula(dto.getMatricula()).isPresent()) {
            throw new IllegalArgumentException("Já existe um automóvel com a matrícula informada.");
        }
        if (automovelRepository.findByPlaca(dto.getPlaca()).isPresent()) {
            throw new IllegalArgumentException("Já existe um automóvel com a placa informada.");
        }
        Automovel automovel = new Automovel(
                dto.getMatricula(),
                dto.getAno(),
                dto.getMarca(),
                dto.getModelo(),
                dto.getPlaca(),
                dto.getTipoProprietario(),
                dto.getProprietarioNome(),
                dto.getValorDiaria(),
                dto.getImagemUrl()
        );
        automovel = automovelRepository.save(automovel);
        return toDTO(automovel);
    }
    @Transactional
    public AutomovelDTO atualizar(Long id, AutomovelDTO dto) {
        Automovel automovel = automovelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Automóvel não encontrado com ID: " + id));
        automovel.setAno(dto.getAno());
        automovel.setMarca(dto.getMarca());
        automovel.setModelo(dto.getModelo());
        automovel.setPlaca(dto.getPlaca());
        automovel.setTipoProprietario(dto.getTipoProprietario());
        automovel.setProprietarioNome(dto.getProprietarioNome());
        automovel.setValorDiaria(dto.getValorDiaria());
        automovel.setDisponivel(dto.getDisponivel());
        automovel.setImagemUrl(dto.getImagemUrl());
        return toDTO(automovelRepository.save(automovel));
    }
    @Transactional
    public void deletar(Long id) {
        Automovel auto = automovelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Automóvel não encontrado com ID: " + id));
        automovelRepository.delete(auto);
    }
    public AutomovelDTO toDTO(Automovel a) {
        AutomovelDTO dto = new AutomovelDTO();
        dto.setId(a.getId());
        dto.setMatricula(a.getMatricula());
        dto.setAno(a.getAno());
        dto.setMarca(a.getMarca());
        dto.setModelo(a.getModelo());
        dto.setPlaca(a.getPlaca());
        dto.setTipoProprietario(a.getTipoProprietario());
        dto.setProprietarioNome(a.getProprietarioNome());
        dto.setValorDiaria(a.getValorDiaria());
        dto.setDisponivel(a.getDisponivel());
        dto.setImagemUrl(a.getImagemUrl());
        return dto;
    }
}
