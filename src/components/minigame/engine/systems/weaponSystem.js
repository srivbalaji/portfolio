import { WEAPON, HITSTOP, TRAUMA } from '../../constants'
import { addHitstop, addTrauma } from '../GameState'

const deg = (d) => (d * Math.PI) / 180

function allocPlayerBullet(state) {
  for (const b of state.playerBullets) {
    if (!b.alive) return b
  }
  return null
}

/** Forward = local +Z after yaw (face/rifle side of the SD mesh). */
export function facingDir(yaw) {
  return { dx: Math.sin(yaw), dz: Math.cos(yaw) }
}

function aimDir(state) {
  const p = state.player
  let dx = state.aimX - p.x
  let dz = state.aimZ - p.z
  const len = Math.hypot(dx, dz)
  if (len < 0.001) return facingDir(p.yaw)
  return { dx: dx / len, dz: dz / len }
}

function fireLight(state) {
  const L = WEAPON.LIGHT
  const p = state.player
  // Prefer facing so muzzle stays on the rifle (front), not behind the wings
  const face = facingDir(p.yaw)
  const aim = aimDir(state)
  // Blend slightly toward aim but keep spawn anchored to facing
  let dx = face.dx * 0.85 + aim.dx * 0.15
  let dz = face.dz * 0.85 + aim.dz * 0.15
  const n = Math.hypot(dx, dz) || 1
  dx /= n
  dz /= n

  const spread = deg((Math.random() * 2 - 1) * L.SPREAD)
  const c = Math.cos(spread)
  const s = Math.sin(spread)
  const fdx = dx * c - dz * s
  const fdz = dx * s + dz * c

  const side = p.muzzleSide
  p.muzzleSide *= -1
  // Lateral offset in facing frame
  const rx = -dz * L.MUZZLE_X * side * 0.35 + face.dx * 0.15
  const rz = dx * L.MUZZLE_X * side * 0.35 + face.dz * 0.15

  const b = allocPlayerBullet(state)
  if (!b) return
  b.alive = true
  b.team = 0
  // Spawn well in front of the mech (rifle barrel tip)
  b.x = p.x + face.dx * 1.85 + rx
  b.z = p.z + face.dz * 1.85 + rz
  b.vx = fdx * L.SPEED
  b.vz = fdz * L.SPEED
  b.life = L.LIFE
  b.r = L.R
  b.dmg = L.DMG
  b.pierce = L.PIERCE
  b.heavy = false
  b.knockback = 0
  state.events.push({ type: 'sfx', name: 'light' })
}

function fireHeavy(state, dmg, pierce, r, speed, knockback, full) {
  const p = state.player
  const face = facingDir(p.yaw)
  const aim = aimDir(state)
  let dx = face.dx * 0.7 + aim.dx * 0.3
  let dz = face.dz * 0.7 + aim.dz * 0.3
  const n = Math.hypot(dx, dz) || 1
  dx /= n
  dz /= n

  const b = allocPlayerBullet(state)
  if (!b) return
  b.alive = true
  b.team = 0
  b.x = p.x + face.dx * 2.0
  b.z = p.z + face.dz * 2.0
  b.vx = dx * speed
  b.vz = dz * speed
  b.life = WEAPON.CHARGE.LIFE
  b.r = r
  b.dmg = dmg
  b.pierce = pierce
  b.heavy = true
  b.knockback = knockback
  if (full) {
    addHitstop(state, HITSTOP.CHARGE_FULL)
    addTrauma(state, TRAUMA.HEAVY)
  } else {
    addTrauma(state, TRAUMA.HEAVY * 0.5)
  }
  state.events.push({ type: 'sfx', name: 'chargeRelease' })
}

