import React, { useState, useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

// ── Token access cards (front face grid) ──────────────────────
const TOKEN_CARDS = [
  { name: 'Viking Core',  icon: 'ᚹ', color: '#a78bfa', dot: '#7c3aed', status: 'Active',  share: 34 },
  { name: 'BeautyNet',    icon: 'ᛖ', color: '#fb7185', dot: '#be123c', status: 'Active',  share: 18 },
  { name: 'Scanerbon',    icon: 'ᚲ', color: '#34d399', dot: '#047857', status: 'Active',  share: 22 },
  { name: 'AuraBond',     icon: 'ᚢ', color: '#818cf8', dot: '#4338ca', status: 'Active',  share: 11 },
  { name: 'DAO District', icon: 'ᛒ', color: '#3f3f46', dot: '#27272a', status: 'Locked',  share: 0  },
  { name: 'NetTrack',     icon: 'ᛗ', color: '#3f3f46', dot: '#27272a', status: 'Locked',  share: 0  },
]
const ACTIVE_COUNT = TOKEN_CARDS.filter(t => t.status === 'Active').length

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
      { name: 'BeautyNet',             status: 'active', mission: 'Единая платформа для мастеров красоты',       economy: 'Подписки · комиссия 3%',        contract: 'BBN-48 · Активен',
        desc: 'BeautyNet объединяет мастеров красоты в единую токенизированную экосистему. Каждый специалист получает цифровое портфолио, систему онлайн-записи и персональный токен репутации, обеспечивающий защиту сделок и автоматические выплаты через смарт-контракт BBN-48.' },
      { name: 'Мастера бьюти',         status: 'soon',   mission: 'Инструменты продвижения в бьюти-нише',       economy: 'Лицензии · реклама',            contract: 'BBN-51 · Готовится',
        desc: 'Маркетплейс инструментов продвижения для бьюти-мастеров: таргетированная реклама, SEO, автоворонки и аналитика. Монетизация через лицензии на доступ к инструментам, интегрированным с Bitbon-экосистемой.' },
      { name: 'Автоплатформа (базовый)', status: 'dev',  mission: 'Цифровой рынок авто с токенизацией',         economy: 'Листинг · верификация',         contract: 'BBN-67 · Разработка',
        desc: 'Базовая версия автомобильного маркетплейса с токенизацией истории транспортного средства. Каждое авто получает Bitbon-паспорт с подтверждёнными данными о пробеге, ДТП и сервисном обслуживании.' },
      { name: 'Империя Авто',          status: 'dev',    mission: 'Полная экосистема авторынка',                economy: 'Транзакции · токены',           contract: 'BBN-68 · Разработка',
        desc: 'Расширенная версия авторынка с дополнительными сервисами: страхование, автокредитование, сервисные центры и аукционы. Все операции проходят через единый токен-счёт в Bitbon-системе.' },
      { name: 'Аренда квартир',        status: 'soon',   mission: 'P2P аренда с защитой прав',                 economy: 'Комиссия 2% · залог',           contract: 'BBN-72 · Готовится',
        desc: 'P2P платформа аренды жилья с автоматическим депонированием залога в смарт-контракте. Арендатор и арендодатель защищены: залог разблокируется только при выполнении условий договора, фиксированных в блокчейне.' },
      { name: 'Ресторан + баня',       status: 'dev',    mission: 'Цифровизация HoReCa-бизнеса',               economy: 'Бронирование · лояльность',     contract: 'BBN-81 · Разработка',
        desc: 'Комплексная цифровизация заведений общественного питания и SPA: онлайн-бронирование, программы лояльности на базе Bitbon-токенов, аналитика продаж и автоматические выплаты персоналу через смарт-контракты.' },
      { name: 'Рассадник деревьев',    status: 'dev',    mission: 'Экотокенизация зелёного бизнеса',           economy: 'Продажи саженцев · токены',     contract: 'BBN-84 · Разработка',
        desc: 'Токенизация экологического бизнеса: каждый саженец получает цифровой сертификат роста. Покупатели могут отслеживать развитие дерева, торговать углеродными кредитами и получать токены за вклад в озеленение.' },
      { name: 'Шиномонтаж',           status: 'dev',    mission: 'Сеть автосервисов в Bitbon',                economy: 'Услуги · абонементы',           contract: 'BBN-85 · Разработка',
        desc: 'Сеть автосервисных точек, интегрированных в Bitbon-экосистему. Клиенты оплачивают услуги токенами, накапливают баллы лояльности и получают доступ к сезонным абонементам с автоматическим списанием через смарт-контракт.' },
    ],
  },
  {
    id: 'social', label: 'Социальные', icon: 'ᚱ',
    color: '#fb7185', glow: 'rgba(251,113,133,0.25)',
    projects: [
      { name: 'Отец и дочь',           status: 'active', mission: 'Цифровое пространство семейных ценностей',   economy: 'Контент · NFT воспоминаний',    contract: 'BBN-23 · Активен',
        desc: 'Проект создаёт приватное цифровое пространство для семейных историй и воспоминаний. Значимые моменты минтятся как NFT и хранятся в блокчейне, обеспечивая неизменность и передачу следующим поколениям.' },
      { name: 'Мама-блогер',           status: 'soon',   mission: 'Монетизация материнства в Web4',             economy: 'Подписки · коллаборации',       contract: 'BBN-29 · Готовится',
        desc: 'Платформа для монетизации материнского контента через Bitbon: платные подписки, брендовые коллаборации и продажа цифровых курсов. Автоматические роялти от использования контента фиксируются смарт-контрактом.' },
      { name: 'Лидер MLM (LiveGood)',  status: 'soon',   mission: 'Система дупликации через Bitbon',            economy: 'Реферальные · комиссии',        contract: 'BBN-33 · Готовится',
        desc: 'Инструментарий для лидеров MLM-сетей с автоматическим расчётом реферальных вознаграждений. Вся структура команды, бонусы и статусы фиксируются в блокчейне, исключая ручной учёт и ошибки начисления.' },
      { name: '1000 агентов',          status: 'dev',    mission: 'Массовая активация партнёрской сети',        economy: 'Агентские · бонусы',            contract: 'BBN-38 · Разработка',
        desc: 'Программа массового рекрутинга и обучения агентов Bitbon-экосистемы. Каждый агент получает персональный дашборд, обучающие материалы и автоматические выплаты за выполнение KPI через смарт-контракт BBN-38.' },
    ],
  },
  {
    id: 'infra', label: 'Инфраструктура', icon: 'ᛟ',
    color: '#38bdf8', glow: 'rgba(56,189,248,0.25)',
    projects: [
      { name: 'DAO района «Карьер»',   status: 'dev',    mission: 'Децентрализованное управление районом',      economy: 'Токены голосования · гранты',   contract: 'BBN-12 · Разработка',
        desc: 'DAO-структура для управления инфраструктурой жилого района. Жители голосуют токенами за распределение бюджета, ремонты и благоустройство. Решения исполняются автоматически через смарт-контракты без посредников.' },
      { name: 'Спортивный комплекс',   status: 'dev',    mission: 'Токенизация спортивной инфраструктуры',      economy: 'Абонементы · события',          contract: 'BBN-15 · Разработка',
        desc: 'Цифровизация спортивного комплекса: токенизированные абонементы, продажа билетов на события и программа лояльности для спортсменов. Смарт-контракт управляет расписанием и автоматически распределяет доходы.' },
      { name: 'Здание на пляже (инвест)', status: 'soon', mission: 'Инвест-токены курортной недвижимости',      economy: 'Фракционное владение · аренда', contract: 'BBN-19 · Готовится',
        desc: 'Фракционное инвестирование в курортную недвижимость: каждый инвестор владеет долей объекта в виде токена. Доходы от аренды автоматически распределяются пропорционально долям через смарт-контракт BBN-19.' },
    ],
  },
  {
    id: 'finance', label: 'Финансы', icon: 'ᚢ',
    color: '#fb923c', glow: 'rgba(251,146,60,0.25)',
    projects: [
      { name: 'Экономика Кременчуга',  status: 'soon',   mission: 'Полная токенизация городской экономики',     economy: 'Муниципальные токены · налоги', contract: 'BBN-91 · Готовится',
        desc: 'Пилотный проект токенизации городской экономики: муниципальные платежи, налоги и субсидии через Bitbon. Прозрачность бюджета обеспечивается блокчейном, граждане получают токены за участие в жизни города.' },
      { name: 'Доходы владельцев Bitbon', status: 'soon', mission: 'Автоматизированное распределение доходов', economy: 'Дивиденды · стейкинг',          contract: 'BBN-94 · Готовится',
        desc: 'Смарт-контракт автоматически распределяет доходы экосистемы Bitbon между держателями токенов пропорционально их доле. Стейкинг обеспечивает дополнительный пассивный доход без ручного управления.' },
      { name: 'P2P платформа под залог', status: 'dev',  mission: 'Кредитование под Bitbon-залог',             economy: 'Проценты · комиссия 1.5%',      contract: 'BBN-97 · Разработка',
        desc: 'Децентрализованная кредитная платформа: заёмщик блокирует Bitbon как залог, кредитор предоставляет фиат или стейблкоин. При невозврате залог автоматически ликвидируется смарт-контрактом без судебных разбирательств.' },
      { name: 'MLM + Web4 стратегия',  status: 'dev',    mission: 'Синергия сетевого маркетинга и Bitbon',      economy: 'Матрица · реферальные',         contract: 'BBN-99 · Разработка',
        desc: 'Стратегическая модель объединения классического MLM с возможностями Web4. Матричная структура вознаграждений, реферальные цепочки и бонусные пулы полностью автоматизированы через смарт-контракт Bitbon-системы.' },
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
const BLOCK_TYPES = [
  { key: 'mission',  label: 'Миссия',               icon: 'ᚠ' },
  { key: 'economy',  label: 'Экономическая модель',  icon: 'ᚢ' },
  { key: 'contract', label: 'Смарт контракт',        icon: 'ᚱ' },
]

function DetailBlocks({ proj, color, onBlockClick }) {
  if (!proj) return null
  const values = { mission: proj.mission, economy: proj.economy, contract: proj.contract }
  return (
    <motion.div
      key={proj.name}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-3 gap-2"
    >
      {BLOCK_TYPES.map((b) => (
        <button
          key={b.key}
          onClick={() => onBlockClick(b.key, proj)}
          className="rounded-xl p-2.5 flex flex-col gap-1 text-left transition-all duration-150 group"
          style={{
            background: `${color}0d`,
            border: `1px solid ${color}28`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `${color}1a`
            e.currentTarget.style.border = `1px solid ${color}55`
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = `${color}0d`
            e.currentTarget.style.border = `1px solid ${color}28`
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[8.5px] uppercase tracking-wider font-semibold" style={{ color: color + 'cc' }}>
              {b.label}
            </p>
            <svg className="w-2.5 h-2.5 opacity-40 group-hover:opacity-80 transition-opacity" style={{ color }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="text-[9px] text-zinc-400 leading-snug">{values[b.key]}</p>
        </button>
      ))}
    </motion.div>
  )
}

// ── Detail face: full text explanation ───────────────────────
const BLOCK_ICONS = { mission: '⚔', economy: 'ᚢ', contract: 'ᚱ' }
const BLOCK_LABELS = { mission: 'Миссия', economy: 'Экономическая модель', contract: 'Смарт контракт' }
const BLOCK_VALUES = (proj) => ({ mission: proj.mission, economy: proj.economy, contract: proj.contract })

function DetailFace({ proj, blockKey, color, glow, catLabel, catIcon, onBack, onSwitchBlock }) {
  if (!proj) return null
  const label  = BLOCK_LABELS[blockKey]
  const value  = BLOCK_VALUES(proj)[blockKey]
  const others = BLOCK_TYPES.filter(b => b.key !== blockKey)
  const st     = ST[proj.status]

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{catIcon}</span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">{catLabel}</p>
            <p className="text-white font-bold text-sm leading-tight">{proj.name}</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150"
          style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa' }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Назад
        </button>
      </div>

      {/* Status badge */}
      <span
        className="text-[9px] font-bold px-2.5 py-1 rounded-full self-start"
        style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}
      >
        {st.label}
      </span>

      {/* Active block — big card */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{
          background: `linear-gradient(135deg, ${color}18, ${color}08)`,
          border: `1px solid ${color}45`,
          boxShadow: `0 0 24px ${glow}`,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}
          >
            {BLOCK_ICONS[blockKey]}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{label}</p>
        </div>

        {/* Brief value */}
        <div className="h-px rounded-full" style={{ background: `${color}30` }} />
        <p className="text-sm font-semibold text-white leading-snug">{value}</p>

        {/* Full description */}
        <div className="h-px rounded-full" style={{ background: `${color}18` }} />
        <p className="text-[11px] text-zinc-400 leading-relaxed">{proj.desc}</p>
      </div>

      {/* Other 2 blocks — clickable to switch */}
      <div className="grid grid-cols-2 gap-2">
        {others.map(b => (
          <button
            key={b.key}
            onClick={() => onSwitchBlock(b.key)}
            className="rounded-xl p-3 flex flex-col gap-1 text-left transition-all duration-150 group"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${color}12`
              e.currentTarget.style.border = `1px solid ${color}35`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[8px] uppercase tracking-wider font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">{b.label}</p>
              <svg className="w-2.5 h-2.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
            <p className="text-[10px] text-zinc-500 group-hover:text-zinc-300 leading-snug transition-colors">{BLOCK_VALUES(proj)[b.key]}</p>
          </button>
        ))}
      </div>

      {/* Bottom glow line */}
      <div className="h-px rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
    </div>
  )
}

// ── Back face: meta explorer ──────────────────────────────────
const CARD_FULL = CARD_W + 8 // card width + gap

function BackFace({ onFlip, onDetailClick, catIdx, setCatIdx, projIdx, setProjIdx }) {
  const scrollRef  = useRef(null)
  const timerRef   = useRef(null)
  const skipWrap   = useRef(false)

  const cat      = CATS[catIdx]
  const N        = cat.projects.length
  const tripled  = [...cat.projects, ...cat.projects, ...cat.projects]

  // Scroll container so tripledIdx is centered
  const scrollTo = (tripledIdx, smooth = true) => {
    const el = scrollRef.current
    if (!el) return
    const offset = tripledIdx * CARD_FULL + CARD_W / 2 - el.clientWidth / 2
    el.scrollTo({ left: Math.max(0, offset), behavior: smooth ? 'smooth' : 'instant' })
  }

  // On category change: reset proj + reposition instantly
  useEffect(() => {
    const mid = Math.floor(N / 2)
    setProjIdx(mid)
    skipWrap.current = true
    requestAnimationFrame(() => {
      scrollTo(mid + N, false)
      skipWrap.current = false
    })
  }, [catIdx]) // eslint-disable-line

  // When projIdx changes externally (e.g. restore after detail): re-center
  useEffect(() => {
    scrollTo(projIdx + N, true)
  }, [projIdx]) // eslint-disable-line

  // After scroll settles, silently wrap if user drifted to clone section
  const handleScroll = () => {
    if (skipWrap.current) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const el = scrollRef.current
      if (!el) return
      const sectionW = N * CARD_FULL
      if (el.scrollLeft < sectionW * 0.4) {
        skipWrap.current = true
        el.scrollLeft += sectionW
        setTimeout(() => { skipWrap.current = false }, 50)
      } else if (el.scrollLeft > sectionW * 1.6) {
        skipWrap.current = true
        el.scrollLeft -= sectionW
        setTimeout(() => { skipWrap.current = false }, 50)
      }
    }, 120)
  }

  const handleTripledClick = (i) => {
    const realI = i % N
    setProjIdx(realI)
    scrollTo(realI + N, true)
  }

  const handleBlockClick = (blockKey) => {
    onDetailClick({ blockKey, proj: cat.projects[projIdx], color: cat.color, glow: cat.glow, catLabel: cat.label, catIcon: cat.icon })
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
          style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa' }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Назад
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {CATS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setCatIdx(i)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200"
            style={catIdx === i ? {
              background: `${c.color}20`, border: `1px solid ${c.color}50`,
              color: c.color, boxShadow: `0 0 12px ${c.glow}`,
            } : {
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#52525b',
            }}
          >
            <span className="text-base leading-none">{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Color divider */}
      <motion.div
        className="h-px rounded-full"
        animate={{ background: `linear-gradient(90deg, ${cat.color}60, ${cat.color}10, transparent)` }}
        transition={{ duration: 0.3 }}
      />

      {/* Infinite circular carousel */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none' }}
        onScroll={handleScroll}
      >
        {tripled.map((p, i) => (
          <ProjectCard
            key={`${i}`}
            proj={p}
            color={cat.color}
            glow={cat.glow}
            active={i % N === projIdx}
            onClick={() => handleTripledClick(i)}
          />
        ))}
      </div>

      {/* Connection line */}
      <div className="flex justify-center -my-1">
        <div className="w-px h-3" style={{ background: `linear-gradient(to bottom, ${cat.color}50, ${cat.color}20)` }} />
      </div>

      {/* Detail blocks */}
      <DetailBlocks proj={cat.projects[projIdx]} color={cat.color} onBlockClick={handleBlockClick} />

      {/* Footer count */}
      <div className="flex items-center gap-1.5 -mt-1">
        <div className="h-px flex-1" style={{ background: `${cat.color}18` }} />
        <span className="text-[9px] font-mono" style={{ color: cat.color + '80' }}>
          {N} проектов в категории
        </span>
        <div className="h-px flex-1" style={{ background: `${cat.color}18` }} />
      </div>
    </div>
  )
}

// ── Single token card ─────────────────────────────────────────
function TokenCard({ card, index }) {
  const locked = card.status === 'Locked'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-xl p-3 flex flex-col gap-2 relative"
      style={{
        background: locked
          ? 'rgba(255,255,255,0.02)'
          : `linear-gradient(135deg, ${card.color}12, ${card.color}06)`,
        border: `1px solid ${locked ? 'rgba(255,255,255,0.06)' : card.color + '35'}`,
        boxShadow: locked ? 'none' : `0 0 16px ${card.color}18`,
        opacity: locked ? 0.5 : 1,
      }}
    >
      {/* Top row: icon + dot/lock */}
      <div className="flex items-start justify-between">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{
            background: locked ? 'rgba(255,255,255,0.04)' : `${card.color}20`,
            border: `1px solid ${locked ? 'rgba(255,255,255,0.08)' : card.color + '40'}`,
            color: locked ? '#52525b' : card.color,
          }}
        >
          {card.icon}
        </div>
        {locked ? (
          <svg className="w-3.5 h-3.5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        ) : (
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: card.dot, boxShadow: `0 0 6px ${card.dot}` }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.3 }}
          />
        )}
      </div>

      {/* Name + status */}
      <div>
        <p className="text-xs font-bold text-zinc-200 leading-tight">{card.name}</p>
        <p className="text-[10px] mt-0.5 font-medium" style={{ color: locked ? '#52525b' : card.color }}>
          {card.status}
        </p>
      </div>

      {/* Project share bar */}
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] text-zinc-600">Доля проекта</span>
          <span className="text-[9px] font-mono font-bold" style={{ color: locked ? '#52525b' : card.color }}>
            {card.share}%
          </span>
        </div>
        <div className="h-0.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: locked ? '#3f3f46' : card.color }}
            initial={{ width: 0 }}
            animate={{ width: `${card.share}%` }}
            transition={{ duration: 1, delay: 0.3 + index * 0.08, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ── Front face ────────────────────────────────────────────────
function FrontFace({ onFlip }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">Access Tokens</p>
          <p className="text-white font-bold text-xl mt-0.5">Network Access</p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
          style={{
            background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.3)',
            color: '#34d399',
          }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          {ACTIVE_COUNT}/{TOKEN_CARDS.length} active
        </div>
      </div>

      {/* 2×3 token grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {TOKEN_CARDS.map((card, i) => (
          <TokenCard key={card.name} card={card} index={i} />
        ))}
      </div>

      {/* Bottom flip bar */}
      <button
        onClick={onFlip}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 group"
        style={{
          background: 'rgba(56,189,248,0.05)',
          border: '1px solid rgba(56,189,248,0.15)',
          color: '#38bdf8',
        }}
      >
        <span className="text-sm leading-none">ᚹ</span>
        Метаресурсы
        <svg
          className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function NetworkAccessCard({ delay = 0 }) {
  const [side, setSide]           = useState('front')
  const [detailInfo, setDetailInfo] = useState(null)
  // Lifted carousel state — preserved when returning from detail
  const [catIdx, setCatIdx]       = useState(0)
  const [projIdx, setProjIdx]     = useState(0)
  const controls = useAnimation()

  const flip = async (to) => {
    await controls.start({ rotateY: 90, scale: 0.96, transition: { duration: 0.18, ease: 'easeIn' } })
    setSide(to)
    controls.set({ rotateY: -90 })
    await controls.start({ rotateY: 0, scale: 1, transition: { duration: 0.22, ease: 'easeOut' } })
  }

  const handleDetailClick = async (info) => {
    setDetailInfo(info)
    await flip('detail')
  }

  const handleDetailBack = async () => {
    await flip('back')
  }

  // Switch block on detail face without going back (no flip, just update)
  const handleSwitchBlock = (newBlockKey) => {
    setDetailInfo(prev => prev ? { ...prev, blockKey: newBlockKey } : prev)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl p-5 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <motion.div animate={controls}>
        {side === 'front' && <FrontFace onFlip={() => flip('back')} />}
        {side === 'back' && (
          <BackFace
            onFlip={() => flip('front')}
            onDetailClick={handleDetailClick}
            catIdx={catIdx}
            setCatIdx={setCatIdx}
            projIdx={projIdx}
            setProjIdx={setProjIdx}
          />
        )}
        {side === 'detail' && detailInfo && (
          <DetailFace
            proj={detailInfo.proj}
            blockKey={detailInfo.blockKey}
            color={detailInfo.color}
            glow={detailInfo.glow}
            catLabel={detailInfo.catLabel}
            catIcon={detailInfo.catIcon}
            onBack={handleDetailBack}
            onSwitchBlock={handleSwitchBlock}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
