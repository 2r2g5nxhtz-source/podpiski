import React, { useState, useEffect } from 'react'
import { loadSettings, saveSettings, loadData, saveData, mergeSubscriptions, validateImportData } from '../utils/storage'
import { requestPermission, getPermissionStatus, checkAndNotify } from '../utils/notifications'
import { today } from '../utils/dates'

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          fontSize: '12px',
          fontWeight: '700',
          color: 'var(--text-secondary)',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          marginBottom: '10px',
          paddingLeft: '4px',
        }}
      >
        {title}
      </div>
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        {children}
      </div>
    </div>
  )
}

function SettingRow({ label, sublabel, right, onPress, danger, last }) {
  const content = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 16px',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        cursor: onPress ? 'pointer' : 'default',
      }}
      onClick={onPress}
    >
      <div>
        <div style={{ fontSize: '16px', color: danger ? 'var(--error)' : 'var(--text-primary)', fontWeight: '400' }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{sublabel}</div>
        )}
      </div>
      {right && <div style={{ flexShrink: 0, marginLeft: '12px' }}>{right}</div>}
    </div>
  )
  return content
}

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      className="btn-press"
      style={{
        width: '51px',
        height: '31px',
        borderRadius: '16px',
        background: value ? 'var(--accent)' : 'var(--bg-input)',
        border: '2px solid var(--border)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: value ? '22px' : '2px',
          width: '23px',
          height: '23px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          transition: 'left 0.2s',
        }}
      />
    </div>
  )
}

export default function SettingsScreen({ theme, setTheme }) {
  const [settings, setSettings] = useState(loadSettings())
  const [permissionStatus, setPermissionStatus] = useState(getPermissionStatus())
  const [toast, setToast] = useState(null)
  const [importError, setImportError] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    saveSettings(updated)
  }

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    updateSetting('theme', newTheme)
  }

  const handleRequestPermission = async () => {
    const result = await requestPermission()
    setPermissionStatus(result)
    if (result === 'granted') {
      showToast('Уведомления включены!')
      checkAndNotify()
    } else if (result === 'denied') {
      showToast('Уведомления заблокированы в настройках браузера', 'error')
    }
  }

  const handleExport = () => {
    const data = loadData()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subtracker-export-${today()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Данные экспортированы')
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result)
          if (!validateImportData(parsed)) {
            setImportError('Неверный формат файла. Убедитесь, что это файл экспорта SubTracker.')
            return
          }
          const result = mergeSubscriptions(parsed.subscriptions)
          showToast(`Импортировано: +${result.added} подписок (всего: ${result.total})`)
          setImportError(null)
        } catch {
          setImportError('Ошибка чтения файла. Убедитесь, что файл в формате JSON.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const permissionLabels = {
    granted: '✓ Разрешены',
    denied: '✗ Заблокированы',
    default: 'Не запрошены',
    unsupported: 'Не поддерживаются',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg-primary)' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 'calc(env(safe-area-inset-top) + 16px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.type === 'error' ? 'var(--error)' : '#333',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 300,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
          padding: 'calc(env(safe-area-inset-top) + 16px) 20px 16px',
          background: 'var(--bg-primary)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
          Настройки
        </h1>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', minHeight: 0, padding: '4px 16px 32px' }}>

        {/* Notifications */}
        <Section title="Уведомления">
          <SettingRow
            label="Включить уведомления"
            sublabel={`Статус: ${permissionLabels[permissionStatus] || permissionStatus}`}
            right={
              <Toggle
                value={settings.notifications_enabled}
                onChange={(v) => updateSetting('notifications_enabled', v)}
              />
            }
          />
          <SettingRow
            label="Напоминать за"
            sublabel="Дней до списания"
            right={
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 3, 7].map((d) => (
                  <button
                    key={d}
                    onClick={() => updateSetting('notify_days_before', d)}
                    className="btn-press"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      background: settings.notify_days_before === d ? 'var(--accent)' : 'var(--bg-input)',
                      color: settings.notify_days_before === d ? '#fff' : 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: settings.notify_days_before === d ? '700' : '400',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            }
          />
          <SettingRow
            label="Запросить разрешение"
            sublabel={permissionStatus === 'granted' ? 'Уже разрешено' : 'Нажмите для запроса'}
            onPress={permissionStatus !== 'denied' ? handleRequestPermission : undefined}
            right={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            last
          />
        </Section>

        {/* Data */}
        <Section title="Данные">
          <SettingRow
            label="Экспорт в JSON"
            sublabel="Сохранить все подписки"
            onPress={handleExport}
            right={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 3V15M12 15L8 11M12 15L16 11" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 19H21" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
          <SettingRow
            label="Импорт из JSON"
            sublabel="Загрузить подписки из файла"
            onPress={handleImport}
            right={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 19H21" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            last
          />
          {importError && (
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--error-light)',
                borderTop: '1px solid var(--border)',
                fontSize: '13px',
                color: 'var(--error)',
                lineHeight: '1.4',
              }}
            >
              ⚠️ {importError}
            </div>
          )}
        </Section>

        {/* Theme */}
        <Section title="Оформление">
          <SettingRow
            label="Тёмная тема"
            right={<Toggle value={theme === 'dark'} onChange={handleThemeToggle} />}
            last
          />
        </Section>

        {/* About */}
        <Section title="О приложении">
          <SettingRow
            label="Версия"
            right={<span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>1.0.0</span>}
          />
          <SettingRow
            label="Добавить на экран «Домой»"
            sublabel="Safari → Поделиться → Добавить на экран «Домой»"
            right={<span style={{ fontSize: '20px' }}>📱</span>}
            last
          />
        </Section>

        <div
          style={{
            padding: '16px',
            background: 'var(--accent-light)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 153, 204, 0.2)',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent)', marginBottom: '6px' }}>
            💡 Для уведомлений на iPhone
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Добавьте приложение на экран «Домой» через Safari, затем запустите его оттуда. Это необходимо для работы уведомлений на iOS.
          </div>
        </div>
      </div>
    </div>
  )
}
