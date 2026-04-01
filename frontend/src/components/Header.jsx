import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="font-mono text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
      {time.toUTCString().slice(17, 25)} UTC
    </span>
  )
}

export default function Header({ theme, onToggleTheme }) {
  const location = useLocation()
  const isDark = theme === 'dark'

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/decisions', label: 'Decisions' },
    { to: '/assets', label: 'Assets' },
  ]

  return (
    <header
      className="sticky top-0 z-30 px-6 flex items-center justify-between"
      style={{
        background: 'var(--bg-header)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border-subtle)',
        height: '56px',
        boxShadow: 'var(--shadow-header)',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
        <div className="relative flex items-center justify-center w-8 h-8">
          <div
            className="absolute w-full h-full rounded-full"
            style={{ border: '1px solid rgba(0,255,136,0.15)', animation: 'pulse-ring 3s ease-out infinite' }}
          />
          <div
            className="w-5 h-5 rotate-45 border"
            style={{ borderColor: 'var(--neon-green)', opacity: 0.7, transition: 'opacity 0.3s' }}
          />
          <div
            className="absolute w-2 h-2 rotate-45"
            style={{ background: 'linear-gradient(135deg, var(--neon-green), var(--neon-blue))', boxShadow: '0 0 8px rgba(0,255,136,0.7)' }}
          />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold tracking-tight" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', fontSize: '0.9375rem' }}>
            Command Center
          </span>
          <span className="text-xs font-mono hidden sm:block" style={{ color: 'var(--neon-green)', opacity: 0.5, letterSpacing: '0.08em' }}>
            SIYADA
          </span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {navLinks.map(({ to, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                background: active ? 'rgba(0,255,136,0.07)' : 'transparent',
                border: active ? '1px solid rgba(0,255,136,0.15)' : '1px solid transparent',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Right — clock + theme toggle + live badge */}
      <div className="flex items-center gap-3">
        <LiveClock />

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀' : '☾'}
        </button>

        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: 'var(--neon-green)', boxShadow: '0 0 6px rgba(0,255,136,0.8)', animation: 'blink 2s step-end infinite' }}
          />
          <span className="text-xs font-mono font-medium" style={{ color: 'var(--neon-green)', opacity: 0.8 }}>
            LIVE
          </span>
        </div>
      </div>
    </header>
  )
}
