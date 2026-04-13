import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Building2, AlertCircle } from 'lucide-react';
import { login, saveSession } from '../../services/auth.service';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { access_token, user } = await login({ email, password });
      saveSession(access_token, user);
      if (user.role === 'ADMIN') navigate('/admin');
      else navigate('/operacao');
    } catch {
      setError('Email ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '1.5rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary), #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)'
          }}>
            <Building2 size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            CondoApp
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Acesso à plataforma operacional
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label-base" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-base"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="label-base" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="input-base"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px', borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <AlertCircle size={16} color="var(--danger)" />
              <span style={{ fontSize: '0.875rem' }} className="text-danger">{error}</span>
            </div>
          )}

          <button
            id="btn-login"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
          >
            <LogIn size={18} />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '1.5rem' }}>
          Portaria · Síndico · Morador
        </p>
      </div>
    </div>
  );
}
