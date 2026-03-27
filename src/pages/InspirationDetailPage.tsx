import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecommendations, formatCurrency } from '../services/api';
import type { RecommendationResult } from '../services/api';
import ShareSheet from '../components/ShareSheet';

export default function InspirationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dest, setDest] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    async function load() {
      const budget = parseInt(localStorage.getItem('kapanlibur_budget') || '6000000');
      const results = await getRecommendations(budget);
      const found = results.find(r => r.id === id) ?? null;
      setDest(found);
      setLoading(false);

      if (found) {
        document.title = `Liburan ke ${found.name} | KapanLibur`;
        const setMeta = (prop: string, val: string) => {
          let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
          if (!el) {
            el = document.createElement('meta');
            el.setAttribute('property', prop);
            document.head.appendChild(el);
          }
          el.setAttribute('content', val);
        };
        setMeta('og:title', `🌴 Liburan ke ${found.name}!`);
        setMeta('og:description', `Estimasi biaya: ${formatCurrency(found.estTotalCost)}. Cek itinerary lengkap di KapanLibur!`);
        setMeta('og:image', found.image);
        setMeta('og:url', window.location.href);
        setMeta('og:type', 'article');
        const twitterImg = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement | null;
        if (twitterImg) twitterImg.setAttribute('content', found.image);
      }
    }
    load();

    return () => {
      document.title = 'KapanLibur — Kalender Libur Nasional Indonesia 2026';
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 44, height: 44, border: '4px solid #f0f0f0', borderTop: '4px solid #9e001f', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
        <p style={{ fontSize: 14, color: '#888' }}>Memuat destinasi...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!dest) {
    return (
      <div style={{ padding: 40, textAlign: 'center', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ fontSize: 56 }}>🗺️</p>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Destinasi tidak ditemukan</h2>
        <p style={{ fontSize: 14, color: '#888' }}>Link mungkin sudah kadaluarsa atau ID tidak valid.</p>
        <button
          onClick={() => navigate('/inspiration')}
          style={{ padding: '14px 28px', borderRadius: 14, background: '#9e001f', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}
        >
          Lihat Semua Destinasi
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface)', paddingBottom: 48 }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: 360 }}>
        <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: 20, left: 16, width: 40, height: 40, borderRadius: 20, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>arrow_back</span>
        </button>

        {/* Share button */}
        <button
          onClick={() => setShowShare(true)}
          style={{ position: 'absolute', top: 20, right: 16, width: 40, height: 40, borderRadius: 20, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>share</span>
        </button>

        {/* Title overlay */}
        <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <span style={{ display: 'inline-block', background: 'var(--primary-container)', color: '#fff', padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            AI Itinerary
          </span>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 34, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 6 }}>{dest.name}</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
            {dest.location}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div style={{ padding: '16px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {dest.dynamicTags.map((t, i) => {
          const bg = t.type === 'danger' ? 'var(--primary-container)' : t.type === 'warning' ? '#FADB5F' : t.type === 'success' ? '#97E4A8' : 'var(--surface-container)';
          const color = t.type === 'danger' ? '#fff' : t.type === 'warning' ? '#4F3906' : t.type === 'success' ? '#0F5120' : 'var(--on-surface)';
          return <span key={i} style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: bg, color }}>{t.label}</span>;
        })}
      </div>

      {/* Cost summary */}
      <div style={{ margin: '4px 20px 24px', background: dest.canAfford ? 'var(--surface-container-low)' : 'rgba(158,0,31,0.06)', borderRadius: 16, padding: '18px 20px', border: dest.canAfford ? 'none' : '1.5px solid rgba(158,0,31,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Estimasi Total</p>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 28, fontWeight: 900, color: dest.canAfford ? 'var(--on-surface)' : 'var(--primary)' }}>
              {formatCurrency(dest.estTotalCost)}
            </p>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>
              ✈️ {dest.flightPrice === 0 ? 'Roadtrip' : `${formatCurrency(dest.flightPrice)}/org`}
            </span>
            <span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>
              🛏️ {formatCurrency(dest.hotelPerNight)}/malam
            </span>
            {dest.canAfford
              ? <span style={{ fontSize: 12, fontWeight: 700, color: '#0F5120' }}>✅ Sesuai budget</span>
              : <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>⚠️ Melebihi budget</span>
            }
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div style={{ padding: '0 20px 32px' }}>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>
          Itinerary Lengkap
        </h2>

        <div style={{ position: 'relative', paddingLeft: 28, borderLeft: '2px solid var(--surface-container-high)', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {dest.itinerary.map((day, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: -35, top: 2, width: 16, height: 16, borderRadius: 8, background: 'var(--primary-container)', border: '4px solid var(--surface)' }} />
              <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary-container)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>Hari {day.day}</p>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 19, fontWeight: 900, color: 'var(--on-surface)', marginBottom: 14 }}>{day.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {day.activities.map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-container-lowest)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--surface-container)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary-container)', flexShrink: 0 }}>
                      {i === 0 ? 'flight_land' : i === day.activities.length - 1 ? 'bed' : 'explore'}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTAs */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={() => setShowShare(true)}
          style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'var(--primary-container)', color: '#fff', fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>share</span>
          Bagikan Destinasi Ini
        </button>
        <button
          onClick={() => navigate('/inspiration')}
          style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'transparent', color: 'var(--on-surface)', fontSize: 14, fontWeight: 700, border: '1.5px solid var(--outline-variant)', cursor: 'pointer' }}
        >
          Lihat Destinasi Lainnya →
        </button>
      </div>

      {showShare && <ShareSheet dest={dest} onClose={() => setShowShare(false)} />}
    </div>
  );
}
