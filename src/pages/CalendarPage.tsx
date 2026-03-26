import { useState, useMemo } from 'react';
import { HOLIDAYS_2026, LONG_WEEKENDS_2026, type Holiday } from '../data/holidays2026';
import { formatDate, getDaysUntil, getMonthName } from '../utils/dateUtils';

const C = {
  red: '#C8102E',
  white: '#FFFFFF',
  bg: '#F7F3EF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#6B7280',
  national: '#C8102E',
  cuti: '#E67E22',
  green: '#27AE60',
  border: '#E8E0D8',
};

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function buildLongWeekendSet(): Set<string> {
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
}

const LW_SET = buildLongWeekendSet();
const HOLIDAY_MAP = new Map<string, Holiday>(HOLIDAYS_2026.map(h => [h.date, h]));

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayStr = today.toISOString().split('T')[0];

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      cells.push(`${year}-${mm}-${dd}`);
    }
    return cells;
  }, [year, month]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const selectedHoliday = selectedDate ? HOLIDAY_MAP.get(selectedDate) : null;
  const selectedIsLW = selectedDate ? LW_SET.has(selectedDate) : false;
  const selectedDaysUntil = selectedDate ? getDaysUntil(selectedDate) : null;

  return (
    <div className="page" style={{ backgroundColor: C.bg }}>
      {/* Header */}
      <div style={{
        backgroundColor: C.red, padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(200,16,46,0.3)',
      }}>
        <h1 style={{ color: C.white, fontSize: 20, fontWeight: 800 }}>📅 Kalender 2026</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
          Hari libur nasional & cuti bersama
        </p>
      </div>

      <div style={{ padding: 16 }}>
        {/* Month navigator */}
        <div style={{
          backgroundColor: C.card, borderRadius: 16, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        }}>
          <button onClick={prevMonth} style={{
            background: 'none', border: 'none', fontSize: 20,
            color: C.text, cursor: 'pointer', padding: '4px 8px',
          }}>‹</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>
              {getMonthName(month)}
            </div>
            <div style={{ fontSize: 13, color: C.textSub, fontWeight: 600 }}>{year}</div>
          </div>
          <button onClick={nextMonth} style={{
            background: 'none', border: 'none', fontSize: 20,
            color: C.text, cursor: 'pointer', padding: '4px 8px',
          }}>›</button>
        </div>

        {/* Calendar grid */}
        <div style={{
          backgroundColor: C.card, borderRadius: 16,
          overflow: 'hidden', marginBottom: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        }}>
          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${C.border}` }}>
            {DAY_LABELS.map((d, i) => (
              <div key={d} style={{
                padding: '8px 0',
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: i === 0 ? C.national : i === 6 ? '#2563EB' : C.textSub,
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {calendarDays.map((dateStr, idx) => {
              if (!dateStr) {
                return <div key={`empty-${idx}`} style={{ aspectRatio: '1', padding: 4 }} />;
              }
              const holiday = HOLIDAY_MAP.get(dateStr);
              const isLW = LW_SET.has(dateStr);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const isSun = new Date(dateStr + 'T00:00:00').getDay() === 0;
              const isSat = new Date(dateStr + 'T00:00:00').getDay() === 6;
              const isNasional = holiday?.type.includes('nasional');
              const isCuti = holiday?.type.includes('cuti_bersama');
              const day = parseInt(dateStr.split('-')[2]);

              let bgColor = 'transparent';
              let textColor = isSun ? C.national : isSat ? '#2563EB' : C.text;
              if (isLW && !holiday) bgColor = '#D5F5E3';
              if (isNasional) { bgColor = '#FDECEA'; textColor = C.red; }
              if (isCuti) { bgColor = '#FEF3E2'; textColor = C.cuti; }
              if (isSelected) { bgColor = C.red; textColor = C.white; }
              if (isToday && !isSelected) {
                bgColor = 'rgba(200,16,46,0.1)';
                textColor = C.red;
              }

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                  style={{
                    aspectRatio: '1',
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: 10,
                    margin: 2,
                    backgroundColor: bgColor,
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: isToday || holiday ? 800 : 500, color: textColor }}>
                    {day}
                  </span>
                  {holiday && (
                    <span style={{ fontSize: 10, lineHeight: 1 }}>{holiday.emoji}</span>
                  )}
                  {isToday && !isSelected && (
                    <div style={{
                      width: 4, height: 4, borderRadius: '50%',
                      backgroundColor: C.red, marginTop: 1,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{
          backgroundColor: C.card, borderRadius: 12, padding: '12px 16px',
          marginBottom: 12, display: 'flex', gap: 16, flexWrap: 'wrap' as const,
        }}>
          {[
            { color: '#FDECEA', text: '🏛 Libur Nasional' },
            { color: '#FEF3E2', text: '📅 Cuti Bersama' },
            { color: '#D5F5E3', text: '🏖️ Long Weekend' },
          ].map(l => (
            <div key={l.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: l.color, border: `1px solid ${C.border}` }} />
              <span style={{ fontSize: 11, color: C.textSub, fontWeight: 600 }}>{l.text}</span>
            </div>
          ))}
        </div>

        {/* Selected date detail */}
        {selectedDate && (
          <div style={{
            backgroundColor: C.card, borderRadius: 16, padding: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.textSub, marginBottom: 8 }}>
              {formatDate(selectedDate)}
            </div>
            {selectedHoliday ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 32 }}>{selectedHoliday.emoji}</span>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: C.text }}>
                      {selectedHoliday.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      {selectedHoliday.type.includes('nasional') && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.red, backgroundColor: '#FDECEA', padding: '2px 8px', borderRadius: 20 }}>
                          Libur Nasional
                        </span>
                      )}
                      {selectedHoliday.type.includes('cuti_bersama') && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.cuti, backgroundColor: '#FEF3E2', padding: '2px 8px', borderRadius: 20 }}>
                          Cuti Bersama
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {selectedDaysUntil !== null && selectedDaysUntil >= 0 && (
                  <div style={{
                    backgroundColor: '#FEF2F2', borderRadius: 10,
                    padding: '8px 12px', display: 'inline-block',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.red }}>
                      ⏳ {selectedDaysUntil === 0 ? 'Hari ini!' : selectedDaysUntil === 1 ? 'Besok!' : `${selectedDaysUntil} hari lagi`}
                    </span>
                  </div>
                )}
              </>
            ) : selectedIsLW ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>🏖️</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.green }}>Bagian dari Long Weekend</span>
              </div>
            ) : (
              <div style={{ fontSize: 14, color: C.textSub }}>Hari kerja biasa</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
