import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function fmt(n, d = 2) {
  if (n === undefined || n === null || isNaN(n)) return '—'
  return n.toLocaleString('ru-RU', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })
}

export default function ResultsTable({ rows, activeRow }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
          Таблица диапазонов
        </h2>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[420px]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-zinc-800/80 backdrop-blur-sm border-b border-zinc-700/50">
              {['Диапазон', 'Цена', 'Выплата $', 'Выплата BBN', 'Остаток BBN'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((row, idx) => {
                const isActive = activeRow === idx
                const isEntry = row.isEntry

                return (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className={[
                      'border-b border-zinc-800/60 transition-colors duration-300',
                      isActive
                        ? 'bg-indigo-500/15 border-indigo-500/30'
                        : isEntry
                        ? 'bg-zinc-800/30'
                        : 'hover:bg-zinc-800/40',
                    ].join(' ')}
                  >
                    {/* Range */}
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"
                          />
                        )}
                        <span
                          className={
                            isEntry
                              ? 'text-zinc-400'
                              : isActive
                              ? 'text-indigo-300 font-semibold'
                              : 'text-zinc-300'
                          }
                        >
                          {row.range}
                        </span>
                        {isEntry && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded font-sans">
                            вход
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-mono text-xs text-zinc-300 whitespace-nowrap">
                      ${fmt(row.price, 2)}
                    </td>

                    {/* Payout USD */}
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                      {row.payoutUsd > 0 ? (
                        <span className="text-emerald-400 font-semibold">
                          +${fmt(row.payoutUsd, 2)}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Payout Bitbon */}
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                      {row.payoutBitbon > 0 ? (
                        <span className="text-amber-400">
                          -{fmt(row.payoutBitbon, 4)}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Remaining */}
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            isActive ? 'text-indigo-300 font-semibold' : 'text-zinc-300'
                          }
                        >
                          {fmt(row.remaining, 4)}
                        </span>
                        {/* mini bar */}
                        <div className="hidden sm:flex w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-indigo-500/60 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(
                                (row.remaining / (rows[0]?.remaining || 1)) * 100,
                                100
                              )}%`,
                            }}
                            transition={{ duration: 0.4, delay: idx * 0.04 }}
                          />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer totals */}
      {rows.length > 1 && (
        <div className="border-t border-zinc-800 px-5 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs font-mono text-zinc-500">
          <span>
            Строк:{' '}
            <span className="text-zinc-300">{rows.length - 1}</span> диапазонов
          </span>
          <span>
            Итого выплачено:{' '}
            <span className="text-emerald-400 font-semibold">
              ${fmt(rows.slice(1).reduce((s, r) => s + r.payoutUsd, 0), 2)}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
