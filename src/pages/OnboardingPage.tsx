import { useState } from 'react';
import { useUser, type VacationType, type VacationStyle } from '../context/UserContext';

const C = {
  red: '#C8102E',
  white: '#FFFFFF',
  bg: '#F7F3EF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#6B7280',
  border: '#E8E0D8',
  selectedBg: '#FEF2F2',
};

const VACATION_TYPES: { value: VacationType; label: string; emoji: string; desc: string }[] = [
  { value: 'kota', label: 'Kota', emoji: '🏙️', desc: 'Wisata kuliner & belanja' },
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
  const [selectedType, setSelectedType] = useState<VacationType | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<VacationStyle | null>(null);
  const [loading, setLoading] = useState(false);

  const canContinue = selectedType !== null && selectedStyle !== null;

  const handleContinue = () => {
    if (!canContinue) return;
    setLoading(true);
    completeOnboarding({ vacationType: selectedType, vacationStyle: selectedStyle });
  };

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: C.bg,
      maxWidth: 'var(--max-w)',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '48px 24px 16px' }}>
        <p style={{ fontSize: 16, color: C.textSub, fontWeight: 600, marginBottom: 4 }}>
          Hei, {user?.name?.split(' ')[0] ?? 'Traveler'}! 👋
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 4, letterSpacing: -0.5 }}>
          Preferensi Liburanmu
        </h1>
        <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.5 }}>
          Pilih agar rekomendasi kami lebih personal untukmu
        </p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px 8px' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: C.red }} />
        <div style={{ flex: 1, height: 2, backgroundColor: C.border, margin: '0 6px' }} />
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          backgroundColor: selectedStyle ? C.red : C.border,
        }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 100px' }}>
        {/* Vacation Type */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 2 }}>Tipe Liburan</h2>
          <p style={{ fontSize: 12, color: C.textSub, marginBottom: 14 }}>Pilih satu</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {VACATION_TYPES.map(t => {
              const sel = selectedType === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  style={{
                    backgroundColor: sel ? C.selectedBg : C.card,
                    border: `2px solid ${sel ? C.red : C.border}`,
                    borderRadius: 16,
                    padding: 16,
                    textAlign: 'left',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{t.emoji}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: sel ? C.red : C.text, marginBottom: 2 }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: 11, color: sel ? C.red : C.textSub, opacity: sel ? 0.7 : 1 }}>
                    {t.desc}
                  </div>
                  {sel && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 22, height: 22, borderRadius: '50%',
                      backgroundColor: C.red, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ color: C.white, fontSize: 12, fontWeight: 900 }}>✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vacation Style */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 2 }}>Gaya Liburan</h2>
          <p style={{ fontSize: 12, color: C.textSub, marginBottom: 14 }}>Pilih satu</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {VACATION_STYLES.map(s => {
              const sel = selectedStyle === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setSelectedStyle(s.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    backgroundColor: sel ? C.selectedBg : C.card,
                    border: `2px solid ${sel ? C.red : C.border}`,
                    borderRadius: 16, padding: 16, cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{s.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: sel ? C.red : C.text }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 12, color: sel ? C.red : C.textSub, opacity: sel ? 0.7 : 1 }}>
                      {s.desc}
                    </div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: `2px solid ${sel ? C.red : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {sel && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: C.red }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue || loading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: canContinue ? C.red : C.border,
            color: C.white,
            fontSize: 16,
            fontWeight: 800,
            cursor: canContinue ? 'pointer' : 'default',
            letterSpacing: 0.3,
          }}
        >
          {loading ? 'Menyimpan...' : 'Mulai Jelajahi'}
        </button>
      </div>
    </div>
  );
}
