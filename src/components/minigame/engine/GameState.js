import { PLAYER, WAVE, POOL } from '../constants'

function makeBullet() {
  return {
    alive: false,
    x: 0,
    z: 0,
    vx: 0,
    vz: 0,
    life: 0,
    r: 0.22,
    dmg: 0,
    pierce: 0,
    heavy: false,
    team: 0, // 0 player, 1 enemy
    knockback: 0,
  }
}

function makeEnemy() {
  return {
    alive: false,
    type: 'SCRAP',
    x: 0,
    z: 0,
    vx: 0,
    vz: 0,
    hp: 0,
    maxHp: 0,
    r: 0.7,
    speed: 0,
    contact: 0,
    fireCd: 0,
    phase: 0,
    facing: 0,
    orbitAngle: 0,
    contactCd: 0,
    telegraphT: 0,
    telegraphX: 0,
    telegraphZ: 0,
    shieldArc: 0,
    // boss
    parts: null,
    bossPhase: 0,
    staggerT: 0,
  }
}

function makeVfx() {
  return {
    alive: false,
    kind: 'ring',
    x: 0,
    z: 0,
    life: 0,
    maxLife: 0.35,
    scale: 1,
    rot: 0,
  }
}

function makeWarning() {
  return {
    alive: false,
    edge: 'north',
    x: 0,
    z: 0,
    t: 0,
    duration: 0.9,
    type: 'SCRAP',
  }
}

export function createGameState() {
  const playerBullets = Array.from({ length: POOL.PLAYER_BULLETS }, makeBullet)
  const enemyBullets = Array.from({ length: POOL.ENEMY_BULLETS }, makeBullet)
  const enemies = Array.from({ length: POOL.ENEMIES }, makeEnemy)
  const vfx = Array.from({ length: POOL.VFX }, makeVfx)
  const warnings = Array.from({ length: 16 }, makeWarning)

  return {
    running: false,
    paused: false,
    phase: 'ready', // ready | countdown | playing | breather | gameover
    timeScale: 1,
    hitstop: 0,
    trauma: 0,
    reducedMotion: false,

    player: {
      x: 0,
      z: 0,
      vx: 0,
      vz: 0,
      yaw: 0,
      hp: PLAYER.HP,
      iframes: 0,
      dashCharges: PLAYER.DASH.CHARGES,
      dashCd: 0,
      dashRecharge: 0,
      dashT: 0,
      dashIframes: 0,
      dashDirX: 0,
      dashDirZ: 0,
      boost: PLAYER.BOOST.MAX,
      boosting: false,
      boostRegenDelay: 0,
      shiftHold: 0,
      shiftWasDown: false,
      muzzleSide: 1,
      lightTimer: 0,
      snapCd: 0,
      charging: false,
      chargeT: 0,
      meleePhase: 'idle', // idle | windup | active | recover
      meleeT: 0,
      meleeCd: 0,
      meleeProgress: 0, // 0→1 across windup+active for saber sweep
      saberAngle: -0.7, // radians relative to facing; sweeps across front
      saber: false,
      lowHpTriggered: false,
      slowMoT: 0,
      blink: 0,
    },

    score: 0,
    combo: 1,
    comboT: 0,
    wave: 1,
    waveBudgetLeft: 0,
    waveGroupTimer: 0,
    breatherT: 0,
    enemiesKilled: 0,
    deflected: 0,
    waveHit: false,
    lastSpawnEdge: null,
    sameEdgeCount: 0,
    countdownT: 0,
    bannerT: 0,
    bannerText: '',

    aimX: 0,
    aimZ: -1,
    moveX: 0,
    moveZ: 0,

    playerBullets,
    enemyBullets,
    enemies,
    vfx,
    warnings,

    hud: {
      hp: PLAYER.HP,
      boost: PLAYER.BOOST.MAX,
      dashCharges: PLAYER.DASH.CHARGES,
      score: 0,
      wave: 1,
      combo: 1,
      charge: 0,
      enemiesAlive: 0,
      muted: false,
    },

    audio: null,
    events: [], // one-frame visual events for render
  }
}

export function resetRun(state) {
  state.running = true
  state.paused = false
  state.phase = 'countdown'
  state.countdownT = 3
  state.timeScale = 1
  state.hitstop = 0
  state.trauma = 0
  state.score = 0
  state.combo = 1
  state.comboT = 0
  state.wave = 1
  state.waveBudgetLeft = WAVE.BUDGET(1)
  state.waveGroupTimer = 0.4
  state.breatherT = 0
  state.enemiesKilled = 0
  state.deflected = 0
  state.waveHit = false
  state.lastSpawnEdge = null
  state.sameEdgeCount = 0
  state.bannerT = 0
  state.bannerText = ''

  const p = state.player
  p.x = 0
  p.z = 0
  p.vx = 0
  p.vz = 0
  p.yaw = 0
  p.hp = PLAYER.HP
  p.iframes = 1.2
  p.dashCharges = PLAYER.DASH.CHARGES
  p.dashCd = 0
  p.dashRecharge = 0
  p.dashT = 0
  p.dashIframes = 0
  p.boost = PLAYER.BOOST.MAX
  p.boosting = false
  p.boostRegenDelay = 0
  p.shiftHold = 0
  p.shiftWasDown = false
  p.lightTimer = 0
  p.snapCd = 0
  p.charging = false
  p.chargeT = 0
  p.meleePhase = 'idle'
  p.meleeT = 0
  p.meleeCd = 0
  p.meleeProgress = 0
  p.saberAngle = -0.7
  p.saber = false
  p.lowHpTriggered = false
  p.slowMoT = 0
  p.blink = 0

  for (const b of state.playerBullets) b.alive = false
  for (const b of state.enemyBullets) b.alive = false
  for (const e of state.enemies) e.alive = false
  for (const v of state.vfx) v.alive = false
  for (const w of state.warnings) w.alive = false
  state.events.length = 0
  syncHud(state)
}

export function syncHud(state) {
  const p = state.player
  let alive = 0
  for (const e of state.enemies) if (e.alive) alive++
  state.hud.hp = Math.max(0, Math.round(p.hp))
  state.hud.boost = p.boost
  state.hud.dashCharges = Math.floor(p.dashCharges)
  state.hud.score = state.score
  state.hud.wave = state.wave
  state.hud.combo = state.combo
  state.hud.charge = p.charging ? Math.min(1, p.chargeT / 1.0) : 0
  state.hud.enemiesAlive = alive
}

export function addTrauma(state, n) {
  if (state.reducedMotion) n *= 0.5
  state.trauma = Math.min(1, state.trauma + n)
}

export function addHitstop(state, t) {
  state.hitstop = Math.max(state.hitstop, t)
}

export function spawnVfx(state, kind, x, z, life = 0.35, scale = 1) {
  for (const v of state.vfx) {
    if (v.alive) continue
    v.alive = true
    v.kind = kind
    v.x = x
    v.z = z
    v.life = life
    v.maxLife = life
    v.scale = scale
    v.rot = Math.random() * Math.PI * 2
    return v
  }
  return null
}