export function stepWeapon(state, input, dt) {
  const p = state.player
  const W = WEAPON

  p.lightTimer = Math.max(0, p.lightTimer - dt)
  p.snapCd = Math.max(0, p.snapCd - dt)
  p.meleeCd = Math.max(0, p.meleeCd - dt)

  // Light — hold LMB or J press
  if ((input.lmb || input.justPressed.KeyJ) && p.lightTimer <= 0 && p.meleePhase === 'idle') {
    p.lightTimer = 1 / W.LIGHT.RPS
    fireLight(state)
  }

  // Snap heavy K
  if (input.justPressed.KeyK && p.snapCd <= 0 && p.meleePhase === 'idle') {
    p.snapCd = W.SNAP.CD
    fireHeavy(state, W.SNAP.DMG, W.SNAP.PIERCE, W.SNAP.R, W.SNAP.SPEED, 3, false)
    addHitstop(state, HITSTOP.SNAP)
    // cancel charge
    p.charging = false
    p.chargeT = 0
  }

  // Charge RMB
  if (input.rmbPressed && p.meleePhase === 'idle') {
    p.charging = true
    p.chargeT = 0
  }
  if (p.charging && input.rmb) {
    p.chargeT += dt
  }
  if (input.rmbReleased && p.charging) {
    if (p.chargeT >= W.CHARGE.MIN_T) {
      const t = Math.min(1, (p.chargeT - W.CHARGE.MIN_T) / (W.CHARGE.FULL_T - W.CHARGE.MIN_T))
      const dmg = W.CHARGE.DMG_MIN + (W.CHARGE.DMG_MAX - W.CHARGE.DMG_MIN) * t
      const pierce = Math.round(W.CHARGE.PIERCE_MIN + (W.CHARGE.PIERCE_MAX - W.CHARGE.PIERCE_MIN) * t)
      const r = W.CHARGE.R_MIN + (W.CHARGE.R_MAX - W.CHARGE.R_MIN) * t
      fireHeavy(state, dmg, pierce, r, W.CHARGE.SPEED, W.CHARGE.KNOCKBACK, t >= 0.99)
    }
    p.charging = false
    p.chargeT = 0
  }
  if (!input.rmb) {
    // safety
  }

  // Melee C — lightsaber sweep across the front
  if (input.justPressed.KeyC && p.meleeCd <= 0 && p.meleePhase === 'idle') {
    p.meleePhase = 'windup'
    p.meleeT = W.MELEE.WINDUP
    p.meleeCd = W.MELEE.CD
    p.meleeProgress = 0
    p.saberAngle = -0.75 // start cocked left/back
    p.saber = true
    p.charging = false
    p.chargeT = 0
    state.events.push({ type: 'sfx', name: 'melee' })
  }

  if (p.meleePhase !== 'idle') {
    p.meleeT -= dt
    const { dx, dz } = facingDir(p.yaw)
    if (p.meleePhase === 'windup' || p.meleePhase === 'active') {
      p.vx += dx * W.MELEE.LUNGE * dt * 8
      p.vz += dz * W.MELEE.LUNGE * dt * 8
    }

    // Sweep angle: windup holds, active swings -0.75 → +1.35 rad (~120°)
    const totalSwing = W.MELEE.WINDUP + W.MELEE.ACTIVE
    if (p.meleePhase === 'windup') {
      p.meleeProgress = 1 - p.meleeT / W.MELEE.WINDUP
      p.saberAngle = -0.75
    } else if (p.meleePhase === 'active') {
      const t = 1 - p.meleeT / W.MELEE.ACTIVE
      // ease-in-out for a snappy lightsaber cut
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
      p.meleeProgress = (W.MELEE.WINDUP + t * W.MELEE.ACTIVE) / totalSwing
      p.saberAngle = -0.75 + eased * 2.1
    } else {
      // recover — hold at end briefly then retract
      p.saberAngle = 1.35
      p.meleeProgress = 1
    }

    if (p.meleeT <= 0) {
      if (p.meleePhase === 'windup') {
        p.meleePhase = 'active'
        p.meleeT = W.MELEE.ACTIVE
      } else if (p.meleePhase === 'active') {
        p.meleePhase = 'recover'
        p.meleeT = W.MELEE.RECOVER
      } else {
        p.meleePhase = 'idle'
        p.saber = false
        p.meleeProgress = 0
        p.saberAngle = -0.7
      }
    }
  }
}
