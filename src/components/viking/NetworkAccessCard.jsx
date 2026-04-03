import React, { useState, useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

// ── Status config ─────────────────────────────────────────────
const ST = {
  active: { label: 'Активный',           color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)'  },
  soon:   { label: 'Готовится к запуску', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)'  },
  dev:    { label: 'Разработка',          color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)'  },
}

// ── Categories with their projects and detail blocks ──────────
const CATS = [
  {
    id: 'business', label: 'Бизнес', icon: 'ᚠ',
    color: '#fbbf24', glow: 'rgba(251,191,36,0.25)',
    projects: [
      { name: 'BeautyNet',                      status: 'active', mission: 'Единая платформа для мастеров красоты',         economy: 'Подписки · комиссия 3%',         contract: 'BBN-48 · Активен'   },
      { name: 'Мастера бьюти',                   status: 'soon',   mission: 'Инструменты продвижения в бьюти-нише',         economy: 'Лицензии · реклама',             contract: 'BBN-51 · Готовится' },
      { name: 'Автоплатформа (базовый)',          status: 'dev',    mission: 'Цифровой рынок авто с токенизацией',           economy: 'Листинг · верификация',          contract: 'BBN-67 · Разработка'},
      { name: 'Империя Авто',                    status: 'dev',    mission: 'Полная экосистема авторынка',                  economy: 'Транзакции · токены',            contract: 'BBN-68 · Разработка'},
      { name: 'Аренда квартир',                  status: 'soon',   mission: 'P2P аренда с защитой прав',                   economy: 'Комиссия 2% · залог',            contract: 'BBN-72 · Готовится' },
      { name: 'Ресторан + баня',                 status: 'dev',    mission: 'Цифровизация HoReCa-бизнеса',                 economy: 'Бронирование · лояльность',      contract: 'BBN-81 · Разработка'},
      { name: 'Рассадник деревьев',              status: 'dev',    mission: 'Экотокенизация зелёного бизнеса',             economy: 'Продажи саженцев · токены',      contract: 'BBN-84 · Разработка'},
      { name: 'Шиномонтаж',                      status: 'dev',    mission: 'Сеть автосервисов в Bitbon',                  economy: 'Услуги · абонементы',            contract: 'BBN-85 · Разработка'},
    ],
  },
  {
    id: 'social', label: 'Социальные', icon: 'ᚱ',
    color: '#fb7185', glow: 'rgba(251,113,133,0.25)',
    projects: [
      { name: 'Отец и дочь',                     status: 'active', mission: 'Цифровое пространство семейных ценностей',     economy: 'Контент · NFT воспоминаний',     contract: 'BBN-23 · Активен'   },
      { name: 'Мама-блогер',                      status: 'soon',   mission: 'Монетизация материнства в Web4',              economy: 'Подписки · коллаборации',        contract: 'BBN-29 · Готовится' },
      { name: 'Лидер MLM (LiveGood)',             status: 'soon',   mission: 'Система дупликации через Bitbon',             economy: 'Реферальные · комиссии',         contract: 'BBN-33 · Готовится' },
      { name: '1000 агентов',                    status: 'dev',    mission: 'Массовая активация партнёрской сети',         economy: 'Агентские · бонусы',             contract: 'BBN-38 · Разработка'},
    ],
  },
  {
    id: 'infra', label: 'Инфраструктура', icon: 'ᛟ',
    color: '#38bdf8', glow: 'rgba(56,189,248,0.25)',
    projects: [
      { name: 'DAO района «Карьер»',             status: 'dev',    mission: 'Децентрализованное управление районом',        economy: 'Токены голосования · гранты',    contract: 'BBN-12 · Разработка'},
      { name: 'Спортивный комплекс',             status: 'dev',    mission: 'Токенизация спортивной инфраструктуры',       economy: 'Абонементы · события',           contract: 'BBN-15 · Разработка'},
      { name: 'Здание на пляже (инвест)',        status: 'soon',   mission: 'Инвест-токены курортной недвижимости',        economy: 'Фракционное владение · аренда',  contract: 'BBN-19 · Готовится' },
    ],
  },
  {
    id: 'finance', label: 'Финансы', icon: 'ᚢ',
    color: '#fb923c', glow: 'rgba(251,146,60,0.25)',
    projects: [
      { name: 'Экономика Кременчуга',            status: 'soon',   mission: 'Полная токенизация городской экономики',      economy: 'Муниципальные токены · налоги',  contract: 'BBN-91 · Готовится' },
      { name: 'Доходы владельцев Bitbon',        status: 'soon',   mission: 'Автоматизированное распределение доходов',    economy: 'Дивиденды · стейкинг',           contract: 'BBN-94 · Готовится' },
      { name: 'P2P платформа под залог',         status: 'dev',    mission: 'Кредитование под Bitbon-залог',               economy: 'Проценты · комиссия 1.5%',       contract: 'BBN-97 · Разработка'},
      { name: 'MLM + Web4 стратегия',            status: 'dev',    mission: 'Синергия сетевого маркетинга и Bitbon',       economy: 'Матрица · реферальные',          contract: 'BBN-99 · Разработка'},
    ],
  },
]

const ALL_TOTAL  = CATS.flatMap(c => c.projects).length
const ALL_ACTIVE = CATS.flatMap(c => c.projects).filter(p => p.status === 'active').length
const ALL_SOON   = CATS.flatMap(c => c.projects).filter(p => p.status === 'soon').length
const ALL_DEV    = CATS.flatMap(c => c.projects).filter(p => p.status === 'dev').length

// ── Project carousel card ─────────────────────────────────────
const CARD_W = 130

function ProjectCard({ proj, color, glow, active, onClick }) {
  const st = ST[proj.status]
  return (
    <div
      className="flex-shrink-0 rounded-xl px-3 py-3 cursor-pointer transition-all duration-200 flex flex-col gap-2"
      style={{
        width: CARD_W,
        background: active
          ? `linear-gradient(135deg, ${color}20, ${color}0d)`
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? color + '55' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: active ? `0 0 18px ${glow}` : 'none',
        transform: active ? 'scale(1.04)' : 'scale(1)',
      }}
      onClick={onClick}
    >
      <p className="text-[10px] font-bold text-zinc-200 leading-tight">{proj.name}</p>
      <span
        className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full self-start"
        style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}
      >
        {st.label}
      </span>
      {/* Color stripe at bottom */}
      <div className="h-0.5 rounded-full mt-auto" style={{ background: active ? color : color + '30' }} />
    </div>
  )
}

