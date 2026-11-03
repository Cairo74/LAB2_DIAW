import React, { useState, useEffect } from 'react';
import { pedidoService, automovelService, creditoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { X, ArrowUpRight } from 'lucide-react';

export default function AgentDashboard() {
  const { user, isAgenteBanco } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [creditos, setCreditos] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [selectedPedido, setSelectedPedido] = useState(null);
  const [avaliacaoForm, setAvaliacaoForm] = useState({
    novoStatus: 'AVALIADO_POSITIVO',
    parecer: '',
  });

  const [novoCarro, setNovoCarro] = useState({
    matricula: '',
    ano: 2024,
    marca: '',
    modelo: '',
    placa: '',
    tipoProprietario: 'EMPRESA',
    proprietarioNome: user?.nome || 'Empresa Agente',
    valorDiaria: '',
    imagemUrl: '',
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resPed, resAut, resCred] = await Promise.all([
        pedidoService.listarTodos(),
        automovelService.listarTodos(),
        creditoService.listarTodos(),
      ]);
      setPedidos(resPed.data);
      setVeiculos(resAut.data);
      setCreditos(resCred.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAvaliar = (pedido) => {
    setSelectedPedido(pedido);
    setAvaliacaoForm({
      novoStatus: 'AVALIADO_POSITIVO',
      parecer: 'Parecer positivo emitido após validação financeira e de crédito.',
    });
  };

  const handleSubmeterAvaliacao = async (e) => {
    e.preventDefault();
    try {
      await pedidoService.avaliar(selectedPedido.id, avaliacaoForm);
      setSelectedPedido(null);
      setMessage('Parecer registrado no pedido.');
      loadAllData();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao avaliar pedido.');
    }
  };

  const handleAvaliarCredito = async (creditoId, statusAprovacao) => {
    try {
      await creditoService.avaliar(creditoId, { statusAprovacao });
      setMessage(`Contrato de crédito atualizado para ${statusAprovacao}.`);
      loadAllData();
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      alert(e.response?.data?.message || 'Erro ao avaliar crédito.');
    }
  };

  const handleCriarVeiculo = async (e) => {
    e.preventDefault();
    try {
      await automovelService.criar({
        ...novoCarro,
        ano: Number(novoCarro.ano),
        valorDiaria: parseFloat(novoCarro.valorDiaria),
      });
      setMessage('Veículo cadastrado na frota.');
      setNovoCarro({
        matricula: '',
        ano: 2024,
        marca: '',
        modelo: '',
        placa: '',
        tipoProprietario: 'EMPRESA',
        proprietarioNome: user?.nome || 'Empresa Agente',
        valorDiaria: '',
        imagemUrl: '',
      });
      loadAllData();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao cadastrar automóvel.');
    }
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      
      <div className="border-t border-white/[0.12] pt-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 block mb-1">
            AGENTE // PAINEL OPERACIONAL
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">Avaliação Financeira e Frota</h1>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <button
            onClick={() => setActiveSubTab('pedidos')}
            className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all ${
              activeSubTab === 'pedidos' ? 'bg-emerald-500 text-black font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            Pedidos ({pedidos.length})
          </button>
          <button
            onClick={() => setActiveSubTab('veiculos')}
            className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all ${
              activeSubTab === 'veiculos' ? 'bg-emerald-500 text-black font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            Cadastrar Veículo
          </button>
          {isAgenteBanco && (
            <button
              onClick={() => setActiveSubTab('creditos')}
              className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all ${
                activeSubTab === 'creditos' ? 'bg-purple-500 text-white font-bold' : 'text-white/50 hover:text-white'
              }`}
            >
              Créditos ({creditos.length})
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs">
          {message}
        </div>
      )}

      {activeSubTab === 'pedidos' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pedidos.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-white/40 font-mono text-xs">
              NENHUM PEDIDO PARA ANÁLISE NO MOMENTO.
            </div>
          ) : (
            pedidos.map((p) => (
              <div key={p.id} className="glass-card rounded-2xl p-5 border border-white/[0.08]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                        PEDIDO #{p.id}
                      </span>
                      <StatusBadge status={p.status} />
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {p.cliente?.nome} <span className="font-mono text-xs text-white/40">(CPF: {p.cliente?.cpf} • {p.cliente?.profissao})</span>
                    </h3>

                    <p className="font-mono text-xs text-white/60 mt-1">
                      {p.automovel?.marca} {p.automovel?.modelo} ({p.automovel?.ano}) • Placa: {p.automovel?.placa} • Titular: {p.automovel?.proprietarioNome}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 font-mono text-xs text-white/50">
                      <span>Período: <b className="text-white">{p.dataInicio} → {p.dataFim}</b></span>
                      <span>Total: <b className="text-white">R$ {p.valorTotal?.toFixed(2)}</b></span>
                      <span>Renda Cliente: <b className="text-emerald-400">R$ {p.cliente?.rendaTotal?.toFixed(2) || '0.00'}</b></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <button
                      onClick={() => handleOpenAvaliar(p)}
                      className="liquid-pill-acid rounded-full px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <span>Avaliar</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {p.parecerAgente && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06] font-mono text-xs text-white/50">
                    <span className="text-white/70">Último Parecer ({p.agenteResponsavel}): </span>
                    {p.parecerAgente}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'veiculos' && (
        <div className="max-w-2xl glass-card rounded-2xl p-6 border border-white/[0.08]">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/70 mb-4">
            REGISTRO DE AUTOMÓVEL NA BASE
          </h2>

          <form onSubmit={handleCriarVeiculo} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/40 uppercase mb-1">Matrícula</label>
                <input
                  type="text"
                  required
                  placeholder="MAT-101-2024"
                  value={novoCarro.matricula}
                  onChange={(e) => setNovoCarro({ ...novoCarro, matricula: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-white/40 uppercase mb-1">Placa</label>
                <input
                  type="text"
                  required
                  placeholder="ABC1D23"
                  value={novoCarro.placa}
                  onChange={(e) => setNovoCarro({ ...novoCarro, placa: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-white/40 uppercase mb-1">Marca</label>
                <input
                  type="text"
                  required
                  placeholder="Toyota"
                  value={novoCarro.marca}
                  onChange={(e) => setNovoCarro({ ...novoCarro, marca: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-white/40 uppercase mb-1">Modelo</label>
                <input
                  type="text"
                  required
                  placeholder="Corolla"
                  value={novoCarro.modelo}
                  onChange={(e) => setNovoCarro({ ...novoCarro, modelo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-white/40 uppercase mb-1">Ano</label>
                <input
                  type="number"
                  required
                  value={novoCarro.ano}
                  onChange={(e) => setNovoCarro({ ...novoCarro, ano: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/40 uppercase mb-1">Propriedade</label>
                <select
                  value={novoCarro.tipoProprietario}
                  onChange={(e) => setNovoCarro({ ...novoCarro, tipoProprietario: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-emerald-500"
                >
                  <option value="EMPRESA">Empresa Locadora</option>
                  <option value="BANCO">Banco Agente</option>
                  <option value="CLIENTE">Cliente Particular</option>
                </select>
              </div>
              <div>
                <label className="block text-white/40 uppercase mb-1">Titular da Propriedade</label>
                <input
                  type="text"
                  required
                  value={novoCarro.proprietarioNome}
                  onChange={(e) => setNovoCarro({ ...novoCarro, proprietarioNome: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/40 uppercase mb-1">Valor Diária (R$)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="190.00"
                  value={novoCarro.valorDiaria}
                  onChange={(e) => setNovoCarro({ ...novoCarro, valorDiaria: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-white/40 uppercase mb-1">URL da Imagem</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={novoCarro.imagemUrl}
                  onChange={(e) => setNovoCarro({ ...novoCarro, imagemUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full liquid-pill-acid font-mono text-xs font-bold uppercase tracking-wider mt-2"
            >
              Registrar Automóvel
            </button>
          </form>
        </div>
      )}

      {activeSubTab === 'creditos' && isAgenteBanco && (
        <div className="space-y-4">
          {creditos.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-white/40 font-mono text-xs">
              NENHUM CONTRATO DE CRÉDITO ASSOCIADO.
            </div>
          ) : (
            creditos.map((c) => (
              <div key={c.id} className="glass-card rounded-2xl p-5 border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
                      CRÉDITO #{c.id}
                    </span>
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-white/80">
                      STATUS: {c.statusAprovacao}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Banco Responsável: {c.bancoAgenteNome}
                  </h4>
                  <p className="font-mono text-xs text-white/50 mt-1">
                    Financiado: R$ {c.valorFinanciado?.toFixed(2)} em {c.numeroParcelas}x ({c.taxaJurosMensal}% a.m.)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAvaliarCredito(c.id, 'APROVADO')}
                    className="liquid-pill-acid rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase font-bold"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleAvaliarCredito(c.id, 'REJEITADO')}
                    className="px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedPedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl max-w-lg w-full p-6 border border-white/10">
            <h3 className="text-base font-bold text-white">Avaliação Financeira // Pedido #{selectedPedido.id}</h3>
            <p className="font-mono text-xs text-white/40 mt-0.5">
              Cliente: {selectedPedido.cliente?.nome} | Total: R$ {selectedPedido.valorTotal?.toFixed(2)}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs">
              <span className="text-white/40 uppercase block mb-1">Rendimentos Declarados:</span>
              {selectedPedido.cliente?.rendimentos && selectedPedido.cliente.rendimentos.length > 0 ? (
                <ul className="space-y-1 text-white/80">
                  {selectedPedido.cliente.rendimentos.map((r, i) => (
                    <li key={i}>• {r.entidadeEmpregadora}: R$ {r.rendimentoMensal?.toFixed(2)}/mês</li>
                  ))}
                </ul>
              ) : (
                <span className="text-white/40">Nenhum rendimento cadastrado.</span>
              )}
            </div>

            <form onSubmit={handleSubmeterAvaliacao} className="mt-4 space-y-3 font-mono text-xs">
              <div>
                <label className="block text-white/40 uppercase mb-1">Status da Decisão</label>
                <select
                  value={avaliacaoForm.novoStatus}
                  onChange={(e) => setAvaliacaoForm({ ...avaliacaoForm, novoStatus: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:border-emerald-500"
                >
                  <option value="AVALIADO_POSITIVO">Parecer Positivo (Aprovado)</option>
                  <option value="AVALIADO_NEGATIVO">Parecer Negativo (Recusado)</option>
                  <option value="EM_EXECUCAO">Executar Contrato Imediatamente</option>
                </select>
              </div>

              <div>
                <label className="block text-white/40 uppercase mb-1">Parecer Descritivo</label>
                <textarea
                  required
                  rows={3}
                  value={avaliacaoForm.parecer}
                  onChange={(e) => setAvaliacaoForm({ ...avaliacaoForm, parecer: e.target.value })}
                  placeholder="Justificativa da análise de risco..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPedido(null)}
                  className="px-4 py-2 uppercase tracking-wider text-white/50 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="liquid-pill-acid rounded-full px-4 py-2 uppercase tracking-wider font-bold"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
