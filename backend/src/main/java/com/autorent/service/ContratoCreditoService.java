package com.autorent.service;
import com.autorent.dto.CreditoRequestDTO;
import com.autorent.model.ContratoCredito;
import com.autorent.model.StatusCredito;
import com.autorent.repository.ContratoCreditoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
public class ContratoCreditoService {
    @Autowired
    private ContratoCreditoRepository creditoRepository;
    public List<ContratoCredito> listarTodos() {
        return creditoRepository.findAll();
    }
    public List<ContratoCredito> listarPorStatus(StatusCredito status) {
        return creditoRepository.findByStatusAprovacao(status);
    }
    public List<ContratoCredito> listarPorBanco(String banco) {
        return creditoRepository.findByBancoAgenteNome(banco);
    }
    public ContratoCredito buscarPorId(Long id) {
        return creditoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contrato de crédito não encontrado com ID: " + id));
    }
    @Transactional
    public ContratoCredito avaliarCredito(Long id, CreditoRequestDTO dto) {
        ContratoCredito credito = buscarPorId(id);
        credito.setStatusAprovacao(dto.getStatusAprovacao());
        return creditoRepository.save(credito);
    }
}
