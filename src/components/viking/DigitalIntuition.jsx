import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Colors matching the three services: AURA=purple, PING=cyan, LINK=teal
const C = {
  aura: '#a78bfa',
  ping: '#22d3ee',
  link: '#2dd4bf',
}

// Genesis certificate data
const GENESIS_CERTS = [
  {
    class: 'A',
    title: 'Послідовник ідей стартапу',
    desc: 'Повірив в ідею до того, як вона стала реальністю',
    bg: 'linear-gradient(135deg, #0c2a4a 0%, #0d3a6e 50%, #0a2d5c 100%)',
    border: 'rgba(56,189,248,0.5)',
    glow: 'rgba(56,189,248,0.25)',
    labelColor: '#7dd3fc',
    classColor: '#38bdf8',
    circuitColor: 'rgba(56,189,248,0.12)',
  },
  {
    class: 'B',
    title: 'Прихильник стартапу',
    desc: 'Зробив впевнений крок назустріч своєму кращому майбутньому, коли інші навіть не здогадувалися про такі можливості',
    bg: 'linear-gradient(135deg, #0f1f3d 0%, #1e3a6e 50%, #0f2a56 100%)',
    border: 'rgba(96,165,250,0.5)',
    glow: 'rgba(96,165,250,0.2)',
    labelColor: '#93c5fd',
    classColor: '#60a5fa',
    circuitColor: 'rgba(96,165,250,0.1)',
  },
  {
    class: 'C',
    title: 'Активний учасник стартапу',
    desc: 'Почав надавати форму майбутньому своїми діями',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #2a2018 50%, #1c1c1c 100%)',
    border: 'rgba(180,130,60,0.5)',
    glow: 'rgba(180,130,60,0.2)',
    labelColor: '#d4a855',
    classColor: '#c49a3c',
    circuitColor: 'rgba(180,130,60,0.1)',
  },
  {
    class: 'E',
    title: 'Драйвер розвитку стартапу',
    desc: 'Став лідером, на якого могли покластися інші',
    bg: 'linear-gradient(135deg, #1e1208 0%, #2d1a08 50%, #1a0e04 100%)',
    border: 'rgba(217,119,6,0.5)',
    glow: 'rgba(217,119,6,0.2)',
    labelColor: '#fbbf24',
    classColor: '#f59e0b',
    circuitColor: 'rgba(217,119,6,0.1)',
  },
  {
    class: 'S',
    title: 'Візіонер реалізації стартапу',
    desc: 'Побачив архітектуру майбутнього, коли інші ще не здогадувалися про неї',
    bg: 'linear-gradient(135deg, #0a0e14 0%, #141c28 50%, #0c1018 100%)',
    border: 'rgba(148,163,184,0.4)',
    glow: 'rgba(148,163,184,0.15)',
    labelColor: '#cbd5e1',
    classColor: '#94a3b8',
    circuitColor: 'rgba(148,163,184,0.08)',
  },
]

// Genesis propeller icon (3-blade fan shape from screenshots)
function PropellerIcon({ color, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 12 C12 8, 16 4, 20 6 C18 10, 14 11, 12 12Z" fill={color} opacity="0.9" />
      <path d="M12 12 C8 12, 4 16, 6 20 C10 18, 11 14, 12 12Z" fill={color} opacity="0.9" />
      <path d="M12 12 C10 8, 6 8, 4 6 C6 10, 10 12, 12 12Z" fill={color} opacity="0.7" />
      <circle cx="12" cy="12" r="2.5" fill={color} />
    </svg>
  )
}

// Circuit pattern overlay (SVG lines mimicking PCB traces)
function CircuitPattern({ color }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 240 100" preserveAspectRatio="none" aria-hidden>
      <line x1="0" y1="20" x2="60" y2="20" stroke={color} strokeWidth="0.8" />
      <line x1="60" y1="20" x2="60" y2="35" stroke={color} strokeWidth="0.8" />
      <line x1="60" y1="35" x2="100" y2="35" stroke={color} strokeWidth="0.8" />
      <circle cx="60" cy="20" r="2" fill={color} />
      <circle cx="60" cy="35" r="2" fill={color} />

      <line x1="240" y1="70" x2="180" y2="70" stroke={color} strokeWidth="0.8" />
      <line x1="180" y1="70" x2="180" y2="55" stroke={color} strokeWidth="0.8" />
      <line x1="180" y1="55" x2="140" y2="55" stroke={color} strokeWidth="0.8" />
      <circle cx="180" cy="70" r="2" fill={color} />
      <circle cx="180" cy="55" r="2" fill={color} />

      <line x1="0" y1="80" x2="30" y2="80" stroke={color} strokeWidth="0.6" />
      <line x1="30" y1="80" x2="30" y2="65" stroke={color} strokeWidth="0.6" />
      <circle cx="30" cy="80" r="1.5" fill={color} />
      <circle cx="30" cy="65" r="1.5" fill={color} />

      <line x1="200" y1="15" x2="240" y2="15" stroke={color} strokeWidth="0.6" />
      <line x1="200" y1="15" x2="200" y2="30" stroke={color} strokeWidth="0.6" />
      <circle cx="200" cy="15" r="1.5" fill={color} />
    </svg>
  )
}

