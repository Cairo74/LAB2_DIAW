package com.autorent.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
@Entity
@Table(name = "automoveis")
public class Automovel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(unique = true, nullable = false)
    private String matricula;
    @NotNull
    @Column(nullable = false)
    private Integer ano;
    @NotBlank
    @Column(nullable = false)
    private String marca;
    @NotBlank
    @Column(nullable = false)
    private String modelo;
    @NotBlank
    @Column(unique = true, nullable = false)
    private String placa;
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_proprietario", nullable = false)
    private TipoProprietario tipoProprietario;
    @NotBlank
    @Column(name = "proprietario_nome", nullable = false)
    private String proprietarioNome;
    @NotNull
    @Column(name = "valor_diaria", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorDiaria;
    @Column(nullable = false)
    private Boolean disponivel = true;
    @Column(name = "imagem_url")
    private String imagemUrl;
    public Automovel() {}
    public Automovel(String matricula, Integer ano, String marca, String modelo, String placa,
                     TipoProprietario tipoProprietario, String proprietarioNome, BigDecimal valorDiaria, String imagemUrl) {
        this.matricula = matricula;
        this.ano = ano;
        this.marca = marca;
        this.modelo = modelo;
        this.placa = placa;
        this.tipoProprietario = tipoProprietario;
        this.proprietarioNome = proprietarioNome;
        this.valorDiaria = valorDiaria;
        this.disponivel = true;
        this.imagemUrl = imagemUrl;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getMatricula() {
        return matricula;
    }
    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }
    public Integer getAno() {
        return ano;
    }
    public void setAno(Integer ano) {
        this.ano = ano;
    }
    public String getMarca() {
        return marca;
    }
    public void setMarca(String marca) {
        this.marca = marca;
    }
    public String getModelo() {
        return modelo;
    }
    public void setModelo(String modelo) {
        this.modelo = modelo;
    }
    public String getPlaca() {
        return placa;
    }
    public void setPlaca(String placa) {
        this.placa = placa;
    }
    public TipoProprietario getTipoProprietario() {
        return tipoProprietario;
    }
    public void setTipoProprietario(TipoProprietario tipoProprietario) {
        this.tipoProprietario = tipoProprietario;
    }
    public String getProprietarioNome() {
        return proprietarioNome;
    }
    public void setProprietarioNome(String proprietarioNome) {
        this.proprietarioNome = proprietarioNome;
    }
    public BigDecimal getValorDiaria() {
        return valorDiaria;
    }
    public void setValorDiaria(BigDecimal valorDiaria) {
        this.valorDiaria = valorDiaria;
    }
    public Boolean getDisponivel() {
        return disponivel;
    }
    public void setDisponivel(Boolean disponivel) {
        this.disponivel = disponivel;
    }
    public String getImagemUrl() {
        return imagemUrl;
    }
    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }
}
