import { useEffect, useState } from 'react'

/** Must match SVG animateTransform dur on the sweep (seconds) */
export const SWEEP_DURATION_S = 10
const SWEEP_DURATION_MS = SWEEP_DURATION_S * 1000

/** Clockwise degrees from 12 o'clock — matches blip layout */
export function blipSweepAngle(index, total) {
  return (360 / total) * index
}

function angularDistance(a, b) {
  const diff = Math.abs(((a - b + 540) % 360) - 180)
  return diff
}

export function useRadarSweep(scanThresholdDeg = 24) {
  const [sweepAngle, setSweepAngle] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let frameId

    const tick = (now) => {
      const elapsed = (now - start) % SWEEP_DURATION_MS
      setSweepAngle((elapsed / SWEEP_DURATION_MS) * 360)
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  const isScanned = (blipIndex, total) => {
    const blipAngle = blipSweepAngle(blipIndex, total)
    return angularDistance(sweepAngle, blipAngle) <= scanThresholdDeg
  }

  return { sweepAngle, isScanned }
}
