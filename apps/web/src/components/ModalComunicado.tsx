import { useState } from 'react';
import { X, Megaphone, Send } from 'lucide-react';
import { createComunicado } from '../services/admin.service';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalComunicado({ onClose, onSuccess }: Props) {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !conteudo.trim()) return;
    setLoading(true);
    setError('');
    try {
      await createComunicado({ titulo, conteudo });
      onSuccess();
      onClose();
    } catch {
      setError('Erro ao publicar comunicado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Megaphone size={18} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Novo Comunicado</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: '4px', borderRadius: '6px', display: 'flex'
          }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label-base" htmlFor="titulo">Título</label>
            <input
              id="titulo"
              className="input-base"
              placeholder="Ex: Manutenção da Piscina no sábado"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-base" htmlFor="conteudo">Conteúdo</label>
            <textarea
              id="conteudo"
              className="input-base"
              placeholder="Mensagem completa para os moradores..."
              rows={5}
              value={conteudo}
              onChange={e => setConteudo(e.target.value)}
              required
              style={{ resize: 'none' }}
            />
          </div>

          {error && <p className="text-danger" style={{ fontSize: '0.875rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
              color: 'var(--text-muted)', fontFamily: 'var(--font-base)', fontSize: '0.95rem'
            }}>Cancelar</button>
            <button
              id="btn-publicar-comunicado"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ flex: 2, width: 'auto', opacity: loading ? 0.7 : 1 }}
            >
              <Send size={16} />
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
