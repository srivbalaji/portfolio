import { useEffect, useRef, useState, useCallback } from 'react'

/** Must match SVG animateTransform dur on the sweep (seconds) */
export const SWEEP_DURATION_S = 10
const SWEEP_DURATION_MS = SWEEP_DURATION_S * 1000

/** Per-node ring distance (mixed radii) — same order as navLinks */
export const BLIP_RING_FACTORS = [0.42, 0.88, 0.58, 0.75, 0.5, 0.82]

export function blipSweepAngle(index, total) {
  return (360 / total) * index
}

function angularDistance(a, b) {
  return Math.abs(((a - b + 540) % 360) - 180)
}

/**
 * Real radar persistence: flash on sweep hit, then gradual fade until next pass.
 */
export function useRadarSweep(scanThresholdDeg = 22, fadeDurationMs = 2800) {
  const [intensities, setIntensities] = useState(() => navLinksLengthArray(0))
  const sweepRef = useRef(0)
  const intensitiesRef = useRef(intensities)
  const lastTimeRef = useRef(performance.now())

  useEffect(() => {
    intensitiesRef.current = intensities
  }, [intensities])

  useEffect(() => {
    const start = performance.now()
    let frameId

    const tick = (now) => {
      const dt = Math.min(now - lastTimeRef.current, 50)
      lastTimeRef.current = now

      const elapsed = (now - start) % SWEEP_DURATION_MS
      sweepRef.current = (elapsed / SWEEP_DURATION_MS) * 360

      const decay = dt / fadeDurationMs
      const next = [...intensitiesRef.current]

      for (let i = 0; i < next.length; i++) {
        const blipAngle = blipSweepAngle(i, next.length)
        if (angularDistance(sweepRef.current, blipAngle) <= scanThresholdDeg) {
          next[i] = 1
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
  }, [scanThresholdDeg, fadeDurationMs])

  const getIntensity = useCallback(
    (index, total) => {
      if (index >= intensities.length) return 0
      return intensities[index] ?? 0
    },
    [intensities]
  )

  return { getIntensity, sweepAngle: sweepRef.current }
}

function navLinksLengthArray(fill) {
  return Array.from({ length: 6 }, () => fill)
}
