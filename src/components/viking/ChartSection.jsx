import React from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-3 py-2 text-sm font-mono"
      style={{
        background: 'rgba(9,9,11,0.9)',
        border: '1px solid rgba(139,92,246,0.3)',
        boxShadow: '0 0 20px rgba(139,92,246,0.2)',
      }}
    >
      <p className="text-zinc-400 text-[10px] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-white font-bold">${payload[0].value.toLocaleString('en-US')}</p>
    </div>
  )
}

export default function ChartSection({ data }) {
  const gradId = 'vikingAreaGrad'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
            Earned Since 2018
          </p>
          <p className="text-white font-bold text-lg mt-0.5">
            ${data[data.length - 1].value.toLocaleString('en-US')}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.2)',
            color: '#34d399',
          }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          +{(((data[data.length-1].value - data[0].value) / data[0].value) * 100).toFixed(0)}% total
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#52525b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139,92,246,0.3)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill={`url(#${gradId})`}
            dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#a78bfa', stroke: 'rgba(139,92,246,0.4)', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
