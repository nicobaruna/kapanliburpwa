import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  getNextHoliday, getUpcomingHolidays, getNextLongWeekend,
  getDaysUntil, formatLongWeekendRange,
} from '../utils/dateUtils';
import type { Holiday, LongWeekend } from '../data/holidays2026';
import { getRecommendations, RecommendationResult, formatCurrency } from '../services/api';
import {
  isReminderEnabled, enableReminders, disableReminders, checkAndFireReminders,
} from '../services/ReminderService';

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null);
  const [upcoming, setUpcoming] = useState<Holiday[]>([]);
  const [longWeekends, setLongWeekends] = useState<LongWeekend[]>([]);
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  const [inspirations, setInspirations] = useState<RecommendationResult[]>([]);
  const [reminderOn, setReminderOn] = useState(false);
  const [reminderToast, setReminderToast] = useState('');

  useEffect(() => {
    const nextH = getNextHoliday();
    setNextHoliday(nextH);
    if (nextH) setDaysUntil(getDaysUntil(nextH.date));

    let currentLW = getNextLongWeekend();
    const lws = [];
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
    setReminderOn(isReminderEnabled());
    checkAndFireReminders();
  }, []);

  async function handleReminderToggle() {
    if (reminderOn) {
      disableReminders();
      setReminderOn(false);
      showToast('🔕 Pengingat dinonaktifkan');
    } else {
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
              background: 'var(--surface-container)', 
              borderRadius: 32, padding: 40, position: 'relative', overflow: 'hidden'
            }}>
              <span style={{ 
                background: 'var(--primary-container)', color: '#fff', fontSize: 11, fontWeight: 800, 
                padding: '6px 16px', borderRadius: 'var(--radius-full)', letterSpacing: 1, textTransform: 'uppercase',
                display: 'inline-block', marginBottom: 20
              }}>
                Upcoming Holiday
              </span>
              
              <h2 className="headline" style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.1, marginBottom: 16, color: 'var(--on-surface)', maxWidth: '60%' }}>
                {nextHoliday.shortName}
              </h2>
              
              <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', lineHeight: 1.6, maxWidth: '55%', marginBottom: 32 }}>
                Hanya tinggal <strong style={{ color: 'var(--primary-container)' }}>{daysUntil} hari lagi</strong> untuk bersiap libur dan berkumpul bersama keluarga.
              </p>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ background: '#fff', width: 72, height: 72, borderRadius: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{daysUntil}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: 1 }}>DAYS</span>
                </div>
                <div style={{ background: '#fff', width: 72, height: 72, borderRadius: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>18</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: 1 }}>HOURS</span>
                </div>
                <div style={{ background: '#fff', width: 72, height: 72, borderRadius: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>45</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: 1 }}>MINS</span>
                </div>
              </div>

              {/* Decorative Illustration (using CSS shapes/emoji for mockup) */}
              <div style={{ 
                position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)',
                width: 150, height: 150, background: '#2B6A5B', borderRadius: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60
              }}>
                <span dangerouslySetInnerHTML={{ __html: nextHoliday.emoji.length > 2 ? nextHoliday.emoji.substring(0, 2) : nextHoliday.emoji }}></span>
              </div>
            </div>
          )}

          {/* Inspirasi Liburan - MOVED FROM SIDEBAR */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
               <h2 className="headline" style={{ fontSize: 22, fontWeight: 800 }}>Inspirasi Liburan ✨</h2>
               <span onClick={() => navigate('/inspiration')} style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary-container)', cursor: 'pointer' }}>Lihat Semua</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {inspirations.length === 0 ? (
                <>
                  <div style={{ height: 260, borderRadius: 24, background: 'var(--surface-container-high)', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: 260, borderRadius: 24, background: 'var(--surface-container-high)', animation: 'pulse 1.5s infinite' }} />
                </>
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

        {/* === RIGHT COLUMN (Sidebar layout) === */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Cek Tiket Pesawat Widget */}
          <div style={{ border: '2px solid var(--primary-container)', borderRadius: 32, padding: 24, background: '#fff' }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary-container)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>flight_takeoff</span> Cek Tiket Pesawat
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ background: 'var(--surface-container-low)', padding: '12px 16px', borderRadius: 20 }}>
                <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 4 }}>Dari</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Jakarta (CGK)</p>
              </div>
              <div style={{ background: 'var(--surface-container-low)', padding: '12px 16px', borderRadius: 20 }}>
                <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 4 }}>Ke</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface-variant)' }}>Cari destinasi...</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/booking')}
              style={{ 
                width: '100%', padding: '16px', borderRadius: 100, 
                background: 'var(--primary-container)', color: '#fff', fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer' 
              }}>
              Cek Harga Termurah
            </button>
          </div>

          {/* Long Weekend Alerts - MOVED FROM MAIN */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className="headline" style={{ fontSize: 18, fontWeight: 800 }}>Long Weekend Alerts 🚀</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Card 1: Green */}
              <div style={{ background: '#EAF8ED', padding: 20, borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ background: '#97E4A8', color: '#0F5120', padding: '4px 10px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>Aman</span>
                </div>
                <h3 className="headline" style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: '#002204' }}>{longWeekends[0]?.label || 'Libur Panjang'}</h3>
                <p style={{ fontSize: 11, color: '#2A6639', lineHeight: 1.4, marginBottom: 16 }}>
                  {longWeekends[0]?.totalDays} Hari libur.
                </p>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#0F5120' }}>{longWeekends[0] ? formatLongWeekendRange(longWeekends[0]) : '-'}</p>
              </div>

              {/* Card 2: Yellow */}
              <div style={{ background: '#FFF7E3', padding: 20, borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ background: '#FDE49B', color: '#6A4D00', padding: '4px 10px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>Pertimbangan</span>
                </div>
                <h3 className="headline" style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: '#3A2900' }}>{longWeekends[1]?.label || 'Cuti Kejepit'}</h3>
                <p style={{ fontSize: 11, color: '#6A4D00', lineHeight: 1.4, marginBottom: 16 }}>
                  Cuti 1 hari untuk {longWeekends[1]?.totalDays || 4} hari libur!
                </p>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#3A2900' }}>{longWeekends[1] ? formatLongWeekendRange(longWeekends[1]) : '-'}</p>
              </div>
            </div>
          </div>

          {/* Kalender Libur Nasional List - MOVED FROM MAIN */}
          <div>
            <h2 className="headline" style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Libur Nasional 2026</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcoming.map(h => {
                const dateObj = new Date(h.date);
                const monthStr = dateObj.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
                const dayNum = dateObj.getDate().toString().padStart(2, '0');
                
                return (
                  <div key={h.id} style={{ background: 'var(--surface-container)', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} className="hover-surface-low">
                    <div style={{ background: '#fff', width: 44, height: 44, borderRadius: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <span style={{ fontSize: 8, fontWeight: 800, color: 'var(--primary-container)' }}>{monthStr}</span>
                       <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1 }}>{dayNum}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                       <p className="headline" style={{ fontSize: 13, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</p>
                       <p style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>{dateObj.toLocaleDateString('id-ID', { weekday: 'short' })}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Weather Widget */}
          <div style={{ background: 'var(--surface-container)', padding: 24, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 36 }}>☀️</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 2 }}>Cuaca Cerah di Jakarta</p>
              <p style={{ fontSize: 11, color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>Hari yang bagus untuk pesan tiket!</p>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .hover-surface-low:hover {
          background: var(--surface-container-high) !important;
        }
        .hover-scale { transition: transform 0.2s; }
        .hover-scale:hover { transform: translateY(-4px); }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        @media (max-width: 1024px) {
           .hidden-mobile { display: none !important; }
           /* If we need grid to stack */
           .lw-grid { grid-template-columns: 1fr !important; }
           .page > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
