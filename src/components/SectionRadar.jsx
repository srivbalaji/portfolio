import { useState, useMemo } from 'react'
import { navLinks } from '../data/resume'
import { useRadarSweep, SWEEP_DURATION_S, BLIP_RING_FACTORS } from '../hooks/useRadarSweep'

const SIZE = 132
const CX = SIZE / 2
const CY = SIZE / 2
const RING_R = SIZE / 2 - 18

const COLORS = {
  frameLight: '#9aa3ad',
  frameMid: '#6a737d',
  frameDark: '#3d454d',
  frameEdge: '#2a3038',
  grid: 'rgba(61, 232, 255, 0.12)',
  sweep: 'rgba(107, 255, 184, 0.85)',
  active: '#ff4d6a',
  darkFill: '#1a2838',
  scanFill: '#5cff9b',
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function mixColor(c1, c2, t) {
  const a = hexToRgb(c1)
  const b = hexToRgb(c2)
  return `rgb(${Math.round(lerp(a.r, b.r, t))},${Math.round(lerp(a.g, b.g, t))},${Math.round(lerp(a.b, b.b, t))})`
}

function blipPosition(index, total) {
  const angleDeg = (360 / total) * index - 90
  const angleRad = (angleDeg * Math.PI) / 180
  const ringFactor = BLIP_RING_FACTORS[index % BLIP_RING_FACTORS.length]
  const r = RING_R * ringFactor
  return {
    x: CX + r * Math.cos(angleRad),
    y: CY + r * Math.sin(angleRad),
  }
}

function RadarBlip({ x, y, isActive, intensity, isHovered, onEnter, onLeave, onClick }) {
  const t = Math.max(0, Math.min(1, intensity))
  const lit = isActive || isHovered || t > 0.08

  if (isActive) {
    return (
      <g
        className="cursor-pointer"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      >
        <circle cx={x} cy={y} r={14} fill="none" stroke={COLORS.active} strokeWidth="1" opacity="0.55">
          <animate attributeName="r" values="10;18;10" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <rect x={x - 5} y={y - 5} width={10} height={10} fill={COLORS.active} stroke="#ff8fa3" strokeWidth="1.5" />
      </g>
    )
  }

  const fill = mixColor(COLORS.darkFill, COLORS.scanFill, t)
  const stroke = t > 0.05 ? COLORS.scanFill : 'rgba(61,232,255,0.25)'
  const size = lerp(4, 7, t)

  return (
    <g
      className="cursor-pointer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      {t > 0.04 && (
        <circle
          cx={x}
          cy={y}
          r={lerp(8, 16, t)}
          fill="none"
          stroke={`rgba(92,255,155,${t * 0.45})`}
          strokeWidth={lerp(0.4, 1.2, t)}
        />
      )}
      <rect
        x={x - size}
        y={y - size}
        width={size * 2}
        height={size * 2}
        fill={isHovered ? COLORS.scanFill : fill}
        opacity={lit ? 0.85 + t * 0.15 : 0.35}
        stroke={stroke}
        strokeWidth={isHovered ? 1.2 : 0.7}
        style={{
          filter: t > 0.05 ? `drop-shadow(0 0 ${lerp(2, 10, t)}px rgba(92,255,155,${t * 0.7}))` : 'none',
        }}
      />
    </g>
  )
}

