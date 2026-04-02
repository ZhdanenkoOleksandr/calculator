import React from 'react'
import { motion } from 'framer-motion'

const ROLE_THEME = {
  blue:   { bar: 'linear-gradient(90deg,#1d4ed8,#60a5fa)', glow: 'rgba(59,130,246,0.35)', label: '#60a5fa', bg: 'rgba(59,130,246,0.07)', border: 'rgba(59,130,246,0.2)' },
  purple: { bar: 'linear-gradient(90deg,#7c3aed,#a78bfa)', glow: 'rgba(139,92,246,0.35)', label: '#a78bfa', bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.2)' },
  gold:   { bar: 'linear-gradient(90deg,#b45309,#fbbf24)', glow: 'rgba(245,158,11,0.35)',  label: '#fbbf24', bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.2)'  },
}

function RoleBar({ name, pct, income, color, delay }) {
  const t = ROLE_THEME[color]
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl p-4"
      style={{ background: t.bg, border: `1px solid ${t.border}` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-zinc-300">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">{income}</span>
          <span
            className="text-sm font-bold font-mono"
            style={{ color: t.label, textShadow: `0 0 12px ${t.glow}` }}
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
          transition={{ duration: 1.0, delay: delay + 0.2, ease: [0.25, 1, 0.5, 1] }}
        />
      </div>
    </motion.div>
  )
}

export default function RoleDistribution({ roles }) {
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
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
          Income by Role
        </p>
        <p className="text-white font-bold text-lg mt-0.5">Role Distribution</p>
      </div>

      <div className="flex flex-col gap-3">
        {roles.map((role, i) => (
          <RoleBar key={role.name} {...role} delay={0.15 * i} />
        ))}
      </div>

      {/* Total bar */}
      <div
        className="rounded-xl p-3 flex items-center justify-between mt-1"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-xs text-zinc-500 uppercase tracking-widest">Total Active Roles</span>
        <span className="text-sm font-bold font-mono text-zinc-300">{roles.length} / 3</span>
      </div>
    </motion.div>
  )
}
