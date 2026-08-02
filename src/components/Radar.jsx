import { useMemo } from 'react'
import { navLinks } from '../data/resume'
import { useRadarSweep, SWEEP_DURATION_S, BLIP_RING_FACTORS } from '../hooks/useRadarSweep'

const SIZE = 340
const CX = SIZE / 2
const CY = SIZE / 2
const RING_R = SIZE / 2 - 28

const COLORS = {
  darkFill: '#1a4d32',
  darkStroke: '#2d6b48',
  scanFill: '#5cff9b',
  scanStroke: '#b8ffd4',
  activeFill: '#ff4d6a',
  activeStroke: '#ff8fa3',
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
  const r = Math.round(lerp(a.r, b.r, t))
  const g = Math.round(lerp(a.g, b.g, t))
  const bVal = Math.round(lerp(a.b, b.b, t))
  return `rgb(${r},${g},${bVal})`
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

function BlipVisual({ x, y, isActive, intensity, label }) {
  const t = Math.max(0, Math.min(1, intensity))

  if (isActive) {
    return (
      <>
        <circle cx={x} cy={y} r={16} fill="none" stroke={COLORS.activeFill} strokeWidth="1" opacity="0.6">
          <animate attributeName="r" values="12;20;12" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle
          cx={x}
          cy={y}
          r={9}
          fill={COLORS.activeFill}
          stroke={COLORS.activeStroke}
          strokeWidth={2.5}
          style={{ filter: 'drop-shadow(0 0 10px rgba(255, 77, 106, 0.9))' }}
        />
        <text
          x={x}
          y={y + 24}
          textAnchor="middle"
          className="radar-blip-label pointer-events-none"
          fill="rgba(255, 143, 163, 0.9)"
          fontSize="10"
          fontFamily="Rajdhani, sans-serif"
          letterSpacing="0.12em"
        >
          {label}
        </text>
      </>
    )
  }

  const fill = mixColor(COLORS.darkFill, COLORS.scanFill, t)
  const stroke = mixColor(COLORS.darkStroke, COLORS.scanStroke, t)
  const radius = lerp(6, 9, t)
  const glowOpacity = t * 0.85
  const labelOpacity = lerp(0.45, 0.95, t)

  return (
    <>
      {t > 0.05 && (
        <circle
          cx={x}
          cy={y}
          r={lerp(10, 20, t)}
          fill="none"
          stroke={`rgba(92, 255, 155, ${glowOpacity * 0.5})`}
          strokeWidth={lerp(0.5, 2, t)}
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={lerp(1.5, 2.5, t)}
        style={{
          filter: t > 0.05 ? `drop-shadow(0 0 ${lerp(2, 14, t)}px rgba(92, 255, 155, ${glowOpacity}))` : 'none',
        }}
      />
      <text
        x={x}
        y={y + 24}
        textAnchor="middle"
        className="radar-blip-label pointer-events-none"
        fill={`rgba(${lerp(45, 184, t)}, ${lerp(107, 255, t)}, ${lerp(72, 210, t)}, ${labelOpacity})`}
        fontSize="10"
        fontFamily="Rajdhani, sans-serif"
        letterSpacing="0.12em"
      >
        {label}
      </text>
    </>
  )
}

function RadarSvg({ active, onNavigate }) {
  const { getIntensity } = useRadarSweep(22, 3000)
  const total = navLinks.length

  const handleBlipClick = (id) => (e) => {
    e.stopPropagation()
    onNavigate?.(id)
  }

  const gradId = useMemo(() => `sweepGrad-${Math.random().toString(36).slice(2, 9)}`, [])

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full h-full select-none"
      style={{ filter: 'drop-shadow(0 0 24px rgba(61, 232, 255, 0.2))' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(107, 255, 184, 0)" />
          <stop offset="100%" stopColor="rgba(107, 255, 184, 0.5)" />
        </linearGradient>
      </defs>

      {[0.35, 0.55, 0.72, 0.9].map((scale) => (
        <circle
          key={scale}
          cx={CX}
          cy={CY}
          r={RING_R * scale}
          fill="none"
          stroke="rgba(61, 232, 255, 0.15)"
          strokeWidth="1"
        />
      ))}

      <line x1={CX} y1={CY - RING_R} x2={CX} y2={CY + RING_R} stroke="rgba(61,232,255,0.1)" strokeWidth="1" />
      <line x1={CX - RING_R} y1={CY} x2={CX + RING_R} y2={CY} stroke="rgba(61,232,255,0.1)" strokeWidth="1" />

      <g className="radar-sweep-group">
        <path
          d={`M ${CX} ${CY} L ${CX} ${CY - RING_R} A ${RING_R} ${RING_R} 0 0 1 ${CX + RING_R * 0.12} ${CY - RING_R * 0.99} Z`}
          fill={`url(#${gradId})`}
          opacity="0.7"
        />
        <line x1={CX} y1={CY} x2={CX} y2={CY - RING_R} stroke="rgba(92, 255, 155, 0.75)" strokeWidth="2" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${CX} ${CY}`}
          to={`360 ${CX} ${CY}`}
          dur={`${SWEEP_DURATION_S}s`}
          repeatCount="indefinite"
        />
      </g>

      <g opacity="0.25">
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i * 10 * Math.PI) / 180
          const x1 = CX + (RING_R - 4) * Math.cos(a - Math.PI / 2)
          const y1 = CY + (RING_R - 4) * Math.sin(a - Math.PI / 2)
          const x2 = CX + RING_R * Math.cos(a - Math.PI / 2)
          const y2 = CY + RING_R * Math.sin(a - Math.PI / 2)
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(61,232,255,0.5)" strokeWidth="1" />
          )
        })}
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${CX} ${CY}`}
          to={`360 ${CX} ${CY}`}
          dur="60s"
          repeatCount="indefinite"
        />
      </g>

      <circle cx={CX} cy={CY} r={RING_R} fill="none" stroke="rgba(61, 232, 255, 0.25)" strokeWidth="1.5" />

      {navLinks.map((link, i) => {
        const { x, y } = blipPosition(i, total)
        const isActive = active === link.id
        const intensity = getIntensity(i, total)

        return (
          <g
            key={link.id}
            className="radar-blip cursor-pointer"
            onClick={handleBlipClick(link.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onNavigate?.(link.id)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${link.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <circle cx={x} cy={y} r={22} fill="transparent" />
            <BlipVisual x={x} y={y} isActive={isActive} intensity={intensity} label={link.label} />
          </g>
        )
      })}

      <circle cx={CX} cy={CY} r={5} fill="rgba(61, 232, 255, 0.5)" />
    </svg>
  )
}

export function RadarFixed({ active, onNavigate, visible }) {
  if (!visible) return null

  return (
    <div
      className="radar-wrap fixed z-[35] pointer-events-auto
        right-2 bottom-28 w-[200px] h-[200px]
        md:right-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-[300px] md:h-[300px]
        opacity-40 md:opacity-50 transition-opacity hover:opacity-70"
      aria-label="Section navigation radar"
    >
      <RadarSvg active={active} onNavigate={onNavigate} />
    </div>
  )
}

export default function HeroRadar({ active, onNavigate }) {
  return (
    <div
      className="radar-wrap pointer-events-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] mx-auto lg:mx-0 opacity-90 hover:opacity-100 transition-opacity"
      aria-label="Home navigation radar — click a blip to jump to a section"
    >
      <p className="hud-text text-center mb-3 text-cyan/60">TACTICAL NAV — SELECT SECTOR</p>
      <RadarSvg active={active} onNavigate={onNavigate} />
    </div>
  )
}
