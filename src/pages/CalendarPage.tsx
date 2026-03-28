import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUpcomingHolidays, getNextLongWeekend } from '../utils/dateUtils';
import { getRecommendations, formatCurrency } from '../services/api';
import type { RecommendationResult } from '../services/api';
import type { Holiday, LongWeekend } from '../data/holidays2026';
import { HOLIDAYS_2026 } from '../data/holidays2026';

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function CalendarPage() {
  const navigate = useNavigate();
  const today = new Date();

  const [upcoming, setUpcoming] = useState<Holiday[]>([]);
  const [nearestLW, setNearestLW] = useState<LongWeekend | null>(null);
  const [topDest, setTopDest] = useState<RecommendationResult | null>(null);
  const [selectedDest, setSelectedDest] = useState<RecommendationResult | null>(null);

  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(2); // 0-indexed, 2 = Maret
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);

  useEffect(() => {
    setUpcoming(getUpcomingHolidays(3));
    setNearestLW(getNextLongWeekend());

    const budget = parseInt(localStorage.getItem('kapanlibur_budget') || '4500000');
    getRecommendations(budget)
      .then(results => { if (results.length > 0) setTopDest(results[0]); })
      .catch(() => {});
  }, []);

  // Calendar cells
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const cells: { day: number | ''; type: string }[] = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: '', type: 'empty' });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, type: 'normal' });
  while (cells.length % 7 !== 0) cells.push({ day: '', type: 'empty' });

  // Holiday dots in current month
  const holidayDaysInMonth = HOLIDAYS_2026
    .filter(h => {
      const d = new Date(h.date + 'T00:00:00');
      return d.getFullYear() === calYear && d.getMonth() === calMonth;
    })
    .map(h => new Date(h.date + 'T00:00:00').getDate());

  function prevMonth() {
    const d = new Date(calYear, calMonth - 1, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
    setHighlightedDates([]);
  }

  function nextMonth() {
    const d = new Date(calYear, calMonth + 1, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
    setHighlightedDates([]);
  }

  function handleLWClick() {
    if (!nearestLW) return;
    const start = new Date(nearestLW.startDate + 'T00:00:00');
    const end = new Date(nearestLW.endDate + 'T00:00:00');
    setCalYear(start.getFullYear());
    setCalMonth(start.getMonth());

    const dates: string[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }
    setHighlightedDates(dates);
    document.getElementById('calendar-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="page page-container" style={{ maxWidth: '1440px', margin: '0 auto', paddingRight: 'var(--spacing-12)' }}>

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, marginTop: 'var(--spacing-6)', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="headline" style={{ fontSize: 64, fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {MONTHS_ID[calMonth]}<span style={{ color: 'var(--on-surface-variant)', opacity: 0.5 }}>{calYear}</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--on-surface-variant)', marginTop: 10 }}>Strategic planning for your next Indonesian escape.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={prevMonth} style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', background: 'var(--surface-container-low)', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <button onClick={nextMonth} style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', background: 'var(--surface-container-low)', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
          <div style={{ display: 'flex', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-full)', padding: 6 }}>
            <button style={{ background: 'var(--surface-container-lowest)', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 24px', fontSize: 14, fontWeight: 800, color: 'var(--primary)', boxShadow: 'var(--shadow-ambient)', cursor: 'pointer' }}>Monthly</button>
            <button style={{ background: 'transparent', border: 'none', padding: '10px 24px', fontSize: 14, fontWeight: 700, color: 'var(--on-surface-variant)', cursor: 'pointer' }}>Yearly</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 40, alignItems: 'start' }}>

        {/* === LEFT: CALENDAR + RECOMMENDED TRIP === */}
        <div id="calendar-grid" style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 32 }}>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 12 }}>
            {['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map(d => (
              <div key={d} style={{ fontSize: 11, fontWeight: 800, color: 'var(--on-surface-variant)', letterSpacing: 1.5, opacity: 0.5, padding: '6px 0' }}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, marginBottom: 28 }}>
            {cells.map((cell, idx) => {
              if (!cell.day) return <div key={idx} style={{ height: 60 }} />;

              const isSunday = idx % 7 === 0;
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
              const isHighlighted = highlightedDates.includes(dateStr);
              const isHoliday = holidayDaysInMonth.includes(cell.day as number);
              const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === cell.day;

              let bg = 'var(--surface-container-lowest)';
              let numColor = isSunday ? 'var(--primary)' : 'var(--on-surface)';
              if (isHighlighted) { bg = 'var(--primary)'; numColor = '#fff'; }
              else if (isHoliday) { bg = 'rgba(158,0,31,0.09)'; numColor = 'var(--primary)'; }
              else if (isToday) { bg = 'var(--surface-container-high)'; }

              return (
                <div key={idx} style={{
                  height: 60,
                  borderRadius: 'var(--radius-default)',
                  padding: '8px 6px',
                  background: bg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: !isHighlighted && !isHoliday ? 'var(--shadow-ambient)' : 'none',
                  transition: 'transform 0.15s ease',
                  cursor: 'default'
                }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: numColor, lineHeight: 1 }}>{cell.day}</span>
                  {isHighlighted && (
                    <span style={{ marginTop: 5, color: 'rgba(255,255,255,0.85)', fontSize: 7, fontWeight: 900, letterSpacing: 0.5 }}>LW</span>
                  )}
                  {isHoliday && !isHighlighted && (
                    <div style={{ marginTop: 5, width: 4, height: 4, borderRadius: 2, background: 'var(--primary)' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Recommended Trip Card */}
          <div
            style={{ background: 'var(--surface-container-lowest)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-ambient)', cursor: topDest ? 'pointer' : 'default' }}
            onClick={() => topDest && setSelectedDest(topDest)}
            className={topDest ? 'hover-scale' : ''}
          >
            {topDest ? (
              <>
                <div className="asymmetric-image" style={{ height: 160, position: 'relative' }}>
                  <img src={topDest.image} alt={topDest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,28,25,0.75), transparent)' }} />
                  <span style={{ position: 'absolute', top: 14, left: 16, background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 900, padding: '5px 12px', borderRadius: 'var(--radius-full)', letterSpacing: 1 }}>
                    {topDest.matchScore}% MATCH
                  </span>
                  <div style={{ position: 'absolute', bottom: 14, left: 20 }}>
                    <h3 className="headline" style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{topDest.name}</h3>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{topDest.location}</p>
                  </div>
                </div>
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--on-surface-variant)', letterSpacing: 1.5, marginBottom: 3, textTransform: 'uppercase' }}>Est. Total Biaya</p>
                    <p className="headline" style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)' }}>{formatCurrency(topDest.estTotalCost)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--primary)', fontWeight: 800, fontSize: 13 }}>
                    Lihat Itinerary
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: 28 }}>
                <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>Recommended Trip</p>
                <h2 className="headline" style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Ubud, Bali 🌴</h2>
                <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: 16 }}>
                  Experience the spiritual silence of Nyepi in the heart of Bali.
                </p>
                <button onClick={() => navigate('/inspiration')} style={{ background: 'transparent', color: 'var(--primary)', fontSize: 13, fontWeight: 800, border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Lihat Itinerary <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* === RIGHT: EVENTS + LW ALERT === */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* Upcoming Events */}
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              Upcoming Events 📅
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {upcoming.map(h => {
                const dateObj = new Date(h.date + 'T00:00:00');
                const dayStr = dateObj.getDate();
                const monthStr = dateObj.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
                const isPaid = h.type.includes('cuti_bersama');
                const badgeStyle = isPaid
                  ? { background: 'var(--secondary-container)', color: 'var(--on-secondary-container)' }
                  : { background: 'var(--primary)', color: '#fff' };
                return (
                  <div key={h.id} style={{ background: 'var(--surface-container-lowest)', borderRadius: 'var(--radius-md)', padding: 20, boxShadow: 'var(--shadow-ambient)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ ...badgeStyle, fontSize: 9, fontWeight: 800, padding: '5px 12px', borderRadius: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                        {isPaid ? 'Cuti Bersama' : 'Nasional'}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--on-surface)' }}>{dayStr} {monthStr}</span>
                    </div>
                    <h4 className="headline" style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{h.name} {h.emoji}</h4>
                    <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
                      {isPaid ? 'Cuti Bersama — tandai di kalendermu!' : 'Hari Libur Nasional Indonesia.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Long Weekend Alert */}
          {nearestLW && (
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                Long Weekend Alert 🚀
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div
                  onClick={handleLWClick}
                  style={{ position: 'relative', height: 200, borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-ambient)', cursor: 'pointer' }}
                  className="hover-scale asymmetric-image"
                >
                  <img src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80" alt="Long Weekend" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,28,25,0.88) 0%, rgba(28,28,25,0.35) 100%)' }} />
                  <div style={{ position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--tertiary-container)', fontSize: 10, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>
                      🔥 TANDAI DI KALENDER
                    </span>
                    <h4 className="headline" style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 10 }}>{nearestLW.label}</h4>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                      {Array.from({ length: Math.min(nearestLW.totalDays, 5) }).map((_, i) => {
                        const d = new Date(nearestLW.startDate + 'T00:00:00');
                        d.setDate(d.getDate() + i);
                        const dayName = d.toLocaleString('id-ID', { weekday: 'short' }).slice(0, 2).toUpperCase();
                        const isRed = nearestLW.holidays.some(h => h.date === d.toISOString().split('T')[0]) || d.getDay() === 0;
                        return (
                          <span key={i} style={{ background: isRed ? 'var(--primary)' : 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 10, fontWeight: 900, width: 30, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                            {dayName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'var(--tertiary-fixed)', borderRadius: 'var(--radius-md)', padding: 20, display: 'flex', gap: 16 }}>
                  <span style={{ fontSize: 28 }}>⚠️</span>
                  <div>
                    <h4 style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--on-tertiary-fixed)', marginBottom: 6 }}>Booking Alert</h4>
                    <p style={{ fontSize: 13, color: 'var(--on-tertiary-fixed)', lineHeight: 1.6, opacity: 0.9 }}>
                      Harga tiket diprediksi melonjak menjelang liburan ini. Amankan rencana Anda hari ini!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Itinerary Detail Modal */}
      {selectedDest && (
        <div
          onClick={() => setSelectedDest(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(28,28,25,0.7)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--surface)', width: '100%', maxWidth: 720, maxHeight: '90vh', borderRadius: 'var(--radius-xl)', overflowY: 'auto', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', position: 'relative', display: 'flex', flexDirection: 'column' }}
          >
            <button
              onClick={() => setSelectedDest(null)}
              style={{ position: 'absolute', top: 24, right: 24, width: 48, height: 48, borderRadius: 24, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900 }}
            >✕</button>

            <div className="asymmetric-image" style={{ height: 300, width: '100%', position: 'relative', flexShrink: 0 }}>
              <img src={selectedDest.image} alt={selectedDest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--surface), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 28, left: 40, right: 40 }}>
                <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 6 }}>DESTINATION GUIDE</p>
                <h2 className="headline" style={{ fontSize: 44, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1, letterSpacing: -2 }}>{selectedDest.name}</h2>
                <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', marginTop: 8, fontWeight: 600 }}>{selectedDest.location}</p>
              </div>
            </div>

            <div style={{ padding: '0 40px 56px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'var(--surface-container-low)', padding: 24, borderRadius: 'var(--radius-lg)', marginBottom: 36 }}>
                <div style={{ fontSize: 32, background: 'var(--surface-container-highest)', width: 60, height: 60, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✨</div>
                <div>
                  <h3 className="headline" style={{ fontSize: 17, fontWeight: 900 }}>AI Smart Itinerary</h3>
                  <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 4, fontWeight: 700 }}>
                    Est. {formatCurrency(selectedDest.estTotalCost)}
                  </p>
                </div>
              </div>

              <div style={{ position: 'relative', paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 36 }}>
                <div style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: 2, background: 'var(--primary)', opacity: 0.1 }} />
                {selectedDest.itinerary.map((day, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -36, top: 6, width: 10, height: 10, borderRadius: 5, background: 'var(--primary)', boxShadow: '0 0 10px rgba(158,0,31,0.4)' }} />
                    <h4 style={{ fontSize: 11, fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>HARI {day.day}</h4>
                    <h5 className="headline" style={{ fontSize: 20, fontWeight: 900, marginBottom: 14 }}>{day.title}</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {day.activities.map((act, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface-container-low)', padding: 14, borderRadius: 'var(--radius-md)' }}>
                          <span style={{ fontSize: 18 }}>{i === 0 ? '🛫' : i === day.activities.length - 1 ? '🏨' : '📍'}</span>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 40 }}>
                <button
                  className="btn btn-primary btn-full shadow-lg"
                  style={{ padding: 20, fontSize: 16, fontWeight: 900, letterSpacing: 1 }}
                  onClick={() => setSelectedDest(null)}
                >
                  SIMPAN KE KALENDER 🗓️
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hover-scale { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover-scale:hover { transform: translateY(-4px); }
        .hover-scale:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}
