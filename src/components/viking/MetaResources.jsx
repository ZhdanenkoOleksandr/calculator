import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS = {
  active:   { label: 'Активный',            color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.28)',  dot: '#34d399' },
  soon:     { label: 'Готовится к запуску',  color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.28)',  dot: '#fbbf24' },
  dev:      { label: 'Разработка',           color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.28)',  dot: '#60a5fa' },
}

const CATEGORIES = [
  {
    id: 'personal',
    icon: 'ᚹ',
    label: 'Ключевые проекты',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.07)',
    border: 'rgba(167,139,250,0.2)',
    projects: [
      { name: 'Scanerbon',                                  status: 'active' },
      { name: 'Мой Метаресурс',                             status: 'active' },
      { name: 'Digital Viking Wallet',                      status: 'active' },
      { name: 'Defender',                                   status: 'dev'    },
      { name: 'Токенизированная история Александра Жданенко', status: 'soon' },
      { name: 'Франк ищет Человека',                        status: 'dev'    },
      { name: 'Briz Deluxe',                                status: 'soon'   },
      { name: 'Просвітнецька республіка',                   status: 'dev'    },
    ],
  },
  {
    id: 'business',
    icon: 'ᚠ',
    label: 'Бизнес и коммерция',
    color: '#fbbf24',
    bg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.2)',
    projects: [
      { name: 'BeautyNet',                                  status: 'active' },
      { name: 'Метаресурс для мастеров бьюти-индустрии',    status: 'soon'   },
      { name: 'Платформа для автоплощадок (базовый)',        status: 'dev'    },
      { name: 'Империя Авто (метаресурс автоплощадки)',      status: 'dev'    },
      { name: 'Метаресурс аренды квартир',                  status: 'soon'   },
      { name: 'Ресторан + баня (метаресурс)',               status: 'dev'    },
      { name: 'Рассадник деревьев (метаресурс)',            status: 'dev'    },
      { name: 'Шиномонтаж (метаресурс)',                    status: 'dev'    },
    ],
  },
  {
    id: 'infra',
    icon: 'ᛟ',
    label: 'Инфраструктура и город',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.07)',
    border: 'rgba(56,189,248,0.2)',
    projects: [
      { name: 'DAO района «Карьер»',                        status: 'dev'    },
      { name: 'Спортивный комплекс (теннис / футбол / волейбол / баскетбол)', status: 'dev' },
      { name: 'Недостроенное здание на пляже (инвест)',     status: 'soon'   },
    ],
  },
  {
    id: 'social',
    icon: 'ᚱ',
    label: 'Социальные и личные',
    color: '#fb7185',
    bg: 'rgba(251,113,133,0.07)',
    border: 'rgba(251,113,133,0.2)',
    projects: [
      { name: 'Метаресурс отношений отца и дочери',         status: 'active' },
      { name: 'Метаресурс мамы-блогера',                    status: 'soon'   },
      { name: 'Метаресурс лидера MLM (LiveGood)',            status: 'soon'   },
      { name: 'Система привлечения 1000 агентов',           status: 'dev'    },
    ],
  },
  {
    id: 'edu',
    icon: 'ᛒ',
    label: 'Образовательные',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.07)',
    border: 'rgba(52,211,153,0.2)',
    projects: [
      { name: 'Программа позиционирования Bitbon',          status: 'active' },
      { name: 'Освітницький проект (адаптація під Bitbon)', status: 'dev'    },
      { name: 'Архитектура цифрового сообщества',           status: 'dev'    },
    ],
  },
  {
    id: 'finance',
    icon: 'ᚢ',
    label: 'Финансовые и экономические',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.07)',
    border: 'rgba(251,146,60,0.2)',
    projects: [
      { name: 'Экономическая модель города Кременчуг в Bitbon', status: 'soon' },
      { name: 'Модель доходов для владельцев Bitbon',        status: 'soon'   },
      { name: 'P2P платформа под залог',                    status: 'dev'    },
      { name: 'MLM + Web4 стратегия',                       status: 'dev'    },
    ],
  },
]

// Flatten all projects for global stats
const ALL_PROJECTS = CATEGORIES.flatMap(c => c.projects)
const GLOBAL_STATS = {
  active: ALL_PROJECTS.filter(p => p.status === 'active').length,
  soon:   ALL_PROJECTS.filter(p => p.status === 'soon').length,
  dev:    ALL_PROJECTS.filter(p => p.status === 'dev').length,
}

function StatusBadge({ status }) {
  const s = STATUS[status]
  return (
    <span
      className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
    >
      {s.label}
    </span>
  )
}

function CategoryCard({ cat, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const activeCount = cat.projects.filter(p => p.status === 'active').length
  const soonCount   = cat.projects.filter(p => p.status === 'soon').length
  const devCount    = cat.projects.filter(p => p.status === 'dev').length

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${cat.border}`, background: cat.bg }}
    >
      {/* Category header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 transition-all duration-150"
        onClick={() => setOpen(o => !o)}
        style={{ background: open ? `${cat.color}08` : 'transparent' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0"
            style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30`, color: cat.color }}
          >
            {cat.icon}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-zinc-200">{cat.label}</p>
            <p className="text-[9px] text-zinc-600">{cat.projects.length} проекта</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mini status pills */}
          <div className="flex gap-1.5">
            {activeCount > 0 && (
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                {activeCount}✓
              </span>
            )}
            {soonCount > 0 && (
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                {soonCount}◑
              </span>
            )}
            {devCount > 0 && (
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
                {devCount}⚙
              </span>
            )}
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </button>

      {/* Projects list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 flex flex-col gap-1.5">
              {/* Separator */}
              <div className="h-px mb-1" style={{ background: `${cat.color}18` }} />

              {cat.projects.map((proj, i) => (
                <motion.div
                  key={proj.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, delay: i * 0.03 }}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Status dot */}
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: STATUS[proj.status].dot, boxShadow: `0 0 4px ${STATUS[proj.status].dot}` }}
                    />
                    <span className="text-xs text-zinc-300 truncate">{proj.name}</span>
                  </div>
                  <StatusBadge status={proj.status} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MetaResources() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
            WEB4 · Метаресурсы
          </p>
          <p className="text-white font-bold text-lg mt-0.5">Твои ключевые проекты</p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          ᛟ
        </div>
      </div>

      {/* Global status summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Активных',          value: GLOBAL_STATS.active, color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)'  },
          { label: 'Готовятся к запуску', value: GLOBAL_STATS.soon, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)'  },
          { label: 'В разработке',      value: GLOBAL_STATS.dev,   color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)'  },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl px-2 py-2.5 flex flex-col items-center gap-1"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}
          >
            <span className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[8px] text-zinc-600 text-center leading-tight">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center gap-2 -mt-1">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <span className="text-[10px] text-zinc-600 font-mono">{ALL_PROJECTS.length} проектов</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>

      {/* Category accordion */}
      <div className="flex flex-col gap-2">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} cat={cat} defaultOpen={i === 0} />
        ))}
      </div>
    </motion.div>
  )
}
