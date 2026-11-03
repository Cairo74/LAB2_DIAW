package com.autorent.repository;
import com.autorent.model.Cliente;
import com.autorent.model.RendimentoEmpregador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface RendimentoEmpregadorRepository extends JpaRepository<RendimentoEmpregador, Long> {
    List<RendimentoEmpregador> findByCliente(Cliente cliente);
    void deleteByCliente(Cliente cliente);
}
