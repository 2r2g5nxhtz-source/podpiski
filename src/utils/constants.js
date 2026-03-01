export const CATEGORIES = [
  { key: 'streaming', label: 'Стриминг', color: '#E53935', icon: '🎬' },
  { key: 'music', label: 'Музыка', color: '#8E24AA', icon: '🎵' },
  { key: 'cloud', label: 'Облако', color: '#1E88E5', icon: '☁️' },
  { key: 'games', label: 'Игры', color: '#43A047', icon: '🎮' },
  { key: 'software', label: 'Программы', color: '#FB8C00', icon: '💻' },
  { key: 'news', label: 'Новости', color: '#6D4C41', icon: '📰' },
  { key: 'fitness', label: 'Фитнес', color: '#00ACC1', icon: '💪' },
  { key: 'other', label: 'Другое', color: '#757575', icon: '📦' },
]

export const CURRENCIES = ['USD', 'RUB', 'TMT']

export const CURRENCY_SYMBOLS = {
  USD: '$',
  RUB: '₽',
  TMT: 'm',
}

export const PERIODS = [
  { key: 'week', label: 'Неделя' },
  { key: 'month', label: 'Месяц' },
  { key: 'year', label: 'Год' },
]

export const SORT_OPTIONS = [
  { key: 'date_asc', label: 'По дате (ближайшие)' },
  { key: 'amount_desc', label: 'По стоимости (↓)' },
  { key: 'amount_asc', label: 'По стоимости (↑)' },
  { key: 'name_asc', label: 'По названию (А→Я)' },
]

export const STATUS_FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'Активные' },
  { key: 'paused', label: 'На паузе' },
  { key: 'overdue', label: 'Просрочены' },
]

export const COMMON_EMOJIS = [
  '🎬', '🎵', '☁️', '🎮', '💻', '📰', '💪', '📦',
  '📺', '🎧', '🎯', '📚', '🎓', '🏠', '🚗', '✈️',
  '🌍', '🔒', '💊', '🍕', '🎲', '🔧', '📊', '📱',
  '💡', '🛒', '🎁', '⭐', '🔑', '📧', '🎨', '🏆',
  '🌟', '💰', '🔔', '📅', '🗂️', '🎪', '🎹', '🎸',
  '🥊', '🧘', '🚴', '🏊', '🎾', '🌈', '🌙', '⚡',
  '🔥', '💫', '🎊', '🎉', '🦊', '🦁', '🐉', '🌺',
  '🍎', '☕', '🍦', '🎂', '🌸', '🏋️', '🎻', '🎿',
]
