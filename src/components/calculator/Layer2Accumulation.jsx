import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts'

function fmt(n, d = 2) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString('ru-RU', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const income  = payload.find((p) => p.dataKey === 'income')?.value  ?? 0
  const cumul   = payload.find((p) => p.dataKey === 'cumulative')?.value ?? 0
  const bbn     = payload[0]?.payload?.remainingBbn ?? 0
  const price   = payload[0]?.payload?.price ?? 0
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 shadow-xl text-xs font-mono min-w-[180px]">
      <p className="text-zinc-300 font-semibold mb-2">{label}</p>
      <div className="space-y-1.5">
        <div className="flex justify-between gap-4">
          <span className="text-zinc-500">Остаток BBN</span>
          <span className="text-zinc-300">{fmt(bbn, 4)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-500">Цена</span>
          <span className="text-amber-400">${fmt(price, 2)}</span>
        </div>
        <div className="border-t border-zinc-700 pt-1.5 mt-1">
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Доход за диапазон</span>
            <span className="text-violet-300 font-bold">+${fmt(income)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Накоплено всего</span>
            <span className="text-indigo-300 font-bold">${fmt(cumul)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CustomLegend({ payload }) {
  return (
    <div className="flex justify-center gap-5 pt-1">
      {payload.map((e) => (
        <div key={e.value} className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: e.color }} />
          <span className="text-xs text-zinc-500 font-mono">{e.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Layer2Accumulation({ rows }) {
  const [yieldPct, setYieldPct] = useState(10)

  // For each range (skip entry row, include all 10 payout rows):
  // income_i = remaining_after_payout_i × price_i × yieldPct%
  // The income represents passive yield earned while holding BBN during that price range
  const payoutRows = rows.filter((r) => !r.isEntry)

  let cumulative = 0
  const data = payoutRows.map((row) => {
    const price  = row.price ?? 0
    const bbn    = row.remaining ?? 0
    const income = parseFloat((bbn * price * yieldPct / 100).toFixed(4))
    cumulative   = parseFloat((cumulative + income).toFixed(4))
    return {
      label:        row.range,
      remainingBbn: bbn,
      price,
      income,
      cumulative,
    }
  })

  const totalIncome      = data.reduce((s, d) => s + d.income, 0)
  const totalCumulative  = data[data.length - 1]?.cumulative ?? 0
  const maxIncome        = Math.max(...data.map((d) => d.income))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
            Слой 2
          </h2>
          <span className="text-xs text-zinc-600 font-mono ml-1">— Накопление по диапазонам</span>
        </div>
        <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
          Сегмент сети
        </span>
      </div>

      {/* ── Controls ── */}
      <div className="px-5 py-4 border-b border-zinc-800 space-y-3">
        <p className="text-xs text-zinc-500 leading-relaxed">
          Пассивный доход от обеспечения сегмента сети: начисляется на{' '}
          <span className="text-zinc-300">остаток BBN</span> после каждой выплаты по текущей цене диапазона.
        </p>

        {/* Yield % slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">
              % дохода за диапазон
            </label>
            <span className="text-sm font-mono font-bold text-violet-300">{yieldPct}%</span>
          </div>
          <div className="relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-l-full bg-violet-600 pointer-events-none"
              style={{ width: `${((yieldPct - 1) / 49) * 100}%` }}
            />
            <input
              type="range" min={1} max={50} step={1}
              value={yieldPct}
              onChange={(e) => setYieldPct(Number(e.target.value))}
              className="relative w-full"
              style={{ background: 'transparent' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
            <span>1%</span>
            <span>Доход = остаток BBN × цена диапазона × {yieldPct}%</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 8, right: 20, left: 0, bottom: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              angle={-40}
              textAnchor="end"
              interval={0}
              tickLine={false}
              axisLine={{ stroke: '#27272a' }}
            />
            {/* Left Y: income per range */}
            <YAxis
              yAxisId="left"
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={52}
            />
            {/* Right Y: cumulative */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.07)' }} />
            <Legend content={<CustomLegend />} />

            {/* Bars: income per range */}
            <Bar
              yAxisId="left"
              dataKey="income"
              name="Доход за диапазон"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.label}
                  fill="#8b5cf6"
                  opacity={maxIncome > 0 ? 0.4 + 0.6 * (entry.income / maxIncome) : 0.6}
                />
              ))}
            </Bar>

            {/* Line: cumulative */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              name="Накоплено всего"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 3 }}
              activeDot={{ fill: '#818cf8', r: 5, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ── Footer summary ── */}
      <div className="border-t border-zinc-800 px-5 py-3 flex flex-wrap gap-3">
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 flex-1 min-w-[120px]">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Доход за диапазон (макс)</p>
          <p className="text-lg font-bold font-mono text-violet-300">+${fmt(maxIncome)}</p>
        </div>
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 flex-1 min-w-[120px]">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Сумма за 10 диапазонов</p>
          <p className="text-lg font-bold font-mono text-emerald-300">+${fmt(totalIncome)}</p>
        </div>
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 flex-1 min-w-[120px]">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Накоплено всего</p>
          <p className="text-lg font-bold font-mono text-indigo-300">${fmt(totalCumulative)}</p>
        </div>
      </div>
    </motion.div>
  )
}
