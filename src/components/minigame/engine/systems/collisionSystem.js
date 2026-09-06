import { PLAYER, WEAPON, ENEMY, SCORE, HITSTOP, TRAUMA } from '../../constants'
import { addHitstop, addTrauma, spawnVfx, syncHud } from '../GameState'
import { hurtPlayer } from './playerSystem'

function angleDiff(a, b) {
  let d = a - b
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return d
}

function killEnemy(state, e, meleeKill) {
  e.alive = false
  state.enemiesKilled++
  let pts = SCORE[e.type] || 100
  if (e.type === 'BOSS') pts = ENEMY.BOSS.SCORE
  if (meleeKill) pts = Math.round(pts * WEAPON.MELEE.KILL_MULT)
  pts = Math.round(pts * Math.min(SCORE.COMBO_MAX, state.combo))
  state.score += pts
  state.combo = Math.min(SCORE.COMBO_MAX, state.combo + 1)
  state.comboT = SCORE.COMBO_WINDOW
  addHitstop(state, HITSTOP.KILL)
  addTrauma(state, TRAUMA.KILL)
  spawnVfx(state, 'burst', e.x, e.z, 0.35, e.r)
  state.events.push({ type: 'sfx', name: 'death' })
  if (e.type === 'BOSS') {
    state.player.hp = PLAYER.HP
    state.bannerText = 'GOLIATH DOWN'
    state.bannerT = 3
  }
}

function damageEnemy(state, e, dmg, fromBehind, isCharge) {
  let final = dmg
  if (e.type === 'BULWARK') {
    const def = ENEMY.BULWARK
    // facing of bulwark toward its movement/player
    const toPlayer = Math.atan2(state.player.x - e.x, state.player.z - e.z)
    const hitAngle = Math.atan2(state.player.x - e.x, state.player.z - e.z) // approximate from player
    // better: attacker is player — check if hit is within frontal shield
    const diff = Math.abs(angleDiff(e.facing, hitAngle))
    const half = ((def.SHIELD_ARC / 2) * Math.PI) / 180
    if (diff < half && !fromBehind) {
      if (isCharge) {
        // full charge punches through at full damage
        final = dmg
      } else {
        final = dmg * (1 - def.SHIELD_REDUCE)
      }
    }
    if (fromBehind) final = dmg * def.BACK_MULT
  }

  if (e.type === 'BOSS' && e.staggerT > 0) {
    final *= ENEMY.BOSS.STAGGER_MULT
  }

  e.hp -= final
  if (e.hp <= 0) {
    killEnemy(state, e, false)
    return true
  }

  // boss phase breaks
  if (e.type === 'BOSS') {
    const ratio = e.hp / e.maxHp
    const phases = ENEMY.BOSS.PHASES
    if (e.bossPhase === 1 && ratio <= phases[0]) {
      e.bossPhase = 2
      e.staggerT = ENEMY.BOSS.STAGGER
      addHitstop(state, HITSTOP.BOSS_PHASE)
      addTrauma(state, TRAUMA.BOSS_PHASE)
    } else if (e.bossPhase === 2 && ratio <= phases[1]) {
      e.bossPhase = 3
      e.staggerT = ENEMY.BOSS.STAGGER
      addHitstop(state, HITSTOP.BOSS_PHASE)
      addTrauma(state, TRAUMA.BOSS_PHASE)
    }
  }
  return false
}

