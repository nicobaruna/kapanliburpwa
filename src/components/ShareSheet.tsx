import React, { useState } from 'react';
import { formatCurrency } from '../services/api';
import type { RecommendationResult } from '../services/api';

/* ── Share payload types ─────────────────────────────────── */

export interface DestinationSharePayload {
  type: 'destination';
  dest: RecommendationResult;
}

export interface GenericSharePayload {
  type: 'generic';
  emoji: string;
  title: string;
  subtitle: string;
  tag?: string;
  tagColor?: string;
  shareText: string;
  shareUrl: string;
}

export type SharePayload = DestinationSharePayload | GenericSharePayload;

interface Props {
  payload: SharePayload;
  onClose: () => void;
}

/* ── Social platform icons ───────────────────────────────── */

function WaIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff">
      <path d="M16 2C8.28 2 2 8.28 2 16c0 2.44.65 4.73 1.79 6.71L2 30l7.5-1.76A13.94 13.94 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm7.3 19.67c-.3.85-1.77 1.63-2.43 1.73-.62.1-1.4.14-2.26-.14a20.7 20.7 0 01-2.05-.76C13.3 21.5 10.9 18.78 10.14 17.7c-.75-1.08-1.27-2.28-1.27-3.5 0-1.24.65-1.85 1.38-2.06a.96.96 0 01.44-.04c.14 0 .28.01.4.01.35 0 .53.08.77.6.3.63.96 2.35.96 2.52 0 .17-.09.39-.26.57-.17.18-.4.45-.57.6-.18.17-.36.35-.15.69.2.34.9 1.49 1.93 2.4 1.32 1.18 2.44 1.54 2.79 1.71.35.17.55.14.76-.08.2-.23.88-1.02 1.12-1.37.23-.35.47-.28.79-.17.32.11 2.04.96 2.39 1.14.35.17.58.25.67.4.09.14.09.81-.21 1.65z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" fill="#fff">
      <path d="M18.24 14.23L26.92 4h-2.07l-7.53 8.75L11 4H4l9.1 13.24L4 28h2.07l7.96-9.25L20.5 28H28L18.24 14.23zM14.6 17.63l-.92-1.32L6.83 5.6h3.16l5.93 8.48.92 1.32 7.68 10.98h-3.16l-6.27-8.95z" />
    </svg>
  );
}

function FbIcon() {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" fill="#fff">
      <path d="M17.78 27V17.56h3.16l.47-3.67h-3.63v-2.34c0-1.06.3-1.78 1.82-1.78h1.94V6.47A26 26 0 0018.6 6.4c-2.8 0-4.72 1.71-4.72 4.85v2.7H10.6v3.6h3.28V27h3.9z" />
    </svg>
  );
}

function ThreadsIcon() {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" fill="#fff">
      <path d="M21.5 14.6c-.2-.1-.4-.18-.6-.26-.34-4.06-2.44-6.39-6.16-6.41h-.06c-2.22 0-4.07.95-5.2 2.68l1.95 1.34c.84-1.28 2.16-1.55 3.25-1.55h.04c1.26.01 2.2.37 2.81 1.08.44.51.73 1.22.87 2.1a15.4 15.4 0 00-3.52-.1c-3.54.2-5.83 2.24-5.68 5.08.08 1.46.78 2.72 1.97 3.55a5.91 5.91 0 003.75.99c1.83-.1 3.26-.8 4.26-2.08.76-.98 1.24-2.25 1.44-3.84.86.52 1.5 1.2 1.86 2.02.63 1.42.66 3.76-1.3 5.72-1.72 1.72-3.78 2.46-6.9 2.48-3.46-.02-6.07-1.13-7.78-3.31C4.66 20.7 3.85 17.9 3.85 16c0-1.9.81-4.7 2.73-7.1 1.71-2.18 4.32-3.29 7.78-3.31 3.48.02 6.13 1.15 7.88 3.35.87 1.1 1.52 2.48 1.95 4.1l2.3-.6c-.52-1.93-1.33-3.6-2.44-4.98C21.6 4.7 18.26 3.28 14.37 3.26h-.07C10.4 3.28 7.1 4.7 4.84 7.46 2.7 10.08 1.6 13.4 1.6 16c0 2.6 1.1 5.92 3.24 8.54 2.26 2.76 5.56 4.18 9.46 4.2h.07c3.46-.02 5.9-1.08 7.93-3.1 2.66-2.66 2.58-5.84 1.71-7.83-.6-1.38-1.76-2.5-3.51-3.21zm-6.28 5.77c-1.55.09-3.16-.6-3.25-2.1-.07-1.12.8-2.36 3.41-2.51.3-.02.59-.03.87-.03.9 0 1.74.09 2.5.25-.28 3.48-1.93 4.31-3.53 4.39z" />
    </svg>
  );
}

