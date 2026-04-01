import React from 'react'
import { motion } from 'framer-motion'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'

function fmt(n, d = 2) {
  if (!n && n !== 0) return '—'
  return n.toLocaleString('ru-RU', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })
}

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 shadow-xl text-xs font-mono">
      <p className="text-zinc-300 font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white font-semibold">
            {p.name === 'Выплата $'
              ? `$${fmt(p.value, 2)}`
              : `${fmt(p.value, 4)} BBN`}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── Custom Legend ── */
function CustomLegend({ payload }) {
  return (
    <div className="flex justify-center gap-5 pb-1">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ background: entry.color }}
          />
          <span className="text-xs text-zinc-500 font-mono">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function PayoutChart({ rows, activeRow }) {
  // Skip entry row (idx 0), only show payout rows
  const data = rows.slice(1).map((row, i) => ({
    name: row.range,
    'Выплата $': parseFloat(row.payoutUsd.toFixed(2)),
    'Остаток BBN': parseFloat(row.remaining.toFixed(4)),
    idx: i + 1, // matches activeRow index in original rows array
  }))

  if (!data.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
          Динамика выплат
        </h2>
      </div>

      <div className="flex-1 p-4 min-h-[360px]">
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              angle={-40}
              textAnchor="end"
              interval={0}
              tickLine={false}
              axisLine={{ stroke: '#27272a' }}
            />

            {/* Left Y: payout USD */}
            <YAxis
              yAxisId="left"
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={52}
            />

            {/* Right Y: remaining Bitbon */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
              width={52}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
            <Legend content={<CustomLegend />} />

            {/* Active range reference line */}
            {activeRow > 0 && data[activeRow - 1] && (
              <ReferenceLine
                yAxisId="left"
                x={data[activeRow - 1].name}
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="4 2"
              />
            )}

            {/* Payout bars */}
            <Bar
              yAxisId="left"
              dataKey="Выплата $"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    activeRow > 0 && entry.idx === activeRow
                      ? '#818cf8'
                      : '#6366f1'
                  }
                  opacity={
                    activeRow <= 0
                      ? 0.85
                      : entry.idx === activeRow
                      ? 1
                      : entry.idx < activeRow
                      ? 0.55
                      : 0.3
                  }
                />
              ))}
            </Bar>

            {/* Remaining line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Остаток BBN"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props
                const isAct = activeRow > 0 && payload.idx === activeRow
                return (
                  <circle
                    key={`dot-${payload.name}`}
                    cx={cx}
                    cy={cy}
                    r={isAct ? 5 : 3}
                    fill={isAct ? '#fbbf24' : '#92400e'}
                    stroke={isAct ? '#fbbf24' : 'transparent'}
                    strokeWidth={2}
                  />
                )
              }}
              activeDot={{ r: 5, fill: '#fbbf24' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart legend explanation */}
      <div className="border-t border-zinc-800 px-5 py-3 flex flex-wrap gap-4 text-xs text-zinc-600 font-mono">
        <span>
          <span className="text-indigo-400">█</span> Выплата за диапазон (USD)
        </span>
        <span>
          <span className="text-amber-400">─</span> Остаток Bitbon
        </span>
      </div>
    </motion.div>
  )
}
