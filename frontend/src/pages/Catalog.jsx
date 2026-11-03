import React, { useState, useEffect } from 'react';
import { automovelService, pedidoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/CarCard';
import RentalModal from '../components/RentalModal';
import { Search, ArrowUpRight } from 'lucide-react';

export default function Catalog({ onRequireLogin }) {
  const { user, isCliente } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('ALL');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await automovelService.listarDisponiveis();
      setCars(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRentClick = (car) => {
    if (!user) {
      onRequireLogin();
      return;
    }
    if (!isCliente) {
      alert('Apenas clientes cadastrados podem solicitar pedidos de aluguel.');
      return;
    }
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleConfirmRental = async (rentalData) => {
    await pedidoService.criar(rentalData);
    setSuccessMessage('Pedido registrado com sucesso. Aguardando avaliação financeira dos agentes.');
    fetchCars();
    setTimeout(() => setSuccessMessage(''), 7000);
  };

  const filteredCars = cars.filter((car) => {
    const matchSearch =
      car.marca.toLowerCase().includes(search.toLowerCase()) ||
      car.modelo.toLowerCase().includes(search.toLowerCase()) ||
      car.placa.toLowerCase().includes(search.toLowerCase());

    const matchOwner = selectedOwner === 'ALL' || car.tipoProprietario === selectedOwner;
    return matchSearch && matchOwner;
  });

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      
      <div className="border-t border-white/[0.12] pt-6 mb-12">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 mb-8">
          <span>PUC MINAS // ENGENHARIA DE SOFTWARE</span>
          <span>LAB 02 // DIAW 2026</span>
        </div>

        <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold tracking-[-0.035em] text-white leading-[1.05] max-w-4xl">
          Gestão e Locação de Veículos<span className="text-emerald-400">.</span>
        </h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-white/[0.1] pt-6 items-baseline">
          <p className="text-white/60 text-sm md:text-base leading-relaxed md:col-span-7">
            Plataforma web para formalização, análise de risco e execução de contratos de aluguel de automóveis com integração de crédito bancário.
          </p>

          <div className="md:col-span-5 md:text-right font-mono text-xs text-white/40">
            <span>FROTA DISPONÍVEL: </span>
            <span className="text-emerald-400 font-bold">{cars.length} UNIDADES</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs">
          {successMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por marca, modelo ou placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.08] overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'EMPRESA', label: 'Empresas' },
            { id: 'BANCO', label: 'Bancos' },
            { id: 'CLIENTE', label: 'Particulares' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedOwner(tab.id)}
              className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all ${
                selectedOwner === tab.id
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 font-mono text-xs text-white/40">CONSULTANDO BASE DE DADOS...</p>
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-white/40 font-mono text-xs">
          NENHUM VEÍCULO ENCONTRADO PARA OS FILTROS APLICADOS.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} onRent={handleRentClick} />
          ))}
        </div>
      )}

      <RentalModal
        car={selectedCar}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmRental}
        user={user}
      />
    </div>
  );
}
