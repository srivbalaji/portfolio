/** Lightweight WebAudio synth — no audio files. Spec §12 */

export function createAudio(muted = true) {
  let ctx = null
  let master = null
  let mutedFlag = muted

  function ensure() {
    if (ctx) return true
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
      master = ctx.createGain()
      master.gain.value = mutedFlag ? 0 : 0.35
      master.connect(ctx.destination)
      return true
    } catch {
      return false
    }
  }

  function beep(type, f0, f1, dur, gain = 0.06) {
    if (!ensure() || mutedFlag) return
    if (ctx.state === 'suspended') ctx.resume()
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(f0, t)
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur)
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + dur + 0.02)
  }

  function noise(dur, gain = 0.05) {
    if (!ensure() || mutedFlag) return
    if (ctx.state === 'suspended') ctx.resume()
    const t = ctx.currentTime
    const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.setValueAtTime(2000, t)
    f.frequency.exponentialRampToValueAtTime(400, t + dur)
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    src.connect(f)
    f.connect(g)
    g.connect(master)
    src.start(t)
    src.stop(t + dur)
  }

  return {
    setMuted(m) {
      mutedFlag = m
      if (master) master.gain.value = m ? 0 : 0.35
    },
    isMuted: () => mutedFlag,
    unlock() {
      ensure()
      if (ctx?.state === 'suspended') ctx.resume()
    },
    play(name) {
      switch (name) {
        case 'light':
          beep('square', 880, 440, 0.06, 0.05)
          break
        case 'chargeRelease':
          beep('sine', 300, 80, 0.2, 0.08)
          noise(0.08, 0.04)
          break
        case 'melee':
          noise(0.18, 0.06)
          break
        case 'deflect':
          beep('triangle', 1200, 900, 0.04, 0.07)
          break
        case 'deflectChord':
          beep('triangle', 1200, 1200, 0.05, 0.05)
          setTimeout(() => beep('triangle', 1500, 1500, 0.05, 0.05), 40)
          setTimeout(() => beep('triangle', 1800, 1800, 0.06, 0.05), 80)
          break
        case 'death':
          noise(0.12, 0.05)
          beep('sine', 200, 60, 0.12, 0.06)
          break
        case 'hurt':
          beep('square', 90, 60, 0.15, 0.08)
          break
        case 'wave':
          beep('sine', 440, 440, 0.2, 0.05)
          setTimeout(() => beep('sine', 660, 660, 0.25, 0.05), 120)
          break
        default:
          break
      }
    },
    dispose() {
      try {
        ctx?.close()
      } catch {
        /* ignore */
      }
      ctx = null
      master = null
    },
  }
}
