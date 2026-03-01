import React, { useState, useEffect, useCallback } from 'react'
import SubscriptionCard from '../components/SubscriptionCard'
import FAB from '../components/FAB'
import { loadSubscriptions } from '../utils/storage'
import { getStatus, daysUntil } from '../utils/dates'
import { CATEGORIES, CURRENCIES, SORT_OPTIONS, STATUS_FILTERS } from '../utils/constants'

function todayLabel() {
  return new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
}

function applyFiltersAndSort(subs, { search, sortBy, categoryFilter, currencyFilter, statusFilter }) {
  let result = [...subs]

  // Search
  if (search.trim()) {
    const q = search.toLowerCase()
    result = result.filter((s) => s.name.toLowerCase().includes(q))
  }

  // Category filter
  if (categoryFilter && categoryFilter !== 'all') {
    result = result.filter((s) => s.category === categoryFilter)
  }

  // Currency filter
  if (currencyFilter && currencyFilter !== 'all') {
    result = result.filter((s) => s.currency === currencyFilter)
  }

  // Status filter
  if (statusFilter && statusFilter !== 'all') {
    result = result.filter((s) => getStatus(s) === statusFilter)
  }

  // Sort
  switch (sortBy) {
    case 'date_asc':
      result.sort((a, b) => new Date(a.next_charge_date) - new Date(b.next_charge_date))
      break
    case 'amount_desc':
      result.sort((a, b) => b.amount - a.amount)
      break
    case 'amount_asc':
      result.sort((a, b) => a.amount - b.amount)
      break
    case 'name_asc':
      result.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
      break
    default:
      result.sort((a, b) => new Date(a.next_charge_date) - new Date(b.next_charge_date))
  }

  return result
}

export default function HomeScreen({ navigate }) {
  const [subscriptions, setSubscriptions] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date_asc')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currencyFilter, setCurrencyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const reload = useCallback(() => {
    setSubscriptions(loadSubscriptions())
  }, [])

  useEffect(() => {
    reload()
    // Reload when app comes to foreground
    const handleFocus = () => reload()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [reload])

  const filtered = applyFiltersAndSort(subscriptions, {
    search, sortBy, categoryFilter, currencyFilter, statusFilter,
  })

  const hasActiveFilters = categoryFilter !== 'all' || currencyFilter !== 'all' || statusFilter !== 'all'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingBottom: '12px',
          background: 'var(--bg-primary)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            SubTracker
          </h1>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
          {todayLabel()}
        </p>

        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-input)',
            borderRadius: '12px',
            padding: '10px 14px',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="var(--text-secondary)" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск подписок..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
            >
              ×
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-press"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              background: showFilters || hasActiveFilters ? 'var(--accent-light)' : 'transparent',
              color: showFilters || hasActiveFilters ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: '500',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Фильтры {hasActiveFilters && '●'}
          </button>

          {/* Sort pills */}
          <div style={{ display: 'flex', gap: '6px', overflow: 'auto', paddingRight: '4px' }}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className="btn-press"
                style={{
                  padding: '7px 12px',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  background: sortBy === opt.key ? 'var(--accent-light)' : 'transparent',
                  color: sortBy === opt.key ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  fontWeight: sortBy === opt.key ? '600' : '400',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div
            style={{
              marginTop: '12px',
              padding: '14px',
              background: 'var(--bg-card)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Status filter */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
                СТАТУС
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className="btn-press"
                    style={{
                      padding: '5px 12px',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      background: statusFilter === f.key ? 'var(--accent)' : 'var(--bg-input)',
                      color: statusFilter === f.key ? '#fff' : 'var(--text-secondary)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
                КАТЕГОРИЯ
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="btn-press"
                  style={{
                    padding: '5px 12px',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    background: categoryFilter === 'all' ? 'var(--accent)' : 'var(--bg-input)',
                    color: categoryFilter === 'all' ? '#fff' : 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Все
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCategoryFilter(cat.key)}
                    className="btn-press"
                    style={{
                      padding: '5px 12px',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      background: categoryFilter === cat.key ? cat.color : 'var(--bg-input)',
                      color: categoryFilter === cat.key ? '#fff' : 'var(--text-secondary)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency filter */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
                ВАЛЮТА
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setCurrencyFilter('all')}
                  className="btn-press"
                  style={{
                    padding: '5px 16px',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    background: currencyFilter === 'all' ? 'var(--accent)' : 'var(--bg-input)',
                    color: currencyFilter === 'all' ? '#fff' : 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Все
                </button>
                {CURRENCIES.map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrencyFilter(cur)}
                    className="btn-press"
                    style={{
                      padding: '5px 16px',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      background: currencyFilter === cur ? 'var(--accent)' : 'var(--bg-input)',
                      color: currencyFilter === cur ? '#fff' : 'var(--text-secondary)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={() => { setCategoryFilter('all'); setCurrencyFilter('all'); setStatusFilter('all') }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--error)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  padding: '0',
                }}
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        )}
      </div>

      {/* List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '4px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              paddingTop: '60px',
              gap: '16px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '64px' }}>📋</span>
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {search || hasActiveFilters ? 'Ничего не найдено' : 'Нет подписок'}
              </h2>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.4', maxWidth: '260px' }}>
                {search || hasActiveFilters
                  ? 'Попробуйте изменить запрос или фильтры'
                  : 'Добавьте первую подписку, чтобы начать отслеживать расходы'}
              </p>
            </div>
            {!search && !hasActiveFilters && (
              <button
                onClick={() => navigate('form', { mode: 'add' })}
                className="btn-press"
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  background: 'var(--accent)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Добавить подписку
              </button>
            )}
          </div>
        ) : (
          filtered.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onClick={() => navigate('detail', { id: sub.id })}
            />
          ))
        )}
      </div>

      <FAB onClick={() => navigate('form', { mode: 'add' })} />
    </div>
  )
}
