import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Plus, Trash2, ArrowUpRight } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login, registerCliente, registerAgente } = useAuth();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  const [clienteForm, setClienteForm] = useState({
    nome: '',
    email: '',
    senha: '',
    rg: '',
    cpf: '',
    endereco: '',
    profissao: '',
  });

  const [rendimentos, setRendimentos] = useState([
    { entidadeEmpregadora: '', rendimentoMensal: '' },
  ]);

  const [agenteForm, setAgenteForm] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'ROLE_AGENTE_EMPRESA',
  });

  if (!isOpen) return null;

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginSenha);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClienteSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...clienteForm,
        rendimentos: rendimentos
          .filter(r => r.entidadeEmpregadora && r.rendimentoMensal)
          .map(r => ({
            entidadeEmpregadora: r.entidadeEmpregadora,
            rendimentoMensal: parseFloat(r.rendimentoMensal),
          })),
      };

      await registerCliente(payload);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao registrar cliente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAgenteSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerAgente(agenteForm);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao registrar agente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 border border-white/10 shadow-2xl relative my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-400 block mb-0.5">
              AUTENTICAÇÃO // LOGIN
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Acesso ao Sistema</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-1 p-1 bg-white/[0.03] rounded-full font-mono text-[10px] uppercase tracking-wider border border-white/[0.08]">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`py-1.5 rounded-full transition-all ${
              tab === 'login' ? 'bg-emerald-500 text-black font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab('reg-cliente'); setError(''); }}
            className={`py-1.5 rounded-full transition-all ${
              tab === 'reg-cliente' ? 'bg-emerald-500 text-black font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            Cliente
          </button>
          <button
            onClick={() => { setTab('reg-agente'); setError(''); }}
            className={`py-1.5 rounded-full transition-all ${
              tab === 'reg-agente' ? 'bg-emerald-500 text-black font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            Agente
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs">
            {error}
          </div>
        )}

        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4 font-mono text-xs">
            <div>
              <label className="block uppercase tracking-wider text-white/40 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="usuario@dominio.com"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-white/40 mb-1">Senha</label>
              <input
                type="password"
                required
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full liquid-pill-acid font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
            >
              <span>{loading ? 'Acessando...' : 'Entrar'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {tab === 'reg-cliente' && (
          <form onSubmit={handleRegisterClienteSubmit} className="mt-4 space-y-3 font-mono text-xs max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-white/40 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={clienteForm.nome}
                  onChange={(e) => setClienteForm({ ...clienteForm, nome: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-white/40 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={clienteForm.email}
                  onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-white/40 mb-1">Senha</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={clienteForm.senha}
                  onChange={(e) => setClienteForm({ ...clienteForm, senha: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-white/40 mb-1">Profissão</label>
                <input
                  type="text"
                  required
                  value={clienteForm.profissao}
                  onChange={(e) => setClienteForm({ ...clienteForm, profissao: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-white/40 mb-1">RG</label>
                <input
                  type="text"
                  required
                  value={clienteForm.rg}
                  onChange={(e) => setClienteForm({ ...clienteForm, rg: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-white/40 mb-1">CPF</label>
                <input
                  type="text"
                  required
                  value={clienteForm.cpf}
                  onChange={(e) => setClienteForm({ ...clienteForm, cpf: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-white/40 mb-1">Endereço Residencial</label>
              <input
                type="text"
                required
                value={clienteForm.endereco}
                onChange={(e) => setClienteForm({ ...clienteForm, endereco: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <span className="uppercase text-white/40">Empregadores ({rendimentos.length}/3)</span>
                {rendimentos.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddRendimento}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {rendimentos.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/[0.02] p-2 rounded-xl border border-white/[0.06]">
                    <input
                      type="text"
                      placeholder={`Empregador #${idx + 1}`}
                      required
                      value={r.entidadeEmpregadora}
                      onChange={(e) => handleRendimentoChange(idx, 'entidadeEmpregadora', e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-white/[0.04] border border-white/10 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Renda"
                      required
                      step="0.01"
                      value={r.rendimentoMensal}
                      onChange={(e) => handleRendimentoChange(idx, 'rendimentoMensal', e.target.value)}
                      className="w-24 px-2.5 py-1 text-xs rounded-lg bg-white/[0.04] border border-white/10 text-white"
                    />
                    {rendimentos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRendimento(idx)}
                        className="text-white/30 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full liquid-pill-acid font-bold uppercase tracking-wider mt-3"
            >
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
          </form>
        )}

        {tab === 'reg-agente' && (
          <form onSubmit={handleRegisterAgenteSubmit} className="mt-5 space-y-4 font-mono text-xs">
            <div>
              <label className="block uppercase tracking-wider text-white/40 mb-1">Razão Social / Nome</label>
              <input
                type="text"
                required
                value={agenteForm.nome}
                onChange={(e) => setAgenteForm({ ...agenteForm, nome: e.target.value })}
                placeholder="Santander Agente ou Localiza Frotas"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-white/40 mb-1">E-mail Corporativo</label>
              <input
                type="email"
                required
                value={agenteForm.email}
                onChange={(e) => setAgenteForm({ ...agenteForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-white/40 mb-1">Senha</label>
              <input
                type="password"
                required
                minLength={6}
                value={agenteForm.senha}
                onChange={(e) => setAgenteForm({ ...agenteForm, senha: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-white/40 mb-1">Tipo de Agente</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAgenteForm({ ...agenteForm, role: 'ROLE_AGENTE_EMPRESA' })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    agenteForm.role === 'ROLE_AGENTE_EMPRESA'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  <span className="block text-xs">Empresa</span>
                  <span className="text-[10px] text-white/40 block mt-0.5">Locadora</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAgenteForm({ ...agenteForm, role: 'ROLE_AGENTE_BANCO' })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    agenteForm.role === 'ROLE_AGENTE_BANCO'
                      ? 'border-purple-500/50 bg-purple-500/10 text-purple-300 font-bold'
                      : 'border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  <span className="block text-xs">Banco Agente</span>
                  <span className="text-[10px] text-white/40 block mt-0.5">Crédito</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full liquid-pill-acid font-bold uppercase tracking-wider mt-2"
            >
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
