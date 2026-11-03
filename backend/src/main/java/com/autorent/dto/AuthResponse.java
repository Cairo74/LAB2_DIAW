package com.autorent.dto;
import com.autorent.model.Role;
public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String nome;
    private Role role;
    private Long clienteId;
    public AuthResponse() {}
    public AuthResponse(String token, Long id, String email, String nome, Role role, Long clienteId) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.role = role;
        this.clienteId = clienteId;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }
    public Long getClienteId() {
        return clienteId;
    }
    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
}
