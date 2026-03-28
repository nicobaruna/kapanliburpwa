import { HOLIDAYS_2026 } from '../data/holidays2026';
import { getDaysUntil } from '../utils/dateUtils';

const ENABLED_KEY = 'kapanlibur_reminders_enabled';
const LAST_FIRED_KEY = 'kapanlibur_reminders_last_fired';
const ICON = '/icon-192.png';

export function isRemindersEnabled(): boolean {
  return localStorage.getItem(ENABLED_KEY) === 'true';
}

/** Request permission + store enabled + show confirmation. Returns true if granted. */
export async function enableReminders(): Promise<boolean> {
  if (!('Notification' in window)) return false;

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') return false;

  localStorage.setItem(ENABLED_KEY, 'true');

  new Notification('KapanLibur — Pengingat Aktif 🔔', {
    body: 'Kamu akan mendapat pengingat H-5 hingga H-1 sebelum setiap hari libur nasional.',
    icon: ICON,
    tag: 'reminder-activated',
  });

  return true;
}

export function disableReminders(): void {
  localStorage.removeItem(ENABLED_KEY);
  localStorage.removeItem(LAST_FIRED_KEY);
}

/**
 * Call once per app session (e.g. in App.tsx useEffect).
 * Fires a notification for each holiday that is H-5 … H-1 away,
 * but only once per calendar day.
 */
export function checkAndFireReminders(): void {
  if (!isRemindersEnabled()) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const todayStr = new Date().toISOString().split('T')[0];
  if (localStorage.getItem(LAST_FIRED_KEY) === todayStr) return;

  const THRESHOLDS = [5, 4, 3, 2, 1];
  let fired = false;

  for (const holiday of HOLIDAYS_2026) {
    const days = getDaysUntil(holiday.date);
    if (!THRESHOLDS.includes(days)) continue;

    fired = true;
    const label = days === 1 ? 'besok' : `${days} hari lagi`;
    new Notification(`${holiday.emoji} ${holiday.shortName} — ${label}!`, {
      body:
        days === 1
          ? `"${holiday.name}" adalah besok. Selamat berlibur! 🎉`
          : `"${holiday.name}" tinggal ${days} hari lagi. Yuk siapkan rencanamu di KapanLibur!`,
      icon: ICON,
      tag: `holiday-${holiday.id}-H${days}`,
    });
  }

  if (fired) {
    localStorage.setItem(LAST_FIRED_KEY, todayStr);
  }
}