function IgIcon() {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" fill="#fff">
      <path d="M16 4c-3.26 0-3.67.01-4.95.07-1.27.06-2.14.27-2.9.57a5.86 5.86 0 00-2.12 1.38A5.86 5.86 0 004.65 8.14c-.3.76-.5 1.63-.57 2.9C4.01 12.32 4 12.74 4 16s.01 3.67.07 4.95c.06 1.27.27 2.14.57 2.9.31.8.73 1.48 1.38 2.12a5.86 5.86 0 002.12 1.38c.76.3 1.63.5 2.9.57C12.33 27.99 12.74 28 16 28s3.67-.01 4.95-.07c1.27-.06 2.14-.27 2.9-.57a5.86 5.86 0 002.12-1.38 5.86 5.86 0 001.38-2.12c.3-.76.5-1.63.57-2.9.06-1.28.07-1.7.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.14-.57-2.9a5.86 5.86 0 00-1.38-2.13 5.86 5.86 0 00-2.12-1.38c-.76-.3-1.63-.5-2.9-.57C19.67 4.01 19.26 4 16 4zm0 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.23.4.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.35 1.06.4 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.4 2.23a3.7 3.7 0 01-.9 1.38 3.7 3.7 0 01-1.38.9c-.43.16-1.06.35-2.23.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.23-.4a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.43-.35-1.06-.4-2.23C6.17 19.58 6.16 19.2 6.16 16s.01-3.58.07-4.85c.05-1.17.24-1.8.4-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.35 2.23-.4C12.42 6.17 12.8 6.16 16 6.16zM16 10a6 6 0 100 12A6 6 0 0016 10zm0 9.9a3.9 3.9 0 110-7.8 3.9 3.9 0 010 7.8zm6.38-10.15a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z" />
    </svg>
  );
}

const PLATFORMS = [
  {
    id: 'whatsapp', name: 'WhatsApp', bg: '#25D366', icon: <WaIcon />,
    getUrl: (text: string, url: string) => `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
  },
  {
    id: 'x', name: 'X', bg: '#000', icon: <XIcon />,
    getUrl: (text: string, url: string) => `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: 'facebook', name: 'Facebook', bg: '#1877F2', icon: <FbIcon />,
    getUrl: (_text: string, url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'threads', name: 'Threads', bg: '#101010', icon: <ThreadsIcon />,
    getUrl: (text: string, url: string) => `https://www.threads.net/intent/post?text=${encodeURIComponent(text + '\n' + url)}`,
  },
  {
    id: 'instagram', name: 'Instagram',
    bg: 'linear-gradient(135deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888)',
    icon: <IgIcon />,
    getUrl: null,
  },
];

export default function ShareSheet({ payload, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  /* Resolve text / url from payload */
  const shareUrl = payload.type === 'destination'
    ? `${window.location.origin}/inspiration/${payload.dest.id}`
    : payload.shareUrl;

  const shareText = payload.type === 'destination'
    ? `🌴 Liburan ke ${payload.dest.name}!\n📍 ${payload.dest.location}\n💰 Estimasi: ${formatCurrency(payload.dest.estTotalCost)}\n\nCek itinerary lengkap di KapanLibur:`
    : payload.shareText;

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 10001,
        background: 'var(--surface-container-lowest)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        padding: '0 0 48px',
        animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        maxWidth: 640, margin: '0 auto',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
      }}>
        {/* Handle */}
        <div style={{ width: 44, height: 5, background: 'var(--outline-variant)', borderRadius: 'var(--radius-full)', margin: '16px auto 24px', opacity: 0.5 }} />

        {/* Preview */}
        <div style={{ padding: '0 24px 24px' }}>
          {payload.type === 'destination' ? (
            /* Destination preview */
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--surface-container-low)', padding: 16, borderRadius: 'var(--radius-md)' }}>
              <img
                src={payload.dest.image} alt={payload.dest.name}
                style={{ width: 72, height: 72, borderRadius: 'var(--radius-default)', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <p className="headline" style={{ fontWeight: 800, fontSize: 18, marginBottom: 2 }}>{payload.dest.name}</p>
                <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 4 }}>{payload.dest.location}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: 'rgba(158,0,31,0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 900, letterSpacing: 0.5 }}>BEST MATCH</span>
                  <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 700 }}>{formatCurrency(payload.dest.estTotalCost)}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Generic preview */
            <div style={{
              display: 'flex', gap: 16, alignItems: 'center',
              background: 'var(--surface-container-low)',
              padding: '16px 20px', borderRadius: 'var(--radius-md)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: 'var(--surface-container-high)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26,
              }}>
                {payload.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {payload.tag && (
                  <span style={{
                    fontSize: 9, fontWeight: 900, letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    color: payload.tagColor ?? 'var(--primary)',
                    display: 'block', marginBottom: 4,
                  }}>
                    {payload.tag}
                  </span>
                )}
                <p className="headline" style={{ fontWeight: 800, fontSize: 17, marginBottom: 3, lineHeight: 1.2 }}>
                  {payload.title}
                </p>
                <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {payload.subtitle}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Platform buttons */}
        <div style={{ padding: '8px 24px 0', display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {PLATFORMS.map(p => {
            const isIg = p.id === 'instagram';
            const url  = p.getUrl ? p.getUrl(shareText, shareUrl) : null;
            return (
              <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }} className="hover-scale">
                {isIg ? (
                  <button onClick={copyLink} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-ambient)', transition: 'transform 0.2s' }}>
                      {p.icon}
                    </div>
                  </button>
                ) : (
                  <a href={url!} target="_blank" rel="noopener noreferrer" onClick={onClose} style={{ textDecoration: 'none' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-ambient)', transition: 'transform 0.2s' }}>
                      {p.icon}
                    </div>
                  </a>
                )}
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: 0.2 }}>
                  {isIg && copied ? 'Copied!' : p.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Copy link row */}
        <div style={{ margin: '32px 24px 0', display: 'flex', gap: 12, alignItems: 'center', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--on-surface-variant)', opacity: 0.6 }}>link</span>
          <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
            {shareUrl}
          </span>
          <button onClick={copyLink} className="btn btn-primary" style={{ padding: '8px 24px', fontSize: 13, borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
            {copied ? 'Tersalin ✓' : 'Salin Link'}
          </button>
        </div>
      </div>
    </>
  );
}
