import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CAMERA, COLOR } from './constants'
import { createLoop } from './engine/loop'
import { bindInput, clearFrameEdges } from './engine/input'
import PlayerMech from './render/PlayerMech'
import ArenaFloor from './render/ArenaFloor'
import ArenaBackdrop from './render/ArenaBackdrop'
import EnemyField from './render/EnemyField'
import { PlayerBulletField, EnemyBulletField } from './render/BulletField'

/**
 * R3F world — owns the single useFrame driver. Never setState from the frame loop.
 * Camera: high 3/4 angle (not pure top-down) so the mech silhouette reads; soft lean + trauma shake.
 * Never mutate camera.up into a rolled basis (that caused gimbal freakouts).
 */
export default function CombatWorld({ stateRef, inputRef, audioRef, onHudTick }) {
  const { camera, gl } = useThree()
  const lean = useRef({ x: 0, z: 0 })
  const hudAcc = useRef(0)
  const time = useRef(0)

  const loop = useMemo(() => {
    return createLoop(stateRef.current, inputRef.current, (events) => {
      const audio = audioRef.current
      if (!audio) return
      for (const ev of events) {
        if (ev.type === 'sfx') audio.play(ev.name)
        if (ev.type === 'waveClear') audio.play('wave')
        if (ev.type === 'deflect' && ev.count >= 3) audio.play('deflectChord')
      }
    })
  }, [stateRef, inputRef, audioRef])

  useEffect(() => {
    camera.fov = CAMERA.FOV
    camera.near = 0.5
    camera.far = CAMERA.FAR
    camera.up.set(0, 1, 0)
    camera.position.set(0, CAMERA.Y, CAMERA.OFFSET_Z)
    camera.lookAt(0, CAMERA.LOOK_Y, 0)
    camera.updateProjectionMatrix()
    const unbind = bindInput(inputRef.current, gl.domElement, camera)
    return () => {
      unbind()
      clearFrameEdges(inputRef.current)
    }
  }, [camera, gl, inputRef])

  useFrame((_, delta) => {
    const state = stateRef.current
    if (!state) return

    if (!state.paused) loop(delta)
    time.current += delta

    const p = state.player

    let ox = (state.aimX - p.x) * 0.35
    let oz = (state.aimZ - p.z) * 0.35
    const olen = Math.hypot(ox, oz)
    if (olen > CAMERA.LEAN_MAX) {
      ox = (ox / olen) * CAMERA.LEAN_MAX
      oz = (oz / olen) * CAMERA.LEAN_MAX
    }
    const targetX = p.x + ox
    const targetZ = p.z + oz
    lean.current.x += (targetX - lean.current.x) * CAMERA.LEAN_LERP
    lean.current.z += (targetZ - lean.current.z) * CAMERA.LEAN_LERP

    const trauma = state.reducedMotion ? state.trauma * 0.4 : state.trauma
    const shakeAmt = trauma * trauma
    const t = time.current
    const sx =
      Math.sin(t * 37.1) * shakeAmt * CAMERA.SHAKE_MAX_POS * 0.55 +
      Math.sin(t * 19.3) * shakeAmt * CAMERA.SHAKE_MAX_POS * 0.25
    const sz =
      Math.cos(t * 31.7) * shakeAmt * CAMERA.SHAKE_MAX_POS * 0.55 +
      Math.cos(t * 23.9) * shakeAmt * CAMERA.SHAKE_MAX_POS * 0.25

    camera.up.set(0, 1, 0)
    camera.position.set(
      lean.current.x + sx,
      CAMERA.Y,
      lean.current.z + CAMERA.OFFSET_Z + sz
    )
    camera.lookAt(lean.current.x, CAMERA.LOOK_Y, lean.current.z)

    hudAcc.current += delta
    if (hudAcc.current > 1 / 15) {
      hudAcc.current = 0
      onHudTick?.()
    }
  })

  return (
    <>
      <color attach="background" args={[COLOR.VOID]} />
      <fog attach="fog" args={[COLOR.VOID, 55, 140]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[14, 28, 18]} intensity={1.35} color="#f1f5f9" />
      <directionalLight position={[-16, 12, -10]} intensity={0.45} color="#7dd3fc" />
      <hemisphereLight args={['#94a3b8', '#0a1220', 0.35]} />
      <ArenaBackdrop />
      <ArenaFloor />
      <PlayerMech stateRef={stateRef} />
      <EnemyField stateRef={stateRef} />
      <PlayerBulletField stateRef={stateRef} />
      <EnemyBulletField stateRef={stateRef} />
      <SpawnMarkers stateRef={stateRef} />
      <LancerLines stateRef={stateRef} />
    </>
  )
}

function SpawnMarkers({ stateRef }) {
  const dummy = useRef(new THREE.Object3D())
  const mesh = useRef()

  useFrame(() => {
    if (!mesh.current || !stateRef.current) return
    let i = 0
    for (const w of stateRef.current.warnings) {
      if (!w.alive) continue
      if (w.t > w.duration * 0.55) continue
      const d = dummy.current
      d.position.set(w.x, 0.05, w.z)
      d.scale.setScalar(1.2)
      d.rotation.x = -Math.PI / 2
      d.updateMatrix()
      mesh.current.setMatrixAt(i, d.matrix)
      i++
    }
    mesh.current.count = i
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 16]} frustumCulled={false}>
      <ringGeometry args={[0.6, 0.9, 24]} />
      <meshBasicMaterial color={COLOR.WARN} transparent opacity={0.7} side={THREE.DoubleSide} depthWrite={false} />
    </instancedMesh>
  )
}

function LancerLines({ stateRef }) {
  const mesh = useRef()
  useFrame(() => {
    if (!mesh.current || !stateRef.current) return
    let found = null
    for (const e of stateRef.current.enemies) {
      if (e.alive && e.type === 'LANCER' && e.phase === 1) {
        found = e
        break
      }
    }
    if (!found) {
      mesh.current.visible = false
      return
    }
    mesh.current.visible = true
    const dx = found.telegraphX - found.x
    const dz = found.telegraphZ - found.z
    const len = Math.hypot(dx, dz)
    mesh.current.position.set((found.x + found.telegraphX) / 2, 0.2, (found.z + found.telegraphZ) / 2)
    mesh.current.rotation.y = Math.atan2(dx, dz)
    mesh.current.scale.set(1, 1, len)
  })
  return (
    <mesh ref={mesh} visible={false}>
      <boxGeometry args={[0.12, 0.05, 1]} />
      <meshBasicMaterial color="#ffb020" transparent opacity={0.75} depthWrite={false} />
    </mesh>
  )
}
