import { useState, useMemo } from 'react';
import { HOLIDAYS_2026, LONG_WEEKENDS_2026 } from '../data/holidays2026';
import { formatDate, getDaysUntil } from '../utils/dateUtils';

const DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function CalendarPage() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const holidayMap = useMemo(() => {
    const map = new Map<string, typeof HOLIDAYS_2026[0][]>();
    HOLIDAYS_2026.forEach(h => {
      const existing = map.get(h.date) ?? [];
      map.set(h.date, [...existing, h]);
    });
    return map;
  }, []);

  const longWeekendSet = useMemo(() => {
    const set = new Set<string>();
    LONG_WEEKENDS_2026.forEach(lw => {
      const cur = new Date(lw.startDate + 'T00:00:00');
      const end = new Date(lw.endDate + 'T00:00:00');
      while (cur <= end) {
        set.add(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
      }
    });
    return set;
  }, []);

  const calendarDays = useMemo(() => {
    const year = 2026;
    const firstDay = new Date(year, viewMonth, 1).getDay();
    const daysInMonth = new Date(year, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewMonth]);

  const selectedHolidays = useMemo(() => {
    if (!selectedDate) return [];
    return holidayMap.get(selectedDate) ?? [];
  }, [selectedDate, holidayMap]);

  function dateStr(day: number) {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `2026-${m}-${d}`;
  }

  function isToday(day: number) {
    return today.getFullYear() === 2026 && today.getMonth() === viewMonth && today.getDate() === day;
  }

  const monthsWithHolidays = useMemo(() => {
    const months = new Set<number>();
    HOLIDAYS_2026.forEach(h => months.add(parseInt(h.date.split('-')[1]) - 1));
    return Array.from(months).sort((a, b) => a - b);
  }, []);

  return (
    <div className="page">
      <div style={{ background: 'var(--red)', padding: '16px 16px 20px', paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>📅 Kalender Libur 2026</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>Ketuk tanggal untuk detail</p>
      </div>

      {/* Legend */}
      <div style={{
        background: '#fff',
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap',
      }}>
        {[
          { color: 'var(--red)', label: 'Libur Nasional' },
          { color: '#E67E22', label: 'Cuti Bersama' },
          { color: '#27AE60', label: 'Long Weekend' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 600 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 0 16px' }}>
        {/* Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#fff' }}>
          <button
            onClick={() => setViewMonth(m => Math.max(0, m - 1))}
            disabled={viewMonth === 0}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: viewMonth === 0 ? 'var(--border)' : 'var(--red)', padding: '4px 8px' }}
          >‹</button>
          <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16 }}>
            {MONTHS_ID[viewMonth]} 2026
          </span>
          <button
            onClick={() => setViewMonth(m => Math.min(11, m + 1))}
            disabled={viewMonth === 11}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: viewMonth === 11 ? 'var(--border)' : 'var(--red)', padding: '4px 8px' }}
          >›</button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#fff', borderBottom: '1px solid var(--border)' }}>
          {DAYS_SHORT.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-sub)', padding: '6px 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#fff', borderBottom: '1px solid var(--border)' }}>
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const ds = dateStr(day);
            const holidays = holidayMap.get(ds) ?? [];
            const isLW = longWeekendSet.has(ds);
            const isNasional = holidays.some(h => h.type.includes('nasional'));
            const isCuti = holidays.some(h => h.type.includes('cuti_bersama')) && !isNasional;
            const isSel = selectedDate === ds;
            const tod = isToday(day);
            const dow = new Date(ds + 'T00:00:00').getDay();
            const isWeekend = dow === 0 || dow === 6;

            return (
              <div
                key={ds}
                onClick={() => setSelectedDate(prev => prev === ds ? null : ds)}
                style={{
                  padding: '6px 2px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  background: isSel ? 'var(--red-light)' : isLW && !isNasional && !isCuti ? '#F0FDF4' : '#fff',
                  border: isSel ? '1.5px solid var(--red)' : '1px solid transparent',
                }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  margin: '0 auto',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSel ? 'var(--red)' : tod ? 'var(--red-light)' : 'transparent',
                  fontSize: 13,
                  fontWeight: isNasional || isCuti || tod ? 700 : isWeekend ? 600 : 400,
                  color: isSel ? '#fff' : isNasional ? 'var(--red)' : isCuti ? '#E67E22' : isWeekend ? '#6B7280' : 'var(--text)',
                }}>
                  {day}
                </div>
                {/* Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                  {isNasional && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--red)' }} />}
                  {isCuti && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#E67E22' }} />}
                  {isLW && !isNasional && !isCuti && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#27AE60' }} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected date info */}
        {selectedDate && (
          <div style={{
            margin: '12px 16px',
            background: '#fff',
            borderRadius: 14,
            padding: 16,
            borderLeft: '4px solid var(--red)',
            boxShadow: 'var(--shadow)',
          }}>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{formatDate(selectedDate)}</p>
            {selectedHolidays.length === 0 ? (
              <p style={{ color: 'var(--text-sub)', fontSize: 13 }}>Hari kerja biasa</p>
            ) : (
              selectedHolidays.map(h => (
                <div key={h.id} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 24 }}>{h.emoji}</span>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700 }}>{h.name}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      {h.type.includes('nasional') && (
                        <span style={{ background: 'var(--red)', color: '#fff', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
                          Libur Nasional
                        </span>
                      )}
                      {h.type.includes('cuti_bersama') && (
                        <span style={{ background: '#E67E22', color: '#fff', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
                          Cuti Bersama
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {(() => {
              const d = getDaysUntil(selectedDate);
              return (
                <p style={{ color: 'var(--red)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>
                  {d > 0 ? `⏳ ${d} hari lagi` : d === 0 ? '🎉 Hari ini!' : 'Sudah berlalu'}
                </p>
              );
            })()}
          </div>
        )}

        {/* All holidays list */}
        <div style={{ padding: '0 16px' }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12, marginTop: 8 }}>
            Semua Hari Libur & Cuti 2026
          </h3>
          {monthsWithHolidays.map(month => {
            const monthHolidays = HOLIDAYS_2026.filter(h => parseInt(h.date.split('-')[1]) - 1 === month);
            return (
              <div key={month} style={{ marginBottom: 16 }}>
                <p style={{
                  fontSize: 13, fontWeight: 800, color: 'var(--text-sub)',
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, paddingLeft: 4,
                }}>
                  {MONTHS_ID[month]}
                </p>
                {monthHolidays.map(h => {
                  const days = getDaysUntil(h.date);
                  const isCuti = h.type.includes('cuti_bersama') && !h.type.includes('nasional');
                  return (
                    <div
                      key={h.id}
                      onClick={() => {
                        setSelectedDate(h.date);
                        setViewMonth(parseInt(h.date.split('-')[1]) - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#fff',
                        borderRadius: 10,
                        marginBottom: 6,
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        cursor: 'pointer',
                        paddingRight: 12,
                      }}
                    >
                      <div style={{ width: 4, alignSelf: 'stretch', background: isCuti ? '#E67E22' : 'var(--red)', marginRight: 10, flexShrink: 0 }} />
                      <span style={{ fontSize: 18, marginRight: 8, padding: '10px 0' }}>{h.emoji}</span>
                      <div style={{ flex: 1, padding: '10px 0' }}>
                        <p style={{ fontSize: 14, fontWeight: 700 }}>{h.shortName}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-sub)', marginTop: 1 }}>{formatDate(h.date)}</p>
                      </div>
                      {days >= 0 && (
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--red)', flexShrink: 0 }}>
                          {days === 0 ? 'Hari ini' : `${days}h`}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
