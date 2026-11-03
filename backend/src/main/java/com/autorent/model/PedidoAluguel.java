package com.autorent.model;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "pedidos_aluguel")
public class PedidoAluguel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "automovel_id", nullable = false)
    private Automovel automovel;
    @Column(name = "data_pedido", nullable = false)
    private LocalDateTime dataPedido = LocalDateTime.now();
    @NotNull
    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;
    @NotNull
    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;
    @NotNull
    @Column(name = "valor_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorTotal;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status = StatusPedido.PENDENTE;
    @Column(name = "parecer_agente", length = 1000)
    private String parecerAgente;
    @Column(name = "agente_responsavel")
    private String agenteResponsavel;
    @JsonManagedReference
    @OneToOne(mappedBy = "pedidoAluguel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private ContratoCredito contratoCredito;
    public PedidoAluguel() {}
    public PedidoAluguel(Cliente cliente, Automovel automovel, LocalDate dataInicio, LocalDate dataFim, BigDecimal valorTotal) {
        this.cliente = cliente;
        this.automovel = automovel;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.valorTotal = valorTotal;
        this.dataPedido = LocalDateTime.now();
        this.status = StatusPedido.PENDENTE;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Cliente getCliente() {
        return cliente;
    }
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    public Automovel getAutomovel() {
        return automovel;
    }
    public void setAutomovel(Automovel automovel) {
        this.automovel = automovel;
    }
    public LocalDateTime getDataPedido() {
        return dataPedido;
    }
    public void setDataPedido(LocalDateTime dataPedido) {
        this.dataPedido = dataPedido;
    }
    public LocalDate getDataInicio() {
        return dataInicio;
    }
    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }
    public LocalDate getDataFim() {
        return dataFim;
    }
    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }
    public BigDecimal getValorTotal() {
        return valorTotal;
    }
    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }
    public StatusPedido getStatus() {
        return status;
    }
    public void setStatus(StatusPedido status) {
        this.status = status;
    }
    public String getParecerAgente() {
        return parecerAgente;
    }
    public void setParecerAgente(String parecerAgente) {
        this.parecerAgente = parecerAgente;
    }
    public String getAgenteResponsavel() {
        return agenteResponsavel;
    }
    public void setAgenteResponsavel(String agenteResponsavel) {
        this.agenteResponsavel = agenteResponsavel;
    }
    public ContratoCredito getContratoCredito() {
        return contratoCredito;
    }
    public void setContratoCredito(ContratoCredito contratoCredito) {
        this.contratoCredito = contratoCredito;
        if (contratoCredito != null) {
            contratoCredito.setPedidoAluguel(this);
        }
    }
}
