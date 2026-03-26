import { useState } from 'react';
import { useUser } from '../context/UserContext';
import type { VacationType, VacationStyle } from '../context/UserContext';

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
  const [selectedTypes, setSelectedTypes] = useState<VacationType[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<VacationStyle | null>(null);
  const [loading, setLoading] = useState(false);

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

  const canProceed = selectedTypes.length > 0 && selectedStyle !== null;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--red)', padding: '48px 24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginBottom: 6 }}>
          Halo, {user?.name}!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
          Bantu kami personalisasi pengalamanmu
        </p>
      </div>

      <div style={{ flex: 1, padding: '24px 16px 32px', overflowY: 'auto' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Jenis Liburanmu</h2>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 14 }}>Pilih satu atau lebih</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {VACATION_TYPES.map(vt => {
            const selected = selectedTypes.includes(vt.value);
            return (
              <button
                key={vt.value}
                onClick={() => toggleType(vt.value)}
                style={{
                  background: selected ? 'var(--red-light)' : '#fff',
                  border: `2px solid ${selected ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 14,
                  padding: '16px 12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{vt.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: selected ? 'var(--red)' : 'var(--text)' }}>
                  {vt.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 2 }}>{vt.desc}</div>
              </button>
            );
          })}
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Gaya Liburanmu</h2>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 14 }}>Pilih satu</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {VACATION_STYLES.map(vs => {
            const selected = selectedStyle === vs.value;
            return (
              <button
                key={vs.value}
                onClick={() => setSelectedStyle(vs.value)}
                style={{
                  background: selected ? 'var(--red-light)' : '#fff',
                  border: `2px solid ${selected ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 28 }}>{vs.emoji}</span>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: selected ? 'var(--red)' : 'var(--text)' }}>
                    {vs.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>{vs.desc}</div>
                </div>
                {selected && <span style={{ color: 'var(--red)', fontSize: 20 }}>✓</span>}
              </button>
            );
          })}
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleDone}
          disabled={!canProceed || loading}
          style={{ opacity: canProceed ? 1 : 0.5 }}
        >
          {loading ? 'Menyimpan...' : 'Mulai Jelajahi →'}
        </button>
      </div>
    </div>
  );
}
