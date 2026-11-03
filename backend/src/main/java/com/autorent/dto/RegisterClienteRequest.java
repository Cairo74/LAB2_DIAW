package com.autorent.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
public class RegisterClienteRequest {
    @NotBlank
    @Email
    private String email;
    @NotBlank
    @Size(min = 6)
    private String senha;
    @NotBlank
    private String nome;
    @NotBlank
    private String rg;
    @NotBlank
    private String cpf;
    @NotBlank
    private String endereco;
    @NotBlank
    private String profissao;
    @Size(max = 3, message = "Máximo de 3 entidades empregadoras e rendimentos permitidos")
    private List<RendimentoDTO> rendimentos = new ArrayList<>();
    public RegisterClienteRequest() {}
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
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
    public List<RendimentoDTO> getRendimentos() {
        return rendimentos;
    }
    public void setRendimentos(List<RendimentoDTO> rendimentos) {
        this.rendimentos = rendimentos;
    }
}
