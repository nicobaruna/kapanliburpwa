import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { getNextHoliday, getDaysUntil, formatLongWeekendRange } from '../utils/dateUtils';
import type { Holiday } from '../data/holidays2026';
import { LONG_WEEKENDS_2026 } from '../data/holidays2026';
import type { LongWeekend } from '../data/holidays2026';
import { useUser } from '../context/UserContext';

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const MONTH_ABBR_ID = [
  'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
  'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES',
];

const LW_ACCENT_COLORS = [
  '#9e001f',
  '#1b6d24',
  '#1264b0',
  '#c47a00',
  '#6b21a8',
  '#0e7490',
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { authState, loginWithGoogle } = useUser();
  const [nextHoliday, setNextHoliday]   = useState<Holiday | null>(null);
  const [daysUntil, setDaysUntil]       = useState<number | null>(null);
  const [activeMonth, setActiveMonth]   = useState<number | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError]   = useState('');

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setGoogleError('');
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        loginWithGoogle({ name: profile.name, email: profile.email, photo: profile.picture });
      } catch {
        setGoogleError('Gagal mengambil profil. Coba lagi.');
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setGoogleError('Login Google gagal. Coba lagi.');
      setGoogleLoading(false);
    },
  });

  useEffect(() => {
    const h = getNextHoliday();
    setNextHoliday(h);
    if (h) setDaysUntil(getDaysUntil(h.date));
  }, []);

  // Compute upcoming long weekends
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingLWs = LONG_WEEKENDS_2026.filter(lw => {
    const end = new Date(lw.endDate + 'T00:00:00');
    return end >= today;
  });

  const months = [...new Set(upcomingLWs.map(lw => new Date(lw.startDate + 'T00:00:00').getMonth()))];

  const filteredLWs = activeMonth === null
    ? upcomingLWs
    : upcomingLWs.filter(lw => new Date(lw.startDate + 'T00:00:00').getMonth() === activeMonth);

  function handleLwNavigate(lw: LongWeekend) {
    if (authState === 'authenticated') {
      navigate('/calendar', { state: { targetDate: lw.startDate } });
    } else {
      navigate('/onboarding');
    }
  }

  function handleShare(lw: LongWeekend) {
    const range = formatLongWeekendRange(lw);
    const text = `Long Weekend ${lw.label} (${range}, ${lw.totalDays} hari) 🎉 Yuk rencanakan liburanmu!`;
    const url = window.location.origin;
    if (navigator.share) {
      navigator.share({ title: `Long Weekend ${lw.label}`, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`).catch(() => {});
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface)', color: 'var(--on-surface)' }}>
      {/* Navigation */}
      <nav className="lp-nav">
        <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-1px' }}>KapanLibur</div>
        <div className="lp-nav-links">
          <a href="#" className="lp-nav-link active">Calendar</a>
          <a href="#" className="lp-nav-link">Budget</a>
          <a href="#" className="lp-nav-link">Destinations</a>
          <a href="#" className="lp-nav-link">Promos</a>
          <a href="#" className="lp-nav-link">Masuk</a>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24, opacity: 0.6, cursor: 'pointer' }}>notifications</span>
          <span className="material-symbols-outlined" style={{ fontSize: 28, opacity: 0.6, cursor: 'pointer' }}>account_circle</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="lp-hero">
        <div style={{ animation: 'fadeIn 0.8s ease' }}>
          <span className="lp-badge">⚡ YOUR JOURNEY, MASTERED</span>
          <h1 className="lp-h1">
            Libur Lebih <br />
            <span>Maksimal.</span>
          </h1>
          <p className="lp-hero-p">
            Transformasikan jatah cuti Anda menjadi memori tak terlupakan.
            Kelola finansial dan jadwal liburan dalam satu aplikasi pintar.
          </p>
          <button
            className="lp-btn-google"
            onClick={() => !googleLoading && triggerGoogleLogin()}
            disabled={googleLoading}
            style={{ marginBottom: 0, opacity: googleLoading ? 0.7 : 1, cursor: googleLoading ? 'wait' : 'pointer' }}
          >
            {googleLoading
              ? <span className="lp-google-spinner" />
              : <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="" />}
            {googleLoading ? 'Menghubungkan...' : 'Login dengan Google'}
          </button>
          {googleError && (
            <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 10, fontWeight: 600 }}>{googleError}</p>
          )}
        </div>

        <div style={{ position: 'relative', animation: 'slideUp 1s ease' }}>
          <img
            src="/hero_mountain_lake.png"
            alt="Liburan"
            style={{
              width: '100%',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.1)',
              display: 'block'
            }}
          />
          {/* Libur Berikutnya Float Card */}
          {nextHoliday && (
            <div style={{
              position: 'absolute',
              bottom: -36,
              left: -28,
              background: 'var(--primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px 24px',
              minWidth: 260,
              maxWidth: 300,
              zIndex: 10,
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(158,0,31,0.32)',
            }}>
              {/* Decorative glow */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: -40, right: -40,
                width: 140, height: 140, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Label */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                padding: '4px 12px 4px 8px',
                borderRadius: 'var(--radius-full)',
                marginBottom: 14,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>calendar_today</span>
                <span style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Libur Berikutnya
                </span>
              </div>

              {/* Holiday name */}
              <p className="headline" style={{
                fontSize: 17, fontWeight: 900, color: '#fff',
                lineHeight: 1.2, marginBottom: 6,
                letterSpacing: '-0.01em',
                position: 'relative', zIndex: 1,
              }}>
                {nextHoliday.shortName}
              </p>

              {/* Date */}
              <p style={{
                fontSize: 11, color: 'rgba(255,255,255,0.65)',
                fontWeight: 500, marginBottom: 16,
                position: 'relative', zIndex: 1,
              }}>
                {new Date(nextHoliday.date + 'T00:00:00').toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })}
              </p>

              {/* Countdown pills */}
              <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 1 }}>
                {[
                  { val: daysUntil ?? 0, label: 'HARI' },
                  { val: 23 - new Date().getHours(), label: 'JAM' },
                ].map(({ val, label }) => (
                  <div key={label} style={{
                    background: 'rgba(255,255,255,0.13)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    borderRadius: 10,
                    padding: '10px 16px',
                    textAlign: 'center',
                    flex: 1,
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{val}</div>
                    <div style={{ fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.55)', letterSpacing: 2, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
                <div style={{
                  background: daysUntil !== null && daysUntil <= 7 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.13)',
                  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flex: 1,
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 900,
                    color: daysUntil !== null && daysUntil <= 7 ? 'var(--primary)' : 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'center',
                  }}>
                    {daysUntil === 0 ? 'Hari\nIni!' : daysUntil !== null && daysUntil <= 7 ? 'Segera!' : 'Lagi'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Long Weekend 2026 Section ──────────────────────────── */}
      <section style={{ padding: '80px 5% 80px', maxWidth: 1440, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 40, flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(158,0,31,0.08)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 16px',
              marginBottom: 16,
            }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 2 }}>
                🏖️ Long Weekend 2026
              </span>
            </div>
            <h2 className="headline" style={{
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900,
              letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
            }}>
              Rencanakan <span style={{ color: 'var(--primary)' }}>Liburan</span><br />Panjangmu
            </h2>
          </div>
          <p style={{
            fontSize: 15, color: 'var(--on-surface-variant)',
            maxWidth: 300, lineHeight: 1.6, margin: 0,
          }}>
            {upcomingLWs.length} long weekend tersisa di 2026. Klik untuk melihat detail & rekomendasi cuti.
          </p>
        </div>

        {/* Month filter chips */}
        <div className="lw-month-chips" style={{
          display: 'flex', gap: 10, marginBottom: 40,
          overflowX: 'auto', paddingBottom: 4,
          maxWidth: '100%',
        }}>
          <button
            onClick={() => setActiveMonth(null)}
            style={{
              padding: '9px 22px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeMonth === null ? 'var(--primary)' : 'var(--surface-container-high)',
              color: activeMonth === null ? '#fff' : 'var(--on-surface)',
              fontWeight: 800, fontSize: 13,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: activeMonth === null ? '0 4px 16px rgba(158,0,31,0.28)' : 'none',
            }}
          >
            Semua ({upcomingLWs.length})
          </button>
          {months.map(m => {
            const count = upcomingLWs.filter(lw => new Date(lw.startDate + 'T00:00:00').getMonth() === m).length;
            return (
              <button
                key={m}
                onClick={() => setActiveMonth(activeMonth === m ? null : m)}
                style={{
                  padding: '9px 22px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: activeMonth === m ? 'var(--primary)' : 'var(--surface-container-high)',
                  color: activeMonth === m ? '#fff' : 'var(--on-surface)',
                  fontWeight: 800, fontSize: 13,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: activeMonth === m ? '0 4px 16px rgba(158,0,31,0.28)' : 'none',
                }}
              >
                {MONTH_NAMES_ID[m]} ({count})
              </button>
            );
          })}
        </div>

        {/* LW Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
          gap: 24,
        }}>
          {filteredLWs.map((lw, idx) => {
            const daysToStart = getDaysUntil(lw.startDate);
            const daysToEnd = getDaysUntil(lw.endDate);
            const isNow = daysToEnd >= 0 && daysToStart <= 0;
            const isSoon = daysToStart > 0 && daysToStart <= 14;
            const accent = LW_ACCENT_COLORS[idx % LW_ACCENT_COLORS.length];
            const startD = new Date(lw.startDate + 'T00:00:00');
            const endD = new Date(lw.endDate + 'T00:00:00');
            const sameMonth = startD.getMonth() === endD.getMonth();

            return (
              <div
                key={lw.startDate}
                className="lw-card"
                style={{
                  background: 'var(--surface-container-lowest)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                }}
                onClick={() => handleLwNavigate(lw)}
              >
                {/* Colored accent top stripe */}
                <div style={{
                  height: 5,
                  background: `linear-gradient(90deg, ${accent} 0%, ${accent}55 100%)`,
                }} />

                <div style={{ padding: '24px' }}>
                  {/* Top row: date stamp + status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>

                    {/* Date block */}
                    <div style={{
                      background: accent,
                      borderRadius: 14,
                      padding: '14px 18px',
                      textAlign: 'center',
                      minWidth: 68,
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {/* Subtle inner glow */}
                      <div aria-hidden="true" style={{
                        position: 'absolute', top: -20, right: -20,
                        width: 80, height: 80, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        pointerEvents: 'none',
                      }} />
                      <div style={{
                        fontSize: 30, fontWeight: 900, color: '#fff',
                        lineHeight: 1, fontFamily: 'Plus Jakarta Sans, sans-serif',
                        position: 'relative', zIndex: 1,
                      }}>
                        {startD.getDate()}
                      </div>
                      <div style={{
                        fontSize: 9, fontWeight: 900,
                        color: 'rgba(255,255,255,0.75)',
                        letterSpacing: 1.5, marginTop: 3,
                        textTransform: 'uppercase',
                        position: 'relative', zIndex: 1,
                      }}>
                        {MONTH_ABBR_ID[startD.getMonth()]}
                      </div>
                      {!sameMonth && (
                        <div style={{
                          fontSize: 8, fontWeight: 700,
                          color: 'rgba(255,255,255,0.6)',
                          marginTop: 4,
                          position: 'relative', zIndex: 1,
                        }}>
                          — {endD.getDate()} {MONTH_ABBR_ID[endD.getMonth()]}
                        </div>
                      )}
                    </div>

                    {/* Status + duration badges */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7 }}>
                      <div style={{
                        padding: '5px 14px',
                        borderRadius: 'var(--radius-full)',
                        background: isNow ? '#22c55e'
                          : isSoon ? '#f59e0b'
                          : 'var(--surface-container-high)',
                        color: isNow || isSoon ? '#fff' : 'var(--on-surface-variant)',
                        fontSize: 11, fontWeight: 900,
                        textTransform: 'uppercase', letterSpacing: 0.8,
                        whiteSpace: 'nowrap',
                      }}>
                        {isNow
                          ? '🟢 Berlangsung'
                          : isSoon
                          ? `⚡ ${daysToStart} hari lagi`
                          : `${daysToStart} hari lagi`}
                      </div>
                      <div style={{
                        padding: '5px 14px',
                        borderRadius: 'var(--radius-full)',
                        background: lw.totalDays >= 5
                          ? 'rgba(34,197,94,0.12)'
                          : 'var(--surface-container)',
                        color: lw.totalDays >= 5 ? '#15803d' : 'var(--on-surface-variant)',
                        fontSize: 11, fontWeight: 800,
                      }}>
                        🗓️ {lw.totalDays} Hari
                      </div>
                    </div>
                  </div>

                  {/* LW label */}
                  <h3 className="headline" style={{
                    fontSize: 21, fontWeight: 900,
                    color: 'var(--on-surface)',
                    marginBottom: 6, lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                  }}>
                    {lw.label}
                  </h3>

                  {/* Date range */}
                  <p style={{
                    fontSize: 13, color: 'var(--on-surface-variant)',
                    fontWeight: 500, marginBottom: 18,
                  }}>
                    {formatLongWeekendRange(lw)} · {startD.getFullYear()}
                  </p>

                  {/* Holiday tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
                    {lw.holidays.map(h => (
                      <span key={h.id} style={{
                        padding: '3px 11px',
                        borderRadius: 'var(--radius-full)',
                        background: h.type.includes('cuti_bersama')
                          ? 'rgba(27,109,36,0.10)'
                          : 'rgba(158,0,31,0.09)',
                        color: h.type.includes('cuti_bersama') ? '#1b6d24' : 'var(--primary)',
                        fontSize: 11, fontWeight: 700,
                      }}>
                        {h.emoji} {h.shortName}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => { e.stopPropagation(); handleLwNavigate(lw); }}
                      style={{ flex: 1, padding: '12px 0', fontSize: 13, fontWeight: 800 }}
                    >
                      {authState === 'authenticated' ? 'Lihat Kalender →' : 'Rencanakan →'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(lw); }}
                      title="Bagikan"
                      style={{
                        padding: '12px 16px',
                        border: 'none',
                        background: 'var(--surface-container-high)',
                        borderRadius: 'var(--radius-default)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s ease',
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-container-highest)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-container-high)')}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--on-surface-variant)' }}>share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLWs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--on-surface-variant)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Tidak ada long weekend di bulan ini</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section style={{ padding: '40px 0' }}>
         <div className="lp-cta-banner">
             <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.03em' }}>Siap untuk liburan berikutnya?</h2>
             <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, maxWidth: 640, margin: '0 auto 56px', lineHeight: 1.6 }}>
                Bergabunglah dengan 50,000+ wisatawan cerdas lainnya yang sudah memaksimalkan jatah cuti mereka.
             </p>
             <button
               className="lp-btn-google"
               onClick={() => !googleLoading && triggerGoogleLogin()}
               disabled={googleLoading}
               style={{ padding: '18px 48px', fontSize: 16, margin: '0 auto', opacity: googleLoading ? 0.7 : 1, cursor: googleLoading ? 'wait' : 'pointer' }}
             >
               {googleLoading
                 ? <span className="lp-google-spinner" />
                 : <img src="https://www.google.com/favicon.ico" width="22" height="22" alt="" />}
               {googleLoading ? 'Menghubungkan...' : 'Login dengan Google'}
             </button>
         </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
          <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--primary)', letterSpacing: '-1.5px' }}>KapanLibur.</div>
          <div style={{ display: 'flex', gap: 32, fontSize: 12, fontWeight: 700, opacity: 0.5 }}>
              <span style={{ cursor: 'pointer' }}>PRIVACY POLICY</span>
              <span style={{ cursor: 'pointer' }}>TERMS OF SERVICE</span>
              <span style={{ cursor: 'pointer' }}>HELP CENTER</span>
              <span style={{ cursor: 'pointer' }}>CONTACT US</span>
          </div>
          <div style={{ fontSize: 11, opacity: 0.3, letterSpacing: 0.5 }}>© 2026 KAPANLIBUR INDONESIA. THE DIGITAL CONCIERGE.</div>
      </footer>

      <style>{`
        .lp-google-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(0,0,0,0.15);
          border-top-color: #4285F4;
          border-radius: 50%;
          animation: lp-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes lp-spin { to { transform: rotate(360deg); } }
        .lw-card {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.25s ease;
        }
        .lw-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.10) !important;
        }
        .lw-card:active {
          transform: scale(0.98) !important;
        }
        .lw-month-chips {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .lw-month-chips::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) {
          .lw-card { transition: none !important; }
          .lw-card:hover { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
