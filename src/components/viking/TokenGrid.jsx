import React from 'react'
import { motion } from 'framer-motion'

const TOKEN_COLORS = {
  'BeautyNet':    { color: '#f472b6', glow: 'rgba(244,114,182,0.35)' },
  'Scanerbon':    { color: '#34d399', glow: 'rgba(52,211,153,0.35)'  },
  'DAO District': { color: '#60a5fa', glow: 'rgba(96,165,250,0.35)'  },
  'Viking Core':  { color: '#a78bfa', glow: 'rgba(167,139,250,0.5)'  },
  'NetTrack':     { color: '#fbbf24', glow: 'rgba(251,191,36,0.35)'  },
  'AuraBond':     { color: '#c084fc', glow: 'rgba(192,132,252,0.35)' },
}

function LockIcon() {
  return (
    <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  )
}

function TokenCard({ name, active, projectShare, delay }) {
  const theme = TOKEN_COLORS[name] ?? { color: '#a1a1aa', glow: 'rgba(161,161,170,0.2)' }
  const initial = name.slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      whileHover={active ? { scale: 1.05, transition: { duration: 0.15 } } : {}}
      className="relative rounded-xl p-4 flex flex-col gap-2.5 overflow-hidden"
      style={{
        background: active
          ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
          : 'rgba(255,255,255,0.02)',
        border: active
          ? `1px solid ${theme.color}55`
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: active ? `0 0 20px ${theme.glow}` : 'none',
        opacity: active ? 1 : 0.45,
      }}
    >
      {/* Active indicator shimmer */}
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${theme.color}08 0%, transparent 60%)`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Top row */}
      <div className="flex items-center justify-between relative z-10">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold font-mono"
          style={{
            background: active ? `${theme.color}20` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${active ? theme.color + '40' : 'rgba(255,255,255,0.08)'}`,
            color: active ? theme.color : '#52525b',
            boxShadow: active ? `0 0 10px ${theme.glow}` : 'none',
          }}
        >
          {initial}
        </div>
        <div className="flex items-center gap-1">
          {active ? (
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: theme.color, boxShadow: `0 0 6px ${theme.color}` }}
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ) : (
            <LockIcon />
          )}
        </div>
      </div>

      {/* Name */}
      <div className="relative z-10">
        <p className="text-xs font-semibold" style={{ color: active ? '#e4e4e7' : '#52525b' }}>
          {name}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: active ? theme.color : '#3f3f46' }}>
          {active ? 'Active' : 'Locked'}
        </p>
      </div>

      {/* Project share */}
      {projectShare !== undefined && (
        <div className="relative z-10">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-zinc-600">Доля проекта</span>
            <span style={{ color: active ? theme.color : '#52525b' }}>{projectShare}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: active ? theme.color : 'rgba(255,255,255,0.1)',
                boxShadow: active ? `0 0 4px ${theme.glow}` : 'none',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${projectShare}%` }}
              transition={{ duration: 0.9, delay: delay + 0.3, ease: [0.25, 1, 0.5, 1] }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function TokenGrid({ tokens }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
            Access Tokens
          </p>
          <p className="text-white font-bold text-lg mt-0.5">Network Access</p>
        </div>
        <div
          className="text-xs font-mono px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.25)',
            color: '#a78bfa',
          }}
        >
          {tokens.filter(t => t.active).length}/{tokens.length} active
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tokens.map((token, i) => (
          <TokenCard key={token.name} {...token} delay={0.05 * i} />
        ))}
      </div>
    </motion.div>
  )
}
