package com.autorent.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
@Entity
@Table(name = "contratos_credito")
public class ContratoCredito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_aluguel_id", nullable = false, unique = true)
    private PedidoAluguel pedidoAluguel;
    @NotBlank
    @Column(name = "banco_agente_nome", nullable = false)
    private String bancoAgenteNome;
    @NotNull
    @DecimalMin("0.0")
    @Column(name = "valor_financiado", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorFinanciado;
    @NotNull
    @Column(name = "numero_parcelas", nullable = false)
    private Integer numeroParcelas;
    @NotNull
    @Column(name = "taxa_juros_mensal", nullable = false, precision = 5, scale = 2)
    private BigDecimal taxaJurosMensal;
    @Enumerated(EnumType.STRING)
    @Column(name = "status_aprovacao", nullable = false)
    private StatusCredito statusAprovacao = StatusCredito.PENDENTE;
    public ContratoCredito() {}
    public ContratoCredito(PedidoAluguel pedidoAluguel, String bancoAgenteNome, BigDecimal valorFinanciado,
                           Integer numeroParcelas, BigDecimal taxaJurosMensal) {
        this.pedidoAluguel = pedidoAluguel;
        this.bancoAgenteNome = bancoAgenteNome;
        this.valorFinanciado = valorFinanciado;
        this.numeroParcelas = numeroParcelas;
        this.taxaJurosMensal = taxaJurosMensal;
        this.statusAprovacao = StatusCredito.PENDENTE;
    }
    public BigDecimal getValorParcela() {
        if (numeroParcelas == null || numeroParcelas == 0 || valorFinanciado == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal totalComJuros = valorFinanciado.multiply(
                BigDecimal.ONE.add(taxaJurosMensal.divide(BigDecimal.valueOf(100)).multiply(BigDecimal.valueOf(numeroParcelas)))
        );
        return totalComJuros.divide(BigDecimal.valueOf(numeroParcelas), 2, java.math.RoundingMode.HALF_UP);
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public PedidoAluguel getPedidoAluguel() {
        return pedidoAluguel;
    }
    public void setPedidoAluguel(PedidoAluguel pedidoAluguel) {
        this.pedidoAluguel = pedidoAluguel;
    }
    public String getBancoAgenteNome() {
        return bancoAgenteNome;
    }
    public void setBancoAgenteNome(String bancoAgenteNome) {
        this.bancoAgenteNome = bancoAgenteNome;
    }
    public BigDecimal getValorFinanciado() {
        return valorFinanciado;
    }
    public void setValorFinanciado(BigDecimal valorFinanciado) {
        this.valorFinanciado = valorFinanciado;
    }
    public Integer getNumeroParcelas() {
        return numeroParcelas;
    }
    public void setNumeroParcelas(Integer numeroParcelas) {
        this.numeroParcelas = numeroParcelas;
    }
    public BigDecimal getTaxaJurosMensal() {
        return taxaJurosMensal;
    }
    public void setTaxaJurosMensal(BigDecimal taxaJurosMensal) {
        this.taxaJurosMensal = taxaJurosMensal;
    }
    public StatusCredito getStatusAprovacao() {
        return statusAprovacao;
    }
    public void setStatusAprovacao(StatusCredito statusAprovacao) {
        this.statusAprovacao = statusAprovacao;
    }
}
