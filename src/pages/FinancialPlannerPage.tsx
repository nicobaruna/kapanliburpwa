import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { planTrip, ORIGINS } from '../services/TripPlannerService';
import type { TripInput, TripPlanResult, TripStyle } from '../services/TripPlannerService';
import { getRecommendations, formatCurrency } from '../services/api';
import type { RecommendationResult } from '../services/api';
import ShareSheet from '../components/ShareSheet';

// --- Local helpers -----------------------------------------------------------

function formatRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function formatInput(val: string): string {
  const num = val.replace(/\D/g, '');
  if (!num) return '';
  return parseInt(num, 10).toLocaleString('id-ID');
}

function parseRp(s: string): number {
  return parseInt(s.replace(/\D/g, '') || '0', 10);
}

// --- Spinner -----------------------------------------------------------------

function Spinner() {
  return (
    <span style={{
      display: 'inline-block',
      width: 16,
      height: 16,
      border: '2px solid var(--outline-variant)',
      borderTopColor: 'var(--primary)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

// --- Main component ----------------------------------------------------------

export default function FinancialPlannerPage() {
  const navigate = useNavigate();
  const [budgetStr, setBudgetStr] = useState('');
  const [people, setPeople] = useState(2);
  const [days, setDays] = useState(3);
  const [origin, setOrigin] = useState('jakarta');
  const [style, setStyle] = useState<TripStyle>('balance');
  const [phase, setPhase] = useState<'form' | 'loading' | 'result'>('form');
  const [stepsDone, setStepsDone] = useState<0 | 1 | 2 | 3>(0);
  const [result, setResult] = useState<TripPlanResult | null>(null);
  const [inspirationResults, setInspirationResults] = useState<RecommendationResult[]>([]);
  const [selectedDest, setSelectedDest] = useState<RecommendationResult | null>(null);
  const [shareDest, setShareDest] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    if (phase !== 'loading') return;
    const budget = parseRp(budgetStr);

    const t1 = setTimeout(() => setStepsDone(1), 800);
    const t2 = setTimeout(() => setStepsDone(2), 1600);
    const t3 = setTimeout(() => setStepsDone(3), 2400);
    const t4 = setTimeout(async () => {
      const r = planTrip({ budget, people, days, origin, style } as TripInput);
      setResult(r);

      // Fetch inspiration recommendations factoring in people, days, and style
      try {
        const recs = await getRecommendations(budget, people, days, style);
        setInspirationResults(recs);
      } catch {
        setInspirationResults([]);
      }

      setPhase('result');
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [phase, budgetStr, people, days, origin, style]);

  function handleSearch() {
    const budget = parseRp(budgetStr);
    if (budget < 500000) return;
    // Sync budget to localStorage so InspirationPage stays in sync
    localStorage.setItem('kapanlibur_budget', budget.toString());
    setPhase('loading');
    setStepsDone(0);
    setResult(null);
    setInspirationResults([]);
  }

  const originLabel = ORIGINS.find(o => o.id === origin)?.label ?? origin;

  // ── FORM ────────────────────────────────────────────────────────────────────
  if (phase === 'form') {
    return (
      <div className="page" style={{ padding: '0 0 100px 0' }}>
        <header className="page-header" style={{ paddingBottom: '20px' }}>
          <h1 className="headline" style={{ fontSize: 24 }}>💰 Perencana Budget</h1>
          <p>Hitung budget tiket & hotel liburanmu</p>
        </header>

        <div className="responsive-grid" style={{ padding: '16px 24px' }}>
          <div className="card" style={{ margin: '0 auto', maxWidth: 640, width: '100%' }}>
            <div className="form-group">
              <label className="form-label">Kota Asal🛫</label>
              <select className="form-select" value={origin} onChange={e => setOrigin(e.target.value)}>
                {ORIGINS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Total Budget Maksimal (Rp)</label>
              <input
                className="form-input"
                type="text"
                inputMode="numeric"
                placeholder="Misal: 5.000.000"
                value={budgetStr}
                onChange={e => setBudgetStr(formatInput(e.target.value))}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Jumlah Orang 👥</label>
                <input
                  className="form-input"
                  type="number"
                  min={1} max={10}
                  value={people}
                  onChange={e => setPeople(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Durasi (Hari) ⏳</label>
                <input
                  className="form-input"
                  type="number"
                  min={1} max={14}
                  value={days}
                  onChange={e => setDays(Math.max(1, Math.min(14, parseInt(e.target.value) || 1)))}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 32 }}>
              <label className="form-label">Gaya Liburan 🏕️</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {([['hemat', '💰 Hemat'], ['balance', '⚖️ Seimbang'], ['luxury', '✨ Luxury']] as [TripStyle, string][]).map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setStyle(val)}
                    style={{
                      flex: 1, minWidth: 100, padding: '12px 8px', borderRadius: 'var(--radius-md)',
                      border: `2px solid ${style === val ? 'var(--primary)' : 'transparent'}`,
                      background: style === val ? 'var(--surface-container-highest)' : 'var(--surface-container-low)',
                      color: style === val ? 'var(--primary)' : 'var(--on-surface-variant)',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >{lbl}</button>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleSearch}
              disabled={!budgetStr || parseRp(budgetStr) < 500000}
              style={{ opacity: budgetStr && parseRp(budgetStr) >= 500000 ? 1 : 0.5 }}
            >
              🔍 Cari Rekomendasi Destinasi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING & RESULT ────────────────────────────────────────────────────────
  if (phase === 'loading' || (phase === 'result' && result)) {
    return (
      <div className="page" style={{ padding: '0 0 100px 0' }}>
        <header className="page-header" style={{ paddingBottom: '20px' }}>
          <h1 className="headline" style={{ fontSize: 24 }}>💰 Perencana Budget</h1>
          <p>{phase === 'loading' ? 'Sedang menghitung rencana...' : 'Rekomendasi destinasi liburanmu'}</p>
        </header>

        {phase === 'loading' && (
          <div className="responsive-grid" style={{ padding: '16px 24px' }}>
            <div className="card" style={{ margin: '0 auto', maxWidth: 640, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { num: 1, title: 'Cek Tiket Transportasi', desc: `Mencari opsi dari ${originLabel}...` },
                { num: 2, title: 'Cari Penginapan', desc: 'Mencocokkan gaya menginap...' },
                { num: 3, title: 'Menghitung Biaya', desc: 'Makan, wisata, dan transportasi...' },
              ].map(step => {
                const done = stepsDone >= step.num;
                const active = stepsDone === step.num - 1;
                return (
                  <div key={step.num} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: 16,
                    background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)',
                    opacity: done || active ? 1 : 0.45, transition: 'opacity 0.3s'
                  }}>
                    {done ? <span style={{ fontSize: 24 }}>✅</span> : active ? <Spinner /> : <div style={{ width: 16 }} />}
                    <div>
                      <p className="headline" style={{ fontSize: 16 }}>{step.title}</p>
                      <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 2 }}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {phase === 'result' && result && (
          <div className="responsive-grid" style={{ padding: '16px 24px' }}>
            <div style={{ margin: '0 auto', maxWidth: 800, width: '100%' }}>

              {/* Filter tags header */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
                {[
                  `Budget ${formatRp(parseRp(budgetStr))}`,
                  `~${formatRp(result.budgetPerPerson)}/orang`,
                  `${people} org · ${days} hari`,
                  originLabel,
                  style === 'hemat' ? '💰 Hemat' : style === 'balance' ? '⚖️ Seimbang' : '✨ Luxury',
                ].map((pill, i) => (
                  <span key={i} className="chip" style={{ background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>
                    {pill}
                  </span>
                ))}
              </div>

              {result.notEnoughBudget && (
                <div className="card" style={{ background: 'var(--tertiary-container)', color: 'var(--on-tertiary-container)', textAlign: 'center' }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>😢</p>
                  <p className="headline" style={{ fontSize: 18, marginBottom: 8 }}>Budget Belum Mencukupi</p>
                  <p style={{ fontSize: 14 }}>
                    Tiket dari {originLabel} dan durasi menginap ini membutuhkan tambahan budget.
                    Silakan sesuaikan variabel di halaman sebelumnya.
                  </p>
                </div>
              )}

              {/* ── INSPIRATION RESULTS ─────────────────────────────────────── */}
              {inspirationResults.length > 0 && (
                <div>
                  <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
                      Destinasi Sesuai Budget Kamu ✨
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>
                      Diurutkan berdasarkan kecocokan budget, cuaca, dan durasi libur terdekat
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                    {inspirationResults.map(d => (
                      <div
                        key={d.id}
                        className="card hover-scale"
                        onClick={() => setSelectedDest(d)}
                        style={{
                          padding: 0, overflow: 'hidden', cursor: 'pointer',
                          border: d.matchScore > 50 ? '3px solid var(--primary-container)' : '1px solid var(--outline-variant)',
                          boxShadow: 'var(--shadow-ambient)', transition: 'transform 0.2s'
                        }}
                      >
                        {d.matchScore > 50 && (
                          <div style={{ background: 'var(--primary-container)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '8px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>
                            ⭐ 100% Cocok Dengan Budget Kamu
                          </div>
                        )}

                        <div style={{ position: 'relative', height: 200 }}>
                          <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                            {d.dynamicTags.map((t, i) => {
                              const bg = t.type === 'danger' ? 'var(--primary-container)' : t.type === 'warning' ? '#FADB5F' : t.type === 'success' ? '#97E4A8' : 'rgba(255,255,255,0.9)';
                              const color = t.type === 'danger' ? '#fff' : t.type === 'warning' ? '#4F3906' : t.type === 'success' ? '#0F5120' : 'var(--primary-container)';
                              return (
                                <span key={i} style={{
                                  padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 800,
                                  background: bg, color, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                  {t.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ padding: 20 }}>
                          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{d.name}</h3>
                          <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>location_on</span> {d.location}
                          </p>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                            <div style={{ background: 'var(--surface-container-low)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary-container)', textTransform: 'uppercase', marginBottom: 2 }}>✈️ Tiket PP × {people}</p>
                              <p style={{ fontSize: 13, fontWeight: 800 }}>{d.flightPrice === 0 ? 'Roadtrip' : formatCurrency(d.totalFlightCost)}</p>
                            </div>
                            <div style={{ background: 'var(--surface-container-low)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary-container)', textTransform: 'uppercase', marginBottom: 2 }}>🛏️ Hotel × {days} malam</p>
                              <p style={{ fontSize: 13, fontWeight: 800 }}>{formatCurrency(d.totalHotelCost)}</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--outline-variant)', paddingTop: 12, marginBottom: 14 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--on-surface-variant)' }}>Estimasi Total ({people} org, {days} hr)</span>
                            <span style={{ fontSize: 15, fontWeight: 900, color: d.canAfford ? 'var(--on-surface)' : 'var(--primary)' }}>{formatCurrency(d.estTotalCost)}</span>
                          </div>

                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={e => { e.stopPropagation(); setSelectedDest(d); }}
                              style={{
                                flex: 1, padding: '12px', borderRadius: 'var(--radius-xl)',
                                background: d.matchScore > 50 ? 'var(--primary-container)' : '#1a1a1a',
                                color: '#fff', fontSize: 13, fontWeight: 700,
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>map</span>
                              Itinerary AI
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); setShareDest(d); }}
                              style={{ width: 46, borderRadius: 'var(--radius-xl)', background: 'var(--surface-container-high)', color: 'var(--on-surface)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 19 }}>share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate('/inspiration')}
                      style={{ padding: '14px 32px', fontSize: 14, fontWeight: 700 }}
                    >
                      Lihat Semua di Inspirasi →
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 32 }}>
                <button className="btn btn-secondary btn-full" onClick={() => { setPhase('form'); setResult(null); setStepsDone(0); setInspirationResults([]); }}>
                  🔄 Coba Kombinasi Lain
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ITINERARY MODAL ──────────────────────────────────────────────── */}
        {selectedDest && (
          <div
            onClick={() => setSelectedDest(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff', width: '100%', maxWidth: 640, maxHeight: '90vh',
                borderRadius: 32, overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
                position: 'relative', display: 'flex', flexDirection: 'column'
              }}
            >
              <button
                onClick={() => setSelectedDest(null)}
                style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: 20, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>

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

              <div style={{ padding: 32, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-container)', padding: 16, borderRadius: 16, marginBottom: 32 }}>
                  <span style={{ fontSize: 32 }}>✨</span>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--on-surface)' }}>Disusun Khusus Untuk Kamu</h3>
                    <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.4, marginTop: 2 }}>
                      {people} orang · {days} hari · {style === 'hemat' ? '💰 Hemat' : style === 'luxury' ? '✨ Luxury' : '⚖️ Seimbang'} · Estimasi {formatCurrency(selectedDest.estTotalCost)}
                    </p>
                  </div>
                </div>

                <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '2px solid var(--surface-container-high)', display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {selectedDest.itinerary.map((day, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
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

                <div style={{ marginTop: 40, borderTop: '1px solid var(--surface-container)', paddingTop: 24 }}>
                  <button
                    onClick={() => { setSelectedDest(null); navigate('/inspiration'); }}
                    style={{ width: '100%', padding: '18px', borderRadius: 'var(--radius-xl)', background: 'var(--primary-container)', color: '#fff', fontSize: 16, fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(158,0,31,0.2)' }}
                  >
                    Lihat Semua Destinasi ({formatCurrency(selectedDest.estTotalCost)})
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

  return null;
}