// ── Detail blocks for selected project ───────────────────────
function DetailBlocks({ proj, color, glow }) {
  if (!proj) return null
  const blocks = [
    { label: 'Миссия',               value: proj.mission   },
    { label: 'Экономическая модель', value: proj.economy   },
    { label: 'Смарт контракт',       value: proj.contract  },
  ]
  return (
    <motion.div
      key={proj.name}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-3 gap-2"
    >
      {blocks.map((b, i) => (
        <div
          key={b.label}
          className="rounded-xl p-2.5 flex flex-col gap-1"
          style={{
            background: `${color}0d`,
            border: `1px solid ${color}28`,
          }}
        >
          <p className="text-[8.5px] uppercase tracking-wider font-semibold" style={{ color: color + 'cc' }}>
            {b.label}
          </p>
          <p className="text-[9px] text-zinc-400 leading-snug">{b.value}</p>
        </div>
      ))}
    </motion.div>
  )
}

// ── Back face: meta explorer ──────────────────────────────────
function BackFace({ onFlip }) {
  const [catIdx, setCatIdx] = useState(0)
  const [projIdx, setProjIdx] = useState(0)
  const scrollRef = useRef(null)

  const cat = CATS[catIdx]
  const proj = cat.projects[projIdx] ?? cat.projects[0]

  // Reset project index when category changes
  useEffect(() => {
    setProjIdx(Math.floor(cat.projects.length / 2))
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
  }, [catIdx])

  const handleCatChange = (i) => {
    setCatIdx(i)
  }

  const handleProjClick = (i) => {
    setProjIdx(i)
    // Scroll that card into view
    if (scrollRef.current) {
      const offset = i * (CARD_W + 8) - (scrollRef.current.clientWidth / 2 - CARD_W / 2)
      scrollRef.current.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">WEB4 · Network</p>
          <p className="text-white font-bold text-base mt-0.5">Метаресурсы</p>
        </div>
        <button
          onClick={onFlip}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150"
          style={{
            background: 'rgba(96,165,250,0.1)',
            border: '1px solid rgba(96,165,250,0.25)',
            color: '#60a5fa',
          }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Назад
        </button>
      </div>

      {/* Category tabs — single horizontal row */}
      <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {CATS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => handleCatChange(i)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200"
            style={catIdx === i ? {
              background: `${c.color}20`,
              border: `1px solid ${c.color}50`,
              color: c.color,
              boxShadow: `0 0 12px ${c.glow}`,
            } : {
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#52525b',
            }}
          >
            <span className="text-base leading-none">{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Color divider line matching active category */}
      <motion.div
        className="h-px rounded-full"
        animate={{ background: `linear-gradient(90deg, ${cat.color}60, ${cat.color}10, transparent)` }}
        transition={{ duration: 0.3 }}
      />

      {/* Carousel of projects */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
      >
        {cat.projects.map((p, i) => (
          <div key={p.name} style={{ scrollSnapAlign: 'center' }}>
            <ProjectCard
              proj={p}
              color={cat.color}
              glow={cat.glow}
              active={i === projIdx}
              onClick={() => handleProjClick(i)}
            />
          </div>
        ))}
      </div>

      {/* Connection line from active card to detail blocks */}
      <div className="flex justify-center -my-1">
        <div className="w-px h-3" style={{ background: `linear-gradient(to bottom, ${cat.color}50, ${cat.color}20)` }} />
      </div>

      {/* Detail blocks for active project */}
      <DetailBlocks proj={cat.projects[projIdx]} color={cat.color} glow={cat.glow} />

      {/* Footer count */}
      <div className="flex items-center gap-1.5 -mt-1">
        <div className="h-px flex-1" style={{ background: `${cat.color}18` }} />
        <span className="text-[9px] font-mono" style={{ color: cat.color + '80' }}>
          {cat.projects.length} проектов в категории
        </span>
        <div className="h-px flex-1" style={{ background: `${cat.color}18` }} />
      </div>
    </div>
  )
}

// ── Front face ────────────────────────────────────────────────
function FrontFace({ onFlip }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">Access Tokens</p>
          <motion.p
            className="text-3xl font-bold font-mono mt-1"
            style={{ color: '#60a5fa', textShadow: '0 0 20px rgba(96,165,250,0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {ALL_TOTAL}
          </motion.p>
          <p className="text-xs text-zinc-500 mt-0.5">Метаресурсов в сети</p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}
        >
          ᛗ
        </div>
      </div>

      {/* Status stats */}
      <div className="flex gap-2">
        {[
          { label: 'Активный',          value: ALL_ACTIVE, color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.22)' },
          { label: 'Готовится',         value: ALL_SOON,   color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.22)' },
          { label: 'Разработка',        value: ALL_DEV,    color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.22)' },
        ].map(s => (
          <div
            key={s.label}
            className="flex-1 rounded-xl px-2 py-2 flex flex-col items-center gap-0.5"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}
          >
            <span className="text-base font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[8px] text-zinc-600 text-center leading-tight">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Flip button */}
      <button
        onClick={onFlip}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all duration-150"
        style={{
          background: 'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(56,189,248,0.08))',
          border: '1px solid rgba(96,165,250,0.3)',
          color: '#60a5fa',
        }}
      >
        <span className="text-base leading-none">ᛟ</span>
        Метаресурсы
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* Bottom pulse dot */}
      <motion.div
        className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full"
        style={{ background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }}
        animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function NetworkAccessCard({ delay = 0 }) {
  const [side, setSide] = useState('front')
  const controls = useAnimation()

  const flip = async (to) => {
    await controls.start({
      rotateY: 90,
      scale: 0.96,
      transition: { duration: 0.18, ease: 'easeIn' },
    })
    setSide(to)
    controls.set({ rotateY: -90 })
    await controls.start({
      rotateY: 0,
      scale: 1,
      transition: { duration: 0.22, ease: 'easeOut' },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl p-5 overflow-hidden"
      style={{
        background: 'rgba(59,130,246,0.06)',
        border: '1px solid rgba(59,130,246,0.3)',
        boxShadow: '0 0 30px rgba(59,130,246,0.3), inset 0 0 20px rgba(255,255,255,0.01)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)' }}
      />

      <motion.div animate={controls}>
        {side === 'front'
          ? <FrontFace onFlip={() => flip('back')} />
          : <BackFace onFlip={() => flip('front')} />
        }
      </motion.div>
    </motion.div>
  )
}
