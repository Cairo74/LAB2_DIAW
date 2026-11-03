package com.autorent.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
@Entity
@Table(name = "rendimentos_empregadores")
public class RendimentoEmpregador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    @NotBlank
    @Column(name = "entidade_empregadora", nullable = false)
    private String entidadeEmpregadora;
    @NotNull
    @DecimalMin("0.0")
    @Column(name = "rendimento_mensal", nullable = false, precision = 12, scale = 2)
    private BigDecimal rendimentoMensal;
    public RendimentoEmpregador() {}
    public RendimentoEmpregador(Cliente cliente, String entidadeEmpregadora, BigDecimal rendimentoMensal) {
        this.cliente = cliente;
        this.entidadeEmpregadora = entidadeEmpregadora;
        this.rendimentoMensal = rendimentoMensal;
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
    public String getEntidadeEmpregadora() {
        return entidadeEmpregadora;
    }
    public void setEntidadeEmpregadora(String entidadeEmpregadora) {
        this.entidadeEmpregadora = entidadeEmpregadora;
    }
    public BigDecimal getRendimentoMensal() {
        return rendimentoMensal;
    }
    public void setRendimentoMensal(BigDecimal rendimentoMensal) {
        this.rendimentoMensal = rendimentoMensal;
    }
}
