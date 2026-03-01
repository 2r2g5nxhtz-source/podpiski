import React from 'react'

export default function ConfirmDialog({ title, message, confirmLabel = 'Удалить', onConfirm, onCancel, danger = true }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        padding: '0 0 env(safe-area-inset-bottom)',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: '16px 16px 0 0',
          padding: '24px 20px',
          width: '100%',
          maxWidth: '480px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: '36px',
            height: '4px',
            background: 'var(--border)',
            borderRadius: '2px',
            margin: '0 auto 20px',
          }}
        />
        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        {message && (
          <p style={{ margin: '0 0 24px', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {message}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={onConfirm}
            className="btn-press"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '12px',
              border: 'none',
              background: danger ? 'var(--error)' : 'var(--accent)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="btn-press"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}
