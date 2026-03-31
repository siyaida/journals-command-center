import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-dark-800 border-b border-dark-600 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <Link to="/" className="flex items-center gap-3">
        <span className="text-neon-green font-bold text-lg mono">⬡</span>
        <span className="font-semibold text-white">Command Center</span>
        <span className="text-gray-500 text-sm">Siyada Tech</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
        <Link to="/decisions" className="text-gray-400 hover:text-white transition-colors">Decisions</Link>
        <Link to="/assets" className="text-gray-400 hover:text-white transition-colors">Assets</Link>
      </nav>
    </header>
  )
}
