import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MECH } from '../constants'
import Lightsaber from './Lightsaber'

function Box({
  args,
  position,
  rotation,
  color,
  metalness = 0.2,
  roughness = 0.4,
  emissive,
  em = 0,
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        emissive={emissive ?? '#000000'}
        emissiveIntensity={em}
      />
    </mesh>
  )
}

function Cyl({ args, position, rotation, color, metalness = 0.45, roughness = 0.45, emissive, em = 0 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={args} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        emissive={emissive ?? '#000000'}
        emissiveIntensity={em}
      />
    </mesh>
  )
}

/** One wing blade with leading trim + red tip bands (reads from above). */
function WingBlade({ side, length, thickness, y, z, pitch, yawBias, spread }) {
  const s = side
  return (
    <group
      position={[s * 0.28, y, z]}
      rotation={[pitch, s * yawBias, s * ((spread * Math.PI) / 180)]}
    >
      {/* Main navy plane */}
      <Box
        args={[thickness, 0.14, length]}
        position={[0, 0, -length * 0.42]}
        color={MECH.BINDER}
        metalness={0.4}
        roughness={0.42}
        emissive={MECH.BINDER_RIM}
        em={MECH.BINDER_RIM_EM}
      />
      {/* Inner dark layer for depth */}
      <Box
        args={[thickness * 0.55, 0.08, length * 0.92]}
        position={[s * -0.04, -0.04, -length * 0.4]}
        color="#1a2f66"
        metalness={0.5}
        roughness={0.4}
      />
      {/* White leading-edge strip — critical for top-down read */}
      <Box
        args={[0.045, 0.155, length * 0.95]}
        position={[s * 0.1, 0.02, -length * 0.4]}
        color={MECH.TRIM}
        roughness={0.3}
      />
      {/* Panel groove */}
      <Box
        args={[thickness * 0.7, 0.02, length * 0.7]}
        position={[0, 0.075, -length * 0.38]}
        color="#243a72"
      />
      {/* Red tip bands */}
      <Box args={[thickness * 0.9, 0.16, 0.11]} position={[0, 0.01, -length * 0.68]} color={MECH.TIP_BAND} />
      <Box args={[thickness * 0.75, 0.16, 0.09]} position={[0, 0.01, -length * 0.82]} color={MECH.TIP_BAND} />
      {/* Tip cap */}
      <Box args={[thickness * 0.45, 0.1, 0.12]} position={[0, 0, -length * 0.92]} color={MECH.TRIM} />
    </group>
  )
}

/**
 * Spec §10 SD Freedom — dense primitive build for top-down.
 * Local +Z = face / rifle forward.
 */
