import React from 'react'
import { getStatus, formatDaysLabel, daysUntil } from '../utils/dates'
import { CURRENCY_SYMBOLS, CATEGORIES } from '../utils/constants'

const STATUS_CONFIG = {
  active: { label: 'Активна', bg: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' },
  paused: { label: 'На паузе', bg: 'rgba(117, 117, 117, 0.15)', color: '#757575' },
  overdue: { label: 'Просрочена', bg: 'rgba(255, 82, 82, 0.15)', color: '#FF5252' },
}

export default function SubscriptionCard({ subscription, onClick }) {
  const status = getStatus(subscription)
  const statusCfg = STATUS_CONFIG[status]
  const sym = CURRENCY_SYMBOLS[subscription.currency] || subscription.currency
  const category = CATEGORIES.find((c) => c.key === subscription.category)
  const daysLabel = formatDaysLabel(subscription.next_charge_date)
  const isOverdue = status === 'overdue'
  const days = daysUntil(subscription.next_charge_date)

  return (
    <div
      onClick={onClick}
      className="btn-press"
      style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        borderLeft: isOverdue ? '3px solid var(--error)' : '3px solid transparent',
        marginLeft: isOverdue ? '0' : '0',
        transition: 'opacity 0.15s',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: category ? `${category.color}22` : 'rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flexShrink: 0,
        }}
      >
        {subscription.icon || category?.icon || '📦'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <span
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {subscription.name}
          </span>
          {subscription.paused && (
            <span style={{ fontSize: '11px', color: 'var(--paused)' }}>⏸</span>
          )}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {category?.label || 'Другое'}
        </div>
        <div
          style={{
            fontSize: '12px',
            marginTop: '4px',
            color: isOverdue ? 'var(--error)' : days === 0 ? 'var(--warning)' : 'var(--text-secondary)',
            fontWeight: isOverdue ? '500' : 'normal',
          }}
        >
          {daysLabel}
        </div>
      </div>

      {/* Right: amount + badge */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
        <span style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>
          {sym}{subscription.amount}
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '500',
            padding: '2px 8px',
            borderRadius: '10px',
            background: statusCfg.bg,
            color: statusCfg.color,
          }}
        >
          {statusCfg.label}
        </span>
      </div>
    </div>
  )
}
