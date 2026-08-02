import { useEffect, useRef } from 'react'

/** Periphery-only hyperspace streaks — center stays clear (tunnel vision) */
const INNER_HOLE = 0.36

export default function WarpStreaks({ active = true }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return undefined

    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let cx = 0
    let cy = 0

    const blueStreaks = Array.from({ length: 100 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: INNER_HOLE + Math.random() * 0.2,
      speed: 0.014 + Math.random() * 0.028,
      len: 0.05 + Math.random() * 0.14,
      width: 0.7 + Math.random() * 2,
      hue: 185 + Math.random() * 35,
      alpha: 0.3 + Math.random() * 0.45,
    }))

    const redStreaks = Array.from({ length: 22 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: INNER_HOLE + Math.random() * 0.18,
      speed: 0.01 + Math.random() * 0.02,
      len: 0.07 + Math.random() * 0.16,
      width: 1 + Math.random() * 2,
      alpha: 0.12 + Math.random() * 0.28,
    }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = w / 2
      cy = h / 2
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      const maxR = Math.hypot(cx, cy) * 1.15
      const innerR = maxR * INNER_HOLE

      const drawStreak = (s, crimson = false) => {
        s.dist += s.speed
        if (s.dist > 1.05) {
          s.dist = INNER_HOLE + Math.random() * 0.08
          s.angle = Math.random() * Math.PI * 2
        }

        const r0 = s.dist * maxR
        if (r0 < innerR) return

        const r1 = r0 + s.len * maxR
        const x0 = cx + Math.cos(s.angle) * r0
        const y0 = cy + Math.sin(s.angle) * r0
        const x1 = cx + Math.cos(s.angle) * r1
        const y1 = cy + Math.sin(s.angle) * r1

        const grad = ctx.createLinearGradient(x0, y0, x1, y1)
        if (crimson) {
          grad.addColorStop(0, 'rgba(196, 30, 58, 0)')
          grad.addColorStop(0.45, `rgba(255, 80, 100, ${s.alpha})`)
          grad.addColorStop(1, `rgba(255, 140, 160, ${s.alpha + 0.15})`)
        } else {
          grad.addColorStop(0, `hsla(${s.hue}, 100%, 72%, 0)`)
          grad.addColorStop(0.35, `hsla(${s.hue}, 100%, 78%, ${s.alpha})`)
          grad.addColorStop(1, `hsla(${s.hue}, 100%, 92%, ${Math.min(1, s.alpha + 0.2)})`)
        }

        ctx.strokeStyle = grad
        ctx.lineWidth = s.width
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }

      blueStreaks.forEach((s) => drawStreak(s))
      redStreaks.forEach((s) => drawStreak(s, true))

      /* static peripheral glow — center permanently clear */
      const edgeGlow = ctx.createRadialGradient(cx, cy, innerR * 0.95, cx, cy, maxR)
      edgeGlow.addColorStop(0, 'rgba(0, 0, 0, 0)')
      edgeGlow.addColorStop(0.35, 'rgba(61, 232, 255, 0.04)')
      edgeGlow.addColorStop(0.7, 'rgba(61, 232, 255, 0.1)')
      edgeGlow.addColorStop(1, 'rgba(120, 180, 255, 0.16)')
      ctx.fillStyle = edgeGlow
      ctx.fillRect(0, 0, w, h)

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[5] mix-blend-screen"
      aria-hidden
    />
  )
}
