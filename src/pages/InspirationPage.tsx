import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getRecommendations, RecommendationResult, formatCurrency } from '../services/api';
import ShareSheet from '../components/ShareSheet';

export default function InspirationPage() {
  const { user } = useUser();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  
  const [destinations, setDestinations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState<RecommendationResult | null>(null);
  const [shareDest, setShareDest] = useState<RecommendationResult | null>(null);

  // Load recommendations based on user budget (mocking 4.5jt if empty)
  useEffect(() => {
    async function fetchDestinations() {
      setLoading(true);
      const budget = window.localStorage.getItem('kapanlibur_budget') ? 
        parseInt(window.localStorage.getItem('kapanlibur_budget') || '4500000') : 4500000;
        
      const results = await getRecommendations(budget);
      setDestinations(results);
      setLoading(false);
    }
    fetchDestinations();
  }, []);

  return (
    <div className="page" style={{ padding: '0 0 100px', position: 'relative' }}>
      
      {/* Header section matching the design */}
      <div style={{ padding: '24px 32px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary-container)', borderBottom: '2px solid var(--primary-container)', paddingBottom: 4 }}>Inspirasi Liburan</h2>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface-variant)', cursor: 'pointer' }}>Populer</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface-variant)', cursor: 'pointer' }}>Berdasarkan Budget 🎯</span>
        </div>

        <div style={{ position: 'relative', width: '240px' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--on-surface-variant)' }}>🔍</span>
          <input
            type="text"
            placeholder="Cari destinasi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ 
              width: '100%', padding: '10px 16px 10px 36px', borderRadius: 'var(--radius-full)', 
              border: 'none', background: 'var(--surface-container)', fontSize: 13, outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ padding: '16px 32px 32px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--on-surface)', marginBottom: 12 }}>
          Rekomendasi <i style={{ color: 'var(--primary-container)' }}>Terbaik</i> Untuk Anda
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ background: 'var(--secondary-container)', color: 'var(--on-secondary-container)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700 }}>
            🧠 AI Concierge
          </span>
          <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>
            Diurutkan berdasarkan cuaca, durasi Libur Nasional terdekat, dan budget Anda.
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '4px solid var(--surface-container)', borderTop: '4px solid var(--primary-container)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface-variant)' }}>AI Sedang Menghitung Rekomendasi (SerpApi Loading...)</p>
        </div>
      ) : (
        <div style={{ padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
          {destinations.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(d => (
            <div key={d.id} className="card hover-scale" onClick={() => setSelectedDest(d)} style={{ padding: 0, overflow: 'hidden', border: d.matchScore > 50 ? '3px solid var(--primary-container)' : '1px solid var(--outline-variant)', boxShadow: 'var(--shadow-ambient)', cursor: 'pointer', transition: 'transform 0.2s' }}>
              
              {/* Highlight best match */}
              {d.matchScore > 50 && (
                <div style={{ background: 'var(--primary-container)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '8px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>
                  ⭐ 100% Cocok Dengan Profil Anda
                </div>
              )}

              <div style={{ position: 'relative', height: 260 }}>
                <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                  {d.dynamicTags.map((t, i) => {
                    const bg = t.type === 'danger' ? 'var(--primary-container)' : t.type === 'warning' ? '#FADB5F' : t.type === 'success' ? '#97E4A8' : 'rgba(255,255,255,0.9)';
                    const color = t.type === 'danger' ? '#fff' : t.type === 'warning' ? '#4F3906' : t.type === 'success' ? '#0F5120' : 'var(--primary-container)';
                    return (
                      <span key={i} style={{ 
                        padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 800,
                        background: bg, color: color, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        {t.label}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{d.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span> {d.location}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div style={{ background: 'var(--surface-container-low)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary-container)', textTransform: 'uppercase', marginBottom: 2 }}>✈️ Tiket (Live API)</p>
                    <p style={{ fontSize: 14, fontWeight: 800 }}>{d.flightPrice === 0 ? 'Roadtrip/Kereta' : formatCurrency(d.flightPrice)}</p>
                  </div>
                  <div style={{ background: 'var(--surface-container-low)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary-container)', textTransform: 'uppercase', marginBottom: 2 }}>🛏️ Hotel/Malam</p>
                    <p style={{ fontSize: 14, fontWeight: 800 }}>{formatCurrency(d.hotelPerNight)}</p>
                  </div>
                </div>

                <div style={{ padding: '12px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--outline-variant)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--on-surface-variant)' }}>Estimasi Total Biaya</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--on-surface)' }}>{formatCurrency(d.estTotalCost)}</span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedDest(d); }}
                    style={{
                      flex: 1, padding: '14px', borderRadius: 'var(--radius-xl)',
                      background: d.matchScore > 50 ? 'var(--primary-container)' : '#1a1a1a', color: '#fff', fontSize: 14, fontWeight: 700,
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>map</span> Itinerary AI
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShareDest(d); }}
                    style={{ width: 50, borderRadius: 'var(--radius-xl)', background: 'var(--surface-container-high)', color: 'var(--on-surface)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Promo Section */}
      <div style={{ padding: '40px 32px', display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 24 }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-container) 0%, var(--primary) 100%)', 
          borderRadius: 24, padding: 32, position: 'relative', overflow: 'hidden', color: '#fff' 
        }}>
          <div style={{ position: 'absolute', bottom: -20, right: -10, opacity: 0.1, fontSize: 160, lineHeight: 1 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Powered by SerpApi Google Flights</h2>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.9, maxWidth: '80%', marginBottom: 32 }}>
            Sistem kami terhubung dengan SerpApi untuk menarik harga tiket termurah secara mandiri (real-time). 
            Ditambah AI Concierge yang menyusun Itinerary lengkap!
          </p>
        </div>
      </div>

      {/* ITINERARY MODAL (OVERLAY) */}
      {selectedDest && (
        <div 
          onClick={() => setSelectedDest(null)}
          style={{ 
            position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 
          }}
        >
          {/* Modal Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              background: '#fff', width: '100%', maxWidth: 640, maxHeight: '90vh', borderRadius: 32, overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3)', position: 'relative', display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedDest(null)}
              style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: 20, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Hero Image */}
            <div style={{ height: 280, width: '100%', position: 'relative' }}>
              <img src={selectedDest.image} alt={selectedDest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 24, left: 32, right: 32 }}>
                <span style={{ background: 'var(--primary-container)', color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'inline-block' }}>
                  AI Itinerary
                </span>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 4 }}>{selectedDest.name}</h2>
                <p style={{ fontSize: 15, color: '#ddd' }}>{selectedDest.location}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 32, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-container)', padding: 16, borderRadius: 16, marginBottom: 32 }}>
                <span style={{ fontSize: 32 }}>✨</span>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--on-surface)' }}>Disusun Khusus Untuk Anda</h3>
                  <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.4, marginTop: 2 }}>
                    Tim Digital Concierge KapanLibur telah menyusun jadwal padat selama liburan long weekend Anda ke {selectedDest.name}.
                  </p>
                </div>
              </div>

              {/* Itinerary Timeline */}
              <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '2px solid var(--surface-container-high)', display: 'flex', flexDirection: 'column', gap: 32 }}>
                {selectedDest.itinerary.map((day, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    {/* Circle marker */}
                    <div style={{ position: 'absolute', left: -31, top: 0, width: 16, height: 16, borderRadius: 8, background: 'var(--primary-container)', border: '4px solid #fff' }} />
                    
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary-container)', marginBottom: 4, lineHeight: 1 }}>HARI {day.day}</h4>
                    <h5 style={{ fontSize: 18, fontWeight: 900, color: 'var(--on-surface)', marginBottom: 12 }}>{day.title}</h5>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {day.activities.map((act, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-container-lowest)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--surface-container)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--on-surface-variant)' }}>
                            {i === 0 ? 'flight_land' : i === day.activities.length - 1 ? 'bed' : 'explore'}
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div style={{ marginTop: 40, borderTop: '1px solid var(--surface-container)', paddingTop: 24 }}>
                <button 
                  onClick={() => { setSelectedDest(null); navigate('/booking'); }}
                  style={{ width: '100%', padding: '18px', borderRadius: 'var(--radius-xl)', background: 'var(--primary-container)', color: '#fff', fontSize: 16, fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(158,0,31,0.2)' }}
                >
                  Pesan Tiket & Hotel Sekarang ({formatCurrency(selectedDest.estTotalCost)})
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {shareDest && <ShareSheet dest={shareDest} onClose={() => setShareDest(null)} />}

      <style>{`
        .hover-scale:hover { transform: translateY(-4px); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
