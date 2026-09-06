/** All combat-sim tuning — no magic numbers elsewhere. Spec v1.0 §16 */

export const SIM = { HZ: 60, DT: 1 / 60, MAX_FRAME: 0.25 }

export const ARENA = { HALF: 22, WALL_H: 1.2, SOFT_MARGIN: 1.5, GRID: 2, SECTOR: 11 }

export const CAMERA = {
  /** High 3/4 chase — clearly not top-down so mech silhouette reads */
  Y: 18,
  /** Camera sits this far along +Z from look target */
  OFFSET_Z: 24,
  LOOK_Y: 1.4,
  FOV: 44,
  FAR: 200,
  LEAN_MAX: 3.5,
  LEAN_LERP: 0.06,
  SHAKE_DECAY: 8,
  SHAKE_MAX_POS: 0.35,
  SHAKE_MAX_ROLL: 0,
}

export const PLAYER = {
  HP: 100,
  RADIUS: 0.45,
  VISUAL_W: 1.6,
  SPEED: 14,
  BOOST_SPEED: 24,
  ACCEL: 90,
  FRICTION: 12,
  HIT_IFRAMES: 0.9,
  HIT_KNOCKBACK: 3.5,
  HIT_HITSTOP: 0.15,
  LOW_HP: 25,
  WAVE_HEAL: 10,
  DASH: {
    SPEED: 42,
    DUR: 0.18,
    IFRAMES: 0.26,
    CD: 0.42,
    CHARGES: 2,
    RECHARGE: 1.1,
    TAP_MS: 180,
  },
  BOOST: {
    MAX: 100,
    DRAIN: 34,
    REGEN: 26,
    REGEN_DELAY: 0.5,
    MIN_START: 12,
  },
}

export const WEAPON = {
  LIGHT: {
    DMG: 6,
    RPS: 8,
    SPEED: 62,
    LIFE: 1.1,
    SPREAD: 1.5,
    R: 0.22,
    PIERCE: 0,
    MUZZLE_X: 0.55,
  },
  CHARGE: {
    MIN_T: 0.45,
    FULL_T: 1.0,
    DMG_MIN: 18,
    DMG_MAX: 45,
    SPEED: 48,
    R_MIN: 0.35,
    R_MAX: 0.55,
    PIERCE_MIN: 1,
    PIERCE_MAX: 3,
    MOVE_MULT: 0.55,
    KNOCKBACK: 6,
    LIFE: 1.6,
  },
  SNAP: { DMG: 22, CD: 1.2, SPEED: 55, R: 0.4, PIERCE: 1, LIFE: 1.3 },
  MELEE: {
    DMG: 40,
    RANGE: 4.2,
    ARC: 130,
    WINDUP: 0.08,
    ACTIVE: 0.22,
    RECOVER: 0.2,
    CD: 0.5,
    LUNGE: 5.5,
    DEFLECT: true,
    DEFLECT_SCORE: 15,
    KILL_MULT: 1.5,
  },
}

export const HITSTOP = {
  SNAP: 0.03,
  CHARGE_FULL: 0.1,
  MELEE: 0.07,
  DEFLECT: 0.04,
  KILL: 0.04,
  PLAYER_HIT: 0.15,
  BOSS_PHASE: 0.3,
}

export const TRAUMA = {
  LIGHT: 0.05,
  HEAVY: 0.15,
  MELEE: 0.3,
  KILL: 0.1,
  PLAYER_HIT: 0.45,
  BOSS_PHASE: 0.8,
}

