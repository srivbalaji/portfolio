import { useState, useMemo, useRef } from 'react'
import { navLinks } from '../data/resume'
import {
  useRadarSweep,
  BLIP_RING_FACTORS,
  sweepTrailPath,
  SWEEP_TRAIL_DEG,
} from '../hooks/useRadarSweep'

const SIZE = 132
const CX = SIZE / 2
const CY = SIZE / 2
const RING_R = SIZE / 2 - 18

const COMBAT_BLIP = { id: 'combat', label: 'Combat Sim', combat: true }

const COLORS = {
  frameLight: '#9aa3ad',
  frameMid: '#6a737d',
  frameDark: '#3d454d',
  frameEdge: '#2a3038',
  grid: 'rgba(61, 232, 255, 0.12)',
  sweep: 'rgba(107, 255, 184, 0.85)',
  active: '#ff4d6a',
  combat: '#f59e0b',
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

function RadarBlip({ x, y, isActive, intensity, isHovered, combat, onEnter, onLeave, onClick }) {
  const t = Math.max(0, Math.min(1, intensity))
  const lit = isActive || isHovered || t > 0.08
  const accent = combat ? COLORS.combat : COLORS.active
  const scan = combat ? COLORS.combat : COLORS.scanFill

  if (isActive && !combat) {
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
        <circle cx={x} cy={y} r={14} fill="none" stroke={accent} strokeWidth="1" opacity="0.55">
          <animate attributeName="r" values="10;18;10" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <rect x={x - 5} y={y - 5} width={10} height={10} fill={accent} stroke="#ff8fa3" strokeWidth="1.5" />
      </g>
    )
  }

  if (combat) {
    const size = lerp(5, 7.5, t)
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
        {(t > 0.04 || isHovered) && (
          <circle
            cx={x}
            cy={y}
            r={lerp(9, 17, Math.max(t, isHovered ? 0.6 : 0))}
            fill="none"
            stroke={`rgba(245,158,11,${0.25 + t * 0.45})`}
            strokeWidth={lerp(0.5, 1.3, t)}
          />
        )}
        {/* Diamond — distinct from section squares */}
        <polygon
          points={`${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`}
          fill={isHovered ? COLORS.combat : mixColor(COLORS.darkFill, COLORS.combat, Math.max(t, 0.35))}
          opacity={lit ? 0.9 + t * 0.1 : 0.55}
          stroke={COLORS.combat}
          strokeWidth={isHovered ? 1.4 : 0.9}
          style={{
            filter: t > 0.05 || isHovered ? `drop-shadow(0 0 ${lerp(2, 10, t)}px rgba(245,158,11,0.75))` : 'none',
          }}
        />
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
        fill={isHovered ? scan : fill}
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

function SquareRadarSvg({ active, onNavigate, onOpenMinigame, blips, hovered, setHovered }) {
  const sweepGroupRef = useRef(null)
  const { getIntensity } = useRadarSweep({
    blipCount: blips.length,
    trailDeg: SWEEP_TRAIL_DEG,
    fadeDurationMs: 1400,
    sweepGroupRef,
    cx: CX,
    cy: CY,
  })
  const total = blips.length
  const trailId = useMemo(() => `radar-trail-${Math.random().toString(36).slice(2, 8)}`, [])
  const coreId = useMemo(() => `radar-core-${Math.random().toString(36).slice(2, 8)}`, [])
  const frameId = useMemo(() => `radar-frame-${Math.random().toString(36).slice(2, 8)}`, [])
  const bevelId = useMemo(() => `radar-bevel-${Math.random().toString(36).slice(2, 8)}`, [])
  const trailPath = useMemo(() => sweepTrailPath(CX, CY, RING_R, SWEEP_TRAIL_DEG), [])
  const corePath = useMemo(() => sweepTrailPath(CX, CY, RING_R, 18), [])
  const trailEnd = useMemo(() => {
    const rad = (SWEEP_TRAIL_DEG * Math.PI) / 180
    const a1 = -Math.PI / 2 - rad
    return { x: CX + RING_R * Math.cos(a1), y: CY + RING_R * Math.sin(a1) }
  }, [])

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
        <linearGradient
          id={trailId}
          gradientUnits="userSpaceOnUse"
          x1={CX}
          y1={CY - RING_R}
          x2={trailEnd.x}
          y2={trailEnd.y}
        >
          <stop offset="0%" stopColor="rgba(107, 255, 184, 0.72)" />
          <stop offset="35%" stopColor="rgba(92, 255, 155, 0.28)" />
          <stop offset="100%" stopColor="rgba(107, 255, 184, 0)" />
        </linearGradient>
        <linearGradient id={coreId} gradientUnits="userSpaceOnUse" x1={CX} y1={CY - RING_R} x2={CX - 8} y2={CY - RING_R + 14}>
          <stop offset="0%" stopColor="rgba(180, 255, 210, 0.95)" />
          <stop offset="100%" stopColor="rgba(107, 255, 184, 0.15)" />
        </linearGradient>
        <filter id="radar-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
        </filter>
        <filter id="saber-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

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

      {/* Beam + trail driven by the same RAF clock as blip lighting */}
      <g ref={sweepGroupRef} className="radar-sweep-group">
        <path d={trailPath} fill={`url(#${trailId})`} opacity="0.9" />
        <path d={corePath} fill={`url(#${coreId})`} opacity="0.85" />
        <line
          x1={CX}
          y1={CY}
          x2={CX}
          y2={CY - RING_R}
          stroke={COLORS.sweep}
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#saber-glow)"
        />
      </g>

      {blips.map((link, i) => {
        const { x, y } = blipPosition(i, total)
        const isActive = !link.combat && active === link.id
        const intensity = getIntensity(i)
        const isHovered = hovered === link.id

        return (
          <g
            key={link.id}
            aria-label={link.combat ? 'Open combat simulator' : `Navigate to ${link.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <rect x={x - 14} y={y - 14} width={28} height={28} fill="transparent" />
            <RadarBlip
              x={x}
              y={y}
              isActive={isActive}
              intensity={intensity}
              isHovered={isHovered}
              combat={!!link.combat}
              onEnter={() => setHovered(link.id)}
              onLeave={() => setHovered(null)}
              onClick={() => {
                if (link.combat) onOpenMinigame?.()
                else onNavigate?.(link.id)
              }}
            />
          </g>
        )
      })}

      <rect x={CX - 2} y={CY - 2} width={4} height={4} fill="rgba(61,232,255,0.55)" />
    </svg>
  )
}

export default function SectionRadar({ active, onNavigate, onOpenMinigame, dock = false }) {
  const [hovered, setHovered] = useState(null)
  const blips = useMemo(() => {
    if (onOpenMinigame) return [...navLinks, COMBAT_BLIP]
    return navLinks
  }, [onOpenMinigame])

  const activeMeta = navLinks.find((l) => l.id === active)
  const hoverMeta = blips.find((l) => l.id === hovered)
  const labelText = hoverMeta?.label ?? activeMeta?.label ?? 'Home'

  return (
    <div
      className={
        dock
          ? 'section-radar section-radar-dock absolute z-50 top-2 right-2 w-[100px] h-[104px] pointer-events-auto'
          : 'section-radar fixed z-40 hidden lg:block top-[max(3rem,env(safe-area-inset-top))] right-5 w-[132px] h-[132px] pointer-events-auto'
      }
      aria-label="Section navigation radar"
    >
      <SquareRadarSvg
        active={active}
        onNavigate={onNavigate}
        onOpenMinigame={onOpenMinigame}
        blips={blips}
        hovered={hovered}
        setHovered={setHovered}
      />
      <p
        className={`absolute -bottom-4 sm:-bottom-5 left-0 right-0 text-center font-mono text-[7px] sm:text-[8px] md:text-[9px] tracking-widest uppercase truncate px-1 transition-colors ${
          hovered === 'combat' ? 'text-amber-400' : hovered ? 'text-cyan' : 'text-cyan/50'
        }`}
      >
        {labelText}
      </p>
    </div>
  )
}
