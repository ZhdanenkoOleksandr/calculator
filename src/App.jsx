import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Calculator from './pages/Calculator'
import VikingEconomy from './pages/VikingEconomy'

const MODES = [
  { id: 'range',  label: 'Range Economy', icon: '◆' },
  { id: 'viking', label: 'Viking Economy', icon: '⚔' },
]

export default function App() {
  const [mode, setMode] = useState('range')

  return (
    <div className="relative">
      {/* Mode switcher — fixed top-right */}
      <div
        className="fixed top-4 right-4 z-50 flex items-center gap-1 p-1 rounded-2xl"
        style={{
          background: 'rgba(9,9,11,0.85)',
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
              className="relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 flex items-center gap-1.5"
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

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {mode === 'range' ? <Calculator /> : <VikingEconomy />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
