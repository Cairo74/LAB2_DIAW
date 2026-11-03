package com.autorent.repository;
import com.autorent.model.Cliente;
import com.autorent.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByUsuario(Usuario usuario);
    Optional<Cliente> findByCpf(String cpf);
    boolean existsByCpf(String cpf);
}
