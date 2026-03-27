import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../context/UserContext';

function decodeJWT(token: string): { name: string; email: string; picture?: string } {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
}

export default function LoginPage() {
  const { login, loginWithGoogle } = useUser();
  const [name, setName] = useState('');
  const [showNameForm, setShowNameForm] = useState(false);
  const [googleError, setGoogleError] = useState('');

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(160deg, var(--primary) 0%, var(--primary-container) 60%, #E8401C 100%)',
        padding: '56px 28px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ fontSize: 64, marginBottom: 16, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>🇮🇩</div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#fff', fontSize: 36, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 10 }}>
          Kapan<br />Libur?
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>
          Kalender libur nasional &amp; perencana liburan Indonesia 2026
        </p>
      </div>

      {/* Login card */}
      <div style={{ flex: 1, background: 'var(--surface)', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -20, padding: '32px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Selamat datang</h2>
          <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 28 }}>Masuk untuk mulai melihat jadwal liburanmu</p>

          {/* Google login */}
          <div style={{ marginBottom: 6 }}>
            <GoogleLogin
              onSuccess={cr => {
                if (!cr.credential) return;
                const p = decodeJWT(cr.credential);
                loginWithGoogle({ name: p.name, email: p.email, photo: p.picture });
              }}
              onError={() => setGoogleError('Login Google gagal. Coba lagi.')}
              width="352"
              text="signin_with"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>
          {googleError && <p style={{ fontSize: 12, color: 'var(--primary)', textAlign: 'center', marginBottom: 8 }}>{googleError}</p>}

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--outline-variant)' }} />
            <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>atau</span>
            <div style={{ flex: 1, height: 1, background: 'var(--outline-variant)' }} />
          </div>

          {/* Guest form */}
          {!showNameForm ? (
            <button onClick={() => setShowNameForm(true)} className="btn btn-secondary btn-full" style={{ fontSize: 14, borderRadius: 'var(--radius-xl)' }}>
              Lanjut tanpa akun →
            </button>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Nama kamu</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Misal: Budi"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && name.trim() && login(name.trim())}
                  autoFocus
                />
              </div>
              <button className="btn btn-primary btn-full" onClick={() => name.trim() && login(name.trim())} disabled={!name.trim()}>
                Mulai →
              </button>
            </>
          )}

          {/* Dev shortcut */}
          {import.meta.env.DEV && (
            <button
              onClick={() => login('Dev User')}
              style={{ marginTop: 24, width: '100%', background: 'transparent', border: '1.5px dashed rgba(158,0,31,0.3)', borderRadius: 12, padding: '10px', color: 'var(--primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: 0.7 }}
            >
              ⚡ DEV: Skip Login
            </button>
          )}
        </div>

        <p style={{ color: 'var(--on-surface-variant)', fontSize: 11, marginTop: 32, textAlign: 'center', lineHeight: 1.7, opacity: 0.7 }}>
          Data resmi Bank Indonesia 2026<br />Keputusan Bersama Menteri RI
        </p>
      </div>
    </div>
  );
}
