import { LONG_WEEKENDS_2026 } from '../data/holidays2026';
import {
  formatLongWeekendRange,
  getDaysUntil,
  countdownLabel,
} from '../utils/dateUtils';

const C = {
  red: '#C8102E',
  white: '#FFFFFF',
  bg: '#F7F3EF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#6B7280',
  green: '#27AE60',
  greenLight: '#D5F5E3',
  border: '#E8E0D8',
};

const DAY_COLORS = [
  '#C8102E', '#E67E22', '#27AE60', '#2980B9', '#8E44AD',
  '#1ABC9C', '#D35400', '#C0392B',
];

function buildShareText(lw: typeof LONG_WEEKENDS_2026[0]): string {
  const range = formatLongWeekendRange(lw);
  const holidayLines = lw.holidays
    .filter((h, idx, arr) => arr.findIndex(x => x.id === h.id) === idx)
    .map(h => `${h.emoji} ${h.shortName}`)
    .join('\n');
  return (
    `🏖️ Long Weekend ${lw.label}!\n` +
    `📅 ${range} · ${lw.totalDays} hari\n\n` +
    `${holidayLines}\n\n` +
    `Tandai kalendermu! 🗓️\n` +
    `#LongWeekend #LiburNasional #Indonesia`
  );
}

async function handleShare(lw: typeof LONG_WEEKENDS_2026[0]) {
  const text = buildShareText(lw);
  if (navigator.share) {
    try {
      await navigator.share({ text, title: `Long Weekend ${lw.label}` });
    } catch {
      // user cancelled
    }
  } else {
    await navigator.clipboard.writeText(text);
    alert('Teks berhasil disalin ke clipboard!');
  }
}

export default function LongWeekendPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = LONG_WEEKENDS_2026.filter(lw => {
    const end = new Date(lw.endDate + 'T00:00:00');
    return end >= today;
  });

  const past = LONG_WEEKENDS_2026.filter(lw => {
    const end = new Date(lw.endDate + 'T00:00:00');
    return end < today;
  });

  const renderLW = (lw: typeof LONG_WEEKENDS_2026[0], index: number, isPast: boolean) => {
    const daysUntil = getDaysUntil(lw.startDate);
    const accentColor = DAY_COLORS[index % DAY_COLORS.length];
    const isActive = getDaysUntil(lw.startDate) <= 0 && getDaysUntil(lw.endDate) >= 0;

    return (
      <div
        key={`${lw.startDate}-${lw.endDate}`}
        style={{
          backgroundColor: C.card,
          borderRadius: 16,
          marginBottom: 12,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          opacity: isPast ? 0.6 : 1,
          border: isActive ? `2px solid ${C.green}` : 'none',
        }}
      >
        <div style={{ height: 5, backgroundColor: isPast ? C.border : accentColor }} />
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <span style={{ fontSize: 28 }}>🏖️</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: isPast ? C.textSub : C.text }}>
                  {lw.label}
                </div>
                <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>
                  📅 {formatLongWeekendRange(lw)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                backgroundColor: isPast ? C.border : accentColor,
                borderRadius: 12,
                padding: '8px 14px',
                textAlign: 'center',
                minWidth: 52,
              }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: isPast ? C.textSub : C.white, lineHeight: 1 }}>
                  {lw.totalDays}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: isPast ? C.textSub : 'rgba(255,255,255,0.85)' }}>
                  hari
                </div>
              </div>
              {!isPast && (
                <button
                  onClick={() => handleShare(lw)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    backgroundColor: C.bg, border: `1px solid ${C.border}`,
                    fontSize: 18, color: C.text, fontWeight: 700,
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ↗
                </button>
              )}
            </div>
          </div>

          {!isPast && (
            <div style={{ marginBottom: 10 }}>
              {isActive ? (
                <span style={{
                  backgroundColor: C.greenLight,
                  color: C.green,
                  borderRadius: 20, padding: '6px 12px',
                  fontSize: 13, fontWeight: 700,
                }}>
                  🎉 Sedang berlangsung!
                </span>
              ) : (
                <span style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                  borderRadius: 20, padding: '6px 12px',
                  fontSize: 13, fontWeight: 700,
                }}>
                  ⏳ {countdownLabel(daysUntil)}
                </span>
              )}
            </div>
          )}

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {lw.holidays
              .filter((h, idx, arr) => arr.findIndex(x => x.id === h.id) === idx)
              .map(h => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{h.emoji}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: isPast ? C.textSub : C.text }}>
                    {h.shortName}
                  </span>
                  <span style={{ fontSize: 12, color: C.textSub, fontWeight: 600 }}>
                    {new Date(h.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page" style={{ backgroundColor: C.bg }}>
      {/* Header */}
      <div style={{
        backgroundColor: C.red, padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(200,16,46,0.3)',
      }}>
        <h1 style={{ color: C.white, fontSize: 20, fontWeight: 800 }}>🏖️ Long Weekend 2026</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
          {upcoming.length} long weekend tersisa · Total {LONG_WEEKENDS_2026.length} di 2026
        </p>
      </div>

      <div style={{ padding: 16 }}>
        {/* Summary */}
        <div style={{
          backgroundColor: C.card, borderRadius: 14, padding: 16,
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        }}>
          {[
            { num: LONG_WEEKENDS_2026.length, label: 'Total LW' },
            { num: upcoming.length, label: 'Tersisa' },
            { num: Math.max(...LONG_WEEKENDS_2026.map(lw => lw.totalDays)), label: 'Max Hari' },
          ].map((item, i, arr) => (
            <>
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.red }}>{item.num}</div>
                <div style={{ fontSize: 11, color: C.textSub, fontWeight: 600, marginTop: 2 }}>{item.label}</div>
              </div>
              {i < arr.length - 1 && (
                <div key={`div-${i}`} style={{ width: 1, height: 36, backgroundColor: C.border }} />
              )}
            </>
          ))}
        </div>

        {upcoming.length > 0 && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 10, paddingLeft: 2 }}>
              Mendatang
            </h2>
            {upcoming.map((lw, i) => renderLW(lw, i, false))}
          </>
        )}

        {past.length > 0 && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: C.textSub, marginTop: 16, marginBottom: 10, paddingLeft: 2 }}>
              Sudah Berlalu
            </h2>
            {past.map((lw, i) => renderLW(lw, i, true))}
          </>
        )}
      </div>
    </div>
  );
}
