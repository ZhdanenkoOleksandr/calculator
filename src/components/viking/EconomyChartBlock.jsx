import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { AcademyFace } from './RoleDistribution'

const COLOR = {
  blue:    { stroke: '#60a5fa', fill: '#3b82f6', glow: 'rgba(96,165,250,0.25)',  bar: 'linear-gradient(90deg,#1d4ed8,#60a5fa)'  },
  purple:  { stroke: '#a78bfa', fill: '#7c3aed', glow: 'rgba(167,139,250,0.25)', bar: 'linear-gradient(90deg,#7c3aed,#a78bfa)'  },
  gold:    { stroke: '#fbbf24', fill: '#b45309', glow: 'rgba(251,191,36,0.25)',  bar: 'linear-gradient(90deg,#b45309,#fbbf24)'  },
  emerald: { stroke: '#34d399', fill: '#047857', glow: 'rgba(52,211,153,0.25)',  bar: 'linear-gradient(90deg,#047857,#34d399)'  },
  cyan:    { stroke: '#22d3ee', fill: '#0e7490', glow: 'rgba(34,211,238,0.25)',  bar: 'linear-gradient(90deg,#0e7490,#22d3ee)'  },
  orange:  { stroke: '#fb923c', fill: '#c2410c', glow: 'rgba(251,146,60,0.25)',  bar: 'linear-gradient(90deg,#c2410c,#fb923c)'  },
  teal:    { stroke: '#2dd4bf', fill: '#0f766e', glow: 'rgba(45,212,191,0.25)',  bar: 'linear-gradient(90deg,#0f766e,#2dd4bf)'  },
  rose:    { stroke: '#fb7185', fill: '#be123c', glow: 'rgba(251,113,133,0.25)', bar: 'linear-gradient(90deg,#be123c,#fb7185)'  },
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-3 py-2 text-sm font-mono"
      style={{
        background: 'rgba(9,9,11,0.92)',
        border: '1px solid rgba(139,92,246,0.35)',
        boxShadow: '0 0 20px rgba(139,92,246,0.2)',
      }}
    >
      <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="font-bold" style={{ color: p.stroke ?? '#a78bfa' }}>
          {p.name}: ${Number(p.value).toLocaleString('en-US')}
        </p>
      ))}
    </div>
  )
}

