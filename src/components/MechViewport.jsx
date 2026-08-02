import { Suspense, useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Html, OrbitControls } from '@react-three/drei'
import MovingStarfield from './MovingStarfield'
import * as THREE from 'three'
import { ACTIVE_MECH, FALLBACK_MECH, getCameraForTarget, getSectionCamera, MECH_TARGET_HEIGHT, INTRO_ZOOM_DURATION, CAMERA_TURN_MS, CAMERA_NAV_DELAY_MS } from '../config/mechModel'

function lerp3(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function shortestAngleDelta(from, to) {
  let d = to - from
  while (d > Math.PI) d -= 2 * Math.PI
  while (d < -Math.PI) d += 2 * Math.PI
  return d
}

function computeTransitionDuration(from, to) {
  const base = CAMERA_TURN_MS / 1000
  const fromLook = new THREE.Vector3(...from.look)
  const toLook = new THREE.Vector3(...to.look)
  const fromOff = new THREE.Vector3(...from.pos).sub(fromLook)
  const toOff = new THREE.Vector3(...to.pos).sub(toLook)
  const fromS = new THREE.Spherical().setFromVector3(fromOff)
  const toS = new THREE.Spherical().setFromVector3(toOff)

  let dTheta = Math.abs(toS.theta - fromS.theta)
  if (dTheta > Math.PI) dTheta = 2 * Math.PI - dTheta

  const spatial =
    (dTheta / Math.PI) * 0.52 +
    (Math.abs(toS.phi - fromS.phi) / Math.PI) * 0.28 +
    (Math.abs(toS.radius - fromS.radius) / 2.2) * 0.12
  const rot =
    Math.abs(shortestAngleDelta(from.mechRotY ?? 0, to.mechRotY ?? 0)) / Math.PI * 0.42
  const severity = Math.min(1.1, spatial + rot)

  return base * (1.05 + severity * 0.75)
}

function poseFromPreset(preset) {
  return {
    pos: [...preset.pos],
    look: [...preset.look],
    mechRotY: preset.mechRotY ?? 0,
  }
}

function getPoseForSection(section, phase, mechConfig) {
  if (section === 'face') return poseFromPreset(mechConfig.camera.face)
  return poseFromPreset(getSectionCamera(section, phase))
}

function applyPose(camera, lookAtRef, pose) {
  camera.position.set(pose.pos[0], pose.pos[1], pose.pos[2])
  lookAtRef.set(pose.look[0], pose.look[1], pose.look[2])
  camera.lookAt(lookAtRef)
}

/** Arc orbit around look target — smoother sector turns, body stays framed */
function interpolateCameraArc(from, to, rawT) {
  const t = easeInOutCubic(rawT)
  const look = lerp3(from.look, to.look, t)
  const target = new THREE.Vector3(...look)

  const fromOff = new THREE.Vector3(...from.pos).sub(new THREE.Vector3(...from.look))
  const toOff = new THREE.Vector3(...to.pos).sub(new THREE.Vector3(...to.look))
  const fromS = new THREE.Spherical().setFromVector3(fromOff)
  const toS = new THREE.Spherical().setFromVector3(toOff)

  let dTheta = toS.theta - fromS.theta
  while (dTheta > Math.PI) dTheta -= 2 * Math.PI
  while (dTheta < -Math.PI) dTheta += 2 * Math.PI

  const severity = Math.min(
    1,
    Math.abs(dTheta) / Math.PI * 0.52 +
      Math.abs(toS.phi - fromS.phi) / Math.PI * 0.28 +
      Math.abs(shortestAngleDelta(from.mechRotY ?? 0, to.mechRotY ?? 0)) / Math.PI * 0.38,
  )
  const arcLift = Math.sin(t * Math.PI) * (0.04 + severity * 0.2)

  const sph = new THREE.Spherical(
    THREE.MathUtils.lerp(fromS.radius, toS.radius, t) + arcLift,
    THREE.MathUtils.lerp(fromS.phi, toS.phi, t),
    fromS.theta + dTheta * t,
  )
  const pos = new THREE.Vector3().setFromSpherical(sph).add(target)
  return { pos: pos.toArray(), look }
}

/** One continuous move: from → via (at t≈0.42) → to */
function interpolateCameraThreePoint(from, via, to, rawT) {
  const t = easeInOutCubic(rawT)
  const split = 0.42
  if (t <= split) {
    return interpolateCameraArc(from, via, t / split)
  }
  return interpolateCameraArc(via, to, (t - split) / (1 - split))
}

function computeThreePointDuration(from, via, to) {
  const leg1 = computeTransitionDuration(from, via)
  const leg2 = computeTransitionDuration(via, to)
  return leg1 * 0.42 + leg2 * 0.58
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

/** Intro warp — dollies from faceIntro into face while streaks play */
function IntroZoomRig({ mechConfig, active }) {
  const { camera } = useThree()
  const elapsed = useRef(0)
  const wide = mechConfig.camera.faceIntro ?? mechConfig.camera.face
  const tight = mechConfig.camera.face
  const lookAt = useRef(new THREE.Vector3(...wide.look))

  useEffect(() => {
    elapsed.current = 0
    if (active) {
      camera.position.set(...wide.pos)
      lookAt.current.set(...wide.look)
    } else {
      camera.position.set(...tight.pos)
      lookAt.current.set(...tight.look)
    }
    camera.lookAt(lookAt.current)
  }, [active, camera, wide, tight])

  useFrame((_, delta) => {
    if (!active) return
    elapsed.current += delta
    const t = Math.min(1, elapsed.current / INTRO_ZOOM_DURATION)
    const e = easeOutCubic(t)
    const pos = lerp3(wide.pos, tight.pos, e)
    const look = lerp3(wide.look, tight.look, e)
    camera.position.set(pos[0], pos[1], pos[2])
    lookAt.current.set(look[0], look[1], look[2])
    camera.lookAt(lookAt.current)
  })

  return null
}

/**
 * Discrete section camera machine:
 * idle at section.end → (delay) → one smooth leg through next.start → next.end
 */
function SectionTransitionRig({
  cameraTarget,
  mechConfig,
  snap = false,
  orbitActive = false,
  baseRotYRef,
  entryFromIntro = false,
  onSettled,
  onEntrySettled,
}) {
  const { camera } = useThree()
  const lookAt = useRef(new THREE.Vector3(0, 1.58, 0))

  const settledSection = useRef(entryFromIntro ? 'face' : cameraTarget)
  const legPhase = useRef(entryFromIntro ? 'delay' : 'idle') // idle | delay | travel
  const pendingTarget = useRef(cameraTarget)
  const delayElapsed = useRef(0)
  const legElapsed = useRef(0)
  const legDuration = useRef(CAMERA_TURN_MS / 1000)
  const legFrom = useRef(poseFromPreset(getCameraForTarget(cameraTarget, mechConfig)))
  const legVia = useRef(legFrom.current)
  const legTo = useRef(legFrom.current)
  const mechRotFrom = useRef(legFrom.current.mechRotY)
  const mechRotVia = useRef(legFrom.current.mechRotY)
  const mechRotTo = useRef(legTo.current.mechRotY)
  const entryHandled = useRef(false)
  const initialSettle = useRef(false)

  const beginTravel = useCallback((fromSection, toSection) => {
    const fromPose = getPoseForSection(fromSection, 'end', mechConfig)
    const viaPose = getPoseForSection(toSection, 'start', mechConfig)
    const toPose = getPoseForSection(toSection, 'end', mechConfig)

    legFrom.current = fromPose
    legVia.current = viaPose
    legTo.current = toPose
    mechRotFrom.current = fromPose.mechRotY
    mechRotVia.current = fromPose.mechRotY + shortestAngleDelta(fromPose.mechRotY, viaPose.mechRotY)
    mechRotTo.current = mechRotVia.current + shortestAngleDelta(mechRotVia.current, toPose.mechRotY)
    legElapsed.current = 0
    legDuration.current = computeThreePointDuration(fromPose, viaPose, toPose)
    legPhase.current = 'travel'
  }, [mechConfig])

  const finishSettle = useCallback((section) => {
    settledSection.current = section
    legPhase.current = 'idle'
    const endPose = getPoseForSection(section, 'end', mechConfig)
    applyPose(camera, lookAt.current, endPose)
    if (baseRotYRef) baseRotYRef.current = endPose.mechRotY
    onSettled?.(section)
  }, [camera, mechConfig, baseRotYRef, onSettled])

  useEffect(() => {
    if (snap) {
      const pose = poseFromPreset(getCameraForTarget(cameraTarget, mechConfig))
      settledSection.current = cameraTarget
      pendingTarget.current = cameraTarget
      legPhase.current = 'idle'
      applyPose(camera, lookAt.current, pose)
      if (baseRotYRef) baseRotYRef.current = pose.mechRotY
      onSettled?.(cameraTarget)
      return
    }

    if (entryFromIntro && !entryHandled.current) {
      entryHandled.current = true
      settledSection.current = 'face'
      pendingTarget.current = cameraTarget
      legPhase.current = 'delay'
      delayElapsed.current = 0
      applyPose(camera, lookAt.current, getPoseForSection('face', 'end', mechConfig))
      if (baseRotYRef) baseRotYRef.current = mechConfig.camera.face.mechRotY ?? 0
      onEntrySettled?.()
      return
    }

    if (cameraTarget === settledSection.current && legPhase.current === 'idle') {
      if (!initialSettle.current) {
        initialSettle.current = true
        const endPose = getPoseForSection(cameraTarget, 'end', mechConfig)
        applyPose(camera, lookAt.current, endPose)
        if (baseRotYRef) baseRotYRef.current = endPose.mechRotY
        onSettled?.(cameraTarget)
      }
      return
    }

    pendingTarget.current = cameraTarget
    legPhase.current = 'delay'
    delayElapsed.current = 0
    applyPose(camera, lookAt.current, getPoseForSection(settledSection.current, 'end', mechConfig))
    if (baseRotYRef) {
      baseRotYRef.current = getPoseForSection(settledSection.current, 'end', mechConfig).mechRotY
    }
  }, [cameraTarget, mechConfig, camera, snap, baseRotYRef, entryFromIntro, onSettled, onEntrySettled])

  useFrame((_, delta) => {
    if (orbitActive) return

    if (legPhase.current === 'idle') {
      const endPose = getPoseForSection(settledSection.current, 'end', mechConfig)
      applyPose(camera, lookAt.current, endPose)
      if (baseRotYRef) baseRotYRef.current = endPose.mechRotY
      return
    }

    if (legPhase.current === 'delay') {
      applyPose(camera, lookAt.current, getPoseForSection(settledSection.current, 'end', mechConfig))
      delayElapsed.current += delta
      if (delayElapsed.current >= CAMERA_NAV_DELAY_MS / 1000) {
        beginTravel(settledSection.current, pendingTarget.current)
      }
      return
    }

    if (legPhase.current === 'travel') {
      legElapsed.current += delta
      const t = Math.min(1, legElapsed.current / legDuration.current)
      const { pos, look } = interpolateCameraThreePoint(
        legFrom.current,
        legVia.current,
        legTo.current,
        t,
      )
      camera.position.set(pos[0], pos[1], pos[2])
      lookAt.current.set(look[0], look[1], look[2])
      camera.lookAt(lookAt.current)

      const split = 0.42
      if (baseRotYRef) {
        if (t <= split) {
          const local = easeInOutCubic(t / split)
          baseRotYRef.current =
            mechRotFrom.current + (mechRotVia.current - mechRotFrom.current) * local
        } else {
          const local = easeInOutCubic((t - split) / (1 - split))
          baseRotYRef.current =
            mechRotVia.current + (mechRotTo.current - mechRotVia.current) * local
        }
      }

      if (t >= 1) {
        finishSettle(pendingTarget.current)
      }
    }
  })

  return null
}

/** Home only — small orbit arc, cannot spin fully around */
function LimitedOrbitControls({ enabled, preset, controlsRef }) {
  const internalRef = useRef(null)
  const ref = controlsRef ?? internalRef
  const { camera } = useThree()

  useEffect(() => {
    if (!enabled || !preset || !ref.current) return

    const target = new THREE.Vector3(...preset.look)
    const offset = new THREE.Vector3().copy(camera.position).sub(target)
    const spherical = new THREE.Spherical().setFromVector3(offset)
    const az = spherical.theta
    const pol = spherical.phi
    const spread = 0.4

    const controls = ref.current
    controls.target.copy(target)
    controls.minAzimuthAngle = az - spread
    controls.maxAzimuthAngle = az + spread
    controls.minPolarAngle = Math.max(0.55, pol - 0.2)
    controls.maxPolarAngle = Math.min(Math.PI / 2 + 0.15, pol + 0.2)
    controls.update()
  }, [enabled, preset, camera, ref])

  return (
    <OrbitControls
      ref={ref}
      enabled={enabled}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.5}
    />
  )
}

function hideWeaponMeshes(object) {
  object.traverse((child) => {
    const name = `${child.name ?? ''}`.toLowerCase()
    if (/rifle|beam_rifle|beam rifle|gun|launcher|vulcan|saber|sword/.test(name)) {
      child.visible = false
    }
  })
}

function enhanceMaterials(object, stripWeapons = false) {
  if (stripWeapons) hideWeaponMeshes(object)
  object.traverse((child) => {
    if (!child.isMesh) return
    child.castShadow = true
    child.receiveShadow = true
    const mats = Array.isArray(child.material) ? child.material : [child.material]
    mats.forEach((mat, i) => {
      if (!mat) return
      if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
        mat.metalness = Math.min(mat.metalness ?? 0.35, 0.65)
        mat.roughness = Math.max(mat.roughness ?? 0.5, 0.35)
        return
      }
      if (mat.vertexColors) {
        const next = new THREE.MeshStandardMaterial({
          vertexColors: true,
          metalness: 0.4,
          roughness: 0.5,
        })
        if (Array.isArray(child.material)) child.material[i] = next
        else child.material = next
      }
    })
  })
}

