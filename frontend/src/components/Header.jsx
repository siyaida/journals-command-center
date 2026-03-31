import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="font-mono text-xs tabular-nums" style={{ color: '#475569' }}>
      {time.toUTCString().slice(17, 25)} UTC
    </span>
  )
}

export default function Header() {
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/decisions', label: 'Decisions' },
    { to: '/assets', label: 'Assets' },
  ]

  return (
    <header
      className="sticky top-0 z-30 px-6 flex items-center justify-between"
      style={{
        background: 'rgba(5,5,10,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        height: '56px',
        boxShadow: '0 1px 0 rgba(0,255,136,0.06), 0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
        {/* Diamond logo mark */}
        <div className="relative flex items-center justify-center w-8 h-8">
          {/* Outer ring pulse */}
          <div
            className="absolute w-full h-full rounded-full"
            style={{
              border: '1px solid rgba(0,255,136,0.15)',
              animation: 'pulse-ring 3s ease-out infinite',
            }}
          />
          {/* Diamond */}
          <div
            className="w-5 h-5 rotate-45 border"
            style={{
              borderColor: 'rgba(0,255,136,0.7)',
              boxShadow: '0 0 10px rgba(0,255,136,0.4), inset 0 0 8px rgba(0,255,136,0.08)',
              transition: 'box-shadow 0.3s',
            }}
          />
          {/* Inner core */}
          <div
            className="absolute w-2 h-2 rotate-45"
            style={{
              background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
              boxShadow: '0 0 8px rgba(0,255,136,0.9)',
            }}
          />
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className="font-bold tracking-tight"
            style={{ color: '#f1f5f9', letterSpacing: '-0.02em', fontSize: '0.9375rem' }}
          >
            Command Center
          </span>
          <span
            className="text-xs font-mono hidden sm:block"
            style={{ color: 'rgba(0,255,136,0.45)', letterSpacing: '0.08em' }}
          >
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
                color: active ? '#f1f5f9' : '#475569',
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

      {/* Right — clock + live badge */}
      <div className="flex items-center gap-4">
        <LiveClock />
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: 'rgba(0,255,136,0.06)',
            border: '1px solid rgba(0,255,136,0.15)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              background: '#00ff88',
              boxShadow: '0 0 6px rgba(0,255,136,0.9)',
              animation: 'blink 2s step-end infinite',
            }}
          />
          <span className="text-xs font-mono font-medium" style={{ color: 'rgba(0,255,136,0.75)' }}>
            LIVE
          </span>
        </div>
      </div>
    </header>
  )
}
