import { ARENA } from '../constants'

export default function ArenaFloor() {
  const H = ARENA.HALF
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[H * 2.05, H * 2.05]} />
        <meshStandardMaterial color="#0a1524" metalness={0.25} roughness={0.9} />
      </mesh>
      {/* Panel seams */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[H * 2, H * 2]} />
        <meshBasicMaterial color="#0d1c30" transparent opacity={0.85} />
      </mesh>
      <gridHelper args={[H * 2, H * 2, '#1a3a55', '#0e2238']} position={[0, 0.02, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[5.7, 6.0, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.22} side={2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, 0]}>
        <ringGeometry args={[11.5, 11.75, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} side={2} />
      </mesh>
      {/* Center pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial color="#122438" metalness={0.4} roughness={0.6} emissive="#0ea5e9" emissiveIntensity={0.08} />
      </mesh>
      <WallLine z={-H} />
      <WallLine z={H} />
      <WallLine x={-H} />
      <WallLine x={H} />
      {/* Corner posts */}
      {[
        [-H, -H],
        [H, -H],
        [-H, H],
        [H, H],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.45, 2.2, 0.45]} />
            <meshStandardMaterial color="#1e293b" metalness={0.55} roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.35, 0]}>
            <sphereGeometry args={[0.2, 10, 10]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function WallLine({ x, z }) {
  const H = ARENA.HALF
  if (z !== undefined) {
    return (
      <mesh position={[0, 0.6, z]}>
        <boxGeometry args={[H * 2, 0.08, 0.08]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>
    )
  }
  return (
    <mesh position={[x, 0.6, 0]}>
      <boxGeometry args={[0.08, 0.08, H * 2]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
    </mesh>
  )
}
