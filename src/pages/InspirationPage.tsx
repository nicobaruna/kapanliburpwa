import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getRecommendations, RecommendationResult, TripStyle, formatCurrency } from '../services/api';
import ShareSheet from '../components/ShareSheet';

type ChipId = 'untuk-kamu' | 'populer' | 'budget' | 'pantai' | 'gunung' | 'kota';

const CHIPS: { id: ChipId; label: string }[] = [
  { id: 'untuk-kamu',  label: 'Untuk Kamu' },
  { id: 'populer',     label: 'Populer' },
  { id: 'budget',      label: 'Budget-Friendly' },
  { id: 'pantai',      label: 'Pantai' },
  { id: 'gunung',      label: 'Gunung' },
  { id: 'kota',        label: 'Kota' },
];

function styleFromVacationStyle(s?: string): TripStyle {
  if (s === 'backpacker') return 'hemat';
  if (s === 'luxury') return 'luxury';
  return 'balance';
}

export default function InspirationPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [search, setSearch]           = useState('');
  const [destinations, setDestinations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedDest, setSelectedDest] = useState<RecommendationResult | null>(null);
  const [shareDest, setShareDest]     = useState<RecommendationResult | null>(null);
  const [activeChip, setActiveChip]   = useState<ChipId>('untuk-kamu');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const budget = parseInt(localStorage.getItem('kapanlibur_budget') || '4500000');
      const style  = styleFromVacationStyle(user?.vacationStyle);
      const results = await getRecommendations(budget, 2, 3, style, user?.vacationType);
      setDestinations(results);
      setLoading(false);
    }
    load();
  }, [user?.vacationType, user?.vacationStyle]);

  // ── Filter logic ───────────────────────────────────────────────────────────
  const filtered = destinations.filter(d => {
    const nameMatch = d.name.toLowerCase().includes(search.toLowerCase());
    if (!nameMatch) return false;
    switch (activeChip) {
      case 'untuk-kamu':
        // If user has a preference, show only matching types; otherwise show all
        return user?.vacationType
          ? d.vacationTypes.includes(user.vacationType)
          : true;
      case 'populer':
        return true;
      case 'budget':
        return d.canAfford;
      case 'pantai':
        return d.vacationTypes.includes('pantai');
      case 'gunung':
        return d.vacationTypes.includes('gunung');
      case 'kota':
        return d.vacationTypes.includes('kota');
      default:
        return true;
    }
  });

  // Personalised subtitle for "Untuk Kamu" chip
  const typeLabel: Record<string, string> = {
    pantai: 'pantai & kepulauan 🏖️',
    gunung: 'pegunungan & alam 🏔️',
    kota: 'kota & budaya 🏙️',
    alam: 'alam & petualangan 🌿',
  };

  return (
    <div className="page page-container" style={{ paddingBottom: '120px' }}>

      {/* ── Header ── */}
      <div style={{ padding: 'var(--spacing-12) 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <h1 className="headline" style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>Inspiration</h1>
          <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', marginTop: 10 }}>
            {activeChip === 'untuk-kamu' && user?.vacationType
              ? `Destinasi ${typeLabel[user.vacationType] ?? ''} pilihan untukmu.`
              : 'Temukan tujuan liburan berikutnya yang pas di kantong.'}
          </p>
        </div>

        <div style={{ position: 'relative', width: '320px' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'var(--on-surface-variant)' }}>search</span>
          <input
            type="text"
            placeholder="Cari destinasi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '16px 16px 16px 48px', borderRadius: 'var(--radius-full)',
              border: 'none', background: 'var(--surface-container-high)', fontSize: 15, outline: 'none', fontWeight: 600
            }}
          />
        </div>
      </div>

      {/* ── Filter chips ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 40, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
        {CHIPS.map(chip => {
          const isActive = activeChip === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveChip(chip.id)}
              style={{
                padding: '12px 22px',
                borderRadius: 'var(--radius-full)',
                border: isActive ? 'none' : '1.5px solid var(--outline-variant)',
                background: isActive ? 'var(--primary-container)' : 'transparent',
                color: isActive ? '#fff' : 'var(--on-surface)',
                fontSize: 14, fontWeight: 800,
                whiteSpace: 'nowrap', cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                boxShadow: isActive ? 'var(--shadow-ambient)' : 'none',
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid var(--surface-container)', borderTop: '4px solid var(--primary)', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 0.8s cubic-bezier(0.4,0,0.2,1) infinite' }} />
          <p className="headline" style={{ fontSize: 20, fontWeight: 800 }}>AI Sedang Meramu Inspirasi...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🔍</div>
          <p className="headline" style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Tidak ada hasil</p>
          <p style={{ fontSize: 15, color: 'var(--on-surface-variant)' }}>Coba filter atau kata kunci lain.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
          {filtered.map(d => (
            <div
              key={d.id}
              className="hover-scale"
              onClick={() => setSelectedDest(d)}
              style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              {/* ── Card image ── */}
              <div className="asymmetric-image" style={{ height: 260, position: 'relative', overflow: 'hidden' }}>
                <img
                  src={d.image}
                  alt={d.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.currentTarget.src = `https://picsum.photos/seed/${d.id}/800/500`; }}
                />
                {/* Dynamic tags */}
                <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {d.dynamicTags.slice(0, 2).map((t, i) => {
                    const bg = t.type === 'danger' ? 'var(--primary)' : t.type === 'warning' ? '#FADB5F' : t.type === 'success' ? '#97E4A8' : 'rgba(255,255,255,0.95)';
                    const color = t.type === 'danger' ? '#fff' : t.type === 'warning' ? '#4F3906' : t.type === 'success' ? '#0F5120' : 'var(--primary)';
                    return (
                      <span key={i} style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 900, background: bg, color, boxShadow: '0 8px 16px rgba(0,0,0,0.1)', letterSpacing: 0.5 }}>
                        {t.label}
                      </span>
                    );
                  })}
                </div>
                {/* Share button — top right on image */}
                <button
                  onClick={e => { e.stopPropagation(); setShareDest(d); }}
                  style={{
                    position: 'absolute', top: 16, right: 16,
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
                    border: 'none', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.32)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>share</span>
                </button>
              </div>

              {/* ── Card body ── */}
              <div style={{ marginTop: 20, padding: '0 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="headline" style={{ fontSize: 24, fontWeight: 900 }}>{d.name}</h3>
                    <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span> {d.location}
                    </p>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'var(--surface-container-high)', borderRadius: 'var(--radius-md)', textAlign: 'center', flexShrink: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 900, color: 'var(--primary)', marginBottom: 2 }}>MATCH</p>
                    <p style={{ fontSize: 14, fontWeight: 900 }}>{Math.max(0, d.matchScore)}%</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '20px 0' }}>
                  <div style={{ background: 'var(--surface-container-lowest)', padding: 16, borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>FLIGHT</p>
                    <p style={{ fontSize: 15, fontWeight: 900 }}>{d.flightPrice === 0 ? 'Roadtrip' : formatCurrency(d.flightPrice)}</p>
                  </div>
                  <div style={{ background: 'var(--surface-container-lowest)', padding: 16, borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>HOTEL / NIGHT</p>
                    <p style={{ fontSize: 15, fontWeight: 900 }}>{formatCurrency(d.hotelPerNight)}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, padding: 16, fontSize: 15, fontWeight: 800 }}
                    onClick={e => { e.stopPropagation(); setSelectedDest(d); }}
                  >
                    AI Itinerary
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ width: 56, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={e => { e.stopPropagation(); setShareDest(d); }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 24 }}>share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Itinerary modal ── */}
      {selectedDest && (
        <div
          onClick={() => setSelectedDest(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(28,28,25,0.7)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--surface)', width: '100%', maxWidth: 720, maxHeight: '85vh', borderRadius: 'var(--radius-lg)', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.4)', position: 'relative', display: 'flex', flexDirection: 'column' }}
          >
            <button
              onClick={() => setSelectedDest(null)}
              style={{ position: 'absolute', top: 24, right: 24, width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="asymmetric-image" style={{ height: 320, width: '100%', position: 'relative' }}>
              <img
                src={selectedDest.image}
                alt={selectedDest.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.currentTarget.src = `https://picsum.photos/seed/${selectedDest.id}/800/500`; }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,28,25,0.95), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 32, left: 40, right: 40 }}>
                <h2 className="headline" style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{selectedDest.name}</h2>
                <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>{selectedDest.location}</p>
              </div>
            </div>

            <div style={{ padding: 40, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface-container-high)', padding: 24, borderRadius: 'var(--radius-md)', marginBottom: 40 }}>
                <span style={{ fontSize: 40 }}>✨</span>
                <div>
                  <h3 className="headline" style={{ fontSize: 18, fontWeight: 800 }}>Digital Concierge Curated</h3>
                  <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 4, lineHeight: 1.5 }}>
                    Jadwal perjalanan optimal yang disesuaikan dengan profil dan preferensi liburan Anda ke {selectedDest.name}.
                  </p>
                </div>
              </div>

              <div style={{ position: 'relative', paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 40 }}>
                <div style={{ position: 'absolute', left: 4, top: 0, bottom: 0, width: 2, background: 'var(--outline-variant)', opacity: 0.5 }} />
                {selectedDest.itinerary.map((day, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -36, top: 0, width: 10, height: 10, borderRadius: 5, background: 'var(--primary)' }} />
                    <h4 style={{ fontSize: 12, fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>HARI {day.day}</h4>
                    <h5 className="headline" style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{day.title}</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {day.activities.map((act, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface-container-low)', padding: '16px 20px', borderRadius: 'var(--radius-default)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--primary)' }}>
                            {i === 0 ? 'flight_land' : i === day.activities.length - 1 ? 'bed' : 'explore'}
                          </span>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 64 }}>
                <button
                  className="btn btn-primary shadow-lg"
                  style={{ width: '100%', padding: '20px', borderRadius: 'var(--radius-xl)', fontSize: 18, fontWeight: 900 }}
                  onClick={() => { setSelectedDest(null); navigate('/calendar'); }}
                >
                  Simpan Rencana Liburan ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {shareDest && <ShareSheet dest={shareDest} onClose={() => setShareDest(null)} />}

      <style>{`
        .hover-scale { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .hover-scale:hover { transform: translateY(-4px); }
        @keyframes spin { to { transform: rotate(360deg); } }
        div[style*="scrollbarWidth"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
