import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  getNextHoliday, getUpcomingHolidays, getNextLongWeekend,
  getDaysUntil, formatLongWeekendRange,
} from '../utils/dateUtils';
import type { Holiday, LongWeekend } from '../data/holidays2026';
import { getRecommendations, RecommendationResult, formatCurrency } from '../services/api';
import { isRemindersEnabled, enableReminders, disableReminders } from '../services/ReminderService';

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null);
  const [upcoming, setUpcoming] = useState<Holiday[]>([]);
  const [longWeekends, setLongWeekends] = useState<LongWeekend[]>([]);
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  
  const [inspirations, setInspirations] = useState<RecommendationResult[]>([]);
  const [remindersOn, setRemindersOn] = useState(isRemindersEnabled());
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

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

    const budget = window.localStorage.getItem('kapanlibur_budget') ? parseInt(window.localStorage.getItem('kapanlibur_budget') || '4500000') : 4500000;
    getRecommendations(budget).then(res => {
       setInspirations(res.slice(0, 4));
    });
  }, []);

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
        showToast('Pengingat aktif! Kamu akan diingatkan H-5 hingga H-1. 🔔');
      } else {
        showToast('Izin notifikasi ditolak. Aktifkan di pengaturan browser.');
      }
    }
  }

  function showToast(msg: string) {
    setReminderToast(msg);
    setTimeout(() => setReminderToast(null), 3500);
  }

  return (
    <div className="page page-container" style={{ maxWidth: '1440px', margin: '0 auto' }}>

      {/* Toast */}
      {reminderToast && (
        <div style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--on-surface)', color: '#fff', padding: '14px 28px',
          borderRadius: 'var(--radius-full)', fontSize: 14, fontWeight: 700,
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)', zIndex: 9000,
          animation: 'fadeIn 0.3s ease', whiteSpace: 'nowrap', maxWidth: '90vw',
          textAlign: 'center'
        }}>
          {reminderToast}
        </div>
      )}

      <header style={{ padding: 'var(--spacing-6) 0 var(--spacing-12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 className="headline" style={{ fontSize: 32, fontWeight: 900, color: 'var(--on-surface)' }}>Dashboard</h1>
        </div>
      </header>

      <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 'var(--spacing-12)', alignItems: 'start' }}>
        
        {/* === LEFT COLUMN === */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
          
          {/* Upcoming Holiday Hero Card */}
          {nextHoliday && (
            <div style={{ 
              background: 'var(--surface-container)', 
              borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-12)', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <span style={{
                  background: 'var(--primary-container)', color: '#fff', fontSize: 13, fontWeight: 800,
                  padding: '8px 20px', borderRadius: 'var(--radius-full)', letterSpacing: 1, textTransform: 'uppercase',
                  display: 'inline-block',
                }}>
                  Upcoming Holiday
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface-variant)', fontStyle: 'italic', maxWidth: 180, textAlign: 'right', lineHeight: 1.4, margin: 0 }}>
                    buat pengingat supaya ga kerja terus!
                  </p>
                  <button
                    onClick={handleReminderToggle}
                    disabled={reminderLoading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 20px', borderRadius: 'var(--radius-full)', border: 'none',
                      cursor: reminderLoading ? 'wait' : 'pointer',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 700, fontSize: 13,
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      background: '#2E7D32',
                      color: '#fff',
                      boxShadow: remindersOn ? '0 6px 24px rgba(46,125,50,0.40)' : '0 4px 16px rgba(46,125,50,0.28)',
                      opacity: reminderLoading ? 0.7 : 1,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {remindersOn ? 'notifications_active' : 'notifications'}
                    </span>
                    {reminderLoading ? 'Meminta izin...' : remindersOn ? 'Pengingat Aktif' : 'Pengingat'}
                  </button>
                </div>
              </div>
              
              <h2 className="headline" style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: 'var(--on-surface)', maxWidth: '60%' }}>
                {nextHoliday.shortName}
              </h2>
              
              <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', lineHeight: 1.6, maxWidth: '55%', marginBottom: 40 }}>
                Hanya tinggal <strong style={{ color: 'var(--primary)' }}>{daysUntil} hari lagi</strong> untuk bersiap libur dan berkumpul bersama keluarga.
              </p>
              
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ background: '#fff', width: 80, height: 80, borderRadius: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-ambient)' }}>
                  <span style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{daysUntil}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: 1 }}>DAYS</span>
                </div>
                <div style={{ background: '#fff', width: 80, height: 80, borderRadius: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-ambient)' }}>
                  <span style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>18</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: 1 }}>HOURS</span>
                </div>
                <div style={{ background: '#fff', width: 80, height: 80, borderRadius: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-ambient)' }}>
                  <span style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>45</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: 1 }}>MINS</span>
                </div>
              </div>

              <div style={{ 
                position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)',
                width: 180, height: 180, background: 'var(--primary-container)', borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, opacity: 0.1, pointerEvents: 'none'
              }}>
                <span dangerouslySetInnerHTML={{ __html: nextHoliday.emoji.length > 2 ? nextHoliday.emoji.substring(0, 2) : nextHoliday.emoji }}></span>
              </div>
            </div>
          )}

          {/* Inspirasi Liburan */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
               <h2 className="headline" style={{ fontSize: 24, fontWeight: 800 }}>Inspirasi Liburan ✨</h2>
               <span onClick={() => navigate('/inspiration')} style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', cursor: 'pointer' }}>Lihat Semua</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
              {inspirations.length === 0 ? (
                <>
                  <div style={{ height: 320, borderRadius: 'var(--radius-md)', background: 'var(--surface-container-high)', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: 320, borderRadius: 'var(--radius-md)', background: 'var(--surface-container-high)', animation: 'pulse 1.5s infinite' }} />
                </>
              ) : (
                inspirations.map((dest) => (
                  <div key={dest.id} onClick={() => navigate('/inspiration')} style={{ position: 'relative', cursor: 'pointer', height: 320 }} className="hover-scale asymmetric-image shadow-ambient">
                    <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,28,25,0.8), transparent)' }} />
                    
                    <button style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: 'none', width: 40, height: 40, borderRadius: 20, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>favorite</span>
                    </button>
                    
                    <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
                      <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', background: '#fff', padding: '4px 12px', borderRadius: 8, display: 'inline-block', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>⭐ Top Match</p>
                      <h3 className="headline" style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{dest.name}</h3>
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>Mulai dari {formatCurrency(dest.estTotalCost)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* === RIGHT COLUMN (Sidebar layout) === */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
          
          {/* Cek Tiket Pesawat Widget */}
          <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', border: 'none' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
               Cari Pesawat ✈️
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              <div style={{ background: 'var(--surface-container-lowest)', padding: '16px 20px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-ambient)' }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 4 }}>Dari</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--on-surface)' }}>Jakarta (CGK)</p>
              </div>
              <div style={{ background: 'var(--surface-container-lowest)', padding: '16px 20px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-ambient)' }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 4 }}>Ke</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--on-surface-variant)' }}>Cari destinasi...</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/booking')}
              className="btn btn-primary btn-full shadow-ambient"
            >
              Cek Tiket Sekarang
            </button>
          </div>

          {/* Long Weekend Alerts */}
          <div>
            <h2 className="headline" style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Long Weekend Alerts 🚀</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Card 1: Green */}
              <div style={{ background: 'var(--secondary-container)', padding: 24, borderRadius: 'var(--radius-md)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ color: 'var(--on-secondary-container)', fontSize: 12, fontWeight: 800 }}>🟢 AMAN</span>
                </div>
                <h3 className="headline" style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: 'var(--on-secondary-container)' }}>{longWeekends[0]?.label || 'Libur Panjang'}</h3>
                <p style={{ fontSize: 13, color: 'var(--on-secondary-container)', opacity: 0.8, lineHeight: 1.4, marginBottom: 20 }}>
                  {longWeekends[0]?.totalDays} Hari libur tanpa cuti tambahan.
                </p>
                <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--on-secondary-container)' }}>{longWeekends[0] ? formatLongWeekendRange(longWeekends[0]) : '-'}</p>
              </div>

              {/* Card 2: Yellow */}
              <div style={{ background: 'var(--tertiary-fixed)', padding: 24, borderRadius: 'var(--radius-md)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ color: 'var(--on-tertiary-fixed)', fontSize: 12, fontWeight: 800 }}>⚠️ PERTIMBANGAN</span>
                </div>
                <h3 className="headline" style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: 'var(--on-tertiary-fixed)' }}>{longWeekends[1]?.label || 'Cuti Kejepit'}</h3>
                <p style={{ fontSize: 13, color: 'var(--on-tertiary-fixed)', opacity: 0.8, lineHeight: 1.4, marginBottom: 20 }}>
                  Cuti 1 hari untuk menikmati {longWeekends[1]?.totalDays || 4} hari libur!
                </p>
                <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--on-tertiary-fixed)' }}>{longWeekends[1] ? formatLongWeekendRange(longWeekends[1]) : '-'}</p>
              </div>
            </div>
          </div>

          {/* Kalender Libur Nasional List */}
          <div>
            <h2 className="headline" style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Libur Nasional 2026</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcoming.map(h => {
                const dateObj = new Date(h.date);
                const monthStr = dateObj.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
                const dayNum = dateObj.getDate().toString().padStart(2, '0');
                
                return (
                  <div key={h.id} style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-default)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' }} className="hover-surface-low">
                    <div style={{ background: 'var(--surface-container-lowest)', width: 48, height: 48, borderRadius: 'var(--radius-default)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-ambient)' }}>
                       <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)' }}>{monthStr}</span>
                       <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1 }}>{dayNum}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                       <p className="headline" style={{ fontSize: 14, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</p>
                       <p style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{dateObj.toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .dashboard-layout {
           display: grid;
           grid-template-columns: 1fr 340px;
        }
        .hover-surface-low:hover {
          background: var(--surface-container-high) !important;
        }
        .hover-scale { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover-scale:hover { transform: translateY(-8px); }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        @media (max-width: 1024px) {
           .dashboard-layout {
              grid-template-columns: 1fr !important;
              gap: var(--spacing-12);
           }
        }
      `}</style>
    </div>
  );
}
