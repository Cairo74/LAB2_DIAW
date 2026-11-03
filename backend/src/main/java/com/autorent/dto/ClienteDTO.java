package com.autorent.dto;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
public class ClienteDTO {
    private Long id;
    private Long usuarioId;
    private String email;
    private String rg;
    private String cpf;
    private String nome;
    private String endereco;
    private String profissao;
    private BigDecimal rendaTotal;
    private List<RendimentoDTO> rendimentos = new ArrayList<>();
    public ClienteDTO() {}
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUsuarioId() {
        return usuarioId;
    }
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getRg() {
        return rg;
    }
    public void setRg(String rg) {
        this.rg = rg;
    }
    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getEndereco() {
        return endereco;
    }
    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
    public String getProfissao() {
        return profissao;
    }
    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }
    public BigDecimal getRendaTotal() {
        return rendaTotal;
    }
    public void setRendaTotal(BigDecimal rendaTotal) {
        this.rendaTotal = rendaTotal;
    }
    public List<RendimentoDTO> getRendimentos() {
        return rendimentos;
    }
    public void setRendimentos(List<RendimentoDTO> rendimentos) {
        this.rendimentos = rendimentos;
    }
}
