import { useEffect, useRef } from 'react'

/** Star-wars-style hyperspace streaks during intro initialization */
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

    const streaks = Array.from({ length: 90 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 0.15,
      speed: 0.012 + Math.random() * 0.028,
      len: 0.04 + Math.random() * 0.14,
      width: 0.6 + Math.random() * 1.8,
      hue: 185 + Math.random() * 35,
      alpha: 0.35 + Math.random() * 0.55,
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
      ctx.fillStyle = 'rgba(5, 8, 16, 0.22)'
      ctx.fillRect(0, 0, w, h)

      const maxR = Math.hypot(cx, cy) * 1.15

      streaks.forEach((s) => {
        s.dist += s.speed
        if (s.dist > 1.05) {
          s.dist = Math.random() * 0.08
          s.angle = Math.random() * Math.PI * 2
          s.speed = 0.012 + Math.random() * 0.028
        }

        const r0 = s.dist * maxR
        const r1 = r0 + s.len * maxR
        const x0 = cx + Math.cos(s.angle) * r0
        const y0 = cy + Math.sin(s.angle) * r0
        const x1 = cx + Math.cos(s.angle) * r1
        const y1 = cy + Math.sin(s.angle) * r1

        const grad = ctx.createLinearGradient(x0, y0, x1, y1)
        grad.addColorStop(0, `hsla(${s.hue}, 100%, 72%, 0)`)
        grad.addColorStop(0.35, `hsla(${s.hue}, 100%, 78%, ${s.alpha})`)
        grad.addColorStop(1, `hsla(${s.hue}, 100%, 92%, ${Math.min(1, s.alpha + 0.25)})`)

        ctx.strokeStyle = grad
        ctx.lineWidth = s.width
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      })

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
