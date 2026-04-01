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
}

const NUM_RANGES = 10

// Payout schedule (% of investment) for each of the 10 ranges:
// Range 1:    100% (full recovery, in the first range above entry)
// Ranges 2–10: exponential from 10% → 100% (geometric: 10% × 10^(i/8), i=0..8)
export function getPayoutSchedule() {
  const schedule = [100] // range 1: 100%
  for (let i = 0; i <= 8; i++) {
    // 9 values: 10% × 10^(i/8) → 10%, ~13.3%, ~17.8%, ~23.7%, ~31.6%, ~42.2%, ~56.2%, ~75%, 100%
    schedule.push(10 * Math.pow(10, i / 8))
  }
  return schedule // 10 values total
}

export function calculateRanges(params) {
  const { investment, entryPrice, rangeStep } = params
  const units = investment / entryPrice
  const schedule = getPayoutSchedule()

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

  return {
    rows,
    summary: {
      units,
      totalPaid,
      remaining,
      roi: (totalPaid / investment) * 100,
    },
  }
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
