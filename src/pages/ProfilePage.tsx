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
    <div className="page" style={{ padding: '0 0 100px 0' }}>
      <header className="page-header" style={{ paddingBottom: '20px' }}>
        <h1 className="headline" style={{ fontSize: 24 }}>👤 Profil Pengguna</h1>
        <p>Sesuaikan preferensi pencarianmu.</p>
      </header>

      <div className="responsive-grid" style={{ padding: '16px 24px', maxWidth: 640, margin: '0 auto' }}>
        <div className="card" style={{ margin: 0, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#fff', flexShrink: 0,
            boxShadow: 'var(--shadow-ambient)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="headline" style={{ fontSize: 20 }}>{user?.name}</p>
            <p style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>KapanLibur Member</p>
          </div>
        </div>

        <div className="card" style={{ margin: 0, marginBottom: 24 }}>
          <h3 className="headline" style={{ fontSize: 16, marginBottom: 16 }}>Jenis Liburan Favorit</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {VACATION_TYPES.map(vt => {
              const selected = editType === vt.value;
              return (
                <button
                  key={vt.value}
                  onClick={() => setEditType(vt.value)}
                  style={{
                    background: selected ? 'var(--surface)' : 'var(--surface-container-low)',
                    border: `2px solid ${selected ? 'var(--primary)' : 'transparent'}`,
                    outline: selected ? 'none' : '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-md)', padding: '16px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{vt.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: selected ? 800 : 600, color: selected ? 'var(--primary)' : 'var(--on-surface)' }}>
                    {vt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ margin: 0, marginBottom: 24 }}>
          <h3 className="headline" style={{ fontSize: 16, marginBottom: 16 }}>Gaya Liburan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {VACATION_STYLES.map(vs => {
              const selected = editStyle === vs.value;
              return (
                <button
                  key={vs.value}
                  onClick={() => setEditStyle(vs.value)}
                  style={{
                    background: selected ? 'var(--surface)' : 'var(--surface-container-low)',
                    border: `2px solid ${selected ? 'var(--primary)' : 'transparent'}`,
                    outline: selected ? 'none' : '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-md)', padding: '16px 20px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{vs.emoji}</span>
                  <span className="headline" style={{ fontSize: 16, color: selected ? 'var(--primary)' : 'var(--on-surface)', flex: 1, textAlign: 'left' }}>
                    {vs.label}
                  </span>
                  {selected && <span style={{ color: 'var(--primary)', fontSize: 20 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSave} disabled={!editType || !editStyle} style={{ marginBottom: 24 }}>
          {saved ? '✅ Preferensi Tersimpan' : 'Simpan Preferensi'}
        </button>

        <div className="card" style={{ margin: 0, background: 'var(--surface-container-low)', boxShadow: 'none' }}>
          {[
            { label: 'Versi App', value: '2.0.0 (Stitch Sync)' },
            { label: 'Data Libur', value: 'BI 2026' },
            { label: 'Desain', value: 'Editorial Vitality' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
              <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>{item.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{item.value}</span>
            </div>
          ))}
          <button className="btn btn-tertiary btn-full" onClick={logout} style={{ marginTop: 16, border: '1px solid var(--primary)' }}>
            Daftar Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
