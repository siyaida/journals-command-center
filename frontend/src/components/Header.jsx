import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="font-mono text-xs tabular-nums" style={{ color: '#3d3d55' }}>
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
      className="sticky top-0 z-30 px-6 py-0 flex items-center justify-between"
      style={{
        background: 'rgba(5,5,10,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        height: '52px',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center w-7 h-7">
          <div
            className="w-5 h-5 rotate-45 border"
            style={{
              borderColor: '#00ff88',
              boxShadow: '0 0 8px rgba(0,255,136,0.5), inset 0 0 8px rgba(0,255,136,0.1)',
            }}
          />
          <div
            className="absolute w-2 h-2 rotate-45"
            style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }}
          />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Command Center
          </span>
          <span
            className="text-xs font-mono hidden sm:block"
            style={{ color: 'rgba(0,255,136,0.4)' }}
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
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
              style={{
                color: active ? '#f1f5f9' : '#475569',
                background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                borderBottom: active ? '1px solid rgba(0,255,136,0.4)' : '1px solid transparent',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Right — clock + status */}
      <div className="flex items-center gap-4">
        <LiveClock />
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#00ff88',
              boxShadow: '0 0 6px rgba(0,255,136,0.8)',
              animation: 'blink 2s step-end infinite',
            }}
          />
          <span className="text-xs font-mono" style={{ color: 'rgba(0,255,136,0.6)' }}>LIVE</span>
        </div>
      </div>
    </header>
  )
}
