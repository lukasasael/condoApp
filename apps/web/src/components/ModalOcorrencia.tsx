import { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { createOcorrencia } from '../services/operations.service';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIAS = ['Barulho', 'Segurança', 'Manutenção', 'Acesso Indevido', 'Entrega', 'Outro'];

export default function ModalOcorrencia({ onClose, onSuccess }: Props) {
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoria || !descricao.trim()) return;
    setLoading(true);
    setError('');
    try {
      await createOcorrencia({ categoria, descricao, origem: 'PORTARIA' });
      onSuccess();
      onClose();
    } catch {
      setError('Não foi possível registrar. Tente novamente.');
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
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <AlertTriangle size={18} color="var(--danger)" />
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Registrar Ocorrência</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: '4px',
            borderRadius: '6px', display: 'flex', alignItems: 'center'
          }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label-base">Categoria</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {CATEGORIAS.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  style={{
                    padding: '7px 14px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer',
                    fontFamily: 'var(--font-base)', fontWeight: 500, transition: 'all 0.2s',
                    background: categoria === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${categoria === cat ? 'var(--primary)' : 'var(--glass-border)'}`,
                    color: categoria === cat ? 'white' : 'var(--text-muted)',
                  }}
                >{cat}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-base" htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              className="input-base"
              placeholder="Descreva a ocorrência com detalhes..."
              rows={4}
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              required
              style={{ resize: 'none' }}
            />
          </div>

          {error && (
            <p className="text-danger" style={{ fontSize: '0.875rem' }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                color: 'var(--text-muted)', fontFamily: 'var(--font-base)', fontSize: '0.95rem'
              }}
            >Cancelar</button>
            <button
              id="btn-registrar-ocorrencia"
              type="submit"
              className="btn-primary"
              disabled={loading || !categoria}
              style={{ flex: 2, opacity: (loading || !categoria) ? 0.6 : 1, width: 'auto' }}
            >
              <Send size={16} />
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
