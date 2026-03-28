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
      width: 24,
      height: 24,
      border: '4px solid var(--surface-container-high)',
      borderTopColor: 'var(--primary)',
      borderRadius: 'var(--radius-full)',
      animation: 'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
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
    localStorage.setItem('kapanlibur_budget', budget.toString());
    setPhase('loading');
    setStepsDone(0);
    setResult(null);
    setInspirationResults([]);
  }

  const originLabel = ORIGINS.find(o => o.id === origin)?.label ?? origin;

  // ── FORM SHIFTED TO EDITORIAL STYLE ─────────────────────────────────────────
  if (phase === 'form') {
    return (
      <div className="page page-container" style={{ paddingBottom: '120px', background: 'var(--surface)' }}>
        <header style={{ padding: 'var(--spacing-16) 0 var(--spacing-6)', textAlign: 'center' }}>
          <h1 className="headline" style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2 }}>
            Budget Planner
          </h1>
          <p style={{ fontSize: 17, color: 'var(--on-surface-variant)', marginTop: 12, opacity: 0.8, fontWeight: 600 }}>
             Personalisasi liburan impian sesuai anggaranmu.
          </p>
        </header>

        <div style={{ maxWidth: 640, margin: '0 auto', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 48, boxShadow: 'none' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: 13, fontWeight: 900, letterSpacing: 1.5, color: 'var(--on-surface-variant)' }}>KOTA ASAL 🛫</label>
            <select 
              className="form-select" 
              value={origin} 
              onChange={e => setOrigin(e.target.value)} 
              style={{ padding: '20px 24px', fontSize: 16, background: 'var(--surface-container-highest)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 800 }}
            >
              {ORIGINS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: 13, fontWeight: 900, letterSpacing: 1.5, color: 'var(--on-surface-variant)' }}>TOTAL BUDGET MAKSIMAL (Rp)</label>
            <input
              className="form-input"
              type="text"
              inputMode="numeric"
              placeholder="Misal: 5.000.000"
              value={budgetStr}
              onChange={e => setBudgetStr(formatInput(e.target.value))}
              style={{ padding: '20px 24px', fontSize: 24, fontWeight: 900, background: 'var(--surface-container-highest)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 900, letterSpacing: 1.5, color: 'var(--on-surface-variant)' }}>JUMLAH ORANG 👥</label>
              <input
                className="form-input"
                type="number"
                min={1} max={10}
                value={people}
                onChange={e => setPeople(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                style={{ padding: '20px 24px', fontSize: 16, fontWeight: 800, background: 'var(--surface-container-highest)', border: 'none', borderRadius: 'var(--radius-md)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 900, letterSpacing: 1.5, color: 'var(--on-surface-variant)' }}>DURASI (HARI) ⏳</label>
              <input
                className="form-input"
                type="number"
                min={1} max={14}
                value={days}
                onChange={e => setDays(Math.max(1, Math.min(14, parseInt(e.target.value) || 1)))}
                style={{ padding: '20px 24px', fontSize: 16, fontWeight: 800, background: 'var(--surface-container-highest)', border: 'none', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 48 }}>
            <label className="form-label" style={{ fontSize: 13, fontWeight: 900, letterSpacing: 1.5, color: 'var(--on-surface-variant)' }}>GAYA LIBURAN 🏕️</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {([['hemat', '💰 Hemat'], ['balance', '⚖️ Seimbang'], ['luxury', '✨ Luxury']] as [TripStyle, string][]).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setStyle(val)}
                  style={{
                    padding: '16px 8px', borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: style === val ? 'var(--primary)' : 'var(--surface-container-highest)',
                    color: style === val ? '#fff' : 'var(--on-surface-variant)',
                    fontWeight: 900, fontSize: 12, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: style === val ? 'var(--shadow-hover)' : 'none',
                    letterSpacing: 0.2
                  }}
                  className="hover-scale"
                >{lbl.toUpperCase()}</button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary btn-full shadow-lg hover-scale"
            onClick={handleSearch}
            disabled={!budgetStr || parseRp(budgetStr) < 500000}
            style={{ padding: 24, fontSize: 18, fontWeight: 900, letterSpacing: 0.5 }}
          >
            CARI REKOMENDASI DESTINASI ➔
          </button>
        </div>
      </div>
    );
  }

  // ── LOADING & RESULT ────────────────────────────────────────────────────────
  if (phase === 'loading' || (phase === 'result' && result)) {
    return (
      <div className="page page-container" style={{ paddingBottom: '120px', background: 'var(--surface)' }}>
        <header style={{ padding: 'var(--spacing-16) 0 var(--spacing-6)', textAlign: 'center' }}>
          <h1 className="headline" style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2 }}>
            Budget Planner
          </h1>
          <p style={{ fontSize: 17, color: 'var(--on-surface-variant)', marginTop: 12, opacity: 0.8, fontWeight: 600 }}>
            {phase === 'loading' ? 'Sedang meramu rencana terbaik untukmu...' : 'Hasil analisis budget & destinasi terbaik.'}
          </p>
        </header>

        {phase === 'loading' && (
          <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { num: 1, title: 'Cek Tiket Transportasi', desc: `Mencari opsi penerbangan dari ${originLabel}...` },
              { num: 2, title: 'Kurasi Penginapan', desc: 'Mencocokkan akomodasi dengan gaya liburanmu...' },
              { num: 3, title: 'Analisis Biaya Wisata', desc: 'Menghitung estimasi harian tiket & kuliner...' },
            ].map(step => {
              const done = stepsDone >= step.num;
              const active = stepsDone === step.num - 1;
              return (
                <div key={step.num} style={{
                  display: 'flex', alignItems: 'center', gap: 32, padding: 40,
                  background: 'var(--surface-container-low)', borderRadius: 'var(--radius-xl)',
                  opacity: done || active ? 1 : 0.3, transition: 'all 0.4s ease',
                  position: 'relative', overflow: 'hidden'
                }} className={active ? "hover-scale" : ""}>
                   {active && <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'var(--primary)', animation: 'pulse 1.5s infinite' }} />}
                  <div style={{ width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-container-highest)', borderRadius: 'var(--radius-full)' }}>
                    {done ? <span style={{ fontSize: 36 }}>✅</span> : active ? <Spinner /> : <div style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--outline-variant)', opacity: 0.3 }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="headline" style={{ fontSize: 22, fontWeight: 900 }}>{step.title}</p>
                    <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', marginTop: 6, opacity: 0.8, fontWeight: 600 }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {phase === 'result' && result && (
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {/* Filter pills - No Line logic */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 56, justifyContent: 'center' }}>
              {[
                `Budget ${formatRp(parseRp(budgetStr))}`,
                `±${formatRp(result.budgetPerPerson)} /org`,
                `${people} Orang · ${days} Hari`,
                originLabel,
                style === 'hemat' ? '💰 Hemat' : style === 'balance' ? '⚖️ Seimbang' : '✨ Luxury',
              ].map((pill, i) => (
                <span key={i} style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface)', padding: '12px 24px', borderRadius: 100, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {pill}
                </span>
              ))}
            </div>

            {result.notEnoughBudget && (
              <div style={{ 
                background: 'var(--surface-container-low)', padding: 56, borderRadius: 'var(--radius-xl)', textTransform: 'center', marginBottom: 64, border: 'none',
                boxShadow: 'inset 0 0 100px rgba(158,0,31,0.02)'
              }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 72, marginBottom: 24 }}>⚠️</p>
                    <h2 className="headline" style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>Anggaran Terbatas</h2>
                    <p style={{ fontSize: 17, maxWidth: 480, margin: '0 auto', lineHeight: 1.7, opacity: 0.8, fontWeight: 600 }}>
                      Wah, anggaranmu sepertinya kurang untuk perjalanan dari {originLabel} selama {days} hari.
                      Coba turunkan durasi atau sesuaikan kota asal.
                    </p>
                </div>
              </div>
            )}

            {/* ── INSPIRATION RESULTS ALIGNED WITH DASHBOARD ────────────────── */}
            {inspirationResults.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 40 }}>
                  {inspirationResults.map(d => (
                    <div
                      key={d.id}
                      className="hover-scale"
                      onClick={() => setSelectedDest(d)}
                      style={{
                        background: 'var(--surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 24,
                        cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: 'var(--shadow-ambient)'
                      }}
                    >
                      <div className="asymmetric-image" style={{ height: 260, position: 'relative', overflow: 'hidden' }}>
                        <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 16, right: 16 }}>
                           <span style={{ 
                               background: 'rgba(158, 0, 31, 1)', color: '#fff', padding: '10px 16px', borderRadius: 100, 
                               fontSize: 11, fontWeight: 900, letterSpacing: 1, boxShadow: '0 8px 20px rgba(158,0,31,0.3)' 
                            }}>
                             {d.matchScore}% MATCH
                           </span>
                        </div>
                      </div>

                      <div style={{ marginTop: 24, padding: '0 8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                          <div>
                            <h3 className="headline" style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>{d.name}</h3>
                            <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', marginTop: 4, fontWeight: 700 }}>{d.location}</p>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                          <div style={{ background: 'var(--surface-container-lowest)', padding: 16, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <p style={{ fontSize: 10, fontWeight: 900, color: 'var(--on-surface-variant)', marginBottom: 6, letterSpacing: 1 }}>FLIGHT PP</p>
                            <p style={{ fontSize: 15, fontWeight: 900 }}>{d.flightPrice === 0 ? 'Roadtrip' : formatCurrency(d.totalFlightCost)}</p>
                          </div>
                          <div style={{ background: 'var(--surface-container-lowest)', padding: 16, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <p style={{ fontSize: 10, fontWeight: 900, color: 'var(--on-surface-variant)', marginBottom: 6, letterSpacing: 1 }}>HOTEL TOTAL</p>
                            <p style={{ fontSize: 15, fontWeight: 900 }}>{formatCurrency(d.totalHotelCost)}</p>
                          </div>
                        </div>

                        <div style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)', 
                            color: '#fff', padding: '20px 24px', borderRadius: 'var(--radius-md)', marginBottom: 24,
                            boxShadow: '0 12px 30px rgba(158,0,31,0.15)'
                        }}>
                          <div>
                            <p style={{ fontSize: 10, fontWeight: 900, opacity: 0.8, letterSpacing: 1.5 }}>TOTAL ESTIMASI</p>
                            <p style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{formatCurrency(d.estTotalCost)}</p>
                          </div>
                          <span style={{ fontSize: 32 }}>📊</span>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                          <button className="btn btn-primary" style={{ flex: 1, padding: 18, fontSize: 14, fontWeight: 900 }} onClick={e => { e.stopPropagation(); setSelectedDest(d); }}>
                            AI ITINERARY
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ width: 60, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-container-highest)' }}
                            onClick={e => { e.stopPropagation(); setShareDest(d); }}
                          >
                             <span style={{ fontSize: 22 }}>↗</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 80, textAlign: 'center' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '20px 48px', fontWeight: 900, letterSpacing: 0.5, background: 'var(--surface-container-low)' }} 
                onClick={() => { setPhase('form'); setResult(null); setStepsDone(0); setInspirationResults([]); }}
              >
                🔄 RENCANAKAN ULANG
              </button>
            </div>
          </div>
        )}

        {/* ── ITINERARY MODAL - REFINED ────────────────────────────────────── */}
        {selectedDest && (
          <div
            onClick={() => setSelectedDest(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(28,28,25,0.7)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface)', width: '100%', maxWidth: 720, maxHeight: '90vh',
                borderRadius: 'var(--radius-xl)', overflowY: 'auto', boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                position: 'relative', display: 'flex', flexDirection: 'column'
              }}
            >
              <button
                onClick={() => setSelectedDest(null)}
                style={{ 
                    position: 'absolute', top: 24, right: 24, width: 48, height: 48, borderRadius: 24, 
                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: '#fff', 
                    border: 'none', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 900
                }}
              >
                ✕
              </button>

              <div className="asymmetric-image" style={{ height: 360, width: '100%', position: 'relative' }}>
                <img src={selectedDest.image} alt={selectedDest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--surface), transparent)' }} />
                <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40 }}>
                   <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 8 }}>DESTINATION GUIDE</p>
                   <h2 className="headline" style={{ fontSize: 56, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1, letterSpacing: -3 }}>{selectedDest.name}</h2>
                   <p style={{ fontSize: 18, color: 'var(--on-surface-variant)', marginTop: 12, fontWeight: 600 }}>{selectedDest.location}</p>
                </div>
              </div>

              <div style={{ padding: '0 40px 64px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, background: 'var(--surface-container-low)', padding: 32, borderRadius: 'var(--radius-lg)', marginBottom: 48, position: 'relative' }}>
                  <div style={{ fontSize: 48, background: 'var(--surface-container-highest)', width: 80, height: 80, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✨</div>
                  <div>
                    <h3 className="headline" style={{ fontSize: 20, fontWeight: 900 }}>AI Smart Itinerary</h3>
                    <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', marginTop: 6, fontWeight: 700 }}>
                      {people} pax · {days} days · Est. {formatCurrency(selectedDest.estTotalCost)}
                    </p>
                  </div>
                </div>

                <div style={{ position: 'relative', paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 48 }}>
                  <div style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: 2, background: 'var(--primary)', opacity: 0.1 }} />
                  {selectedDest.itinerary.map((day, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <div style={{ 
                          position: 'absolute', left: -36, top: 6, width: 10, height: 10, borderRadius: 5, 
                          background: 'var(--primary)', boxShadow: '0 0 10px rgba(158,0,31,0.4)' 
                      }} />
                      <h4 style={{ fontSize: 12, fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>HARI {day.day}</h4>
                      <h5 className="headline" style={{ fontSize: 26, fontWeight: 900, marginBottom: 20 }}>{day.title}</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {day.activities.map((act, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'var(--surface-container-low)', padding: 20, borderRadius: 'var(--radius-md)' }}>
                            <span style={{ fontSize: 24 }}>
                              {i === 0 ? '🛫' : i === day.activities.length - 1 ? '🏨' : '📍'}
                            </span>
                            <span style={{ fontSize: 16, fontWeight: 700, opacity: 0.9 }}>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 64 }}>
                  <button
                    className="btn btn-primary btn-full shadow-lg"
                    style={{ padding: 24, fontSize: 18, fontWeight: 900, letterSpacing: 1 }}
                    onClick={() => { setSelectedDest(null); navigate('/kalender'); }}
                  >
                    SIMPAN KE KALENDER 🗓️
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {shareDest && <ShareSheet dest={shareDest} onClose={() => setShareDest(null)} />}

        <style>{`
          .hover-scale { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .hover-scale:hover { transform: translateY(-8px); }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0% { opacity: 0.05; } 50% { opacity: 0.15; } 100% { opacity: 0.05; } }
        `}</style>
      </div>
    );
  }

  return null;
}
