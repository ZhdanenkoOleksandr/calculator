import React, { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import InputPanel from '../components/calculator/InputPanel'
import SummaryCards from '../components/calculator/SummaryCards'
import ResultsTable from '../components/calculator/ResultsTable'
import PayoutChart from '../components/calculator/PayoutChart'
import Layer2Accumulation from '../components/calculator/Layer2Accumulation'

export const DEFAULT_PARAMS = {
  investment: 100,
  entryPrice: 5,
}

// Range step is a fixed model constant — no slider
export const RANGE_STEP = 10

const NUM_RANGES = 10

// startPercent is always fixed at 1%: parabolic growth 1% → 100% across ranges 2–10
export const FIXED_START_PERCENT = 1.0

// Payout schedule (% of investment):
// Range 1:    100% (first payout at entry+1 range)
// Ranges 2–10: parabolic 1% → 100%  (1 × (100)^(i/8), i=0..8)
export function getPayoutSchedule(startPercent = FIXED_START_PERCENT) {
  const ratio = 100 / startPercent
  const schedule = [100] // range 1
  for (let i = 0; i <= 8; i++) {
    schedule.push(startPercent * Math.pow(ratio, i / 8))
  }
  return schedule
}

export function calculateRanges(params) {
  const { investment, entryPrice } = params
  const rangeStep = RANGE_STEP
  const units = investment / entryPrice
  const schedule = getPayoutSchedule(FIXED_START_PERCENT)

  const entryRangeIndex = Math.floor(entryPrice / rangeStep)
  const entryRangeLow = entryRangeIndex * rangeStep
  const entryRangeHigh = entryRangeLow + rangeStep
  const firstPayoutRangeIndex = entryRangeIndex + 1
  const firstPayoutPrice = firstPayoutRangeIndex * rangeStep + (entryPrice % rangeStep)

  const entryRow = {
    range: `Вход (${entryRangeLow}–${entryRangeHigh})`,
    price: entryPrice,
    payoutUsd: 0,
    payoutBitbon: 0,
    remaining: units,
    payoutPct: null,
    isEntry: true,
  }

  // --- 10 parabolic periods ---
  let rem10 = units
  let paid10 = 0
  const parabolicRows = []

  for (let i = 0; i < NUM_RANGES; i++) {
    const rangeIndex = firstPayoutRangeIndex + i
    const rangeLow = rangeIndex * rangeStep
    const rangeHigh = rangeLow + rangeStep
    const currentPrice = i === 0 ? firstPayoutPrice : rangeLow
    const payoutPct = schedule[i]
    const payoutUsdTarget = investment * (payoutPct / 100)
    const payoutBitbon = rem10 > 0 ? Math.min(payoutUsdTarget / currentPrice, rem10) : 0
    const actualPayoutUsd = payoutBitbon * currentPrice
    rem10 = Math.max(rem10 - payoutBitbon, 0)
    paid10 += actualPayoutUsd
    parabolicRows.push({
      range: `${rangeLow}–${rangeHigh}`,
      price: currentPrice,
      payoutUsd: actualPayoutUsd,
      payoutBitbon,
      remaining: rem10,
      payoutPct,
      isFirstPayout: i === 0,
      isLastPayout: i === NUM_RANGES - 1,
    })
  }

  // --- Fallback: if period 10 actual payout < period 9 → 9 equal periods ---
  const useEqualDist = parabolicRows[9].payoutUsd < parabolicRows[8].payoutUsd

  let rows, remaining, totalPaid, numPeriods

  if (useEqualDist) {
    const equalPayoutUsd = paid10 / 9
    numPeriods = 9
    let rem = units
    let paid = 0
    const equalRows = []

    for (let i = 0; i < 9; i++) {
      const rangeIndex = firstPayoutRangeIndex + i
      const rangeLow = rangeIndex * rangeStep
      const rangeHigh = rangeLow + rangeStep
      const currentPrice = i === 0 ? firstPayoutPrice : rangeLow
      const payoutBitbon = rem > 0 ? Math.min(equalPayoutUsd / currentPrice, rem) : 0
      const actualPayoutUsd = payoutBitbon * currentPrice
      rem = Math.max(rem - payoutBitbon, 0)
      paid += actualPayoutUsd
      equalRows.push({
        range: `${rangeLow}–${rangeHigh}`,
        price: currentPrice,
        payoutUsd: actualPayoutUsd,
        payoutBitbon,
        remaining: rem,
        payoutPct: (actualPayoutUsd / investment) * 100,
        isFirstPayout: i === 0,
        isLastPayout: i === 8,
        isEqualDistribution: true,
      })
    }

    rows = [entryRow, ...equalRows]
    remaining = rem
    totalPaid = paid
  } else {
    rows = [entryRow, ...parabolicRows]
    remaining = rem10
    totalPaid = paid10
    numPeriods = 10
  }

  const remainingFraction = units > 0 ? remaining / units : 0
  const recommendedInvestment = Math.ceil((entryPrice * 100) / 50) * 50
  const maxPayout = investment

  return {
    rows,
    summary: {
      units,
      totalPaid,
      remaining,
      roi: (totalPaid / investment) * 100,
      remainingFraction,
      startPercent: FIXED_START_PERCENT,
      recommendedInvestment,
      maxPayout,
      numPeriods,
      isEqualDistribution: useEqualDist,
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

            <Layer2Accumulation rows={result.rows} />
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