function fitModelToStage(clone) {
  const preBox = new THREE.Box3().setFromObject(clone)
  const preSize = preBox.getSize(new THREE.Vector3())
  const fitScale = MECH_TARGET_HEIGHT / preSize.y
  clone.scale.setScalar(fitScale)
  clone.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(clone)
  const center = box.getCenter(new THREE.Vector3())
  clone.position.x -= center.x
  clone.position.z -= center.z
  clone.position.y -= box.min.y
  clone.updateMatrixWorld(true)
  return fitScale
}

function GundamModel({
  modelPath,
  transform,
  cameraTarget,
  idleSway = true,
  hideWeapons = false,
  snapRotation = false,
  groupRef,
  baseRotYRef,
}) {
  const internalRef = useRef()
  const ref = groupRef ?? internalRef
  const { scene } = useGLTF(modelPath)
  const model = useMemo(() => {
    const clone = scene.clone(true)
    enhanceMaterials(clone, hideWeapons)
    fitModelToStage(clone)
    return clone
  }, [scene, hideWeapons])

  useEffect(() => {
    const preset = getCameraForTarget(cameraTarget)
    const r = preset.mechRotY ?? transform.rotation[1]
    if (baseRotYRef) baseRotYRef.current = r
    if (snapRotation && ref.current) ref.current.rotation.y = r
  }, [cameraTarget, transform.rotation, snapRotation, baseRotYRef, ref])

  useFrame((state) => {
    if (!ref.current || !baseRotYRef) return
    const sway = idleSway ? Math.sin(state.clock.elapsedTime * 0.12) * 0.04 : 0
    ref.current.rotation.y = baseRotYRef.current + sway
  })

  const { position, rotation, scale } = transform

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
      <pointLight position={[0, 1.5, 1.2]} color="#3de8ff" intensity={0.85} />
      <pointLight position={[-0.8, 1.2, 0.8]} color="#ffffff" intensity={0.35} />
      <pointLight position={[0, 1.45, 0.2]} color="#ff4060" intensity={0.9} distance={3} />
    </group>
  )
}

