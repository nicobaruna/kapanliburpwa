import { useState } from 'react';
import { useUser } from '../context/UserContext';
import type { VacationType, VacationStyle } from '../context/UserContext';

const VACATION_TYPES: { value: VacationType; label: string; emoji: string; desc: string }[] = [
  { value: 'kota', label: 'Kota', emoji: '🏙️', desc: 'Kuliner & belanja' },
  { value: 'alam', label: 'Alam', emoji: '🌿', desc: 'Hutan & air terjun' },
  { value: 'pantai', label: 'Pantai', emoji: '🏖️', desc: 'Pasir & ombak' },
  { value: 'gunung', label: 'Gunung', emoji: '⛰️', desc: 'Trekking & pemandangan' },
];

const VACATION_STYLES: { value: VacationStyle; label: string; emoji: string; desc: string }[] = [
  { value: 'backpacker', label: 'Backpacker', emoji: '🎒', desc: 'Hemat & suka petualangan' },
  { value: 'luxury', label: 'Luxury', emoji: '✨', desc: 'Nyaman & premium' },
  { value: 'keluarga', label: 'Keluarga', emoji: '👨‍👩‍👧', desc: 'Ramah anak & santai' },
];

export default function OnboardingPage() {
  const { user, completeOnboarding } = useUser();
  const [selectedTypes, setSelectedTypes] = useState<VacationType[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<VacationStyle | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleType(type: VacationType) {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  }

  function handleDone() {
    if (!selectedStyle || selectedTypes.length === 0) return;
    setLoading(true);
    completeOnboarding({ vacationType: selectedTypes[0], vacationStyle: selectedStyle });
  }

  const canProceed = selectedTypes.length > 0 && selectedStyle !== null;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      {/* Header aligned with high-end editorial style (Stitch compliant) */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)', 
        padding: 'var(--spacing-16) var(--spacing-6) var(--spacing-12)', 
        textAlign: 'center', position: 'relative', overflow: 'hidden' 
      }}>
        {/* Decorative elements - Asymmetric & overlapping */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize: 72, marginBottom: 24, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}>✨</div>
        <h1 className="headline" style={{ color: '#fff', fontSize: 36, fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>
          Halo, {user?.name}!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, maxWidth: 320, margin: '0 auto', lineHeight: 1.6 }}>
          Personalisasi pengalaman liburanmu di Indonesia 2026.
        </p>
        
        {/* Modern Progress Indicators (No-Line logic) */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 40 }}>
          {[0, 1].map(i => (
             <div key={i} style={{ 
               height: 6, borderRadius: 100, 
               background: (i === 0 && selectedTypes.length > 0) || (i === 1 && selectedStyle) ? '#fff' : 'rgba(255,255,255,0.2)', 
               width: 48, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
               boxShadow: (i === 0 && selectedTypes.length > 0) || (i === 1 && selectedStyle) ? '0 0 10px #fff' : 'none'
             }} />
          ))}
        </div>
      </div>

      <div className="page-container" style={{ flex: 1, paddingBottom: 120, overflowY: 'auto', background: 'var(--surface)', marginTop: -32, borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)', position: 'relative', zIndex: 2, padding: '40px 24px' }}>
        {/* Jenis Liburan Section - Tonal Layering (No-Line) */}
        <div style={{ marginBottom: 56 }}>
          <h2 className="headline" style={{ fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: -0.5 }}>Jenis Liburanmu</h2>
          <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', marginBottom: 32 }}>Pilih satu atau lebih kategori favoritmu.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20 }}>
            {VACATION_TYPES.map(vt => {
              const sel = selectedTypes.includes(vt.value);
              return (
                <button
                  key={vt.value}
                  onClick={() => toggleType(vt.value)}
                  style={{
                    background: sel ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '32px 24px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: sel ? 'var(--shadow-ambient)' : 'none',
                    position: 'relative'
                  }}
                  className="hover-scale"
                >
                  <div style={{ fontSize: 44, marginBottom: 20 }}>{vt.emoji}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: sel ? 'var(--primary)' : 'var(--on-surface)', letterSpacing: -0.2 }}>{vt.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 8, opacity: 0.8, lineHeight: 1.4 }}>{vt.desc}</div>
                  {sel && <div style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, boxShadow: '0 4px 10px rgba(158,0,31,0.2)' }}>✓</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gaya Liburan Section - Sequential Cards with Whitespace (No-Divider rule) */}
        <div style={{ marginBottom: 64 }}>
          <h2 className="headline" style={{ fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: -0.5 }}>Gaya Liburanmu</h2>
          <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', marginBottom: 32 }}>Pilih gaya perjalanan yang paling sesuai denganmu.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {VACATION_STYLES.map(vs => {
              const sel = selectedStyle === vs.value;
              return (
                <button
                  key={vs.value}
                  onClick={() => setSelectedStyle(vs.value)}
                  style={{
                    background: sel ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '28px 32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    transition: 'all 0.3s ease',
                    boxShadow: sel ? 'var(--shadow-ambient)' : 'none'
                  }}
                  className="hover-scale"
                >
                  <span style={{ fontSize: 44 }}>{vs.emoji}</span>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: sel ? 'var(--primary)' : 'var(--on-surface)', letterSpacing: -0.2 }}>{vs.label}</div>
                    <div style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 6, opacity: 0.8 }}>{vs.desc}</div>
                  </div>
                  {sel && <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, boxShadow: '0 4px 10px rgba(158,0,31,0.2)' }}>✓</div>}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          className="btn btn-primary btn-full shadow-lg hover-scale" 
          onClick={handleDone} 
          disabled={!canProceed || loading} 
          style={{ padding: '24px', fontSize: 18, fontWeight: 900 }}
        >
          {loading ? 'MENYIMPAN...' : 'MULAI PETUALANGAN 🚀'}
        </button>
      </div>

      <style>{`
        .hover-scale { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover-scale:hover { transform: translateY(-4px); }
        .hover-scale:active { transform: scale(0.98); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
