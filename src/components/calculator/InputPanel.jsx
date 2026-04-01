import React from 'react'
import { motion } from 'framer-motion'
import { getPayoutSchedule, computeAutoStartPercent, RANGE_STEP } from '../../pages/Calculator'

// Only investment and entryPrice are user-controlled
const FIELDS = [
  {
    key: 'investment',
    label: 'Инвестиция',
    unit: 'USD',
    min: 10,
    max: 10000,
    step: 10,
    description: 'Сумма входа в USD',
  },
  {
    key: 'entryPrice',
    label: 'Цена входа',
    unit: 'USD',
    min: 1,
    max: 500,
    step: 1,
    description: 'Цена Bitbon при покупке',
  },
]

function SliderField({ field, value, onChange }) {
  const { key, label, unit, min, max, step, description } = field
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (!isNaN(v) && v >= min && v <= max) onChange(key, v)
            }}
            className="w-20 text-right bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1
                       text-sm text-white font-mono focus:outline-none focus:border-indigo-500
                       transition-colors"
          />
          <span className="text-zinc-500 text-xs w-6">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-l-full bg-indigo-600 pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(key, Number(e.target.value))}
          className="relative w-full"
          style={{ background: 'transparent' }}
        />
      </div>
      <p className="text-xs text-zinc-600">{description}</p>
    </div>
  )
}

function StatBadge({ label, value, sub, color = 'zinc' }) {
  const colors = {
    zinc:   'bg-zinc-800/60 border-zinc-700/50 text-zinc-300',
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    emerald:'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    amber:  'bg-amber-500/10 border-amber-500/20 text-amber-300',
  }
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${colors[color]}`}>
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-mono font-bold text-sm">{value}</p>
      {sub && <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function InputPanel({
  params,
  setParams,
  onCalculate,
  onSimulate,
  onReset,
  isSimulating,
  summary,
}) {
  const handleChange = (key, value) =>
    setParams((prev) => ({ ...prev, [key]: value }))

  // Auto-computed values (reactive to entryPrice)
  const startPercent = computeAutoStartPercent(params.investment)
  const schedule = getPayoutSchedule(startPercent)
  const units = params.investment / params.entryPrice
  const recommendedInvestment = summary?.recommendedInvestment ?? Math.ceil((params.entryPrice * 100) / 50) * 50
  const maxPayout = params.investment // 100% of investment (ranges 1 & 10)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
          Параметры
        </h2>
      </div>

      {/* User-controlled sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {FIELDS.map((field) => (
          <SliderField
            key={field.key}
            field={field}
            value={params[field.key]}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Auto-computed constants */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBadge
          label="Старт 2-го диапазона"
          value={`${startPercent.toFixed(2)}%`}
          sub="авто · 1%→10%"
          color="indigo"
        />
        <StatBadge
          label="Шаг диапазона"
          value={`$${RANGE_STEP}`}
          sub="константа"
          color="zinc"
        />
        <StatBadge
          label="Диапазонов"
          value="10"
          sub="константа"
          color="zinc"
        />
        <StatBadge
          label="Остаток BBN"
          value={`${((summary?.remainingFraction ?? 0.075) * 100).toFixed(1)}%`}
          sub="цель: 5–10%"
          color="emerald"
        />
      </div>

      {/* Recommended investment & max payout */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Рекомендуемый размер инвестиции
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">при цене ${params.entryPrice} · ≈100 BBN</p>
          </div>
          <p className="text-2xl font-bold font-mono text-indigo-300">
            ${recommendedInvestment}
          </p>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Максимальная выплата
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">диапазоны 1 и 10 · 100%</p>
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-300">
            ${maxPayout.toLocaleString('ru-RU')}
          </p>
        </div>
      </div>

      {/* Payout schedule mini-chart */}
      <div className="mt-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 font-semibold">
          График выплат по диапазонам
        </p>
        <div className="flex items-end gap-1 h-12">
          {schedule.map((pct, i) => {
            const isFirst = i === 0
            const isLast = i === schedule.length - 1
            return (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div
                  className={[
                    'w-full rounded-t transition-all duration-200',
                    isFirst || isLast ? 'bg-emerald-500/70' : 'bg-indigo-500/60',
                  ].join(' ')}
                  style={{ height: `${pct}%` }}
                />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-zinc-300 bg-zinc-700 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {pct.toFixed(1)}%
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-zinc-600 font-mono">
          <span>100%</span>
          <span>{startPercent.toFixed(2)}%→100% (авто)</span>
          <span>100%</span>
        </div>
      </div>

      {/* Live preview */}
      <div className="mt-4 flex flex-wrap gap-3 py-2.5 px-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 text-xs font-mono text-zinc-400">
        <span>
          Units: <span className="text-indigo-300 font-semibold">{units.toFixed(4)}</span> BBN
        </span>
        <span className="text-zinc-700">|</span>
        <span>
          Куплено за: <span className="text-zinc-300">${params.investment}</span>
        </span>
        <span className="text-zinc-700">|</span>
        <span>
          Цена: <span className="text-amber-400">${params.entryPrice}</span>
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={onCalculate}
          disabled={isSimulating}
          className="flex-1 min-w-[120px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500
                     disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold
                     text-sm rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
        >
          Рассчитать
        </button>
        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className="flex-1 min-w-[140px] px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600
                     disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold
                     text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isSimulating ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Симуляция…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Симулировать рост
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2.5 bg-transparent hover:bg-zinc-800 border border-zinc-700
                     text-zinc-400 hover:text-zinc-200 font-semibold text-sm rounded-xl transition-colors"
        >
          Сброс
        </button>
      </div>
    </motion.div>
  )
}
