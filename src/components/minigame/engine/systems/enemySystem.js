import { ENEMY, WAVE } from '../../constants'
import { spawnEnemyAt } from './spawnSystem'

function allocEnemyBullet(state) {
  for (const b of state.enemyBullets) if (!b.alive) return b
  return null
}

function fireAimed(state, e, angle, speed, dmg) {
  const b = allocEnemyBullet(state)
  if (!b) return
  const dx = Math.sin(angle)
  const dz = Math.cos(angle)
  b.alive = true
  b.team = 1
  b.x = e.x + dx * 0.8
  b.z = e.z + dz * 0.8
  const mult = WAVE.B_SPEED_MULT(state.wave)
  b.vx = dx * speed * mult
  b.vz = dz * speed * mult
  b.life = 4
  b.r = 0.28
  b.dmg = dmg
  b.pierce = 0
  b.heavy = false
  b.knockback = 0
}

function aimAngle(e, p) {
  return Math.atan2(p.x - e.x, p.z - e.z)
}

export function stepEnemies(state, dt) {
  const p = state.player
  const bSpeedMult = WAVE.B_SPEED_MULT(state.wave)

  for (const e of state.enemies) {
    if (!e.alive) continue
    e.contactCd = Math.max(0, e.contactCd - dt)
    e.fireCd = Math.max(0, e.fireCd - dt)
    e.staggerT = Math.max(0, e.staggerT - dt)

    if (e.type === 'BOSS') {
      stepBoss(state, e, dt)
      continue
    }

    if (e.staggerT > 0) continue

    const dx = p.x - e.x
    const dz = p.z - e.z
    const dist = Math.hypot(dx, dz) || 1
    e.facing = Math.atan2(dx, dz)

    switch (e.type) {
      case 'SCRAP': {
        e.x += (dx / dist) * e.speed * dt
        e.z += (dz / dist) * e.speed * dt
        break
      }
      case 'GUNNER': {
        const def = ENEMY.GUNNER
        if (dist > def.RANGE) {
          e.x += (dx / dist) * e.speed * dt
          e.z += (dz / dist) * e.speed * dt
        } else {
          // strafe
          e.x += (-dz / dist) * e.speed * 0.7 * dt
          e.z += (dx / dist) * e.speed * 0.7 * dt
        }
        if (e.fireCd <= 0 && dist < def.RANGE + 4) {
          e.fireCd = def.FIRE_CD
          const base = aimAngle(e, p)
          const spread = (def.SPREAD * Math.PI) / 180
          for (let i = 0; i < def.SHOTS; i++) {
            const a = base + (i - (def.SHOTS - 1) / 2) * spread
            fireAimed(state, e, a, def.B_SPEED, def.B_DMG)
          }
        }
        break
      }
      case 'SPINNER': {
        const def = ENEMY.SPINNER
        e.orbitAngle += dt * 0.9
        const tx = p.x + Math.cos(e.orbitAngle) * def.ORBIT
        const tz = p.z + Math.sin(e.orbitAngle) * def.ORBIT
        e.x += (tx - e.x) * Math.min(1, e.speed * 0.15 * dt)
        e.z += (tz - e.z) * Math.min(1, e.speed * 0.15 * dt)
        if (e.fireCd <= 0) {
          e.fireCd = def.FIRE_CD
          for (let i = 0; i < def.RING; i++) {
            const a = (i / def.RING) * Math.PI * 2
            fireAimed(state, e, a, def.B_SPEED, def.B_DMG)
          }
        }
        break
      }
      case 'LANCER': {
        const def = ENEMY.LANCER
        if (e.phase === 0) {
          // idle until in range conceptually — always "ready"
          if (e.fireCd <= 0) {
            e.phase = 1
            e.telegraphT = def.TELEGRAPH
            // fixed aim point
            const a = aimAngle(e, p)
            e.telegraphX = e.x + Math.sin(a) * 40
            e.telegraphZ = e.z + Math.cos(a) * 40
          }
        } else if (e.phase === 1) {
          e.telegraphT -= dt
          if (e.telegraphT <= 0) {
            e.phase = 2
            e.telegraphT = def.FIRE
            // laser hit check done in collision via flag
            state.events.push({
              type: 'laser',
              x0: e.x,
              z0: e.z,
              x1: e.telegraphX,
              z1: e.telegraphZ,
              dmg: def.DMG,
            })
            // instant line damage
            applyLaser(state, e.x, e.z, e.telegraphX, e.telegraphZ, def.DMG)
          }
        } else if (e.phase === 2) {
          e.telegraphT -= dt
          if (e.telegraphT <= 0) {
            e.phase = 3
            e.telegraphT = def.RECOVER
          }
        } else {
          e.telegraphT -= dt
          if (e.telegraphT <= 0) {
            e.phase = 0
            e.fireCd = 0.3
          }
        }
        break
      }
      case 'BULWARK': {
        e.x += (dx / dist) * e.speed * dt
        e.z += (dz / dist) * e.speed * dt
        break
      }
      default:
        break
    }
    void bSpeedMult
  }
}

