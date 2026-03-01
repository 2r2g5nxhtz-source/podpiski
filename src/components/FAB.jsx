import React from 'react'

export default function FAB({ onClick, bottom = 90 }) {
  return (
    <button
      onClick={onClick}
      className="btn-press"
      aria-label="Добавить подписку"
      style={{
        position: 'fixed',
        bottom: `calc(${bottom}px + env(safe-area-inset-bottom))`,
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'var(--accent)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0, 153, 204, 0.4)',
        zIndex: 90,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </button>
  )
}
