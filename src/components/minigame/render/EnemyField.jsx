import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MAX = 48
const TYPES = ['SCRAP', 'GUNNER', 'SPINNER', 'LANCER', 'BULWARK']

/**
 * Distinct silhouettes per enemy type (instanced for each type).
 */
export default function EnemyField({ stateRef }) {
  const pools = useRef({})
  const boss = useRef()
  const dummy = useRef(new THREE.Object3D())
  const spinT = useRef(0)

  useFrame((_, dt) => {
    if (!stateRef.current) return
    spinT.current += dt
    const counts = Object.create(null)
    for (const t of TYPES) counts[t] = 0
    let bossE = null

    for (const e of stateRef.current.enemies) {
      if (!e.alive) continue
      if (e.type === 'BOSS') {
        bossE = e
        continue
      }
      const mesh = pools.current[e.type]
      if (!mesh) continue
      const i = counts[e.type] ?? 0
      if (i >= MAX) continue
      const d = dummy.current
      const y = e.type === 'SPINNER' ? 0.55 : e.type === 'BULWARK' ? 0.7 : 0.5
      d.position.set(e.x, y, e.z)
      let rotY = e.facing
      if (e.type === 'SPINNER') rotY = spinT.current * 4 + e.facing
      d.rotation.set(0, rotY, 0)
      const s = e.type === 'BULWARK' ? 1.15 : 1
      d.scale.setScalar(s)
      d.updateMatrix()
      mesh.setMatrixAt(i, d.matrix)
      counts[e.type] = i + 1
    }

    for (const t of TYPES) {
      const mesh = pools.current[t]
      if (!mesh) continue
      mesh.count = counts[t] ?? 0
      mesh.instanceMatrix.needsUpdate = true
    }

    if (boss.current) {
      if (bossE) {
        boss.current.visible = true
        boss.current.position.set(bossE.x, 1.35, bossE.z)
        boss.current.rotation.y = bossE.facing
      } else {
        boss.current.visible = false
      }
    }
  })

  const setPool = (type) => (el) => {
    if (el) pools.current[type] = el
  }

  return (
    <>
      {/* SCRAP — squat scavenger with dorsal fins */}
      <instancedMesh ref={setPool('SCRAP')} args={[undefined, undefined, MAX]} frustumCulled={false}>
        <boxGeometry args={[1.0, 0.7, 1.15]} />
        <meshStandardMaterial color="#c2410c" emissive="#ea580c" emissiveIntensity={0.2} metalness={0.35} roughness={0.55} />
      </instancedMesh>

      {/* GUNNER — tall turret body (visual: separate static props via group overlay would be heavy; use elongated box) */}
      <instancedMesh ref={setPool('GUNNER')} args={[undefined, undefined, MAX]} frustumCulled={false}>
        <boxGeometry args={[0.85, 1.35, 0.95]} />
        <meshStandardMaterial color="#b91c1c" emissive="#f87171" emissiveIntensity={0.22} metalness={0.4} roughness={0.45} />
      </instancedMesh>

      {/* SPINNER — flat disc silhouette */}
      <instancedMesh ref={setPool('SPINNER')} args={[undefined, undefined, MAX]} frustumCulled={false}>
        <cylinderGeometry args={[0.95, 0.95, 0.35, 8]} />
        <meshStandardMaterial color="#dc2626" emissive="#fb7185" emissiveIntensity={0.3} metalness={0.5} roughness={0.4} />
      </instancedMesh>

      {/* LANCER — long spear chassis */}
      <instancedMesh ref={setPool('LANCER')} args={[undefined, undefined, MAX]} frustumCulled={false}>
        <boxGeometry args={[0.55, 0.55, 2.2]} />
        <meshStandardMaterial color="#9f1239" emissive="#e11d48" emissiveIntensity={0.28} metalness={0.45} roughness={0.4} />
      </instancedMesh>

      {/* BULWARK — wide shield wall */}
      <instancedMesh ref={setPool('BULWARK')} args={[undefined, undefined, MAX]} frustumCulled={false}>
        <boxGeometry args={[1.8, 1.4, 0.7]} />
        <meshStandardMaterial color="#7f1d1d" emissive="#ef4444" emissiveIntensity={0.18} metalness={0.55} roughness={0.35} />
      </instancedMesh>

      {/* Detail overlays: non-instanced accent meshes synced lightly via second pass — skip for perf.
          Instead enrich boss + add typed accent groups below for visible variety. */}
      <EnemyAccents stateRef={stateRef} />

      <group ref={boss} visible={false}>
        <mesh>
          <boxGeometry args={[4.8, 2.6, 4.2]} />
          <meshStandardMaterial color="#450a0a" emissive="#ef4444" emissiveIntensity={0.3} metalness={0.45} roughness={0.42} />
        </mesh>
        {/* Shoulder pods */}
        <mesh position={[-2.6, 1.0, 0]}>
          <boxGeometry args={[1.4, 1.8, 2.2]} />
          <meshStandardMaterial color="#7f1d1d" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[2.6, 1.0, 0]}>
          <boxGeometry args={[1.4, 1.8, 2.2]} />
          <meshStandardMaterial color="#7f1d1d" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Core eye */}
        <mesh position={[0, 0.6, 2.2]}>
          <boxGeometry args={[1.6, 0.9, 0.4]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.85} />
        </mesh>
        {/* Horn crown */}
        <mesh position={[-0.7, 2.0, 0.3]} rotation={[0.2, 0, 0.35]}>
          <boxGeometry args={[0.25, 1.4, 0.25]} />
          <meshStandardMaterial color="#fca5a5" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0.7, 2.0, 0.3]} rotation={[0.2, 0, -0.35]}>
          <boxGeometry args={[0.25, 1.4, 0.25]} />
          <meshStandardMaterial color="#fca5a5" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 2.3, -0.2]}>
          <boxGeometry args={[0.35, 1.8, 0.3]} />
          <meshStandardMaterial color="#fecaca" emissive="#ef4444" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </>
  )
}

