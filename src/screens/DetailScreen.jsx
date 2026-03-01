import React, { useState, useEffect } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { getSubscription, updateSubscription, deleteSubscription } from '../utils/storage'
import { getStatus, calcNextChargeDate, formatDateRu, formatDaysLabel, daysUntil } from '../utils/dates'
import { CURRENCY_SYMBOLS, CATEGORIES, PERIODS } from '../utils/constants'

const STATUS_CONFIG = {
  active: { label: 'Активна', color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.12)' },
  paused: { label: 'На паузе', color: '#757575', bg: 'rgba(117, 117, 117, 0.12)' },
  overdue: { label: 'Просрочена', color: '#FF5252', bg: 'rgba(255, 82, 82, 0.12)' },
}

function Row({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '15px', color: valueColor || 'var(--text-primary)', fontWeight: '500' }}>{value}</span>
    </div>
  )
}

export default function DetailScreen({ subscriptionId, navigate, goBack }) {
  const [sub, setSub] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMarkPaidDialog, setShowMarkPaidDialog] = useState(false)

  useEffect(() => {
    const data = getSubscription(subscriptionId)
    setSub(data)
  }, [subscriptionId])

  if (!sub) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Подписка не найдена</p>
      </div>
    )
  }

  const status = getStatus(sub)
  const statusCfg = STATUS_CONFIG[status]
  const sym = CURRENCY_SYMBOLS[sub.currency] || sub.currency
  const category = CATEGORIES.find((c) => c.key === sub.category)
  const period = PERIODS.find((p) => p.key === sub.period)
  const days = daysUntil(sub.next_charge_date)

  const handleMarkPaid = () => {
    const newDate = calcNextChargeDate(sub)
    const updated = updateSubscription(sub.id, { next_charge_date: newDate })
    setSub(updated || { ...sub, next_charge_date: newDate })
    setShowMarkPaidDialog(false)
  }

  const handleTogglePause = () => {
    const updated = updateSubscription(sub.id, { paused: !sub.paused })
    setSub(updated || { ...sub, paused: !sub.paused })
  }

  const handleDelete = () => {
    deleteSubscription(sub.id)
    goBack()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
          padding: 'calc(env(safe-area-inset-top) + 12px) 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={goBack}
          className="btn-press"
          style={{
            background: 'var(--bg-card)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', flex: 1 }}>
          Детали подписки
        </h2>
        <button
          onClick={() => navigate('form', { id: sub.id, mode: 'edit' })}
          className="btn-press"
          style={{
            background: 'var(--accent-light)',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            cursor: 'pointer',
            color: 'var(--accent)',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'inherit',
          }}
        >
          Изменить
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', minHeight: 0, padding: '20px 20px 32px' }}>
        {/* Hero card */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '24px 20px',
            textAlign: 'center',
            marginBottom: '16px',
            boxShadow: 'var(--shadow)',
            borderLeft: status === 'overdue' ? '4px solid var(--error)' : 'none',
          }}
        >
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>{sub.icon || category?.icon || '📦'}</div>
          <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {sub.name}
          </h1>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '12px',
              background: statusCfg.bg,
              color: statusCfg.color,
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            {statusCfg.label}
          </div>
          <div>
            <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {sym}{sub.amount}
            </span>
            <span style={{ fontSize: '16px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
              / {period?.label.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Details */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '0 16px', marginBottom: '16px', boxShadow: 'var(--shadow)' }}>
          <Row label="Категория" value={`${category?.icon} ${category?.label}`} />
          <Row label="Валюта" value={sub.currency} />
          <Row
            label="Следующее списание"
            value={formatDateRu(sub.next_charge_date)}
            valueColor={status === 'overdue' ? 'var(--error)' : status === 'active' && days <= 3 ? 'var(--warning)' : undefined}
          />
          <Row
            label="Статус даты"
            value={formatDaysLabel(sub.next_charge_date)}
            valueColor={status === 'overdue' ? 'var(--error)' : days === 0 ? 'var(--warning)' : undefined}
          />
          {sub.trial_end_date && (
            <Row
              label="Конец пробного периода"
              value={formatDateRu(sub.trial_end_date)}
              valueColor={daysUntil(sub.trial_end_date) <= 2 ? 'var(--warning)' : undefined}
            />
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
            <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Добавлена</span>
            <span style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '500' }}>
              {formatDateRu(sub.created_at)}
            </span>
          </div>
        </div>

        {/* Trial period info */}
        {sub.trial_end_date && daysUntil(sub.trial_end_date) <= 3 && daysUntil(sub.trial_end_date) >= 0 && (
          <div
            style={{
              background: 'rgba(255, 193, 7, 0.12)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '16px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--warning)', marginBottom: '4px' }}>
                Пробный период скоро заканчивается
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {formatDaysLabel(sub.trial_end_date)} — {formatDateRu(sub.trial_end_date)}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!sub.paused && (
            <button
              onClick={() => setShowMarkPaidDialog(true)}
              className="btn-press"
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '12px',
                background: 'var(--success)',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ✓ Отметить оплату
            </button>
          )}

          <button
            onClick={handleTogglePause}
            className="btn-press"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '12px',
              background: sub.paused ? 'var(--accent)' : 'var(--bg-card)',
              border: sub.paused ? 'none' : '1px solid var(--border)',
              color: sub.paused ? '#fff' : 'var(--text-primary)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {sub.paused ? '▶ Возобновить' : '⏸ Поставить на паузу'}
          </button>

          <button
            onClick={() => setShowDeleteDialog(true)}
            className="btn-press"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '12px',
              background: 'var(--error-light)',
              border: '1px solid rgba(255, 82, 82, 0.25)',
              color: 'var(--error)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            🗑 Удалить подписку
          </button>
        </div>
      </div>

      {showDeleteDialog && (
        <ConfirmDialog
          title="Удалить подписку?"
          message={`Подписка «${sub.name}» будет удалена безвозвратно.`}
          confirmLabel="Удалить"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          danger
        />
      )}

      {showMarkPaidDialog && (
        <ConfirmDialog
          title="Отметить оплату?"
          message={`Дата следующего списания будет обновлена на ${calcNextChargeDate(sub)}.`}
          confirmLabel="Подтвердить"
          onConfirm={handleMarkPaid}
          onCancel={() => setShowMarkPaidDialog(false)}
          danger={false}
        />
      )}
    </div>
  )
}
