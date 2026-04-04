import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

const COLOR = {
  blue:    { stroke: '#60a5fa', fill: '#3b82f6', glow: 'rgba(96,165,250,0.3)'  },
  purple:  { stroke: '#a78bfa', fill: '#7c3aed', glow: 'rgba(167,139,250,0.3)' },
  gold:    { stroke: '#fbbf24', fill: '#b45309', glow: 'rgba(251,191,36,0.3)'  },
  emerald: { stroke: '#34d399', fill: '#047857', glow: 'rgba(52,211,153,0.3)'  },
  cyan:    { stroke: '#22d3ee', fill: '#0e7490', glow: 'rgba(34,211,238,0.3)'  },
  rose:    { stroke: '#fb7185', fill: '#be123c', glow: 'rgba(251,113,133,0.3)' },
  indigo:  { stroke: '#818cf8', fill: '#3730a3', glow: 'rgba(129,140,248,0.3)' },
  orange:  { stroke: '#fb923c', fill: '#c2410c', glow: 'rgba(251,146,60,0.3)'  },
  teal:    { stroke: '#2dd4bf', fill: '#0f766e', glow: 'rgba(45,212,191,0.3)'  },
}

// Custom tooltip for big chart
function BigTooltip({ active, payload, label }) {
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
      {payload.map((p) => (
        <p key={p.dataKey} className="font-bold" style={{ color: p.stroke }}>
          {p.name}: ${Number(p.value).toLocaleString('en-US')}
        </p>
      ))}
    </div>
  )
}

// Mini sparkline for each role
function RoleSparkline({ role, timeline, active, onClick }) {
  const c = COLOR[role.color] ?? COLOR.blue
  const id = `spark-${role.name.replace(/\s/g, '')}`

  // derive per-role data from timeline
  const data = timeline.map(pt => ({
    year: pt.year,
    value: Math.round(pt.value * role.pct / 100),
  }))
  const latest = data[data.length - 1].value

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-xl p-3 flex flex-col gap-1.5 text-left transition-all duration-200 overflow-hidden"
      style={{
        background: active ? `${c.fill}18` : 'rgba(255,255,255,0.025)',
        border: `1px solid ${active ? c.stroke + '45' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: active ? `0 0 16px ${c.glow}` : 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-none" style={{ color: c.stroke }}>{role.icon}</span>
          <span className="text-[11px] font-bold text-zinc-200 leading-tight">{role.name}</span>
        </div>
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ background: `${c.stroke}18`, color: c.stroke }}
        >
          {role.pct}%
        </span>
      </div>

      {/* Income */}
      <p className="text-xs font-bold font-mono" style={{ color: c.stroke }}>
        ${latest.toLocaleString('en-US')}
      </p>

      {/* Sparkline */}
      <div style={{ height: 40, marginLeft: -12, marginRight: -12, marginBottom: -8 }}>
        <ResponsiveContainer width="100%" height={40}>
          <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.stroke} stopOpacity={0.35} />
                <stop offset="100%" stopColor={c.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={c.stroke}
              strokeWidth={1.5}
              fill={`url(#${id})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.button>
  )
}

export default function EconomyChartBlock({ timeline, roles, delay = 0 }) {
  const [activeRole, setActiveRole] = useState(null)

  const total = timeline[timeline.length - 1].value
  const growthPct = (((total - timeline[0].value) / timeline[0].value) * 100).toFixed(0)

  // Build multi-line data: each point has total + per-role values
  const multiData = timeline.map(pt => {
    const row = { year: pt.year, Суммарно: pt.value }
    roles.forEach(r => {
      row[r.name] = Math.round(pt.value * r.pct / 100)
    })
    return row
  })

  // Which role is shown in the big chart overlay (null = all combined)
  const shownRole = activeRole ? roles.find(r => r.name === activeRole) : null

  return (
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

      {/* ── Big chart ── */}
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={multiData}
            margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="bigTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              {roles.map(r => {
                const c = COLOR[r.color] ?? COLOR.blue
                return (
                  <linearGradient key={r.name} id={`big-${r.name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.stroke} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={c.stroke} stopOpacity={0} />
                  </linearGradient>
                )
              })}
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: '#52525b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
              width={40}
            />
            <Tooltip content={<BigTooltip />} cursor={{ stroke: 'rgba(139,92,246,0.25)', strokeWidth: 1 }} />

            {/* Show either total or selected role */}
            {!shownRole ? (
              <Area
                type="monotone"
                dataKey="Суммарно"
                name="Суммарно"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fill="url(#bigTotal)"
                dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#a78bfa', stroke: 'rgba(139,92,246,0.4)', strokeWidth: 3 }}
              />
            ) : (
              <Area
                type="monotone"
                dataKey={shownRole.name}
                name={shownRole.name}
                stroke={COLOR[shownRole.color]?.stroke ?? '#8b5cf6'}
                strokeWidth={2.5}
                fill={`url(#big-${shownRole.name})`}
                dot={{ fill: COLOR[shownRole.color]?.stroke, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Divider ── */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)' }} />

      {/* ── Role mini-charts grid ── */}
      <div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-semibold mb-3">
          Income by Role · нажмите для выбора
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {roles.map((role, i) => (
            <RoleSparkline
              key={role.name}
              role={role}
              timeline={timeline}
              active={activeRole === role.name}
              onClick={() => setActiveRole(prev => prev === role.name ? null : role.name)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
