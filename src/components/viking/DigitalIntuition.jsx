import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Colors matching the three services: AURA=purple, PING=cyan, LINK=teal
const C = {
  aura: '#a78bfa',
  ping: '#22d3ee',
  link: '#2dd4bf',
}

function RadarTriangle({ aura, ping, link }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300)
    return () => clearTimeout(t)
  }, [])

  const cx = 44, cy = 46, r = 30
  const top = [cx, cy - r]
  const bR  = [cx + r * 0.866, cy + r * 0.5]
  const bL  = [cx - r * 0.866, cy + r * 0.5]
  const outer = [top, bR, bL]
  const colors = [C.aura, C.ping, C.link]

  const vals = [aura / 100, ping / 100, link / 100]
  const inner = outer.map(([x, y], i) => [cx + (x - cx) * vals[i], cy + (y - cy) * vals[i]])
  const poly  = (pts) => pts.map((p) => p.join(',')).join(' ')

  return (
    <svg width="88" height="92" viewBox="0 0 88 92" className="flex-shrink-0">
      {/* Skeleton rings */}
      {[1, 0.66, 0.33].map((s, i) => (
        <polygon
          key={i}
          points={poly(outer.map(([x, y]) => [cx + (x - cx) * s, cy + (y - cy) * s]))}
          fill="none"
          stroke="rgba(167,139,250,0.1)"
          strokeWidth="1"
        />
      ))}
      {/* Axis lines — each in its service color */}
      {outer.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y}
          stroke={colors[i] + '25'} strokeWidth="1" />
      ))}

      {/* Filled area fades/scales in */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.6 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <polygon
          points={poly(inner)}
          fill="rgba(139,92,246,0.18)"
          stroke="url(#triGrad)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Colored vertex dots — one per service */}
        {inner.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4"
            fill={colors[i]}
            style={{ filter: `drop-shadow(0 0 4px ${colors[i]})` }}
          />
        ))}
      </motion.g>

      {/* SVG gradient for stroke */}
      <defs>
        <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.aura} />
          <stop offset="50%"  stopColor={C.ping} />
          <stop offset="100%" stopColor={C.link} />
        </linearGradient>
      </defs>

      {/* Axis labels */}
      {[['AURA', top], ['PING', bR], ['LINK', bL]].map(([label, [x, y]], i) => (
        <text
          key={label}
          x={x + (i === 1 ? 7 : i === 2 ? -7 : 0)}
          y={y + (i === 0 ? -6 : 11)}
          textAnchor={i === 1 ? 'start' : i === 2 ? 'end' : 'middle'}
          fontSize="7"
          fill={colors[i] + 'bb'}
          fontFamily="JetBrains Mono, monospace"
        >
          {label}
        </text>
      ))}
    </svg>
  )
}

export default function DigitalIntuition({ aura, ping, link, delay = 0 }) {
  const composite = Math.round(aura * 0.4 + ping * 0.35 + link * 0.25)
  const grade = composite >= 85 ? 'S' : composite >= 70 ? 'A' : composite >= 55 ? 'B' : 'C'

  const metrics = [
    { label: 'AURA', value: aura, color: C.aura },
    { label: 'PING', value: ping, color: C.ping },
    { label: 'LINK', value: link, color: C.link },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
      style={{
        background: `linear-gradient(135deg,
          rgba(167,139,250,0.08) 0%,
          rgba(34,211,238,0.05) 50%,
          rgba(45,212,191,0.04) 100%)`,
        border: '1px solid rgba(167,139,250,0.2)',
        boxShadow: `0 0 30px rgba(167,139,250,0.1),
                    0 0 60px rgba(34,211,238,0.05)`,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Tri-color ambient glow */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)` }} />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)` }} />

      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold"
          style={{
            background: `linear-gradient(90deg, ${C.aura}, ${C.ping}, ${C.link})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Инструменты · Composite
        </p>
        <p className="text-white font-bold text-lg mt-0.5">Цифровая интуиция</p>
      </div>

      {/* Radar + score */}
      <div className="flex items-center gap-3">
        <RadarTriangle aura={aura} ping={ping} link={link} />

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <motion.span
              className="text-4xl font-bold font-mono"
              style={{
                background: `linear-gradient(135deg, ${C.aura}, ${C.ping})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.5 }}
            >
              {composite}
            </motion.span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded font-mono"
              style={{
                background: 'rgba(167,139,250,0.12)',
                border: `1px solid ${C.aura}40`,
                color: C.aura,
              }}
            >
              {grade}
            </span>
          </div>
          <p className="text-[10px] text-zinc-600 -mt-1">Интегральный индекс</p>

          <div className="flex flex-col gap-1.5 mt-1">
            {metrics.map((m, i) => (
              <div key={m.label} className="flex items-center gap-2">
                <span className="text-[10px] w-7 font-mono" style={{ color: m.color }}>{m.label}</span>
                <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: m.color, boxShadow: `0 0 4px ${m.color}` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.9, delay: delay + 0.35 + i * 0.1 }}
                  />
                </div>
                <span className="text-[10px] font-mono" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tri-color pulsing dot */}
      <motion.div
        className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${C.aura}, ${C.link})`,
          boxShadow: `0 0 6px ${C.aura}`,
        }}
        animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />
    </motion.div>
  )
}
