import { useState, useEffect, useCallback } from 'react';
import { LogOut, RefreshCw, UserCheck, AlertTriangle, Clock, CheckCircle2, Building2 } from 'lucide-react';
import {
  getVisitasAtivas, confirmarEntrada, type Visita,
  getOcorrencias, resolverOcorrencia, type Ocorrencia
} from '../../services/operations.service';
import { getUser, logout } from '../../services/auth.service';
import ModalOcorrencia from '../../components/ModalOcorrencia';

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function useRelogio() {
  const [hora, setHora] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return hora;
}

const STATUS_VISITA = {
  ATIVA: { label: 'Aguardando', color: 'var(--primary)', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
  UTILIZADA: { label: 'Entrada confirmada', color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  EXPIRADA: { label: 'Expirada', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)', border: 'var(--glass-border)' },
  CANCELADA: { label: 'Cancelada', color: 'var(--danger)', bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.15)' },
};

const STATUS_OCORRENCIA: Record<string, { label: string; color: string; bg: string }> = {
  ABERTA: { label: 'Aberta', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  EM_ANALISE: { label: 'Em Análise', color: 'var(--primary)', bg: 'rgba(59,130,246,0.1)' },
};

export default function PortariaPanel() {
  const user = getUser();
  const hora = useRelogio();

  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [vData, oData] = await Promise.all([
        getVisitasAtivas(todayISO()),
        getOcorrencias()
      ]);
      setVisitas(vData);
      setOcorrencias(oData.filter(o => o.status !== 'RESOLVIDA'));
    } catch {
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleEntrada(visitaId: string) {
    setConfirmingId(visitaId);
    try {
      const updated = await confirmarEntrada(visitaId);
      setVisitas(prev => prev.map(v => v.id === visitaId ? { ...v, ...updated } : v));
      showToast('Entrada confirmada com sucesso!');
    } catch {
      showToast('Erro ao confirmar entrada', 'error');
    } finally {
      setConfirmingId(null);
    }
  }

  async function handleResolverOcorrencia(ocorrenciaId: string) {
    setResolvingId(ocorrenciaId);
    try {
      await resolverOcorrencia(ocorrenciaId);
      setOcorrencias(prev => prev.filter(o => o.id !== ocorrenciaId));
      showToast('Ocorrência resolvida com sucesso!');
    } catch {
      showToast('Erro ao resolver ocorrência', 'error');
    } finally {
      setResolvingId(null);
    }
  }

  const visitasAtivas = visitas.filter(v => v.status === 'ATIVA');
  const visitasConcluidas = visitas.filter(v => v.status !== 'ATIVA');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        padding: '1rem 1.5rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(11,15,25,0.8)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Building2 size={18} color="white" />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.2 }}>Painel da Portaria</p>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.nome ?? 'Porteiro'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', fontVariantNumeric: 'tabular-nums' }}>
              {hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
              {hora.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
            </p>
          </div>
          <button onClick={logout} title="Sair" style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px', padding: '8px', cursor: 'pointer',
            color: 'var(--danger)', display: 'flex', alignItems: 'center', transition: 'all 0.2s'
          }}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Action Bar */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          onClick={loadData}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px', borderRadius: '10px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
            color: 'var(--text-muted)', fontFamily: 'var(--font-base)', fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Atualizar
        </button>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '10px', cursor: 'pointer',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            color: 'var(--danger)', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: '0.9rem',
            transition: 'all 0.2s', marginLeft: 'auto'
          }}
        >
          <AlertTriangle size={16} />
          Reportar Ocorrência
        </button>
      </div>

      <main style={{
        flex: 1, padding: '0 1.5rem 2rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '2rem', alignItems: 'start'
      }}>
        
        {/* COLUNA ESQUERDA: VISITAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
            <UserCheck size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Visitantes de Hoje</h2>
          </div>

          {/* Aguardando entrada */}
          {visitasAtivas.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Aguardando Entrada
              </p>
              {visitasAtivas.map(v => (
                <VisitaCard key={v.id} visita={v} onEntrada={handleEntrada} loadingId={confirmingId} />
              ))}
            </div>
          )}

          {/* Sem visitas */}
          {visitas.length === 0 && !loading && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p className="text-muted" style={{ fontSize: '0.95rem' }}>Nenhuma visita agendada</p>
            </div>
          )}

          {/* Histórico do dia */}
          {visitasConcluidas.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Entradas Registradas
              </p>
              {visitasConcluidas.map(v => (
                <VisitaCard key={v.id} visita={v} onEntrada={handleEntrada} loadingId={confirmingId} />
              ))}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: OCORRÊNCIAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <AlertTriangle size={20} color="#f59e0b" />
              <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Ocorrências Abertas</h2>
            </div>
            {ocorrencias.length > 0 && (
              <span style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600 }}>
                {ocorrencias.length}
              </span>
            )}
          </div>

          {ocorrencias.length === 0 && !loading ? (
             <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p className="text-muted" style={{ fontSize: '0.95rem' }}>Nenhuma ocorrência em andamento 🎉</p>
             </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {ocorrencias.map(o => (
                <OcorrenciaCard key={o.id} ocorrencia={o} onResolver={handleResolverOcorrencia} loadingId={resolvingId} />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 100,
          padding: '12px 20px', borderRadius: '12px', fontWeight: 500, fontSize: '0.9rem',
          background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          color: toast.type === 'success' ? 'var(--success)' : 'var(--danger)',
          backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease'
        }}>
          {toast.msg}
        </div>
      )}

      {showModal && (
        <ModalOcorrencia
          onClose={() => setShowModal(false)}
          onSuccess={() => { showToast('Ocorrência registrada com sucesso!'); loadData(); }}
        />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Subcomponents
function VisitaCard({ visita, onEntrada, loadingId }: { visita: Visita; onEntrada: (id: string) => void; loadingId: string | null; }) {
  const cfg = STATUS_VISITA[visita.status] ?? STATUS_VISITA.ATIVA;
  const isLoading = loadingId === visita.id;

  return (
    <div className="glass-panel" style={{
      padding: '1rem 1.25rem', display: 'flex', alignItems: 'center',
      gap: '1rem', transition: 'border-color 0.2s',
      borderColor: visita.status === 'ATIVA' ? 'rgba(59,130,246,0.2)' : 'var(--glass-border)'
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
        background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(29,78,216,0.2))',
        border: '1px solid rgba(59,130,246,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)'
      }}>
        {visita.nomeVisitante.charAt(0).toUpperCase()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {visita.nomeVisitante}
        </p>
        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
          {formatTime(visita.janelaInicio)} – {formatTime(visita.janelaFim)}
        </p>
      </div>

      {visita.status === 'ATIVA' ? (
        <button
          onClick={() => onEntrada(visita.id)}
          disabled={isLoading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 16px', borderRadius: '9px', cursor: 'pointer',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            color: 'var(--success)', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: '0.85rem',
            transition: 'all 0.2s', flexShrink: 0, opacity: isLoading ? 0.6 : 1
          }}
        >
          <CheckCircle2 size={15} />
          {isLoading ? '...' : 'Entrada'}
        </button>
      ) : (
        <div style={{
          padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 500, flexShrink: 0,
          background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color
        }}>
          {cfg.label}
        </div>
      )}
    </div>
  );
}

function OcorrenciaCard({ ocorrencia, onResolver, loadingId }: { ocorrencia: Ocorrencia; onResolver: (id: string) => void; loadingId: string | null; }) {
  const cfg = STATUS_OCORRENCIA[ocorrencia.status] ?? STATUS_OCORRENCIA.ABERTA;
  const isLoading = loadingId === ocorrencia.id;

  return (
    <div className="glass-panel" style={{
      padding: '1rem 1.25rem', display: 'flex', alignItems: 'center',
      gap: '1rem', borderLeft: `3px solid ${cfg.color}`
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{ocorrencia.categoria}</p>
        <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.4, marginBottom: '6px' }}>
          {ocorrencia.descricao}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={12} color="var(--text-muted)" />
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            Registrada às {new Date(ocorrencia.criadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <button
        onClick={() => onResolver(ocorrencia.id)}
        disabled={isLoading}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '9px 16px', borderRadius: '9px', cursor: 'pointer',
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
          color: 'var(--success)', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: '0.85rem',
          transition: 'all 0.2s', flexShrink: 0, opacity: isLoading ? 0.6 : 1
        }}
      >
        <CheckCircle2 size={15} />
        {isLoading ? '...' : 'Resolver'}
      </button>
    </div>
  );
}