function SquareRadarSvg({ active, onNavigate, hovered, setHovered }) {
  const { getIntensity } = useRadarSweep(24, 3200)
  const total = navLinks.length
  const gradId = useMemo(() => `radar-sweep-${Math.random().toString(36).slice(2, 8)}`, [])
  const frameId = useMemo(() => `radar-frame-${Math.random().toString(36).slice(2, 8)}`, [])
  const bevelId = useMemo(() => `radar-bevel-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full select-none">
      <defs>
        <linearGradient id={frameId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.frameLight} />
          <stop offset="45%" stopColor={COLORS.frameMid} />
          <stop offset="100%" stopColor={COLORS.frameDark} />
        </linearGradient>
        <linearGradient id={bevelId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
        </linearGradient>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(107, 255, 184, 0)" />
          <stop offset="100%" stopColor="rgba(107, 255, 184, 0.55)" />
        </linearGradient>
        <filter id="radar-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* metallic outer frame */}
      <rect
        x={4}
        y={4}
        width={SIZE - 8}
        height={SIZE - 8}
        rx={2}
        fill={`url(#${frameId})`}
        stroke={`url(#${frameId})`}
        strokeWidth={3}
        filter="url(#radar-shadow)"
      />
      <rect
        x={4}
        y={4}
        width={SIZE - 8}
        height={SIZE - 8}
        rx={2}
        fill={`url(#${bevelId})`}
        stroke={COLORS.frameEdge}
        strokeWidth={0.75}
        opacity={0.85}
      />

      <rect x={10} y={10} width={SIZE - 20} height={SIZE - 20} fill="rgba(6,10,18,0.88)" stroke={COLORS.frameEdge} strokeWidth="0.5" rx={1} />

      {[0.35, 0.58, 0.82, 1].map((scale) => (
        <circle
          key={scale}
          cx={CX}
          cy={CY}
          r={RING_R * scale}
          fill="none"
          stroke={COLORS.grid}
          strokeWidth="0.6"
        />
      ))}

      <line x1={CX} y1={CY - RING_R} x2={CX} y2={CY + RING_R} stroke="rgba(61,232,255,0.08)" strokeWidth="0.5" />
      <line x1={CX - RING_R} y1={CY} x2={CX + RING_R} y2={CY} stroke="rgba(61,232,255,0.08)" strokeWidth="0.5" />

      <g className="radar-sweep-group">
        <path
          d={`M ${CX} ${CY} L ${CX} ${CY - RING_R} A ${RING_R} ${RING_R} 0 0 1 ${CX + RING_R * 0.08} ${CY - RING_R * 0.997} Z`}
          fill={`url(#${gradId})`}
          opacity="0.65"
        />
        <line x1={CX} y1={CY} x2={CX} y2={CY - RING_R} stroke={COLORS.sweep} strokeWidth="1.5" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${CX} ${CY}`}
          to={`360 ${CX} ${CY}`}
          dur={`${SWEEP_DURATION_S}s`}
          repeatCount="indefinite"
        />
      </g>

      {navLinks.map((link, i) => {
        const { x, y } = blipPosition(i, total)
        const isActive = active === link.id
        const intensity = getIntensity(i, total)
        const isHovered = hovered === link.id

        return (
          <g key={link.id} aria-label={`Navigate to ${link.label}`} aria-current={isActive ? 'true' : undefined}>
            <rect x={x - 14} y={y - 14} width={28} height={28} fill="transparent" />
            <RadarBlip
              x={x}
              y={y}
              isActive={isActive}
              intensity={intensity}
              isHovered={isHovered}
              onEnter={() => setHovered(link.id)}
              onLeave={() => setHovered(null)}
              onClick={() => onNavigate?.(link.id)}
            />
          </g>
        )
      })}

      <rect x={CX - 2} y={CY - 2} width={4} height={4} fill="rgba(61,232,255,0.55)" />
    </svg>
  )
}

export default function SectionRadar({ active, onNavigate }) {
  const [hovered, setHovered] = useState(null)
  const activeMeta = navLinks.find((l) => l.id === active)
  const hoverMeta = navLinks.find((l) => l.id === hovered)
  const labelText = hoverMeta?.label ?? activeMeta?.label ?? 'Home'

  return (
    <div
      className="section-radar fixed z-40 top-[max(3rem,env(safe-area-inset-top))] right-2 sm:right-3 md:right-5 w-[88px] h-[88px] sm:w-[108px] sm:h-[108px] md:w-[132px] md:h-[132px] pointer-events-auto"
      aria-label="Section navigation radar"
    >
      <SquareRadarSvg active={active} onNavigate={onNavigate} hovered={hovered} setHovered={setHovered} />
      <p
        className={`absolute -bottom-4 sm:-bottom-5 left-0 right-0 text-center font-mono text-[7px] sm:text-[8px] md:text-[9px] tracking-widest uppercase truncate px-1 transition-colors ${
          hovered ? 'text-cyan' : 'text-cyan/50'
        }`}
      >
        {labelText}
      </p>
    </div>
  )
}
