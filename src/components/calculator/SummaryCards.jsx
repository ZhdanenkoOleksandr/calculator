import React from 'react'
import { motion } from 'framer-motion'

function fmt(n, decimals = 2) {
  if (n === undefined || n === null || isNaN(n)) return '—'
  return n.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

const CARDS = [
  {
    key: 'units',
    label: 'Куплено Bitbon',
    suffix: 'BBN',
    decimals: 4,
    color: 'indigo',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    key: 'totalPaid',
    label: 'Выплачено всего',
    suffix: 'USD',
    decimals: 2,
    color: 'emerald',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'remaining',
    label: 'Остаток Bitbon',
    suffix: 'BBN',
    decimals: 4,
    color: 'amber',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    key: 'roi',
    label: 'ROI',
    suffix: '%',
    decimals: 1,
    color: 'violet',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
]

const COLOR_MAP = {
  indigo: {
    icon: 'bg-indigo-500/15 text-indigo-400',
    value: 'text-indigo-300',
  },
  emerald: {
    icon: 'bg-emerald-500/15 text-emerald-400',
    value: 'text-emerald-300',
  },
  amber: {
    icon: 'bg-amber-500/15 text-amber-400',
    value: 'text-amber-300',
  },
  violet: {
    icon: 'bg-violet-500/15 text-violet-400',
    value: 'text-violet-300',
  },
}

export default function SummaryCards({ data }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card, i) => {
        const colors = COLOR_MAP[card.color]
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {card.label}
              </p>
              <div className={`p-1.5 rounded-lg ${colors.icon}`}>{card.icon}</div>
            </div>

            <div>
              <p className={`text-xl md:text-2xl font-bold font-mono ${colors.value}`}>
                {fmt(data[card.key], card.decimals)}
              </p>
              <p className="text-xs text-zinc-600 font-mono mt-0.5">{card.suffix}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
