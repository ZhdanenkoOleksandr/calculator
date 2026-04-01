import React from 'react'
import { motion } from 'framer-motion'

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
  {
    key: 'rangeStep',
    label: 'Шаг диапазона',
    unit: 'USD',
    min: 5,
    max: 100,
    step: 5,
    description: 'Ширина каждого ценового диапазона',
  },
  {
    key: 'payoutPercent',
    label: 'Процент выплаты',
    unit: '%',
    min: 5,
    max: 100,
    step: 5,
    description: 'Доля от депозита при каждой выплате',
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

      {/* Track with filled portion */}
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

export default function InputPanel({
  params,
  setParams,
  onCalculate,
  onSimulate,
  onReset,
  isSimulating,
}) {
  const handleChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

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

      {/* Live preview row */}
      <div className="mt-5 flex flex-wrap gap-3 py-3 px-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 text-xs font-mono text-zinc-400">
        <span>
          Units:{' '}
          <span className="text-indigo-300 font-semibold">
            {(params.investment / params.entryPrice).toFixed(4)}
          </span>{' '}
          BBN
        </span>
        <span className="text-zinc-700">|</span>
        <span>
          Payout:{' '}
          <span className="text-emerald-400 font-semibold">
            ${(params.investment * params.payoutPercent / 100).toFixed(2)}
          </span>{' '}
          / диапазон
        </span>
        <span className="text-zinc-700">|</span>
        <span>
          Шаг: <span className="text-amber-400 font-semibold">${params.rangeStep}</span>
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
                     text-zinc-400 hover:text-zinc-200 font-semibold text-sm rounded-xl
                     transition-colors"
        >
          Сброс
        </button>
      </div>
    </motion.div>
  )
}
