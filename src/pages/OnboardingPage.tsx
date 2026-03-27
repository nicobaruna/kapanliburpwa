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
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)', padding: '48px 24px 36px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
          Halo, {user?.name}!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
          Bantu kami personalisasi pengalamanmu
        </p>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)', width: i === 0 && selectedTypes.length > 0 ? 32 : i === 1 && selectedStyle ? 32 : 16, transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '28px 20px 40px', overflowY: 'auto' }}>
        {/* Jenis Liburan */}
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Jenis Liburanmu</h2>
        <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 14 }}>Pilih satu atau lebih</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          {VACATION_TYPES.map(vt => {
            const sel = selectedTypes.includes(vt.value);
            return (
              <button
                key={vt.value}
                onClick={() => toggleType(vt.value)}
                style={{
                  background: sel ? 'rgba(158,0,31,0.06)' : 'var(--surface-container-lowest)',
                  border: `2px solid ${sel ? 'var(--primary)' : 'var(--outline-variant)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  boxShadow: sel ? '0 0 0 4px rgba(158,0,31,0.08)' : 'none',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{vt.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: sel ? 'var(--primary)' : 'var(--on-surface)' }}>{vt.label}</div>
                <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>{vt.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Gaya Liburan */}
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Gaya Liburanmu</h2>
        <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 14 }}>Pilih satu</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {VACATION_STYLES.map(vs => {
            const sel = selectedStyle === vs.value;
            return (
              <button
                key={vs.value}
                onClick={() => setSelectedStyle(vs.value)}
                style={{
                  background: sel ? 'rgba(158,0,31,0.06)' : 'var(--surface-container-lowest)',
                  border: `2px solid ${sel ? 'var(--primary)' : 'var(--outline-variant)'}`,
                  borderRadius: 'var(--radius-md)',
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
                  <div style={{ fontSize: 15, fontWeight: 700, color: sel ? 'var(--primary)' : 'var(--on-surface)' }}>{vs.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>{vs.desc}</div>
                </div>
                {sel && <span style={{ color: 'var(--primary)', fontSize: 20, fontWeight: 900 }}>✓</span>}
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary btn-full" onClick={handleDone} disabled={!canProceed || loading}>
          {loading ? 'Menyimpan...' : 'Mulai Jelajahi →'}
        </button>
      </div>
    </div>
  );
}
