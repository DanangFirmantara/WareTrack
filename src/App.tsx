import { useState } from 'react'
import { Scene } from './scene/Scene'
import { Login } from './ui/Login'
import { DetailPanel, KpiCards } from './ui/Overlay'
import { TopBar } from './ui/TopBar'
import { Tracker } from './ui/Tracker'
import type { ShipmentPhase } from './data'

const SESSION_KEY = 'waretrack-user'

function readSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export default function App() {
  const [user, setUser] = useState<string | null>(readSession)
  const [selected, setSelected] = useState<string | null>('TRK-2051')
  const [phase, setPhase] = useState<ShipmentPhase>('loading')

  function login(name: string) {
    try { sessionStorage.setItem(SESSION_KEY, name) } catch { /* abaikan */ }
    setUser(name)
  }

  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY) } catch { /* abaikan */ }
    setUser(null)
  }

  if (!user) return <Login onLogin={login} />

  return (
    <div className="app">
      <TopBar user={user} onLogout={logout} />
      <main className="stage">
        <Scene selected={selected} onSelect={setSelected} phase={phase} onPhase={setPhase} />
        <KpiCards />
        <Tracker phase={phase} onSelect={setSelected} />
        <DetailPanel id={selected} phase={phase} onClose={() => setSelected(null)} />
      </main>
    </div>
  )
}
