import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  getNextHoliday, getUpcomingHolidays, getNextLongWeekend,
  getDaysUntil, formatLongWeekendRange,

} from '../utils/dateUtils';
import type { Holiday, LongWeekend } from '../data/holidays2026';
import type { SharePayload } from '../components/ShareSheet';
import ShareSheet from '../components/ShareSheet';


import { getRecommendations, RecommendationResult, formatCurrency } from '../services/api';
import {
  isReminderEnabled, enableReminders, disableReminders, checkAndFireReminders,
} from '../services/ReminderService';

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const goToCalendar = (date: string) => navigate(`/calendar?date=${date}`);

const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null);
  const [upcoming, setUpcoming] = useState<Holiday[]>([]);
  const [longWeekends, setLongWeekends] = useState<LongWeekend[]>([]);
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  const [inspirations, setInspirations] = useState<RecommendationResult[]>([]);
  const [reminderOn, setReminderOn] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderToast, setReminderToast] = useState('');
  const [remindersOn, setRemindersOn] = useState(false);
  const [hoursLeft, setHoursLeft] = useState(0);
  const [minsLeft, setMinsLeft] = useState(0);
  const [shareDest, setShareDest] = useState<SharePayload | null>(null);

useEffect(() => {
    if (nextHoliday) {
      const now = new Date();
      const target = new Date(nextHoliday.date + 'T00:00:00');
      const diffMs = target.getTime() - now.getTime();
      const totalMins = Math.max(0, Math.floor(diffMs / 60000));
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      setHoursLeft(hrs);
      setMinsLeft(mins);
    }
  }, [nextHoliday]);

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
    getRecommendations(budget).then(res => setInspirations(res.slice(0, 4)));

    // Sync reminder toggle state and fire any pending reminders
    const enabled = isReminderEnabled();
    setReminderOn(enabled);
    setRemindersOn(enabled);
    checkAndFireReminders();
  }, []);

  async function handleReminderToggle() {
    if (reminderOn) {
      disableReminders();
      setReminderOn(false);
      setRemindersOn(false);
      showToast('🔕 Pengingat dinonaktifkan');
    } else {
      setReminderLoading(true);
      const result = await enableReminders();
      if (result === 'granted') {
        setReminderOn(true);
        showToast('🔔 Pengingat aktif! Kamu akan diberitahu H-5 sebelum libur.');
        checkAndFireReminders();
      } else if (result === 'denied') {
        showToast('❌ Izin notifikasi ditolak. Aktifkan di pengaturan browser.');
      } else {
        showToast('❌ Browser tidak mendukung notifikasi.');
      }
    }
  }

  function showToast(msg: string) {
    setReminderToast(msg);
    setTimeout(() => setReminderToast(''), 3500);
  }

  return (
    <div className="page" style={{ padding: '0 32px 100px', maxWidth: '1440px', margin: '0 auto' }}>

      {/* Header */}
      <header style={{ padding: '24px 0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="headline" style={{ fontSize: 24, fontWeight: 900, color: 'var(--on-surface)' }}>Dashboard</h1>

        <button
          onClick={handleReminderToggle}
          title={reminderOn ? 'Nonaktifkan pengingat' : 'Aktifkan pengingat H-5'}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 'var(--radius-full)',
            background: reminderOn ? 'var(--primary-container)' : 'var(--surface-container-high)',
            color: reminderOn ? '#fff' : 'var(--on-surface-variant)',
            border: reminderOn ? 'none' : '1.5px solid var(--outline-variant)',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {reminderOn ? 'notifications_active' : 'notifications_none'}
          </span>
          {reminderOn ? 'Pengingat Aktif' : 'Aktifkan Pengingat'}
        </button>
      </header>

      {/* Toast */}
      {reminderToast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a1a', color: '#fff', padding: '12px 20px',
          borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600,
          zIndex: 9999, whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.25s ease',
        }}>
          {reminderToast}
        </div>
      )}

      {/* Main Grid: Left Column (Main) and Right Column (Sidebar) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 340px)', gap: 40, alignItems: 'start' }}>

        {/* === LEFT COLUMN === */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* Upcoming Holiday Hero Card */}
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
                    { val: hoursLeft, label: 'JAM' },
                    { val: minsLeft, label: 'MENIT' },
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
                  aria-label={reminderOn ? 'Nonaktifkan pengingat' : 'Aktifkan pengingat'}
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
                inspirations.map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => navigate(`/inspiration/${dest.id}`)}
                    style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', cursor: 'pointer', height: 260 }}
                    className="hover-scale"
                  >
                    <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />

                    {/* Top badge */}
                    <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {dest.dynamicTags.slice(0, 2).map((t, i) => {
                        const bg = t.type === 'danger' ? 'var(--primary-container)' : t.type === 'success' ? '#97E4A8' : 'rgba(255,255,255,0.85)';
                        const color = t.type === 'danger' ? '#fff' : t.type === 'success' ? '#0F5120' : 'var(--primary-container)';
                        return (
                          <span key={i} style={{ background: bg, color, fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 8, letterSpacing: 0.5 }}>
                            {t.label}
                          </span>
                        );
                      })}
                    </div>

                    <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
                      <h3 className="headline" style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>{dest.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{dest.location}</p>
                        <p style={{ fontSize: 13, fontWeight: 800, color: dest.canAfford ? '#97E4A8' : '#FADB5F' }}>
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
                const dateObj = new Date(h.date + 'T00:00:00');
                const monthStr = dateObj.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
                const dayNum = dateObj.getDate().toString().padStart(2, '0');
                const dLeft = getDaysUntil(h.date);
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
      {shareDest && <ShareSheet payload={shareDest} onClose={() => setShareDest(null)} />}

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
