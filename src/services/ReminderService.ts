import { getUpcomingHolidays, getNextLongWeekend, getDaysUntil } from '../utils/dateUtils';
import { HOLIDAYS_2026 } from '../data/holidays2026';

const NOTIFIED_KEY = 'kapanlibur_notified_ids';
const ENABLED_KEY = 'kapanlibur_reminders_enabled';
const H_MINUS = 5;

// ── Storage helpers ────────────────────────────────────────────────────────────

function getNotifiedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markNotified(id: string) {
  const ids = getNotifiedIds();
  ids.add(id);
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...ids]));
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function isReminderEnabled(): boolean {
  if (!('Notification' in window)) return false;
  return localStorage.getItem(ENABLED_KEY) === 'true' && Notification.permission === 'granted';
}

export async function enableReminders(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (!('Notification' in window)) return 'unsupported';

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  if (permission === 'granted') {
    localStorage.setItem(ENABLED_KEY, 'true');
    return 'granted';
  }

  return 'denied';
}

export function disableReminders() {
  localStorage.setItem(ENABLED_KEY, 'false');
}

/**
 * Fire a browser notification. `onclick` navigates to /dashboard.
 */
function fire(title: string, body: string, tag: string) {
  const notif = new Notification(title, {
    body,
    tag,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    requireInteraction: false,
  });

  notif.onclick = () => {
    window.focus();
    window.location.pathname = '/dashboard';
    notif.close();
  };

  markNotified(tag);
}

/**
 * Called on Dashboard mount — checks all upcoming holidays & long weekends
 * and fires a notification for any that are H-5 or within H-5 if
 * they haven't been notified yet this cycle.
 */
export function checkAndFireReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!isReminderEnabled()) return;

  const notified = getNotifiedIds();

  // ── Holidays ───────────────────────────────────────────────────────────────
  const holidays = getUpcomingHolidays(20);
  for (const h of holidays) {
    const daysLeft = getDaysUntil(h.date);
    if (daysLeft < 0 || daysLeft > H_MINUS) continue;

    const tag = `holiday_${h.id}_d${daysLeft}`;
    if (notified.has(tag)) continue;

    const dateStr = new Date(h.date).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
    fire(
      `${h.emoji} ${daysLeft === 0 ? 'Hari ini' : `H-${daysLeft}`}: ${h.name}`,
      `${h.name} jatuh pada ${dateStr}. Yuk rencanakan liburanmu di KapanLibur! 🌴`,
      tag,
    );
  }

  // ── Long Weekend ───────────────────────────────────────────────────────────
  const lw = getNextLongWeekend();
  if (!lw) return;

  const daysLeft = getDaysUntil(lw.startDate);
  if (daysLeft < 0 || daysLeft > H_MINUS) return;

  const tag = `lw_${lw.startDate}_d${daysLeft}`;
  if (notified.has(tag)) return;

  const startStr = new Date(lw.startDate).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long',
  });
  fire(
    `🏖️ Long Weekend dalam ${daysLeft === 0 ? 'hari ini' : `${daysLeft} hari`}!`,
    `${lw.label} — ${lw.totalDays} hari berturut-turut mulai ${startStr}. Booking sekarang!`,
    tag,
  );
}