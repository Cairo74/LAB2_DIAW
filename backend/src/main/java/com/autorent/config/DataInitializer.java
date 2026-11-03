package com.autorent.config;
import com.autorent.model.Automovel;
import com.autorent.model.TipoProprietario;
import com.autorent.repository.AutomovelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;
@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private AutomovelRepository automovelRepository;
    @Override
    public void run(String... args) {
        if (automovelRepository.count() == 0) {
            List<Automovel> frotaInicial = List.of(
                    new Automovel(
                            "MAT-001-2024", 2024, "Toyota", "Corolla Cross XRE", "BRA2E19",
                            TipoProprietario.EMPRESA, "Localiza Rent a Car", new BigDecimal("190.00"),
                            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"
                    ),
                    new Automovel(
                            "MAT-002-2023", 2023, "Jeep", "Compass Limited 1.3 Turbo", "PUC4D26",
                            TipoProprietario.BANCO, "Banco Santander Financiamentos", new BigDecimal("230.00"),
                            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
                    ),
                    new Automovel(
                            "MAT-003-2025", 2025, "BYD", "Song Plus Híbrido", "DIA9B88",
                            TipoProprietario.EMPRESA, "Movida Frotas Corporativas", new BigDecimal("260.00"),
                            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                    ),
                    new Automovel(
                            "MAT-004-2023", 2023, "Volkswagen", "Nivus Highline TSI", "BHT1A34",
                            TipoProprietario.CLIENTE, "Gestão Particular Cedida", new BigDecimal("145.00"),
                            "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
                    ),
                    new Automovel(
                            "MAT-005-2024", 2024, "BMW", "320i M Sport", "ENG7S25",
                            TipoProprietario.BANCO, "Banco Itaú Financiamentos", new BigDecimal("420.00"),
                            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
                    )
            );
            automovelRepository.saveAll(frotaInicial);
        }
    }
}
