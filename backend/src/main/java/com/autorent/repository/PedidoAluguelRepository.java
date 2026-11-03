package com.autorent.repository;
import com.autorent.model.Cliente;
import com.autorent.model.PedidoAluguel;
import com.autorent.model.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {
    List<PedidoAluguel> findByClienteOrderByDataPedidoDesc(Cliente cliente);
    List<PedidoAluguel> findByStatusOrderByDataPedidoDesc(StatusPedido status);
    List<PedidoAluguel> findAllByOrderByDataPedidoDesc();
}
