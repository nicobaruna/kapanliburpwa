import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LONG_WEEKENDS_2026 } from '../data/holidays2026';
import { formatLongWeekendRange, getDaysUntil, countdownLabel } from '../utils/dateUtils';

const ACCENT_COLORS = ['#C8102E', '#E67E22', '#2E7D32', '#2980B9', '#8E44AD', '#1ABC9C', '#D35400', '#C0392B'];

function buildShareText(lw: typeof LONG_WEEKENDS_2026[0]) {
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

export default function LongWeekendPage() {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [shareModal, setShareModal] = useState<null | { lw: typeof LONG_WEEKENDS_2026[0]; color: string }>(null);
  const [copied, setCopied] = useState(false);

  const upcoming = LONG_WEEKENDS_2026.filter(lw => new Date(lw.endDate + 'T00:00:00') >= today);
  const past = LONG_WEEKENDS_2026.filter(lw => new Date(lw.endDate + 'T00:00:00') < today);

  async function handleShare(platform: string) {
    if (!shareModal) return;
    const text = buildShareText(shareModal.lw);
    if (platform === 'copy') {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    if (platform === 'native' && 'share' in navigator) {
      await navigator.share({ text, title: `Long Weekend ${shareModal.lw.label}` });
      setShareModal(null);
      return;
    }
    const encoded = encodeURIComponent(text);
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encoded}`,
      x: `https://twitter.com/intent/tweet?text=${encoded}`,
      threads: `https://www.threads.net/intent/post?text=${encoded}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
    setShareModal(null);
  }

  function renderCard(lw: typeof LONG_WEEKENDS_2026[0], index: number, isPast: boolean) {
    const daysUntil = getDaysUntil(lw.startDate);
    const color = isPast ? 'var(--on-surface-variant)' : ACCENT_COLORS[index % ACCENT_COLORS.length];
    const isActive = getDaysUntil(lw.startDate) <= 0 && getDaysUntil(lw.endDate) >= 0;

    return (
      <div
        key={`${lw.startDate}-${lw.endDate}`}
        onClick={() => navigate('/kalender')}
        style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 20,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-ambient)',
          opacity: isPast ? 0.6 : 1,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative'
        }}
        className="hover-scale"
      >
        <div style={{ height: 6, background: isActive ? 'var(--primary)' : color }} />
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
              <div style={{ 
                width: 60, height: 60, borderRadius: 'var(--radius-default)', 
                background: isPast ? 'var(--surface-container-low)' : `${color}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, flexShrink: 0
              }}>🏖️</div>
              <div style={{ minWidth: 0 }}>
                <p className="headline" style={{ fontSize: 18, fontWeight: 900, color: 'var(--on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: -0.2 }}>
                  {lw.label}
                </p>
                <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 4, fontWeight: 600 }}>
                  📅 {formatLongWeekendRange(lw)}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ 
                background: isPast ? 'var(--surface-container-high)' : color, 
                borderRadius: 'var(--radius-default)', padding: '10px 18px', textAlign: 'center',
                boxShadow: isPast ? 'none' : `0 8px 20px ${color}15`
              }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: isPast ? 'var(--on-surface-variant)' : '#fff', lineHeight: 1 }}>
                   {lw.totalDays}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: isPast ? 'var(--on-surface-variant)' : 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                   HARI
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setShareModal({ lw, color }); setCopied(false); }}
                style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-full)',
                  background: 'var(--surface-container-low)', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: 'var(--on-surface)', opacity: 0.8
                }}
              >↗</button>
            </div>
          </div>

          {!isPast && (
            <div style={{ marginBottom: 16 }}>
              <span style={{
                background: isActive ? 'var(--secondary-container)' : `${color}08`,
                color: isActive ? 'var(--on-secondary-container)' : color,
                borderRadius: 100,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 900,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}>
                {isActive ? '🎉 SEDANG BERLANGSUNG' : `⏳ ${countdownLabel(daysUntil).toUpperCase()}`}
              </span>
            </div>
          )}

          <div style={{ 
            marginTop: 20, paddingTop: 20, borderTop: 'none', 
            background: 'var(--surface-container-low)', borderRadius: 'var(--radius-default)', padding: 16,
            display: 'flex', flexDirection: 'column', gap: 10 
          }}>
            {lw.holidays
              .filter((h, idx, arr) => arr.findIndex(x => x.id === h.id) === idx)
              .map(h => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{h.emoji}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 800, color: isPast ? 'var(--on-surface-variant)' : 'var(--on-surface)' }}>
                    {h.shortName}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 900, opacity: 0.6 }}>
                    {new Date(h.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }).toUpperCase()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-container" style={{ paddingBottom: 100, background: 'var(--surface)' }}>
      <header style={{ padding: 'var(--spacing-16) 0 var(--spacing-6)' }}>
         <h1 className="headline" style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2 }}>
            Long Weekend
         </h1>
         <p style={{ fontSize: 17, color: 'var(--on-surface-variant)', marginTop: 12, opacity: 0.8, fontWeight: 600 }}>
            {upcoming.length} Long Weekend tersisa · Total {LONG_WEEKENDS_2026.length} di 2026
         </p>
      </header>

      {/* Summary Chips - No-Line logic */}
      <div style={{ 
        background: 'var(--surface-container-low)', borderRadius: 'var(--radius-xl)', 
        padding: '32px 24px', display: 'flex', justifyContent: 'space-around', 
        marginBottom: 48, position: 'relative'
      }}>
        {[
          { num: LONG_WEEKENDS_2026.length, label: 'TOTAL LW' },
          { num: upcoming.length, label: 'TERSISA' },
          { num: Math.max(...LONG_WEEKENDS_2026.map(lw => lw.totalDays)), label: 'MAX HARI' },
        ].map((item, i) => (
          <div key={item.label} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--primary)', letterSpacing: -2 }}>{item.num}</div>
              <div style={{ fontSize: 10, color: 'var(--on-surface-variant)', fontWeight: 900, marginTop: 4, letterSpacing: 1.5 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div>
        {upcoming.length > 0 && (
          <>
            <h2 className="headline" style={{ fontSize: 22, fontWeight: 900, marginBottom: 20, letterSpacing: -0.5 }}>Mendatang</h2>
            {upcoming.map((lw, i) => renderCard(lw, i, false))}
          </>
        )}

        {past.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <h2 className="headline" style={{ fontSize: 22, fontWeight: 900, color: 'var(--on-surface-variant)', marginBottom: 20, letterSpacing: -0.5 }}>Sudah Berlalu</h2>
            {past.map((lw, i) => renderCard(lw, i, true))}
          </div>
        )}
      </div>

      {/* Share Modal - Stitch Compliant */}
      {shareModal && (
        <div
          onClick={() => setShareModal(null)}
          className="share-backdrop"
          style={{ zIndex: 1000 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="share-sheet"
            style={{ padding: '16px 32px 48px' }}
          >
            <div style={{ width: 44, height: 5, background: 'var(--surface-container-highest)', borderRadius: 100, margin: '0 auto 24px', opacity: 0.5 }} />
            <h3 className="headline" style={{ fontSize: 22, fontWeight: 900, textAlign: 'center', marginBottom: 10 }}>Bagikan Momen</h3>
            <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', textAlign: 'center', marginBottom: 32, fontWeight: 600 }}>
              🏖️ {shareModal.lw.label} · {formatLongWeekendRange(shareModal.lw)}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button
                onClick={() => handleShare('whatsapp')}
                className="btn btn-primary btn-full shadow-lg"
                style={{ padding: 20, fontSize: 16, fontWeight: 900, letterSpacing: 0.5 }}
              >
                BAGIKAN KE WHATSAPP 💬
              </button>

              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { id: 'x', label: '𝕏 Twitter', bg: '#1c1c19' },
                  { id: 'threads', label: 'Threads', bg: '#333' },
                  { id: 'copy', label: copied ? 'TERSALIN' : 'COPY TEXT', bg: 'var(--surface-container-high)' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleShare(p.id)}
                    style={{
                      flex: 1, background: p.bg, color: p.bg.startsWith('var') ? 'var(--on-surface)' : '#fff',
                      border: 'none', borderRadius: 'var(--radius-md)', padding: '18px 8px', fontSize: 11, fontWeight: 900,
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    }}
                    className="hover-scale"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .hover-scale { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover-scale:hover { transform: translateY(-6px); }
        .hover-scale:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}
