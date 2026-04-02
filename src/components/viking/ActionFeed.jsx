import React from 'react'
import { motion } from 'framer-motion'

const ACTION_ICONS = {
  network:  { icon: '⬡', color: '#60a5fa' },
  asset:    { icon: '◈',  color: '#fbbf24' },
  aura:     { icon: '◉',  color: '#a78bfa' },
  income:   { icon: '$',  color: '#34d399' },
  stake:    { icon: '⬡', color: '#f87171' },
  default:  { icon: '·',  color: '#71717a' },
}

export default function ActionFeed({ actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
          Action Feed
        </p>
        <p className="text-white font-bold text-lg mt-0.5">Recent Activity</p>
      </div>

      <div className="flex flex-col gap-1">
        {actions.map((action, i) => {
          const theme = ACTION_ICONS[action.type] ?? ACTION_ICONS.default
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200 hover:bg-white/3 group"
              style={{ borderBottom: i < actions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-mono font-bold"
                style={{
                  background: `${theme.color}12`,
                  border: `1px solid ${theme.color}30`,
                  color: theme.color,
                }}
              >
                {theme.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300 font-medium truncate group-hover:text-white transition-colors">
                  {action.title}
                </p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{action.time}</p>
              </div>

              {/* Result */}
              <div
                className="text-xs font-mono font-semibold flex-shrink-0"
                style={{ color: action.positive ? '#34d399' : '#f87171' }}
              >
                {action.result}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
