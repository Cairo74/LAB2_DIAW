import React, { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

export default function RentalModal({ car, isOpen, onClose, onConfirm, user }) {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [solicitarCredito, setSolicitarCredito] = useState(false);
  const [bancoAgenteNome, setBancoAgenteNome] = useState('Banco Santander Financiamentos');
  const [parcelas, setParcelas] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !car) return null;

  let totalDias = 0;
  let valorTotal = 0;

  if (dataInicio && dataFim) {
    const d1 = new Date(dataInicio);
    const d2 = new Date(dataFim);
    const diffTime = d2.getTime() - d1.getTime();
    totalDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (totalDias <= 0) totalDias = 1;
    valorTotal = totalDias * car.valorDiaria;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!dataInicio || !dataFim) {
      setError('Informe o período do aluguel.');
      return;
    }

    if (new Date(dataFim) < new Date(dataInicio)) {
      setError('A data de término não pode ser anterior à data de início.');
      return;
    }

    setLoading(true);
    try {
      await onConfirm({
        automovelId: car.id,
        dataInicio,
        dataFim,
        solicitarCredito,
        bancoAgenteNome: solicitarCredito ? bancoAgenteNome : null,
        parcelas: solicitarCredito ? Number(parcelas) : null,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 border border-white/10 shadow-2xl relative">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-400 block mb-0.5">
              NOVO PEDIDO // CONTRATO
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Solicitação de Locação</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4">
          <img
            src={car.imagemUrl}
            alt={car.modelo}
            className="w-16 h-16 rounded-xl object-cover border border-white/10"
          />
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 block">{car.marca}</span>
            <h4 className="font-bold text-white text-sm">{car.modelo} ({car.ano})</h4>
            <p className="font-mono text-[11px] text-white/50 mt-0.5">Placa: {car.placa} • Diária: R$ {car.valorDiaria?.toFixed(2)}</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/50 mb-1.5">
                Data Início
              </label>
              <input
                type="date"
                required
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/50 mb-1.5">
                Data Término
              </label>
              <input
                type="date"
                required
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={solicitarCredito}
                onChange={(e) => setSolicitarCredito(e.target.checked)}
                className="mt-0.5 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0"
              />
              <div>
                <span className="font-mono text-xs font-bold text-white tracking-wide block">
                  Vincular Contrato de Crédito Bancário
                </span>
                <span className="text-[11px] text-white/40 block mt-0.5 leading-relaxed">
                  Financiamento emitido por banco agente credenciado na plataforma.
                </span>
              </div>
            </label>

            {solicitarCredito && (
              <div className="mt-3 pt-3 border-t border-white/[0.08] grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-1">Banco Agente</label>
                  <select
                    value={bancoAgenteNome}
                    onChange={(e) => setBancoAgenteNome(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-black/60 border border-white/10 text-white focus:border-emerald-500"
                  >
                    <option value="Banco Santander Financiamentos">Santander Financiamentos</option>
                    <option value="Banco Itaú Financiamentos">Itaú Financiamentos</option>
                    <option value="Banco do Brasil S.A.">Banco do Brasil S.A.</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-1">Parcelas</label>
                  <select
                    value={parcelas}
                    onChange={(e) => setParcelas(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-black/60 border border-white/10 text-white focus:border-emerald-500"
                  >
                    <option value="3">3x (1.89% a.m.)</option>
                    <option value="6">6x (1.89% a.m.)</option>
                    <option value="12">12x (1.89% a.m.)</option>
                    <option value="24">24x (1.89% a.m.)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {totalDias > 0 && (
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
              <span className="font-mono text-xs text-white/50">
                {totalDias} diária{totalDias > 1 ? 's' : ''}:
              </span>
              <span className="font-mono font-bold text-white text-base">
                R$ {valorTotal.toFixed(2)}
              </span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || totalDias <= 0}
              className="liquid-pill-acid rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <span>{loading ? 'Processando...' : 'Confirmar Pedido'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
