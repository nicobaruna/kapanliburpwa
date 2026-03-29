import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { formatLongWeekendRange, getDaysUntil, formatShortDate } from '../utils/dateUtils';
import { getRecommendations, RecommendationResult, TripStyle, formatCurrency } from '../services/api';
import type { Holiday, LongWeekend } from '../data/holidays2026';
import { HOLIDAYS_2026, LONG_WEEKENDS_2026, getAllNonWorkingDates } from '../data/holidays2026';

const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'];

/** Timezone-safe: formats a Date as YYYY-MM-DD using LOCAL calendar date (not UTC). */
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── Cuti recommendation engine ────────────────────────────────────────────────
type CutiRec = {
  cutiDates: string[];
  label: string;
  totalDays: number;
  startDate: string;
  endDate: string;
  holidayName: string;
};

function computeCutiRecs(year: number, month: number): CutiRec[] {
  const nonWorking = getAllNonWorkingDates(year);

  // For run-extension: only weekends + national holidays.
  // Excludes cuti_bersama of unrelated periods so they don't inflate the run count.
  const runExtSet = new Set<string>();
  for (let m = 0; m < 12; m++) {
    const dim = new Date(year, m + 1, 0).getDate();
    for (let d = 1; d <= dim; d++) {
      const dt = new Date(year, m, d);
      const dow = dt.getDay();
      if (dow === 0 || dow === 6) runExtSet.add(toDateStr(dt));
    }
  }
  HOLIDAYS_2026.forEach(h => {
    // Only include pure national holidays, not standalone cuti_bersama entries
    if (h.type.includes('nasional') && !h.type.includes('cuti_bersama')) runExtSet.add(h.date);
  });

  const monthHolidays = HOLIDAYS_2026.filter(h => {
    const d = new Date(h.date + 'T00:00:00');
    const dow = d.getDay();
    return d.getFullYear() === year && d.getMonth() === month &&
           h.type.includes('nasional') && dow !== 0 && dow !== 6;
  });

  const recs: CutiRec[] = [];

  function getRunBounds(allDates: string[]): { days: number; start: string; end: string } {
    const tempSet = new Set([...runExtSet, ...allDates]);
    const anchor = allDates[0];
    let cur = new Date(anchor + 'T00:00:00');
    while (tempSet.has(toDateStr(new Date(cur.getTime() - 86400000))))
      cur = new Date(cur.getTime() - 86400000);
    const start = toDateStr(cur);
    cur = new Date(anchor + 'T00:00:00');
    while (tempSet.has(toDateStr(new Date(cur.getTime() + 86400000))))
      cur = new Date(cur.getTime() + 86400000);
    const end = toDateStr(cur);
    const days = Math.round((new Date(end + 'T00:00:00').getTime() - new Date(start + 'T00:00:00').getTime()) / 86400000) + 1;
    return { days, start, end };
  }

  for (const holiday of monthHolidays) {
    const hDate = new Date(holiday.date + 'T00:00:00');
    const dow = hDate.getDay();
    const candidates: string[] = [];

    const addCandidate = (offset: number) => {
      const d = new Date(hDate.getTime() + offset * 86400000);
      const str = toDateStr(d);
      if (!nonWorking.has(str)) candidates.push(str);
    };

    if (dow === 2) addCandidate(-1); // Tue holiday → take Mon
    if (dow === 4) addCandidate(+1); // Thu holiday → take Fri
    if (dow === 3) { addCandidate(-1); addCandidate(+1); } // Wed holiday → take Tue+Thu
    if (dow === 1) addCandidate(+1); // Mon holiday → take Tue (bridge to next)
    if (dow === 5) addCandidate(-1); // Fri holiday → take Thu

    if (candidates.length === 0) continue;

    const run = getRunBounds([holiday.date, ...candidates]);
    if (run.days >= 4) {
      recs.push({
        cutiDates: candidates,
        label: `Cuti ${candidates.length} hari → ${run.days} hari libur berturut-turut`,
        totalDays: run.days,
        startDate: run.start,
        endDate: run.end,
        holidayName: holiday.shortName,
      });
    }
  }

  return recs;
}