export const ENEMY = {
  SCRAP: { HP: 24, SPEED: 9, CONTACT: 8, COST: 1, R: 0.7 },
  GUNNER: {
    HP: 32,
    SPEED: 5,
    CONTACT: 6,
    COST: 2,
    R: 0.8,
    RANGE: 14,
    FIRE_CD: 2.2,
    SHOTS: 3,
    SPREAD: 8,
    B_SPEED: 11,
    B_DMG: 10,
  },
  SPINNER: {
    HP: 40,
    SPEED: 7,
    CONTACT: 6,
    COST: 3,
    R: 0.8,
    ORBIT: 10,
    FIRE_CD: 3.0,
    RING: 8,
    B_SPEED: 9,
    B_DMG: 10,
  },
  LANCER: {
    HP: 28,
    SPEED: 0,
    CONTACT: 0,
    COST: 3,
    R: 0.7,
    RANGE: 18,
    TELEGRAPH: 1.1,
    FIRE: 0.15,
    RECOVER: 2.4,
    DMG: 18,
  },
  BULWARK: {
    HP: 90,
    SPEED: 4,
    CONTACT: 14,
    COST: 5,
    R: 1.1,
    SHIELD_ARC: 120,
    SHIELD_REDUCE: 0.7,
    BACK_MULT: 2.0,
  },
  BOSS: {
    HP: 900,
    SPEED: 3,
    CONTACT: 20,
    R: 3.2,
    PARTS: { ARM: 120, CORE: 180 },
    PHASES: [0.66, 0.33],
    STAGGER: 1.2,
    STAGGER_MULT: 1.5,
    SCORE: 5000,
  },
}

export const WAVE = {
  BUDGET: (w) => 6 + 5 * w,
  CONCURRENT: 18,
  GROUP_MIN: 2,
  GROUP_MAX: 4,
  GROUP_GAP: (w) => Math.max(1.0, 1.6 - w * 0.06),
  BREATHER: 2.5,
  TELEGRAPH: { PULSES: 3, TOTAL: 0.9, MARKER_AT: 0.4, INSET: 1.5, MIN_DIST: 8 },
  HP_MULT: (w) => Math.min(1 + 0.06 * (w - 1), 2.5),
  B_SPEED_MULT: (w) => Math.min(1 + 0.02 * (w - 1), 1.3),
  BOSS_EVERY: 5,
}

export const SCORE = {
  SCRAP: 100,
  GUNNER: 150,
  SPINNER: 200,
  LANCER: 250,
  BULWARK: 400,
  COMBO_WINDOW: 3.0,
  COMBO_MAX: 8,
  WAVE_CLEAR: 500,
  NO_HIT_WAVE: 1000,
}

export const MECH = {
  ARMOR: '#eef2f8',
  BINDER: '#2f4a8f',
  BINDER_RIM: '#7fa7ff',
  BINDER_RIM_EM: 0.35,
  TRIM: '#dbe4f2',
  TIP_BAND: '#e4483d',
  VFIN: '#f6c445',
  VFIN_EM: 0.5,
  ACCENT_RED: '#d8342c',
  ACCENT_RED_EM: 0.25,
  EYE: '#ffd23f',
  EYE_EM: 1.4,
  FACE: '#3a4048',
  GUNMETAL: '#4a5058',
  JOINT: '#8a929e',
  FOOT: '#2f4a8f',
  THRUSTER: '#38bdf8',
  HEIGHT: 2.6,
  WINGSPAN: 4.2,
  BINDER_SPREAD: { IDLE: 35, BOOST: 55, DASH: 15 },
}

export const COLOR = {
  PLAYER_LIGHT: '#38bdf8',
  PLAYER_HEAVY: '#fbbf24',
  BLADE: '#f472b6',
  ENEMY_BULLET: '#ffb020',
  ENEMY_BODY: '#ef4444',
  VOID: '#05070d',
  GRID: 'rgba(56,189,248,0.10)',
  WARN: '#ff2d2d',
}

export const STORAGE = {
  BEST: 'combat-sim-best',
  MUTED: 'combat-sim-muted',
}

export const POOL = {
  PLAYER_BULLETS: 512,
  ENEMY_BULLETS: 768,
  ENEMIES: 64,
  VFX: 256,
}
