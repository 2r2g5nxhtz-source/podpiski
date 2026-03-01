import React, { useState } from 'react'
import { COMMON_EMOJIS } from '../utils/constants'

export default function EmojiPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn-press"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'var(--bg-input)',
          border: '2px solid var(--border)',
          fontSize: '32px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {value || '😊'}
      </button>

      {/* Picker overlay */}
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 150 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              bottom: 'env(safe-area-inset-bottom)',
              left: 0,
              right: 0,
              background: 'var(--bg-card)',
              borderRadius: '20px 20px 0 0',
              padding: '20px 16px',
              zIndex: 160,
              maxHeight: '55vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Выберите иконку
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  background: 'var(--bg-input)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '8px',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onChange(emoji)
                    setOpen(false)
                  }}
                  className="btn-press"
                  style={{
                    aspectRatio: '1',
                    borderRadius: '10px',
                    background: value === emoji ? 'var(--accent-light)' : 'transparent',
                    border: value === emoji ? '2px solid var(--accent)' : '2px solid transparent',
                    fontSize: '26px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
