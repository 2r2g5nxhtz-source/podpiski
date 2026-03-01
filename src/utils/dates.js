export function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function today() {
  return formatDate(new Date())
}

// Days until date (negative = overdue)
export function daysUntil(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((dateOnly - nowOnly) / (1000 * 60 * 60 * 24))
}

export function isOverdue(subscription) {
  if (subscription.paused) return false
  return daysUntil(subscription.next_charge_date) < 0
}

export function getStatus(subscription) {
  if (subscription.paused) return 'paused'
  if (isOverdue(subscription)) return 'overdue'
  return 'active'
}

export function addPeriod(dateStr, period) {
  const d = new Date(dateStr)
  switch (period) {
    case 'week':
      d.setDate(d.getDate() + 7)
      break
    case 'month':
      d.setMonth(d.getMonth() + 1)
      break
    case 'year':
      d.setFullYear(d.getFullYear() + 1)
      break
  }
  return formatDate(d)
}

// When marking payment: if overdue, count from today
export function calcNextChargeDate(subscription) {
  const base = isOverdue(subscription) ? today() : subscription.next_charge_date
  return addPeriod(base, subscription.period)
}

export function formatDaysLabel(dateStr) {
  const days = daysUntil(dateStr)
  if (days < 0) return `Просрочено ${Math.abs(days)} дн.`
  if (days === 0) return 'Сегодня'
  if (days === 1) return 'Завтра'
  if (days < 7) return `Через ${days} дн.`
  return formatDateRu(dateStr)
}

export function formatDateRu(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

// Monthly equivalent amount
export function monthlyAmount(subscription) {
  switch (subscription.period) {
    case 'week': return subscription.amount * 4.3
    case 'month': return subscription.amount
    case 'year': return subscription.amount / 12
    default: return subscription.amount
  }
}
