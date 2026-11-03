package com.autorent.repository;
import com.autorent.model.ContratoCredito;
import com.autorent.model.StatusCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ContratoCreditoRepository extends JpaRepository<ContratoCredito, Long> {
    List<ContratoCredito> findByStatusAprovacao(StatusCredito status);
    List<ContratoCredito> findByBancoAgenteNome(String bancoAgenteNome);
}