// Mini sparkline chart for a single role
function MiniRoleChart({ role, chartData, active, onClick }) {
  const c = COLOR[role.color] ?? COLOR.blue
  const gradId = `mini-grad-${role.name.replace(/\s/g, '')}`
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="rounded-xl p-2.5 cursor-pointer transition-all duration-200"
      style={{
        background: active ? `${c.fill}18` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${active ? c.stroke + '45' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: active ? `0 0 14px ${c.glow}` : 'none',
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold text-zinc-400 leading-tight truncate" style={{ maxWidth: '70%' }}>
          {role.name}
        </span>
        <span className="text-[10px] font-bold font-mono flex-shrink-0 ml-1" style={{ color: c.stroke }}>
          ${role.income.toLocaleString('en-US')}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={52}>
        <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.stroke} stopOpacity={0.4} />
              <stop offset="100%" stopColor={c.stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={role.name}
            stroke={c.stroke}
            strokeWidth={1.5}
            fill={`url(#${gradId})`}
            dot={false}
            activeDot={{ r: 3, fill: c.stroke }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// Horizontal role bar (no percentage)
function RoleBar({ role, maxIncome, index, active, onClick }) {
  const c = COLOR[role.color] ?? COLOR.blue
  const pct = Math.round((role.income / maxIncome) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      onClick={onClick}
      className="rounded-xl px-4 py-3 cursor-pointer transition-all duration-200"
      style={{
        background: active ? `${c.fill}18` : 'rgba(255,255,255,0.025)',
        border: `1px solid ${active ? c.stroke + '45' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: active ? `0 0 16px ${c.glow}` : 'none',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none" style={{ color: c.stroke }}>{role.icon}</span>
          <span className="text-sm font-semibold text-zinc-200">{role.name}</span>
        </div>
        <span className="text-xs font-bold font-mono" style={{ color: c.stroke }}>
          ${role.income.toLocaleString('en-US')}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: c.bar, boxShadow: `0 0 6px ${c.glow}` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay: 0.15 + index * 0.08, ease: [0.25, 1, 0.5, 1] }}
        />
      </div>
    </motion.div>
  )
}

// Slide-up Academy overlay
function AcademyOverlay({ tab, onClose }) {
  return (
    <AnimatePresence>
      {tab && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
            style={{
              background: 'rgba(10,8,24,0.98)',
              border: '1px solid rgba(167,139,250,0.2)',
              borderBottom: 'none',
              maxHeight: '75vh',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <div className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(75vh - 24px)', scrollbarWidth: 'none' }}>
              <AcademyFace onFlipBack={onClose} defaultTab={tab} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function EconomyChartBlock({ timeline, roles, delay = 0 }) {
  const [activeRole, setActiveRole] = useState(null)
  const [academyTab, setAcademyTab] = useState(null) // null | 'roles' | 'professions'

  const total     = timeline[timeline.length - 1].value
  const growthPct = (((total - timeline[0].value) / timeline[0].value) * 100).toFixed(0)
  const maxIncome = Math.max(...roles.map(r => r.income))
  const shownRole = activeRole ? roles.find(r => r.name === activeRole) : null

  // Timeline with per-role values derived from income ratio
  const chartData = timeline.map(pt => {
    const row = { year: pt.year, Суммарно: pt.value }
    roles.forEach(r => { row[r.name] = Math.round(pt.value * (r.income / total)) })
    return row
  })

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="rounded-2xl p-5 flex flex-col gap-5"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
              Income by Role · Earned Since 2018
            </p>
            <p className="text-white font-bold text-xl mt-0.5">
              ${total.toLocaleString('en-US')}
              {shownRole && (
                <span className="ml-2 text-sm font-normal" style={{ color: COLOR[shownRole.color]?.stroke }}>
                  · {shownRole.name}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {shownRole && (
              <button
                onClick={() => setActiveRole(null)}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#71717a' }}
              >
                ← Общий
              </button>
            )}
            <div
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +{growthPct}% total
            </div>
          </div>
        </div>

        {/* ── Big chart (overall or selected role) ── */}
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                {roles.map(r => {
                  const c = COLOR[r.color] ?? COLOR.blue
                  return (
                    <linearGradient key={r.name} id={`grad-${r.name.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.stroke} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={c.stroke} stopOpacity={0} />
                    </linearGradient>
                  )
                })}
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52525b', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`} width={42} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139,92,246,0.25)', strokeWidth: 1 }} />

              {!shownRole ? (
                <Area type="monotone" dataKey="Суммарно" name="Суммарно"
                  stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gradTotal)"
                  dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#a78bfa', stroke: 'rgba(139,92,246,0.4)', strokeWidth: 3 }}
                />
              ) : (
                <Area type="monotone" dataKey={shownRole.name} name={shownRole.name}
                  stroke={COLOR[shownRole.color]?.stroke ?? '#8b5cf6'}
                  strokeWidth={2.5}
                  fill={`url(#grad-${shownRole.name.replace(/\s/g,'')})`}
                  dot={{ fill: COLOR[shownRole.color]?.stroke, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Divider ── */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)' }} />

        {/* ── Mini per-role sparklines (2×2 grid) ── */}
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-semibold mb-2.5">По каждой роли</p>
          <div className="grid grid-cols-2 gap-2">
            {roles.map(role => (
              <MiniRoleChart
                key={role.name}
                role={role}
                chartData={chartData}
                active={activeRole === role.name}
                onClick={() => setActiveRole(prev => prev === role.name ? null : role.name)}
              />
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)' }} />

        {/* ── Role horizontal bars ── */}
        <div className="flex flex-col gap-2">
          {roles.map((role, i) => (
            <RoleBar
              key={role.name}
              role={role}
              maxIncome={maxIncome}
              index={i}
              active={activeRole === role.name}
              onClick={() => setActiveRole(prev => prev === role.name ? null : role.name)}
            />
          ))}
        </div>

        {/* ── Bottom nav ── */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)' }} />
        <div className="flex items-center justify-between gap-3">
          {/* Получить Роль */}
          <button
            onClick={() => setAcademyTab('roles')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#a78bfa',
              boxShadow: '0 0 12px rgba(139,92,246,0.12)',
            }}
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Получить Роль
          </button>

          {/* Center: indicator dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(139,92,246,0.5)' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#8b5cf6', boxShadow: '0 0 6px rgba(139,92,246,0.6)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(139,92,246,0.5)' }} />
          </div>

          {/* Получить Профессию */}
          <button
            onClick={() => setAcademyTab('professions')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: 'rgba(34,211,238,0.08)',
              border: '1px solid rgba(34,211,238,0.22)',
              color: '#22d3ee',
              boxShadow: '0 0 12px rgba(34,211,238,0.1)',
            }}
          >
            Получить Профессию
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* ── Slide-up Academy overlay ── */}
      <AcademyOverlay tab={academyTab} onClose={() => setAcademyTab(null)} />
    </>
  )
}