/** Extra mesh details for a few nearest enemies so silhouettes read clearer */
function EnemyAccents({ stateRef }) {
  const nodes = useRef([])

  useFrame(() => {
    if (!stateRef.current) return
    const list = []
    for (const e of stateRef.current.enemies) {
      if (!e.alive || e.type === 'BOSS') continue
      list.push(e)
      if (list.length >= 24) break
    }
    for (let i = 0; i < nodes.current.length; i++) {
      const g = nodes.current[i]
      if (!g) continue
      const e = list[i]
      if (!e) {
        g.visible = false
        continue
      }
      g.visible = true
      g.position.set(e.x, 0, e.z)
      g.rotation.y = e.facing
      // Show only matching child by type
      for (const child of g.children) {
        child.visible = child.name === e.type
      }
    }
  })

  return (
    <>
      {Array.from({ length: 24 }, (_, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) nodes.current[i] = el
          }}
          visible={false}
        >
          <group name="SCRAP">
            <mesh position={[0, 0.95, 0]}>
              <coneGeometry args={[0.25, 0.55, 5]} />
              <meshStandardMaterial color="#9a3412" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[-0.35, 0.55, -0.2]} rotation={[0.3, 0, 0.4]}>
              <boxGeometry args={[0.15, 0.15, 0.7]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0.35, 0.55, -0.2]} rotation={[0.3, 0, -0.4]}>
              <boxGeometry args={[0.15, 0.15, 0.7]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          </group>
          <group name="GUNNER">
            <mesh position={[0, 1.35, 0.35]} rotation={[1.2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.22, 1.4, 8]} />
              <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[0, 1.55, 0]}>
              <boxGeometry args={[0.5, 0.35, 0.5]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.45} />
            </mesh>
          </group>
          <group name="SPINNER">
            <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.12, 2.0, 0.25]} />
              <meshStandardMaterial color="#fca5a5" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
              <boxGeometry args={[2.0, 0.12, 0.25]} />
              <meshStandardMaterial color="#fca5a5" metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
          <group name="LANCER">
            <mesh position={[0, 0.55, 1.5]}>
              <coneGeometry args={[0.22, 0.9, 6]} />
              <meshStandardMaterial color="#fb7185" emissive="#e11d48" emissiveIntensity={0.35} metalness={0.55} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.85, -0.2]}>
              <boxGeometry args={[0.7, 0.35, 0.5]} />
              <meshStandardMaterial color="#881337" />
            </mesh>
          </group>
          <group name="BULWARK">
            <mesh position={[0, 0.85, 0.55]}>
              <boxGeometry args={[2.0, 1.5, 0.2]} />
              <meshStandardMaterial color="#44403c" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.85, 0.68]}>
              <boxGeometry args={[0.5, 0.5, 0.08]} />
              <meshStandardMaterial color="#f87171" emissive="#ef4444" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </group>
      ))}
    </>
  )
}
