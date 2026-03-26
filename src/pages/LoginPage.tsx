import { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const { login } = useUser();
  const [name, setName] = useState('');

  function handleSubmit() {
    if (name.trim()) login(name.trim());
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--red)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>🇮🇩</div>
      <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, marginBottom: 6, textAlign: 'center' }}>
        KapanLibur
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 40, textAlign: 'center' }}>
        Kalender Libur Nasional Indonesia 2026
      </p>

      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '28px 24px',
        width: '100%',
        maxWidth: 360,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Masuk</h2>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 20 }}>
          Masukkan nama untuk melanjutkan
        </p>
        <div className="form-group">
          <input
            className="form-input"
            type="text"
            placeholder="Nama kamu"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={handleSubmit}
          disabled={!name.trim()}
          style={{ opacity: name.trim() ? 1 : 0.5 }}
        >
          Mulai →
        </button>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 32, textAlign: 'center' }}>
        Data resmi Bank Indonesia 2026
      </p>
    </div>
  );
}