// Single Genesis card
function GenesisCard({ cert }) {
  return (
    <div
      className="relative flex-shrink-0 rounded-xl overflow-hidden select-none"
      style={{
        width: 220,
        height: 120,
        background: cert.bg,
        border: `1px solid ${cert.border}`,
        boxShadow: `0 0 20px ${cert.glow}, inset 0 0 30px rgba(255,255,255,0.02)`,
      }}
    >
      {/* Circuit traces */}
      <CircuitPattern color={cert.circuitColor} />

      {/* Frosted glass sheen */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-3 h-full flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-sm font-black tracking-[0.15em] uppercase"
              style={{
                color: cert.labelColor,
                textShadow: `0 0 12px ${cert.classColor}80`,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              GENESIS
            </p>
            <p className="text-[10px] font-semibold text-white/90 leading-tight mt-0.5 max-w-[140px]">
              {cert.title}
            </p>
          </div>
          <PropellerIcon color={cert.classColor} size={20} />
        </div>

        {/* Description */}
        <p className="text-[8.5px] leading-relaxed mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {cert.desc}
        </p>

        {/* Bottom row */}
        <div className="flex justify-end mt-auto pt-1">
          <span
            className="text-xs font-bold tracking-widest"
            style={{
              color: cert.classColor,
              textShadow: `0 0 8px ${cert.classColor}`,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            Class {cert.class}
          </span>
        </div>
      </div>
    </div>
  )
}

// Auto-scrolling carousel
function GenesisCertCarousel() {
  const trackRef = useRef(null)
  const animRef = useRef(null)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const CARD_W = 232 // card + gap
  const TOTAL_W = CARD_W * GENESIS_CERTS.length
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const step = () => {
      if (!pausedRef.current) {
        posRef.current += 0.5
        if (posRef.current >= TOTAL_W) posRef.current -= TOTAL_W
        track.style.transform = `translateX(${-posRef.current}px)`
        // update active dot
        const idx = Math.round(posRef.current / CARD_W) % GENESIS_CERTS.length
        setActive(idx)
      }
      animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-semibold">
          Сертифікат Genesis · посилює можливості
        </p>
        {/* Dots */}
        <div className="flex gap-1">
          {GENESIS_CERTS.map((c, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 14 : 4,
                height: 4,
                background: i === active ? GENESIS_CERTS[i].classColor : 'rgba(255,255,255,0.1)',
                boxShadow: i === active ? `0 0 6px ${GENESIS_CERTS[i].classColor}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrolling track */}
      <div
        className="overflow-hidden relative"
        style={{ height: 120 }}
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
        onTouchStart={() => { pausedRef.current = true }}
        onTouchEnd={() => { pausedRef.current = false }}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(10,8,20,1), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, rgba(10,8,20,1), transparent)' }} />

        {/* Duplicated track for seamless loop */}
        <div
          ref={trackRef}
          className="flex gap-3 absolute left-0 top-0"
          style={{ width: TOTAL_W * 2 }}
        >
          {[...GENESIS_CERTS, ...GENESIS_CERTS].map((cert, i) => (
            <GenesisCard key={i} cert={cert} />
          ))}
        </div>
      </div>
    </div>
  )
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
      {[1, 0.66, 0.33].map((s, i) => (
        <polygon
          key={i}
          points={poly(outer.map(([x, y]) => [cx + (x - cx) * s, cy + (y - cy) * s]))}
          fill="none"
          stroke="rgba(167,139,250,0.1)"
          strokeWidth="1"
        />
      ))}
      {outer.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y}
          stroke={colors[i] + '25'} strokeWidth="1" />
      ))}
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
        {inner.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4"
            fill={colors[i]}
            style={{ filter: `drop-shadow(0 0 4px ${colors[i]})` }}
          />
        ))}
      </motion.g>
      <defs>
        <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.aura} />
          <stop offset="50%"  stopColor={C.ping} />
          <stop offset="100%" stopColor={C.link} />
        </linearGradient>
      </defs>
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
          Інструменти · Composite
        </p>
        <p className="text-white font-bold text-lg mt-0.5">Цифрова інтуїція</p>
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
          <p className="text-[10px] text-zinc-600 -mt-1">Інтегральний індекс</p>

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

      {/* Divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.2), transparent)' }} />

      {/* Genesis certificate carousel */}
      <GenesisCertCarousel />

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
