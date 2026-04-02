import React from 'react'
import { motion } from 'framer-motion'

function Requirement({ label, done, progress, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: done ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)',
              border: done ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {done ? (
              <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            )}
          </div>
          <span className="text-xs" style={{ color: done ? '#e4e4e7' : '#71717a' }}>{label}</span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: done ? '#34d399' : '#52525b' }}>
          {progress}
        </span>
      </div>
      {!done && (
        <div className="ml-6 h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#7c3aed,#a78bfa)' }}
            initial={{ width: 0 }}
            animate={{ width: progress }}
            transition={{ duration: 1.0, delay: delay + 0.3, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>
      )}
    </motion.div>
  )
}

export default function NextRoleCard({ currentRole, nextRole, requirements }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl p-5 flex flex-col gap-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(59,130,246,0.05) 50%, rgba(0,0,0,0) 100%)',
        border: '1px solid rgba(139,92,246,0.2)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 40px rgba(139,92,246,0.1)',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }}
      />

      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
          Role Progression
        </p>
        <p className="text-white font-bold text-lg mt-0.5">Next Role</p>
      </div>

      {/* Role transition */}
      <div className="flex items-center gap-3">
        <div
          className="flex-1 rounded-xl px-3 py-2.5 text-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Current</p>
          <p className="text-sm font-bold text-zinc-300">{currentRole}</p>
        </div>

        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.div>

        <div
          className="flex-1 rounded-xl px-3 py-2.5 text-center relative overflow-hidden"
          style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.35)',
            boxShadow: '0 0 20px rgba(139,92,246,0.15)',
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), transparent)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <p className="text-[10px] text-purple-500 uppercase tracking-wider mb-1 relative z-10">Next</p>
          <p
            className="text-sm font-bold relative z-10"
            style={{ color: '#a78bfa', textShadow: '0 0 12px rgba(167,139,250,0.5)' }}
          >
            {nextRole}
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600 font-semibold">Requirements</p>
        {requirements.map((req, i) => (
          <Requirement key={req.label} {...req} delay={0.1 * i} />
        ))}
      </div>
    </motion.div>
  )
}
