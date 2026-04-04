import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ROLE_THEME = {
  blue:    { bar: 'linear-gradient(90deg,#1d4ed8,#60a5fa)',   glow: 'rgba(59,130,246,0.35)',   label: '#60a5fa', bg: 'rgba(59,130,246,0.07)',   border: 'rgba(59,130,246,0.22)'   },
  purple:  { bar: 'linear-gradient(90deg,#7c3aed,#a78bfa)',   glow: 'rgba(139,92,246,0.35)',   label: '#a78bfa', bg: 'rgba(139,92,246,0.07)',   border: 'rgba(139,92,246,0.22)'   },
  gold:    { bar: 'linear-gradient(90deg,#b45309,#fbbf24)',   glow: 'rgba(245,158,11,0.35)',   label: '#fbbf24', bg: 'rgba(245,158,11,0.07)',   border: 'rgba(245,158,11,0.22)'   },
  emerald: { bar: 'linear-gradient(90deg,#047857,#34d399)',   glow: 'rgba(52,211,153,0.35)',   label: '#34d399', bg: 'rgba(52,211,153,0.07)',   border: 'rgba(52,211,153,0.22)'   },
  rose:    { bar: 'linear-gradient(90deg,#be123c,#fb7185)',   glow: 'rgba(251,113,133,0.35)',  label: '#fb7185', bg: 'rgba(251,113,133,0.07)',  border: 'rgba(251,113,133,0.22)'  },
  cyan:    { bar: 'linear-gradient(90deg,#0e7490,#22d3ee)',   glow: 'rgba(34,211,238,0.35)',   label: '#22d3ee', bg: 'rgba(34,211,238,0.07)',   border: 'rgba(34,211,238,0.22)'   },
  indigo:  { bar: 'linear-gradient(90deg,#3730a3,#818cf8)',   glow: 'rgba(129,140,248,0.35)',  label: '#818cf8', bg: 'rgba(129,140,248,0.07)',  border: 'rgba(129,140,248,0.22)'  },
  orange:  { bar: 'linear-gradient(90deg,#c2410c,#fb923c)',   glow: 'rgba(251,146,60,0.35)',   label: '#fb923c', bg: 'rgba(251,146,60,0.07)',   border: 'rgba(251,146,60,0.22)'   },
  teal:    { bar: 'linear-gradient(90deg,#0f766e,#2dd4bf)',   glow: 'rgba(45,212,191,0.35)',   label: '#2dd4bf', bg: 'rgba(45,212,191,0.07)',   border: 'rgba(45,212,191,0.22)'   },
}

// ── Status → Roles mapping (from Bitbon System docs) ──────────
const STATUS_ROLES = [
  {
    status: 'Оператор', icon: 'ᛟ', color: 'blue',
    roles: [
      { name: 'Перший оператор',    desc: 'Провадить діяльність із розвитку Соціальної мережі «Система Bitbon» і має в оперативному управлінні первісний актив для цифрового активу Bitbon.' },
      { name: 'Регіональний оператор', desc: 'Провадить діяльність з інтеграції Системи Bitbon із ринковою інфраструктурою конкретного регіону.' },
      { name: 'Акаунт-оператор',   desc: 'Провадить діяльність із верифікації облікових даних Користувачів Системи Bitbon незалежно від їх резидентства.' },
    ],
  },
  {
    status: 'Провайдер', icon: 'ᚹ', color: 'purple',
    roles: [
      { name: 'Реєстратор',   desc: 'Фіксує правочини в Системі Bitbon із метою посвідчення юридичного факту через досягнення консенсусу за алгоритмом Community PoS.' },
      { name: 'Партиціонер',  desc: 'Веде облік правочинів у Системі Bitbon через надання належних йому обчислювальних і телекомунікаційних ресурсів.' },
    ],
  },
  {
    status: "Контриб'ютор", icon: 'ᚱ', color: 'gold',
    roles: [
      { name: 'Контрактат',      desc: 'Є учасником комерційного проекту, зацікавленим у його реалізації та фінансуванні за допомогою інфраструктури Системи Bitbon.' },
      { name: 'Стейкхолдер',     desc: 'Є учасником комерційного проекту, який прийняв пропозицію від Контрактата, виділивши необхідні фінансові ресурси за допомогою інфраструктури Системи Bitbon.' },
      { name: 'Bitup-Агентство', desc: "Є обов'язковим учасником комерційного проекту й наділяє зобов'язаннями з підготовки та супроводу проекту Контрактата на користь Стейкхолдерів." },
    ],
  },
  {
    status: 'Інтегратор', icon: 'ᛖ', color: 'emerald',
    roles: [
      { name: 'Постачальник', desc: 'Просуває свої продукти та/або послуги в порядку, передбаченому в Системі Bitbon.' },
      { name: 'Розробник',    desc: 'Використовує інтерфейс програмування додатків для створення сервісів Користувачів Системи Bitbon.' },
      { name: 'Промоутер',    desc: 'Особисто та/або за допомогою належних йому публічних інформаційних ресурсів просуває базові сервіси Системи Bitbon для нових Користувачів.' },
    ],
  },
]

