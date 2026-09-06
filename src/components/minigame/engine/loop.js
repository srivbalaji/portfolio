import { CAMERA, SIM } from '../constants'
import { syncHud } from './GameState'
import { clearFrameEdges } from './input'
import { stepPlayer } from './systems/playerSystem'
import { stepWeapon } from './systems/weaponSystem'
import { stepSpawn, stepBreather } from './systems/spawnSystem'
import { stepEnemies } from './systems/enemySystem'
import { stepBullets } from './systems/bulletSystem'
import { stepCollision, stepCombo } from './systems/collisionSystem'

export function stepSimulation(state, input, dt) {
  state.events.length = 0

  if (state.phase === 'countdown') {
    state.countdownT -= dt
    if (state.countdownT <= 0) {
      state.phase = 'playing'
      state.bannerText = 'WAVE 01'
      state.bannerT = 1.2
    }
    clearFrameEdges(input)
    return
  }

  if (state.phase === 'breather') {
    stepBreather(state, dt)
    // still allow player movement during breather
    stepPlayer(state, input, dt)
    stepCombo(state, dt)
    syncHud(state)
    clearFrameEdges(input)
    return
  }

  if (state.phase !== 'playing' || state.paused) {
    clearFrameEdges(input)
    return
  }

  stepPlayer(state, input, dt)
  stepWeapon(state, input, dt)
  stepSpawn(state, dt)
  stepEnemies(state, dt)
  stepBullets(state, dt)
  stepCollision(state)
  stepCombo(state, dt)

  if (state.bannerT > 0) state.bannerT -= dt

  // trauma decay
  state.trauma = Math.max(0, state.trauma - CAMERA.SHAKE_DECAY * dt)

  // VFX life
  for (const v of state.vfx) {
    if (!v.alive) continue
    v.life -= dt
    if (v.life <= 0) v.alive = false
  }

  syncHud(state)
  clearFrameEdges(input)
}

/**
 * Fixed-timestep accumulator. Call from useFrame with real delta seconds.
 */
export function createLoop(state, input, onEvents) {
  let acc = 0
  return (delta) => {
    if (!state.running && state.phase !== 'countdown' && state.phase !== 'breather') {
      // still process pause keys externally
      return
    }
    acc += Math.min(delta, SIM.MAX_FRAME)
    while (acc >= SIM.DT) {
      if (state.hitstop > 0) {
        state.hitstop -= SIM.DT
      } else {
        stepSimulation(state, input, SIM.DT * state.timeScale)
        if (onEvents && state.events.length) onEvents(state.events)
      }
      acc -= SIM.DT
    }
  }
}
