import React, { useState, useEffect } from 'react'
import EmojiPicker from '../components/EmojiPicker'
import { getSubscription, addSubscription, updateSubscription, generateId } from '../utils/storage'
import { today } from '../utils/dates'
import { CATEGORIES, CURRENCIES, PERIODS } from '../utils/constants'

function FormField({ label, required, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-secondary)',
          marginBottom: '8px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}
      >
        {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  height: '50px',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  background: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontSize: '16px',
  padding: '0 16px',
  fontFamily: 'inherit',
}

export default function FormScreen({ mode, subscriptionId, navigate, goBack }) {
  const isEdit = mode === 'edit'

  const [form, setForm] = useState({
    name: '',
    icon: '',
    amount: '',
    currency: 'USD',
    period: 'month',
    next_charge_date: today(),
    category: 'other',
    trial_end_date: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit && subscriptionId) {
      const sub = getSubscription(subscriptionId)
      if (sub) {
        setForm({
          name: sub.name || '',
          icon: sub.icon || '',
          amount: String(sub.amount || ''),
          currency: sub.currency || 'USD',
          period: sub.period || 'month',
          next_charge_date: sub.next_charge_date || today(),
          category: sub.category || 'other',
          trial_end_date: sub.trial_end_date || '',
        })
      }
    }
  }, [isEdit, subscriptionId])

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Обязательное поле'
    if (!form.icon) errs.icon = 'Выберите иконку'
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      errs.amount = 'Введите корректную сумму'
    }
    if (!form.next_charge_date) errs.next_charge_date = 'Выберите дату'
    return errs
  }

  const isValid =
    form.name.trim() &&
    form.icon &&
    form.amount &&
    !isNaN(parseFloat(form.amount)) &&
    parseFloat(form.amount) > 0 &&
    form.next_charge_date

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const payload = {
      name: form.name.trim(),
      icon: form.icon,
      amount: parseFloat(form.amount),
      currency: form.currency,
      period: form.period,
      next_charge_date: form.next_charge_date,
      category: form.category,
      trial_end_date: form.trial_end_date || null,
    }

    if (isEdit) {
      updateSubscription(subscriptionId, payload)
    } else {
      addSubscription({
        ...payload,
        id: generateId(),
        paused: false,
        created_at: today(),
      })
    }

    goBack()
  }

  const PillSelector = ({ options, value, onChange, colorMap }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map((opt) => {
        const key = typeof opt === 'string' ? opt : opt.key
        const label = typeof opt === 'string' ? opt : opt.label
        const color = colorMap?.[key]
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="btn-press"
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              background: active ? (color || 'var(--accent)') : 'var(--bg-input)',
              color: active ? '#fff' : 'var(--text-primary)',
              fontSize: '15px',
              fontWeight: active ? '600' : '400',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
          padding: 'calc(env(safe-area-inset-top) + 12px) 20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border)',
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
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', flex: 1 }}>
          {isEdit ? 'Редактировать' : 'Новая подписка'}
        </h2>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className="btn-press"
          style={{
            padding: '9px 20px',
            borderRadius: '10px',
            background: isValid ? 'var(--accent)' : 'var(--bg-card)',
            border: 'none',
            color: isValid ? '#fff' : 'var(--text-secondary)',
            fontSize: '15px',
            fontWeight: '600',
            cursor: isValid ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            opacity: isValid ? 1 : 0.6,
          }}
        >
          Сохранить
        </button>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', minHeight: 0, padding: '20px 20px 40px' }}>
        {/* Icon + Name row */}
        <FormField label="Иконка и название" required>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <EmojiPicker value={form.icon} onChange={(v) => update('icon', v)} />
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Например: Netflix"
                maxLength={50}
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? 'var(--error)' : 'var(--border)',
                }}
              />
              {errors.name && (
                <div style={{ fontSize: '12px', color: 'var(--error)', marginTop: '4px' }}>{errors.name}</div>
              )}
            </div>
          </div>
        </FormField>

        {/* Amount + Currency */}
        <FormField label="Сумма и валюта" required>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => update('amount', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              style={{
                ...inputStyle,
                flex: 1,
                borderColor: errors.amount ? 'var(--error)' : 'var(--border)',
              }}
            />
          </div>
          {errors.amount && (
            <div style={{ fontSize: '12px', color: 'var(--error)', marginTop: '-8px', marginBottom: '8px' }}>
              {errors.amount}
            </div>
          )}
          <PillSelector
            options={CURRENCIES}
            value={form.currency}
            onChange={(v) => update('currency', v)}
          />
        </FormField>

        {/* Period */}
        <FormField label="Период оплаты" required>
          <PillSelector
            options={PERIODS}
            value={form.period}
            onChange={(v) => update('period', v)}
          />
        </FormField>

        {/* Next charge date */}
        <FormField label="Дата следующего списания" required>
          <input
            type="date"
            value={form.next_charge_date}
            onChange={(e) => update('next_charge_date', e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.next_charge_date ? 'var(--error)' : 'var(--border)',
            }}
          />
        </FormField>

        {/* Category */}
        <FormField label="Категория" required>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CATEGORIES.map((cat) => {
              const active = form.category === cat.key
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => update('category', cat.key)}
                  className="btn-press"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: active ? cat.color : 'var(--border)',
                    background: active ? `${cat.color}18` : 'var(--bg-input)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{cat.icon}</span>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: active ? '600' : '400',
                      color: active ? cat.color : 'var(--text-primary)',
                    }}
                  >
                    {cat.label}
                  </span>
                  {active && (
                    <svg style={{ marginLeft: 'auto' }} width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke={cat.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </FormField>

        {/* Trial end date */}
        <FormField label="Дата окончания пробного периода">
          <input
            type="date"
            value={form.trial_end_date}
            onChange={(e) => update('trial_end_date', e.target.value)}
            style={inputStyle}
          />
          {form.trial_end_date && (
            <button
              type="button"
              onClick={() => update('trial_end_date', '')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                marginTop: '6px',
                padding: 0,
                fontFamily: 'inherit',
              }}
            >
              × Убрать пробный период
            </button>
          )}
        </FormField>
      </div>
    </div>
  )
}
