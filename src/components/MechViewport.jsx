import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Html, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { ACTIVE_MECH, FALLBACK_MECH, getCameraForTarget, MECH_TARGET_HEIGHT } from '../config/mechModel'

function lerp3(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function CameraRig({ cameraTarget, mechConfig, damp = 2.4, snap = false }) {
  const { camera } = useThree()
  const progress = useRef(snap ? 1 : 0)
  const initial = getCameraForTarget(cameraTarget, mechConfig)
  const from = useRef(initial)
  const to = useRef(initial)
  const lookAt = useRef(new THREE.Vector3(...initial.look))
  const targetKey = useRef(cameraTarget)

  useEffect(() => {
    const next = getCameraForTarget(cameraTarget, mechConfig)
    if (snap) {
      from.current = next
      to.current = next
      progress.current = 1
      camera.position.set(...next.pos)
      lookAt.current.set(...next.look)
      camera.lookAt(lookAt.current)
      targetKey.current = cameraTarget
      return
    }

    if (targetKey.current === cameraTarget) return
    from.current = {
      pos: camera.position.toArray(),
      look: lookAt.current.toArray(),
    }
    to.current = next
    progress.current = 0
    targetKey.current = cameraTarget
  }, [cameraTarget, mechConfig, camera, snap])

  useFrame((_, delta) => {
    progress.current = THREE.MathUtils.damp(progress.current, 1, damp, delta)
    const t = progress.current
    const pos = lerp3(from.current.pos, to.current.pos, t)
    const look = lerp3(from.current.look, to.current.look, t)
    camera.position.set(pos[0], pos[1], pos[2])
    lookAt.current.set(look[0], look[1], look[2])
    camera.lookAt(lookAt.current)
  })

  return null
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

function GundamModel({ modelPath, transform, cameraTarget, idleSway = true, hideWeapons = false, snapRotation = false }) {
  const group = useRef()
  const rotTarget = useRef(transform.rotation[1])
  const { scene } = useGLTF(modelPath)
  const model = useMemo(() => {
    const clone = scene.clone(true)
    enhanceMaterials(clone, hideWeapons)
    fitModelToStage(clone)
    return clone
  }, [scene, hideWeapons])

  useEffect(() => {
    const preset = getCameraForTarget(cameraTarget)
    rotTarget.current = preset.mechRotY ?? transform.rotation[1]
    if (snapRotation && group.current) {
      group.current.rotation.y = rotTarget.current
    }
  }, [cameraTarget, transform.rotation, snapRotation])

  useFrame((state, delta) => {
    if (!group.current) return
    const base = rotTarget.current
    const sway = idleSway ? Math.sin(state.clock.elapsedTime * 0.12) * 0.04 : 0
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, base + sway, 2.8, delta)
  })

  const { position, rotation, scale } = transform

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
      <pointLight position={[0, 1.5, 1.2]} color="#3de8ff" intensity={0.85} />
      <pointLight position={[-0.8, 1.2, 0.8]} color="#ffffff" intensity={0.35} />
      <pointLight position={[0, 1.45, 0.2]} color="#ff4060" intensity={0.9} distance={3} />
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

      <fog attach="fog" args={['#6a7078', 10, 28]} />
    </group>
  )
}

function SceneContent({ cameraTarget, mech, showHangar = true, idleSway, hideWeapons, snapCamera }) {
  return (
    <>
      <color attach="background" args={['#5a6068']} />
      <Stars radius={80} depth={40} count={1200} factor={2.5} saturation={0} fade speed={0.4} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 10, 6]} intensity={1.35} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-6, 4, 3]} intensity={0.4} color="#a0c0e8" />
      <spotLight position={[0, 7, 5]} angle={0.5} penumbra={0.6} intensity={1.8} castShadow color="#ffffff" />

      {showHangar && <HangarBay />}
      <GundamModel
        modelPath={mech.path}
        transform={mech.config.transform}
        cameraTarget={cameraTarget}
        idleSway={idleSway}
        hideWeapons={hideWeapons}
        snapRotation={snapCamera}
      />
      <CameraRig cameraTarget={cameraTarget} mechConfig={mech.config} snap={snapCamera} />
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

function MechScene({ cameraTarget, mech, showHangar, idleSway, hideWeapons, snapCamera }) {
  useGLTF.preload(mech.path)
  return (
    <SceneContent
      cameraTarget={cameraTarget}
      mech={mech}
      showHangar={showHangar}
      idleSway={idleSway}
      hideWeapons={hideWeapons}
      snapCamera={snapCamera}
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
  idleSway = true,
  hideWeapons = false,
  snapCamera = false,
  className = '',
}) {
  const [mech, setMech] = useState(null)

  useEffect(() => {
    resolveModelPath().then(setMech)
  }, [])

  const preset = getCameraForTarget(cameraTarget, mech?.config ?? ACTIVE_MECH)
  const bootPos = snapCamera ? preset.pos : (mech?.config.camera ?? ACTIVE_MECH.camera).hangar.pos

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false }}
        camera={{ fov: 38, near: 0.1, far: 100, position: bootPos }}
      >
        <Suspense fallback={<Loader />}>
          {mech && (
            <MechScene
              cameraTarget={cameraTarget}
              mech={mech}
              showHangar={showHangar}
              idleSway={idleSway}
              hideWeapons={hideWeapons}
              snapCamera={snapCamera}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

export { resolveModelPath }
