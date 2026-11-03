package com.autorent.dto;
import com.autorent.model.StatusPedido;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
public class AvaliacaoPedidoDTO {
    @NotNull
    private StatusPedido novoStatus; 
    @NotBlank
    private String parecer;
    private LocalDate novaDataInicio;
    private LocalDate novaDataFim;
    private BigDecimal novoValorTotal;
    public AvaliacaoPedidoDTO() {}
    public StatusPedido getNovoStatus() {
        return novoStatus;
    }
    public void setNovoStatus(StatusPedido novoStatus) {
        this.novoStatus = novoStatus;
    }
    public String getParecer() {
        return parecer;
    }
    public void setParecer(String parecer) {
        this.parecer = parecer;
    }
    public LocalDate getNovaDataInicio() {
        return novaDataInicio;
    }
    public void setNovaDataInicio(LocalDate novaDataInicio) {
        this.novaDataInicio = novaDataInicio;
    }
    public LocalDate getNovaDataFim() {
        return novaDataFim;
    }
    public void setNovaDataFim(LocalDate novaDataFim) {
        this.novaDataFim = novaDataFim;
    }
    public BigDecimal getNovoValorTotal() {
        return novoValorTotal;
    }
    public void setNovoValorTotal(BigDecimal novoValorTotal) {
        this.novoValorTotal = novoValorTotal;
    }
}
