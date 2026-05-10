'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Item = { id: string; title: string; category: string; img: string; large: boolean };
const EMPTY = { title: '', category: '', img: '', large: false };
type Props = { showLogin: boolean; onCloseLogin: () => void };

export default function AdminPanel({ showLogin, onCloseLogin }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check').then(r => { if (r.ok) setIsAdmin(true); });
  }, []);

  useEffect(() => {
    if (isAdmin) refreshItems();
  }, [isAdmin]);

  async function refreshItems() {
    fetch('/api/portfolio').then(r => r.json()).then(setItems);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) { setIsAdmin(true); onCloseLogin(); setUsername(''); setPassword(''); }
    else setLoginError('Invalid credentials');
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAdmin(false); setItems([]);
  }

  // Upload image to Supabase Storage and set the public URL in form
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('portfolio-images').upload(fileName, file);
    if (error) { alert('Upload failed: ' + error.message); setUploading(false); return; }
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(fileName);
    setForm(f => ({ ...f, img: data.publicUrl }));
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/portfolio/${editId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch('/api/portfolio', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm(EMPTY);
    refreshItems();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return;
    await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
    refreshItems();
  }

  function startEdit(item: Item) {
    setEditId(item.id);
    setForm({ title: item.title, category: item.category, img: item.img, large: item.large });
    document.getElementById('admin-panel')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {/* Login Modal */}
      {showLogin && !isAdmin && (
        <div style={s.overlay} onClick={onCloseLogin}>
          <form style={s.modal} onClick={e => e.stopPropagation()} onSubmit={handleLogin}>
            <h2 style={s.modalTitle}>Admin Login</h2>
            {loginError && <p style={s.error}>{loginError}</p>}
            <input style={s.input} placeholder="Username" value={username}
              onChange={e => setUsername(e.target.value)} required autoFocus />
            <input style={s.input} type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required />
            <button style={s.btn} type="submit">Sign In</button>
            <button type="button" style={s.cancelBtn} onClick={onCloseLogin}>Cancel</button>
          </form>
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <section id="admin-panel" style={s.panel}>
          <div style={s.panelInner}>
            <div style={s.panelHeader}>
              <h2 style={s.panelTitle}>Portfolio Admin</h2>
              <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
            </div>

            <form onSubmit={handleSubmit} style={s.form}>
              <h3 style={s.formTitle}>{editId ? 'Edit Item' : 'Add New Item'}</h3>
              <div style={s.row}>
                <input style={s.input} placeholder="Title" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                <input style={s.input} placeholder="Category" value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
              </div>

              {/* Image upload */}
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.4rem' }}>
                  Image
                </label>
                <input type="file" accept="image/*" onChange={handleImageUpload}
                  style={{ fontSize: '0.9rem' }} />
                {uploading && <span style={{ fontSize: '0.85rem', color: '#888', marginLeft: '0.5rem' }}>Uploading…</span>}
                {form.img && (
                  <img src={form.img} alt="preview" style={{ marginTop: '0.5rem', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                )}
              </div>

              <label style={s.checkLabel}>
                <input type="checkbox" checked={form.large}
                  onChange={e => setForm(f => ({ ...f, large: e.target.checked }))} />
                Large card
              </label>
              <div style={s.row}>
                <button type="submit" style={s.btn} disabled={uploading}>
                  {editId ? 'Update' : 'Add'}
                </button>
                {editId && (
                  <button type="button" style={s.cancelBtn}
                    onClick={() => { setEditId(null); setForm(EMPTY); }}>Cancel</button>
                )}
              </div>
            </form>

            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>{['Image', 'Title', 'Category', 'Large', 'Actions'].map(h =>
                    <th key={h} style={s.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} style={s.tr}>
                      <td style={s.td}><img src={item.img} alt={item.title} style={s.thumb} /></td>
                      <td style={s.td}>{item.title}</td>
                      <td style={s.td}>{item.category}</td>
                      <td style={s.td}>{item.large ? 'Yes' : 'No'}</td>
                      <td style={s.td}>
                        <button onClick={() => startEdit(item)} style={s.editBtn}>Edit</button>
                        <button onClick={() => handleDelete(item.id)} style={s.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: { background: '#fff', padding: '2rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '340px' },
  modalTitle: { margin: 0, fontSize: '1.3rem', fontWeight: 700 },
  panel: { background: '#f0ede8', padding: '3rem 1rem' },
  panelInner: { maxWidth: '960px', margin: '0 auto', fontFamily: 'sans-serif' },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  panelTitle: { margin: 0, fontSize: '1.5rem', fontWeight: 700 },
  formTitle: { margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 },
  form: { background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '2rem' },
  row: { display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' },
  input: { flex: 1, minWidth: '160px', padding: '0.6rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.95rem' },
  btn: { padding: '0.6rem 1.4rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { padding: '0.6rem 1.4rem', background: '#888', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem' },
  logoutBtn: { padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #aaa', borderRadius: '4px', cursor: 'pointer', fontFamily: 'sans-serif' },
  error: { color: '#c0392b', margin: 0, fontSize: '0.85rem' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  th: { background: '#1a1a1a', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.9rem' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '0.75rem 1rem', fontSize: '0.9rem', verticalAlign: 'middle' },
  thumb: { width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' },
  editBtn: { marginRight: '0.5rem', padding: '0.3rem 0.8rem', background: '#2980b9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  deleteBtn: { padding: '0.3rem 0.8rem', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
};
