'use client';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🏠</div>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.desc}>
          You are signed in as the Pandit Interior admin. Manage your portfolio and check site status here.
        </p>
        <div style={styles.actions}>
          <button style={styles.btn} onClick={() => router.push('/')}>Visit website</button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f0eb 0%, #ede8e3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    background: '#fff',
    borderRadius: '18px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  logo: { fontSize: '3rem' },
  title: { margin: 0, fontSize: '1.7rem', fontWeight: 700, color: '#1a1a1a' },
  desc: { margin: 0, color: '#666', fontSize: '0.95rem', lineHeight: 1.7 },
  actions: { display: 'flex', justifyContent: 'center' },
  btn: {
    background: '#b8965a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.85rem 1.6rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
