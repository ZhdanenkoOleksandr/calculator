import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target, duration = 2200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const raf = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
      setVal(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(raf)
      else setVal(target)
    }
    requestAnimationFrame(raf)
  }, [target, duration])
  return val
}

function Ring({ r, duration, reverse = false, dashed = false, opacity = 0.35, color = '#8b5cf6' }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: r * 2,
        height: r * 2,
        top: '50%',
        left: '50%',
        marginTop: -r,
        marginLeft: -r,
        border: `1px ${dashed ? 'dashed' : 'solid'} ${color}`,
        opacity,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    />
  )
}

function OrbitDot({ r, duration, reverse = false, color, delay = 0, size = 5 }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: r * 2, height: r * 2,
        top: '50%', left: '50%',
        marginTop: -r, marginLeft: -r,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: size, height: size,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px 2px ${color}`,
        }}
      />
    </motion.div>
  )
}

export default function CoreBalanceCard({ value, growthPct }) {
  const displayed = useCountUp(value)

  return (
    <div className="flex flex-col items-center justify-center py-8 select-none">
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Ambient glow backdrop */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Rings */}
        <Ring r={130} duration={28} dashed color="#8b5cf6" opacity={0.2} />
        <Ring r={108} duration={20} reverse color="#3b82f6" opacity={0.25} />
        <Ring r={86}  duration={14} color="#f59e0b" opacity={0.2} dashed />
        <Ring r={64}  duration={9}  reverse color="#8b5cf6" opacity={0.35} />

        {/* Orbiting dots */}
        <OrbitDot r={130} duration={28} color="rgba(139,92,246,0.9)" size={5} />
        <OrbitDot r={130} duration={28} color="rgba(139,92,246,0.9)" size={5} delay={14} />
        <OrbitDot r={108} duration={20} reverse color="rgba(59,130,246,0.9)" size={4} />
        <OrbitDot r={108} duration={20} reverse color="rgba(59,130,246,0.9)" size={4} delay={10} />
        <OrbitDot r={86}  duration={14} color="rgba(245,158,11,0.9)" size={4} delay={7} />
        <OrbitDot r={64}  duration={9}  reverse color="rgba(139,92,246,1)" size={6} />

        {/* Core sphere */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full"
          style={{
            width: 96, height: 96,
            background: 'radial-gradient(circle at 35% 35%, rgba(167,139,250,0.4), rgba(59,130,246,0.2), rgba(0,0,0,0.3))',
            boxShadow: '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(59,130,246,0.2), inset 0 0 30px rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.4)',
          }}
        />

        {/* Center text */}
        <div className="relative z-10 text-center">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-1">Economy Value</p>
          <p
            className="text-2xl font-bold font-mono text-white"
            style={{ textShadow: '0 0 20px rgba(139,92,246,0.6)' }}
          >
            ${displayed.toLocaleString('en-US')}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="mt-1.5 flex items-center justify-center gap-1.5"
          >
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.25)',
                color: '#34d399',
                boxShadow: '0 0 10px rgba(52,211,153,0.2)',
              }}
            >
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +{growthPct}%
            </div>
            <span className="text-zinc-600 text-[10px]">YTD</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mt-2"
      >
        Digital Viking Wallet
      </motion.p>
    </div>
  )
}
