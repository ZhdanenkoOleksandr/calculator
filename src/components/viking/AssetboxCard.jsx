import React, { useState } from 'react'
import { motion } from 'framer-motion'

// ── Viking emblem SVG (replace <img src="/viking-logo.png"> when file is added) ──
function VikingEmblem({ size = 80 }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #0f1e3d 0%, #1a3a6e 60%, #0a1628 100%)',
        border: '2px solid rgba(56,189,248,0.4)',
        boxShadow: '0 0 24px rgba(56,189,248,0.2), inset 0 0 20px rgba(56,189,248,0.05)',
      }}
    >
      {/* Try to load the actual image, fallback to SVG rune */}
      <img
        src="/viking-logo.png"
        alt="Digital Viking Wallet"
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
      />
      {/* Fallback SVG rune */}
      <div
        className="absolute inset-0 items-center justify-center"
        style={{ display: 'none' }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 60 60" fill="none">
          {/* Horned helmet */}
          <ellipse cx="30" cy="36" rx="18" ry="14" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="18" y="28" width="24" height="14" rx="2" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Horns */}
          <path d="M12 28 Q6 18 10 10 Q14 18 18 26" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M48 28 Q54 18 50 10 Q46 18 42 26" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Eye slit */}
          <rect x="20" y="33" width="20" height="3" rx="1.5" fill="rgba(56,189,248,0.4)" />
          {/* Rune Tiwaz at bottom */}
          <text x="30" y="55" textAnchor="middle" fontSize="10" fill="#38bdf8" fontFamily="serif">ᛏ</text>
        </svg>
      </div>
    </div>
  )
}

// ── Owner avatar ───────────────────────────────────────────────
function OwnerAvatar({ size = 88 }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        border: '2px solid rgba(251,191,36,0.5)',
        boxShadow: '0 0 24px rgba(251,191,36,0.25)',
      }}
    >
      <img
        src="/owner-photo.jpg"
        alt="Oleksandr Zhdanenko"
        className="w-full h-full object-cover object-top"
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
      />
      {/* Fallback initials */}
      <div
        className="absolute inset-0 items-center justify-center text-2xl font-bold"
        style={{
          display: 'none',
          background: 'linear-gradient(135deg, #92400e, #b45309)',
          color: '#fbbf24',
        }}
      >
        ОЖ
      </div>
    </div>
  )
}

// ── Address display ────────────────────────────────────────────
const ADDR = '0x28e7c8958f654222cdf427e23419cb95c84ae0e7'
const ADDR_URL = `https://www.bitbon.space/ua/services/providing/${ADDR}`

function AddressRow() {
  const [copied, setCopied] = useState(false)
  const short = `${ADDR.slice(0, 6)}...${ADDR.slice(-6)}`

  const copy = async () => {
    await navigator.clipboard.writeText(ADDR).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3 py-2"
      style={{
        background: 'rgba(56,189,248,0.06)',
        border: '1px solid rgba(56,189,248,0.18)',
      }}
    >
      {/* Clickable address link */}
      <a
        href={ADDR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-[11px] font-mono transition-opacity hover:opacity-70"
        style={{ color: '#38bdf8', wordBreak: 'break-all' }}
        title="Открыть в Bitbon System"
      >
        <span className="hidden sm:inline">{ADDR}</span>
        <span className="sm:hidden">{short}</span>
      </a>

      {/* Copy button */}
      <button
        onClick={copy}
        className="flex-shrink-0 p-1 rounded-lg transition-all duration-150"
        style={{
          background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.08)'}`,
        }}
        title="Копировать адрес"
      >
        {copied ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#34d399" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.637c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
        )}
      </button>

      {/* External link icon */}
      <a
        href={ADDR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 p-1 rounded-lg transition-all duration-150 hover:opacity-70"
        style={{
          background: 'rgba(56,189,248,0.08)',
          border: '1px solid rgba(56,189,248,0.2)',
        }}
        title="Открыть в Bitbon System"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#38bdf8" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
    </div>
  )
}