export function stepCollision(state) {
  const p = state.player
  const meleeActive = p.meleePhase === 'active'
  const meleeRange = WEAPON.MELEE.RANGE

  // Player bullets → enemies
  for (const b of state.playerBullets) {
    if (!b.alive) continue
    for (const e of state.enemies) {
      if (!e.alive) continue
      const dist = Math.hypot(b.x - e.x, b.z - e.z)
      if (dist > e.r + b.r) continue

      const fromBehind = Math.abs(angleDiff(e.facing + Math.PI, Math.atan2(b.x - e.x, b.z - e.z))) < Math.PI / 2
      damageEnemy(state, e, b.dmg, fromBehind, b.heavy && b.pierce >= 2)
      addTrauma(state, b.heavy ? TRAUMA.HEAVY : TRAUMA.LIGHT)

      if (b.knockback > 0) {
        const dx = e.x - p.x
        const dz = e.z - p.z
        const len = Math.hypot(dx, dz) || 1
        e.x += (dx / len) * b.knockback * 0.15
        e.z += (dz / len) * b.knockback * 0.15
      }

      if (b.pierce > 0) {
        b.pierce -= 1
        b.dmg = Math.max(1, b.dmg * 0.7)
      } else {
        b.alive = false
        break
      }
    }
  }

  // Melee — hits along the current lightsaber sweep angle (narrower cone around blade)
  if (meleeActive) {
    let deflected = 0
    const bladeCenter = p.yaw + p.saberAngle
    const bladeHalf = 0.45 // ~50° around current blade position
    for (const e of state.enemies) {
      if (!e.alive) continue
      const dx = e.x - p.x
      const dz = e.z - p.z
      const dist = Math.hypot(dx, dz)
      if (dist > meleeRange + e.r || dist < 0.3) continue
      const ang = Math.atan2(dx, dz)
      if (Math.abs(angleDiff(ang, bladeCenter)) > bladeHalf) continue
      const fromBehind = Math.abs(angleDiff(e.facing + Math.PI, ang)) < Math.PI / 2
      const died = damageEnemy(state, e, WEAPON.MELEE.DMG, fromBehind, false)
      addHitstop(state, HITSTOP.MELEE)
      addTrauma(state, TRAUMA.MELEE)
      if (died) {
        state.score += Math.round((SCORE[e.type] || 100) * (WEAPON.MELEE.KILL_MULT - 1))
      }
    }
    for (const b of state.enemyBullets) {
      if (!b.alive) continue
      const dx = b.x - p.x
      const dz = b.z - p.z
      const dist = Math.hypot(dx, dz)
      if (dist > meleeRange || dist < 0.2) continue
      const ang = Math.atan2(dx, dz)
      if (Math.abs(angleDiff(ang, bladeCenter)) > bladeHalf) continue
      b.alive = false
      deflected++
      state.deflected++
      state.score += WEAPON.MELEE.DEFLECT_SCORE
      spawnVfx(state, 'ring', b.x, b.z, 0.25, 0.5)
      addHitstop(state, HITSTOP.DEFLECT)
    }
    if (deflected > 0) {
      state.events.push({ type: 'deflect', count: deflected, x: p.x, z: p.z, yaw: p.yaw })
      if (deflected >= 3) state.events.push({ type: 'sfx', name: 'deflectChord' })
      else state.events.push({ type: 'sfx', name: 'deflect' })
    }
  }

  // Enemy bullets → player
  for (const b of state.enemyBullets) {
    if (!b.alive) continue
    const dist = Math.hypot(b.x - p.x, b.z - p.z)
    if (dist > PLAYER.RADIUS + b.r) continue
    b.alive = false
    hurtPlayer(state, b.dmg, b.x, b.z)
    state.events.push({ type: 'sfx', name: 'hurt' })
  }

  // Contact damage
  for (const e of state.enemies) {
    if (!e.alive || e.contact <= 0 || e.contactCd > 0) continue
    const dist = Math.hypot(e.x - p.x, e.z - p.z)
    if (dist > PLAYER.RADIUS + e.r) continue
    e.contactCd = 0.5
    hurtPlayer(state, e.contact, e.x, e.z)
    state.events.push({ type: 'sfx', name: 'hurt' })
  }

  // Process laser hit events from this frame
  for (const ev of state.events) {
    if (ev.type === 'laserHit') {
      hurtPlayer(state, ev.dmg, ev.x, ev.z)
      state.events.push({ type: 'sfx', name: 'hurt' })
    }
  }

  syncHud(state)
}

export function stepCombo(state, dt) {
  if (state.comboT > 0) {
    state.comboT -= dt
    if (state.comboT <= 0) state.combo = 1
  }
}
