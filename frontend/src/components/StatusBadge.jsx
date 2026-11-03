import React from 'react';

export default function StatusBadge({ status }) {
  const configs = {
    PENDENTE: {
      dot: 'bg-amber-400',
      border: 'border-amber-500/30',
      text: 'text-amber-300',
      bg: 'bg-amber-500/10',
      label: 'PENDENTE // EM ANÁLISE',
    },
    AVALIADO_POSITIVO: {
      dot: 'bg-emerald-400',
      border: 'border-emerald-500/30',
      text: 'text-emerald-300',
      bg: 'bg-emerald-500/10',
      label: 'PARECER // APROVADO',
    },
    AVALIADO_NEGATIVO: {
      dot: 'bg-rose-400',
      border: 'border-rose-500/30',
      text: 'text-rose-300',
      bg: 'bg-rose-500/10',
      label: 'PARECER // RECUSADO',
    },
    EM_EXECUCAO: {
      dot: 'bg-sky-400',
      border: 'border-sky-500/30',
      text: 'text-sky-300',
      bg: 'bg-sky-500/10',
      label: 'CONTRATO // EM EXECUÇÃO',
    },
    CANCELADO: {
      dot: 'bg-slate-400',
      border: 'border-white/10',
      text: 'text-white/40',
      bg: 'bg-white/[0.04]',
      label: 'CANCELADO',
    },
    FINALIZADO: {
      dot: 'bg-purple-400',
      border: 'border-purple-500/30',
      text: 'text-purple-300',
      bg: 'bg-purple-500/10',
      label: 'CONCLUÍDO',
    },
  };

  const conf = configs[status] || {
    dot: 'bg-slate-400',
    border: 'border-white/10',
    text: 'text-white/60',
    bg: 'bg-white/[0.04]',
    label: status,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.16em] border ${conf.border} ${conf.bg} ${conf.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot} animate-pulse`} />
      {conf.label}
    </span>
  );
}
