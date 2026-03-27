import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { emoji: '📅', title: 'Kalender Lengkap', desc: '25 hari libur & cuti bersama resmi Bank Indonesia 2026.' },
  { emoji: '🏖️', title: 'Deteksi Long Weekend', desc: 'Temukan semua potensi long weekend otomatis — termasuk mega-holiday 7 hari!' },
  { emoji: '💰', title: 'Perencana Budget', desc: 'Masukkan budget, dapat rekomendasi destinasi + rincian biaya transportasi & hotel.' },
  { emoji: '📤', title: 'Share ke WhatsApp', desc: 'Bagikan jadwal libur atau rencana liburan langsung ke teman dan keluarga.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, var(--primary) 0%, var(--primary-container) 60%, #E8401C 100%)', padding: '64px 28px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: 20, left: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ fontSize: 72, marginBottom: 16, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.2))' }}>🇮🇩</div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#fff', fontSize: 40, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 14 }}>
          Kapan<br />Libur?
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.6, marginBottom: 32, maxWidth: 320 }}>
          Kalender libur nasional & perencana liburan Indonesia 2026 — dalam genggamanmu.
        </p>
        <button
          className="btn"
          onClick={() => navigate('/onboarding')}
          style={{ background: '#fff', color: 'var(--primary)', fontWeight: 800, fontSize: 16, borderRadius: 'var(--radius-xl)', padding: '16px 32px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
        >
          Mulai Sekarang 🌟
        </button>
      </div>

      {/* Features */}
      <div style={{ padding: '32px 20px', background: 'var(--surface)', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -20 }}>
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>Kenapa KapanLibur?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px', background: 'var(--surface-container-lowest)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-ambient)' }}>
              <div style={{ fontSize: 32, background: 'var(--surface-container-low)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', flexShrink: 0 }}>{f.emoji}</div>
              <div>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{f.title}</p>
                <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 16 }}>
            Data resmi Bank Indonesia 2026
          </p>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/onboarding')} style={{ maxWidth: 320 }}>
            Mulai Petualangan →
          </button>
        </div>
      </div>
    </div>
  );
}
