import React from 'react'
import { motion } from 'framer-motion'

// SVG mini radar triangle (3 axes: AURA, PING, LINK)
function RadarTriangle({ aura, ping, link }) {
  const cx = 44, cy = 44, r = 32
  // Vertex positions (equilateral triangle, top = AURA)
  const verts = [
    [cx, cy - r],                                               // top — AURA
    [cx + r * Math.sin((2 * Math.PI) / 3), cy + r * Math.cos((2 * Math.PI) / 3) - r * 0.5 + 8],  // bottom-right — PING
    [cx - r * Math.sin((2 * Math.PI) / 3), cy + r * Math.cos((2 * Math.PI) / 3) - r * 0.5 + 8],  // bottom-left — LINK
  ]

  // Corrected vertex positions for equilateral triangle
  const top   = [cx, cy - r]
  const bR    = [cx + r * 0.866, cy + r * 0.5]
  const bL    = [cx - r * 0.866, cy + r * 0.5]
  const outer = [top, bR, bL]

  const vals  = [aura / 100, ping / 100, link / 100]
  const inner = outer.map(([x, y], i) => [
    cx + (x - cx) * vals[i],
    cy + (y - cy) * vals[i],
  ])

  const toPath = (pts) => pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + 'Z'

  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="flex-shrink-0">
      {/* Outer skeleton rings at 33% / 66% / 100% */}
      {[1, 0.66, 0.33].map((scale, i) => (
        <polygon
          key={i}
          points={outer.map(([x, y]) => `${(cx + (x - cx) * scale).toFixed(1)},${(cy + (y - cy) * scale).toFixed(1)}`).join(' ')}
          fill="none"
          stroke="rgba(139,92,246,0.12)"
          strokeWidth="1"
        />
      ))}
      {/* Axis lines */}
      {outer.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
      ))}
      {/* Filled area */}
      <motion.path
        d={toPath(outer.map(([x, y]) => [cx, cy]))} // start from center
        animate={{ d: toPath(inner) }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        fill="rgba(139,92,246,0.22)"
        stroke="rgba(167,139,250,0.7)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Vertex dots */}
      {inner.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy} r="3"
          animate={{ cx: x, cy: y }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          fill="#a78bfa"
          style={{ filter: 'drop-shadow(0 0 3px rgba(167,139,250,0.8))' }}
        />
      ))}
    </svg>
  )
}

export default function DigitalIntuition({ aura, ping, link, delay = 0 }) {
  const composite = Math.round((aura * 0.4 + ping * 0.35 + link * 0.25))
  const grade = composite >= 85 ? 'S' : composite >= 70 ? 'A' : composite >= 55 ? 'B' : 'C'

  const metrics = [
    { label: 'AURA',  value: aura, color: '#a78bfa' },
    { label: 'PING',  value: ping, color: '#22d3ee'  },
    { label: 'LINK',  value: link, color: '#2dd4bf'  },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.09) 0%, rgba(34,211,238,0.05) 60%, rgba(0,0,0,0) 100%)',
        border: '1px solid rgba(139,92,246,0.25)',
        boxShadow: '0 0 40px rgba(139,92,246,0.12)',
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

      {/* Main content: radar + score */}
      <div className="flex items-center gap-4">
        <RadarTriangle aura={aura} ping={ping} link={link} />

        <div className="flex flex-col gap-2 flex-1">
          {/* Grade badge */}
          <div className="flex items-baseline gap-2">
            <motion.span
              className="text-4xl font-bold font-mono"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.5))',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.6 }}
            >
              {composite}
            </motion.span>
            <div
              className="text-xs font-bold px-1.5 py-0.5 rounded font-mono"
              style={{
                background: 'rgba(167,139,250,0.15)',
                border: '1px solid rgba(167,139,250,0.3)',
                color: '#a78bfa',
              }}
            >
              {grade}
            </div>
          </div>
          <p className="text-[10px] text-zinc-600">Интегральный индекс</p>

          {/* Mini metrics */}
          <div className="flex flex-col gap-1.5 mt-1">
            {metrics.map((m, i) => (
              <div key={m.label} className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-600 w-7">{m.label}</span>
                <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: m.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.9, delay: delay + 0.4 + i * 0.1 }}
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
