import { useCallback, useEffect, useRef, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import CombatWorld from '../CombatWorld'
import EdgeWarnings from './EdgeWarnings'
import { createGameState, resetRun, syncHud } from '../engine/GameState'
import { createInput } from '../engine/input'
import { createAudio } from '../engine/audioSystem'
import { CAMERA, STORAGE } from '../constants'

function readBest() {
  try {
    return Number(sessionStorage.getItem(STORAGE.BEST)) || 0
  } catch {
    return 0
  }
}

function readMuted() {
  try {
    const v = sessionStorage.getItem(STORAGE.MUTED)
    return v === null ? true : v === '1'
  } catch {
    return true
  }
}

function writeBest(n) {
  try {
    sessionStorage.setItem(STORAGE.BEST, String(n))
  } catch {
    /* ignore */
  }
}

function writeMuted(m) {
  try {
    sessionStorage.setItem(STORAGE.MUTED, m ? '1' : '0')
  } catch {
    /* ignore */
  }
}

const CONTROLS = [
  ['WASD', 'move'],
  ['MOUSE', 'aim'],
  ['LMB / J', 'light'],
  ['RMB', 'charge'],
  ['K', 'heavy'],
  ['C', 'blade'],
  ['SHIFT', 'dash / boost'],
  ['ESC / P', 'pause'],
]

/**
 * Full-screen combat shell — React owns HUD/screens; engine owns simulation.
 */
export default function MechCombatGame({ onExit }) {
  const stateRef = useRef(null)
  const inputRef = useRef(null)
  const audioRef = useRef(null)
  if (!stateRef.current) stateRef.current = createGameState()
  if (!inputRef.current) inputRef.current = createInput()

  const [screen, setScreen] = useState('ready') // ready | playing | pause | over
  const [hud, setHud] = useState(() => ({ ...stateRef.current.hud }))
  const [warnings, setWarnings] = useState([])
  const [banner, setBanner] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [best, setBest] = useState(readBest)
  const [muted, setMuted] = useState(readMuted)
  const [stats, setStats] = useState({ score: 0, wave: 1, kills: 0, deflected: 0 })
  const [coarse, setCoarse] = useState(false)
  const [forcePlay, setForcePlay] = useState(false)

  useEffect(() => {
    audioRef.current = createAudio(muted)
    stateRef.current.hud.muted = muted
    const mq = window.matchMedia('(pointer: coarse)')
    setCoarse(mq.matches)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    stateRef.current.reducedMotion = reduced.matches
    return () => {
      audioRef.current?.dispose()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    audioRef.current?.setMuted(muted)
    writeMuted(muted)
  }, [muted])

  const refreshHud = useCallback(() => {
    const s = stateRef.current
    syncHud(s)
    setHud({ ...s.hud })
    setWarnings(s.warnings.filter((w) => w.alive).map((w) => ({ ...w })))
    setBanner(s.bannerT > 0 ? s.bannerText : '')
    setCountdown(s.phase === 'countdown' ? Math.ceil(s.countdownT) : 0)

    if (s.phase === 'gameover' && screen !== 'over') {
      const score = s.score
      setStats({
        score,
        wave: s.wave,
        kills: s.enemiesKilled,
        deflected: s.deflected,
      })
      setBest((prev) => {
        const next = Math.max(prev, score)
        writeBest(next)
        return next
      })
      setScreen('over')
    }
  }, [screen])

  const start = useCallback(() => {
    audioRef.current?.unlock()
    resetRun(stateRef.current)
    setScreen('playing')
    refreshHud()
  }, [refreshHud])

  const handleExit = useCallback(() => {
    stateRef.current.running = false
    stateRef.current.paused = false
    onExit?.()
  }, [onExit])

  const togglePause = useCallback(() => {
    if (screen !== 'playing' && screen !== 'pause') return
    const s = stateRef.current
    if (s.phase === 'countdown') return
    s.paused = !s.paused
    setScreen(s.paused ? 'pause' : 'playing')
  }, [screen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'KeyP') {
        e.preventDefault()
        togglePause()
        return
      }
      if (e.code !== 'Escape') return
      if (screen === 'ready' || screen === 'over') {
        handleExit()
        return
      }
      if (screen === 'playing' || screen === 'pause') {
        togglePause()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen, handleExit, togglePause])

  const showTouchGate = coarse && !forcePlay && screen === 'ready'

  const chargeDeg = (hud.charge || 0) * 360

  return (
    <div
      className="fixed inset-0 z-[80] text-ice"
      style={{ background: '#05070d', cursor: screen === 'playing' ? 'crosshair' : 'default' }}
    >
      <Canvas
        camera={{ position: [0, CAMERA.Y, CAMERA.OFFSET_Z], fov: CAMERA.FOV, near: 0.5, far: CAMERA.FAR }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
        onCreated={({ camera }) => {
          camera.up.set(0, 1, 0)
          camera.lookAt(0, CAMERA.LOOK_Y, 0)
        }}
      >
        <Suspense fallback={null}>
          <CombatWorld
            stateRef={stateRef}
            inputRef={inputRef}
            audioRef={audioRef}
            onHudTick={refreshHud}
          />
        </Suspense>
      </Canvas>

      {(screen === 'playing' || screen === 'pause') && (
        <>
          <EdgeWarnings warnings={warnings} />

          {/* Top HUD */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 sm:p-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <button
              type="button"
              onClick={handleExit}
              className="pointer-events-auto px-3 py-2 font-mono text-[10px] tracking-[0.25em] border border-cyan/35 bg-void/70 text-cyan hover:bg-cyan/10"
            >
              ← BACK
            </button>
            <div className="font-mono text-[11px] tracking-[0.3em] text-ice/80">
              WAVE {String(hud.wave).padStart(2, '0')}
            </div>
            <div className="font-mono text-[11px] tracking-widest text-ice tabular-nums">
              {hud.score.toLocaleString()}
            </div>
          </div>

          {/* Left meters */}
          <div className="pointer-events-none absolute left-3 sm:left-4 top-20 z-20 w-44 space-y-2">
            <Meter
              label="HP"
              value={hud.hp / 100}
              color={hud.hp <= 25 ? '#ef4444' : hud.hp <= 50 ? '#fbbf24' : '#38bdf8'}
              segments={10}
            />
            <Meter label="BOOST" value={hud.boost / 100} color="#38bdf8" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] tracking-[0.25em] text-cyan/45">DASH</span>
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className={`inline-block w-2.5 h-2.5 rounded-full border ${
                    i < hud.dashCharges ? 'bg-cyan border-cyan' : 'border-cyan/30 bg-transparent'
                  }`}
                />
              ))}
            </div>
            {hud.combo >= 2 && (
              <p className="font-mono text-[10px] text-gold tracking-widest">×{hud.combo} COMBO</p>
            )}
          </div>

          {/* Enemy count */}
          <div className="pointer-events-none absolute right-3 sm:right-4 bottom-24 z-20 text-right font-mono">
            <p className="text-lg text-ice/80 tabular-nums">{hud.enemiesAlive}</p>
            <p className="text-[8px] tracking-[0.3em] text-cyan/40">ENEMIES</p>
          </div>

          {/* Charge ring around crosshair */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div className="relative w-10 h-10">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="2" />
                {hud.charge > 0 && (
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke={hud.charge >= 1 ? '#fbbf24' : '#38bdf8'}
                    strokeWidth="2.5"
                    strokeDasharray={`${(chargeDeg / 360) * 100.5} 100.5`}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <span className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-1.5 bg-cyan/50" />
              <span className="absolute left-1/2 bottom-0 -translate-x-1/2 w-px h-1.5 bg-cyan/50" />
              <span className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-1.5 bg-cyan/50" />
              <span className="absolute top-1/2 right-0 -translate-y-1/2 h-px w-1.5 bg-cyan/50" />
            </div>
          </div>

          {/* Mute */}
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="pointer-events-auto absolute right-3 top-16 z-30 px-2 py-1 font-mono text-[9px] tracking-widest border border-cyan/25 text-cyan/60 hover:text-cyan"
          >
            {muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>

          {banner && (
            <div className="pointer-events-none absolute inset-x-0 top-1/3 z-30 text-center">
              <p className="font-display text-3xl tracking-[0.2em] text-ice drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                {banner}
              </p>
            </div>
          )}

          {countdown > 0 && (
            <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
              <p className="font-display text-7xl text-cyan">{countdown}</p>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {screen === 'ready' && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-void/80 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-lg w-full border border-cyan/30 bg-panel/95 p-6 sm:p-8 text-center">
              <p className="hud-text text-gold mb-2">COMBAT SIMULATOR</p>
              <h2 className="font-display text-2xl sm:text-3xl tracking-[0.18em] text-ice mb-1">ARENA 01</h2>
              <p className="font-mono text-[10px] text-cyan/45 tracking-[0.3em] mb-6">ENDLESS</p>

              {showTouchGate ? (
                <>
                  <p className="font-mono text-xs text-ice/60 mb-6">Built for keyboard and mouse.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => setForcePlay(true)}
                      className="px-5 py-2.5 font-mono text-[11px] tracking-[0.22em] border border-cyan/40 text-cyan hover:bg-cyan/10"
                    >
                      PLAY ANYWAY
                    </button>
                    <button
                      type="button"
                      onClick={handleExit}
                      className="px-5 py-2.5 font-mono text-[11px] tracking-[0.22em] border border-cyan/25 text-cyan/70"
                    >
                      ← BACK
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-left max-w-sm mx-auto mb-6 font-mono text-[10px] tracking-wide">
                    {CONTROLS.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3">
                        <span className="text-cyan/80">{k}</span>
                        <span className="text-ice/45">{v}</span>
                      </div>
                    ))}
                  </div>
                  {best > 0 && (
                    <p className="font-mono text-[10px] text-cyan/45 tracking-widest mb-5">
                      BEST {best.toLocaleString()}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={start}
                      className="px-6 py-2.5 font-mono text-[11px] tracking-[0.28em] bg-cyan text-void hover:bg-ice"
                    >
                      START
                    </button>
                    <button
                      type="button"
                      onClick={handleExit}
                      className="px-6 py-2.5 font-mono text-[11px] tracking-[0.28em] border border-cyan/40 text-cyan hover:bg-cyan/10"
                    >
                      ← BACK
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {screen === 'pause' && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-void/60 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-md w-full border border-cyan/30 bg-panel/95 p-6 text-center">
              <p className="font-display text-xl tracking-[0.2em] mb-4">PAUSED</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-left max-w-xs mx-auto mb-6 font-mono text-[10px]">
                {CONTROLS.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-cyan/70">{k}</span>
                    <span className="text-ice/40">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={togglePause}
                  className="px-5 py-2 font-mono text-[11px] tracking-[0.25em] bg-cyan text-void"
                >
                  RESUME
                </button>
                <button
                  type="button"
                  onClick={start}
                  className="px-5 py-2 font-mono text-[11px] tracking-[0.25em] border border-cyan/35 text-cyan"
                >
                  RESTART
                </button>
                <button
                  type="button"
                  onClick={handleExit}
                  className="px-5 py-2 font-mono text-[11px] tracking-[0.25em] border border-cyan/25 text-cyan/70"
                >
                  ← BACK
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {screen === 'over' && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-void/85 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-md w-full border border-gundam/40 bg-panel/95 p-6 sm:p-8 text-center">
              <p className="hud-text text-gundam mb-2">SIMULATION TERMINATED</p>
              <div className="space-y-2 font-mono text-sm mb-6 text-left max-w-xs mx-auto">
                <Row label="WAVE REACHED" value={String(stats.wave).padStart(2, '0')} />
                <Row label="SCORE" value={stats.score.toLocaleString()} />
                <Row
                  label="BEST"
                  value={`${best.toLocaleString()}${stats.score >= best && stats.score > 0 ? '  → NEW BEST' : ''}`}
                />
                <Row label="ENEMIES DOWN" value={String(stats.kills)} />
                <Row label="DEFLECTED" value={String(stats.deflected)} />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={start}
                  className="px-6 py-2.5 font-mono text-[11px] tracking-[0.28em] bg-cyan text-void hover:bg-ice"
                >
                  RETRY
                </button>
                <button
                  type="button"
                  onClick={handleExit}
                  className="px-6 py-2.5 font-mono text-[11px] tracking-[0.28em] border border-cyan/40 text-cyan"
                >
                  ← BACK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-cyan/10 py-1.5">
      <span className="text-[9px] tracking-[0.2em] text-cyan/45">{label}</span>
      <span className="text-ice tabular-nums">{value}</span>
    </div>
  )
}

function Meter({ label, value, color, segments }) {
  if (segments) {
    const filled = Math.round(Math.max(0, Math.min(1, value)) * segments)
    return (
      <div>
        <p className="font-mono text-[8px] tracking-[0.25em] text-cyan/45 mb-1">{label}</p>
        <div className="flex gap-0.5">
          {Array.from({ length: segments }, (_, i) => (
            <span
              key={i}
              className="h-2 flex-1 border border-white/10"
              style={{ background: i < filled ? color : 'transparent' }}
            />
          ))}
        </div>
      </div>
    )
  }
  return (
    <div>
      <p className="font-mono text-[8px] tracking-[0.25em] text-cyan/45 mb-1">{label}</p>
      <div className="h-1.5 border border-cyan/25 bg-void/50 overflow-hidden">
        <div className="h-full transition-[width] duration-100" style={{ width: `${value * 100}%`, background: color }} />
      </div>
    </div>
  )
}
