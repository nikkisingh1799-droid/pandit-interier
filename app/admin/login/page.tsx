'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  }

  return (
    <div style={s.page}>
      <form style={s.card} onSubmit={handleSubmit} noValidate>
        <div style={s.logo}>🏠</div>
        <h1 style={s.title}>Admin Login</h1>
        <p style={s.desc}>Pandit Interior — Admin Access</p>

        {error && <p style={s.error}>{error}</p>}

        <div style={s.group}>
          <label style={s.label} htmlFor="username">Username</label>
          <input
            id="username"
            style={s.input}
            type="text"
            placeholder="admin"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
            autoComplete="username"
          />
        </div>

        <div style={s.group}>
          <label style={s.label} htmlFor="password">Password</label>
          <input
            id="password"
            style={s.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button style={s.btn} type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <a href="/" style={s.back}>← Back to website</a>
      </form>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f0eb 0%, #ede8e3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
    padding: '1rem',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    maxWidth: '380px',
    width: '100%',
    boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
  },
  logo: { fontSize: '2.5rem' },
  title: { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' },
  desc: { margin: 0, color: '#888', fontSize: '0.85rem' },
  group: { width: '100%', display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' },
  label: { fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', fontWeight: 500 },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #e0dbd4',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    background: '#faf8f5',
    color: '#1a1a1a',
  },
  btn: {
    width: '100%',
    padding: '0.8rem',
    background: '#b8965a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.25rem',
    letterSpacing: '0.05em',
  },
  error: {
    width: '100%',
    background: '#fdecea',
    border: '1px solid #f5c6cb',
    borderRadius: '6px',
    padding: '0.65rem 1rem',
    color: '#c0392b',
    fontSize: '0.85rem',
    margin: 0,
  },
  back: { color: '#aaa', fontSize: '0.82rem', textDecoration: 'none', marginTop: '0.25rem' },
};
