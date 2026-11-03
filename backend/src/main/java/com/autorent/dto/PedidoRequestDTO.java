package com.autorent.dto;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
public class PedidoRequestDTO {
    @NotNull
    private Long automovelId;
    @NotNull
    private LocalDate dataInicio;
    @NotNull
    private LocalDate dataFim;
    private Boolean solicitarCredito = false;
    private String bancoAgenteNome;
    private Integer parcelas;
    public PedidoRequestDTO() {}
    public Long getAutomovelId() {
        return automovelId;
    }
    public void setAutomovelId(Long automovelId) {
        this.automovelId = automovelId;
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
    public Boolean getSolicitarCredito() {
        return solicitarCredito;
    }
    public void setSolicitarCredito(Boolean solicitarCredito) {
        this.solicitarCredito = solicitarCredito;
    }
    public String getBancoAgenteNome() {
        return bancoAgenteNome;
    }
    public void setBancoAgenteNome(String bancoAgenteNome) {
        this.bancoAgenteNome = bancoAgenteNome;
    }
    public Integer getParcelas() {
        return parcelas;
    }
    public void setParcelas(Integer parcelas) {
        this.parcelas = parcelas;
    }
}
