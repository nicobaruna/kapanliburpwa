import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { formatLongWeekendRange, getDaysUntil, formatShortDate, getUpcomingHolidays, getNextLongWeekend, getMonthName, toDateStr } from '../utils/dateUtils';
import { getRecommendations, RecommendationResult, TripStyle, formatCurrency } from '../services/api';
import type { Holiday, LongWeekend } from '../data/holidays2026';
import { HOLIDAYS_2026 } from '../data/holidays2026';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState<Holiday[]>([]);
  const [nearestLW, setNearestLW] = useState<LongWeekend | null>(null);
  const [topRec, setTopRec] = useState<RecommendationResult | null>(null);
  const [calYear, setCalYear] = useState<number>(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState<number>(new Date().getMonth());
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [cutiHighlight, setCutiHighlight] = useState<string[]>([]);

  useEffect(() => {
    setUpcoming(getUpcomingHolidays(3));
    setNearestLW(getNextLongWeekend());

    const budget = parseInt(localStorage.getItem('kapanlibur_budget') || '5000000');
    getRecommendations(budget).then(results => {
      if (results.length > 0) setTopRec(results[0]);
    }).catch(() => { });
  }, []);

  
const cells = useMemo(() => {
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay(); // 0 = Sunday
  const arr = [];
  // previous month filler
  for (let i = 0; i < firstDayIndex; i++) {
    arr.push({ day: '', type: 'empty' });
  }
  // current month
  for (let i = 1; i <= daysInMonth; i++) {
    arr.push({
      day: i,
      dateStr: `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
    });
  }
  while (arr.length % 7 !== 0) arr.push({ day: '', dateStr: '' });
  return arr;
}, [calYear, calMonth]);
  const holidayMap = new Map<string, Holiday>();
  HOLIDAYS_2026.forEach(h => holidayMap.set(h.date, h));

  const holidaysThisMonth = HOLIDAYS_2026.filter(h => {
    const d = new Date(h.date + 'T00:00:00');
    return d.getFullYear() === calYear && d.getMonth() === calMonth;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const cutiRecs = useMemo(() => computeCutiRecs(calYear, calMonth), [calYear, calMonth]);
  
  useEffect(() => {
    const allSuggested = cutiRecs.flatMap(r => r.cutiDates);
    const filtered = allSuggested.filter(d => {
      const date = new Date(d + 'T00:00:00');
      return date.getFullYear() === calYear && date.getMonth() === calMonth;
    });
    setCutiHighlight(filtered);
  }, [calYear, calMonth, cutiRecs]);

  function prevMonth() {
    const d = new Date(calYear, calMonth - 1, 1);
    setCalYear(d.getFullYear()); setCalMonth(d.getMonth());
    setHighlighted([]); setCutiHighlight([]);
  }
  function nextMonth() {
    const d = new Date(calYear, calMonth + 1, 1);
    setCalYear(d.getFullYear()); setCalMonth(d.getMonth());
    setHighlighted([]); setCutiHighlight([]);
  }

  function handleLWClick(lw: LongWeekend) {
    const start = new Date(lw.startDate + 'T00:00:00');
    setCalYear(start.getFullYear()); setCalMonth(start.getMonth());
    const dates: string[] = [];
    const cur = new Date(start);
    const end = new Date(lw.endDate + 'T00:00:00');
    while (cur <= end) { dates.push(toDateStr(cur)); cur.setDate(cur.getDate() + 1); }
    setHighlighted(dates); setCutiHighlight([]);
    setTimeout(() => document.getElementById('calendar-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  function handleCutiClick(rec: CutiRec) {
    const start = new Date(rec.startDate + 'T00:00:00');
    setCalYear(start.getFullYear()); setCalMonth(start.getMonth());
    const dates: string[] = [];
    const cur = new Date(start);
    const end = new Date(rec.endDate + 'T00:00:00');
    while (cur <= end) { dates.push(toDateStr(cur)); cur.setDate(cur.getDate() + 1); }
    setHighlighted(dates);
    setCutiHighlight(rec.cutiDates);
    setTimeout(() => document.getElementById('calendar-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  function goToHoliday(h: Holiday) {
    const d = new Date(h.date + 'T00:00:00');
    setCalYear(d.getFullYear()); setCalMonth(d.getMonth());
    setHighlighted([h.date]); setCutiHighlight([]);
    setTimeout(() => document.getElementById('calendar-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  // ── Render ──
  return (
    <>
      <div className="page" style={{ padding: '0 32px 100px', maxWidth: '1440px', margin: '0 auto' }}>

        {/* Header section (Mockup showed Dashboard header with Calendar tab active) */}
        <header style={{ padding: '24px 0 32px', display: 'none' }}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <h1 className="headline" style={{ fontSize: 24, fontWeight: 900, color: 'var(--on-surface)' }}>Dashboard</h1>
            <div className="hidden-mobile" style={{ display: 'flex', gap: 24, paddingLeft: 16 }}>
              <span style={{ color: 'var(--primary-container)', fontWeight: 700, borderBottom: '2px solid', paddingBottom: 4, cursor: 'pointer' }}>Calendar</span>
              <span style={{ color: 'var(--on-surface-variant)', fontWeight: 600, cursor: 'pointer' }}>Budget</span>
              <span style={{ color: 'var(--on-surface-variant)', fontWeight: 600, cursor: 'pointer' }}>Destinations</span>
              <span style={{ color: 'var(--on-surface-variant)', fontWeight: 600, cursor: 'pointer' }}>Promos</span>
            </div>
          </div>
        </header>

        {/* Title Area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, marginTop: 24 }}>
          <div>
            <h1 className="headline" style={{ fontSize: 48, fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {getMonthName(calMonth)} <span style={{ color: 'var(--on-surface-variant)' }}>{calYear}</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', marginTop: 8 }}>Strategic planning for your next Indonesian escape.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={prevMonth} style={{ background: '#fff', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: 13, fontWeight: 800, color: 'var(--primary-container)', cursor: 'pointer' }}>&lt; Prev</button>
            <button onClick={nextMonth} style={{ background: '#fff', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: 13, fontWeight: 800, color: 'var(--primary-container)', cursor: 'pointer' }}>Next &gt;</button>
          </div>
          <div style={{ display: 'flex', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-full)', padding: 4, border: '1px solid var(--outline-variant)' }}>
            <button style={{ background: '#fff', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-full)', padding: '8px 24px', fontSize: 13, fontWeight: 800, color: 'var(--primary-container)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }}>Monthly</button>
            <button style={{ background: 'transparent', border: 'none', padding: '8px 24px', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', cursor: 'pointer' }}>Yearly</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 32, alignItems: 'start' }}>

          {/* === LEFT COLUMN: CALENDAR GRID === */}
          <div style={{ background: 'var(--surface-container-lowest)', borderRadius: 32, padding: '32px 32px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid #EAE5E0' }}>

            {/* Days Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 16 }}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} style={{ fontSize: 11, fontWeight: 800, color: 'var(--on-surface-variant)', letterSpacing: 1.5 }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Grid Constraints */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid var(--outline-variant)', borderLeft: '1px solid var(--outline-variant)', borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
              {cells.map((cell, idx) => {
        const isSunday = idx % 7 === 0;
        const isWeekend = idx % 7 === 0 || idx % 7 === 6;
        const isEmpty = cell.type === 'empty';
        // Custom Cell Highlights from mockup
        const isCell1 = cell.day === 1;
        const isCell13 = cell.day === 13; // Friday Getaway 
        const isCell20 = cell.day === 20; // Nyepi
        const isCell30 = cell.day === 30; // Idul Fitri
        const isCell31 = cell.day === 31; // Idul Fitri
        const isHighlighted = isCell13 || isCell20 || isCell30 || isCell31;
        // Holiday and cuti detection
        const holiday = holidaysThisMonth.find(h => h.date === cell.dateStr);
        const isCutiHighlighted = cutiHighlight.includes(cell.dateStr);
        const background = isEmpty
          ? 'var(--surface-container-low)'
          : isHighlighted
            ? 'rgba(255,255,255,0.5)'
            : isCutiHighlighted
              ? 'rgba(0,128,255,0.3)'
              : holiday
                ? 'rgba(255,230,0,0.3)'
                : '#fff';
        return (
          <div key={idx} style={{
            height: 90,
            borderRight: '1px solid var(--outline-variant)',
            borderBottom: '1px solid var(--outline-variant)',
            padding: 12,
            background: background,
            position: 'relative',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            {/* Day Number */}
            {!isEmpty && (
              <span style={{
                fontSize: 14, fontWeight: 800,
                color: isSunday ? 'var(--primary-container)' : 'var(--on-surface)',
                alignSelf: 'flex-start'
              }}>{cell.day}</span>
            )}
            {/* Holiday badge */}
            {holiday && (
              <div style={{
                marginTop: 'auto',
                background: 'var(--primary)',
                color: '#fff',
                fontSize: 9,
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: 6,
                letterSpacing: 0.5
              }}>{holiday.name}</div>
            )}
            {/* Mockup specific pills */}
            {isCell1 && (
              <div style={{ marginTop: 'auto', background: 'var(--secondary-container)', color: 'var(--primary-container)', fontSize: 8, fontWeight: 800, padding: '4px 20px', borderRadius: 12, border: '1px solid rgba(158,0,31,0.1)', letterSpacing: 0.5 }}>
                MINGGU
              </div>
            )}
            {isCell13 && (
              <div style={{ marginTop: 'auto', width: '100%', height: 4, background: '#97E4A8', borderRadius: 2 }} />
            )}
            {isCell20 && (
              <div style={{ marginTop: 'auto', width: '100%', height: 4, background: 'var(--primary)', borderRadius: 2 }} />
            )}
            {(isCell30 || isCell31) && (
              <div style={{ marginTop: 'auto', width: '100%', height: 4, background: 'var(--primary)', borderRadius: 2 }} />
            )}
          </div>
        );
      })}
      {/* CutI recommendations list */}
      <div style={{ marginTop: 24 }}>
        {cutiRecs.map((rec, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, border: '1px solid var(--outline-variant)' }}>
            <strong>{formatShortDate(rec.startDate)} – {formatShortDate(rec.endDate)}</strong>
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--on-surface-variant)' }}>
              {rec.cutiDates.map(d => (
                <span key={d} style={{ marginRight: 4 }}>{toDateStr(new Date(d + 'T00:00:00'))}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
            </div>

            {/* Bottom Cards inside Gray Container */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }}>

              {/* Leave Balance Card */}
              <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-ambient)', border: '1px solid var(--outline-variant)' }}>
                <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: 'var(--on-surface-variant)', marginBottom: 8 }}>LEAVE BALANCE</p>
                <h2 className="headline" style={{ fontSize: 36, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1, marginBottom: 24 }}>
                  14 Days <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--on-surface-variant)' }}>Remaining</span>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <div style={{ width: '100%', height: 6, background: 'var(--surface-container-high)', borderRadius: 3, marginBottom: 8, overflow: 'hidden' }}>
                      <div style={{ width: '66%', height: '100%', background: 'var(--primary-container)' }} />
                    </div>
                    <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--on-surface-variant)' }}>PAID LEAVE (8/12)</p>
                  </div>
                  <div>
                    <div style={{ width: '100%', height: 6, background: 'var(--surface-container-high)', borderRadius: 3, marginBottom: 8, overflow: 'hidden' }}>
                      <div style={{ width: '20%', height: '100%', background: '#4CAF50' }} />
                    </div>
                    <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--on-surface-variant)' }}>SICK LEAVE (2/10)</p>
                  </div>
                </div>
              </div>

              {/* Recommended Trip Card */}
              <div
                onClick={() => topRec && navigate(`/inspiration/${topRec.id}`)}
                style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-ambient)', border: '1px solid var(--outline-variant)', display: 'flex', flexDirection: 'column', cursor: topRec ? 'pointer' : 'default', transition: 'transform 0.2s' }}
                onMouseEnter={e => { if (topRec) e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {topRec?.image && (
                  <div style={{ position: 'relative', height: 100, flexShrink: 0 }}>
                    <img src={topRec.image} alt={topRec.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }} />
                    {topRec.dynamicTags[0] && (
                      <span style={{
                        position: 'absolute', top: 10, left: 12,
                        background: topRec.dynamicTags[0].type === 'danger' ? 'var(--primary-container)' : topRec.dynamicTags[0].type === 'success' ? '#97E4A8' : 'rgba(255,255,255,0.9)',
                        color: topRec.dynamicTags[0].type === 'danger' ? '#fff' : topRec.dynamicTags[0].type === 'success' ? '#0F5120' : 'var(--primary-container)',
                        fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6, letterSpacing: 0.5,
                      }}>
                        {topRec.dynamicTags[0].label}
                      </span>
                    )}
                  </div>
                )}

                <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: 'var(--primary-container)', marginBottom: 4 }}>
                    ⭐ RECOMMENDED TRIP
                  </p>
                  {topRec ? (
                    <>
                      <h2 className="headline" style={{ fontSize: 20, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1.2, marginBottom: 4 }}>
                        {topRec.name}
                      </h2>
                      <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>location_on</span>
                        {topRec.location}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.5, marginBottom: 12 }}>
                        {topRec.itinerary[0]?.activities[0] ?? 'Liburan impian menanti!'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div>
                          <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Estimasi</p>
                          <p style={{ fontSize: 15, fontWeight: 900, color: 'var(--primary-container)' }}>{formatCurrency(topRec.estTotalCost)}</p>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/inspiration/${topRec.id}`); }}
                          style={{ background: 'var(--primary-container)', color: '#fff', fontSize: 11, fontWeight: 800, border: 'none', padding: '8px 14px', borderRadius: 10, cursor: 'pointer' }}
                        >
                          Lihat Itinerary ➔
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 8, color: 'var(--on-surface-variant)' }}>
                      <div style={{ width: 16, height: 16, border: '2px solid var(--outline-variant)', borderTop: '2px solid var(--primary-container)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      <span style={{ fontSize: 12 }}>Memuat rekomendasi...</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>


          {/* === RIGHT COLUMN: DETAILED DATES & ALERTS === */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

            {/* Detailed Dates */}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: 20 }}>table_rows</span> Detailed Dates
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {holidaysThisMonth.map(h => {
                  const dateObj = new Date(h.date);
                  const dayStr = dateObj.getDate();
                  const monthStr = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();

                  const isPaidLeave = h.type.includes('cuti_bersama');
                  const badgeText = isPaidLeave ? 'PAID LEAVE' : 'NATIONAL';
                  const badgeStyle = isPaidLeave ? { background: '#EAF8ED', color: '#0F5120' } : { background: 'var(--primary)', color: '#fff' };
                  const borderStyle = isPaidLeave ? '1px solid #C4F1CF' : '1px solid var(--outline-variant)';

                  return (
                    <div key={h.id} style={{ background: '#fff', border: borderStyle, borderRadius: 20, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <span style={{ ...badgeStyle, fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 8, letterSpacing: 1 }}>{badgeText}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--on-surface)' }}>{dayStr} {monthStr}</span>
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{h.name} {h.emoji}</h4>
                      <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
                        {h.type.includes('cuti_bersama') ? 'Cuti Bersama' : 'Libur Nasional'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Long Weekend Alerts */}
            {nearestLW && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: 20 }}>flash_on</span> Long Weekend Alert
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Rich Alert Card */}
                  <div
                    onClick={() => navigate('/inspiration')}
                    style={{ position: 'relative', height: 180, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80" alt="Destination" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%)' }} />

                    <div style={{ position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#FADB5F', fontSize: 9, fontWeight: 800, letterSpacing: 1.5, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        🔥 HIGH IMPACT PLAN
                      </span>
                      <h4 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{nearestLW.label}</h4>
                      <p style={{ fontSize: 12, color: '#ddd', lineHeight: 1.5 }}>
                        Nikmati {nearestLW.totalDays} hari libur berturut-turut! Siapkan tiket Anda dari sekarang.
                      </p>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                        {Array.from({ length: Math.min(nearestLW.totalDays, 5) }).map((_, i) => {
                          const d = new Date(nearestLW.startDate);
                          d.setDate(d.getDate() + i);
                          const dayName = d.toLocaleString('en-US', { weekday: 'short' });
                          // Warnai merah if explicit holiday or Sunday
                          const isExplicitHoliday = nearestLW.holidays.some(h => h.date === d.toISOString().split('T')[0]);
                          const isSunday = d.getDay() === 0;
                          const isRed = isExplicitHoliday || isSunday;

                          return (
                            <span key={i} style={{ background: isRed ? 'var(--primary-container)' : '#fff', color: isRed ? '#fff' : 'var(--on-surface)', fontSize: 10, fontWeight: 800, width: 28, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {dayName}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Warning Alert */}
                  <div style={{ background: '#FDE49B', borderRadius: 20, padding: 20, display: 'flex', gap: 16 }}>
                    <span className="material-symbols-outlined" style={{ color: '#6A4D00' }}>warning</span>
                    <div>
                      <h4 style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#6A4D00', marginBottom: 4 }}>Booking Alert</h4>
                      <p style={{ fontSize: 13, color: '#4F3906', lineHeight: 1.5 }}>
                        Harga tiket untuk keberangkatan {new Date(nearestLW.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} diprediksi naik. Booking sekarang!
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}



// Type for cuti recommendation
interface CutiRec {
  startDate: string;
  endDate: string;
  cutiDates: string[]; // list of date strings for the cuti period
}

// Compute cuti recommendations for the given month/year based on cuti_bersama holidays
function computeCutiRecs(year: number, month: number): CutiRec[] {
  // Filter holidays that are 'cuti_bersama' within the month
  const cutiHolidays = HOLIDAYS_2026.filter(h =>
    h.type.includes('cuti_bersama') &&
    new Date(h.date + 'T00:00:00').getFullYear() === year &&
    new Date(h.date + 'T00:00:00').getMonth() === month
  );

  // Group consecutive dates into a single record
  const sorted = cutiHolidays.map(h => h.date).sort();
  const recs: CutiRec[] = [];
  let current: string[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      current.push(sorted[i]);
    } else {
      const prev = new Date(sorted[i - 1] + 'T00:00:00');
      const cur = new Date(sorted[i] + 'T00:00:00');
      const diff = (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current.push(sorted[i]);
      } else {
        recs.push({
          startDate: current[0],
          endDate: current[current.length - 1],
          cutiDates: [...current],
        });
        current = [sorted[i]];
      }
    }
  }
  if (current.length) {
    recs.push({
      startDate: current[0],
      endDate: current[current.length - 1],
      cutiDates: [...current],
    });
  }
  return recs;
}
