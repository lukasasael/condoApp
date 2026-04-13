import { useState, useEffect, useCallback } from 'react';
import {
  BarChart2, AlertTriangle, CalendarCheck, Megaphone,
  LogOut, CheckCircle2, Clock, Plus, RefreshCw, Building2, Bell, FileText
} from 'lucide-react';
import { getUser, logout } from '../../services/auth.service';
import {
  getComunicados, type Comunicado
} from '../../services/admin.service';
import { getOcorrencias, resolverOcorrencia, type Ocorrencia, getReservas, type Reserva } from '../../services/operations.service';
import ModalComunicado from '../../components/ModalComunicado';

type Tab = 'dashboard' | 'ocorrencias' | 'comunicados' | 'reservas';

const STATUS_OCORRENCIA: Record<string, { label: string; color: string; bg: string }> = {
  ABERTA: { label: 'Aberta', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  EM_ANALISE: { label: 'Em Análise', color: 'var(--primary)', bg: 'rgba(59,130,246,0.1)' },
  RESOLVIDA: { label: 'Resolvida', color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
};

export default function AdminDashboard() {
  const user = getUser();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [showModalComunicado, setShowModalComunicado] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [oc, reqRes, com] = await Promise.all([
        getOcorrencias(),
        getReservas(),
        getComunicados(),
      ]);
      setOcorrencias(oc);
      setReservas(reqRes);
      setComunicados(com);
    } catch {
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleResolver(id: string) {
    setResolvingId(id);
    try {
      const updated = await resolverOcorrencia(id);
      setOcorrencias(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o));
      showToast('Ocorrência resolvida!');
    } catch {
      showToast('Erro ao resolver ocorrência', 'error');
    } finally {
      setResolvingId(null);
    }
  }

  const abertas = ocorrencias.filter(o => o.status === 'ABERTA');
  const resolvidas = ocorrencias.filter(o => o.status === 'RESOLVIDA');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: <BarChart2 size={16} /> },
    { id: 'ocorrencias', label: 'Ocorrências', icon: <AlertTriangle size={16} /> },
    { id: 'reservas', label: 'Reservas', icon: <CalendarCheck size={16} /> },
    { id: 'comunicados', label: 'Comunicados', icon: <Megaphone size={16} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        padding: '1rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(11,15,25,0.85)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Building2 size={18} color="white" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>Painel do Síndico</p>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.nome}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={loadData} disabled={loading} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
            borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center'
          }}>
            <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button onClick={logout} style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--danger)',
            display: 'flex', alignItems: 'center'
          }}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <div style={{
        padding: '0 1.5rem',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(11,15,25,0.6)', backdropFilter: 'blur(8px)',
        display: 'flex', gap: '0.25rem'
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '12px 16px', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: '0.875rem', fontWeight: 500,
              color: tab === t.id ? 'white' : 'var(--text-muted)',
              borderBottom: `2px solid ${tab === t.id ? 'var(--primary)' : 'transparent'}`,
              transition: 'all 0.2s', marginBottom: '-1px'
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main style={{ flex: 1, padding: '1.5rem', maxWidth: '960px', width: '100%', margin: '0 auto' }}>

        {/* ─── TAB: Dashboard ─── */}
        {tab === 'dashboard' && (
          <div className="animate-fade-in">
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Ocorrências abertas', value: abertas.length, color: '#f59e0b', icon: AlertTriangle },
                { label: 'Ocorrências resolvidas', value: resolvidas.length, color: 'var(--success)', icon: CheckCircle2 },
                { label: 'Reservas totais', value: reservas.length, color: 'var(--primary)', icon: CalendarCheck },
                { label: 'Comunicados ativos', value: comunicados.length, color: 'var(--text-muted)', icon: Bell },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                    background: `${color}18`, border: `1px solid ${color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div>
                    <p style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{value}</p>
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '3px' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ocorrências Recentes */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontWeight: 600, fontSize: '1rem' }}>Últimas ocorrências abertas</h2>
                <button onClick={() => setTab('ocorrencias')} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)',
                  fontFamily: 'var(--font-base)', fontSize: '0.85rem', fontWeight: 500
                }}>Ver todas →</button>
              </div>

              {abertas.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
                  Nenhuma ocorrência aberta 🎉
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {abertas.slice(0, 4).map(o => (
                    <OcorrenciaRow key={o.id} ocorrencia={o} onResolver={handleResolver} resolvingId={resolvingId} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB: Ocorrências ─── */}
        {tab === 'ocorrencias' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Todas as Ocorrências</h2>
              <span style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500,
                background: abertas.length > 0 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                color: abertas.length > 0 ? '#f59e0b' : 'var(--success)',
                border: `1px solid ${abertas.length > 0 ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`
              }}>
                {abertas.length} abertas
              </span>
            </div>

            {ocorrencias.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <p className="text-muted">Nenhuma ocorrência registrada</p>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {ocorrencias.map(o => (
                  <OcorrenciaRow key={o.id} ocorrencia={o} onResolver={handleResolver} resolvingId={resolvingId} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: Reservas ─── */}
        {tab === 'reservas' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Mural de Reservas</h2>
            </div>
            
            {reservas.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <p className="text-muted">Nenhuma reserva agendada</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reservas.map(r => (
                  <div key={r.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <CalendarCheck size={20} color="var(--primary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{r.areaNome}</p>
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                        Data: {r.dataReserva.split('T')[0].split('-').reverse().join('/')} | {r.inicio} - {r.fim}
                      </p>
                    </div>
                    <div style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 500, flexShrink: 0,
                      background: 'rgba(16,185,129,0.1)', border: `1px solid rgba(16,185,129,0.25)`, color: 'var(--success)'
                    }}>
                      {r.status || 'APROVADA'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: Comunicados ─── */}
        {tab === 'comunicados' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Mural de Comunicados</h2>
              <button
                id="btn-novo-comunicado"
                onClick={() => setShowModalComunicado(true)}
                className="btn-primary"
                style={{ width: 'auto', padding: '10px 18px', fontSize: '0.875rem' }}
              >
                <Plus size={16} />
                Novo Comunicado
              </button>
            </div>

            {comunicados.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <Megaphone size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                <p className="text-muted">Nenhum comunicado publicado</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {comunicados.map(c => (
                  <div key={c.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.titulo}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                        <CalendarCheck size={13} color="var(--text-muted)" />
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {new Date(c.publicadoEm).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{c.conteudo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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

      {showModalComunicado && (
        <ModalComunicado
          onClose={() => setShowModalComunicado(false)}
          onSuccess={() => { showToast('Comunicado publicado!'); loadData(); }}
        />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function OcorrenciaRow({ ocorrencia, onResolver, resolvingId }: {
  ocorrencia: Ocorrencia;
  onResolver: (id: string) => void;
  resolvingId: string | null;
}) {
  const cfg = STATUS_OCORRENCIA[ocorrencia.status] ?? STATUS_OCORRENCIA.ABERTA;
  const isLoading = resolvingId === ocorrencia.id;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '0.85rem 1rem', borderRadius: '10px',
      background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)',
      transition: 'background 0.2s'
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '9px', flexShrink: 0,
        background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <AlertTriangle size={16} color={cfg.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{ocorrencia.categoria}</p>
        <p className="text-muted" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ocorrencia.descricao}
        </p>
      </div>

      <div style={{
        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, flexShrink: 0,
        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`
      }}>
        {cfg.label}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
        <Clock size={12} color="var(--text-muted)" />
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
          {new Date(ocorrencia.criadoEm).toLocaleDateString('pt-BR')}
        </span>
      </div>

      {ocorrencia.status === 'ABERTA' && (
        <button
          id={`btn-resolver-${ocorrencia.id}`}
          onClick={() => onResolver(ocorrencia.id)}
          disabled={isLoading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            color: 'var(--success)', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: '0.8rem',
            transition: 'all 0.2s', flexShrink: 0, opacity: isLoading ? 0.6 : 1
          }}
        >
          <CheckCircle2 size={14} />
          {isLoading ? '...' : 'Resolver'}
        </button>
      )}
    </div>
  );
}
