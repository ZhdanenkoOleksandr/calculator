import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const PERIODS = [
  { key: 'day',     label: 'День',    rows: 30, prefix: 'День' },
  { key: 'month',   label: 'Месяц',   rows: 12, prefix: 'Мес.' },
  { key: 'quarter', label: 'Квартал', rows: 8,  prefix: 'Кв.'  },
  { key: 'year',    label: 'Год',     rows: 5,  prefix: 'Год'  },
]

function fmt(n, d = 2) {
  return n.toLocaleString('ru-RU', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const earned = payload[0]?.payload?.earned ?? 0
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 shadow-xl text-xs font-mono">
      <p className="text-zinc-300 font-semibold mb-1.5">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-zinc-500">Накоплено</span>
          <span className="text-indigo-300 font-bold">${fmt(payload[0].value)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-500">Заработано</span>
          <span className="text-emerald-400">+${fmt(earned)}</span>
        </div>
      </div>
    </div>
  )
}

export default function Layer2Accumulation({ remainingBitbon, entryPrice }) {
  const [yieldPct, setYieldPct] = useState(10)
  const [period, setPeriod] = useState('month')

  const cfg = PERIODS.find((p) => p.key === period)
  const base = remainingBitbon * entryPrice
  const rate = yieldPct / 100

  const data = Array.from({ length: cfg.rows }, (_, i) => {
    const n = i + 1
    const total = base * Math.pow(1 + rate, n)
    return {
      n,
      label: `${cfg.prefix} ${n}`,
      total: parseFloat(total.toFixed(4)),
      earned: parseFloat((total - base).toFixed(4)),
    }
  })

  const last = data[data.length - 1]
  const totalEarned = last?.earned ?? 0
  const totalAccumulated = last?.total ?? base

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
            Слой 2
          </h2>
          <span className="text-xs text-zinc-600 font-mono ml-1">— Накопление</span>
        </div>
        <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
          Сегмент сети
        </span>
      </div>

      {/* Controls */}
      <div className="px-5 py-4 border-b border-zinc-800 space-y-4">
        {/* Base value display */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>
            Остаток в сети:{' '}
            <span className="text-zinc-300 font-semibold">{fmt(remainingBitbon, 4)} BBN</span>
          </span>
          <span>
            Базовая сумма:{' '}
            <span className="text-violet-300 font-semibold">${fmt(base)}</span>
          </span>
        </div>

        {/* Yield slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Доходность</label>
            <span className="text-sm font-mono font-bold text-violet-300">{yieldPct}%</span>
          </div>
          <div className="relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-l-full bg-violet-600 pointer-events-none"
              style={{ width: `${((yieldPct - 1) / 49) * 100}%` }}
            />
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={yieldPct}
              onChange={(e) => setYieldPct(Number(e.target.value))}
              className="relative w-full"
              style={{ background: 'transparent' }}
            />
          </div>
          <p className="text-xs text-zinc-600">% пассивного дохода за период от обеспечения сегмента</p>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-500 mr-1">Период:</span>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                period === p.key
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200',
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              angle={-30}
              textAnchor="end"
              interval={0}
              tickLine={false}
              axisLine={{ stroke: '#27272a' }}
            />
            <YAxis
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6d28d9', strokeWidth: 1, strokeDasharray: '4 2' }} />
            <ReferenceLine y={base} stroke="#3f3f46" strokeDasharray="4 2" label={{ value: 'Баз.', fill: '#52525b', fontSize: 9 }} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 3 }}
              activeDot={{ fill: '#a78bfa', r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary footer */}
      <div className="border-t border-zinc-800 px-5 py-3 flex flex-wrap gap-3">
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 flex-1 min-w-[130px]">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
            Заработано за {cfg.rows} {cfg.label.toLowerCase() === 'день' ? 'дней' : cfg.label.toLowerCase() === 'месяц' ? 'месяцев' : cfg.label.toLowerCase() === 'квартал' ? 'кварталов' : 'лет'}
          </p>
          <p className="text-lg font-bold font-mono text-emerald-300">+${fmt(totalEarned)}</p>
        </div>
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 flex-1 min-w-[130px]">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Накоплено всего</p>
          <p className="text-lg font-bold font-mono text-violet-300">${fmt(totalAccumulated)}</p>
        </div>
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 flex-1 min-w-[130px]">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Доходность итого</p>
          <p className="text-lg font-bold font-mono text-indigo-300">
            {base > 0 ? `${fmt((totalEarned / base) * 100, 1)}%` : '—'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
