import { useEffect, useRef, useState } from 'react'
import { sites } from '../data'

export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 32 32" aria-hidden>
      <path d="M16 2 29 9v14l-13 7-13-7V9z" fill="#2f6bf0" />
      <path d="M16 2 29 9l-13 7L3 9z" fill="#6fa0ff" />
      <path d="M16 16v14l13-7V9z" fill="#1f4fd1" />
    </svg>
  )
}

const Icon = {
  search: <path d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />,
  right: <path d="m9 6 6 6-6 6" />,
  down: <path d="m6 9 6 6 6-6" />,
  bell: <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
}

function Svg({ name, size = 18 }: { name: keyof typeof Icon; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {Icon[name]}
    </svg>
  )
}

// Tutup dropdown saat klik di luar elemen.
function useOutsideClose(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) close() }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, close])
  return ref
}

function useClock() {
  const fmt = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 10_000)
    return () => clearInterval(t)
  }, [])
  return time
}

export function TopBar({ user, onLogout }: { user: string; onLogout: () => void }) {
  const time = useClock()
  const [site, setSite] = useState(sites[0])
  const [menu, setMenu] = useState<'site' | 'user' | null>(null)
  const closeMenu = () => setMenu(null)
  const siteRef = useOutsideClose(menu === 'site', closeMenu)
  const userRef = useOutsideClose(menu === 'user', closeMenu)
  const searchRef = useRef<HTMLInputElement>(null)

  // Tekan "/" untuk fokus ke search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="topbar">
      <div className="brand"><Logo />WareTrack</div>

      <label className="search">
        <Svg name="search" size={20} />
        <input ref={searchRef} placeholder="Search sites, trucks, forklifts, pallets, shipments…" />
        <kbd>/</kbd>
      </label>

      <div className="nav-right">
        <div className="site" ref={siteRef}>
          <button className="site-main">
            <span className="site-code">{site.code}</span>
            <span className="site-text">
              <strong>{site.name}</strong>
              <span className="muted small">{site.note}</span>
            </span>
            <Svg name="right" size={16} />
          </button>
          <button className="site-toggle" onClick={() => setMenu(menu === 'site' ? null : 'site')} aria-label="Pilih site">
            <Svg name="down" size={16} />
          </button>
          {menu === 'site' && (
            <div className="card menu">
              {sites.map((s) => (
                <button key={s.code} className={`menu-item ${s.code === site.code ? 'active' : ''}`} onClick={() => { setSite(s); closeMenu() }}>
                  <span className="site-code">{s.code}</span>
                  <span className="site-text"><strong>{s.name}</strong><span className="muted small">{s.note}</span></span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="live"><span className="dot" />Live <span className="live-time">{time}</span></div>

        <button className="icon-btn" aria-label="Notifikasi">
          <Svg name="bell" size={22} />
          <span className="badge" />
        </button>

        <span className="divider" />

        <div className="profile" ref={userRef}>
          <button className="profile-btn" onClick={() => setMenu(menu === 'user' ? null : 'user')}>
            <span className="avatar">{user[0].toUpperCase()}</span>
            <span className="profile-text">
              <strong>{user}</strong>
              <span className="muted small">Operations Manager</span>
            </span>
            <Svg name="down" size={16} />
          </button>
          {menu === 'user' && (
            <div className="card menu menu-right">
              <button className="menu-item danger" onClick={onLogout}>
                <Svg name="logout" size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
