import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── OneSpace trefoil logo (SVG recreation of the app icon) ────
function OneSpaceIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dark navy background */}
      <rect width="48" height="48" rx="10" fill="#0e1240"/>

      {/* Flower of life geometry (subtle) */}
      <g opacity="0.12" stroke="#c9a84c" strokeWidth="0.6" fill="none">
        <circle cx="24" cy="24" r="10"/>
        <circle cx="24" cy="14" r="10"/>
        <circle cx="24" cy="34" r="10"/>
        <circle cx="15.35" cy="19" r="10"/>
        <circle cx="32.65" cy="19" r="10"/>
        <circle cx="15.35" cy="29" r="10"/>
        <circle cx="32.65" cy="29" r="10"/>
      </g>

      {/* Trefoil petals — gold gradient */}
      <defs>
        <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d47a"/>
          <stop offset="100%" stopColor="#b8860b"/>
        </linearGradient>
      </defs>

      {/* Petal 1 — pointing up */}
      <path d="M24,24 C19,20 17,10 24,5 C31,10 29,20 24,24" fill="url(#goldG)"/>
      {/* Petal 2 — bottom-left (rotate 120°) */}
      <path transform="rotate(120,24,24)" d="M24,24 C19,20 17,10 24,5 C31,10 29,20 24,24" fill="url(#goldG)"/>
      {/* Petal 3 — bottom-right (rotate 240°) */}
      <path transform="rotate(240,24,24)" d="M24,24 C19,20 17,10 24,5 C31,10 29,20 24,24" fill="url(#goldG)"/>

      {/* Center gem */}
      <circle cx="24" cy="24" r="2.2" fill="#f0d47a" opacity="0.9"/>
    </svg>
  )
}

// ── Bitbon banner image (place /public/bitbon-banner.jpg) ─────
function BitbonBanner({ accent }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className="relative rounded-xl overflow-hidden w-full"
      style={{ height: 120, border: `1px solid ${accent}30` }}
    >
      {!failed ? (
        <img
          src="/bitbon-banner.jpg"
          alt="Система Bitbon"
          className="w-full h-full object-cover object-center"
          onError={() => setFailed(true)}
        />
      ) : (
        /* SVG fallback: glowing trefoil on dark bg */
        <div className="w-full h-full flex items-center justify-center relative"
          style={{ background: 'linear-gradient(135deg, #04091a, #0a1535)' }}
        >
          {/* Radial glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{
              width: 80, height: 80,
              background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
              borderRadius: '50%',
            }}/>
          </div>
          {/* Trefoil */}
          <svg width="72" height="72" viewBox="0 0 48 48" fill="none" style={{ filter: `drop-shadow(0 0 8px ${accent})` }}>
            <defs>
              <linearGradient id="bangold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={accent}/>
                <stop offset="100%" stopColor="#38bdf8"/>
              </linearGradient>
            </defs>
            <path d="M24,24 C19,20 17,10 24,5 C31,10 29,20 24,24" fill="url(#bangold)"/>
            <path transform="rotate(120,24,24)" d="M24,24 C19,20 17,10 24,5 C31,10 29,20 24,24" fill="url(#bangold)"/>
            <path transform="rotate(240,24,24)" d="M24,24 C19,20 17,10 24,5 C31,10 29,20 24,24" fill="url(#bangold)"/>
            <circle cx="24" cy="24" r="2.5" fill={accent}/>
          </svg>
          <p className="absolute bottom-2 right-3 text-[8px] uppercase tracking-widest" style={{ color: `${accent}60` }}>
            bitbon.space
          </p>
        </div>
      )}
    </div>
  )
}

// ── Shared mini metric row ─────────────────────────────────────
function MetricRow({ label, value, accent, bar, icon }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {icon && <span className="text-xs leading-none flex-shrink-0">{icon}</span>}
        <span className="text-[10px] text-zinc-500 truncate">{label}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {bar !== undefined && (
          <div className="w-12 h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: accent }}
              initial={{ width: 0 }}
              animate={{ width: `${bar}%` }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            />
          </div>
        )}
        <span className="text-[11px] font-bold font-mono" style={{ color: accent }}>{value}</span>
      </div>
    </div>
  )
}

