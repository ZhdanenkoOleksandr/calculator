import React, { useRef, useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

// Personal brand services — each card is ~30% the height of a StatCard
const CARD_H = 52  // ≈30% of StatCard (~170px)

// Bitbon System brand color
const BB_BLUE = '#38bdf8'

function MiniCard({ name, icon, color, active, glow }) {
  return (
    <div
      className="flex-shrink-0 flex items-center gap-2.5 px-3 rounded-xl cursor-pointer select-none"
      style={{
        height: CARD_H,
        minWidth: 130,
        background: active
          ? `linear-gradient(135deg, ${color}12, ${color}08)`
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${active ? color + '40' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: active ? `0 0 14px ${glow ?? color + '30'}` : 'none',
        opacity: active ? 1 : 0.4,
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Icon badge */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-bold"
        style={{
          background: active ? `${color}20` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${active ? color + '35' : 'rgba(255,255,255,0.06)'}`,
          color: active ? color : '#52525b',
          boxShadow: active ? `0 0 8px ${color}40` : 'none',
        }}
      >
        {icon}
      </div>

      {/* Name + status */}
      <div className="min-w-0">
        <p
          className="text-xs font-semibold leading-none truncate"
          style={{ color: active ? '#e4e4e7' : '#52525b' }}
        >
          {name}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {active ? (
            <>
              <motion.div
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: color }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[9px]" style={{ color: color + 'cc' }}>active</span>
            </>
          ) : (
            <span className="text-[9px] text-zinc-700">locked</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ServiceMiniCarousel({ services }) {
  const trackRef = useRef(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const controls = useAnimation()
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)

  // Duplicate for seamless loop
  const items = [...services, ...services]

  useEffect(() => {
    if (trackRef.current) {
      // width of one full set of items (half of duplicated track)
      setTrackWidth(trackRef.current.scrollWidth / 2)
    }
  }, [])

  useEffect(() => {
    if (!trackWidth) return
    const speed = 40 // px/s
    const duration = trackWidth / speed

    controls.start({
      x: -trackWidth,
      transition: { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
    })
  }, [trackWidth, controls])

  const pause = () => {
    pausedRef.current = true
    controls.stop()
  }
  const resume = () => {
    if (!pausedRef.current) return
    pausedRef.current = false
    if (!trackWidth) return
    const speed = 40
    const duration = trackWidth / speed
    controls.start({
      x: -trackWidth,
      transition: { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
    })
  }

  return (
    <div className="mt-4">
      {/* Label */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-semibold mb-2 px-0.5">
        <span style={{
          background: 'linear-gradient(90deg, #38bdf8, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>Сервисы Bitbon System</span>
      </p>

      {/* Track container */}
      <div
        className="overflow-hidden rounded-xl relative"
        style={{
          background: 'rgba(56,189,248,0.02)',
          border: '1px solid rgba(56,189,248,0.1)',
        }}
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {/* Left / right fade masks */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg, rgba(8,8,16,0.9), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10"
          style={{ background: 'linear-gradient(270deg, rgba(8,8,16,0.9), transparent)' }}
        />

        <div className="py-2 px-3">
          <motion.div
            ref={trackRef}
            className="flex gap-2.5 w-max"
            animate={controls}
          >
            {items.map((s, i) => (
              <MiniCard key={`${s.name}-${i}`} {...s} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