function Starfield() {
  return <MovingStarfield />
}

function SpaceDeck({ fullHangar = false }) {
  if (fullHangar) {
    return <HangarBay />
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial color="#141c28" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
        <ringGeometry args={[8.5, 9, 64]} />
        <meshBasicMaterial color="#3de8ff" transparent opacity={0.12} />
      </mesh>
      <gridHelper args={[18, 36, '#1e3050', '#121a28']} position={[0, 0.005, 0]} />
      {[-4, 0, 4].map((x) => (
        <pointLight key={`deck-${x}`} position={[x, 2.5, 2]} color="#8898cc" intensity={0.35} distance={14} />
      ))}
      <fog attach="fog" args={['#04060e', 12, 55]} />
    </group>
  )
}

function HangarBay() {
  const beams = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        x: -7.5 + i * 1.65,
        h: 5.5 + (i % 3) * 0.35,
        rot: (i - 5) * 0.035,
      })),
    [],
  )

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#6a7078" metalness={0.45} roughness={0.72} />
      </mesh>
      <gridHelper args={[32, 64, '#4a5058', '#5a6068']} position={[0, 0.01, 0]} />

      {/* Hazard stripe runway */}
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.015, 0]}>
          <planeGeometry args={[0.5, 14]} />
          <meshStandardMaterial color="#c4a020" metalness={0.2} roughness={0.8} />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[0, 3.5, -6.5]} receiveShadow>
        <boxGeometry args={[28, 8, 0.4]} />
        <meshStandardMaterial color="#4a5058" metalness={0.35} roughness={0.85} />
      </mesh>
      {/* Hangar door opening glow */}
      <mesh position={[0, 2.8, -6.2]}>
        <planeGeometry args={[10, 6]} />
        <meshBasicMaterial color="#1a2838" />
      </mesh>
      <mesh position={[0, 2.8, -6.15]}>
        <planeGeometry args={[8, 4.5]} />
        <meshBasicMaterial color="#0a1420" />
      </mesh>

      {/* Side walls */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 12, 3, 0]} rotation={[0, side * -Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[20, 7, 0.35]} />
          <meshStandardMaterial color="#525860" metalness={0.4} roughness={0.8} />
        </mesh>
      ))}

      {/* Ceiling trusses */}
      {beams.map((b, i) => (
        <mesh key={`col-${i}`} position={[b.x, b.h / 2, -3.8]} rotation={[0, 0, b.rot]} castShadow>
          <boxGeometry args={[0.2, b.h, 0.2]} />
          <meshStandardMaterial color="#606870" metalness={0.6} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 5.2, -4]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[18, 0.14, 0.14]} />
        <meshStandardMaterial color="#707880" metalness={0.55} roughness={0.5} />
      </mesh>
      {[ -5, -2.5, 0, 2.5, 5 ].map((x) => (
        <mesh key={`cross-${x}`} position={[x, 4.8, -3.5]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.1, 3.5, 0.1]} />
          <meshStandardMaterial color="#505860" metalness={0.5} roughness={0.55} />
        </mesh>
      ))}

      {/* Overhead hangar lights */}
      {[-4, 0, 4].map((x) => (
        <group key={`light-${x}`} position={[x, 4.6, 1.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.5, 8]} />
            <meshStandardMaterial color="#889098" emissive="#889098" emissiveIntensity={0.3} />
          </mesh>
          <pointLight position={[0, -0.4, 0]} color="#e8f0ff" intensity={1.4} distance={12} castShadow />
        </group>
      ))}

      {/* Equipment crates */}
      {[
        { x: -5.5, z: 2.5, s: [1.2, 0.8, 1] },
        { x: 5.8, z: 1.8, s: [0.9, 0.6, 0.7] },
        { x: -4.2, z: 3.2, s: [0.6, 0.5, 0.5] },
      ].map((c, i) => (
        <mesh key={`crate-${i}`} position={[c.x, c.s[1] / 2, c.z]} castShadow receiveShadow>
          <boxGeometry args={c.s} />
          <meshStandardMaterial color="#3a4248" metalness={0.3} roughness={0.75} />
        </mesh>
      ))}

      <fog attach="fog" args={['#1a2030', 10, 28]} />
    </group>
  )
}

