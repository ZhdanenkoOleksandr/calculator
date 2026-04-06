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
  {
    status: 'Валідатор', icon: 'ᚢ', color: 'cyan',
    roles: [
      { name: 'Хранитель', desc: 'Надає послуги відповідального зберігання первісного активу з метою забезпечення дотримання протоколу токенізованого активу його сторонами.' },
      { name: 'Страховик', desc: 'Надає послуги зі страхування первісного активу з метою забезпечення дотримання протоколу токенізованого активу його сторонами.' },
      { name: 'Гарант',    desc: 'Надає послуги поручителя з метою забезпечення дотримання протоколу токенізованого активу його сторонами.' },
    ],
  },
  {
    status: 'Спеціаліст', icon: 'ᛊ', color: 'teal',
    roles: [
      { name: 'Експерт', desc: 'Проводить експертне оцінювання верифікованих облікових даних та метаактивів інших Користувачів із застосуванням знака Експерта.' },
      { name: 'Майстер', desc: 'Створює метаактив на замовлення іншого Користувача. Метаактивам, створеним Майстром, присвоюється знак Майстра.' },
    ],
  },
]

const ACADEMY_PROFESSIONS = [
  {
    name: 'Архитектор цифровых экосистем',
    icon: 'ᛟ',
    desc: 'Создает и управляет цифровыми платформами, объединяющими различные сервисы, технологии и пользователей.',
  },
  {
    name: 'Консультант в области цифровых финансов',
    icon: 'ᚠ',
    desc: 'Помогает компаниям и частным лицам адаптироваться к новым финансовым инструментам.',
  },
  {
    name: 'Эксперт по суверенной цифровой идентичности',
    icon: 'ᚢ',
    desc: 'Разрабатывает и внедряет технологии, позволяющие людям контролировать свою цифровую безопасность.',
  },
  {
    name: 'Оператор цифровых экосистем',
    icon: 'ᚦ',
    desc: 'Обеспечивает бесперебойную работу платформ, интегрируя новые технологии и отслеживая их эффективность.',
  },
  {
    name: 'Эксперт по токенизации активов',
    icon: 'ᚹ',
    desc: 'Консультирует по переводу реальных активов (недвижимости, товаров, интеллектуальной собственности) в цифровую форму с использованием технологии блокчейн.',
  },
  {
    name: 'Разработчик метаресурсов',
    icon: 'ᚷ',
    desc: 'Создает уникальные метаактивы и инфраструктурные компоненты для Системы Bitbon.',
  },
  {
    name: 'Эксперт по цифровому праву и метаактивам',
    icon: 'ᛖ',
    desc: 'Специализируется на правовом регулировании общественных отношений пользователей в децентрализованных информационных платформах.',
  },
  {
    name: 'Промт-инженер в сфере искусственного интеллекта',
    icon: 'ᛊ',
    desc: 'Разрабатывает стратегии взаимодействия с искусственным интеллектом, создавая и оптимизируя текстовые, голосовые и визуальные запросы. Настраивает модели для решений специализированных бизнес-задач, создает персонализированные интерфейсы.',
  },
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
    <div className="flex gap-2" style={{ minHeight: 200 }}>
      {/* Left: status buttons — 1 part */}
      <div className="flex flex-col gap-1 overflow-y-auto" style={{ flex: 1, scrollbarWidth: 'none' }}>
        {STATUS_ROLES.map((s, i) => {
          const st = ROLE_THEME[s.color] ?? ROLE_THEME.blue
          const active = i === statusIdx
          return (
            <button
              key={s.status}
              onClick={() => setStatusIdx(i)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition-all duration-200 w-full"
              style={active ? {
                background: `${st.label}18`,
                border: `1px solid ${st.label}45`,
                boxShadow: `0 0 8px ${st.label}20`,
              } : {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span className="text-[13px] leading-none flex-shrink-0" style={{ color: active ? st.label : '#52525b' }}>
                {s.icon}
              </span>
              <span className="text-[13px] font-semibold leading-tight" style={{ color: active ? st.label : '#52525b' }}>
                {s.status}
              </span>
            </button>
          )
        })}
      </div>

      {/* Vertical divider */}
      <div className="w-px self-stretch rounded-full" style={{ background: `${t.label}20` }} />

      {/* Right: roles for selected status — 3 parts */}
      <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ flex: 3, scrollbarWidth: 'none' }}>
        {/* Status label */}
        <p className="text-[13px] uppercase tracking-wider font-semibold leading-tight" style={{ color: t.label + 'aa' }}>
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
              <div key={role.name} className="flex flex-col gap-0.5">
                <span
                  className="text-[13px] font-bold px-2 py-0.5 rounded self-start"
                  style={{ background: `${t.label}18`, border: `1px solid ${t.label}35`, color: t.label }}
                >
                  {role.name}
                </span>
                <p className="text-[13px] text-zinc-500 leading-relaxed">
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

// ── Professions tab: selector + description ───────────────────
function ProfessionsTab() {
  const [idx, setIdx] = useState(0)
  const current = ACADEMY_PROFESSIONS[idx]

  return (
    <div className="flex gap-2" style={{ minHeight: 200 }}>
      {/* Left: profession buttons — 1 part */}
      <div className="flex flex-col gap-1 overflow-y-auto" style={{ flex: 1, scrollbarWidth: 'none' }}>
        {ACADEMY_PROFESSIONS.map((p, i) => {
          const active = i === idx
          return (
            <button
              key={p.name}
              onClick={() => setIdx(i)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition-all duration-200 w-full"
              style={active ? {
                background: 'rgba(167,139,250,0.12)',
                border: '1px solid rgba(167,139,250,0.35)',
                boxShadow: '0 0 6px rgba(167,139,250,0.15)',
              } : {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span className="text-[13px] leading-none flex-shrink-0" style={{ color: active ? '#a78bfa' : '#52525b' }}>
                {p.icon}
              </span>
              <span className="text-[13px] font-semibold leading-tight" style={{ color: active ? '#a78bfa' : '#52525b' }}>
                {p.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Vertical divider */}
      <div className="w-px self-stretch rounded-full" style={{ background: 'rgba(167,139,250,0.15)' }} />

      {/* Right: description for selected profession — 3 parts */}
      <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ flex: 3, scrollbarWidth: 'none' }}>
        <p className="text-[13px] uppercase tracking-wider font-semibold leading-tight" style={{ color: 'rgba(167,139,250,0.7)' }}>
          Профессия Web4
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-1.5"
          >
            <span
              className="text-[13px] font-bold px-2 py-0.5 rounded self-start"
              style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)', color: '#c4b5fd' }}
            >
              {current.name}
            </span>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              {current.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Professions tab item (legacy, unused) ──────────────────────
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

const CERT_TYPES = [
  {
    icon: '🔍',
    name: 'Исследователь информационной экономики',
    level: 'Базовый',
    color: '#60a5fa',
    desc: 'Базовый сертификат для освоения концепций цифровой и платформенной экономики. Онлайн-курс по книге «Информационная экономика за 90 секунд» в формате самоподготовки.',
  },
  {
    icon: '🧭',
    name: 'Навигатор информационной экономики',
    level: 'Продвинутый',
    color: '#a78bfa',
    desc: 'Углубленный сертификат, охватывающий 10 базовых курсов: блокчейн, искусственный интеллект, бизнес-модели платформ. Включает интерактивные задания и групповые проекты.',
  },
  {
    icon: '💎',
    name: 'Мастер цифровых решений',
    level: 'Специализация',
    color: '#34d399',
    desc: 'Специализированные сертификаты для профессионалов в конкретных отраслях — юриспруденции, маркетинге, бухучете, кибербезопасности.',
  },
  {
    icon: '🏛',
    name: 'Архитектор цифровых трансформаций',
    level: 'Флагманский',
    color: '#fbbf24',
    desc: 'Флагманская программа для будущих лидеров цифровых трансформаций. Сочетает онлайн-курсы, офлайн-воркшопы и работу над реальными проектами.',
  },
]

const CERT_POINTS = [
  { icon: '🎓', bold: 'Подтверждение Вашего статуса и компетенций', text: ' — сертификат удостоверяет Ваши знания и профессиональные навыки, полученные в Академии.' },
  { icon: '🔑', bold: 'Доступ к сервисам и инструментам', text: ' — дает Вам право работать с ключевыми цифровыми сервисами.' },
  { icon: '🌐', bold: 'Участие в развитии цифровой экосистемы', text: ' — Вы являетесь частью глобального Сообщества, которое создает цифровое будущее.' },
  { icon: '🤝', bold: 'Прозрачность и доверие', text: ' — сертификат подтверждает Ваши роль и статус, укрепляя доверие при взаимодействии с другими Пользователями.' },
  { icon: '⭐', bold: 'Рост репутации', text: ' — сертификаты влияют на расчет Вашей репутации в Сообществе Системы Bitbon посредством сервиса АУРА (Агрегированный Уровень Репутации Аккаунта).' },
]

// ── Back face content ─────────────────────────────────────────
export function AcademyFace({ onFlipBack, defaultTab = 'roles' }) {
  const [tab, setTab] = useState(defaultTab)

  return (
    <div className="flex flex-col gap-4">
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
          <p className="text-white font-bold text-xl mt-0.5">Платформенная Экономика</p>
        </div>
        {onFlipBack && (
          <button
            onClick={onFlipBack}
            className="flex w-8 h-8 rounded-lg items-center justify-center transition-all duration-150"
            style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)' }}
            title="Закрыть"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#a78bfa" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Platform Economy info (shared) ── */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(34,211,238,0.05))',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.2))', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            ⚔
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-bold text-white leading-snug">
              Что такое Платформенная Экономика?
            </p>
            <p className="text-[13px] text-zinc-400 leading-relaxed">
              Академия Платформенной Экономики — образовательная программа Системы Bitbon. Вы получаете знания, статус и инструменты для участия в децентрализованной цифровой экосистеме Web4.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {['Web4', 'Bitbon System', 'DeFi', 'Metaresources', 'Smart Contracts'].map(tag => (
                <span key={tag} className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
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
            className="flex-1 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200"
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

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === 'roles' ? (
          <motion.div key="roles"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}
          >
            <RolesTab />
          </motion.div>
        ) : (
          <motion.div key="professions"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}
          >
            <ProfessionsTab />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Certificate section (shared) ── */}
      <div className="flex flex-col gap-3">
        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.3))' }} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1 rounded-full"
            style={{ color: '#a78bfa', background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.2)' }}>
            Сертификат
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(167,139,250,0.3), transparent)' }} />
        </div>

        {/* Certificate card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(96,165,250,0.25)' }}
        >
          {/* Visual certificate banner */}
          <div
            className="relative flex items-center justify-center py-8 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0c1e3e 0%, #0a2a5e 40%, #0d3580 60%, #1a4ba0 100%)',
              minHeight: 140,
            }}
          >
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cert-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#60a5fa" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cert-grid)" />
            </svg>
            {/* Glow circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
            </div>
            {/* Certificate visual element */}
            <div className="relative flex flex-col items-center gap-3 z-10">
              {/* Main seal */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(147,197,253,0.2))',
                  border: '2px solid rgba(147,197,253,0.6)',
                  boxShadow: '0 0 30px rgba(96,165,250,0.5), inset 0 0 20px rgba(96,165,250,0.1)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="text-4xl">🏛</span>
              </div>
              {/* Certificate text */}
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-[0.3em] font-semibold" style={{ color: 'rgba(147,197,253,0.7)' }}>
                  Bitbon System Academy
                </p>
                <p className="text-lg font-bold mt-0.5" style={{ color: '#bfdbfe', letterSpacing: '0.05em' }}>
                  CERTIFICATE
                </p>
              </div>
              {/* Shield badges */}
              <div className="flex gap-3">
                {['🛡', '🪙', '🛡'].map((ic, i) => (
                  <div key={i}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                    style={{
                      background: 'rgba(96,165,250,0.15)',
                      border: '1px solid rgba(96,165,250,0.35)',
                      boxShadow: '0 0 8px rgba(96,165,250,0.3)',
                    }}
                  >
                    {ic}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certificate text content */}
          <div className="p-4 flex flex-col gap-3" style={{ background: 'rgba(8,8,20,0.9)' }}>
            <div>
              <h3 className="text-base font-bold text-white leading-snug">
                Признание и подтверждение Ваших знаний
              </h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed mt-2">
                По результатам прохождения образовательных программ Академии Вы получаете мультифункциональный сертификат, который открывает доступ к широкому спектру функциональных возможностей экосистемы цифровых сервисов «Система <span className="font-bold text-zinc-300">Bitbon</span>».
              </p>
              <p className="text-[13px] text-zinc-500 mt-2">
                Почему этот сертификат важен?
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {CERT_POINTS.map((pt, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-sm flex-shrink-0 mt-0.5">{pt.icon}</span>
                  <p className="text-[13px] text-zinc-400 leading-relaxed">
                    <span className="font-bold text-zinc-200">{pt.bold}</span>{pt.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4 Certificate types — single row ── */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-600 mb-2">
            В зависимости от результатов обучения выдаётся 4 вида сертификатов:
          </p>
          <div className="flex gap-2">
            {CERT_TYPES.map((ct) => (
              <div
                key={ct.name}
                className="flex-1 rounded-xl p-3 flex flex-col gap-1.5"
                style={{
                  background: `${ct.color}0a`,
                  border: `1px solid ${ct.color}25`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base leading-none">{ct.icon}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: `${ct.color}18`, color: ct.color, border: `1px solid ${ct.color}30` }}
                  >
                    {ct.level}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-white leading-snug">
                  {ct.name}
                </p>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  {ct.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="rounded-xl px-3 py-2 flex items-center justify-between"
        style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.12)' }}
      >
        <span className="text-[9px] text-zinc-600 uppercase tracking-widest">
          Академия Платформенной Экономики
        </span>
        <span className="text-xs font-bold font-mono" style={{ color: '#a78bfa' }}>
          {tab === 'roles'
            ? `${STATUS_ROLES.length} статуси · ${STATUS_ROLES.reduce((a, s) => a + s.roles.length, 0)} ролі`
            : `${ACADEMY_PROFESSIONS.length} профессий Web4`}
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
