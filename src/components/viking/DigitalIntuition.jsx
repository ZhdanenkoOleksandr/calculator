import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Animated SVG radar triangle — no path morphing, just opacity + scale fade-in
function RadarTriangle({ aura, ping, link }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 300); return () => clearTimeout(t) }, [])

  const cx = 44, cy = 46, r = 30
  const top = [cx,           cy - r]
  const bR  = [cx + r * 0.866, cy + r * 0.5]
  const bL  = [cx - r * 0.866, cy + r * 0.5]
  const outer = [top, bR, bL]

  const vals = [aura / 100, ping / 100, link / 100]
  const inner = outer.map(([x, y], i) => [cx + (x - cx) * vals[i], cy + (y - cy) * vals[i]])

  const poly = (pts) => pts.map((p) => p.join(',')).join(' ')

  return (
    <svg width="88" height="92" viewBox="0 0 88 92" className="flex-shrink-0">
      {/* Skeleton rings at 33% / 66% / 100% */}
      {[1, 0.66, 0.33].map((s, i) => (
        <polygon
          key={i}
          points={poly(outer.map(([x, y]) => [cx + (x - cx) * s, cy + (y - cy) * s]))}
          fill="none"
          stroke="rgba(139,92,246,0.13)"
          strokeWidth="1"
        />
      ))}
      {/* Axis lines */}
      {outer.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
      ))}
      {/* Filled area — fades in after mount */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.6 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <polygon
          points={poly(inner)}
          fill="rgba(139,92,246,0.25)"
          stroke="rgba(167,139,250,0.75)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {inner.map(([x, y], i) => (
          <circle
            key={i}
            cx={x} cy={y} r="3.5"
            fill="#a78bfa"
            style={{ filter: 'drop-shadow(0 0 3px rgba(167,139,250,0.8))' }}
          />
        ))}
      </motion.g>

      {/* Axis labels */}
      {[['AURA', top], ['PING', bR], ['LINK', bL]].map(([label, [x, y]], i) => (
        <text
          key={label}
          x={x + (i === 1 ? 6 : i === 2 ? -6 : 0)}
          y={y + (i === 0 ? -6 : 10)}
          textAnchor={i === 1 ? 'start' : i === 2 ? 'end' : 'middle'}
          fontSize="7"
          fill="rgba(113,113,122,0.8)"
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
    { label: 'AURA', value: aura, color: '#a78bfa' },
    { label: 'PING', value: ping, color: '#22d3ee'  },
    { label: 'LINK', value: link, color: '#2dd4bf'  },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.09) 0%, rgba(34,211,238,0.05) 60%, transparent 100%)',
        border: '1px solid rgba(139,92,246,0.25)',
        boxShadow: '0 0 40px rgba(139,92,246,0.1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
          Сервисы · Composite
        </p>
        <p className="text-white font-bold text-lg mt-0.5">Цифровая интуиция</p>
      </div>

      {/* Radar + score */}
      <div className="flex items-center gap-3">
        <RadarTriangle aura={aura} ping={ping} link={link} />

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Score + grade */}
          <div className="flex items-baseline gap-2">
            <motion.span
              className="text-4xl font-bold font-mono"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.5 }}
            >
              {composite}
            </motion.span>
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded font-mono"
              style={{
                background: 'rgba(167,139,250,0.15)',
                border: '1px solid rgba(167,139,250,0.3)',
                color: '#a78bfa',
              }}
            >
              {grade}
            </span>
          </div>
          <p className="text-[10px] text-zinc-600 -mt-1">Интегральный индекс</p>

          {/* Mini bars */}
          <div className="flex flex-col gap-1.5 mt-1">
            {metrics.map((m, i) => (
              <div key={m.label} className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-600 w-7 font-mono">{m.label}</span>
                <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: m.color }}
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

      {/* Pulsing dot */}
      <motion.div
        className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full"
        style={{ background: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }}
        animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />
    </motion.div>
  )
}
