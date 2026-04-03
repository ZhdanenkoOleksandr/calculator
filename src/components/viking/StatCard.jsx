import React from 'react'
import { motion } from 'framer-motion'

const THEMES = {
  purple:  { glow: 'rgba(139,92,246,0.3)',  border: 'rgba(139,92,246,0.3)',  bg: 'rgba(139,92,246,0.06)',  bar: 'linear-gradient(90deg,#7c3aed,#a78bfa)',  label: '#a78bfa', dot: '#8b5cf6' },
  blue:    { glow: 'rgba(59,130,246,0.3)',   border: 'rgba(59,130,246,0.3)',  bg: 'rgba(59,130,246,0.06)',  bar: 'linear-gradient(90deg,#1d4ed8,#60a5fa)',  label: '#60a5fa', dot: '#3b82f6' },
  gold:    { glow: 'rgba(245,158,11,0.3)',   border: 'rgba(245,158,11,0.25)', bg: 'rgba(245,158,11,0.06)',  bar: 'linear-gradient(90deg,#b45309,#fbbf24)',  label: '#fbbf24', dot: '#f59e0b' },
  cyan:    { glow: 'rgba(34,211,238,0.3)',   border: 'rgba(34,211,238,0.25)', bg: 'rgba(34,211,238,0.06)',  bar: 'linear-gradient(90deg,#0e7490,#22d3ee)',  label: '#22d3ee', dot: '#06b6d4' },
  teal:    { glow: 'rgba(45,212,191,0.3)',   border: 'rgba(45,212,191,0.25)', bg: 'rgba(45,212,191,0.06)',  bar: 'linear-gradient(90deg,#0f766e,#2dd4bf)',  label: '#2dd4bf', dot: '#14b8a6' },
  emerald: { glow: 'rgba(52,211,153,0.3)',   border: 'rgba(52,211,153,0.25)', bg: 'rgba(52,211,153,0.06)',  bar: 'linear-gradient(90deg,#047857,#34d399)',  label: '#34d399', dot: '#10b981' },
  rose:    { glow: 'rgba(251,113,133,0.3)',  border: 'rgba(251,113,133,0.25)',bg: 'rgba(251,113,133,0.06)', bar: 'linear-gradient(90deg,#be123c,#fb7185)',  label: '#fb7185', dot: '#f43f5e' },
  indigo:  { glow: 'rgba(129,140,248,0.3)',  border: 'rgba(129,140,248,0.25)',bg: 'rgba(129,140,248,0.06)', bar: 'linear-gradient(90deg,#3730a3,#818cf8)',  label: '#818cf8', dot: '#6366f1' },
  orange:  { glow: 'rgba(251,146,60,0.3)',   border: 'rgba(251,146,60,0.25)', bg: 'rgba(251,146,60,0.06)',  bar: 'linear-gradient(90deg,#c2410c,#fb923c)',  label: '#fb923c', dot: '#f97316' },
}

export default function StatCard({ title, value, subtitle, detail, color = 'purple', barPct, icon, delay = 0, statusStats }) {
  const t = THEMES[color] ?? THEMES.blue   // fallback — never undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="relative cursor-pointer rounded-2xl p-5 flex flex-col gap-3 overflow-hidden"
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        boxShadow: `0 0 30px ${t.glow}, inset 0 0 20px rgba(255,255,255,0.01)`,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Ambient top-right glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">{title}</p>
          <motion.p
            className="text-3xl font-bold font-mono mt-1"
            style={{ color: t.label, textShadow: `0 0 20px ${t.glow}` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {value}
          </motion.p>
          {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${t.border}` }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Progress bar (optional) */}
      {barPct !== undefined && (
        <div>
          <div className="flex justify-between text-[10px] text-zinc-600 mb-1.5">
            <span>{detail ?? 'Progress'}</span>
            <span style={{ color: t.label }}>{barPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: t.bar }}
              initial={{ width: 0 }}
              animate={{ width: `${barPct}%` }}
              transition={{ duration: 1.2, delay: delay + 0.4, ease: [0.25, 1, 0.5, 1] }}
            />
          </div>
        </div>
      )}

      {/* Optional status stats (e.g. Активный / Готовится / Разработка) */}
      {statusStats && (
        <div className="flex gap-2">
          {statusStats.map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl px-2.5 py-2 flex flex-col items-center gap-0.5"
              style={{
                background: `${s.dotColor}12`,
                border: `1px solid ${s.dotColor}28`,
              }}
            >
              <span className="text-base font-bold font-mono" style={{ color: s.dotColor }}>{s.value}</span>
              <span className="text-[8px] text-zinc-600 text-center leading-tight">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom pulse dot */}
      <motion.div
        className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full"
        style={{ background: t.dot, boxShadow: `0 0 6px ${t.dot}` }}
        animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