function SceneContent({
  cameraTarget,
  mech,
  showHangar = true,
  fullHangar = false,
  idleSway,
  hideWeapons,
  snapCamera,
  enableOrbit = false,
  introZoom = false,
  entryFromIntro = false,
  onEntrySettled,
}) {
  const preset = getSectionCamera(cameraTarget, 'end')
  const facePreset = getCameraForTarget('face', mech.config)
  const baseRotY = useRef(entryFromIntro ? (facePreset.mechRotY ?? 0) : (preset.mechRotY ?? 0))
  const groupRef = useRef()
  const orbitControlsRef = useRef(null)
  const [orbitReady, setOrbitReady] = useState(false)
  const orbitActive = enableOrbit && orbitReady && preset.orbit

  useEffect(() => {
    setOrbitReady(false)
  }, [cameraTarget, enableOrbit])

  const handleSettled = useCallback(
    (target) => {
      if (target === 'hero' && enableOrbit) setOrbitReady(true)
    },
    [enableOrbit],
  )

  return (
    <>
      <color attach="background" args={['#030508']} />
      <Starfield />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 10, 6]} intensity={1.35} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-6, 4, 3]} intensity={0.35} color="#7090c8" />
      <spotLight position={[0, 7, 5]} angle={0.5} penumbra={0.6} intensity={1.6} castShadow color="#e8eeff" />

      {showHangar && <SpaceDeck fullHangar={fullHangar} />}
      <GundamModel
        modelPath={mech.path}
        transform={mech.config.transform}
        cameraTarget={cameraTarget}
        idleSway={idleSway}
        hideWeapons={hideWeapons}
        snapRotation={snapCamera || introZoom}
        groupRef={groupRef}
        baseRotYRef={baseRotY}
      />
      {introZoom ? (
        <IntroZoomRig mechConfig={mech.config} active={introZoom} />
      ) : (
        <SectionTransitionRig
          cameraTarget={cameraTarget}
          mechConfig={mech.config}
          snap={snapCamera}
          orbitActive={orbitActive}
          baseRotYRef={baseRotY}
          entryFromIntro={entryFromIntro}
          onSettled={handleSettled}
          onEntrySettled={onEntrySettled}
        />
      )}
      <LimitedOrbitControls enabled={orbitActive} preset={preset} controlsRef={orbitControlsRef} />
    </>
  )
}