// ── Genesis S mini card ────────────────────────────────────────
function GenesisSBadge() {
  return (
    <div
      className="rounded-xl px-3 py-2.5 flex items-center gap-3"
      style={{
        background: 'linear-gradient(135deg, rgba(146,163,184,0.1) 0%, rgba(20,28,40,0.8) 100%)',
        border: '1px solid rgba(148,163,184,0.3)',
        boxShadow: '0 0 12px rgba(148,163,184,0.1)',
      }}
    >
      {/* Propeller icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
        style={{
          background: 'rgba(148,163,184,0.1)',
          border: '1px solid rgba(148,163,184,0.3)',
          color: '#94a3b8',
        }}
      >
        ᛏ
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p
            className="text-[9px] font-black tracking-[0.15em] uppercase"
            style={{ color: '#cbd5e1', fontFamily: 'monospace' }}
          >
            GENESIS
          </p>
          <span
            className="text-[8px] font-bold px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(148,163,184,0.15)',
              border: '1px solid rgba(148,163,184,0.35)',
              color: '#94a3b8',
            }}
          >
            Class S
          </span>
        </div>
        <p className="text-[9px] font-semibold text-white/80 leading-tight mt-0.5">
          Візіонер реалізації стартапа
        </p>
        <p className="text-[8px] text-zinc-600 leading-snug mt-0.5 italic">
          Побачив архітектуру майбутнього, коли інші ще не здогадувалися про неї
        </p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function AssetboxCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* ── LEFT: Assetbox / Wallet (Bitbon company blue tones) ── */}
      <div
        className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #060d1f 0%, #0a1628 60%, #0d1f3c 100%)',
          border: '1px solid rgba(56,189,248,0.25)',
          boxShadow: '0 0 40px rgba(56,189,248,0.08), inset 0 0 40px rgba(56,189,248,0.03)',
        }}
      >
        {/* Grid circuit bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Top ambient glow */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 pointer-events-none rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%)' }}
        />

        {/* Header: emblem + title */}
        <div className="relative flex items-center gap-3">
          <VikingEmblem size={72} />
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.25em] font-semibold"
              style={{ color: 'rgba(56,189,248,0.6)' }}
            >
              Bitbon System · Assetbox
            </p>
            <p className="text-white font-bold text-lg mt-0.5 leading-tight">
              Digital Viking Wallet
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#34d399', boxShadow: '0 0 6px #34d399' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="text-[10px] font-semibold" style={{ color: '#34d399' }}>
                Активний · Providing
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="relative flex flex-col gap-1.5">
          <p className="text-[9px] uppercase tracking-widest text-zinc-600">Адреса кошелька</p>
          <AddressRow />
        </div>

        {/* Providing info */}
        <div
          className="relative flex items-center justify-between rounded-xl px-3 py-2.5"
          style={{
            background: 'rgba(56,189,248,0.05)',
            border: '1px solid rgba(56,189,248,0.12)',
          }}
        >
          <div>
            <p className="text-[9px] uppercase tracking-widest text-zinc-600">Участвує в Providing</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: '#38bdf8' }}>з 15 липня 2020</p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(52,211,153,0.12)',
                border: '1px solid rgba(52,211,153,0.3)',
                color: '#34d399',
              }}
            >
              Активний
            </span>
            <span className="text-[8px] text-zinc-700 font-mono">
              {Math.floor((Date.now() - new Date('2020-07-15')) / (1000 * 60 * 60 * 24 * 365.25))} роки
            </span>
          </div>
        </div>

        {/* Bottom Bitbon branding line */}
        <div className="relative flex items-center gap-2 -mt-1">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(56,189,248,0.3), transparent)' }} />
          <span className="text-[8px] tracking-[0.2em] uppercase" style={{ color: 'rgba(56,189,248,0.35)' }}>
            bitbon.space
          </span>
        </div>
      </div>

      {/* ── RIGHT: Owner card (warm yellow/amber tones) ── */}
      <div
        className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0f00 0%, #231400 50%, #1c1000 100%)',
          border: '1px solid rgba(251,191,36,0.2)',
          boxShadow: '0 0 40px rgba(251,191,36,0.06), inset 0 0 40px rgba(251,191,36,0.02)',
        }}
      >
        {/* Warm ambient glow */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 pointer-events-none rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.1) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-32 h-32 pointer-events-none rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)' }}
        />

        {/* Header: photo + name */}
        <div className="relative flex items-start gap-3">
          <OwnerAvatar size={80} />

          <div className="flex-1 min-w-0 pt-1">
            <p
              className="text-[10px] uppercase tracking-[0.2em] font-semibold"
              style={{ color: 'rgba(251,191,36,0.5)' }}
            >
              Власник гаманця
            </p>
            <p className="text-white font-bold text-base mt-0.5 leading-tight">
              Oleksandr
            </p>
            <p className="font-bold text-base leading-tight" style={{ color: '#fbbf24' }}>
              Zhdanenko
            </p>

            {/* Role */}
            <div
              className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded-lg"
              style={{
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.2)',
              }}
            >
              <span className="text-sm leading-none">ᚹ</span>
              <span className="text-[10px] font-semibold" style={{ color: '#fbbf24' }}>
                Провайдер
              </span>
            </div>
          </div>
        </div>

        {/* Genesis S certificate block */}
        <div className="relative flex flex-col gap-1.5">
          <p className="text-[9px] uppercase tracking-widest text-zinc-600">Сертифікат Genesis</p>
          <GenesisSBadge />
        </div>

        {/* Personal Brand WEB4 button */}
        <a
          href="https://www.bitbon.space/ua/services/providing/0x28e7c8958f654222cdf427e23419cb95c84ae0e7"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-between gap-3 rounded-xl px-4 py-3 mt-auto group transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, rgba(26,109,255,0.15), rgba(0,200,255,0.08))',
            border: '1px solid rgba(0,200,255,0.35)',
            boxShadow: '0 0 20px rgba(0,200,255,0.1)',
          }}
        >
          {/* Left: icon + label */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{
                background: 'rgba(0,200,255,0.12)',
                border: '1px solid rgba(0,200,255,0.3)',
                color: '#00c8ff',
              }}
            >
              ᛒ
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: 'rgba(0,200,255,0.6)' }}>
                Bitbon System
              </p>
              <p className="text-sm font-bold text-white leading-tight">
                Особистий Бренд <span style={{ color: '#00c8ff' }}>WEB4</span>
              </p>
            </div>
          </div>

          {/* Right: arrow */}
          <svg
            className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none" viewBox="0 0 24 24" stroke="#00c8ff" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>

        {/* Bottom warm divider */}
        <div className="relative flex items-center gap-2 -mt-1">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(251,191,36,0.3), transparent)' }} />
          <span className="text-[8px] tracking-[0.2em] uppercase" style={{ color: 'rgba(251,191,36,0.3)' }}>
            Digital Viking
          </span>
        </div>
      </div>
    </motion.div>
  )
}
