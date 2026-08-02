import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'portfolio-mobile-mech-vh'
const DEFAULT_VH = 32
const MIN_VH = 16
const MAX_VH = 52

function clampVh(value) {
  return Math.min(MAX_VH, Math.max(MIN_VH, value))
}

export function useMobileMechSplit(enabled) {
  const [mechVh, setMechVh] = useState(DEFAULT_VH)
  const mechVhRef = useRef(DEFAULT_VH)

  useEffect(() => {
    if (!enabled) return
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = clampVh(Number.parseFloat(saved))
        if (!Number.isNaN(parsed)) {
          setMechVh(parsed)
          mechVhRef.current = parsed
        }
      }
    } catch {
      /* ignore */
    }
  }, [enabled])

  const persistVh = useCallback((value) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      /* ignore */
    }
  }, [])

  const startDrag = useCallback(
    (clientY) => {
      const startY = clientY
      const startVh = mechVhRef.current

      const onMove = (ev) => {
        const deltaVh = ((startY - ev.clientY) / window.innerHeight) * 100
        const next = clampVh(startVh + deltaVh)
        mechVhRef.current = next
        setMechVh(next)
      }

      const onUp = () => {
        persistVh(mechVhRef.current)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    },
    [persistVh],
  )

  const nudge = useCallback(
    (delta) => {
      setMechVh((prev) => {
        const next = clampVh(prev + delta)
        mechVhRef.current = next
        persistVh(next)
        return next
      })
    },
    [persistVh],
  )

  return { mechVh, startDrag, nudge, minVh: MIN_VH, maxVh: MAX_VH }
}

export default function MobileMechSplitHandle({ onDragStart, onNudge, mechVh, minVh, maxVh }) {
  return (
    <div className="mobile-mech-split lg:hidden shrink-0 flex items-center justify-center gap-3 px-3 py-1.5 border-y border-gundam/20 bg-panel/90 backdrop-blur-sm touch-none select-none">
      <button
        type="button"
        onClick={() => onNudge(-4)}
        disabled={mechVh <= minVh + 0.5}
        className="font-mono text-[10px] text-cyan/60 disabled:text-ice/20 px-2 py-1 border border-gundam/25 min-w-[44px] min-h-[32px]"
        aria-label="Shrink model viewport"
      >
        −
      </button>

      <div
        role="separator"
        aria-orientation="horizontal"
        aria-valuenow={Math.round(mechVh)}
        aria-valuemin={minVh}
        aria-valuemax={maxVh}
        aria-label="Drag to resize model viewport"
        className="flex-1 flex flex-col items-center justify-center gap-1 cursor-row-resize py-1"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          onDragStart(e.clientY)
        }}
      >
        <span className="block w-12 h-1 rounded-full bg-cyan/45" />
        <span className="font-mono text-[7px] tracking-[0.2em] text-cyan/40 uppercase">
          Viewport · {Math.round(mechVh)}%
        </span>
      </div>

      <button
        type="button"
        onClick={() => onNudge(4)}
        disabled={mechVh >= maxVh - 0.5}
        className="font-mono text-[10px] text-cyan/60 disabled:text-ice/20 px-2 py-1 border border-gundam/25 min-w-[44px] min-h-[32px]"
        aria-label="Expand model viewport"
      >
        +
      </button>
    </div>
  )
}
