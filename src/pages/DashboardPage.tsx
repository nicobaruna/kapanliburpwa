import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Holiday, type LongWeekend } from '../data/holidays2026';
import {
  getNextHoliday,
  getUpcomingHolidays,
  getNextLongWeekend,
  getDaysUntil,
  formatDate,
  formatLongWeekendRange,
  countdownLabel,
} from '../utils/dateUtils';

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

export default function DashboardPage() {
  const navigate = useNavigate();
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null);
  const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([]);
  const [nextLongWeekend, setNextLongWeekend] = useState<LongWeekend | null>(null);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    setNextHoliday(getNextHoliday());
    setUpcomingHolidays(getUpcomingHolidays(6));
    setNextLongWeekend(getNextLongWeekend());
  }, []);

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Browser ini tidak mendukung notifikasi.');
      return;
    }
    setNotifLoading(true);
    const permission = await Notification.requestPermission();
    setNotifLoading(false);
    if (permission === 'granted') {
      setNotifEnabled(true);
    } else {
      alert('Izin notifikasi ditolak. Aktifkan di pengaturan browser.');
    }
  };

  const daysUntilNext = nextHoliday ? getDaysUntil(nextHoliday.date) : null;

  return (
    <div className="page" style={{ backgroundColor: C.bg }}>
      {/* Header */}
      <div style={{
        backgroundColor: C.red,
        padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(200,16,46,0.3)',
      }}>
        <h1 style={{ color: C.white, fontSize: 22, fontWeight: 800, letterSpacing: 0.5 }}>
          🇮🇩 Libur Indonesia
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
          Kalender BI 2026
        </p>
      </div>

      <div style={{ padding: 16, paddingBottom: 40 }}>
        {/* Countdown card */}
        {nextHoliday ? (
          <div style={{
            backgroundColor: C.red,
            borderRadius: 20,
            padding: 24,
            textAlign: 'center',
            marginBottom: 16,
            boxShadow: '0 4px 16px rgba(200,16,46,0.35)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{nextHoliday.emoji}</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
              Libur Berikutnya
            </div>
            <div style={{ color: C.white, fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
              {nextHoliday.shortName}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 16 }}>
              {formatDate(nextHoliday.date)}
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 50,
              padding: '10px 28px',
              display: 'inline-block',
              marginBottom: 14,
              minWidth: 120,
            }}>
              <div style={{ color: C.white, fontSize: 34, fontWeight: 900, lineHeight: 1.1 }}>
                {daysUntilNext === 0 ? '🎉 Hari ini!' : daysUntilNext === 1 ? '⏰ Besok!' : daysUntilNext}
              </div>
              {daysUntilNext !== null && daysUntilNext > 1 && (
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600 }}>
                  hari lagi
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {nextHoliday.type.includes('nasional') && (
                <span style={{
                  borderRadius: 20, padding: '5px 12px',
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: C.white, fontSize: 12, fontWeight: 600,
                }}>🏛 Libur Nasional</span>
              )}
              {nextHoliday.type.includes('cuti_bersama') && (
                <span style={{
                  borderRadius: 20, padding: '5px 12px',
                  backgroundColor: 'rgba(255,200,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: C.white, fontSize: 12, fontWeight: 600,
                }}>📅 Cuti Bersama</span>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: C.red, borderRadius: 20, padding: 24,
            textAlign: 'center', marginBottom: 16,
          }}>
            <div style={{ fontSize: 48 }}>✅</div>
            <div style={{ color: C.white, fontSize: 20, fontWeight: 900 }}>
              Semua libur 2026 selesai!
            </div>
          </div>
        )}

        {/* Long weekend card */}
        {nextLongWeekend && (
          <div style={{
            backgroundColor: C.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderLeft: `4px solid ${C.green}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 10 }}>
              <span style={{ fontSize: 28 }}>🏖️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: C.textSub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Long Weekend Berikutnya
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{nextLongWeekend.label}</div>
              </div>
              <div style={{
                backgroundColor: C.green, borderRadius: 12,
                padding: '6px 12px', textAlign: 'center',
              }}>
                <div style={{ color: C.white, fontSize: 20, fontWeight: 900, lineHeight: 1.1 }}>
                  {nextLongWeekend.totalDays}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: 600 }}>hari</div>
              </div>
            </div>
            <div style={{ color: C.textSub, fontSize: 14, marginBottom: 4 }}>
              📅 {formatLongWeekendRange(nextLongWeekend)}
            </div>
            <div style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>
              ⏳ {countdownLabel(getDaysUntil(nextLongWeekend.startDate))}
            </div>
          </div>
        )}

        {/* Upcoming holidays */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 10, paddingLeft: 2 }}>
            Jadwal Libur Mendatang
          </h2>
          {upcomingHolidays.map(holiday => {
            const days = getDaysUntil(holiday.date);
            const isCuti = holiday.type.includes('cuti_bersama');
            return (
              <div
                key={holiday.id}
                onClick={() => navigate('/kalender')}
                style={{
                  backgroundColor: C.card,
                  borderRadius: 12,
                  marginBottom: 8,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ height: 3, backgroundColor: isCuti ? C.cuti : C.national }} />
                <div style={{ display: 'flex', alignItems: 'center', padding: 12, gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{holiday.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{holiday.shortName}</div>
                    <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>{formatDate(holiday.date)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: days <= 7 ? C.red : C.text }}>
                      {days === 0 ? 'Hari ini' : days === 1 ? 'Besok' : `${days}h`}
                    </div>
                    {days > 1 && <div style={{ fontSize: 11, color: C.textSub }}>lagi</div>}
                  </div>
                </div>
                {isCuti && (
                  <div style={{
                    position: 'absolute' as const,
                    backgroundColor: C.cuti,
                    padding: '2px 8px',
                    borderBottomLeftRadius: 8,
                  }}>
                    <span style={{ color: C.white, fontSize: 10, fontWeight: 700 }}>Cuti</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Notification section */}
        <div style={{
          backgroundColor: C.card,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 6 }}>
            🔔 Aktifkan Pengingat
          </div>
          <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6, marginBottom: 16 }}>
            Dapatkan notifikasi otomatis H-7 dan H-1 sebelum setiap hari libur nasional dan cuti bersama.
          </p>
          <button
            onClick={notifEnabled ? undefined : handleEnableNotifications}
            disabled={notifLoading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: notifEnabled ? C.green : C.red,
              color: C.white,
              fontSize: 15,
              fontWeight: 800,
              cursor: notifEnabled ? 'default' : 'pointer',
              opacity: notifLoading ? 0.7 : 1,
            }}
          >
            {notifLoading ? '...' : notifEnabled ? '✅ Pengingat Aktif' : '🔔 Aktifkan Pengingat'}
          </button>
        </div>

        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <p style={{ color: C.textSub, fontSize: 11, lineHeight: 1.6 }}>
            Data resmi Bank Indonesia 2026{'\n'}
            Sumber: Keputusan Bersama Menteri RI
          </p>
        </div>
      </div>
    </div>
  );
}
