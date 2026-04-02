import React, { useState, Component } from 'react'
import { motion } from 'framer-motion'
import Calculator from './pages/Calculator'
import VikingEconomy from './pages/VikingEconomy'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-950 text-zinc-400 p-8">
          <div className="text-red-400 font-semibold text-lg">Ошибка рендера</div>
          <pre className="text-xs text-red-300 bg-zinc-900 rounded-xl p-4 max-w-2xl overflow-auto whitespace-pre-wrap border border-red-900/50">
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => this.setState({ error: null })}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const MODES = [
  { id: 'range',  label: 'Range Economy', icon: '◆' },
  { id: 'viking', label: 'Viking Economy', icon: '⚔' },
]

export default function App() {
  const [mode, setMode] = useState('range')

  return (
    // Dark background on root so no flash during transitions
    <div className="relative" style={{ background: '#09090b', minHeight: '100vh' }}>
      {/* Mode switcher — fixed top-right */}
      <div
        className="fixed top-4 right-4 z-50 flex items-center gap-1 p-1 rounded-2xl"
        style={{
          background: 'rgba(9,9,11,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        {MODES.map(({ id, label, icon }) => {
          const active = mode === id
          return (
            <button
              key={id}
              onClick={() => setMode(id)}
              className="relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
              style={{ color: active ? '#fff' : '#71717a' }}
            >
              {active && (
                <motion.div
                  layoutId="modePill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: id === 'viking'
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))'
                      : 'rgba(99,102,241,0.25)',
                    border: id === 'viking'
                      ? '1px solid rgba(139,92,246,0.4)'
                      : '1px solid rgba(99,102,241,0.3)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-[11px]">{icon}</span>
              <span className="relative z-10 hidden sm:inline">{label}</span>
            </button>
          )
        })}
      </div>

      {/* Pages — direct swap with fade, no wait-mode black flash */}
      <ErrorBoundary key="range">
        <motion.div
          style={{ position: mode === 'range' ? 'relative' : 'absolute', top: 0, left: 0, right: 0, pointerEvents: mode === 'range' ? 'auto' : 'none' }}
          animate={{ opacity: mode === 'range' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Calculator />
        </motion.div>
      </ErrorBoundary>

      <ErrorBoundary key="viking">
        <motion.div
          style={{ position: mode === 'viking' ? 'relative' : 'absolute', top: 0, left: 0, right: 0, pointerEvents: mode === 'viking' ? 'auto' : 'none' }}
          animate={{ opacity: mode === 'viking' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <VikingEconomy />
        </motion.div>
      </ErrorBoundary>
    </div>
  )
}