const ACADEMY_PROFESSIONS = [
  { name: 'Предприниматель',   icon: 'ᚠ', color: 'gold',    progress: 70, launching: false },
  { name: 'Разработчик',       icon: 'ᚲ', color: 'blue',    progress: 55, launching: false },
  { name: 'Дизайнер',          icon: 'ᛊ', color: 'purple',  progress: 48, launching: false },
  { name: 'Маркетолог',        icon: 'ᚹ', color: 'rose',    progress: 35, launching: false },
  { name: 'Аналитик данных',   icon: 'ᛃ', color: 'cyan',    progress: 0,  launching: true  },
  { name: 'Финансист',         icon: 'ᚢ', color: 'emerald', progress: 0,  launching: true  },
  { name: 'Проект. менеджер',  icon: 'ᛟ', color: 'indigo',  progress: 0,  launching: true  },
  { name: 'Консультант',       icon: 'ᚱ', color: 'teal',    progress: 0,  launching: true  },
  { name: 'Коуч',              icon: 'ᛖ', color: 'orange',  progress: 0,  launching: true  },
]

const ROWS_PER_PAGE = 3

// ── Front face: role income bars ──────────────────────────────
function RoleBar({ name, pct, income, color, icon, animKey }) {
  const t = ROLE_THEME[color] ?? ROLE_THEME.blue
  return (
    <motion.div
      key={animKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl px-4 py-3"
      style={{ background: t.bg, border: `1px solid ${t.border}` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{icon}</span>
          <span className="text-sm font-semibold text-zinc-300">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">{income}</span>
          <span
            className="text-sm font-bold font-mono"
            style={{ color: t.label, textShadow: `0 0 10px ${t.glow}` }}
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
          transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
        />
      </div>
    </motion.div>
  )
}

// ── Roles tab: status selector + roles list ───────────────────
function RolesTab() {
  const [statusIdx, setStatusIdx] = useState(0)
  const current = STATUS_ROLES[statusIdx]
  const t = ROLE_THEME[current.color] ?? ROLE_THEME.blue

  return (
    <div className="flex gap-2.5 h-full" style={{ minHeight: 0 }}>
      {/* Left: status buttons */}
      <div className="flex flex-col gap-1.5 flex-shrink-0" style={{ width: 96 }}>
        {STATUS_ROLES.map((s, i) => {
          const st = ROLE_THEME[s.color] ?? ROLE_THEME.blue
          const active = i === statusIdx
          return (
            <button
              key={s.status}
              onClick={() => setStatusIdx(i)}
              className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-left transition-all duration-200 w-full"
              style={active ? {
                background: `${st.label}18`,
                border: `1px solid ${st.label}45`,
                boxShadow: `0 0 10px ${st.label}20`,
              } : {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span className="text-sm leading-none flex-shrink-0" style={{ color: active ? st.label : '#52525b' }}>
                {s.icon}
              </span>
              <span className="text-[10px] font-semibold leading-tight" style={{ color: active ? st.label : '#52525b' }}>
                {s.status}
              </span>
            </button>
          )
        })}
      </div>

      {/* Vertical divider */}
      <div className="w-px self-stretch rounded-full" style={{ background: `${t.label}20` }} />

      {/* Right: roles for selected status */}
      <div className="flex-1 min-w-0 flex flex-col gap-2 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {/* Status label */}
        <p className="text-[9px] uppercase tracking-wider font-semibold leading-tight" style={{ color: t.label + 'aa' }}>
          Статус «{current.status}» · ролі
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.status}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-2"
          >
            {current.roles.map((role) => (
              <div key={role.name} className="flex flex-col gap-1">
                {/* Role name badge */}
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded self-start"
                  style={{ background: `${t.label}18`, border: `1px solid ${t.label}35`, color: t.label }}
                >
                  {role.name}
                </span>
                {/* Description */}
                <p className="text-[9.5px] text-zinc-500 leading-relaxed">
                  {role.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Professions tab item ───────────────────────────────────────
function AcademyItem({ name, icon, color, progress, launching, index }) {
  const t = ROLE_THEME[color] ?? ROLE_THEME.blue
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="rounded-xl px-3 py-2.5 flex items-center gap-3"
      style={{
        background: launching ? 'rgba(255,255,255,0.02)' : t.bg,
        border: `1px solid ${launching ? 'rgba(255,255,255,0.07)' : t.border}`,
        opacity: launching ? 0.6 : 1,
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-bold"
        style={{
          background: launching ? 'rgba(255,255,255,0.04)' : `${t.label}20`,
          border: `1px solid ${launching ? 'rgba(255,255,255,0.08)' : t.label + '40'}`,
          color: launching ? '#52525b' : t.label,
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold" style={{ color: launching ? '#52525b' : '#e4e4e7' }}>
            {name}
          </span>
          {launching ? (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}>
              готовится к запуску
            </span>
          ) : (
            <span className="text-[10px] font-mono flex-shrink-0" style={{ color: t.label }}>{progress}%</span>
          )}
        </div>
        {!launching && (
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: t.bar }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: [0.25, 1, 0.5, 1] }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Back face content ─────────────────────────────────────────
function AcademyFace({ onFlipBack }) {
  const [tab, setTab] = useState('roles')

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold"
            style={{
              background: 'linear-gradient(90deg, #a78bfa, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Академия
          </p>
          <p className="text-white font-bold text-lg mt-0.5">Платформенная Экономика</p>
        </div>
        <button
          onClick={onFlipBack}
          className="hidden sm:flex w-7 h-7 rounded-lg items-center justify-center transition-all duration-150"
          style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)' }}
          title="Вернуться к ролям"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#a78bfa" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </button>
      </div>

      {/* Tab switcher */}
      <div
        className="flex rounded-xl p-0.5 gap-0.5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {[{ key: 'roles', label: 'Роли' }, { key: 'professions', label: 'Профессии' }].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={tab === key ? {
              background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(96,165,250,0.15))',
              border: '1px solid rgba(167,139,250,0.3)',
              color: '#a78bfa',
              boxShadow: '0 0 10px rgba(167,139,250,0.2)',
            } : { background: 'transparent', border: '1px solid transparent', color: '#52525b' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">
          {tab === 'roles' ? (
            <motion.div key="roles"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}
              className="h-full"
            >
              <RolesTab />
            </motion.div>
          ) : (
            <motion.div key="professions"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}
              className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 232, scrollbarWidth: 'none' }}
            >
              {ACADEMY_PROFESSIONS.map((item, i) => (
                <AcademyItem key={item.name} {...item} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        className="rounded-xl px-3 py-2 flex items-center justify-between mt-auto"
        style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.12)' }}
      >
        <span className="text-[9px] text-zinc-600 uppercase tracking-widest">
          Академия Платформенной Экономики
        </span>
        <span className="text-xs font-bold font-mono" style={{ color: '#a78bfa' }}>
          {STATUS_ROLES.length} статуси · {STATUS_ROLES.reduce((a, s) => a + s.roles.length, 0)} ролі
        </span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function RoleDistribution({ roles }) {
  const totalPages = Math.ceil(roles.length / ROWS_PER_PAGE)
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const [flipped, setFlipped] = useState(false)

  const go = (delta) => {
    setDir(delta)
    setPage((p) => Math.min(Math.max(p + delta, 0), totalPages - 1))
  }

  const visible = roles.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
  const activeCount = roles.filter((r) => r.active !== false).length

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
      transition={{ duration: 0.5, delay: 0.3 }}
      // Perspective container for 3D flip
      style={{ perspective: 1200 }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onPanEnd={handlePanEnd}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Header + nav */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                Income by Role
              </p>
              <p className="text-white font-bold text-lg mt-0.5">Role Distribution</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Flip button (web only) */}
              <button
                onClick={() => setFlipped(true)}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-150"
                style={{
                  background: 'rgba(167,139,250,0.08)',
                  border: '1px solid rgba(167,139,250,0.2)',
                  color: '#a78bfa',
                }}
                title="Академия платформенной экономики"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
                <span className="text-[10px] font-semibold">Академия</span>
              </button>

              {/* Carousel dots */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDir(i > page ? 1 : -1); setPage(i) }}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: i === page ? 16 : 5,
                      height: 5,
                      background: i === page ? '#a78bfa' : 'rgba(255,255,255,0.12)',
                      boxShadow: i === page ? '0 0 6px rgba(167,139,250,0.6)' : 'none',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => go(-1)}
                disabled={page === 0}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => go(1)}
                disabled={page === totalPages - 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Role bars */}
          <div className="relative overflow-hidden" style={{ minHeight: 168 }}>
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={page}
                custom={dir}
                variants={{
                  enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit:  (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col gap-3"
              >
                {visible.map((role) => (
                  <RoleBar key={role.name} {...role} animKey={`${page}-${role.name}`} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div
            className="rounded-xl px-3 py-2.5 flex items-center justify-between"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              Академия платформенной экономики
            </span>
            <span className="text-sm font-bold font-mono text-zinc-300">
              {activeCount} / {roles.length} ролей
            </span>
          </div>

          {/* Mobile swipe hint */}
          <p className="text-center text-[9px] text-zinc-700 tracking-widest uppercase sm:hidden -mt-2">
            ← свайп → академия
          </p>
        </div>

        {/* ── BACK FACE ── */}
        <div
          className="rounded-2xl p-5 absolute inset-0"
          style={{
            background: 'rgba(10,8,24,0.97)',
            border: '1px solid rgba(167,139,250,0.18)',
            backdropFilter: 'blur(16px)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <AcademyFace onFlipBack={() => setFlipped(false)} />

          {/* Mobile swipe hint */}
          <p className="text-center text-[9px] text-zinc-700 tracking-widest uppercase sm:hidden mt-2">
            ← свайп → роли
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
