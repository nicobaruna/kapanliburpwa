import { useState } from 'react';
import { useUser } from '../context/UserContext';

const C = {
  red: '#C8102E',
  white: '#FFFFFF',
  bg: '#F7F3EF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#6B7280',
  border: '#E8E0D8',
};

const FEATURES = [
  { icon: '📅', text: 'Kalender hari libur nasional 2026' },
  { icon: '🏖️', text: 'Info long weekend mendatang' },
  { icon: '💰', text: 'Perencana finansial liburan' },
  { icon: '🎯', text: 'Rekomendasi sesuai gaya liburanmu' },
];

export default function LoginPage() {
  const { login } = useUser();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    login(trimmed);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: C.bg,
      display: 'flex',
      flexDirection: 'column',
      padding: '0 24px 36px',
      maxWidth: 'var(--max-w)',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingTop: 48,
      }}>
        <span style={{ fontSize: 72 }}>🇮🇩</span>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: C.red, letterSpacing: -0.5 }}>
          KapanLibur
        </h1>
        <p style={{ fontSize: 15, color: C.textSub, textAlign: 'center', fontWeight: 500 }}>
          Pantau hari libur & rencanakan liburanmu
        </p>
      </div>

      {/* Feature list */}
      <div style={{
        backgroundColor: C.card,
        borderRadius: 20,
        padding: 20,
        marginBottom: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 22, width: 32, textAlign: 'center' }}>{f.icon}</span>
            <span style={{ fontSize: 14, color: C.text, fontWeight: 600, flex: 1 }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Login form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          placeholder="Masukkan namamu..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 14,
            border: `1.5px solid ${C.border}`,
            fontSize: 16,
            fontWeight: 600,
            color: C.text,
            backgroundColor: C.card,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleLogin}
          disabled={!name.trim() || loading}
          style={{
            width: '100%',
            padding: '15px 24px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: name.trim() ? C.red : C.border,
            color: C.white,
            fontSize: 15,
            fontWeight: 700,
            cursor: name.trim() ? 'pointer' : 'default',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Masuk...' : 'Mulai Jelajahi →'}
        </button>
        <p style={{ fontSize: 11, color: C.textSub, textAlign: 'center', lineHeight: 1.6 }}>
          Tidak perlu akun. Data tersimpan di perangkatmu.
        </p>
      </div>
    </div>
  );
}
