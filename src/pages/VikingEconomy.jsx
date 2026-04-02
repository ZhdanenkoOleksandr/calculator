import React from 'react'
import { motion } from 'framer-motion'
import CoreBalanceCard from '../components/viking/CoreBalanceCard'
import StatCard from '../components/viking/StatCard'
import ChartSection from '../components/viking/ChartSection'
import RoleDistribution from '../components/viking/RoleDistribution'
import TokenGrid from '../components/viking/TokenGrid'
import ActionFeed from '../components/viking/ActionFeed'
import NextRoleCard from '../components/viking/NextRoleCard'
import DigitalIntuition from '../components/viking/DigitalIntuition'
import ServiceMiniCarousel from '../components/viking/ServiceMiniCarousel'

// ─── Mock data ────────────────────────────────────────────────
const ECONOMY_VALUE = 247850
const GROWTH_PCT    = 34.7

const TIMELINE = [
  { year: '2018', value: 2400   },
  { year: '2019', value: 8200   },
  { year: '2020', value: 15800  },
  { year: '2021', value: 42000  },
  { year: '2022', value: 78500  },
  { year: '2023', value: 156000 },
  { year: '2024', value: 247850 },
]

const ROLES = [
  { name: 'Провайдер',  pct: 42, income: '$104,097', color: 'blue',    icon: '⬡' },
  { name: 'Создатель',  pct: 35, income: '$86,748',  color: 'purple',  icon: '✦' },
  { name: 'Инвестор',   pct: 23, income: '$57,005',  color: 'gold',    icon: '◈' },
  { name: 'Ментор',     pct: 18, income: '$44,613',  color: 'emerald', icon: '◎' },
  { name: 'Аналитик',   pct: 14, income: '$34,699',  color: 'cyan',    icon: '◇' },
  { name: 'Амбассадор', pct: 11, income: '$27,264',  color: 'rose',    icon: '⚑' },
  { name: 'Архитектор', pct: 29, income: '$71,877',  color: 'indigo',  icon: '⬙' },
  { name: 'Куратор',    pct: 16, income: '$39,656',  color: 'orange',  icon: '⊕' },
  { name: 'Модератор',  pct: 9,  income: '$22,307',  color: 'teal',    icon: '⊞' },
]

const TOKENS = [
  { name: 'Viking Core',  active: true,  projectShare: 34 },
  { name: 'BeautyNet',    active: true,  projectShare: 18 },
  { name: 'Scanerbon',    active: true,  projectShare: 22 },
  { name: 'AuraBond',     active: true,  projectShare: 11 },
  { name: 'DAO District', active: false, projectShare: 0  },
  { name: 'NetTrack',     active: false, projectShare: 0  },
]

// Personal brand services for mini carousel
const BRAND_SERVICES = [
  { name: 'Viking Core',      icon: '⚔',  color: '#a78bfa', active: true  },
  { name: 'BeautyNet',        icon: '✦',  color: '#f472b6', active: true  },
  { name: 'Scanerbon',        icon: '◎',  color: '#34d399', active: true  },
  { name: 'AuraBond',         icon: '◉',  color: '#c084fc', active: true  },
  { name: 'Platform Academy', icon: '◈',  color: '#22d3ee', active: true  },
  { name: 'Viking Lab',       icon: '⬙',  color: '#fb923c', active: true  },
  { name: 'DAO District',     icon: '⬡',  color: '#60a5fa', active: false },
  { name: 'NetTrack',         icon: '⊕',  color: '#fbbf24', active: false },
  { name: 'AuraStake',        icon: '◇',  color: '#818cf8', active: true  },
  { name: 'Viking Node',      icon: '⊞',  color: '#2dd4bf', active: false },
]

const ACTIONS = [
  { title: 'Network Expansion',    result: '+12 nodes',    time: '2h ago',  type: 'network', positive: true  },
  { title: 'Viking Core Activated',result: 'Token live',   time: '5h ago',  type: 'asset',   positive: true  },
  { title: 'AURA Boost',           result: '+3.2 pts',     time: '1d ago',  type: 'aura',    positive: true  },
  { title: 'Income Received',      result: '+$1,847',      time: '2d ago',  type: 'income',  positive: true  },
  { title: 'Reputation Stake',     result: '−$500',        time: '3d ago',  type: 'stake',   positive: false },
  { title: 'Asset Registered',     result: '+1 asset',     time: '4d ago',  type: 'asset',   positive: true  },
]

