import React, { useState, useEffect } from 'react'
import TabBar from './components/TabBar'
import HomeScreen from './screens/HomeScreen'
import DetailScreen from './screens/DetailScreen'
import FormScreen from './screens/FormScreen'
import AnalyticsScreen from './screens/AnalyticsScreen'
import SettingsScreen from './screens/SettingsScreen'
import { loadSettings } from './utils/storage'
import { checkAndNotify, registerServiceWorker } from './utils/notifications'

export default function App() {
  const [tab, setTab] = useState('home')
  const [screen, setScreen] = useState('home')
  const [selectedId, setSelectedId] = useState(null)
  const [formMode, setFormMode] = useState('add')
  const [theme, setTheme] = useState(() => loadSettings().theme || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    registerServiceWorker()
    checkAndNotify()
  }, [])

  const navigate = (screenName, params = {}) => {
    if (params.id !== undefined) setSelectedId(params.id)
    if (params.mode !== undefined) setFormMode(params.mode)
    setScreen(screenName)
  }

  const goBack = () => {
    setScreen(tab)
  }

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setScreen(newTab)
  }

  const isTabScreen = ['home', 'analytics', 'settings'].includes(screen)

  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          // Reserve space for tab bar
          paddingBottom: isTabScreen ? 'calc(83px + env(safe-area-inset-bottom))' : 0,
        }}
      >
        {screen === 'home' && <HomeScreen key="home" navigate={navigate} />}
        {screen === 'analytics' && <AnalyticsScreen key="analytics" navigate={navigate} />}
        {screen === 'settings' && <SettingsScreen key="settings" theme={theme} setTheme={setTheme} />}
        {screen === 'detail' && (
          <DetailScreen key={selectedId} subscriptionId={selectedId} navigate={navigate} goBack={goBack} />
        )}
        {screen === 'form' && (
          <FormScreen
            key={`${formMode}-${selectedId}`}
            mode={formMode}
            subscriptionId={selectedId}
            navigate={navigate}
            goBack={goBack}
          />
        )}
      </div>

      {isTabScreen && <TabBar activeTab={tab} onTabChange={handleTabChange} />}
    </div>
  )
}
