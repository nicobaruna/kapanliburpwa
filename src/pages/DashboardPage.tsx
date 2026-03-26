import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import {
  getNextHoliday,
  getUpcomingHolidays,
  getNextLongWeekend,
  getDaysUntil,
  formatDate,
  formatLongWeekendRange,
  countdownLabel,
} from '../utils/dateUtils';
import type { Holiday, LongWeekend } from '../data/holidays2026';

export default function DashboardPage() {
  const { user } = useUser();
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null);
  const [upcoming, setUpcoming] = useState<Holiday[]>([]);
  const [nextLW, setNextLW] = useState<LongWeekend | null>(null);
  const [notifState, setNotifState] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');

  useEffect(() => {
    setNextHoliday(getNextHoliday());
    setUpcoming(getUpcomingHolidays(6));
    setNextLW(getNextLongWeekend());
    if ('Notification' in window && Notification.permission === 'granted') setNotifState('granted');
  }, []);

  async function handleNotif() {
    if (!('Notification' in window)) return;
    setNotifState('loading');
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      new Notification('🇮🇩 KapanLibur', { body: 'Notifikasi hari libur berhasil diaktifkan!' });
      setNotifState('granted');
    } else {
      setNotifState('denied');
    }
  }

  const daysUntil = nextHoliday ? getDaysUntil(nextHoliday.date) : null;

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'var(--red)',
        padding: '16px 16px 20px',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 2 }}>
          Selamat datang, {user?.name} 👋
        </p>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>🇮🇩 Libur Indonesia</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>Kalender BI 2026</p>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Countdown Card */}
        {nextHoliday ? (
          <div style={{
            background: 'var(--red)',
            borderRadius: 20,
            padding: '24px',
            textAlign: 'center',
            marginBottom: 14,
            boxShadow: '0 4px 20px rgba(200,16,46,0.35)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{nextHoliday.emoji}</div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
              Libur Berikutnya
            </p>
            <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 4 }}>
              {nextHoliday.shortName}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 16 }}>
              {formatDate(nextHoliday.date)}
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 50,
              padding: '10px 28px',
              display: 'inline-block',
              marginBottom: 14,
            }}>
              <div style={{ color: '#fff', fontSize: 36, fontWeight: 900, lineHeight: 1 }}>
                {daysUntil === 0 ? '🎉' : daysUntil === 1 ? '⏰' : daysUntil}
              </div>
              {daysUntil !== null && daysUntil > 1 && (
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600 }}>hari lagi</div>
              )}
              {daysUntil === 0 && <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Hari ini!</div>}
              {daysUntil === 1 && <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600 }}>Besok!</div>}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {nextHoliday.type.includes('nasional') && (
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 20,
                  padding: '5px 12px',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                }}>🏛 Libur Nasional</span>
              )}
              {nextHoliday.type.includes('cuti_bersama') && (
                <span style={{
                  background: 'rgba(255,200,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 20,
                  padding: '5px 12px',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                }}>📅 Cuti Bersama</span>
              )}
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 48 }}>✅</div>
            <p style={{ fontWeight: 700, marginTop: 8 }}>Semua libur 2026 selesai!</p>
          </div>
        )}

        {/* Long Weekend Card */}
        {nextLW && (
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 16,
            marginBottom: 14,
            borderLeft: '4px solid #27AE60',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>🏖️</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Long Weekend Berikutnya
                </p>
                <p style={{ fontSize: 16, fontWeight: 800 }}>{nextLW.label}</p>
              </div>
              <div style={{ background: '#27AE60', borderRadius: 12, padding: '6px 12px', textAlign: 'center' }}>
                <div style={{ color: '#fff', fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{nextLW.totalDays}</div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: 600 }}>hari</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-sub)', fontSize: 14, marginBottom: 4 }}>
              📅 {formatLongWeekendRange(nextLW)}
            </p>
            <p style={{ color: '#27AE60', fontSize: 14, fontWeight: 700 }}>
              ⏳ {countdownLabel(getDaysUntil(nextLW.startDate))}
            </p>
          </div>
        )}

        {/* Upcoming Holidays */}
        <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10, paddingLeft: 2 }}>
          Jadwal Libur Mendatang
        </h3>
        {upcoming.map(h => {
          const days = getDaysUntil(h.date);
          const isCuti = h.type.includes('cuti_bersama') && !h.type.includes('nasional');
          return (
            <div key={h.id} style={{
              background: '#fff',
              borderRadius: 12,
              marginBottom: 8,
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <div style={{ height: 3, background: isCuti ? '#E67E22' : 'var(--red)' }} />
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{h.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 700 }}>{h.shortName}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 2 }}>{formatDate(h.date)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 18, fontWeight: 900, color: days <= 7 ? 'var(--red)' : 'var(--text)' }}>
                    {days === 0 ? 'Hari ini' : days === 1 ? 'Besok' : `${days}h`}
                  </p>
                  {days > 1 && <p style={{ fontSize: 11, color: 'var(--text-sub)' }}>lagi</p>}
                </div>
              </div>
            </div>
          );
        })}

        {/* Notification */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 20,
          margin: '16px 0',
          border: '1px solid var(--border)',
        }}>
          <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>🔔 Aktifkan Pengingat</p>
          <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: 16 }}>
            Dapatkan notifikasi otomatis sebelum setiap hari libur nasional dan cuti bersama.
          </p>
          {notifState === 'denied' ? (
            <p style={{ fontSize: 13, color: 'var(--text-sub)', textAlign: 'center' }}>
              Notifikasi diblokir. Aktifkan di pengaturan browser.
            </p>
          ) : (
            <button
              className="btn btn-full"
              onClick={notifState === 'granted' ? undefined : handleNotif}
              disabled={notifState === 'loading'}
              style={{
                background: notifState === 'granted' ? '#27AE60' : 'var(--red)',
                color: '#fff',
                opacity: notifState === 'loading' ? 0.7 : 1,
              }}
            >
              {notifState === 'loading' ? 'Meminta izin...' :
               notifState === 'granted' ? '✅ Pengingat Aktif' :
               '🔔 Aktifkan Pengingat'}
            </button>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: 'var(--text-sub)', fontSize: 11, padding: '8px 0 24px', lineHeight: 1.7 }}>
          Data resmi Bank Indonesia 2026{'\n'}Sumber: Keputusan Bersama Menteri RI
        </p>
      </div>
    </div>
  );
}
