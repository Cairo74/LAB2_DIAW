import React, { useState, useEffect } from 'react';
import { pedidoService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { ArrowUpRight } from 'lucide-react';

export default function MyOrders() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPedido, setEditingPedido] = useState(null);
  const [editForm, setEditForm] = useState({ dataInicio: '', dataFim: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const res = await pedidoService.listarMeus();
      setPedidos(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Confirmar cancelamento deste pedido?')) return;
    try {
      setActionLoading(true);
      await pedidoService.cancelar(id);
      setMessage('Pedido cancelado com sucesso.');
      fetchPedidos();
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      alert(e.response?.data?.message || 'Erro ao cancelar pedido.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEdit = (p) => {
    setEditingPedido(p);
    setEditForm({
      dataInicio: p.dataInicio,
      dataFim: p.dataFim,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await pedidoService.modificar(editingPedido.id, {
        automovelId: editingPedido.automovel.id,
        dataInicio: editForm.dataInicio,
        dataFim: editForm.dataFim,
      });
      setEditingPedido(null);
      setMessage('Pedido alterado. Retornado para avaliação.');
      fetchPedidos();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao alterar pedido.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      
      <div className="border-t border-white/[0.12] pt-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 block mb-1">
            CLIENTE // HISTÓRICO DE CONTRATOS
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">Meus Pedidos de Locação</h1>
        </div>
        <button
          onClick={fetchPedidos}
          className="liquid-pill px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider text-white/70 hover:text-white"
        >
          Sincronizar
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs">
          {message}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : pedidos.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-white/40 font-mono text-xs">
          NENHUM PEDIDO REGISTRADO.
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="glass-card rounded-2xl p-5 border border-white/[0.08]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <img
                    src={pedido.automovel?.imagemUrl}
                    alt={pedido.automovel?.modelo}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                        PEDIDO #{pedido.id}
                      </span>
                      <StatusBadge status={pedido.status} />
                    </div>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {pedido.automovel?.marca} {pedido.automovel?.modelo} ({pedido.automovel?.ano})
                    </h3>
                    <p className="font-mono text-[11px] text-white/40 mt-0.5">
                      Placa: {pedido.automovel?.placa} • Titular: {pedido.automovel?.proprietarioNome}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/30 block">Período</span>
                    <span className="text-white/80">{pedido.dataInicio} → {pedido.dataFim}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/30 block">Total</span>
                    <span className="font-bold text-white">R$ {pedido.valorTotal?.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[9px] uppercase tracking-wider text-white/30 block">Crédito</span>
                    <span className="text-white/60">
                      {pedido.contratoCredito ? `${pedido.contratoCredito.bancoAgenteNome}` : 'Sem financiamento'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center">
                  {pedido.status !== 'EM_EXECUCAO' && pedido.status !== 'FINALIZADO' && pedido.status !== 'CANCELADO' && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(pedido)}
                        className="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider bg-white/[0.05] hover:bg-white/10 text-white border border-white/10"
                      >
                        Alterar
                      </button>
                      <button
                        onClick={() => handleCancel(pedido.id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>

              </div>

              {(pedido.parecerAgente || pedido.contratoCredito) && (
                <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  {pedido.parecerAgente && (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white/70">
                      <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-1">
                        PARECER FINANCEIRO // {pedido.agenteResponsavel || 'AGENTE'}
                      </span>
                      <p>{pedido.parecerAgente}</p>
                    </div>
                  )}

                  {pedido.contratoCredito && (
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200">
                      <span className="text-[9px] uppercase tracking-wider text-purple-300 block mb-1">
                        CONTRATO DE CRÉDITO BANCÁRIO
                      </span>
                      <p>
                        {pedido.contratoCredito.bancoAgenteNome} • R$ {pedido.contratoCredito.valorFinanciado?.toFixed(2)} em {pedido.contratoCredito.numeroParcelas}x ({pedido.contratoCredito.taxaJurosMensal}% a.m.)
                      </p>
                      <p className="mt-1 font-bold text-emerald-400">STATUS: {pedido.contratoCredito.statusAprovacao}</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {editingPedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 border border-white/10">
            <h3 className="text-base font-bold text-white">Alterar Pedido #{editingPedido.id}</h3>
            <p className="font-mono text-xs text-white/40 mt-1">Ajuste as datas de início e término.</p>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 font-mono text-xs">
              <div>
                <label className="block text-white/50 mb-1">DATA INÍCIO</label>
                <input
                  type="date"
                  required
                  value={editForm.dataInicio}
                  onChange={(e) => setEditForm({ ...editForm, dataInicio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-white/50 mb-1">DATA TÉRMINO</label>
                <input
                  type="date"
                  required
                  value={editForm.dataFim}
                  onChange={(e) => setEditForm({ ...editForm, dataFim: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPedido(null)}
                  className="px-4 py-2 uppercase tracking-wider text-white/50 hover:text-white"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="liquid-pill-acid rounded-full px-4 py-2 uppercase tracking-wider text-xs font-bold"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