const REQUIREMENTS = [
  { label: 'Active assets ≥ 5',          done: true,  progress: '100%' },
  { label: 'Network connections ≥ 1500', done: false, progress: '83%'  },
  { label: 'AURA score ≥ 90',           done: false, progress: '78%'  },
  { label: 'Launch a funded project',   done: false, progress: '40%'  },
]

// ─── Section divider ─────────────────────────────────────────
function SectionDivider({ label, color = '#a78bfa', bg = 'rgba(139,92,246,0.08)', border = 'rgba(139,92,246,0.2)' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="flex items-center gap-2 mb-4"
    >
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${color}50, transparent)` }} />
      <span
        className="text-[10px] uppercase tracking-[0.25em] font-semibold px-3 py-1 rounded-full"
        style={{ color, background: bg, border: `1px solid ${border}` }}
      >
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${color}50)` }} />
    </motion.div>
  )
}

export default function VikingEconomy() {
  return (
    <div className="min-h-screen font-inter" style={{ background: '#080810' }}>
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-3"
          >
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(59,130,246,0.3))',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 20px rgba(139,92,246,0.3)',
              }}
            >
              <span className="text-white font-bold text-base">⚔</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Bitbon{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Viking Economy
                </span>
              </h1>
              <p className="text-zinc-600 text-xs tracking-widest uppercase">
                Digital Viking Wallet · Personal Economy OS
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">

        {/* HERO */}
        <div className="flex justify-center">
          <CoreBalanceCard value={ECONOMY_VALUE} growthPct={GROWTH_PCT} />
        </div>

        {/* NETWORK + ASSETS (2 main stat cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="Network" value="1,247" subtitle="Active connections"
            color="blue" icon="⬡" delay={0} />
          <StatCard title="Assets" value="23" subtitle="Active metaresources"
            detail="Capacity" color="gold" barPct={58} icon="◈" delay={0.1} />
        </div>

        {/* ── СЕРВИСЫ LAYER: AURA + PING + LINK + brand carousel ── */}
        <div>
          <SectionDivider label="Сервисы" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="AURA" value="78" subtitle="Reputation score"
              detail="Reputation" color="purple" barPct={78} icon="◉" delay={0} />
            <StatCard title="PING" value="94" subtitle="Network pulse"
              detail="Активность" color="cyan" barPct={94} icon="◎" delay={0.08} />
            <StatCard title="LINK" value="3,241" subtitle="Активных связей"
              color="teal" icon="⬡" delay={0.16} />
          </div>
          {/* Personal brand services mini carousel — cards ~30% of StatCard height */}
          <ServiceMiniCarousel services={BRAND_SERVICES} />
        </div>

        {/* ── ИНСТРУМЕНТЫ LAYER: Цифровая интуиция ── */}
        <div>
          <SectionDivider
            label="Инструменты"
            color="#22d3ee"
            bg="rgba(34,211,238,0.07)"
            border="rgba(34,211,238,0.2)"
          />
          <DigitalIntuition aura={78} ping={94} link={72} />
        </div>

        {/* CHART + ROLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSection data={TIMELINE} />
          <RoleDistribution roles={ROLES} />
        </div>

        {/* TOKEN GRID */}
        <TokenGrid tokens={TOKENS} />

        {/* ACTION FEED + NEXT ROLE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionFeed actions={ACTIONS} />
          <NextRoleCard
            currentRole="Network Architect"
            nextRole="Viking Lord"
            requirements={REQUIREMENTS}
          />
        </div>

      </main>

      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-5 text-center">
          <p className="text-xs text-zinc-700 font-mono tracking-widest uppercase">
            Digital Viking Wallet · Web4 Personal Economy System
          </p>
        </div>
      </footer>
    </div>
  )
}
