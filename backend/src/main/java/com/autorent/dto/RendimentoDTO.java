package com.autorent.dto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
public class RendimentoDTO {
    private Long id;
    @NotBlank
    private String entidadeEmpregadora;
    @NotNull
    @DecimalMin("0.0")
    private BigDecimal rendimentoMensal;
    public RendimentoDTO() {}
    public RendimentoDTO(Long id, String entidadeEmpregadora, BigDecimal rendimentoMensal) {
        this.id = id;
        this.entidadeEmpregadora = entidadeEmpregadora;
        this.rendimentoMensal = rendimentoMensal;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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
