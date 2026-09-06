import { PLAYER, ARENA, TRAUMA, HITSTOP, WEAPON } from '../../constants'
import { addTrauma, addHitstop } from '../GameState'
import { readMove, shiftDown } from '../input'

const D = PLAYER.DASH
const B = PLAYER.BOOST

export function stepPlayer(state, input, dt) {
  const p = state.player
  const move = readMove(input)
  state.moveX = move.x
  state.moveZ = move.z
  state.aimX = input.aimX
  state.aimZ = input.aimZ

  // Facing — model face/rifle are on local +Z, so yaw aims +Z toward cursor
  const adx = state.aimX - p.x
  const adz = state.aimZ - p.z
  if (adx * adx + adz * adz > 0.01) {
    const target = Math.atan2(adx, adz)
    let dy = target - p.yaw
    while (dy > Math.PI) dy -= Math.PI * 2
    while (dy < -Math.PI) dy += Math.PI * 2
    p.yaw += dy * Math.min(1, 0.28 * 60 * dt)
  }

  // Timers
  p.iframes = Math.max(0, p.iframes - dt)
  p.dashCd = Math.max(0, p.dashCd - dt)
  p.dashIframes = Math.max(0, p.dashIframes - dt)
  p.blink = p.iframes > 0 ? p.blink + dt : 0
  if (p.slowMoT > 0) {
    p.slowMoT -= dt
    if (p.slowMoT <= 0) state.timeScale = 1
  }

  // Dash recharge
  if (p.dashCharges < D.CHARGES) {
    p.dashRecharge += dt
    if (p.dashRecharge >= D.RECHARGE) {
      p.dashRecharge = 0
      p.dashCharges = Math.min(D.CHARGES, p.dashCharges + 1)
    }
  }

  // Shift tap vs hold
  const shift = shiftDown(input)
  if (shift && !p.shiftWasDown) {
    p.shiftHold = 0
  }
  if (shift) {
    p.shiftHold += dt * 1000
  } else if (p.shiftWasDown) {
    // released — if short tap, dash
    if (p.shiftHold < D.TAP_MS && p.shiftHold > 0) {
      tryDash(state, move)
    }
    p.boosting = false
  }
  p.shiftWasDown = shift

  if (shift && p.shiftHold >= D.TAP_MS) {
    // boost
    if (p.boost >= B.MIN_START || p.boosting) {
      if (p.boost > 0) {
        p.boosting = true
        p.boost = Math.max(0, p.boost - B.DRAIN * dt)
        p.boostRegenDelay = B.REGEN_DELAY
        if (p.boost <= 0) p.boosting = false
      } else {
        p.boosting = false
      }
    }
  } else if (!shift) {
    p.boosting = false
  }

  if (!p.boosting) {
    if (p.boostRegenDelay > 0) p.boostRegenDelay -= dt
    else p.boost = Math.min(B.MAX, p.boost + B.REGEN * dt)
  }

  // Active dash motion
  if (p.dashT > 0) {
    p.dashT -= dt
    p.vx = p.dashDirX * D.SPEED
    p.vz = p.dashDirZ * D.SPEED
  } else {
    // Accel movement
    let maxSpeed = p.boosting ? PLAYER.BOOST_SPEED : PLAYER.SPEED
    if (p.charging) maxSpeed *= WEAPON.CHARGE.MOVE_MULT

    const ax = move.x * PLAYER.ACCEL
    const az = move.z * PLAYER.ACCEL
    p.vx += ax * dt
    p.vz += az * dt

    // Friction
    const friction = Math.exp(-PLAYER.FRICTION * dt)
    if (move.x === 0 && move.z === 0) {
      p.vx *= friction
      p.vz *= friction
    } else {
      // damp excess
      const sp = Math.hypot(p.vx, p.vz)
      if (sp > maxSpeed) {
        p.vx = (p.vx / sp) * maxSpeed
        p.vz = (p.vz / sp) * maxSpeed
      }
    }
  }

  p.x += p.vx * dt
  p.z += p.vz * dt

  const half = ARENA.HALF - 0.8
  p.x = Math.max(-half, Math.min(half, p.x))
  p.z = Math.max(-half, Math.min(half, p.z))
}

function tryDash(state, move) {
  const p = state.player
  if (p.dashCharges < 1 || p.dashCd > 0) return
  let dx = move.x
  let dz = move.z
  if (dx === 0 && dz === 0) {
    dx = Math.sin(p.yaw)
    dz = Math.cos(p.yaw)
  }
  p.dashCharges -= 1
  p.dashCd = D.CD
  p.dashT = D.DUR
  p.dashIframes = D.IFRAMES
  p.dashDirX = dx
  p.dashDirZ = dz
  // cancel charge + melee recovery
  p.charging = false
  p.chargeT = 0
  if (p.meleePhase === 'recover') {
    p.meleePhase = 'idle'
    p.meleeT = 0
    p.saber = false
  }
  addTrauma(state, 0.08)
  state.events.push({ type: 'dash', x: p.x, z: p.z })
}

export function hurtPlayer(state, dmg, fromX, fromZ) {
  const p = state.player
  if (p.iframes > 0 || p.dashIframes > 0) return false
  p.hp -= dmg
  p.iframes = PLAYER.HIT_IFRAMES
  state.waveHit = true
  addHitstop(state, HITSTOP.PLAYER_HIT)
  addTrauma(state, TRAUMA.PLAYER_HIT)

  const dx = p.x - fromX
  const dz = p.z - fromZ
  const len = Math.hypot(dx, dz) || 1
  p.vx += (dx / len) * PLAYER.HIT_KNOCKBACK
  p.vz += (dz / len) * PLAYER.HIT_KNOCKBACK

  // cancel charge
  p.charging = false
  p.chargeT = 0

  if (p.hp <= PLAYER.LOW_HP && !p.lowHpTriggered && !state.reducedMotion) {
    p.lowHpTriggered = true
    p.slowMoT = 0.25
    state.timeScale = 0.35
  }

  if (p.hp <= 0) {
    p.hp = 0
    state.phase = 'gameover'
    state.running = false
    state.events.push({ type: 'playerDeath' })
  }
  return true
}
