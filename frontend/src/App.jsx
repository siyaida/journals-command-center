import { Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme.js'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import CommandCenter from './pages/CommandCenter.jsx'
import JournalView from './pages/JournalView.jsx'
import Decisions from './pages/Decisions.jsx'
import Assets from './pages/Assets.jsx'

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen flex flex-col bg-dot-grid" style={{ background: 'var(--bg-main)' }}>
      <Header theme={theme} onToggleTheme={toggle} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className="flex-1 overflow-auto"
          style={{ padding: '2rem 2.5rem' }}
        >
          <Routes>
            <Route path="/"                         element={<CommandCenter />} />
            <Route path="/journal/:agentKey"        element={<JournalView />} />
            <Route path="/journal/:agentKey/:date"  element={<JournalView />} />
            <Route path="/decisions"                element={<Decisions />} />
            <Route path="/assets"                   element={<Assets />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
