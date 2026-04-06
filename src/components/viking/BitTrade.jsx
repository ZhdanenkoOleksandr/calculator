import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── IB Package data ───────────────────────────────────────────
const IB_PACKAGES = [
  {
    name: 'Платформенна економіка',
    icon: 'ᚷ',
    color: '#60a5fa',
    price: '$950',
    desc: 'Отримайте доступ до знань про цифрові екосистеми Індустрії 4.0.',
    cta: 'Оформити',
    soon: false,
    exclusive: false,
  },
  {
    name: 'Бібліотека ерудованого інвестора',
    icon: 'ᛒ',
    color: '#818cf8',
    price: null,
    desc: 'Отримуйте теоретичні та практичні знання про глобальну платформенну економіку в ексклюзивній колекції книг.',
    cta: 'Оформити',
    soon: false,
    exclusive: false,
  },
  {
    name: 'Bitbon Liquidity Upgraded Model for Business',
    icon: 'ᛚ',
    color: '#22d3ee',
    price: null,
    desc: 'Укладайте вигідні угоди в сервісі BLUMB з постачання Bitbon корпоративному сегменту.',
    cta: 'Оформити',
    soon: false,
    exclusive: false,
  },
  {
    name: 'Bitbon System Start-Up Pack',
    icon: 'ᚠ',
    color: '#fbbf24',
    price: 'от ₿ 500',
    desc: 'Скористайтеся історичним шансом і отримайте унікальну перевагу на етапі комерційного старту Системи Bitbon.',
    cta: 'Перейти',
    soon: false,
    exclusive: false,
    ctaColor: '#f97316',
  },
  {
    name: 'Bitbon Business Pack',
    icon: 'ᚹ',
    color: '#34d399',
    price: 'от $6 000',
    desc: 'Отримайте комплекс можливостей для запуску та розвитку свого бізнесу на базі Системи Bitbon.',
    cta: 'Оформити',
    soon: true,
    exclusive: false,
  },
  {
    name: 'Official Bitbon Distributor',
    icon: 'ᛟ',
    color: '#fb923c',
    price: null,
    desc: 'Отримайте можливість стати офіційним дистриб\'ютором Bitbon у своєму регіоні.',
    note: 'IB-пакет доступний лише для Стратегічних партнерів 6-го кар\'єрного рівня та вище',
    cta: null,
    soon: false,
    exclusive: true,
  },
]

// ── Role items for back face ──────────────────────────────────
const ROLE_THEME = {
  blue:    { bar: 'linear-gradient(90deg,#1d4ed8,#60a5fa)',   label: '#60a5fa', bg: 'rgba(59,130,246,0.07)',   border: 'rgba(59,130,246,0.22)'   },
  purple:  { bar: 'linear-gradient(90deg,#7c3aed,#a78bfa)',   label: '#a78bfa', bg: 'rgba(139,92,246,0.07)',   border: 'rgba(139,92,246,0.22)'   },
  gold:    { bar: 'linear-gradient(90deg,#b45309,#fbbf24)',   label: '#fbbf24', bg: 'rgba(245,158,11,0.07)',   border: 'rgba(245,158,11,0.22)'   },
  emerald: { bar: 'linear-gradient(90deg,#047857,#34d399)',   label: '#34d399', bg: 'rgba(52,211,153,0.07)',   border: 'rgba(52,211,153,0.22)'   },
  rose:    { bar: 'linear-gradient(90deg,#be123c,#fb7185)',   label: '#fb7185', bg: 'rgba(251,113,133,0.07)',  border: 'rgba(251,113,133,0.22)'  },
  cyan:    { bar: 'linear-gradient(90deg,#0e7490,#22d3ee)',   label: '#22d3ee', bg: 'rgba(34,211,238,0.07)',   border: 'rgba(34,211,238,0.22)'   },
  indigo:  { bar: 'linear-gradient(90deg,#3730a3,#818cf8)',   label: '#818cf8', bg: 'rgba(129,140,248,0.07)',  border: 'rgba(129,140,248,0.22)'  },
  orange:  { bar: 'linear-gradient(90deg,#c2410c,#fb923c)',   label: '#fb923c', bg: 'rgba(251,146,60,0.07)',   border: 'rgba(251,146,60,0.22)'   },
  teal:    { bar: 'linear-gradient(90deg,#0f766e,#2dd4bf)',   label: '#2dd4bf', bg: 'rgba(45,212,191,0.07)',   border: 'rgba(45,212,191,0.22)'   },
}

