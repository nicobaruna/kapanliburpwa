import { useState } from 'react';
import { useUser } from '../context/UserContext';
import type { VacationType, VacationStyle } from '../context/UserContext';

const VACATION_TYPES: { value: VacationType; label: string; emoji: string }[] = [
  { value: 'kota', label: 'Kota', emoji: '🏙️' },
  { value: 'alam', label: 'Alam', emoji: '🌿' },
  { value: 'pantai', label: 'Pantai', emoji: '🏖️' },
  { value: 'gunung', label: 'Gunung', emoji: '⛰️' },
];

const VACATION_STYLES: { value: VacationStyle; label: string; emoji: string }[] = [
  { value: 'backpacker', label: 'Backpacker', emoji: '🎒' },
  { value: 'luxury', label: 'Luxury', emoji: '✨' },
  { value: 'keluarga', label: 'Keluarga', emoji: '👨‍👩‍👧' },
];

export default function ProfilePage() {
  const { user, savePreferences, logout } = useUser();
  const [editType, setEditType] = useState<VacationType | undefined>(user?.vacationType);
  const [editStyle, setEditStyle] = useState<VacationStyle | undefined>(user?.vacationStyle);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!editType || !editStyle) return;
    savePreferences({ vacationType: editType, vacationStyle: editStyle });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="page">
      <div style={{ background: 'var(--red)', padding: '16px 16px 20px', paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>👤 Profil</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>Preferensi liburanmu</p>
      </div>

      <div style={{ padding: '16px' }}>
        {/* User Info */}
        <div className="card" style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800 }}>{user?.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-sub)' }}>Member KapanLibur 2026</p>
          </div>
        </div>

        {/* Vacation Type */}
        <div className="card" style={{ margin: '0 0 12px' }}>
          <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Jenis Liburan Favoritmu</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {VACATION_TYPES.map(vt => {
              const selected = editType === vt.value;
              return (
                <button
                  key={vt.value}
                  onClick={() => setEditType(vt.value)}
                  style={{
                    background: selected ? 'var(--red-light)' : 'var(--bg)',
                    border: `2px solid ${selected ? 'var(--red)' : 'var(--border)'}`,
                    borderRadius: 12, padding: '12px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{vt.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: selected ? 'var(--red)' : 'var(--text)' }}>
                    {vt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vacation Style */}
        <div className="card" style={{ margin: '0 0 12px' }}>
          <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Gaya Liburanmu</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {VACATION_STYLES.map(vs => {
              const selected = editStyle === vs.value;
              return (
                <button
                  key={vs.value}
                  onClick={() => setEditStyle(vs.value)}
                  style={{
                    background: selected ? 'var(--red-light)' : 'var(--bg)',
                    border: `2px solid ${selected ? 'var(--red)' : 'var(--border)'}`,
                    borderRadius: 12, padding: '12px 14px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{vs.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: selected ? 'var(--red)' : 'var(--text)', flex: 1, textAlign: 'left' }}>
                    {vs.label}
                  </span>
                  {selected && <span style={{ color: 'var(--red)', fontSize: 18 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleSave}
          disabled={!editType || !editStyle}
          style={{ opacity: editType && editStyle ? 1 : 0.5, marginBottom: 12 }}
        >
          {saved ? '✅ Tersimpan!' : 'Simpan Preferensi'}
        </button>

        <div className="divider" />

        {/* App Info */}
        <div style={{ padding: '8px 0' }}>
          {[
            { label: 'Versi App', value: '1.0.0 PWA' },
            { label: 'Data Libur', value: 'BI 2026' },
            { label: 'Total Libur', value: '17 Nasional + 8 Cuti' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 14, color: 'var(--text-sub)' }}>{item.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>

        <button
          className="btn btn-secondary btn-full"
          onClick={logout}
          style={{ marginTop: 24 }}
        >
          Keluar
        </button>
      </div>
    </div>
  );
}
