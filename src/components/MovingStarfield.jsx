import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const STAR_COUNT = 2800
const TRAIL_LEN = 0.85
const DRIFT = new THREE.Vector3(0.018, 0.004, 0.032)
const BOUNDS = 95

function wrap(v) {
  if (v > BOUNDS) return -BOUNDS
  if (v < -BOUNDS) return BOUNDS
  return v
}

/** Drifting star points with motion trails — replaces static Stars */
export default function MovingStarfield() {
  const pointsRef = useRef(null)
  const linesRef = useRef(null)

  const { positions, velocities, linePositions, colors } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3)
    const velocities = new Float32Array(STAR_COUNT * 3)
    const linePositions = new Float32Array(STAR_COUNT * 6)
    const colors = new Float32Array(STAR_COUNT * 6)

    for (let i = 0; i < STAR_COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * BOUNDS * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS * 2

      const speed = 0.55 + Math.random() * 0.85
      velocities[i * 3] = (DRIFT.x + (Math.random() - 0.5) * 0.008) * speed
      velocities[i * 3 + 1] = (DRIFT.y + (Math.random() - 0.5) * 0.004) * speed
      velocities[i * 3 + 2] = (DRIFT.z + (Math.random() - 0.5) * 0.008) * speed

      const bright = 0.45 + Math.random() * 0.55
      for (let c = 0; c < 2; c += 1) {
        const ci = i * 6 + c * 3
        colors[ci] = 0.55 + bright * 0.45
        colors[ci + 1] = 0.75 + bright * 0.25
        colors[ci + 2] = 1
      }
    }

    return { positions, velocities, linePositions, colors }
  }, [])

  const pointsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  const linesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [linePositions, colors])

  useFrame((_, delta) => {
    const pts = pointsRef.current
    const lns = linesRef.current
    if (!pts || !lns) return

    const pos = pts.geometry.attributes.position.array
    const vel = velocities
    const line = lns.geometry.attributes.position.array

    for (let i = 0; i < STAR_COUNT; i += 1) {
      const i3 = i * 3
      const i6 = i * 6

      pos[i3] = wrap(pos[i3] + vel[i3] * delta * 60)
      pos[i3 + 1] = wrap(pos[i3 + 1] + vel[i3 + 1] * delta * 60)
      pos[i3 + 2] = wrap(pos[i3 + 2] + vel[i3 + 2] * delta * 60)

      line[i6] = pos[i3]
      line[i6 + 1] = pos[i3 + 1]
      line[i6 + 2] = pos[i3 + 2]
      line[i6 + 3] = pos[i3] - vel[i3] * TRAIL_LEN
      line[i6 + 4] = pos[i3 + 1] - vel[i3 + 1] * TRAIL_LEN
      line[i6 + 5] = pos[i3 + 2] - vel[i3 + 2] * TRAIL_LEN
    }

    pts.geometry.attributes.position.needsUpdate = true
    lns.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group>
      <lineSegments ref={linesRef} geometry={linesGeo} frustumCulled={false}>
        <lineBasicMaterial vertexColors transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points ref={pointsRef} geometry={pointsGeo} frustumCulled={false}>
        <pointsMaterial
          size={0.38}
          sizeAttenuation
          color="#d4f4ff"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}
