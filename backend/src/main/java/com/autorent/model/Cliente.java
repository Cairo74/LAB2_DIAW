package com.autorent.model;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "clientes")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;
    @NotBlank
    @Column(nullable = false)
    private String rg;
    @NotBlank
    @Column(unique = true, nullable = false)
    private String cpf;
    @NotBlank
    @Column(nullable = false)
    private String nome;
    @NotBlank
    @Column(nullable = false)
    private String endereco;
    @NotBlank
    @Column(nullable = false)
    private String profissao;
    @JsonManagedReference
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<RendimentoEmpregador> rendimentos = new ArrayList<>();
    public Cliente() {}
    public Cliente(Usuario usuario, String rg, String cpf, String nome, String endereco, String profissao) {
        this.usuario = usuario;
        this.rg = rg;
        this.cpf = cpf;
        this.nome = nome;
        this.endereco = endereco;
        this.profissao = profissao;
    }
    public BigDecimal getRendaTotal() {
        if (rendimentos == null || rendimentos.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return rendimentos.stream()
                .map(RendimentoEmpregador::getRendimentoMensal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    public void addRendimento(RendimentoEmpregador rendimento) {
        if (this.rendimentos.size() >= 3) {
            throw new IllegalStateException("O cliente pode possuir no máximo 3 entidades empregadoras e rendimentos.");
        }
        rendimento.setCliente(this);
        this.rendimentos.add(rendimento);
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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
    public List<RendimentoEmpregador> getRendimentos() {
        return rendimentos;
    }
    public void setRendimentos(List<RendimentoEmpregador> rendimentos) {
        if (rendimentos != null && rendimentos.size() > 3) {
            throw new IllegalArgumentException("Máximo de 3 rendimentos/empregadores permitidos por cliente.");
        }
        this.rendimentos.clear();
        if (rendimentos != null) {
            for (RendimentoEmpregador r : rendimentos) {
                addRendimento(r);
            }
        }
    }
}
