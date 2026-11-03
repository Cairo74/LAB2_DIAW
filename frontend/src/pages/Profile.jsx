import React, { useState, useEffect } from 'react';
import { clienteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Profile() {
  const { user, cliente, fetchClienteData } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    rg: '',
    cpf: '',
    endereco: '',
    profissao: '',
  });
  const [rendimentos, setRendimentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome || '',
        rg: cliente.rg || '',
        cpf: cliente.cpf || '',
        endereco: cliente.endereco || '',
        profissao: cliente.profissao || '',
      });
      setRendimentos(cliente.rendimentos || []);
    }
  }, [cliente]);

  const handleAddRendimento = () => {
    if (rendimentos.length < 3) {
      setRendimentos([...rendimentos, { entidadeEmpregadora: '', rendimentoMensal: '' }]);
    }
  };

  const handleRemoveRendimento = (index) => {
    setRendimentos(rendimentos.filter((_, i) => i !== index));
  };

  const handleRendimentoChange = (index, field, value) => {
    const updated = [...rendimentos];
    updated[index][field] = value;
    setRendimentos(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        rendimentos: rendimentos
          .filter(r => r.entidadeEmpregadora && r.rendimentoMensal)
          .map(r => ({
            id: r.id || null,
            entidadeEmpregadora: r.entidadeEmpregadora,
            rendimentoMensal: parseFloat(r.rendimentoMensal),
          })),
      };

      await clienteService.updatePerfil(cliente.id, payload);
      await fetchClienteData();
      setMessage('Cadastro atualizado com sucesso.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar dados.');
    } finally {
      setLoading(false);
    }
  };

  const totalRenda = rendimentos.reduce(
    (acc, curr) => acc + (parseFloat(curr.rendimentoMensal) || 0),
    0
  );

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      
      <div className="border-t border-white/[0.12] pt-6 mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 block mb-1">
          CLIENTE // CRUD
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dados Cadastrais e Rendimentos</h1>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/70 mb-4">
            IDENTIFICAÇÃO
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">Profissão</label>
              <input
                type="text"
                required
                value={formData.profissao}
                onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">RG</label>
              <input
                type="text"
                required
                value={formData.rg}
                onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">CPF (Chave Primária)</label>
              <input
                type="text"
                required
                disabled
                value={formData.cpf}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.02] border border-white/[0.06] text-white/40 cursor-not-allowed font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">Endereço</label>
              <input
                type="text"
                required
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/70">
                EMPREGADORES E RENDIMENTOS
              </h2>
              <span className="font-mono text-[10px] text-white/40 block mt-0.5">
                Limite de até 3 fontes empregadoras com salários
              </span>
            </div>

            {rendimentos.length < 3 && (
              <button
                type="button"
                onClick={handleAddRendimento}
                className="liquid-pill px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Adicionar ({rendimentos.length}/3)
              </button>
            )}
          </div>

          <div className="space-y-3">
            {rendimentos.map((r, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex-1 w-full">
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-1">Empresa #{idx + 1}</label>
                  <input
                    type="text"
                    required
                    placeholder="Razão Social / Empregador"
                    value={r.entidadeEmpregadora}
                    onChange={(e) => handleRendimentoChange(idx, 'entidadeEmpregadora', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-1">Rendimento Mensal</label>
                  <div className="relative">
                    <span className="font-mono text-xs text-white/30 absolute left-3 top-1/2 -translate-y-1/2">R$</span>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="0.00"
                      value={r.rendimentoMensal}
                      onChange={(e) => handleRendimentoChange(idx, 'rendimentoMensal', e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                {rendimentos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRendimento(idx)}
                    className="self-end sm:self-center mt-2 sm:mt-4 p-2 rounded-lg text-white/30 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono">
            <span className="text-[11px] uppercase tracking-wider text-white/40">Renda Mensal Comprovada:</span>
            <span className="text-base font-bold text-emerald-400">
              R$ {totalRenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="liquid-pill-acid rounded-full px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-40"
          >
            {loading ? 'Salvando...' : 'Salvar Cadastro'}
          </button>
        </div>

      </form>
    </div>
  );
}
