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
      {/* Hero banner - Editorial Style */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
        padding: 'var(--spacing-16) var(--spacing-12) var(--spacing-12)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* Decorative elements - Asymmetric & overlapping */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ fontSize: 72, marginBottom: 24, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}>🇮🇩</div>
        <h1 className="headline" style={{ color: '#fff', fontSize: 44, fontWeight: 900, letterSpacing: -2, lineHeight: 1, marginBottom: 12 }}>
          Kapan<br />Libur?
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, maxWidth: 320, margin: '0 auto' }}>
          Kalender libur nasional &amp; perencana liburan Indonesia 2026
        </p>
      </div>

      {/* Login card area - Tonal Layering (No-Line) */}
      <div style={{ 
        flex: 1, 
        background: 'var(--surface)', 
        borderTopLeftRadius: 'var(--radius-xl)', 
        borderTopRightRadius: 'var(--radius-xl)', 
        marginTop: -48, 
        padding: 'var(--spacing-12) 24px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 className="headline" style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>Selamat datang</h2>
          <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', marginBottom: 40 }}>Masuk untuk mulai melihat jadwal liburanmu</p>

          {/* Google login container with Ambient Shadow */}
          <div style={{ 
            marginBottom: 12, 
            background: 'var(--surface-container-lowest)', 
            borderRadius: 'var(--radius-md)',
            padding: 8,
            boxShadow: 'var(--shadow-ambient)',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <GoogleLogin
              onSuccess={cr => {
                if (!cr.credential) return;
                const p = decodeJWT(cr.credential);
                loginWithGoogle({ name: p.name, email: p.email, photo: p.picture });
              }}
              onError={() => setGoogleError('Login Google gagal. Coba lagi.')}
              width="352"
              text="signin_with"
              shape="pill"
              logo_alignment="left"
            />
          </div>
          {googleError && <p style={{ fontSize: 12, color: 'var(--primary)', textAlign: 'center', marginBottom: 16 }}>{googleError}</p>}

          {/* Separator - Tonal (No-Line) */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-full)', display: 'inline-block', padding: '6px 20px' }}>
              <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>atau</span>
            </div>
          </div>

          {/* Guest form options */}
          {!showNameForm ? (
            <button 
              onClick={() => setShowNameForm(true)} 
              className="btn btn-secondary btn-full hover-scale" 
              style={{ fontSize: 15, padding: '18px', fontWeight: 800 }}
            >
              Lanjut tanpa akun →
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 800, letterSpacing: 0.5 }}>NAMA KAMU</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Misal: Budi"
                  style={{ background: 'var(--surface-container-low)', border: 'none', padding: '18px 24px' }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && name.trim() && login(name.trim())}
                  autoFocus
                />
              </div>
              <button 
                className="btn btn-primary btn-full shadow-lg hover-scale" 
                onClick={() => name.trim() && login(name.trim())} 
                disabled={!name.trim()}
                style={{ padding: '18px', fontSize: 16, fontWeight: 900 }}
              >
                MULAI PETUALANGAN →
              </button>
            </div>
          )}

          {/* Dev shortcut with Tonal Layering */}
          {import.meta.env.DEV && (
            <button
              onClick={() => login('Dev User')}
              style={{ 
                marginTop: 40, width: '100%', border: 'none', 
                background: 'var(--surface-container-high)', borderRadius: 'var(--radius-md)', 
                padding: '14px', color: 'var(--primary)', fontSize: 12, fontWeight: 800, 
                cursor: 'pointer', letterSpacing: 1
              }}
              className="hover-scale"
            >
              ⚡ DEV: SKIP LOGIN
            </button>
          )}
        </div>

        <p style={{ color: 'var(--on-surface-variant)', fontSize: 12, marginTop: 'auto', paddingTop: 64, textAlign: 'center', lineHeight: 1.8, opacity: 0.6 }}>
          Data resmi Bank Indonesia 2026<br />Keputusan Bersama Menteri RI
        </p>
      </div>
    </div>
  );
}
