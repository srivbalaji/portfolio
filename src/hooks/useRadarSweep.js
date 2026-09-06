import { useEffect, useRef, useState, useCallback } from 'react'

/** Sweep period (seconds) — visual + lighting share this clock */
export const SWEEP_DURATION_S = 6.5
const SWEEP_DURATION_MS = SWEEP_DURATION_S * 1000

/** Per-node ring distance (mixed radii) — nav blips */
export const BLIP_RING_FACTORS = [0.42, 0.88, 0.58, 0.75, 0.5, 0.82, 0.68]

/** Trail wedge behind the leading edge (degrees) — lightsaber afterimage */
export const SWEEP_TRAIL_DEG = 72

export function blipSweepAngle(index, total) {
  return (360 / total) * index
}

/**
 * How far behind the leading edge a blip sits (clockwise sweep).
 * 0 = on the beam, positive = already swept (trail), >180 = still ahead.
 */
function degreesBehind(sweepAngle, blipAngle) {
  return (sweepAngle - blipAngle + 360) % 360
}

/**
 * SVG pie-wedge path: tip at top, trail CW behind a clockwise-rotating beam.
 * (Beam advances toward 3 o'clock; afterimage stays toward 9→12.)
 */
export function sweepTrailPath(cx, cy, r, trailDeg = SWEEP_TRAIL_DEG) {
  const rad = (trailDeg * Math.PI) / 180
  // Behind a clockwise sweep = counterclockwise from the tip
  const a1 = -Math.PI / 2 - rad
  const x1 = cx + r * Math.cos(a1)
  const y1 = cy + r * Math.sin(a1)
  return `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`
}

/**
 * Shared clock: updates SVG sweep transform + blip trail intensities each frame.
 * Pass sweepGroupRef so SMIL isn't used (no drift between beam and lights).
 */
export function useRadarSweep({
  blipCount = 6,
  trailDeg = SWEEP_TRAIL_DEG,
  fadeDurationMs = 1600,
  sweepGroupRef = null,
  cx = 0,
  cy = 0,
} = {}) {
  const [intensities, setIntensities] = useState(() => Array.from({ length: blipCount }, () => 0))
  const sweepRef = useRef(0)
  const intensitiesRef = useRef(intensities)
  const lastTimeRef = useRef(performance.now())

  useEffect(() => {
    intensitiesRef.current = intensities
  }, [intensities])

  useEffect(() => {
    const zeros = Array.from({ length: blipCount }, () => 0)
    setIntensities(zeros)
    intensitiesRef.current = zeros
  }, [blipCount])

  useEffect(() => {
    const start = performance.now()
    let frameId

    const tick = (now) => {
      const dt = Math.min(now - lastTimeRef.current, 50)
      lastTimeRef.current = now

      const elapsed = (now - start) % SWEEP_DURATION_MS
      const angle = (elapsed / SWEEP_DURATION_MS) * 360
      sweepRef.current = angle

      const group = sweepGroupRef?.current
      if (group) {
        group.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`)
      }

      const decay = dt / fadeDurationMs
      const next = [...intensitiesRef.current]
      while (next.length < blipCount) next.push(0)
      if (next.length > blipCount) next.length = blipCount

      for (let i = 0; i < next.length; i++) {
        const behind = degreesBehind(angle, blipSweepAngle(i, next.length))
        // Only illuminate in the trail behind the beam — never ahead of it
        if (behind > 0 && behind <= trailDeg) {
          // Brightest just behind the tip, softer deeper in the trail
          next[i] = Math.max(next[i], 1 - behind / trailDeg * 0.35)
        } else {
          next[i] = Math.max(0, next[i] - decay)
        }
      }

      intensitiesRef.current = next
      setIntensities(next)

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [blipCount, trailDeg, fadeDurationMs, sweepGroupRef, cx, cy])

  const getIntensity = useCallback(
    (index) => {
      if (index >= intensities.length) return 0
      return intensities[index] ?? 0
    },
    [intensities]
  )

  return { getIntensity, sweepAngle: sweepRef.current }
}
