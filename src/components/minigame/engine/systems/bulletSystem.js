import { ARENA } from '../../constants'

export function stepBullets(state, dt) {
  const limit = ARENA.HALF + 6
  for (const list of [state.playerBullets, state.enemyBullets]) {
    for (const b of list) {
      if (!b.alive) continue
      b.x += b.vx * dt
      b.z += b.vz * dt
      b.life -= dt
      if (b.life <= 0 || Math.abs(b.x) > limit || Math.abs(b.z) > limit) {
        b.alive = false
      }
    }
  }
}
