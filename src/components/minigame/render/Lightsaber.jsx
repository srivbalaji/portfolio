import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { WEAPON } from '../constants'

const BLADE = '#7cf9ff'
const CORE = '#ffffff'
const GLOW = '#38bdf8'
const HILT = '#4a5058'

/**
 * Single lightsaber — ignites, sweeps, retracts.
 * Afterimage = short fading ghost at a lagged angle only during ACTIVE (never a second solid blade).
 */
export default function Lightsaber({ stateRef }) {
  const root = useRef()
  const bladeGroup = useRef()
  const glowMat = useRef()
  const tip = useRef()
  const ghost = useRef()
  const ghostMat = useRef()
  const lastAngles = useRef([])

  useFrame(({ clock }) => {
    if (!root.current || !stateRef?.current) return
    const p = stateRef.current.player
    const swinging = p.saber && p.meleePhase !== 'idle'
    root.current.visible = swinging

    if (ghost.current) ghost.current.visible = false
    if (!swinging) {
      lastAngles.current = []
      return
    }

    root.current.position.set(0.15, 0.9, 0.25)
    root.current.rotation.set(0.12, p.saberAngle, 0.05)

    let len = 1
    if (p.meleePhase === 'windup') {
      const u = 1 - p.meleeT / Math.max(0.001, WEAPON.MELEE.WINDUP)
      len = 0.12 + 0.88 * u
    } else if (p.meleePhase === 'recover') {
      len = Math.max(0.05, p.meleeT / Math.max(0.001, WEAPON.MELEE.RECOVER))
    }

    if (bladeGroup.current) {
      bladeGroup.current.scale.set(1, 1, len)
      bladeGroup.current.visible = len > 0.08
    }
    if (tip.current) tip.current.visible = len > 0.15
    if (glowMat.current) {
      glowMat.current.opacity = 0.28 + Math.sin(clock.elapsedTime * 40) * 0.08
    }

    // Record angles during active; show one lagged ghost (not overlapping the live blade)
    if (p.meleePhase === 'active') {
      lastAngles.current.push(p.saberAngle)
      if (lastAngles.current.length > 8) lastAngles.current.shift()
      const lagged = lastAngles.current[0]
      const delta = Math.abs(p.saberAngle - lagged)
      if (ghost.current && ghostMat.current && delta > 0.22) {
        ghost.current.visible = true
        ghost.current.rotation.set(0.12, lagged, 0.05)
        ghost.current.scale.set(1, 1, len * 0.92)
        ghostMat.current.opacity = Math.min(0.22, delta * 0.18)
      }
    } else {
      lastAngles.current = []
    }
  })

  return (
    <group>
      {/* Single lagged afterimage — never present in recover/idle */}
      <group ref={ghost} position={[0.15, 0.9, 0.25]} visible={false}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 2.05]}>
          <cylinderGeometry args={[0.055, 0.04, 2.5, 8]} />
          <meshBasicMaterial
            ref={ghostMat}
            color={BLADE}
            transparent
            opacity={0.15}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      <group ref={root} visible={false}>
        <mesh position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.4, 10]} />
          <meshStandardMaterial color={HILT} metalness={0.85} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.06, 10]} />
          <meshStandardMaterial color="#1f242c" metalness={0.75} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.5]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={GLOW} emissive={GLOW} emissiveIntensity={1.4} />
        </mesh>

        <group ref={bladeGroup} position={[0, 0, 0.55]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.55]}>
            <cylinderGeometry args={[0.13, 0.1, 3.1, 12]} />
            <meshBasicMaterial ref={glowMat} color={BLADE} transparent opacity={0.35} depthWrite={false} toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.55]}>
            <cylinderGeometry args={[0.08, 0.06, 3.1, 12]} />
            <meshStandardMaterial color={BLADE} emissive={BLADE} emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.55]}>
            <cylinderGeometry args={[0.03, 0.022, 3.05, 8]} />
            <meshBasicMaterial color={CORE} toneMapped={false} />
          </mesh>
          <mesh ref={tip} position={[0, 0, 3.05]}>
            <sphereGeometry args={[0.085, 10, 10]} />
            <meshStandardMaterial color={BLADE} emissive={BLADE} emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
