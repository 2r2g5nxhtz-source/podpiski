import { daysUntil, today } from './dates'
import { loadSubscriptions, loadSettings } from './storage'
import { CURRENCY_SYMBOLS } from './constants'

export async function requestPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  const result = await Notification.requestPermission()
  return result
}

export function getPermissionStatus() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

export function canNotify() {
  return 'Notification' in window && Notification.permission === 'granted'
}

// Show an immediate notification
function showNotification(title, body, tag) {
  if (!canNotify()) return
  try {
    new Notification(title, { body, tag, icon: '/icon-192.png', badge: '/icon-192.png' })
  } catch {
    // iOS requires SW-based notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, { body, tag, icon: '/icon-192.png' })
      })
    }
  }
}

// Check and fire due notifications
export function checkAndNotify() {
  const settings = loadSettings()
  if (!settings.notifications_enabled || !canNotify()) return

  const subs = loadSubscriptions()
  const notifyDays = settings.notify_days_before || 3
  const todayStr = today()

  subs.forEach((sub) => {
    if (sub.paused) return

    // Payment reminder
    const days = daysUntil(sub.next_charge_date)
    if (days >= 0 && days <= notifyDays) {
      const sym = CURRENCY_SYMBOLS[sub.currency] || sub.currency
      const tag = `payment-${sub.id}-${sub.next_charge_date}`
      let body
      if (days === 0) {
        body = `Сегодня спишется ${sym}${sub.amount} за ${sub.name}`
      } else if (days === 1) {
        body = `Завтра спишется ${sym}${sub.amount} за ${sub.name}`
      } else {
        body = `Через ${days} дн. спишется ${sym}${sub.amount} за ${sub.name}`
      }
      showNotification('SubTracker — Напоминание', body, tag)
    }

    // Trial end reminder
    if (sub.trial_end_date) {
      const trialDays = daysUntil(sub.trial_end_date)
      if (trialDays >= 0 && trialDays <= 2) {
        const tag = `trial-${sub.id}-${sub.trial_end_date}`
        const body =
          trialDays === 0
            ? `Сегодня заканчивается пробный период ${sub.name}`
            : trialDays === 1
            ? `Завтра заканчивается пробный период ${sub.name}`
            : `Через 2 дня заканчивается пробный период ${sub.name}`
        showNotification('SubTracker — Пробный период', body, tag)
      }
    }
  })
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        // SW registered
      })
      .catch(() => {
        // SW registration failed (dev mode)
      })
  }
}
