package com.autorent.repository;
import com.autorent.model.Automovel;
import com.autorent.model.TipoProprietario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface AutomovelRepository extends JpaRepository<Automovel, Long> {
    Optional<Automovel> findByMatricula(String matricula);
    Optional<Automovel> findByPlaca(String placa);
    List<Automovel> findByDisponivelTrue();
    List<Automovel> findByTipoProprietario(TipoProprietario tipoProprietario);
}
