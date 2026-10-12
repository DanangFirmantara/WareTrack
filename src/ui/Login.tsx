import { useState, type FormEvent } from 'react'
import { Logo } from './TopBar'

export function Login({ onLogin }: { onLogin: (user: string) => void }) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    // Sementara: kredensial apa pun diterima selama tidak kosong.
    if (!user.trim() || !password) {
      setError('Username dan password wajib diisi.')
      return
    }
    onLogin(user.trim())
  }

  return (
    <div className="login">
      <form className="card login-card" onSubmit={submit}>
        <div className="brand"><Logo />WareTrack</div>
        <div>
          <div className="detail-title">Sign in</div>
          <div className="muted">Masuk untuk memantau gudang secara live.</div>
        </div>
        <label className="field">
          <span className="muted small">Username</span>
          <input className="input" value={user} onChange={(e) => setUser(e.target.value)} autoFocus autoComplete="username" />
        </label>
        <label className="field">
          <span className="muted small">Password</span>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn-primary" type="submit">Login</button>
      </form>
    </div>
  )
}
