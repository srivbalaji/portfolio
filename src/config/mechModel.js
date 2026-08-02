/**
 * Camera presets — each major tab has exactly two angles:
 *   start — approach keyframe when entering that section
 *   end   — canonical settled framing (departure point when leaving)
 *
 * Cross-section nav: one continuous move — current.end → next.start (via) → next.end
 * Model rifle sits on +X when facing -Z; positive mechRotY swings it away from front camera.
 */

const FOCUS = [0, 1.58, 0]

/** Canonical settled angles — do not drift these when tuning start poses */
const SECTION_ENDS = {
  hero: { pos: [0.4, 1.5, 1.18], look: FOCUS, mechRotY: 0.6, orbit: true },
  about: { pos: [-0.72, 1.54, 1.72], look: FOCUS, mechRotY: 0.38 },
  projects: { pos: [0.08, 1.54, 1.06], look: [0, 1.6, 0], mechRotY: 1.08 },
  experience: { pos: [-0.92, 2.08, 1.38], look: [0, 1.36, 0], mechRotY: -0.32 },
  skills: { pos: [-1.36, 1.43, 0.14], look: [0, 1.5, 0], mechRotY: 0.88 },
  /* low rear-quarter, looking up at the unit */
  contact: { pos: [-1.12, 0.76, -0.88], look: [0.04, 1.78, 0], mechRotY: Math.PI + 0.58 },
}

export const SECTION_CAMERAS = {
  hero: {
    start: { pos: [...SECTION_ENDS.hero.pos], look: [...SECTION_ENDS.hero.look], mechRotY: SECTION_ENDS.hero.mechRotY },
    end: SECTION_ENDS.hero,
  },
  about: {
    start: { pos: [-0.55, 1.52, 1.95], look: FOCUS, mechRotY: 0.32 },
    end: SECTION_ENDS.about,
  },
  projects: {
    start: { pos: [0.08, 1.52, 1.28], look: [0, 1.59, 0], mechRotY: 1.02 },
    end: SECTION_ENDS.projects,
  },
  experience: {
    start: { pos: [-0.62, 1.78, 1.62], look: [0, 1.48, 0], mechRotY: -0.12 },
    end: SECTION_ENDS.experience,
  },
  skills: {
    start: { pos: [-0.95, 1.48, 0.72], look: [0, 1.52, 0], mechRotY: 0.55 },
    end: SECTION_ENDS.skills,
  },
  contact: {
    start: { pos: [0.14, 1.62, 1.32], look: FOCUS, mechRotY: 0.48 },
    end: SECTION_ENDS.contact,
  },
}

export const MECH_MODELS = {
  freedom: {
    id: 'freedom',
    label: 'ZGMF-X10A Freedom Gundam',
    paths: ['/assets/models/freedom/model.glb', '/assets/models/freedom/model.gltf'],
    transform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
    },
    camera: {
      hangar: { pos: [0.45, 1.49, 1.32], look: FOCUS, mechRotY: 0.72 },
      faceIntro: { pos: [0.08, 1.52, 1.34], look: [0, 1.59, 0], mechRotY: 1.08 },
      face: { pos: [0.08, 1.54, 1.06], look: [0, 1.6, 0], mechRotY: 1.08 },
    },
    credits: {
      title: 'gundam freedom',
      author: 'cosmos28',
      license: 'CC BY 4.0',
      url: 'https://sketchfab.com/3d-models/gundam-freedom-02042775eda240c09d8a39ecc989ad29',
    },
  },
  rx78: {
    id: 'rx78',
    label: 'RX-78-2 Gundam',
    paths: ['/assets/models/rx78/model.gltf'],
    transform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
    },
    camera: {
      hangar: { pos: [0.25, 1.4, 2.1], look: [0, 1.55, 0], mechRotY: 0.5 },
      faceIntro: { pos: [0.36, 1.5, 1.38], look: [0, 1.57, 0], mechRotY: 0.6 },
      face: { pos: [0.38, 1.52, 1.15], look: FOCUS, mechRotY: 0.6 },
    },
    credits: {
      title: 'MS Gundam RX-78-2 with weapons',
      author: 'Tipatat Chennavasin',
      license: 'CC BY 3.0',
      url: 'https://icosa.gallery/view/fHalccv7ORh',
    },
  },
}

export const ACTIVE_MECH = MECH_MODELS.freedom
export const FALLBACK_MECH = MECH_MODELS.rx78

export const MECH_TARGET_HEIGHT = 2.0
export const INTRO_ZOOM_DURATION = 1.35

/** Pause after nav click before the camera leg begins */
export const CAMERA_NAV_DELAY_MS = 200

/** Duration of each camera leg (travel or enter) */
export const CAMERA_TURN_MS = 1500

export function getSectionCamera(section, phase = 'end') {
  const entry = SECTION_CAMERAS[section]
  if (!entry) return SECTION_ENDS.hero
  if (entry.start && entry.end) return entry[phase] ?? entry.end
  return entry
}

export function getCameraForTarget(target, mechConfig = ACTIVE_MECH) {
  if (target === 'hangar') return mechConfig.camera.hangar
  if (target === 'faceIntro') return mechConfig.camera.faceIntro ?? mechConfig.camera.face
  if (target === 'face') return mechConfig.camera.face
  return getSectionCamera(target, 'end')
}

/** True when start/end poses are close enough to skip the enter leg */
export function sectionEnterIsInstant(section) {
  const start = getSectionCamera(section, 'start')
  const end = getSectionCamera(section, 'end')
  const dp = Math.hypot(
    start.pos[0] - end.pos[0],
    start.pos[1] - end.pos[1],
    start.pos[2] - end.pos[2],
  )
  const dr = Math.abs((start.mechRotY ?? 0) - (end.mechRotY ?? 0))
  return dp < 0.04 && dr < 0.04
}