const TRADE_ROLES = [
  { name: 'Агент',       icon: 'ᚹ', color: 'emerald', pct: 75, range: '10–75%'  },
  { name: 'Консультант', icon: 'ᚲ', color: 'blue',    pct: 93, range: '10–93%'  },
  { name: 'Радник',      icon: 'ᚠ', color: 'orange',  pct: 100, range: '10–100%' },
]

// ── Package card ──────────────────────────────────────────────
function PackageCard({ pkg, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.06 }}
      className="rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${pkg.color}0d, ${pkg.color}05)`,
        border: `1px solid ${pkg.color}30`,
      }}
    >
      {/* Soon badge */}
      {pkg.soon && (
        <div
          className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24' }}
        >
          СКОРО
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-bold"
          style={{ background: `${pkg.color}18`, border: `1px solid ${pkg.color}35`, color: pkg.color }}
        >
          {pkg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: pkg.color }}>
            IB-Пакет
          </p>
          <p className="text-xs font-bold text-zinc-200 leading-tight">{pkg.name}</p>
        </div>
      </div>

      {/* Price */}
      {pkg.price && (
        <p className="text-sm font-bold font-mono" style={{ color: pkg.color }}>
          {pkg.price}
        </p>
      )}

      {/* Description */}
      <p className="text-[10px] text-zinc-500 leading-relaxed flex-1">{pkg.desc}</p>

      {/* Note (exclusive) */}
      {pkg.note && (
        <p className="text-[9px] italic text-zinc-600 leading-snug">{pkg.note}</p>
      )}

      {/* CTA */}
      {pkg.cta && !pkg.soon && (
        <button
          className="mt-auto w-full rounded-lg py-1.5 text-xs font-semibold transition-all duration-150"
          style={{
            background: pkg.ctaColor
              ? `linear-gradient(135deg, ${pkg.ctaColor}cc, ${pkg.ctaColor}99)`
              : `linear-gradient(135deg, ${pkg.color}30, ${pkg.color}18)`,
            border: `1px solid ${pkg.ctaColor ?? pkg.color}50`,
            color: pkg.ctaColor ? '#fff' : pkg.color,
          }}
        >
          {pkg.cta}
        </button>
      )}

      {/* Exclusive handshake icon */}
      {pkg.exclusive && (
        <div className="flex justify-center mt-auto pt-1">
          <span className="text-xl" style={{ filter: `drop-shadow(0 0 6px ${pkg.color}60)` }}>ᚺ</span>
        </div>
      )}
    </motion.div>
  )
}

