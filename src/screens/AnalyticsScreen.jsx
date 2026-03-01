import React, { useState, useEffect, useCallback } from 'react'
import { loadSubscriptions, updateSubscription } from '../utils/storage'
import { getStatus, daysUntil, formatDateShort, monthlyAmount, calcNextChargeDate, formatDaysLabel } from '../utils/dates'
import { CURRENCY_SYMBOLS, CATEGORIES } from '../utils/constants'

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '14px 12px',
        textAlign: 'center',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ fontSize: '26px', fontWeight: '800', color: color || 'var(--text-primary)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h3
      style={{
        margin: '0 0 12px',
        fontSize: '16px',
        fontWeight: '700',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </h3>
  )
}

export default function AnalyticsScreen({ navigate }) {
  const [subs, setSubs] = useState([])

  const reload = useCallback(() => setSubs(loadSubscriptions()), [])

  useEffect(() => {
    reload()
    const onFocus = () => reload()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [reload])

  const active = subs.filter((s) => getStatus(s) === 'active')
  const paused = subs.filter((s) => s.paused)
  const overdue = subs.filter((s) => getStatus(s) === 'overdue')

  // Monthly costs per currency
  const monthlyCosts = {}
  active.forEach((s) => {
    const curr = s.currency
    if (!monthlyCosts[curr]) monthlyCosts[curr] = 0
    monthlyCosts[curr] += monthlyAmount(s)
  })

  // Upcoming charges in 7 days
  const upcoming = subs
    .filter((s) => !s.paused)
    .filter((s) => {
      const d = daysUntil(s.next_charge_date)
      return d >= 0 && d <= 7
    })
    .sort((a, b) => new Date(a.next_charge_date) - new Date(b.next_charge_date))

  const handleMarkPaid = (sub) => {
    const newDate = calcNextChargeDate(sub)
    updateSubscription(sub.id, { next_charge_date: newDate })
    reload()
  }

  const sym = (currency) => CURRENCY_SYMBOLS[currency] || currency

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
          padding: 'calc(env(safe-area-inset-top) + 16px) 20px 16px',
          background: 'var(--bg-primary)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
          Аналитика
        </h1>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', minHeight: 0, padding: '4px 16px 32px' }}>

        {/* Summary stats */}
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle>Сводка</SectionTitle>
          <div style={{ display: 'flex', gap: '10px' }}>
            <StatCard label="Активных" value={active.length} color="var(--success)" />
            <StatCard label="На паузе" value={paused.length} color="var(--paused)" />
            <StatCard label="Просрочено" value={overdue.length} color={overdue.length > 0 ? 'var(--error)' : 'var(--text-secondary)'} />
          </div>
        </div>

        {/* Monthly costs */}
        {Object.keys(monthlyCosts).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <SectionTitle>Расходы в месяц</SectionTitle>
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                padding: '4px 0',
                boxShadow: 'var(--shadow)',
              }}
            >
              {Object.entries(monthlyCosts).map(([currency, amount], i, arr) => (
                <div
                  key={currency}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--accent-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'var(--accent)',
                      }}
                    >
                      {currency}
                    </div>
                    <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>в месяц</span>
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {sym(currency)}{amount.toFixed(2)}
                  </span>
                </div>
              ))}
              {Object.entries(monthlyCosts).map(([currency, amount]) => (
                <div
                  key={`${currency}-year`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 16px',
                    background: 'var(--accent-light)',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '13px', color: 'var(--accent)' }}>{currency} в год</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent)' }}>
                    ≈ {sym(currency)}{(amount * 12).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category breakdown */}
        {active.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <SectionTitle>По категориям</SectionTitle>
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '4px 0', boxShadow: 'var(--shadow)' }}>
              {CATEGORIES.map((cat) => {
                const catSubs = active.filter((s) => s.category === cat.key)
                if (catSubs.length === 0) return null
                return (
                  <div
                    key={cat.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '20px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `${cat.color}18`,
                        borderRadius: '10px',
                      }}
                    >
                      {cat.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '500' }}>{cat.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {catSubs.length} подписк{catSubs.length === 1 ? 'а' : 'и'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {(() => {
                        const byCurrency = {}
                        catSubs.forEach((s) => {
                          byCurrency[s.currency] = (byCurrency[s.currency] || 0) + monthlyAmount(s)
                        })
                        return Object.entries(byCurrency).map(([cur, amt]) => (
                          <div key={cur} style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {sym(cur)}{amt.toFixed(2)}/мес
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Upcoming 7 days */}
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle>Ближайшие списания (7 дней)</SectionTitle>
          {upcoming.length === 0 ? (
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '15px',
                boxShadow: 'var(--shadow)',
              }}
            >
              Нет списаний в ближайшие 7 дней
            </div>
          ) : (
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
              {upcoming.map((sub, i) => (
                <div
                  key={sub.id}
                  onClick={() => navigate('detail', { id: sub.id })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderBottom: i < upcoming.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{sub.icon || CATEGORIES.find((c) => c.key === sub.category)?.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{sub.name}</div>
                    <div style={{ fontSize: '13px', color: daysUntil(sub.next_charge_date) === 0 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                      {formatDaysLabel(sub.next_charge_date)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {sym(sub.currency)}{sub.amount}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {formatDateShort(sub.next_charge_date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue */}
        {overdue.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <SectionTitle>Просроченные</SectionTitle>
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
              {overdue.map((sub, i) => (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderBottom: i < overdue.length - 1 ? '1px solid var(--border)' : 'none',
                    borderLeft: '3px solid var(--error)',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{sub.icon || CATEGORIES.find((c) => c.key === sub.category)?.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{sub.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--error)' }}>
                      {formatDaysLabel(sub.next_charge_date)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {sym(sub.currency)}{sub.amount}
                    </div>
                    <button
                      onClick={() => handleMarkPaid(sub)}
                      className="btn-press"
                      style={{
                        padding: '5px 12px',
                        borderRadius: '8px',
                        background: 'var(--success)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Оплачено
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {subs.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '60px',
              gap: '12px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ fontSize: '48px' }}>📊</span>
            <p style={{ margin: 0, fontSize: '16px' }}>Добавьте подписки, чтобы видеть аналитику</p>
          </div>
        )}
      </div>
    </div>
  )
}
