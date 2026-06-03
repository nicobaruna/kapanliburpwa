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
    <div className="page page-container" style={{ paddingBottom: '160px', background: 'var(--surface)' }}>
      <header style={{ padding: 'var(--spacing-16) 0 var(--spacing-6)', textAlign: 'center' }}>
         <h1 className="headline" style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2 }}>
            My Profile
         </h1>
         <p style={{ fontSize: 17, color: 'var(--on-surface-variant)', marginTop: 12, opacity: 0.8, fontWeight: 600 }}>Atur preferensi liburan dan informasi akun Anda.</p>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* User Card - Tonal Layering & No-Line */}
        <div style={{ 
          background: 'var(--surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 40,
          display: 'flex', alignItems: 'center', gap: 32, position: 'relative', overflow: 'hidden'
        }}>
           {/* Decorative overlapping circle */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 'var(--radius-full)', background: 'var(--primary)', opacity: 0.03 }} />
          
          <div style={{
            width: 100, height: 100, borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, fontWeight: 900, color: '#fff', flexShrink: 0,
            boxShadow: 'var(--shadow-ambient)', border: '6px solid var(--surface-container-low)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="headline" style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1 }}>{user?.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--primary)', background: 'rgba(158,0,31,0.06)', padding: '4px 10px', borderRadius: 8, letterSpacing: 0.5 }}>ELITE MEMBER</span>
                <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', fontWeight: 600 }}>· 12 Trips Planned</p>
            </div>
          </div>
        </div>

        {/* Favorite Type Section - Choice Grid with Tonal Shift (No-Line) */}
        <div>
          <h3 className="headline" style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, letterSpacing: -0.5 }}>Jenis Liburan Favorit</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
            {VACATION_TYPES.map(vt => {
              const selected = editType === vt.value;
              return (
                <button
                  key={vt.value}
                  onClick={() => setEditType(vt.value)}
                  style={{
                    background: selected ? 'var(--primary)' : 'var(--surface-container-low)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)', padding: '32px 16px',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: selected ? 'var(--shadow-hover)' : 'none',
                    position: 'relative', overflow: 'hidden'
                  }}
                  className="hover-scale"
                >
                  <span style={{ fontSize: 40, filter: selected ? 'none' : 'grayscale(0.5)' }}>{vt.emoji}</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: selected ? '#fff' : 'var(--on-surface)', letterSpacing: -0.2 }}>
                    {vt.label}
                  </span>
                  {selected && <div style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: 12, background: '#fff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>✓</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vacation Style Section - Vertical Choice (No-Divider rule) */}
        <div>
          <h3 className="headline" style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, letterSpacing: -0.5 }}>Gaya Perjalanan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {VACATION_STYLES.map(vs => {
              const selected = editStyle === vs.value;
              return (
                <button
                  key={vs.value}
                  onClick={() => setEditStyle(vs.value)}
                  style={{
                    background: selected ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)', padding: '24px 32px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 24,
                    transition: 'all 0.2s ease',
                    boxShadow: selected ? 'var(--shadow-ambient)' : 'none'
                  }}
                  className="hover-scale"
                >
                  <span style={{ fontSize: 40 }}>{vs.emoji}</span>
                  <span className="headline" style={{ fontSize: 19, fontWeight: 900, color: selected ? 'var(--primary)' : 'var(--on-surface)', flex: 1, textAlign: 'left', letterSpacing: -0.2 }}>
                    {vs.label}
                  </span>
                  {selected && <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 28 }}>check_circle</span>}
                </button>
              );
            })}
          </div>
        </div>

        <button 
            className="btn btn-primary shadow-lg hover-scale" 
            onClick={handleSave} 
            disabled={!editType || !editStyle} 
            style={{ padding: '24px', fontSize: 18, fontWeight: 900, margin: '16px 0' }}
        >
          {saved ? '✅ BERHASIL DISIMPAN' : 'SIMPAN PERUBAHAN'}
        </button>

        {/* Information List - No Divider Lines */}
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 40 }}>
           <h3 className="headline" style={{ fontSize: 13, fontWeight: 900, color: 'var(--on-surface-variant)', letterSpacing: 2.5, marginBottom: 32 }}>APP INFORMATION</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { label: 'Version', value: '3.1.2 (Editorial Vitality)' },
                { label: 'Calendar Mode', value: 'AI Smart Sync' },
                { label: 'Cloud Service', value: 'Edge Compute (ID)' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, color: 'var(--on-surface-variant)', fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: -0.2 }}>{item.value}</span>
                </div>
              ))}
          </div>
          
          <button 
            className="btn btn-secondary btn-full" 
            onClick={logout} 
            style={{ marginTop: 48, padding: 18, fontWeight: 800, background: 'var(--surface-container-highest)', opacity: 0.8 }}
          >
            LOGOUT ACCOUNT
          </button>
        </div>
      </div>
      
      <style>{`
        .hover-scale { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover-scale:hover { transform: translateY(-4px); }
        .hover-scale:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}