function applyLaser(state, x0, z0, x1, z1, dmg) {
  const p = state.player
  // distance from point to segment
  const dx = x1 - x0
  const dz = z1 - z0
  const len2 = dx * dx + dz * dz || 1
  let t = ((p.x - x0) * dx + (p.z - z0) * dz) / len2
  t = Math.max(0, Math.min(1, t))
  const px = x0 + dx * t
  const pz = z0 + dz * t
  const dist = Math.hypot(p.x - px, p.z - pz)
  if (dist < 0.7) {
    // lazy import avoid cycle — call via state event handled in damage
    state.events.push({ type: 'laserHit', dmg, x: px, z: pz })
  }
}

function stepBoss(state, e, dt) {
  const p = state.player
  const def = ENEMY.BOSS
  if (e.staggerT > 0) return

  // slow chase
  const dx = p.x - e.x
  const dz = p.z - e.z
  const dist = Math.hypot(dx, dz) || 1
  e.facing = Math.atan2(dx, dz)
  e.x += (dx / dist) * e.speed * (e.bossPhase >= 3 ? 1.4 : 1) * dt
  e.z += (dz / dist) * e.speed * (e.bossPhase >= 3 ? 1.4 : 1) * dt

  e.fireCd -= dt
  if (e.fireCd > 0) return

  const hpRatio = e.hp / e.maxHp
  if (hpRatio > def.PHASES[0]) e.bossPhase = 1
  else if (hpRatio > def.PHASES[1]) e.bossPhase = 2
  else e.bossPhase = 3

  if (e.bossPhase === 1) {
    e.fireCd = 3.5
    // radial wall with gap
    const gap = ((state.wave * 0.7 + performance.now() * 0.0003) % (Math.PI * 2))
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2
      let diff = a - gap
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      if (Math.abs(diff) < (40 * Math.PI) / 180 / 2) continue
      fireAimed(state, e, a, 10, 12)
    }
  } else if (e.bossPhase === 2) {
    e.fireCd = 2.8
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + e.orbitAngle
      fireAimed(state, e, a, 11, 12)
    }
    e.orbitAngle += 0.4
    // laser sweep event
    state.events.push({
      type: 'bossLaser',
      x: e.x,
      z: e.z,
      angle: e.facing,
      dur: 2.5,
    })
  } else {
    e.fireCd = 2.2
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2 + e.orbitAngle
      fireAimed(state, e, a, 10, 12)
    }
    e.orbitAngle += (12 * Math.PI) / 180
    // summon scraps every ~8s via phase timer
    e.phase += dt
    if (e.phase > 8) {
      e.phase = 0
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2
        spawnEnemyAt(state, 'SCRAP', e.x + Math.sin(a) * 5, e.z + Math.cos(a) * 5)
      }
    }
  }
}
