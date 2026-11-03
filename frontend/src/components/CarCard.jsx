import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function CarCard({ car, onRent }) {
  const getOwnerLabel = () => {
    switch (car.tipoProprietario) {
      case 'EMPRESA':
        return 'LOCADORA // FROTA';
      case 'BANCO':
        return 'BANCO AGENTE // CRÉDITO';
      default:
        return 'PARTICULAR';
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/[0.08] hover:border-emerald-500/40">
      <div className="relative h-48 bg-black/40 overflow-hidden">
        <img
          src={car.imagemUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
          alt={`${car.marca} ${car.modelo}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-emerald-400 border border-white/10">
            {getOwnerLabel()}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/60 backdrop-blur text-white/70 border border-white/10">
            {car.ano}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em] block mb-1">
            {car.marca}
          </span>
          <h3 className="text-base font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
            {car.modelo}
          </h3>

          <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2 font-mono text-[11px] text-white/50">
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-white/30">Placa</span>
              <span className="text-white/80">{car.placa}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-white/30">Titular</span>
              <span className="text-white/80 truncate block" title={car.proprietarioNome}>
                {car.proprietarioNome}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/30 block">Diária</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg font-bold text-white">
                R$ {car.valorDiaria?.toFixed(2)}
              </span>
              <span className="text-[10px] text-white/40">/dia</span>
            </div>
          </div>

          <button
            onClick={() => onRent(car)}
            className="liquid-pill-acid rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <span>Alugar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
