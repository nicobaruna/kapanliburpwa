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
  green: '#27AE60',
  greenLight: '#D5F5E3',
};

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

  const [editMode, setEditMode] = useState(false);
  const [selectedType, setSelectedType] = useState<VacationType | null>(user?.vacationType ?? null);
  const [selectedStyle, setSelectedStyle] = useState<VacationStyle | null>(user?.vacationStyle ?? null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!selectedType || !selectedStyle) return;
    setSaving(true);
    savePreferences({ vacationType: selectedType, vacationStyle: selectedStyle });
    setSaving(false);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    if (window.confirm('Kamu yakin ingin keluar?')) {
      logout();
    }
  };

  const cardStyle = {
    backgroundColor: C.card, borderRadius: 16, padding: 16,
    marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  };

  return (
    <div className="page" style={{ backgroundColor: C.bg }}>
      {/* Header */}
      <div style={{ backgroundColor: C.red, padding: '16px 20px', boxShadow: '0 2px 8px rgba(200,16,46,0.3)' }}>
        <h1 style={{ color: C.white, fontSize: 20, fontWeight: 800 }}>Profil Saya</h1>
      </div>

      <div style={{ padding: 16 }}>
        {/* User card */}
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
          {user?.photo ? (
            <img src={user.photo} alt="avatar" style={{ width: 56, height: 56, borderRadius: '50%' }} />
          ) : (
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              backgroundColor: C.red, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: C.white, fontSize: 24, fontWeight: 900 }}>
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </span>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.text }}>{user?.name ?? '-'}</div>
            {user?.email && (
              <div style={{ fontSize: 13, color: C.textSub, marginTop: 2 }}>{user.email}</div>
            )}
          </div>
        </div>

        {/* Saved banner */}
        {saved && (
          <div style={{
            backgroundColor: C.greenLight, borderRadius: 10, padding: 12,
            marginBottom: 12, textAlign: 'center',
          }}>
            <span style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>
              ✅ Preferensi berhasil disimpan!
            </span>
          </div>
        )}

        {/* Preferences section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Preferensi Liburan</h2>
          {!editMode && (
            <button
              onClick={() => {
                setSelectedType(user?.vacationType ?? null);
                setSelectedStyle(user?.vacationStyle ?? null);
                setEditMode(true);
              }}
              style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 700, color: C.red, cursor: 'pointer' }}
            >
              Ubah
            </button>
          )}
        </div>

        {!editMode ? (
          <div style={cardStyle}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Tipe Liburan
            </div>
            {user?.vacationType ? (
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 4 }}>
                {(() => {
                  const opt = VACATION_TYPES.find(v => v.value === user.vacationType);
                  return opt ? (
                    <span style={{
                      backgroundColor: C.selectedBg, borderRadius: 20,
                      padding: '6px 12px', border: `1px solid ${C.red}40`,
                      fontSize: 13, fontWeight: 700, color: C.red,
                    }}>
                      {opt.emoji} {opt.label}
                    </span>
                  ) : null;
                })()}
              </div>
            ) : (
              <span style={{ fontSize: 13, color: C.textSub, fontStyle: 'italic' }}>Belum diatur</span>
            )}

            <div style={{ height: 1, backgroundColor: C.border, margin: '14px 0' }} />

            <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Gaya Liburan
            </div>
            {user?.vacationStyle ? (
              (() => {
                const s = VACATION_STYLES.find(v => v.value === user.vacationStyle);
                return s ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{s.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{s.label}</span>
                  </div>
                ) : null;
              })()
            ) : (
              <span style={{ fontSize: 13, color: C.textSub, fontStyle: 'italic' }}>Belum diatur</span>
            )}
          </div>
        ) : (
          <div style={cardStyle}>
            {/* Edit vacation type */}
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 2 }}>Tipe Liburan</div>
            <div style={{ fontSize: 12, color: C.textSub, marginBottom: 10 }}>Pilih satu</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 16 }}>
              {VACATION_TYPES.map(t => {
                const sel = selectedType === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setSelectedType(t.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      backgroundColor: sel ? C.selectedBg : C.bg,
                      border: `1.5px solid ${sel ? C.red : C.border}`,
                      borderRadius: 20, padding: '8px 14px', cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{t.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: sel ? C.red : C.text }}>{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ height: 1, backgroundColor: C.border, marginBottom: 16 }} />

            {/* Edit vacation style */}
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 2 }}>Gaya Liburan</div>
            <div style={{ fontSize: 12, color: C.textSub, marginBottom: 10 }}>Pilih satu</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {VACATION_STYLES.map(s => {
                const sel = selectedStyle === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setSelectedStyle(s.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      backgroundColor: sel ? C.selectedBg : C.bg,
                      border: `1.5px solid ${sel ? C.red : C.border}`,
                      borderRadius: 12, padding: 12, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{s.emoji}</span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: sel ? C.red : C.text }}>{s.label}</span>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: `2px solid ${sel ? C.red : C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {sel && <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: C.red }} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Save/Cancel */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setEditMode(false)}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 12,
                  backgroundColor: C.bg, border: `1px solid ${C.border}`,
                  fontSize: 14, fontWeight: 700, color: C.textSub, cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !selectedType || !selectedStyle}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 12,
                  backgroundColor: (selectedType && selectedStyle) ? C.red : C.border,
                  border: 'none',
                  fontSize: 14, fontWeight: 700, color: C.white,
                  cursor: (selectedType && selectedStyle) ? 'pointer' : 'default',
                }}
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 14,
            border: `1.5px solid ${C.red}60`, backgroundColor: 'transparent',
            fontSize: 15, fontWeight: 700, color: C.red, cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          Keluar Akun
        </button>
      </div>
    </div>
  );
}