function styleFromVacationStyle(s?: string): TripStyle {
  if (s === 'backpacker') return 'hemat';
  if (s === 'luxury') return 'luxury';
  return 'balance';
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const { user }    = useUser();
  const navigate    = useNavigate();
  const location    = useLocation();
  const today       = new Date();

  const [calYear, setCalYear]           = useState(2026);
  const [calMonth, setCalMonth]         = useState(2);
  const [highlightedDates, setHighlighted] = useState<string[]>([]);
  const [cutiHighlight, setCutiHighlight]  = useState<string[]>([]); // cuti suggestion dates
  const [selectedDest, setSelectedDest] = useState<RecommendationResult | null>(null);
  const [inspirations, setInspirations] = useState<RecommendationResult[]>([]);

  // Load personalised top-3 inspirations
  useEffect(() => {
    const budget = parseInt(localStorage.getItem('kapanlibur_budget') || '4500000');
    const style  = styleFromVacationStyle(user?.vacationStyle);
    getRecommendations(budget, 2, 3, style, user?.vacationType)
      .then(r => setInspirations(r.slice(0, 3)))
      .catch(() => {});
  }, [user?.vacationType, user?.vacationStyle]);

  // Handle targetDate from Dashboard navigation
  useEffect(() => {
    const targetDate = (location.state as { targetDate?: string } | null)?.targetDate;
    if (!targetDate) return;
    const d = new Date(targetDate + 'T00:00:00');
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
    setHighlighted([targetDate]);
    setCutiHighlight([]);
    setTimeout(() => document.getElementById('calendar-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  }, [location.state]);

  // ── Calendar grid data ──
  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const cells: { day: number | ''; dateStr: string }[] = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: '', dateStr: '' });
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      day: i,
      dateStr: `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
    });
  }
  while (cells.length % 7 !== 0) cells.push({ day: '', dateStr: '' });

  const holidayMap = new Map<string, Holiday>();
  HOLIDAYS_2026.forEach(h => holidayMap.set(h.date, h));

  const holidaysThisMonth = HOLIDAYS_2026.filter(h => {
    const d = new Date(h.date + 'T00:00:00');
    return d.getFullYear() === calYear && d.getMonth() === calMonth;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const cutiRecs = computeCutiRecs(calYear, calMonth);

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
    <div className="page page-container" style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: 80 }}>

      {/* Title bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, marginTop: 'var(--spacing-6)', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="headline" style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {MONTHS_ID[calMonth]}<span style={{ color: 'var(--on-surface-variant)', opacity: 0.4 }}>{calYear}</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', marginTop: 8 }}>
            {holidaysThisMonth.length > 0
              ? `${holidaysThisMonth.length} hari libur bulan ini · ${cutiRecs.length} rekomendasi cuti`
              : 'Tidak ada hari libur bulan ini'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={prevMonth} style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', background: 'var(--surface-container-low)', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <button onClick={nextMonth} style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', background: 'var(--surface-container-low)', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
        </div>
      </div>

      <div className="cal-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 40, alignItems: 'start' }}>

        {/* ════ LEFT COLUMN ════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Calendar grid */}
          <div id="calendar-grid" style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
            {/* Day labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: 12 }}>
              {['MIN','SEN','SEL','RAB','KAM','JUM','SAB'].map(d => (
                <div key={d} style={{ fontSize: 11, fontWeight: 800, color: 'var(--on-surface-variant)', letterSpacing: 1.5, opacity: 0.5, padding: '6px 0' }}>{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
              {cells.map((cell, idx) => {
                if (!cell.day) return <div key={idx} style={{ height: 60 }} />;
                const isSun       = idx % 7 === 0;
                const isHighlight = highlightedDates.includes(cell.dateStr);
                const isCuti      = cutiHighlight.includes(cell.dateStr);
                const holiday     = holidayMap.get(cell.dateStr);
                const isHoliday   = !!holiday;
                const isToday     = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === cell.day;
                const isCutiBersama = holiday?.type.includes('cuti_bersama') ?? false;

                let bg = 'var(--surface-container-lowest)';
                let numColor = isSun ? 'var(--primary)' : 'var(--on-surface)';
                let cellLabel: string | null = null;

                if (isCuti) {
                  // Cuti tahunan — always blue, even inside a highlighted range
                  bg = 'rgba(25,118,210,0.13)'; numColor = '#1264b0'; cellLabel = 'CUTI';
                } else if (isHighlight && isCutiBersama) {
                  // Cuti bersama inside a highlighted LW range — keep green identity
                  bg = '#1b6d24'; numColor = '#fff'; cellLabel = 'CB';
                } else if (isHighlight) {
                  // National holiday or regular weekend inside highlighted range — red
                  bg = 'var(--primary)'; numColor = '#fff'; cellLabel = isHoliday ? 'LN' : null;
                } else if (isHoliday && isCutiBersama) {
                  bg = 'rgba(27,109,36,0.13)'; numColor = '#1b6d24'; cellLabel = 'CB';
                } else if (isHoliday) {
                  bg = 'rgba(158,0,31,0.11)'; numColor = 'var(--primary)'; cellLabel = 'LN';
                } else if (isToday) {
                  bg = 'var(--surface-container-high)';
                }

                return (
                  <div
                    key={idx}
                    title={holiday ? holiday.name : undefined}
                    style={{ height: 60, borderRadius: 'var(--radius-default)', padding: '8px 6px', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: !isHighlight && !isHoliday && !isCuti ? 'var(--shadow-ambient)' : 'none', cursor: isHoliday ? 'pointer' : 'default', transition: 'transform 0.15s ease' }}
                    onClick={() => holiday && goToHoliday(holiday)}
                    className={isHoliday ? 'hover-scale' : ''}
                  >
                    <span style={{ fontSize: 13, fontWeight: 900, color: numColor, lineHeight: 1 }}>{cell.day}</span>
                    {cellLabel && !isHighlight && (
                      <span style={{ fontSize: 7, fontWeight: 900, color: numColor, marginTop: 3, letterSpacing: 0.3 }}>{cellLabel}</span>
                    )}
                    {isHighlight && !isCuti && (
                      <span style={{ marginTop: 4, color: 'rgba(255,255,255,0.8)', fontSize: 7, fontWeight: 900 }}>
                        {holiday?.emoji ?? 'LW'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
              {[
                { bg: 'rgba(158,0,31,0.11)', color: 'var(--primary)',  label: 'Libur Nasional', tag: 'LN' },
                { bg: 'rgba(27,109,36,0.13)',  color: '#1b6d24',       label: 'Cuti Bersama',   tag: 'CB' },
                { bg: 'rgba(25,118,210,0.13)', color: '#1264b0',       label: 'Cuti Tahunan',   tag: 'CUTI' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{
                    width: 28, height: 18, borderRadius: 4,
                    background: l.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 6, fontWeight: 900, color: l.color, letterSpacing: 0.2 }}>{l.tag}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontWeight: 600 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Holiday legend for current month ── */}
          {holidaysThisMonth.length > 0 && (
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
              <h3 className="headline" style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
                Hari Libur {MONTHS_ID[calMonth]} {calYear}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {holidaysThisMonth.map(h => {
                  const d = new Date(h.date + 'T00:00:00');
                  const isCutiBersama = h.type.includes('cuti_bersama');
                  const isPast = getDaysUntil(h.date) < 0;
                  return (
                    <div
                      key={h.id}
                      onClick={() => goToHoliday(h)}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 'var(--radius-default)', background: 'var(--surface-container-lowest)', cursor: 'pointer', opacity: isPast ? 0.5 : 1, transition: 'all 0.2s ease', boxShadow: 'var(--shadow-ambient)' }}
                      className="hover-surface-low"
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-default)', background: isCutiBersama ? 'rgba(27,109,36,0.1)' : 'rgba(158,0,31,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: isCutiBersama ? 'var(--secondary)' : 'var(--primary)' }}>
                          {d.getDate()} {MONTHS_ID[d.getMonth()].slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="headline" style={{ fontSize: 14, fontWeight: 800, marginBottom: 3, color: 'var(--on-surface)' }}>{h.name} {h.emoji}</p>
                        <p style={{ fontSize: 11, color: isCutiBersama ? 'var(--secondary)' : 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {isCutiBersama ? 'Cuti Bersama' : 'Libur Nasional'}
                        </p>
                      </div>
                      {getDaysUntil(h.date) >= 0 && (
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--on-surface-variant)', whiteSpace: 'nowrap' }}>
                          {getDaysUntil(h.date) === 0 ? 'Hari ini 🎉' : `${getDaysUntil(h.date)} hari lagi`}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Cuti recommendations ── */}
          {cutiRecs.length > 0 && (
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <h3 className="headline" style={{ fontSize: 18, fontWeight: 800 }}>💡 Rekomendasi Cuti</h3>
                <span style={{ background: 'var(--primary-container)', color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>{cutiRecs.length} tips</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {cutiRecs.map((rec, i) => (
                  <div
                    key={i}
                    onClick={() => handleCutiClick(rec)}
                    style={{ background: 'var(--surface-container-lowest)', borderRadius: 'var(--radius-md)', padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: 'var(--shadow-ambient)' }}
                    className="hover-scale"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                          {rec.holidayName}
                        </p>
                        <p className="headline" style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{rec.label}</p>
                        <p style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>
                          {formatShortDate(rec.startDate)} – {formatShortDate(rec.endDate)}
                        </p>
                      </div>
                      <div style={{ textAlign: 'center', background: 'var(--secondary-container)', borderRadius: 'var(--radius-md)', padding: '10px 14px', flexShrink: 0 }}>
                        <p style={{ fontSize: 24, fontWeight: 900, lineHeight: 1, color: 'var(--on-secondary-container)' }}>{rec.totalDays}</p>
                        <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--on-secondary-container)', letterSpacing: 1 }}>HARI</p>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {rec.cutiDates.map(cd => (
                        <span key={cd} style={{ background: 'var(--secondary-container)', color: 'var(--on-secondary-container)', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                          Cuti {formatShortDate(cd)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Semua Libur Nasional & Cuti Bersama 2026 ── */}
          <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
            <h3 className="headline" style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Semua Libur & Cuti 2026 📅</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {HOLIDAYS_2026.sort((a,b) => a.date.localeCompare(b.date)).map(h => {
                const d = new Date(h.date + 'T00:00:00');
                const isPast = getDaysUntil(h.date) < 0;
                const isCB   = h.type.includes('cuti_bersama');
                return (
                  <div
                    key={h.id}
                    onClick={() => goToHoliday(h)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 'var(--radius-default)', background: 'var(--surface-container-lowest)', cursor: 'pointer', opacity: isPast ? 0.45 : 1, transition: 'all 0.2s ease' }}
                    className={!isPast ? 'hover-surface-low' : ''}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-default)', background: isCB ? 'rgba(27,109,36,0.1)' : 'rgba(158,0,31,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 9, fontWeight: 900, color: isCB ? 'var(--secondary)' : 'var(--primary)', lineHeight: 1 }}>
                        {MONTHS_ID[d.getMonth()].slice(0,3).toUpperCase()}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1.1 }}>{d.getDate()}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {h.emoji} {h.shortName}
                      </p>
                      <p style={{ fontSize: 10, fontWeight: 800, color: isCB ? 'var(--secondary)' : 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {isCB ? 'Cuti Bersama' : 'Libur Nasional'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* ── Long Weekend Alert — semua selama 2026 ── */}
          <div>
            <h3 className="headline" style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Long Weekend Alert 🚀</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LONG_WEEKENDS_2026.map((lw, i) => {
                const isPast  = new Date(lw.endDate + 'T00:00:00') < today;
                const isNext  = !isPast && (i === 0 || LONG_WEEKENDS_2026.slice(0, i).every(x => new Date(x.endDate + 'T00:00:00') < today));
                // Determine if any cuti is needed to reach this LW (has cuti_bersama in range)
                const hasCuti = lw.holidays.some(h => h.type.includes('cuti_bersama'));
                return (
                  <div
                    key={i}
                    onClick={() => handleLWClick(lw)}
                    style={{ background: isNext ? 'var(--surface-container)' : 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', padding: '16px 18px', cursor: 'pointer', opacity: isPast ? 0.45 : 1, transition: 'all 0.2s ease', boxShadow: isNext ? 'var(--shadow-hover)' : 'var(--shadow-ambient)' }}
                    className={!isPast ? 'hover-scale' : ''}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: hasCuti ? 'var(--tertiary)' : 'var(--secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {hasCuti ? '⚠️ Perlu Cuti' : '🟢 Aman'}
                        {isNext && <span style={{ background: 'var(--primary-container)', color: '#fff', fontSize: 9, padding: '2px 8px', borderRadius: 'var(--radius-full)', marginLeft: 6 }}>NEXT</span>}
                      </span>
                      <span style={{ background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 900, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                        {lw.totalDays} hari
                      </span>
                    </div>
                    <p className="headline" style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, color: 'var(--on-surface)' }}>{lw.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                      {formatLongWeekendRange(lw)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Inspirasi Liburan (top 3 sesuai onboarding) ── */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 className="headline" style={{ fontSize: 18, fontWeight: 800 }}>Inspirasi Liburan ✨</h3>
              <span onClick={() => navigate('/inspiration')} style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', cursor: 'pointer' }}>Lihat Semua</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {inspirations.length === 0
                ? [1,2,3].map(i => <div key={i} style={{ height: 80, borderRadius: 'var(--radius-md)', background: 'var(--surface-container-high)', animation: 'pulse 1.5s infinite' }} />)
                : inspirations.map(dest => (
                  <div
                    key={dest.id}
                    onClick={() => setSelectedDest(dest)}
                    style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', padding: 14, cursor: 'pointer', transition: 'all 0.2s ease' }}
                    className="hover-scale"
                  >
                    <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-default)', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={dest.image}
                        alt={dest.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.currentTarget.src = `https://picsum.photos/seed/${dest.id}/200/200`; }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="headline" style={{ fontSize: 15, fontWeight: 800, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dest.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 6 }}>{dest.location}</p>
                      <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(dest.estTotalCost)}</p>
                    </div>
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 900, color: 'var(--primary)' }}>{Math.max(0, dest.matchScore)}%</p>
                      <p style={{ fontSize: 9, color: 'var(--on-surface-variant)', fontWeight: 700 }}>MATCH</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

        </div>
      </div>

      {/* ── Itinerary modal ── */}
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
            <div className="asymmetric-image" style={{ height: 280, width: '100%', position: 'relative', flexShrink: 0 }}>
              <img src={selectedDest.image} alt={selectedDest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.src = `https://picsum.photos/seed/${selectedDest.id}/800/400`; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--surface), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 24, left: 40, right: 40 }}>
                <h2 className="headline" style={{ fontSize: 40, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1 }}>{selectedDest.name}</h2>
                <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', marginTop: 6 }}>{selectedDest.location}</p>
              </div>
            </div>
            <div style={{ padding: '24px 40px 48px', flex: 1 }}>
              <div style={{ display: 'flex', gap: 16, background: 'var(--surface-container-low)', padding: 20, borderRadius: 'var(--radius-md)', marginBottom: 32 }}>
                <span style={{ fontSize: 28 }}>✨</span>
                <div>
                  <h3 className="headline" style={{ fontSize: 16, fontWeight: 800 }}>AI Smart Itinerary · Est. {formatCurrency(selectedDest.estTotalCost)}</h3>
                  <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 4 }}>{selectedDest.location}</p>
                </div>
              </div>
              <div style={{ position: 'relative', paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: 2, background: 'var(--primary)', opacity: 0.15 }} />
                {selectedDest.itinerary.map((day, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -36, top: 6, width: 10, height: 10, borderRadius: 5, background: 'var(--primary)' }} />
                    <h4 style={{ fontSize: 11, fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>HARI {day.day}</h4>
                    <h5 className="headline" style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{day.title}</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {day.activities.map((act, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-container-low)', padding: '14px 16px', borderRadius: 'var(--radius-default)' }}>
                          <span style={{ fontSize: 16 }}>{i === 0 ? '🛫' : i === day.activities.length-1 ? '🏨' : '📍'}</span>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 36 }}>
                <button className="btn btn-primary btn-full" style={{ padding: 18, fontSize: 16, fontWeight: 900 }} onClick={() => setSelectedDest(null)}>
                  SIMPAN KE KALENDER 🗓️
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hover-scale { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .hover-scale:hover { transform: translateY(-3px); }
        .hover-scale:active { transform: scale(0.98); }
        .hover-surface-low:hover { background: var(--surface-container-high) !important; }
        @keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
        @media (max-width: 1024px) {
          .cal-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