// ── Roles on back face ────────────────────────────────────────
function RoleRow({ name, pct, range, color, icon, index }) {
  const t = ROLE_THEME[color] ?? ROLE_THEME.blue
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="rounded-2xl px-5 py-4 flex flex-col items-center gap-3 text-center flex-shrink-0 w-[72vw] sm:w-auto snap-center"
      style={{ background: t.bg, border: `1px solid ${t.border}` }}
    >
      {/* Star badge */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${t.label}30, ${t.label}08)`,
          border: `2px solid ${t.label}50`,
          boxShadow: `0 0 20px ${t.label}25`,
        }}
      >
        {icon}
      </div>

      {/* Role name */}
      <p className="text-sm font-bold text-zinc-200">{name}</p>

      {/* Range */}
      <p className="text-lg font-bold font-mono" style={{ color: t.label }}>
        {range}
      </p>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: t.bar }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
        />
      </div>
    </motion.div>
  )
}

// ── Back face: roles ──────────────────────────────────────────
function RolesFace({ onFlipBack }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold"
            style={{
              background: 'linear-gradient(90deg,#38bdf8,#22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            bit.Trade
          </p>
          <p className="text-white font-bold text-lg mt-0.5">Ролі партнера</p>
        </div>

        {/* Back button */}
        <button
          onClick={onFlipBack}
          className="hidden sm:flex w-7 h-7 rounded-lg items-center justify-center transition-all duration-150"
          style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)' }}
          title="Повернутися до пакетів"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#38bdf8" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </button>
      </div>

      {/* Role cards: horizontal scroll on mobile, 3-col grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-3 gap-3 flex-1 overflow-x-auto pb-1 sm:overflow-visible sm:pb-0 snap-x snap-mandatory sm:snap-none" style={{ scrollbarWidth: 'none' }}>
        {TRADE_ROLES.map((role, i) => (
          <RoleRow key={role.name} {...role} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div
        className="rounded-xl px-3 py-2 flex items-center justify-between"
        style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.12)' }}
      >
        <span className="text-[9px] text-zinc-600 uppercase tracking-widest">bit.Trade · Діапазон доходу</span>
        <span className="text-xs font-bold font-mono" style={{ color: '#38bdf8' }}>
          {TRADE_ROLES.length} ролі
        </span>
      </div>

      {/* Mobile swipe hint */}
      <p className="text-center text-[9px] text-zinc-700 tracking-widest uppercase sm:hidden -mt-1">
        ← свайп → пакети
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
const PKGS_PER_PAGE = 3

export default function BitTrade() {
  const totalPages = Math.ceil(IB_PACKAGES.length / PKGS_PER_PAGE)
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const [flipped, setFlipped] = useState(false)

  const go = (delta) => {
    setDir(delta)
    setPage((p) => Math.min(Math.max(p + delta, 0), totalPages - 1))
  }

  const visible = IB_PACKAGES.slice(page * PKGS_PER_PAGE, page * PKGS_PER_PAGE + PKGS_PER_PAGE)

  const handlePanEnd = (_, info) => {
    const absX = Math.abs(info.offset.x)
    const absY = Math.abs(info.offset.y)
    if (absX > 70 && absX > absY * 1.5) {
      setFlipped((f) => !f)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onPanEnd={handlePanEnd}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d', position: 'relative' }}
      >
        {/* ── FRONT FACE: IB packages ── */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(56,189,248,0.12)',
            backdropFilter: 'blur(12px)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.2em] font-semibold"
                style={{
                  background: 'linear-gradient(90deg,#38bdf8,#22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                bit.Trade
              </p>
              <p className="text-white font-bold text-lg mt-0.5">IB-Пакети</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Roles flip button */}
              <button
                onClick={() => setFlipped(true)}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-150"
                style={{
                  background: 'rgba(56,189,248,0.08)',
                  border: '1px solid rgba(56,189,248,0.22)',
                  color: '#38bdf8',
                }}
                title="Дохід за ролями"
              >
                <span className="text-xs leading-none">ᛗ</span>
                <span className="text-[10px] font-semibold">Ролі</span>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDir(i > page ? 1 : -1); setPage(i) }}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: i === page ? 16 : 5,
                      height: 5,
                      background: i === page ? '#38bdf8' : 'rgba(255,255,255,0.12)',
                      boxShadow: i === page ? '0 0 6px rgba(56,189,248,0.5)' : 'none',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => go(-1)}
                disabled={page === 0}
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-20"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => go(1)}
                disabled={page === totalPages - 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-20"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Package cards */}
          <div className="relative overflow-hidden" style={{ minHeight: 240 }}>
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={page}
                custom={dir}
                variants={{
                  enter: (d) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit:  (d) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {visible.map((pkg, i) => (
                  <PackageCard key={pkg.name} pkg={pkg} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div
            className="rounded-xl px-3 py-2.5 flex items-center justify-between"
            style={{ background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.1)' }}
          >
            <span className="text-xs text-zinc-600 uppercase tracking-widest">
              bit.Trade · IB-Програми
            </span>
            <span className="text-sm font-bold font-mono" style={{ color: '#38bdf8' }}>
              {IB_PACKAGES.length} пакетів
            </span>
          </div>

          {/* Mobile swipe hint */}
          <p className="text-center text-[9px] text-zinc-700 tracking-widest uppercase sm:hidden -mt-2">
            ← свайп → ролі
          </p>
        </div>

        {/* ── BACK FACE: roles ── */}
        <div
          className="rounded-2xl p-5 absolute inset-0"
          style={{
            background: 'rgba(8,12,24,0.97)',
            border: '1px solid rgba(56,189,248,0.2)',
            backdropFilter: 'blur(16px)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <RolesFace onFlipBack={() => setFlipped(false)} />
        </div>
      </motion.div>
    </motion.div>
  )
}