function Loader() {
  return (
    <Html center>
      <p className="font-mono text-xs text-[#2a3040] tracking-widest">LOADING UNIT...</p>
    </Html>
  )
}

async function resolveModelPath() {
  for (const path of ACTIVE_MECH.paths) {
    try {
      const res = await fetch(path, { method: 'HEAD' })
      if (res.ok) return { path, config: ACTIVE_MECH }
    } catch {
      /* try next */
    }
  }
  return { path: FALLBACK_MECH.paths[0], config: FALLBACK_MECH }
}

function MechScene({
  cameraTarget,
  mech,
  showHangar,
  fullHangar,
  idleSway,
  hideWeapons,
  snapCamera,
  enableOrbit,
  introZoom,
  entryFromIntro,
  onEntrySettled,
}) {
  useGLTF.preload(mech.path)
  return (
    <SceneContent
      cameraTarget={cameraTarget}
      mech={mech}
      showHangar={showHangar}
      fullHangar={fullHangar}
      idleSway={idleSway}
      hideWeapons={hideWeapons}
      snapCamera={snapCamera}
      enableOrbit={enableOrbit}
      introZoom={introZoom}
      entryFromIntro={entryFromIntro}
      onEntrySettled={onEntrySettled}
    />
  )
}

/**
 * Unified 3D mech viewport — intro hangar, face closeup, and per-section portfolio views.
 * @param {string} cameraTarget — 'hangar' | 'face' | section id (hero, about, …)
 */
