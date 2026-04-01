import React, { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import InputPanel from '../components/calculator/InputPanel'
import SummaryCards from '../components/calculator/SummaryCards'
import ResultsTable from '../components/calculator/ResultsTable'
import PayoutChart from '../components/calculator/PayoutChart'

export const DEFAULT_PARAMS = {
  investment: 100,
  entryPrice: 5,
}

// Range step is a fixed model constant — no slider
export const RANGE_STEP = 10

const NUM_RANGES = 10

// Payout schedule (% of investment) for each of the 10 ranges:
// Range 1:    100%
// Ranges 2–10: exponential startPercent → 100%  (startPercent × (100/startPercent)^(i/8), i=0..8)
// Guarantee: range 10 % > range 9 % (always true when startPercent < 100)
export function getPayoutSchedule(startPercent) {
  const ratio = 100 / startPercent
  const schedule = [100] // range 1
  for (let i = 0; i <= 8; i++) {
    schedule.push(startPercent * Math.pow(ratio, i / 8))
  }
  return schedule
}

// Auto-calculate startPercent ∈ [1%, 10%] via binary search
// so that remaining Bitbon ≈ TARGET_RETENTION (7.5%, midpoint of 5–10%)
// Condition: range-10 payout > range-9 payout — always satisfied since ratio > 1
export const TARGET_RETENTION = 0.075
export function computeAutoStartPercent(entryPrice, rangeStep = RANGE_STEP) {
  const entryRangeIndex = Math.floor(entryPrice / rangeStep)
  const firstPayoutRangeIndex = entryRangeIndex + 1
  const firstPayoutPrice = firstPayoutRangeIndex * rangeStep + entryPrice

  // Prices for all 10 payout ranges
  const prices = [firstPayoutPrice]
  for (let i = 0; i <= 8; i++) {
    prices.push((firstPayoutRangeIndex + 1 + i) * rangeStep)
  }

  // remainingFraction = 1 - entryPrice × Σ(pct_i / 100 / price_i)
  function calcRetention(sp) {
    let sum = 1.0 / prices[0] // range 1: 100%
    const ratio = 100 / sp
    for (let i = 0; i <= 8; i++) {
      sum += (sp * Math.pow(ratio, i / 8)) / 100 / prices[i + 1]
    }
    return 1 - entryPrice * sum
  }

  const MIN_SP = 1.0
  const MAX_SP = 10.0

  // Clamp if target is outside [MIN_SP, MAX_SP] range
  if (calcRetention(MIN_SP) <= TARGET_RETENTION) return MIN_SP
  if (calcRetention(MAX_SP) >= TARGET_RETENTION) return MAX_SP

  // Binary search — calcRetention is strictly decreasing in sp
  let lo = MIN_SP, hi = MAX_SP
  for (let iter = 0; iter < 64; iter++) {
    const mid = (lo + hi) / 2
    if (calcRetention(mid) > TARGET_RETENTION) lo = mid
    else hi = mid
  }
  return Math.round(((lo + hi) / 2) * 100) / 100
}

export function calculateRanges(params) {
  const { investment, entryPrice } = params
  const rangeStep = RANGE_STEP
  const startPercent = computeAutoStartPercent(entryPrice, rangeStep)
  const units = investment / entryPrice
  const schedule = getPayoutSchedule(startPercent)

  const entryRangeIndex = Math.floor(entryPrice / rangeStep)
  const entryRangeLow = entryRangeIndex * rangeStep
  const entryRangeHigh = entryRangeLow + rangeStep

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

  const remainingFraction = units > 0 ? remaining / units : 0

  // Recommended investment: buy ~100 Bitbon at entry price, rounded to nearest $50
  const recommendedInvestment = Math.ceil((entryPrice * 100) / 50) * 50

  // Max payout per period = 100% of investment (ranges 1 and 10)
  const maxPayout = investment

  return {
    rows,
    summary: {
      units,
      totalPaid,
      remaining,
      roi: (totalPaid / investment) * 100,
      remainingFraction,
      startPercent,
      recommendedInvestment,
      maxPayout,
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
                Bitbon <span className="text-indigo-400">Range Economy</span>
              </h1>
            </div>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed">
              Калькулятор диапазонной модели — рассчитайте потенциальную
              доходность ваших инвестиций в Bitbon
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <InputPanel
          params={params}
          setParams={setParams}
          onCalculate={handleCalculate}
          onSimulate={handleSimulate}
          onReset={handleReset}
          isSimulating={isSimulating}
          summary={result?.summary}
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
