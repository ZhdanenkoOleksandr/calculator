import React, { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import InputPanel from '../components/calculator/InputPanel'
import SummaryCards from '../components/calculator/SummaryCards'
import ResultsTable from '../components/calculator/ResultsTable'
import PayoutChart from '../components/calculator/PayoutChart'

export const DEFAULT_PARAMS = {
  investment: 100,
  entryPrice: 5,
  rangeStep: 10,
  startPercent: 10,
}

const NUM_RANGES = 10

// Payout schedule (% of investment) for each of the 10 ranges:
// Range 1:    100% (full recovery, in the first range above entry)
// Ranges 2–10: exponential from startPercent → 100%
//              formula: startPercent × (100/startPercent)^(i/8), i=0..8
export function getPayoutSchedule(startPercent = 10) {
  const schedule = [100] // range 1: 100%
  const ratio = 100 / startPercent
  for (let i = 0; i <= 8; i++) {
    schedule.push(startPercent * Math.pow(ratio, i / 8))
  }
  return schedule // 10 values total
}

export function calculateRanges(params) {
  const { investment, entryPrice, rangeStep, startPercent } = params
  const units = investment / entryPrice
  const schedule = getPayoutSchedule(startPercent)

  const entryRangeIndex = Math.floor(entryPrice / rangeStep)
  const entryRangeLow = entryRangeIndex * rangeStep
  const entryRangeHigh = entryRangeLow + rangeStep

  // First payout is in the very next range above entry
  // Price = lower boundary of that range + entryPrice  (e.g. 10 + 6 = 16)
  const firstPayoutRangeIndex = entryRangeIndex + 1
  const firstPayoutPrice = firstPayoutRangeIndex * rangeStep + entryPrice

  const rows = [
    {
      range: `Вход (${entryRangeLow}–${entryRangeHigh})`,
      price: entryPrice,
      payoutUsd: 0,
      payoutBitbon: 0,
      remaining: units,
      payoutPct: null,
      isEntry: true,
    },
  ]

  let remaining = units
  let totalPaid = 0

  for (let i = 0; i < NUM_RANGES; i++) {
    const rangeIndex = firstPayoutRangeIndex + i
    const rangeLow = rangeIndex * rangeStep
    const rangeHigh = rangeLow + rangeStep

    const currentPrice = i === 0 ? firstPayoutPrice : rangeLow
    const payoutPct = schedule[i]
    const payoutUsdTarget = investment * (payoutPct / 100)

    // Clamp to remaining — always add the row even if remaining is 0
    const payoutBitbon = remaining > 0
      ? Math.min(payoutUsdTarget / currentPrice, remaining)
      : 0
    const actualPayoutUsd = payoutBitbon * currentPrice

    remaining = Math.max(remaining - payoutBitbon, 0)
    totalPaid += actualPayoutUsd

    rows.push({
      range: `${rangeLow}–${rangeHigh}`,
      price: currentPrice,
      payoutUsd: actualPayoutUsd,
      payoutBitbon,
      remaining,
      payoutPct,
      isFirstPayout: i === 0,
      isLastPayout: i === NUM_RANGES - 1,
    })
  }

  // remainingFraction is INDEPENDENT of investment amount —
  // it is determined solely by entryPrice, rangeStep, startPercent.
  const remainingFraction = units > 0 ? remaining / units : 0
  const meetsRetention = remainingFraction >= 0.1

  // Minimum investment to have ≥1 BBN remaining after all 10 payouts
  // remaining_bitbon = investment/entryPrice * remainingFraction ≥ 1
  // → investment ≥ entryPrice / remainingFraction
  const minInvestment = remainingFraction > 0
    ? Math.ceil(entryPrice / remainingFraction)
    : null

  return {
    rows,
    summary: {
      units,
      totalPaid,
      remaining,
      roi: (totalPaid / investment) * 100,
      remainingFraction,
      meetsRetention,
      minInvestment,
    },
  }
}

function RetentionBanner({ summary, params }) {
  const { remainingFraction, meetsRetention, minInvestment } = summary
  const pct = (remainingFraction * 100).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={[
        'rounded-2xl border px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4',
        meetsRetention
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-red-500/5 border-red-500/20',
      ].join(' ')}
    >
      {/* Status icon */}
      <div className={[
        'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg',
        meetsRetention ? 'bg-emerald-500/15' : 'bg-red-500/15',
      ].join(' ')}>
        {meetsRetention ? '✓' : '✗'}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-sm font-semibold text-zinc-200">
            Остаток после 10 выплат:
          </span>
          <span className={`text-xl font-bold font-mono ${meetsRetention ? 'text-emerald-400' : 'text-red-400'}`}>
            {pct}%
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            meetsRetention
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}>
            {meetsRetention ? '≥ 10% · условие выполнено' : '< 10% · условие не выполнено'}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          {meetsRetention
            ? 'При текущих параметрах остаток Bitbon выше порога 10% при любой сумме инвестиции.'
            : 'Снизьте «Старт 2-го диапазона» или увеличьте «Шаг диапазона», чтобы уменьшить нагрузку выплат.'}
        </p>
      </div>

      {/* Min investment block */}
      <div className="flex-shrink-0 text-right sm:border-l sm:border-zinc-700 sm:pl-5">
        <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Мин. инвестиция</p>
        {minInvestment != null ? (
          <>
            <p className="text-xl font-bold font-mono text-indigo-300">${minInvestment}</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">для ≥ 1 BBN остатка</p>
          </>
        ) : (
          <p className="text-sm font-mono text-red-400">∞</p>
        )}
      </div>
    </motion.div>
  )
}

