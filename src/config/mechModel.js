/**
 * Camera presets — face/shoulder focus, varied rotations, gun side avoided.
 * Model rifle sits on +X when facing -Z; positive mechRotY swings it away from front camera.
 */

const FOCUS = [0, 1.58, 0]

/** Cinematic low / rear-quarter angles — contact-style dramatic framing per sector */
export const SECTION_CAMERAS = {
  hero: { pos: [0.92, 0.68, 0.95], look: [0, 1.78, 0], mechRotY: 0.68 },
  about: { pos: [-1.08, 0.62, 0.88], look: [0.03, 1.84, 0], mechRotY: -0.38 },
  projects: { pos: [1.14, 0.66, -0.82], look: [0, 1.86, 0], mechRotY: Math.PI + 0.42 },
  experience: { pos: [-1.1, 0.6, -0.92], look: [0.02, 1.85, 0], mechRotY: Math.PI + 0.68 },
  skills: { pos: [0.18, 0.52, 1.08], look: [0, 1.9, 0], mechRotY: 0.52 },
  contact: { pos: [-1.18, 0.58, -1.02], look: [0.04, 1.88, 0], mechRotY: Math.PI + 0.58 },
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
      /* Intro — tight face/shoulder, rifle swung to +X off-frame */
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

export function getCameraForTarget(target, mechConfig = ACTIVE_MECH) {
  if (target === 'hangar') return mechConfig.camera.hangar
  if (target === 'face') return mechConfig.camera.face
  return SECTION_CAMERAS[target] ?? SECTION_CAMERAS.hero
}