export default function PlayerMech({ stateRef }) {
  const root = useRef()
  const leftFan = useRef()
  const rightFan = useRef()
  const muzzle = useRef()
  const thrusterL = useRef()
  const thrusterR = useRef()
  const spreadRef = useRef(MECH.BINDER_SPREAD.IDLE)

  useFrame(({ clock }) => {
    if (!root.current || !stateRef?.current) return
    const p = stateRef.current.player
    const t = clock.elapsedTime

    root.current.position.set(p.x, 0.02 + Math.sin(t * 2) * 0.035, p.z)
    root.current.rotation.y = p.yaw

    const blink = p.iframes > 0 && Math.floor(p.blink * 10) % 2 === 0
    root.current.visible = !blink

    let target = MECH.BINDER_SPREAD.IDLE
    if (p.dashT > 0) target = MECH.BINDER_SPREAD.DASH
    else if (p.boosting) target = MECH.BINDER_SPREAD.BOOST
    else if (p.charging) target = MECH.BINDER_SPREAD.IDLE + 12
    target += Math.sin(t * 2.1) * 2.5
    spreadRef.current += (target - spreadRef.current) * 0.14
    const s = (spreadRef.current * Math.PI) / 180
    if (leftFan.current) leftFan.current.rotation.z = -s * 0.55
    if (rightFan.current) rightFan.current.rotation.z = s * 0.55

    if (muzzle.current) {
      const ct = p.charging ? Math.min(1, p.chargeT) : 0
      muzzle.current.material.emissiveIntensity = 0.35 + ct * 1.8
      muzzle.current.scale.setScalar(1 + ct * 0.55)
    }

    const boost = p.boosting ? 1 : 0.35
    if (thrusterL.current) thrusterL.current.scale.setScalar(0.9 + boost * 1.4 + Math.sin(t * 20) * 0.08)
    if (thrusterR.current) thrusterR.current.scale.setScalar(0.9 + boost * 1.4 + Math.sin(t * 20 + 1) * 0.08)
  })

  return (
    <group ref={root}>
      {/* Slight forward tilt — camera is already high-angle */}
      <group rotation={[0.08, 0, 0]} scale={0.82}>
        {/* ===== FEET / LEGS ===== */}
        <Box args={[0.38, 0.22, 0.55]} position={[-0.3, -0.42, 0.12]} color={MECH.FOOT} />
        <Box args={[0.38, 0.22, 0.55]} position={[0.3, -0.42, 0.12]} color={MECH.FOOT} />
        <Box args={[0.32, 0.12, 0.18]} position={[-0.3, -0.42, 0.42]} color={MECH.TRIM} />
        <Box args={[0.32, 0.12, 0.18]} position={[0.3, -0.42, 0.42]} color={MECH.TRIM} />
        {/* Shins */}
        <Box args={[0.36, 0.55, 0.4]} position={[-0.3, -0.05, 0.05]} color={MECH.ARMOR} />
        <Box args={[0.36, 0.55, 0.4]} position={[0.3, -0.05, 0.05]} color={MECH.ARMOR} />
        <Box args={[0.28, 0.4, 0.08]} position={[-0.3, -0.05, 0.28]} color={MECH.BINDER} />
        <Box args={[0.28, 0.4, 0.08]} position={[0.3, -0.05, 0.28]} color={MECH.BINDER} />
        {/* Knees */}
        <Cyl args={[0.15, 0.15, 0.12, 10]} position={[-0.3, 0.22, 0.18]} rotation={[Math.PI / 2, 0, 0]} color={MECH.ACCENT_RED} emissive={MECH.ACCENT_RED} em={0.35} />
        <Cyl args={[0.15, 0.15, 0.12, 10]} position={[0.3, 0.22, 0.18]} rotation={[Math.PI / 2, 0, 0]} color={MECH.ACCENT_RED} emissive={MECH.ACCENT_RED} em={0.35} />
        {/* Thighs */}
        <Box args={[0.34, 0.48, 0.36]} position={[-0.28, 0.48, 0]} color={MECH.ARMOR} />
        <Box args={[0.34, 0.48, 0.36]} position={[0.28, 0.48, 0]} color={MECH.ARMOR} />
        <Box args={[0.08, 0.35, 0.3]} position={[-0.42, 0.48, 0]} color="#d0d6e0" />
        <Box args={[0.08, 0.35, 0.3]} position={[0.42, 0.48, 0]} color="#d0d6e0" />

        {/* ===== HIPS / RAILGUNS ===== */}
        <Box args={[0.95, 0.38, 0.58]} position={[0, 0.78, 0]} color={MECH.JOINT} metalness={0.45} />
        <Box args={[0.35, 0.2, 0.25]} position={[-0.55, 0.72, 0.15]} color={MECH.BINDER} />
        <Box args={[0.35, 0.2, 0.25]} position={[0.55, 0.72, 0.15]} color={MECH.BINDER} />
        {/* Folded hip railguns */}
        <Box args={[0.28, 0.26, 1.15]} position={[-0.55, 0.78, -0.25]} color={MECH.GUNMETAL} metalness={0.65} roughness={0.4} />
        <Box args={[0.28, 0.26, 1.15]} position={[0.55, 0.78, -0.25]} color={MECH.GUNMETAL} metalness={0.65} roughness={0.4} />
        <Box args={[0.2, 0.18, 0.2]} position={[-0.55, 0.78, -0.85]} color={MECH.ACCENT_RED} />
        <Box args={[0.2, 0.18, 0.2]} position={[0.55, 0.78, -0.85]} color={MECH.ACCENT_RED} />

        {/* ===== TORSO ===== */}
        <Box args={[1.0, 0.9, 0.62]} position={[0, 1.25, 0]} color={MECH.ARMOR} />
        {/* Chest plate layers */}
        <Box args={[0.85, 0.55, 0.12]} position={[0, 1.3, 0.32]} color="#f7f9fc" />
        <Box args={[0.22, 0.32, 0.1]} position={[-0.18, 1.22, 0.4]} color={MECH.ACCENT_RED} emissive={MECH.ACCENT_RED} em={0.3} />
        <Box args={[0.22, 0.32, 0.1]} position={[0.18, 1.22, 0.4]} color={MECH.ACCENT_RED} emissive={MECH.ACCENT_RED} em={0.3} />
        <Box args={[0.14, 0.14, 0.1]} position={[0, 1.42, 0.42]} color={MECH.VFIN} emissive={MECH.VFIN} em={0.4} />
        {/* Collar / blue chest band */}
        <Box args={[0.7, 0.22, 0.55]} position={[0, 1.55, 0.02]} color={MECH.BINDER} />
        {/* Side vents */}
        <Box args={[0.12, 0.4, 0.35]} position={[-0.52, 1.25, 0]} color={MECH.GUNMETAL} metalness={0.55} />
        <Box args={[0.12, 0.4, 0.35]} position={[0.52, 1.25, 0]} color={MECH.GUNMETAL} metalness={0.55} />

        {/* ===== SHOULDERS + CANNONS ===== */}
        <Box args={[0.58, 0.5, 0.55]} position={[-0.72, 1.52, 0]} color={MECH.ARMOR} />
        <Box args={[0.58, 0.5, 0.55]} position={[0.72, 1.52, 0]} color={MECH.ARMOR} />
        <Box args={[0.22, 0.48, 0.52]} position={[-0.98, 1.52, 0]} color={MECH.BINDER} />
        <Box args={[0.22, 0.48, 0.52]} position={[0.98, 1.52, 0]} color={MECH.BINDER} />
        <Box args={[0.2, 0.14, 0.2]} position={[-0.72, 1.78, 0.1]} color={MECH.ACCENT_RED} emissive={MECH.ACCENT_RED} em={0.25} />
        <Box args={[0.2, 0.14, 0.2]} position={[0.72, 1.78, 0.1]} color={MECH.ACCENT_RED} emissive={MECH.ACCENT_RED} em={0.25} />
        {/* Shoulder cannons — forward */}
        <Cyl args={[0.2, 0.18, 1.55, 8]} position={[-0.72, 1.85, 0.15]} rotation={[1.25, 0, -0.15]} color={MECH.GUNMETAL} metalness={0.7} roughness={0.35} />
        <Cyl args={[0.2, 0.18, 1.55, 8]} position={[0.72, 1.85, 0.15]} rotation={[1.25, 0, 0.15]} color={MECH.GUNMETAL} metalness={0.7} roughness={0.35} />
        <Cyl args={[0.12, 0.12, 0.2, 8]} position={[-0.72, 2.35, 0.55]} rotation={[1.25, 0, -0.15]} color="#2a3038" />
        <Cyl args={[0.12, 0.12, 0.2, 8]} position={[0.72, 2.35, 0.55]} rotation={[1.25, 0, 0.15]} color="#2a3038" />

        {/* ===== ARMS ===== */}
        <Box args={[0.28, 0.45, 0.28]} position={[-0.78, 1.15, 0.12]} color={MECH.ARMOR} />
        <Box args={[0.3, 0.5, 0.3]} position={[-0.82, 0.75, 0.28]} color={MECH.ARMOR} />
        <Box args={[0.26, 0.22, 0.26]} position={[-0.82, 0.52, 0.4]} color={MECH.GUNMETAL} metalness={0.55} />
        <Box args={[0.28, 0.45, 0.28]} position={[0.78, 1.15, 0.12]} color={MECH.ARMOR} />
        <Box args={[0.3, 0.5, 0.3]} position={[0.85, 0.78, 0.35]} color={MECH.ARMOR} />
        <Box args={[0.26, 0.22, 0.26]} position={[0.9, 0.55, 0.55]} color={MECH.GUNMETAL} metalness={0.55} />

        {/* ===== BEAM RIFLE (right, +Z forward) ===== */}
        <group position={[0.95, 0.72, 0.85]} rotation={[0.08, 0.12, -0.08]}>
          <Box args={[0.28, 0.28, 1.65]} position={[0, 0, 0]} color={MECH.ARMOR} metalness={0.35} />
          <Box args={[0.32, 0.18, 0.45]} position={[0, 0.18, 0.15]} color={MECH.GUNMETAL} metalness={0.6} />
          <Box args={[0.22, 0.22, 0.35]} position={[0, 0, 0.95]} color={MECH.GUNMETAL} metalness={0.65} />
          <Cyl args={[0.1, 0.09, 0.55, 8]} position={[0, 0, 1.35]} rotation={[Math.PI / 2, 0, 0]} color={MECH.GUNMETAL} metalness={0.7} />
          {/* Scope */}
          <Cyl args={[0.09, 0.09, 0.08, 12]} position={[0, 0.22, 0.2]} rotation={[Math.PI / 2, 0, 0]} color={MECH.BINDER} emissive={MECH.BINDER_RIM} em={0.4} />
          <mesh ref={muzzle} position={[0, 0, 1.7]}>
            <sphereGeometry args={[0.14, 10, 10]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.4} />
          </mesh>
        </group>

        {/* ===== HEAD (oversized SD) ===== */}
        <group position={[0, 2.15, 0.05]}>
          <Box args={[1.2, 1.1, 1.05]} color={MECH.ARMOR} />
          {/* Helmet ridges */}
          <Box args={[1.05, 0.12, 0.9]} position={[0, 0.45, 0]} color="#e2e8f0" />
          <Box args={[0.75, 0.5, 0.12]} position={[0, -0.05, 0.5]} color={MECH.FACE} />
          {/* Eyes */}
          <Box args={[0.18, 0.1, 0.06]} position={[-0.18, 0.0, 0.56]} color={MECH.EYE} emissive={MECH.EYE} em={MECH.EYE_EM} />
          <Box args={[0.18, 0.1, 0.06]} position={[0.18, 0.0, 0.56]} color={MECH.EYE} emissive={MECH.EYE} em={MECH.EYE_EM} />
          {/* Mouth grill */}
          <Box args={[0.28, 0.08, 0.05]} position={[0, -0.18, 0.55]} color="#1a1e24" />
          {/* Crest */}
          <Box args={[0.42, 0.55, 0.18]} position={[0, 0.4, 0.42]} color={MECH.ACCENT_RED} emissive={MECH.ACCENT_RED} em={0.35} />
          {/* V-fin — exaggerated for aim read */}
          <Box args={[0.15, 0.85, 0.1]} position={[-0.24, 0.78, 0.15]} rotation={[0.2, 0, 0.42]} color={MECH.VFIN} emissive={MECH.VFIN} em={MECH.VFIN_EM} />
          <Box args={[0.15, 0.85, 0.1]} position={[0.24, 0.78, 0.15]} rotation={[0.2, 0, -0.42]} color={MECH.VFIN} emissive={MECH.VFIN} em={MECH.VFIN_EM} />
          <Box args={[0.1, 0.25, 0.08]} position={[0, 0.55, 0.22]} color={MECH.ARMOR} />
          {/* Antenna horns — Nu / Freedom silhouette */}
          <Box
            args={[0.09, 1.15, 0.09]}
            position={[-0.58, 0.95, -0.05]}
            rotation={[0.25, 0.1, 0.62]}
            color={MECH.TRIM}
            metalness={0.55}
            roughness={0.35}
          />
          <Box
            args={[0.09, 1.15, 0.09]}
            position={[0.58, 0.95, -0.05]}
            rotation={[0.25, -0.1, -0.62]}
            color={MECH.TRIM}
            metalness={0.55}
            roughness={0.35}
          />
          <Box
            args={[0.07, 0.55, 0.07]}
            position={[-0.72, 1.45, -0.15]}
            rotation={[0.35, 0.15, 0.75]}
            color={MECH.ACCENT_RED}
            emissive={MECH.ACCENT_RED}
            em={0.25}
          />
          <Box
            args={[0.07, 0.55, 0.07]}
            position={[0.72, 1.45, -0.15]}
            rotation={[0.35, -0.15, -0.75]}
            color={MECH.ACCENT_RED}
            emissive={MECH.ACCENT_RED}
            em={0.25}
          />
          {/* Center blade horn */}
          <Box
            args={[0.1, 0.95, 0.12]}
            position={[0, 1.15, -0.2]}
            rotation={[0.35, 0, 0]}
            color={MECH.VFIN}
            emissive={MECH.VFIN}
            em={0.45}
          />
          {/* Ear vents */}
          <Box args={[0.2, 0.32, 0.24]} position={[-0.65, 0.05, 0.05]} color={MECH.BINDER} />
          <Box args={[0.2, 0.32, 0.24]} position={[0.65, 0.05, 0.05]} color={MECH.BINDER} />
          <Box args={[0.08, 0.2, 0.14]} position={[-0.72, 0.05, 0.12]} color={MECH.GUNMETAL} />
          <Box args={[0.08, 0.2, 0.14]} position={[0.72, 0.05, 0.12]} color={MECH.GUNMETAL} />
        </group>

        {/* ===== BACKPACK ===== */}
        <Box args={[0.65, 0.5, 0.4]} position={[0, 1.3, -0.45]} color={MECH.GUNMETAL} metalness={0.6} />
        <Box args={[0.4, 0.3, 0.2]} position={[0, 1.15, -0.65]} color="#2a3038" />
        <mesh ref={thrusterL} position={[-0.38, 0.95, -0.62]}>
          <circleGeometry args={[0.2, 12]} />
          <meshBasicMaterial color={MECH.THRUSTER} transparent opacity={0.9} />
        </mesh>
        <mesh ref={thrusterR} position={[0.38, 0.95, -0.62]}>
          <circleGeometry args={[0.2, 12]} />
          <meshBasicMaterial color={MECH.THRUSTER} transparent opacity={0.9} />
        </mesh>

        {/* ===== WING BINDERS (dominant silhouette) ===== */}
        <group ref={leftFan}>
          <WingBlade side={-1} length={2.35} thickness={0.42} y={1.35} z={-0.35} pitch={0.55} yawBias={0.2} spread={38} />
          <WingBlade side={-1} length={1.85} thickness={0.36} y={1.2} z={-0.4} pitch={0.2} yawBias={0.35} spread={48} />
          <WingBlade side={-1} length={1.25} thickness={0.3} y={1.05} z={-0.35} pitch={-0.1} yawBias={0.5} spread={58} />
          <WingBlade side={-1} length={0.85} thickness={0.22} y={1.45} z={-0.25} pitch={0.75} yawBias={0.1} spread={28} />
        </group>
        <group ref={rightFan}>
          <WingBlade side={1} length={2.35} thickness={0.42} y={1.35} z={-0.35} pitch={0.55} yawBias={0.2} spread={38} />
          <WingBlade side={1} length={1.85} thickness={0.36} y={1.2} z={-0.4} pitch={0.2} yawBias={0.35} spread={48} />
          <WingBlade side={1} length={1.25} thickness={0.3} y={1.05} z={-0.35} pitch={-0.1} yawBias={0.5} spread={58} />
          <WingBlade side={1} length={0.85} thickness={0.22} y={1.45} z={-0.25} pitch={0.75} yawBias={0.1} spread={28} />
        </group>

        {/* Lightsaber — sweeps in front on C */}
        <Lightsaber stateRef={stateRef} />
      </group>

      {/* Blob shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[1.25, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </group>
  )
}
