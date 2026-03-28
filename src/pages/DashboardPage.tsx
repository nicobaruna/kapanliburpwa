import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  getNextHoliday, getUpcomingHolidays, getNextLongWeekend,
  getDaysUntil, formatLongWeekendRange,
} from '../utils/dateUtils';
import type { Holiday, LongWeekend } from '../data/holidays2026';
import { getRecommendations, RecommendationResult, TripStyle, formatCurrency } from '../services/api';
import { isRemindersEnabled, enableReminders, disableReminders } from '../services/ReminderService';
import ShareSheet from '../components/ShareSheet';

function styleFromVacationStyle(s?: string): TripStyle {
  if (s === 'backpacker') return 'hemat';
  if (s === 'luxury') return 'luxury';
  return 'balance';
}

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null);
  const [upcoming, setUpcoming] = useState<Holiday[]>([]);
  const [longWeekends, setLongWeekends] = useState<LongWeekend[]>([]);
  const [daysUntil, setDaysUntil] = useState<number | null>(null);

  const [inspirations, setInspirations] = useState<RecommendationResult[]>([]);
  const [shareDest, setShareDest] = useState<RecommendationResult | null>(null);
  const [remindersOn, setRemindersOn] = useState(isRemindersEnabled());
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  useEffect(() => {
    const nextH = getNextHoliday();
    setNextHoliday(nextH);
    if (nextH) setDaysUntil(getDaysUntil(nextH.date));

    let currentLW = getNextLongWeekend();
    const lws: LongWeekend[] = [];
    if (currentLW) {
      lws.push(currentLW);
      lws.push({ ...currentLW, label: 'Kenaikan Isa Almasih', startDate: '2026-05-14', endDate: '2026-05-17', totalDays: 4, holidays: [] });
    }
    setLongWeekends(lws);
    setUpcoming(getUpcomingHolidays(4));

    const budget = window.localStorage.getItem('kapanlibur_budget')
      ? parseInt(window.localStorage.getItem('kapanlibur_budget') || '4500000')
      : 4500000;
    const style = styleFromVacationStyle(user?.vacationStyle);
    getRecommendations(budget, 2, 3, style, user?.vacationType).then(res => {
      setInspirations(res.slice(0, 4));
    });
  }, [user?.vacationType, user?.vacationStyle]);

  async function handleReminderToggle() {
    if (reminderLoading) return;
    if (remindersOn) {
      disableReminders();
      setRemindersOn(false);
      showToast('Pengingat dinonaktifkan.');
    } else {
      setReminderLoading(true);
      const granted = await enableReminders();
      setReminderLoading(false);
      if (granted) {
        setRemindersOn(true);
        showToast('Pengingat aktif! Kamu akan diingatkan H-5 hingga H-1.');
      } else {
        showToast('Izin notifikasi ditolak. Aktifkan di pengaturan browser.');
      }
    }
  }

  function showToast(msg: string) {
    setReminderToast(msg);
    setTimeout(() => setReminderToast(null), 3500);
  }

  function goToCalendar(date: string) {
    navigate('/calendar', { state: { targetDate: date } });
  }

  const firstName = user?.name?.split(' ')[0] || 'Kamu';
  const now = new Date();
  const hoursLeft = 23 - now.getHours();
  const minsLeft  = 59 - now.getMinutes();

  return (
    <div className="page page-container" style={{ maxWidth: '1440px', margin: '0 auto' }}>

      {/* ── Toast ── */}
      {reminderToast && (
        <div style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--on-surface)', color: '#fff', padding: '14px 28px',
          borderRadius: 'var(--radius-full)', fontSize: 14, fontWeight: 700,
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)', zIndex: 9000,
          animation: 'db-slideup 0.3s ease', whiteSpace: 'nowrap', maxWidth: '90vw',
          textAlign: 'center',
        }}>
          {reminderToast}
        </div>
      )}

      {/* ── Page header ── */}
      <header style={{
        padding: 'var(--spacing-6) 0 var(--spacing-8)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        animation: 'db-enter 0.45s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <div>
          <p style={{
            fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: 2, color: 'var(--on-surface-variant)', marginBottom: 4,
          }}>
            Selamat datang kembali
          </p>
          <h1 className="headline" style={{ fontSize: 30, fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
            {firstName}
          </h1>
        </div>
        <button
          onClick={() => navigate('/inspiration')}
          aria-label="Jelajahi inspirasi liburan"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 'var(--radius-full)',
            background: 'var(--surface-container-low)', border: 'none',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            color: 'var(--on-surface)', transition: 'all 0.2s ease',
          }}
          className="db-btn-ghost"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 17 }}>explore</span>
          Jelajahi
        </button>
      </header>

      {/* ── Main grid ── */}
      <div className="db-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 316px', gap: 28, alignItems: 'start' }}>

        {/* ════ LEFT COLUMN ════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* ── Hero: Upcoming Holiday ── */}
          {nextHoliday && (
            <div style={{
              background: 'var(--primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '44px 48px 40px',
              position: 'relative',
              overflow: 'hidden',
              animation: 'db-enter 0.5s 0.04s cubic-bezier(0.22,1,0.36,1) both',
            }}>
              {/* Gradient depth overlay */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.32) 100%)',
                pointerEvents: 'none',
              }} />

              {/* Giant watermark number */}
              <div aria-hidden="true" style={{
                position: 'absolute', right: -16, bottom: -24,
                fontSize: 'clamp(140px, 22vw, 240px)',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.055)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                letterSpacing: '-0.06em',
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none',
              }}>
                {daysUntil}
              </div>

              {/* Decorative radial glow */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: -100, right: -100,
                width: 380, height: 380, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)',
                pointerEvents: 'none',
              }} />

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>

                {/* Label pill */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'rgba(255,255,255,0.14)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  padding: '6px 16px 6px 10px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 22,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>calendar_today</span>
                  <span style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 1.8 }}>
                    Libur Berikutnya
                  </span>
                </div>

                {/* Holiday name */}
                <h2 className="headline" style={{
                  fontSize: 'clamp(26px, 3.8vw, 48px)',
                  fontWeight: 900,
                  lineHeight: 1.08,
                  marginBottom: 14,
                  color: '#fff',
                  letterSpacing: '-0.025em',
                }}>
                  {nextHoliday.name}
                </h2>

                {/* Date line */}
                <p style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 500,
                  marginBottom: 34,
                  lineHeight: 1.5,
                }}>
                  {new Date(nextHoliday.date + 'T00:00:00').toLocaleDateString('id-ID', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>

                {/* Countdown pills row */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
                  {[
                    { val: daysUntil ?? 0, label: 'HARI' },
                    { val: hoursLeft,      label: 'JAM' },
                    { val: minsLeft,       label: 'MENIT' },
                  ].map(({ val, label }) => (
                    <div key={label} style={{
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 22px',
                      textAlign: 'center',
                      minWidth: 72,
                    }}>
                      <div style={{
                        fontSize: 34, fontWeight: 900, color: '#fff',
                        lineHeight: 1, fontFamily: 'Plus Jakarta Sans, sans-serif',
                        letterSpacing: '-0.02em',
                      }}>
                        {val}
                      </div>
                      <div style={{
                        fontSize: 8, fontWeight: 900,
                        color: 'rgba(255,255,255,0.55)',
                        letterSpacing: 2, marginTop: 5,
                      }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reminder CTA */}
                <button
                  onClick={handleReminderToggle}
                  disabled={reminderLoading}
                  aria-label={remindersOn ? 'Nonaktifkan pengingat' : 'Aktifkan pengingat'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    width: '100%',
                    padding: '15px 28px',
                    borderRadius: 'var(--radius-full)',
                    border: remindersOn ? '1.5px solid rgba(255,255,255,0.35)' : 'none',
                    cursor: reminderLoading ? 'wait' : 'pointer',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 800, fontSize: 14,
                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                    background: remindersOn ? 'rgba(255,255,255,0.18)' : '#fff',
                    color: remindersOn ? '#fff' : 'var(--primary)',
                    boxShadow: remindersOn ? 'none' : '0 8px 32px rgba(0,0,0,0.22)',
                    opacity: reminderLoading ? 0.65 : 1,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {reminderLoading ? 'hourglass_empty' : remindersOn ? 'notifications_active' : 'add_alert'}
                  </span>
                  {reminderLoading ? 'Meminta izin...' : remindersOn ? 'Pengingat Aktif' : 'Aktifkan Pengingat'}
                </button>

              </div>
            </div>
          )}

          {/* ── Inspirasi Liburan ── */}
          <div style={{ animation: 'db-enter 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
              <div>
                <h2 className="headline" style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.01em' }}>Inspirasi Liburan</h2>
                <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 3, fontWeight: 500 }}>
                  Dipilih sesuai preferensimu
                </p>
              </div>
              <button
                onClick={() => navigate('/inspiration')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 13, fontWeight: 800, color: 'var(--primary)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px 0', transition: 'opacity 0.15s ease',
                }}
                className="db-link"
              >
                Lihat Semua
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_forward</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
              {inspirations.length === 0 ? (
                [1, 2].map(i => (
                  <div key={i} style={{
                    height: 300, borderRadius: 'var(--radius-lg)',
                    background: 'var(--surface-container-high)',
                    animation: 'db-pulse 1.5s infinite',
                  }} />
                ))
              ) : (
                inspirations.map((dest, idx) => (
                  <div
                    key={dest.id}
                    onClick={() => navigate('/inspiration')}
                    style={{
                      position: 'relative', cursor: 'pointer',
                      height: 300, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                      animation: `db-enter 0.5s ${0.12 + idx * 0.06}s cubic-bezier(0.22,1,0.36,1) both`,
                    }}
                    className="db-card"
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.src = `https://picsum.photos/seed/${dest.id}/800/500`; }}
                      className="db-card-img"
                    />
                    {/* Deep editorial overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(6,5,4,0.88) 0%, rgba(6,5,4,0.28) 55%, transparent 100%)',
                    }} />

                    {/* Match score badge */}
                    <div style={{
                      position: 'absolute', top: 14, left: 14,
                      background: 'var(--primary)', color: '#fff',
                      fontSize: 10, fontWeight: 900, padding: '4px 11px',
                      borderRadius: 'var(--radius-full)', letterSpacing: 0.3,
                    }}>
                      {Math.max(0, dest.matchScore)}% match
                    </div>

                    {/* Share button */}
                    <button
                      onClick={e => { e.stopPropagation(); setShareDest(dest); }}
                      aria-label={`Bagikan ${dest.name}`}
                      style={{
                        position: 'absolute', top: 14, right: 14,
                        width: 38, height: 38, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.16)',
                        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        color: '#fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 17 }}>ios_share</span>
                    </button>

                    {/* Card content */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '22px 22px 20px' }}>
                      <h3 className="headline" style={{
                        fontSize: 21, fontWeight: 900, color: '#fff',
                        lineHeight: 1.15, marginBottom: 8, letterSpacing: '-0.01em',
                      }}>
                        {dest.name}
                      </h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                          {dest.location}
                        </p>
                        <p style={{
                          fontSize: 12, fontWeight: 800, color: '#fff',
                          background: 'rgba(255,255,255,0.14)',
                          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                          padding: '4px 12px', borderRadius: 'var(--radius-full)',
                        }}>
                          {formatCurrency(dest.estTotalCost)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, animation: 'db-enter 0.5s 0.16s cubic-bezier(0.22,1,0.36,1) both' }}>

          {/* ── Cari Pesawat ── */}
          <div style={{
            background: 'var(--surface-container-low)',
            borderRadius: 'var(--radius-lg)',
            padding: '22px 22px 22px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div aria-hidden="true" style={{
              position: 'absolute', top: -40, right: -40,
              width: 140, height: 140, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(158,0,31,0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-default)',
                background: 'rgba(158,0,31,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 19, color: 'var(--primary)' }}>flight</span>
              </div>
              <h3 className="headline" style={{ fontSize: 15, fontWeight: 800 }}>Cari Pesawat</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18 }}>
              {[
                { label: 'Dari', val: 'Jakarta (CGK)', icon: 'flight_takeoff', muted: false },
                { label: 'Ke', val: 'Cari destinasi...', icon: 'flight_land', muted: true },
              ].map(f => (
                <div key={f.label} style={{
                  background: 'var(--surface-container-lowest)',
                  padding: '11px 14px', borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', gap: 11,
                  boxShadow: 'var(--shadow-ambient)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'var(--on-surface-variant)', flexShrink: 0 }}>
                    {f.icon}
                  </span>
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                      {f.label}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: f.muted ? 'var(--on-surface-variant)' : 'var(--on-surface)' }}>
                      {f.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/booking')}
              className="btn btn-primary btn-full"
              style={{ fontSize: 14, fontWeight: 800 }}
            >
              Cek Tiket Sekarang
            </button>
          </div>

          {/* ── Long Weekend Alerts ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <h2 className="headline" style={{ fontSize: 16, fontWeight: 900 }}>Long Weekend</h2>
              <span style={{
                background: 'var(--primary)', color: '#fff',
                fontSize: 8, fontWeight: 900, padding: '3px 9px',
                borderRadius: 'var(--radius-full)', letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}>
                Alert
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Card 1: Aman */}
              <div
                onClick={() => longWeekends[0] && goToCalendar(longWeekends[0].startDate)}
                style={{
                  background: 'var(--secondary-container)',
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                  transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                className="hover-scale"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2e7d32', flexShrink: 0 }} />
                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--on-secondary-container)' }}>
                      Aman
                    </span>
                  </div>
                  <span style={{
                    background: 'rgba(255,255,255,0.38)',
                    color: 'var(--on-secondary-container)',
                    fontSize: 10, fontWeight: 900, padding: '2px 9px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    {longWeekends[0]?.totalDays ?? '--'} hari
                  </span>
                </div>
                <p className="headline" style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, color: 'var(--on-secondary-container)' }}>
                  {longWeekends[0]?.label || 'Libur Panjang'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--on-secondary-container)', opacity: 0.72, paddingRight: 28 }}>
                  {longWeekends[0] ? formatLongWeekendRange(longWeekends[0]) : '-'}
                </p>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', right: 14, bottom: 14,
                  fontSize: 14, color: 'var(--on-secondary-container)', opacity: 0.4,
                }}>
                  arrow_forward
                </span>
              </div>

              {/* Card 2: Perlu Cuti */}
              <div
                onClick={() => longWeekends[1] && goToCalendar(longWeekends[1].startDate)}
                style={{
                  background: 'rgba(251,146,60,0.11)',
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                  transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                className="hover-scale"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f57c00', flexShrink: 0 }} />
                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2, color: 'rgba(110,55,0,0.88)' }}>
                      Perlu Cuti
                    </span>
                  </div>
                  <span style={{
                    background: 'rgba(245,124,0,0.14)',
                    color: 'rgba(110,55,0,0.88)',
                    fontSize: 10, fontWeight: 900, padding: '2px 9px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    {longWeekends[1]?.totalDays ?? 4} hari
                  </span>
                </div>
                <p className="headline" style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, color: 'rgba(70,35,0,0.92)' }}>
                  {longWeekends[1]?.label || 'Cuti Kejepit'}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(70,35,0,0.6)', paddingRight: 28 }}>
                  Cuti 1 hari → {longWeekends[1]?.totalDays ?? 4} hari libur berturut
                </p>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', right: 14, bottom: 14,
                  fontSize: 14, color: 'rgba(110,55,0,0.3)',
                }}>
                  arrow_forward
                </span>
              </div>

            </div>
          </div>

          {/* ── Libur Nasional ── */}
          <div>
            <h2 className="headline" style={{ fontSize: 16, fontWeight: 900, marginBottom: 14 }}>
              Libur Nasional 2026
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {upcoming.map((h, idx) => {
                const dateObj  = new Date(h.date + 'T00:00:00');
                const monthStr = dateObj.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
                const dayNum   = dateObj.getDate().toString().padStart(2, '0');
                const dLeft    = getDaysUntil(h.date);
                return (
                  <div
                    key={h.id}
                    onClick={() => goToCalendar(h.date)}
                    style={{
                      background: 'var(--surface-container-low)',
                      borderRadius: 'var(--radius-default)',
                      padding: '11px 14px',
                      display: 'flex', alignItems: 'center', gap: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      animation: `db-enter 0.45s ${0.2 + idx * 0.05}s cubic-bezier(0.22,1,0.36,1) both`,
                    }}
                    className="hover-surface-low"
                  >
                    <div style={{
                      width: 42, height: 42, borderRadius: 'var(--radius-default)',
                      background: 'rgba(158,0,31,0.07)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 8, fontWeight: 900, color: 'var(--primary)', lineHeight: 1, letterSpacing: 0.5 }}>
                        {monthStr}
                      </span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1.1 }}>
                        {dayNum}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="headline" style={{
                        fontSize: 13, fontWeight: 800, color: 'var(--on-surface)',
                        marginBottom: 2, overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {h.name}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                        {dateObj.toLocaleDateString('id-ID', { weekday: 'long' })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{dLeft}</p>
                      <p style={{ fontSize: 9, color: 'var(--on-surface-variant)', fontWeight: 700, marginTop: 1 }}>hari lagi</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ShareSheet */}
      {shareDest && <ShareSheet dest={shareDest} onClose={() => setShareDest(null)} />}

      <style>{`
        @keyframes db-enter {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes db-slideup {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes db-pulse { 0%,100% { opacity:0.55; } 50% { opacity:1; } }

        .db-btn-ghost:hover { background: var(--surface-container-high) !important; }
        .db-link:hover { opacity: 0.7; }

        .hover-scale { transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
        .hover-scale:hover { transform: translateY(-3px); }
        .hover-scale:active { transform: scale(0.97); }

        .hover-surface-low:hover { background: var(--surface-container-high) !important; }

        .db-card { transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1); }
        .db-card:hover { transform: translateY(-6px); }
        .db-card:active { transform: scale(0.985); }
        .db-card-img { transition: transform 0.45s ease; }
        .db-card:hover .db-card-img { transform: scale(1.05); }

        @media (max-width: 1024px) {
          .db-layout { grid-template-columns: 1fr !important; gap: 20px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
