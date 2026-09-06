import { useMemo } from 'react'
import { ARENA } from '../constants'

/** Deterministic pseudo-random in [0,1) */
function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Dense hangar / wreckage ring outside the playable floor.
 * Pure decorative — no collision.
 */
export default function ArenaBackdrop() {
  const props = useMemo(() => buildProps(), [])

  return (
    <group>
      {/* Distant void plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial color="#03060c" />
      </mesh>

      {/* Outer trench ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <ringGeometry args={[ARENA.HALF + 0.4, ARENA.HALF + 8.5, 64]} />
        <meshStandardMaterial color="#0a1220" metalness={0.35} roughness={0.85} />
      </mesh>

      {/* Hangar wall segments */}
      {props.walls.map((w, i) => (
        <group key={`w${i}`} position={w.pos} rotation={[0, w.yaw, 0]}>
          <mesh position={[0, w.h / 2, 0]}>
            <boxGeometry args={[w.w, w.h, w.d]} />
            <meshStandardMaterial color={w.color} metalness={0.45} roughness={0.55} />
          </mesh>
          {/* Window band */}
          <mesh position={[0, w.h * 0.55, w.d * 0.52]}>
            <boxGeometry args={[w.w * 0.72, 0.35, 0.08]} />
            <meshStandardMaterial color="#1e3a5f" emissive="#38bdf8" emissiveIntensity={0.35} />
          </mesh>
          {/* Pillars */}
          <mesh position={[-w.w * 0.42, w.h * 0.35, 0.1]}>
            <boxGeometry args={[0.35, w.h * 0.7, 0.45]} />
            <meshStandardMaterial color="#1a2434" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[w.w * 0.42, w.h * 0.35, 0.1]}>
            <boxGeometry args={[0.35, w.h * 0.7, 0.45]} />
            <meshStandardMaterial color="#1a2434" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Roof lip */}
          <mesh position={[0, w.h + 0.2, -0.15]}>
            <boxGeometry args={[w.w + 0.6, 0.25, w.d + 0.8]} />
            <meshStandardMaterial color="#121a28" metalness={0.4} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Watchtowers */}
      {props.towers.map((t, i) => (
        <group key={`t${i}`} position={t.pos}>
          <mesh position={[0, t.h / 2, 0]}>
            <boxGeometry args={[1.4, t.h, 1.4]} />
            <meshStandardMaterial color="#243044" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, t.h + 0.55, 0]}>
            <boxGeometry args={[2.2, 1.1, 2.2]} />
            <meshStandardMaterial color="#1a2536" metalness={0.55} roughness={0.45} />
          </mesh>
          <mesh position={[0, t.h + 1.35, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 1.2, 6]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, t.h + 2.0, 0]}>
            <sphereGeometry args={[0.28, 10, 10]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} />
          </mesh>
          {/* Antenna dishes */}
          <mesh position={[0.7, t.h + 0.9, 0]} rotation={[0.4, 0.5, 0.2]}>
            <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Cargo crates / debris piles */}
      {props.crates.map((c, i) => (
        <group key={`c${i}`} position={c.pos} rotation={[0, c.yaw, 0]}>
          <mesh position={[0, c.h / 2, 0]}>
            <boxGeometry args={[c.w, c.h, c.d]} />
            <meshStandardMaterial color={c.color} metalness={0.3} roughness={0.65} />
          </mesh>
          {c.stripe && (
            <mesh position={[0, c.h * 0.55, c.d * 0.51]}>
              <boxGeometry args={[c.w * 0.9, 0.12, 0.04]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
            </mesh>
          )}
        </group>
      ))}

      {/* Wrecked mech husks */}
      {props.wrecks.map((w, i) => (
        <group key={`r${i}`} position={w.pos} rotation={[w.rx, w.yaw, w.rz]}>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[1.8, 1.1, 2.4]} />
            <meshStandardMaterial color="#3f1d1d" metalness={0.4} roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.4, 0.2]}>
            <boxGeometry args={[1.0, 0.9, 1.0]} />
            <meshStandardMaterial color="#2a1515" metalness={0.35} roughness={0.75} />
          </mesh>
          <mesh position={[-0.9, 0.9, -0.3]} rotation={[0.2, 0, 0.4]}>
            <boxGeometry args={[0.35, 0.35, 1.6]} />
            <meshStandardMaterial color="#4a2020" metalness={0.45} roughness={0.6} />
          </mesh>
          <mesh position={[0.85, 0.7, 0.4]} rotation={[0.5, 0.3, -0.5]}>
            <boxGeometry args={[0.3, 0.3, 1.3]} />
            <meshStandardMaterial color="#4a2020" metalness={0.45} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Floodlight poles */}
      {props.lights.map((l, i) => (
        <group key={`l${i}`} position={l.pos}>
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 8, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 8.2, 0]} rotation={[0.6, 0, 0]}>
            <boxGeometry args={[0.8, 0.35, 1.2]} />
            <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.45} />
          </mesh>
          <pointLight position={[0, 7.6, 0.4]} intensity={18} distance={28} color="#93c5fd" decay={2} />
        </group>
      ))}

      {/* Catwalk trusses spanning corners */}
      {props.trusses.map((tr, i) => (
        <group key={`tr${i}`} position={tr.pos} rotation={[0, tr.yaw, 0]}>
          <mesh position={[0, 5.5, 0]}>
            <boxGeometry args={[tr.len, 0.18, 0.35]} />
            <meshStandardMaterial color="#475569" metalness={0.65} roughness={0.4} />
          </mesh>
          <mesh position={[0, 4.8, 0]}>
            <boxGeometry args={[tr.len * 0.95, 0.12, 0.2]} />
            <meshStandardMaterial color="#334155" metalness={0.55} roughness={0.45} />
          </mesh>
          {[-0.35, 0, 0.35].map((f, j) => (
            <mesh key={j} position={[tr.len * f, 5.15, 0]} rotation={[0, 0, 0.55]}>
              <boxGeometry args={[0.1, 1.1, 0.1]} />
              <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function buildProps() {
  const H = ARENA.HALF
  const walls = []
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.12
    const r = H + 5.2 + hash(i * 3.1) * 1.5
    walls.push({
      pos: [Math.sin(a) * r, 0, Math.cos(a) * r],
      yaw: a + Math.PI,
      w: 5.5 + hash(i + 9) * 3,
      h: 6.5 + hash(i + 2) * 5.5,
      d: 1.4 + hash(i + 5) * 1.0,
      color: hash(i) > 0.5 ? '#1a2740' : '#152032',
    })
  }

  const towers = []
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4
    const r = H + 9.5
    towers.push({
      pos: [Math.sin(a) * r, 0, Math.cos(a) * r],
      h: 7 + hash(i * 7) * 4,
    })
  }

  const crates = []
  for (let i = 0; i < 40; i++) {
    const a = hash(i * 1.7) * Math.PI * 2
    const r = H + 1.2 + hash(i * 2.3) * 7
    crates.push({
      pos: [Math.sin(a) * r, 0, Math.cos(a) * r],
      yaw: hash(i + 40) * Math.PI * 2,
      w: 0.8 + hash(i + 1) * 1.6,
      h: 0.5 + hash(i + 2) * 1.4,
      d: 0.8 + hash(i + 3) * 1.4,
      color: hash(i) > 0.6 ? '#3b4558' : hash(i) > 0.3 ? '#2a3344' : '#4a3728',
      stripe: hash(i + 11) > 0.65,
    })
  }

  const wrecks = []
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.7
    const r = H + 3.5 + hash(i * 5) * 4
    wrecks.push({
      pos: [Math.sin(a) * r, 0.1, Math.cos(a) * r],
      yaw: hash(i + 20) * Math.PI * 2,
      rx: (hash(i + 21) - 0.5) * 0.6,
      rz: (hash(i + 22) - 0.5) * 0.5,
    })
  }

  const lights = []
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    lights.push({ pos: [Math.sin(a) * (H + 7), 0, Math.cos(a) * (H + 7)] })
  }

  const trusses = []
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2
    trusses.push({
      pos: [Math.sin(a) * (H + 4), 0, Math.cos(a) * (H + 4)],
      yaw: a + Math.PI / 2,
      len: 10 + hash(i) * 4,
    })
  }

  return { walls, towers, crates, wrecks, lights, trusses }
}