export default function MechViewport({
  cameraTarget = 'hangar',
  showHangar = true,
  fullHangar = false,
  idleSway = true,
  hideWeapons = false,
  snapCamera = false,
  enableOrbit = false,
  introZoom = false,
  entryFromIntro = false,
  onEntrySettled,
  className = '',
  mobileOptimized = false,
}) {
  const [mech, setMech] = useState(null)
  const canvasDpr = mobileOptimized ? [1, 1.25] : [1, 1.75]

  useEffect(() => {
    resolveModelPath().then(setMech)
  }, [])

  const config = mech?.config ?? ACTIVE_MECH
  const bootTarget = entryFromIntro ? 'face' : cameraTarget
  const bootPreset = getCameraForTarget(bootTarget, config)
  const bootPos = introZoom ? getCameraForTarget('faceIntro', config).pos : bootPreset.pos

  return (
    <div className={`w-full h-full ${className} ${enableOrbit ? 'cursor-grab active:cursor-grabbing' : ''}`}>
      <Canvas
        shadows
        dpr={canvasDpr}
        gl={{ antialias: true, alpha: false }}
        camera={{ fov: 38, near: 0.1, far: 100, position: bootPos }}
        onCreated={({ camera }) => {
          if (!introZoom) camera.lookAt(...bootPreset.look)
        }}
      >
        <Suspense fallback={<Loader />}>
          {mech && (
            <MechScene
              cameraTarget={cameraTarget}
              mech={mech}
              showHangar={showHangar}
              fullHangar={fullHangar}
              idleSway={idleSway}
              hideWeapons={hideWeapons}
              snapCamera={snapCamera}
              enableOrbit={enableOrbit}
              introZoom={introZoom}
              entryFromIntro={entryFromIntro}
              onEntrySettled={onEntrySettled}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

export { resolveModelPath }
