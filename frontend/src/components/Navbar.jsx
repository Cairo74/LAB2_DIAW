import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowUpRight, LogOut, Shield, FileText, User, Car } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenLogin }) {
  const { user, isCliente, isAgente, logout } = useAuth();

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
      <div className="pointer-events-auto liquid-pill rounded-full px-3 py-2 flex items-center gap-2 sm:gap-6 max-w-5xl w-full justify-between">
        
        <div 
          onClick={() => setActiveTab('catalog')}
          className="flex items-center gap-3 cursor-pointer pl-2 group"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Car className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-white text-sm">AUTORENT</span>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] transition-all ${
              activeTab === 'catalog'
                ? 'bg-white/10 text-emerald-400 font-semibold border border-emerald-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Frota
          </button>

          {isCliente && (
            <>
              <button
                onClick={() => setActiveTab('my-orders')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] transition-all ${
                  activeTab === 'my-orders'
                    ? 'bg-white/10 text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Pedidos
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] transition-all ${
                  activeTab === 'profile'
                    ? 'bg-white/10 text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Cadastro
              </button>
            </>
          )}

          {isAgente && (
            <button
              onClick={() => setActiveTab('agent-dashboard')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] transition-all ${
                activeTab === 'agent-dashboard'
                  ? 'bg-white/10 text-emerald-400 font-semibold border border-emerald-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Agente
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2 pr-1">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <span className="block text-xs font-medium text-white/90 leading-tight truncate max-w-[140px]">{user.nome}</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">
                  {user.role === 'ROLE_CLIENTE' ? 'CLIENTE' : user.role === 'ROLE_AGENTE_BANCO' ? 'BANCO AGENTE' : 'EMPRESA AGENTE'}
                </span>
              </div>
              <button
                onClick={logout}
                title="Desconectar"
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-rose-500/20 text-white/60 hover:text-rose-400 flex items-center justify-center transition-colors border border-white/[0.08]"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="liquid-pill-acid rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <span>Acessar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
