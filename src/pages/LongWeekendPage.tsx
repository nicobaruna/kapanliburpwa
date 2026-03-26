import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LONG_WEEKENDS_2026 } from '../data/holidays2026';
import { formatLongWeekendRange, getDaysUntil, countdownLabel } from '../utils/dateUtils';

const ACCENT_COLORS = ['#C8102E', '#E67E22', '#27AE60', '#2980B9', '#8E44AD', '#1ABC9C', '#D35400', '#C0392B'];

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
    const color = isPast ? 'var(--border)' : ACCENT_COLORS[index % ACCENT_COLORS.length];
    const isActive = getDaysUntil(lw.startDate) <= 0 && getDaysUntil(lw.endDate) >= 0;

    return (
      <div
        key={`${lw.startDate}-${lw.endDate}`}
        onClick={() => navigate('/kalender')}
        style={{
          background: '#fff',
          borderRadius: 16,
          marginBottom: 12,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          opacity: isPast ? 0.6 : 1,
          border: isActive ? '2px solid #27AE60' : '1px solid transparent',
          cursor: 'pointer',
        }}
      >
        <div style={{ height: 5, background: color }} />
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>🏖️</span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: isPast ? 'var(--text-sub)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lw.label}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 2 }}>
                  📅 {formatLongWeekendRange(lw)}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ background: color, borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: isPast ? 'var(--text-sub)' : '#fff', lineHeight: 1 }}>
                  {lw.totalDays}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: isPast ? 'var(--text-sub)' : 'rgba(255,255,255,0.85)' }}>
                  hari
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setShareModal({ lw, color }); setCopied(false); }}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}
              >↗</button>
            </div>
          </div>

          {!isPast && (
            <div style={{ marginBottom: 10 }}>
              <span style={{
                background: isActive ? '#D5F5E3' : `${color}15`,
                color: isActive ? '#27AE60' : color,
                borderRadius: 20,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 700,
                display: 'inline-block',
              }}>
                {isActive ? '🎉 Sedang berlangsung!' : `⏳ ${countdownLabel(daysUntil)}`}
              </span>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {lw.holidays
              .filter((h, idx, arr) => arr.findIndex(x => x.id === h.id) === idx)
              .map(h => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{h.emoji}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: isPast ? 'var(--text-sub)' : 'var(--text)' }}>
                    {h.shortName}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-sub)', fontWeight: 600 }}>
                    {new Date(h.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ background: 'var(--red)', padding: '16px 16px 20px', paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>🏖️ Long Weekend 2026</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
          {upcoming.length} tersisa · Total {LONG_WEEKENDS_2026.length} di 2026
        </p>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Summary */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-around', marginBottom: 20, boxShadow: 'var(--shadow)' }}>
          {[
            { num: LONG_WEEKENDS_2026.length, label: 'Total LW' },
            { num: upcoming.length, label: 'Tersisa' },
            { num: Math.max(...LONG_WEEKENDS_2026.map(lw => lw.totalDays)), label: 'Max Hari' },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: i < arr.length - 1 ? 0 : 0 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--red)' }}>{item.num}</div>
                <div style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 600, marginTop: 2 }}>{item.label}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, height: 36, background: 'var(--border)', marginLeft: 24 }} />}
            </div>
          ))}
        </div>

        {upcoming.length > 0 && (
          <>
            <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>Mendatang</p>
            {upcoming.map((lw, i) => renderCard(lw, i, false))}
          </>
        )}

        {past.length > 0 && (
          <>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-sub)', marginBottom: 10, marginTop: 16 }}>Sudah Berlalu</p>
            {past.map((lw, i) => renderCard(lw, i, true))}
          </>
        )}
      </div>

      {/* Share Modal */}
      {shareModal && (
        <div
          onClick={() => setShareModal(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 200,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '12px 24px 32px',
              width: '100%',
              maxWidth: 'var(--max-w)',
            }}
          >
            <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, textAlign: 'center', marginBottom: 6 }}>Bagikan Long Weekend</h3>
            <p style={{ fontSize: 13, color: 'var(--text-sub)', textAlign: 'center', marginBottom: 20 }}>
              🏖️ {shareModal.lw.label} · {formatLongWeekendRange(shareModal.lw)} · {shareModal.lw.totalDays} hari
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => handleShare('whatsapp')}
                style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 20px', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              >
                <span style={{ fontSize: 22 }}>💬</span> Bagikan ke WhatsApp
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { id: 'x', label: 'X / Twitter', emoji: '𝕏', bg: '#000' },
                  { id: 'threads', label: 'Threads', emoji: '@', bg: '#000' },
                  { id: 'copy', label: copied ? 'Tersalin!' : 'Salin Teks', emoji: copied ? '✅' : '📋', bg: 'var(--bg)' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleShare(p.id)}
                    style={{
                      flex: 1, background: p.bg, color: p.bg === 'var(--bg)' ? 'var(--text)' : '#fff',
                      border: p.bg === 'var(--bg)' ? '1.5px solid var(--border)' : 'none',
                      borderRadius: 12, padding: '12px 8px', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{p.emoji}</span>
                    {p.label}
                  </button>
                ))}
              </div>

              {'share' in navigator && (
                <button
                  onClick={() => handleShare('native')}
                  style={{ background: 'var(--bg)', color: 'var(--text)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                >
                  📤 Bagikan Via...
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
