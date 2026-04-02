import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ROLE_THEME = {
  blue:    { bar: 'linear-gradient(90deg,#1d4ed8,#60a5fa)',   glow: 'rgba(59,130,246,0.35)',   label: '#60a5fa', bg: 'rgba(59,130,246,0.07)',   border: 'rgba(59,130,246,0.22)'   },
  purple:  { bar: 'linear-gradient(90deg,#7c3aed,#a78bfa)',   glow: 'rgba(139,92,246,0.35)',   label: '#a78bfa', bg: 'rgba(139,92,246,0.07)',   border: 'rgba(139,92,246,0.22)'   },
  gold:    { bar: 'linear-gradient(90deg,#b45309,#fbbf24)',   glow: 'rgba(245,158,11,0.35)',   label: '#fbbf24', bg: 'rgba(245,158,11,0.07)',   border: 'rgba(245,158,11,0.22)'   },
  emerald: { bar: 'linear-gradient(90deg,#047857,#34d399)',   glow: 'rgba(52,211,153,0.35)',   label: '#34d399', bg: 'rgba(52,211,153,0.07)',   border: 'rgba(52,211,153,0.22)'   },
  rose:    { bar: 'linear-gradient(90deg,#be123c,#fb7185)',   glow: 'rgba(251,113,133,0.35)',  label: '#fb7185', bg: 'rgba(251,113,133,0.07)',  border: 'rgba(251,113,133,0.22)'  },
  cyan:    { bar: 'linear-gradient(90deg,#0e7490,#22d3ee)',   glow: 'rgba(34,211,238,0.35)',   label: '#22d3ee', bg: 'rgba(34,211,238,0.07)',   border: 'rgba(34,211,238,0.22)'   },
  indigo:  { bar: 'linear-gradient(90deg,#3730a3,#818cf8)',   glow: 'rgba(129,140,248,0.35)',  label: '#818cf8', bg: 'rgba(129,140,248,0.07)',  border: 'rgba(129,140,248,0.22)'  },
  orange:  { bar: 'linear-gradient(90deg,#c2410c,#fb923c)',   glow: 'rgba(251,146,60,0.35)',   label: '#fb923c', bg: 'rgba(251,146,60,0.07)',   border: 'rgba(251,146,60,0.22)'   },
  teal:    { bar: 'linear-gradient(90deg,#0f766e,#2dd4bf)',   glow: 'rgba(45,212,191,0.35)',   label: '#2dd4bf', bg: 'rgba(45,212,191,0.07)',   border: 'rgba(45,212,191,0.22)'   },
}

const ROWS_PER_PAGE = 3

function RoleBar({ name, pct, income, color, icon, animKey }) {
  const t = ROLE_THEME[color] ?? ROLE_THEME.blue
  return (
    <motion.div
      key={animKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl px-4 py-3"
      style={{ background: t.bg, border: `1px solid ${t.border}` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{icon}</span>
          <span className="text-sm font-semibold text-zinc-300">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">{income}</span>
          <span
            className="text-sm font-bold font-mono"
            style={{ color: t.label, textShadow: `0 0 10px ${t.glow}` }}
          >
            {pct}%
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: t.bar, boxShadow: `0 0 8px ${t.glow}` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
        />
      </div>
    </motion.div>
  )
}

export default function RoleDistribution({ roles }) {
  const totalPages = Math.ceil(roles.length / ROWS_PER_PAGE)
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)

  const go = (delta) => {
    setDir(delta)
    setPage((p) => Math.min(Math.max(p + delta, 0), totalPages - 1))
  }

  const visible = roles.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
  const activeCount = roles.filter((r) => r.active !== false).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header + nav */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
            Income by Role
          </p>
          <p className="text-white font-bold text-lg mt-0.5">Role Distribution</p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          {/* Dots */}
          <div className="flex items-center gap-1 mr-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setDir(i > page ? 1 : -1); setPage(i) }}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === page ? 16 : 5,
                  height: 5,
                  background: i === page ? '#a78bfa' : 'rgba(255,255,255,0.12)',
                  boxShadow: i === page ? '0 0 6px rgba(167,139,250,0.6)' : 'none',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => go(-1)}
            disabled={page === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-20"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => go(1)}
            disabled={page === totalPages - 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-20"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Role bars — fixed height container to prevent layout shift */}
      <div className="relative overflow-hidden" style={{ minHeight: 168 }}>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            variants={{
              enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit:  (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-3"
          >
            {visible.map((role) => (
              <RoleBar key={role.name} {...role} animKey={`${page}-${role.name}`} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        className="rounded-xl px-3 py-2.5 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-xs text-zinc-500 uppercase tracking-widest">
          Академия платформенной экономики
        </span>
        <span className="text-sm font-bold font-mono text-zinc-300">
          {activeCount} / {roles.length} ролей
        </span>
      </div>
    </motion.div>
  )
}
