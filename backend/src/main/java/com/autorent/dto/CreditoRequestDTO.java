package com.autorent.dto;
import com.autorent.model.StatusCredito;
import jakarta.validation.constraints.NotNull;
public class CreditoRequestDTO {
    @NotNull
    private StatusCredito statusAprovacao; 
    public CreditoRequestDTO() {}
    public StatusCredito getStatusAprovacao() {
        return statusAprovacao;
    }
    public void setStatusAprovacao(StatusCredito statusAprovacao) {
        this.statusAprovacao = statusAprovacao;
    }
}
