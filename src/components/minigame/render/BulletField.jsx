import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLOR } from '../constants'

export function PlayerBulletField({ stateRef }) {
  const lightMesh = useRef()
  const heavyMesh = useRef()
  const dummy = useRef(new THREE.Object3D())

  useFrame(() => {
    if (!lightMesh.current || !heavyMesh.current || !stateRef.current) return
    let li = 0
    let hi = 0
    for (const b of stateRef.current.playerBullets) {
      if (!b.alive) continue
      const d = dummy.current
      d.position.set(b.x, 0.5, b.z)
      d.lookAt(b.x + b.vx, 0.5, b.z + b.vz)
      d.scale.setScalar(1)
      d.updateMatrix()
      if (b.heavy) heavyMesh.current.setMatrixAt(hi++, d.matrix)
      else lightMesh.current.setMatrixAt(li++, d.matrix)
    }
    lightMesh.current.count = li
    heavyMesh.current.count = hi
    lightMesh.current.instanceMatrix.needsUpdate = true
    heavyMesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={lightMesh} args={[undefined, undefined, 512]} frustumCulled={false} renderOrder={10}>
        <boxGeometry args={[0.22, 0.22, 0.55]} />
        <meshBasicMaterial color={COLOR.PLAYER_LIGHT} toneMapped={false} depthWrite={false} />
      </instancedMesh>
      <instancedMesh ref={heavyMesh} args={[undefined, undefined, 128]} frustumCulled={false} renderOrder={10}>
        <boxGeometry args={[0.4, 0.4, 0.85]} />
        <meshBasicMaterial color={COLOR.PLAYER_HEAVY} toneMapped={false} depthWrite={false} />
      </instancedMesh>
    </>
  )
}

export function EnemyBulletField({ stateRef }) {
  const mesh = useRef()
  const dummy = useRef(new THREE.Object3D())

  useFrame(() => {
    if (!mesh.current || !stateRef.current) return
    let i = 0
    for (const b of stateRef.current.enemyBullets) {
      if (!b.alive) continue
      const d = dummy.current
      d.position.set(b.x, 0.5, b.z)
      d.scale.setScalar(1)
      d.updateMatrix()
      mesh.current.setMatrixAt(i, d.matrix)
      i++
    }
    mesh.current.count = i
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 768]} frustumCulled={false} renderOrder={10}>
      <sphereGeometry args={[0.28, 8, 8]} />
      <meshBasicMaterial color={COLOR.ENEMY_BULLET} toneMapped={false} depthWrite={false} />
    </instancedMesh>
  )
}