export default function Calculator() {
  const [params, setParams] = useState(DEFAULT_PARAMS)
  const [result, setResult] = useState(() => calculateRanges(DEFAULT_PARAMS))
  const [activeRow, setActiveRow] = useState(-1)
  const [isSimulating, setIsSimulating] = useState(false)
  const simRef = useRef(null)

  const handleCalculate = useCallback(() => {
    if (simRef.current) clearInterval(simRef.current)
    setIsSimulating(false)
    setActiveRow(-1)
    setResult(calculateRanges(params))
  }, [params])

  const handleSimulate = useCallback(() => {
    if (simRef.current) clearInterval(simRef.current)

    const data = calculateRanges(params)
    setResult(data)
    setIsSimulating(true)
    setActiveRow(0)

    let idx = 0
    simRef.current = setInterval(() => {
      idx++
      if (idx >= data.rows.length) {
        clearInterval(simRef.current)
        setIsSimulating(false)
        setActiveRow(-1)
        return
      }
      setActiveRow(idx)
    }, 900)
  }, [params])

  const handleReset = useCallback(() => {
    if (simRef.current) clearInterval(simRef.current)
    setIsSimulating(false)
    setActiveRow(-1)
    setParams(DEFAULT_PARAMS)
    setResult(calculateRanges(DEFAULT_PARAMS))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 font-inter">
      {/* Header */}
      <header className="border-b border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <span className="text-white font-bold text-base font-mono">B</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Bitbon{' '}
                <span className="text-indigo-400">Range Economy</span>
              </h1>
            </div>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed">
              Калькулятор диапазонной модели — рассчитайте потенциальную
              доходность ваших инвестиций в Bitbon
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <InputPanel
          params={params}
          setParams={setParams}
          onCalculate={handleCalculate}
          onSimulate={handleSimulate}
          onReset={handleReset}
          isSimulating={isSimulating}
        />

        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            <RetentionBanner summary={result.summary} params={params} />
            <SummaryCards data={result.summary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResultsTable rows={result.rows} activeRow={activeRow} />
              <PayoutChart rows={result.rows} activeRow={activeRow} />
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-5 text-center">
          <p className="text-xs text-zinc-600 font-mono">
            Bitbon Range Economy Calculator — Модель диапазонной экономики
          </p>
        </div>
      </footer>
    </div>
  )
}
