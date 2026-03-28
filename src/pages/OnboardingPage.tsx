import { useState } from 'react';
import { useUser } from '../context/UserContext';
import type { VacationType, VacationStyle } from '../context/UserContext';

const VACATION_TYPES: { value: VacationType; label: string; emoji: string; desc: string }[] = [
  { value: 'kota',   label: 'Kota',   emoji: '🏙️', desc: 'Kuliner & belanja' },
  { value: 'alam',   label: 'Alam',   emoji: '🌿', desc: 'Hutan & air terjun' },
  { value: 'pantai', label: 'Pantai', emoji: '🏖️', desc: 'Pasir & ombak' },
  { value: 'gunung', label: 'Gunung', emoji: '⛰️', desc: 'Trekking & pemandangan' },
];

const VACATION_STYLES: { value: VacationStyle; label: string; emoji: string; desc: string }[] = [
  { value: 'backpacker', label: 'Backpacker', emoji: '🎒', desc: 'Hemat & suka petualangan' },
  { value: 'luxury',     label: 'Luxury',     emoji: '✨', desc: 'Nyaman & premium' },
  { value: 'keluarga',   label: 'Keluarga',   emoji: '👨‍👩‍👧', desc: 'Ramah anak & santai' },
];

export default function OnboardingPage() {
  const { user, completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<VacationType[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<VacationStyle | null>(null);
  const [loading, setLoading] = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'Kamu';

  function toggleType(type: VacationType) {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  function handleDone() {
    if (!selectedStyle || selectedTypes.length === 0) return;
    setLoading(true);
    completeOnboarding({ vacationType: selectedTypes[0], vacationStyle: selectedStyle });
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Gradient header ────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
        padding: 'var(--spacing-16) var(--spacing-6) calc(var(--spacing-12) + 32px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glassmorphism decorative circles — asymmetric, overlapping */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }} />
        <div style={{
          position: 'absolute', bottom: 16, left: -48,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }} />
        <div style={{
          position: 'absolute', top: '35%', right: '18%',
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        {/* Hero emoji — large, breathing room, overlapping style */}
        <div style={{
          fontSize: 72, marginBottom: 20,
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.18))',
          position: 'relative', zIndex: 1,
          display: 'inline-block',
        }}>
          {step === 0 ? '🗺️' : '✈️'}
        </div>

        {/* Headline — Plus Jakarta Sans via .headline class */}
        <h1 className="headline" style={{
          color: '#fff', fontSize: 34, fontWeight: 900,
          marginBottom: 10, letterSpacing: -0.8,
          position: 'relative', zIndex: 1,
        }}>
          {step === 0 ? `Halo, ${firstName}!` : 'Gaya Liburanmu'}
        </h1>

        {/* Subtitle — Manrope (default body font) */}
        <p style={{
          color: 'rgba(255,255,255,0.82)', fontSize: 16,
          maxWidth: 300, margin: '0 auto', lineHeight: 1.65,
          fontFamily: 'Manrope, sans-serif', fontWeight: 400,
          position: 'relative', zIndex: 1,
        }}>
          {step === 0
            ? 'Personalisasi pengalaman liburanmu di Indonesia 2026.'
            : 'Pilih gaya perjalanan yang paling sesuai denganmu.'}
        </p>

        {/* Progress pills */}
        <div style={{
          display: 'flex', gap: 8, justifyContent: 'center',
          marginTop: 36, position: 'relative', zIndex: 1,
        }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              height: 6, borderRadius: 'var(--radius-full)',
              width: step === i ? 40 : i < step ? 20 : 8,
              background: (step === i || i < step) ? '#fff' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: step === i ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
            }} />
          ))}
        </div>
      </div>

      {/* ── Content — overlaps header, rounded top ──────────── */}
      <div style={{
        flex: 1,
        background: 'var(--surface)',
        marginTop: -32,
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        position: 'relative', zIndex: 2,
        overflowY: 'auto',
        paddingBottom: 48,
      }}>

        {/* ══ STEP 0: Jenis Liburan ══════════════════════════ */}
        {step === 0 && (
          <div style={{ animation: 'ob-enter 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>

            {/* Section heading — on surface, breathing room */}
            <div style={{ padding: '40px 24px 24px' }}>
              <h2 className="headline" style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
                Jenis Liburanmu
              </h2>
              <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', fontWeight: 400 }}>
                Pilih satu atau lebih kategori favoritmu.
              </p>
            </div>

            {/* Tonal section wrapper — surface-container-low lifts the cards */}
            <div style={{
              background: 'var(--surface-container-low)',
              padding: '24px',
            }}>
              {/* 2×2 asymmetric destination card grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {VACATION_TYPES.map(vt => {
                  const sel = selectedTypes.includes(vt.value);
                  return (
                    <button
                      key={vt.value}
                      onClick={() => toggleType(vt.value)}
                      className="hover-scale"
                      style={{
                        /* Tonal layering: lowest → high on selection — NO border (No-Line rule) */
                        background: sel ? 'var(--surface-container-high)' : 'var(--surface-container-lowest)',
                        border: 'none',
                        /* Asymmetric corners: DEFAULT on 3 corners, lg on top-right */
                        borderRadius: 'var(--radius-default) var(--radius-lg) var(--radius-default) var(--radius-default)',
                        padding: '28px 20px 24px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        position: 'relative',
                        boxShadow: sel ? 'var(--shadow-ambient)' : 'none',
                        transition: 'background 0.25s ease, box-shadow 0.25s ease',
                      }}
                    >
                      {/* Checkmark badge — overlapping corner, per "Do overlap elements" */}
                      {sel && (
                        <div style={{
                          position: 'absolute', top: -10, right: -10,
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 900,
                          boxShadow: '0 4px 12px rgba(158,0,31,0.28)',
                          zIndex: 1,
                        }}>✓</div>
                      )}

                      {/* Emoji — large with breathing room per DESIGN.md Do's */}
                      <div style={{ fontSize: 44, marginBottom: 16, lineHeight: 1 }}>
                        {vt.emoji}
                      </div>

                      <div className="headline" style={{
                        fontSize: 18, fontWeight: 800,
                        color: sel ? 'var(--primary)' : 'var(--on-surface)',
                        marginBottom: 6,
                        transition: 'color 0.25s ease',
                      }}>
                        {vt.label}
                      </div>
                      <div style={{
                        fontSize: 12.5, color: 'var(--on-surface-variant)',
                        fontWeight: 400, lineHeight: 1.5,
                      }}>
                        {vt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA area — back on surface */}
            <div style={{ padding: '32px 24px 0' }}>
              {selectedTypes.length > 0 && (
                <p style={{
                  textAlign: 'center', fontSize: 13,
                  color: 'var(--on-surface-variant)', marginBottom: 16,
                }}>
                  {selectedTypes.length} kategori dipilih
                </p>
              )}
              <button
                className="btn btn-primary btn-full hover-scale"
                onClick={() => { if (selectedTypes.length > 0) setStep(1); }}
                disabled={selectedTypes.length === 0}
                style={{ fontSize: 16, fontWeight: 800 }}
              >
                {selectedTypes.length > 0 ? 'Lanjut →' : 'Pilih destinasimu'}
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 1: Gaya Liburan ═══════════════════════════ */}
        {step === 1 && (
          <div style={{ animation: 'ob-enter 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>

            {/* Tertiary back button — per DESIGN.md button spec */}
            <div style={{ padding: '28px 24px 0' }}>
              <button
                className="btn btn-tertiary"
                onClick={() => setStep(0)}
                style={{ padding: '8px 0', fontSize: 14 }}
              >
                ← Kembali
              </button>
            </div>

            {/* Section heading */}
            <div style={{ padding: '16px 24px 24px' }}>
              <h2 className="headline" style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
                Gaya Liburanmu
              </h2>
              <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', fontWeight: 400 }}>
                Pilih gaya perjalanan yang paling sesuai denganmu.
              </p>
            </div>

            {/* Tonal section wrapper */}
            <div style={{
              background: 'var(--surface-container-low)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              /* No-Divider rule: use spacing-6 (2rem) gap instead of lines */
              gap: 'var(--spacing-6)',
            }}>
              {VACATION_STYLES.map(vs => {
                const sel = selectedStyle === vs.value;
                return (
                  <button
                    key={vs.value}
                    onClick={() => setSelectedStyle(vs.value)}
                    className="hover-scale"
                    style={{
                      background: sel ? 'var(--surface-container-high)' : 'var(--surface-container-lowest)',
                      border: 'none',
                      /* Asymmetric corners: DEFAULT on 3, lg on top-right */
                      borderRadius: 'var(--radius-default) var(--radius-lg) var(--radius-default) var(--radius-default)',
                      padding: '28px 28px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 24,
                      textAlign: 'left', position: 'relative',
                      boxShadow: sel ? 'var(--shadow-ambient)' : 'none',
                      transition: 'background 0.25s ease, box-shadow 0.25s ease',
                    }}
                  >
                    {/* Overlapping selection badge */}
                    {sel && (
                      <div style={{
                        position: 'absolute', top: -10, right: -10,
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 900,
                        boxShadow: '0 4px 12px rgba(158,0,31,0.28)',
                        zIndex: 1,
                      }}>✓</div>
                    )}

                    {/* Emoji — large functional icon */}
                    <span style={{ fontSize: 44, lineHeight: 1, flexShrink: 0 }}>
                      {vs.emoji}
                    </span>

                    <div>
                      <div className="headline" style={{
                        fontSize: 20, fontWeight: 800,
                        color: sel ? 'var(--primary)' : 'var(--on-surface)',
                        marginBottom: 6,
                        transition: 'color 0.25s ease',
                      }}>
                        {vs.label}
                      </div>
                      <div style={{
                        fontSize: 14, color: 'var(--on-surface-variant)',
                        fontWeight: 400, lineHeight: 1.5,
                      }}>
                        {vs.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <div style={{ padding: '32px 24px 0' }}>
              <button
                className="btn btn-primary btn-full hover-scale"
                onClick={handleDone}
                disabled={!selectedStyle || loading}
                style={{ fontSize: 16, fontWeight: 800 }}
              >
                {loading ? 'Menyimpan...' : 'Mulai Petualangan 🚀'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ob-enter {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hover-scale {
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.22s ease;
        }
        .hover-scale:hover { transform: translateY(-4px); }
        .hover-scale:active { transform: scale(0.97) !important; }
      `}</style>
    </div>
  );
}
