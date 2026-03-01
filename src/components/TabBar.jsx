import React from 'react'

const tabs = [
  {
    key: 'home',
    label: 'Главная',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
          fill={active ? 'var(--accent)' : 'none'}
          stroke={active ? 'var(--accent)' : 'var(--text-secondary)'}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: 'analytics',
    label: 'Аналитика',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="3" y="12" width="4" height="9" rx="1"
          fill={active ? 'var(--accent)' : 'none'}
          stroke={active ? 'var(--accent)' : 'var(--text-secondary)'}
          strokeWidth="1.8"
        />
        <rect
          x="10" y="7" width="4" height="14" rx="1"
          fill={active ? 'var(--accent)' : 'none'}
          stroke={active ? 'var(--accent)' : 'var(--text-secondary)'}
          strokeWidth="1.8"
        />
        <rect
          x="17" y="3" width="4" height="18" rx="1"
          fill={active ? 'var(--accent)' : 'none'}
          stroke={active ? 'var(--accent)' : 'var(--text-secondary)'}
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    key: 'settings',
    label: 'Настройки',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12" cy="12" r="3"
          stroke={active ? 'var(--accent)' : 'var(--text-secondary)'}
          strokeWidth="1.8"
        />
        <path
          d="M12 2C11.4 2 10.9 2.4 10.8 3L10.4 5.1C9.8 5.3 9.2 5.6 8.7 6L6.7 5.1C6.2 4.9 5.6 5.1 5.3 5.5L3.5 8.5C3.2 9 3.3 9.6 3.7 9.9L5.4 11.1C5.3 11.4 5.3 11.7 5.3 12C5.3 12.3 5.3 12.6 5.4 12.9L3.7 14.1C3.3 14.4 3.2 15 3.5 15.5L5.3 18.5C5.6 18.9 6.2 19.1 6.7 18.9L8.7 18C9.2 18.4 9.8 18.7 10.4 18.9L10.8 21C10.9 21.6 11.4 22 12 22C12.6 22 13.1 21.6 13.2 21L13.6 18.9C14.2 18.7 14.8 18.4 15.3 18L17.3 18.9C17.8 19.1 18.4 18.9 18.7 18.5L20.5 15.5C20.8 15 20.7 14.4 20.3 14.1L18.6 12.9C18.7 12.6 18.7 12.3 18.7 12C18.7 11.7 18.7 11.4 18.6 11.1L20.3 9.9C20.7 9.6 20.8 9 20.5 8.5L18.7 5.5C18.4 5.1 17.8 4.9 17.3 5.1L15.3 6C14.8 5.6 14.2 5.3 13.6 5.1L13.2 3C13.1 2.4 12.6 2 12 2Z"
          stroke={active ? 'var(--accent)' : 'var(--text-secondary)'}
          strokeWidth="1.5"
          fill={active ? 'var(--accent-light)' : 'none'}
        />
      </svg>
    ),
  },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className="btn-press"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '10px 0 8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontFamily: 'inherit',
              }}
            >
              {tab.icon(active)}
              <span style={{ fontWeight: active ? '600' : '400' }}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
