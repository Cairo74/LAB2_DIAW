package com.autorent.service;
import com.autorent.dto.AvaliacaoPedidoDTO;
import com.autorent.dto.PedidoRequestDTO;
import com.autorent.model.*;
import com.autorent.repository.AutomovelRepository;
import com.autorent.repository.ClienteRepository;
import com.autorent.repository.ContratoCreditoRepository;
import com.autorent.repository.PedidoAluguelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
@Service
public class PedidoAluguelService {
    @Autowired
    private PedidoAluguelRepository pedidoRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private AutomovelRepository automovelRepository;
    @Autowired
    private ContratoCreditoRepository creditoRepository;
    public List<PedidoAluguel> listarTodos() {
        return pedidoRepository.findAllByOrderByDataPedidoDesc();
    }
    public List<PedidoAluguel> listarPorCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com ID: " + clienteId));
        return pedidoRepository.findByClienteOrderByDataPedidoDesc(cliente);
    }
    public List<PedidoAluguel> listarPorStatus(StatusPedido status) {
        return pedidoRepository.findByStatusOrderByDataPedidoDesc(status);
    }
    public PedidoAluguel buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado com ID: " + id));
    }
    @Transactional
    public PedidoAluguel criarPedido(Long clienteId, PedidoRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com ID: " + clienteId));
        Automovel automovel = automovelRepository.findById(dto.getAutomovelId())
                .orElseThrow(() -> new IllegalArgumentException("Automóvel não encontrado com ID: " + dto.getAutomovelId()));
        if (!automovel.getDisponivel()) {
            throw new IllegalStateException("O automóvel selecionado não está disponível para aluguel no momento.");
        }
        if (dto.getDataFim().isBefore(dto.getDataInicio())) {
            throw new IllegalArgumentException("A data de término não pode ser anterior à data de início.");
        }
        long dias = ChronoUnit.DAYS.between(dto.getDataInicio(), dto.getDataFim());
        if (dias <= 0) dias = 1;
        BigDecimal valorTotal = automovel.getValorDiaria().multiply(BigDecimal.valueOf(dias));
        PedidoAluguel pedido = new PedidoAluguel(cliente, automovel, dto.getDataInicio(), dto.getDataFim(), valorTotal);
        if (Boolean.TRUE.equals(dto.getSolicitarCredito())) {
            String banco = dto.getBancoAgenteNome() != null && !dto.getBancoAgenteNome().isBlank()
                    ? dto.getBancoAgenteNome()
                    : "Banco Agente Parceiro";
            int parcelas = dto.getParcelas() != null && dto.getParcelas() > 0 ? dto.getParcelas() : 12;
            BigDecimal taxaJuros = new BigDecimal("1.89"); 
            ContratoCredito credito = new ContratoCredito(pedido, banco, valorTotal, parcelas, taxaJuros);
            pedido.setContratoCredito(credito);
        }
        return pedidoRepository.save(pedido);
    }
    @Transactional
    public PedidoAluguel modificarPedidoCliente(Long pedidoId, Long clienteId, PedidoRequestDTO dto) {
        PedidoAluguel pedido = buscarPorId(pedidoId);
        if (!pedido.getCliente().getId().equals(clienteId)) {
            throw new IllegalArgumentException("Você não tem permissão para alterar este pedido.");
        }
        if (pedido.getStatus() == StatusPedido.EM_EXECUCAO || pedido.getStatus() == StatusPedido.FINALIZADO || pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new IllegalStateException("Não é possível modificar um pedido que já está em execução, cancelado ou finalizado.");
        }
        if (dto.getDataFim().isBefore(dto.getDataInicio())) {
            throw new IllegalArgumentException("A data de término não pode ser anterior à data de início.");
        }
        long dias = ChronoUnit.DAYS.between(dto.getDataInicio(), dto.getDataFim());
        if (dias <= 0) dias = 1;
        pedido.setDataInicio(dto.getDataInicio());
        pedido.setDataFim(dto.getDataFim());
        pedido.setValorTotal(pedido.getAutomovel().getValorDiaria().multiply(BigDecimal.valueOf(dias)));
        pedido.setStatus(StatusPedido.PENDENTE); 
        return pedidoRepository.save(pedido);
    }
    @Transactional
    public PedidoAluguel cancelarPedidoCliente(Long pedidoId, Long clienteId) {
        PedidoAluguel pedido = buscarPorId(pedidoId);
        if (!pedido.getCliente().getId().equals(clienteId)) {
            throw new IllegalArgumentException("Você não tem permissão para cancelar este pedido.");
        }
        if (pedido.getStatus() == StatusPedido.EM_EXECUCAO || pedido.getStatus() == StatusPedido.FINALIZADO) {
            throw new IllegalStateException("Não é possível cancelar um pedido com contrato já em execução ou finalizado.");
        }
        pedido.setStatus(StatusPedido.CANCELADO);
        pedido.setParecerAgente("Cancelado a pedido do cliente.");
        return pedidoRepository.save(pedido);
    }
    @Transactional
    public PedidoAluguel avaliarPedidoPorAgente(Long pedidoId, String nomeAgente, AvaliacaoPedidoDTO dto) {
        PedidoAluguel pedido = buscarPorId(pedidoId);
        if (pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new IllegalStateException("Não é possível avaliar um pedido cancelado.");
        }
        pedido.setStatus(dto.getNovoStatus());
        pedido.setParecerAgente(dto.getParecer());
        pedido.setAgenteResponsavel(nomeAgente);
        if (dto.getNovaDataInicio() != null) pedido.setDataInicio(dto.getNovaDataInicio());
        if (dto.getNovaDataFim() != null) pedido.setDataFim(dto.getNovaDataFim());
        if (dto.getNovoValorTotal() != null) pedido.setValorTotal(dto.getNovoValorTotal());
        if (dto.getNovoStatus() == StatusPedido.EM_EXECUCAO) {
            pedido.getAutomovel().setDisponivel(false);
            automovelRepository.save(pedido.getAutomovel());
            if (pedido.getContratoCredito() != null) {
                pedido.getContratoCredito().setStatusAprovacao(StatusCredito.APROVADO);
            }
        } else if (dto.getNovoStatus() == StatusPedido.AVALIADO_NEGATIVO) {
            if (pedido.getContratoCredito() != null) {
                pedido.getContratoCredito().setStatusAprovacao(StatusCredito.REJEITADO);
            }
        }
        return pedidoRepository.save(pedido);
    }
}
