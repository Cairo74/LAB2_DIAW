package com.autorent.dto;
import com.autorent.model.TipoProprietario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
public class AutomovelDTO {
    private Long id;
    @NotBlank
    private String matricula;
    @NotNull
    private Integer ano;
    @NotBlank
    private String marca;
    @NotBlank
    private String modelo;
    @NotBlank
    private String placa;
    @NotNull
    private TipoProprietario tipoProprietario;
    @NotBlank
    private String proprietarioNome;
    @NotNull
    private BigDecimal valorDiaria;
    private Boolean disponivel = true;
    private String imagemUrl;
    public AutomovelDTO() {}
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