// ── Connection line badge ──────────────────────────────────────
function ConnectedBadge({ color }) {
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color }}>
        Підключено · Oleksandr Zhdanenko
      </span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
//   LEFT — Система Bitbon
// ═══════════════════════════════════════════════════════════════
function BitbonSystemCard() {
  const C = '#1a6dff'        // electric blue (Bitbon brand)
  const C2 = '#00c8ff'       // cyan highlight

  const metrics = [
    { label: 'Рівень партнера',        value: 'Провайдер',  accent: C2,         icon: 'ᚹ' },
    { label: 'Асетбоксів',             value: '1',          accent: C2          },
    { label: 'Метаресурсів',           value: '30',         accent: C2,  bar: 60},
    { label: 'Протокол',               value: 'v3.2',       accent: '#60a5fa'   },
    { label: 'Участь у консенсусі',    value: '73%',        accent: C2,  bar: 73},
    { label: 'Смарт-контрактів',       value: '6 активних', accent: '#34d399'   },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #04091a 0%, #060f2a 55%, #05091e 100%)',
        border: `1px solid ${C}40`,
        boxShadow: `0 0 40px ${C}18, 0 0 80px rgba(0,200,255,0.05)`,
      }}
    >
      {/* Hex grid bg */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${C}22 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top neon line */}
      <div className="absolute top-0 left-8 right-8 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${C}, ${C2}, transparent)` }}
      />

      {/* Glow orb */}
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C}25 0%, transparent 70%)` }}
      />

      {/* Logo + title */}
      <div className="relative flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold"
          style={{
            background: `linear-gradient(135deg, ${C}30, ${C2}15)`,
            border: `1.5px solid ${C}60`,
            boxShadow: `0 0 16px ${C}30, inset 0 0 12px ${C}10`,
            color: C2,
          }}
        >
          ᛒ
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold"
            style={{ color: `${C2}80` }}>
            Платформа
          </p>
          <p className="text-white font-bold text-base mt-0.5 leading-tight">Система Bitbon</p>
          <ConnectedBadge color={C2} />
        </div>

        {/* Live badge */}
        <div
          className="flex-shrink-0 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
          style={{
            background: `${C}20`,
            border: `1px solid ${C}50`,
            color: C2,
          }}
        >
          Live
        </div>
      </div>

      {/* Banner image */}
      <BitbonBanner accent={C2} />

      {/* Metrics */}
      <div className="relative flex flex-col -mt-1">
        {metrics.map(m => <MetricRow key={m.label} {...m} />)}
      </div>

      {/* Bottom brand bar */}
      <div className="relative flex items-center gap-2 -mt-1">
        <div className="h-px flex-1"
          style={{ background: `linear-gradient(to right, ${C}50, transparent)` }}
        />
        <a
          href="https://www.bitbon.space/ua"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[8px] tracking-[0.25em] uppercase transition-opacity hover:opacity-60"
          style={{ color: `${C2}60` }}
        >
          bitbon.space ↗
        </a>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
//   RIGHT — OneSpace
// ═══════════════════════════════════════════════════════════════
function OneSpaceCard() {
  const P = '#7c3aed'    // violet
  const P2 = '#a78bfa'   // lavender
  const P3 = '#c4b5fd'   // light lavender

  const metrics = [
    { label: 'Профіль заповнено',     value: '88%',        accent: P2, bar: 88 },
    { label: 'Контакти / зв\'язки',   value: '347',        accent: P3           },
    { label: 'Публікацій',            value: '124',        accent: P2           },
    { label: 'Медіа-матеріалів',      value: '38',         accent: P3, bar: 38 },
    { label: 'Рейтинг у спільноті',   value: 'Top 5%',     accent: '#fb923c'    },
    { label: 'Сплай',                 value: '1 250 BBN',  accent: P2           },
    { label: 'Остання активність',     value: 'Сьогодні',   accent: '#34d399'    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 }}
      className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0e0520 0%, #130a2e 55%, #0b0418 100%)',
        border: `1px solid ${P}45`,
        boxShadow: `0 0 40px ${P}20, 0 0 80px rgba(196,181,253,0.05)`,
      }}
    >
      {/* Star-field bg */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 3 === 0 ? 2 : 1,
            height: i % 3 === 0 ? 2 : 1,
            background: P3,
            left: `${(i * 37 + 11) % 90 + 5}%`,
            top: `${(i * 23 + 7) % 80 + 10}%`,
            opacity: 0.25,
          }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Top neon line */}
      <div className="absolute top-0 left-8 right-8 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${P}, ${P2}, transparent)` }}
      />

      {/* Glow orb */}
      <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${P}30 0%, transparent 70%)` }}
      />

      {/* Logo + title */}
      <div className="relative flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            boxShadow: `0 0 16px ${P}40`,
          }}
        >
          <OneSpaceIcon size={48} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold"
            style={{ color: `${P2}80` }}>
            Соціальна мережа
          </p>
          <p className="text-white font-bold text-base mt-0.5 leading-tight">OneSpace</p>
          <ConnectedBadge color={P2} />
        </div>

        {/* Verified badge */}
        <div
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold"
          style={{
            background: `${P}22`,
            border: `1px solid ${P2}50`,
            color: P3,
          }}
        >
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke={P3} strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
          Верифіковано
        </div>
      </div>

      {/* Reputation highlight */}
      <div
        className="relative rounded-xl px-4 py-3 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${P}18, ${P2}08)`,
          border: `1px solid ${P}35`,
        }}
      >
        <div>
          <p className="text-[9px] uppercase tracking-widest" style={{ color: `${P2}70` }}>
            Репутація у OneSpace
          </p>
          <motion.p
            className="text-2xl font-bold font-mono mt-0.5"
            style={{ color: P3, textShadow: `0 0 20px ${P2}50` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            9 420
          </motion.p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {/* Mini activity sparkline */}
          <div className="flex items-end gap-0.5 h-6">
            {[40, 65, 45, 80, 55, 90, 75, 95].map((h, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-sm"
                style={{ background: `${P2}${i === 7 ? 'ff' : '60'}`, height: `${h}%` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
              />
            ))}
          </div>
          <span className="text-[9px] text-zinc-600">7-денна динаміка</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="relative flex flex-col -mt-1">
        {metrics.map(m => <MetricRow key={m.label} {...m} />)}
      </div>

      {/* Bottom brand bar */}
      <div className="relative flex items-center gap-2 -mt-1">
        <div className="h-px flex-1"
          style={{ background: `linear-gradient(to right, ${P}60, transparent)` }}
        />
        <a
          href="https://one.space"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[8px] tracking-[0.25em] uppercase transition-opacity hover:opacity-60"
          style={{ color: `${P2}60` }}
        >
          one.space ↗
        </a>
      </div>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────
const SLIDE = {
  initial: { opacity: 0, y: -12, height: 0 },
  animate: { opacity: 1, y: 0, height: 'auto' },
  exit:    { opacity: 0, y: -8,  height: 0 },
}

export default function EcosystemConnections({ showBitbon, showOnespace }) {
  const visible = showBitbon || showOnespace
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key="eco"
          initial={SLIDE.initial}
          animate={SLIDE.animate}
          exit={SLIDE.exit}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0.5">
            <AnimatePresence initial={false}>
              {showBitbon && (
                <motion.div key="bitbon"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3 }}
                >
                  <BitbonSystemCard />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {showOnespace && (
                <motion.div key="onespace"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3 }}
                >
                  <OneSpaceCard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
