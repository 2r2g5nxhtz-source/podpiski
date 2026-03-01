const STORAGE_KEY = 'subtracker_data'

const DEFAULT_SETTINGS = {
  theme: 'dark',
  notify_days_before: 3,
  notifications_enabled: true,
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { subscriptions: [], settings: { ...DEFAULT_SETTINGS } }
    const parsed = JSON.parse(raw)
    return {
      subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    }
  } catch {
    return { subscriptions: [], settings: { ...DEFAULT_SETTINGS } }
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function loadSubscriptions() {
  return loadData().subscriptions
}

export function saveSubscriptions(subscriptions) {
  const data = loadData()
  data.subscriptions = subscriptions
  saveData(data)
}

export function loadSettings() {
  return loadData().settings
}

export function saveSettings(settings) {
  const data = loadData()
  data.settings = { ...data.settings, ...settings }
  saveData(data)
}

export function addSubscription(subscription) {
  const subs = loadSubscriptions()
  subs.push(subscription)
  saveSubscriptions(subs)
}

export function updateSubscription(id, updates) {
  const subs = loadSubscriptions()
  const idx = subs.findIndex((s) => s.id === id)
  if (idx >= 0) {
    subs[idx] = { ...subs[idx], ...updates }
    saveSubscriptions(subs)
    return subs[idx]
  }
  return null
}

export function deleteSubscription(id) {
  saveSubscriptions(loadSubscriptions().filter((s) => s.id !== id))
}

export function getSubscription(id) {
  return loadSubscriptions().find((s) => s.id === id) || null
}

export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

// Validate imported data structure
export function validateImportData(data) {
  if (!data || typeof data !== 'object') return false
  if (!Array.isArray(data.subscriptions)) return false
  for (const s of data.subscriptions) {
    if (!s.id || !s.name || s.amount === undefined || !s.currency || !s.period || !s.next_charge_date) {
      return false
    }
  }
  return true
}

// Merge imported subscriptions (no duplicates by id)
export function mergeSubscriptions(newSubs) {
  const existing = loadSubscriptions()
  const existingIds = new Set(existing.map((s) => s.id))
  const merged = [...existing, ...newSubs.filter((s) => !existingIds.has(s.id))]
  saveSubscriptions(merged)
  return { added: newSubs.filter((s) => !existingIds.has(s.id)).length, total: merged.length }
}
