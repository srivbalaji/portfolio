import { ARENA, WAVE, ENEMY } from '../../constants'

const EDGES = ['north', 'south', 'east', 'west']

function edgePos(edge) {
  const m = ARENA.HALF - WAVE.TELEGRAPH.INSET
  const j = (Math.random() - 0.5) * (ARENA.HALF * 1.7)
  switch (edge) {
    case 'north':
      return { x: j, z: -m }
    case 'south':
      return { x: j, z: m }
    case 'east':
      return { x: m, z: j }
    case 'west':
      return { x: -m, z: j }
    default:
      return { x: 0, z: -m }
  }
}

function pickType(wave) {
  const roll = Math.random()
  if (wave <= 1) return 'SCRAP'
  if (wave === 2) return roll < 0.65 ? 'SCRAP' : 'GUNNER'
  if (wave === 3) {
    if (roll < 0.45) return 'SCRAP'
    if (roll < 0.75) return 'GUNNER'
    return 'SPINNER'
  }
  if (wave === 4) {
    if (roll < 0.35) return 'SCRAP'
    if (roll < 0.6) return 'GUNNER'
    if (roll < 0.85) return 'SPINNER'
    return 'LANCER'
  }
  // 6+
  if (wave >= 6) {
    if (roll < 0.25) return 'SCRAP'
    if (roll < 0.45) return 'GUNNER'
    if (roll < 0.65) return 'SPINNER'
    if (roll < 0.82) return 'LANCER'
    return 'BULWARK'
  }
  // wave 5 is boss — shouldn't ask
  return 'SCRAP'
}

function allocWarning(state) {
  for (const w of state.warnings) if (!w.alive) return w
  return null
}

function allocEnemy(state) {
  for (const e of state.enemies) if (!e.alive) return e
  return null
}

function countAlive(state) {
  let n = 0
  for (const e of state.enemies) if (e.alive) n++
  for (const w of state.warnings) if (w.alive) n++
  return n
}

export function spawnEnemyAt(state, type, x, z) {
  const e = allocEnemy(state)
  if (!e) return null
  const def = ENEMY[type] || ENEMY.SCRAP
  const hpMult = WAVE.HP_MULT(state.wave)
  e.alive = true
  e.type = type
  e.x = x
  e.z = z
  e.vx = 0
  e.vz = 0
  e.hp = def.HP * hpMult
  e.maxHp = e.hp
  e.r = def.R
  e.speed = def.SPEED
  e.contact = def.CONTACT
  e.fireCd = 0.4 + Math.random() * 0.8
  e.phase = 0
  e.facing = 0
  e.orbitAngle = Math.random() * Math.PI * 2
  e.contactCd = 0
  e.telegraphT = 0
  e.shieldArc = def.SHIELD_ARC || 0
  e.parts = null
  e.bossPhase = 0
  e.staggerT = 0
  return e
}

export function spawnBoss(state) {
  const e = spawnEnemyAt(state, 'BOSS', 0, -8)
  if (!e) return
  e.parts = { armL: ENEMY.BOSS.PARTS.ARM, armR: ENEMY.BOSS.PARTS.ARM, core: ENEMY.BOSS.PARTS.CORE }
  e.bossPhase = 1
  state.bannerText = 'GOLIATH'
  state.bannerT = 2
  state.events.push({ type: 'bossSpawn' })
}

export function stepSpawn(state, dt) {
  if (state.phase !== 'playing') return

  // Process warnings → spawn
  for (const w of state.warnings) {
    if (!w.alive) continue
    w.t -= dt
    if (w.t <= 0) {
      w.alive = false
      const p = state.player
      const dist = Math.hypot(w.x - p.x, w.z - p.z)
      let x = w.x
      let z = w.z
      if (dist < WAVE.TELEGRAPH.MIN_DIST) {
        // push inward toward centre
        const len = Math.hypot(x, z) || 1
        x = (x / len) * (ARENA.HALF - 4)
        z = (z / len) * (ARENA.HALF - 4)
      }
      spawnEnemyAt(state, w.type, x, z)
    }
  }

  // Boss wave
  if (state.wave % WAVE.BOSS_EVERY === 0) {
    let hasBoss = false
    for (const e of state.enemies) if (e.alive && e.type === 'BOSS') hasBoss = true
    if (!hasBoss && state.waveBudgetLeft > 0) {
      spawnBoss(state)
      state.waveBudgetLeft = 0
    }
    // wait until boss dead to clear wave
    if (!hasBoss && state.waveBudgetLeft <= 0 && countAlive(state) === 0) {
      beginBreather(state)
    }
    return
  }

  // Normal director
  if (state.waveBudgetLeft > 0 && countAlive(state) < WAVE.CONCURRENT) {
    state.waveGroupTimer -= dt
    if (state.waveGroupTimer <= 0) {
      const size = WAVE.GROUP_MIN + Math.floor(Math.random() * (WAVE.GROUP_MAX - WAVE.GROUP_MIN + 1))
      let edge = EDGES[Math.floor(Math.random() * 4)]
      if (edge === state.lastSpawnEdge && state.sameEdgeCount >= 2) {
        edge = EDGES[(EDGES.indexOf(edge) + 1 + Math.floor(Math.random() * 3)) % 4]
        state.sameEdgeCount = 0
      } else if (edge === state.lastSpawnEdge) {
        state.sameEdgeCount++
      } else {
        state.lastSpawnEdge = edge
        state.sameEdgeCount = 1
      }

      let spawned = 0
      for (let i = 0; i < size && state.waveBudgetLeft > 0; i++) {
        const type = pickType(state.wave)
        const cost = ENEMY[type]?.COST ?? 1
        if (cost > state.waveBudgetLeft) break
        const pos = edgePos(edge)
        const w = allocWarning(state)
        if (!w) break
        w.alive = true
        w.edge = edge
        w.x = pos.x
        w.z = pos.z
        w.duration = WAVE.TELEGRAPH.TOTAL
        w.t = WAVE.TELEGRAPH.TOTAL
        w.type = type
        state.waveBudgetLeft -= cost
        spawned++
      }
      state.waveGroupTimer = WAVE.GROUP_GAP(state.wave)
    }
  }

  // Wave clear
  if (state.waveBudgetLeft <= 0 && countAlive(state) === 0) {
    beginBreather(state)
  }
}

function beginBreather(state) {
  state.phase = 'breather'
  state.breatherT = WAVE.BREATHER
  state.score += 500
  if (!state.waveHit) state.score += 1000
  state.bannerText = `WAVE ${String(state.wave).padStart(2, '0')} CLEAR`
  state.bannerT = 1.5
  // refill
  state.player.boost = 100
  state.player.dashCharges = 2
  state.player.dashRecharge = 0
  state.player.hp = Math.min(100, state.player.hp + 10)
  state.events.push({ type: 'waveClear' })
}

export function stepBreather(state, dt) {
  if (state.phase !== 'breather') return
  state.breatherT -= dt
  if (state.breatherT <= 0) {
    state.wave += 1
    state.waveBudgetLeft = WAVE.BUDGET(state.wave)
    state.waveGroupTimer = 0.6
    state.waveHit = false
    state.phase = 'playing'
    state.bannerText = `WAVE ${String(state.wave).padStart(2, '0')}`
    state.bannerT = 1.2
  }
}
