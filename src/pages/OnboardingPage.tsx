import { useState } from 'react';
import { useUser } from '../context/UserContext';
import type { VacationType, VacationStyle } from '../context/UserContext';

const VACATION_TYPES: { value: VacationType; label: string; emoji: string; desc: string; color: string; bg: string }[] = [
  { value: 'kota',   label: 'Kota',   emoji: '🏙️', desc: 'Kuliner & belanja',         color: '#1264b0', bg: 'rgba(18,100,176,0.10)' },
  { value: 'alam',   label: 'Alam',   emoji: '🌿', desc: 'Hutan & air terjun',         color: '#1b6d24', bg: 'rgba(27,109,36,0.10)'  },
  { value: 'pantai', label: 'Pantai', emoji: '🏖️', desc: 'Pasir & ombak',              color: '#0e7490', bg: 'rgba(14,116,144,0.10)' },
  { value: 'gunung', label: 'Gunung', emoji: '⛰️', desc: 'Trekking & pemandangan',     color: '#c47a00', bg: 'rgba(196,122,0,0.10)'  },
];

const VACATION_STYLES: { value: VacationStyle; label: string; emoji: string; desc: string; color: string; bg: string }[] = [
  { value: 'backpacker', label: 'Backpacker', emoji: '🎒', desc: 'Hemat & suka petualangan', color: '#9e001f', bg: 'rgba(158,0,31,0.08)'   },
  { value: 'luxury',     label: 'Luxury',     emoji: '✨', desc: 'Nyaman & premium',          color: '#c47a00', bg: 'rgba(196,122,0,0.08)'  },
  { value: 'keluarga',   label: 'Keluarga',   emoji: '👨‍👩‍👧', desc: 'Ramah anak & santai',    color: '#1264b0', bg: 'rgba(18,100,176,0.08)' },
];

export default function OnboardingPage() {
  const { user, completeOnboarding } = useUser();
  const [step, setStep]                   = useState(0);
  const [animKey, setAnimKey]             = useState(0);
  const [slideDir, setSlideDir]           = useState<'left' | 'right'>('left');
  const [selectedTypes, setSelectedTypes] = useState<VacationType[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<VacationStyle | null>(null);
  const [loading, setLoading]             = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'Kamu';

  function toggleType(type: VacationType) {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  function goNext() {
    if (selectedTypes.length === 0) return;
    setSlideDir('left');
    setAnimKey(k => k + 1);
    setStep(1);
  }

  function goBack() {
    setSlideDir('right');
    setAnimKey(k => k + 1);
    setStep(0);
  }

  function handleDone() {
    if (!selectedStyle || selectedTypes.length === 0) return;
    setLoading(true);
    completeOnboarding({ vacationType: selectedTypes[0], vacationStyle: selectedStyle });
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--primary)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* ── Gradient header ──────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(155deg, var(--primary) 0%, #6e0018 100%)',
        padding: '52px 28px 72px',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Decorative depth circles */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -100, right: -100,
          width: 320, height: 320, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 10, left: -70,
          width: 220, height: 220, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', top: '30%', right: '20%',
          width: 90, height: 90, borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          pointerEvents: 'none',
        }} />

        {/* Step indicators with connecting line */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 0, marginBottom: 40,
          position: 'relative', zIndex: 1,
        }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: step >= i ? '#fff' : 'rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 900,
                color: step >= i ? 'var(--primary)' : 'rgba(255,255,255,0.55)',
                transition: 'all 0.35s ease',
                flexShrink: 0,
                boxShadow: step >= i ? '0 4px 16px rgba(255,255,255,0.2)' : 'none',
              }}>
                {step > i
                  ? <span style={{ fontSize: 15 }}>✓</span>
                  : i + 1}
              </div>
              {i === 0 && (
                <div style={{
                  height: 2, width: 40,
                  background: step > 0 ? '#fff' : 'rgba(255,255,255,0.22)',
                  margin: '0 8px',
                  borderRadius: 2,
                  transition: 'background 0.45s ease',
                }} />
              )}
            </div>
          ))}
          <span style={{
            marginLeft: 'auto',
            fontSize: 11, fontWeight: 700,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}>
            {step + 1} / 2
          </span>
        </div>

        {/* Heading */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontSize: 11, fontWeight: 800,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: 2.5, textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            {step === 0 ? 'Destinasi Favorit' : 'Gaya Perjalanan'}
          </p>
          <h1 className="headline" style={{
            fontSize: 'clamp(26px, 7vw, 34px)',
            fontWeight: 900, color: '#fff',
            letterSpacing: '-0.025em', lineHeight: 1.2,
            marginBottom: 12,
          }}>
            {step === 0
              ? <>Halo, {firstName}!<br />Kemana mau pergi?</>
              : <>Gimana gaya<br />liburanmu?</>}
          </h1>
          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.65, fontWeight: 400, maxWidth: 320,
          }}>
            {step === 0
              ? 'Pilih destinasi favoritmu. Boleh lebih dari satu!'
              : 'Ini membantu kami merekomendasikan yang terbaik untukmu.'}
          </p>
        </div>
      </div>

      {/* ── Content panel ─────────────────────────────────── */}
      <div style={{
        flex: 1,
        background: 'var(--surface)',
        borderRadius: '28px 28px 0 0',
        marginTop: -28,
        position: 'relative',
        zIndex: 2,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div
          key={animKey}
          className={slideDir === 'left' ? 'ob-slide-left' : 'ob-slide-right'}
          style={{ flex: 1, padding: '32px 24px 48px', display: 'flex', flexDirection: 'column' }}
        >

          {/* ══ STEP 0: Jenis Destinasi ════════════════════ */}
          {step === 0 && (
            <>
              <div
                role="group"
                aria-label="Pilih jenis destinasi"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  marginBottom: 28,
                }}
              >
                {VACATION_TYPES.map((vt) => {
                  const sel = selectedTypes.includes(vt.value);
                  return (
                    <button
                      key={vt.value}
                      aria-pressed={sel}
                      onClick={() => toggleType(vt.value)}
                      style={{
                        background: sel ? vt.bg : 'var(--surface-container-lowest)',
                        border: `2px solid ${sel ? vt.color : 'transparent'}`,
                        outline: 'none',
                        borderRadius: 20,
                        padding: '22px 16px 20px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        position: 'relative',
                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: sel ? 'scale(1.03)' : 'scale(1)',
                        touchAction: 'manipulation',
                        minHeight: 130,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Checkmark badge */}
                      {sel && (
                        <div style={{
                          position: 'absolute', top: 10, right: 10,
                          width: 22, height: 22, borderRadius: '50%',
                          background: vt.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, color: '#fff', fontWeight: 900,
                          boxShadow: `0 3px 10px ${vt.color}55`,
                        }}>✓</div>
                      )}

                      {/* Icon container */}
                      <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: sel ? vt.color : 'var(--surface-container-high)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 26, marginBottom: 14,
                        transition: 'background 0.25s ease',
                        flexShrink: 0,
                      }}>
                        {vt.emoji}
                      </div>

                      <div className="headline" style={{
                        fontSize: 16, fontWeight: 800,
                        color: sel ? vt.color : 'var(--on-surface)',
                        marginBottom: 4,
                        transition: 'color 0.25s ease',
                        letterSpacing: '-0.01em',
                      }}>
                        {vt.label}
                      </div>
                      <div style={{
                        fontSize: 12, color: 'var(--on-surface-variant)',
                        lineHeight: 1.4, fontWeight: 400,
                      }}>
                        {vt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selection count */}
              <div style={{
                height: 20, marginBottom: 16,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
              }}>
                {selectedTypes.length > 0 && (
                  <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                    {selectedTypes.length} tipe dipilih
                  </p>
                )}
              </div>

              {/* CTA */}
              <button
                className="btn btn-primary btn-full"
                onClick={goNext}
                disabled={selectedTypes.length === 0}
                aria-disabled={selectedTypes.length === 0}
                style={{
                  fontSize: 16, fontWeight: 800,
                  padding: '18px',
                  borderRadius: 16,
                  transition: 'opacity 0.2s ease',
                  opacity: selectedTypes.length === 0 ? 0.38 : 1,
                  cursor: selectedTypes.length === 0 ? 'not-allowed' : 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                {selectedTypes.length > 0 ? 'Lanjut →' : 'Pilih destinasimu dulu'}
              </button>
            </>
          )}

          {/* ══ STEP 1: Gaya Liburan ══════════════════════ */}
          {step === 1 && (
            <>
              {/* Back button */}
              <button
                onClick={goBack}
                style={{
                  background: 'none', border: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 14, fontWeight: 700,
                  color: 'var(--on-surface-variant)',
                  cursor: 'pointer',
                  padding: '0 0 28px 0',
                  touchAction: 'manipulation',
                }}
                aria-label="Kembali ke langkah sebelumnya"
              >
                ← Kembali
              </button>

              {/* Style cards */}
              <div
                role="group"
                aria-label="Pilih gaya liburan"
                style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}
              >
                {VACATION_STYLES.map((vs) => {
                  const sel = selectedStyle === vs.value;
                  return (
                    <button
                      key={vs.value}
                      aria-pressed={sel}
                      onClick={() => setSelectedStyle(vs.value)}
                      style={{
                        background: sel ? vs.bg : 'var(--surface-container-lowest)',
                        border: `2px solid ${sel ? vs.color : 'transparent'}`,
                        outline: 'none',
                        borderRadius: 20,
                        padding: '20px 22px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 20,
                        textAlign: 'left', position: 'relative',
                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        touchAction: 'manipulation',
                        minHeight: 88,
                      }}
                    >
                      {/* Checkmark */}
                      {sel && (
                        <div style={{
                          position: 'absolute', top: 12, right: 12,
                          width: 22, height: 22, borderRadius: '50%',
                          background: vs.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, color: '#fff', fontWeight: 900,
                          boxShadow: `0 3px 10px ${vs.color}55`,
                        }}>✓</div>
                      )}

                      {/* Icon block */}
                      <div style={{
                        width: 60, height: 60, borderRadius: 16,
                        background: sel ? vs.color : 'var(--surface-container-high)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, flexShrink: 0,
                        transition: 'background 0.25s ease',
                      }}>
                        {vs.emoji}
                      </div>

                      <div>
                        <div className="headline" style={{
                          fontSize: 18, fontWeight: 800,
                          color: sel ? vs.color : 'var(--on-surface)',
                          marginBottom: 5,
                          transition: 'color 0.25s ease',
                          letterSpacing: '-0.01em',
                        }}>
                          {vs.label}
                        </div>
                        <div style={{
                          fontSize: 13, color: 'var(--on-surface-variant)',
                          lineHeight: 1.5, fontWeight: 400,
                        }}>
                          {vs.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* CTA */}
              <button
                className="btn btn-primary btn-full"
                onClick={handleDone}
                disabled={!selectedStyle || loading}
                aria-disabled={!selectedStyle || loading}
                style={{
                  fontSize: 16, fontWeight: 800,
                  padding: '18px',
                  borderRadius: 16,
                  transition: 'opacity 0.2s ease',
                  opacity: !selectedStyle ? 0.38 : 1,
                  cursor: !selectedStyle ? 'not-allowed' : 'pointer',
                  touchAction: 'manipulation',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {loading
                  ? <><span className="ob-spinner" />Menyimpan...</>
                  : 'Mulai Petualangan 🚀'}
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ob-slide-left {
          from { opacity: 0; transform: translateX(36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes ob-slide-right {
          from { opacity: 0; transform: translateX(-36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ob-slide-left  { animation: ob-slide-left  0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .ob-slide-right { animation: ob-slide-right 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes ob-spin {
          to { transform: rotate(360deg); }
        }
        .ob-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: ob-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .ob-slide-left,
          .ob-slide-right { animation: none !important; }
          .ob-spinner      { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
