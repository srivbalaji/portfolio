import * as THREE from 'three'

const _ndc = new THREE.Vector2()
const _ray = new THREE.Raycaster()
const _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const _hit = new THREE.Vector3()

/**
 * Mutable key/pointer state. Updated by DOM listeners; read by sim systems.
 */
export function createInput() {
  return {
    keys: Object.create(null),
    justPressed: Object.create(null),
    justReleased: Object.create(null),
    mouseX: 0,
    mouseY: 0,
    aimX: 0,
    aimZ: -1,
    lmb: false,
    rmb: false,
    lmbPressed: false,
    rmbPressed: false,
    lmbReleased: false,
    rmbReleased: false,
    canvas: null,
    camera: null,
  }
}

export function clearFrameEdges(input) {
  for (const k of Object.keys(input.justPressed)) delete input.justPressed[k]
  for (const k of Object.keys(input.justReleased)) delete input.justReleased[k]
  input.lmbPressed = false
  input.rmbPressed = false
  input.lmbReleased = false
  input.rmbReleased = false
}

export function bindInput(input, canvas, camera) {
  input.canvas = canvas
  input.camera = camera

  const onKeyDown = (e) => {
    if (!input.keys[e.code]) input.justPressed[e.code] = true
    input.keys[e.code] = true
    if (
      ['Space', 'KeyJ', 'KeyK', 'KeyC', 'KeyP', 'ShiftLeft', 'ShiftRight'].includes(e.code)
    ) {
      e.preventDefault()
    }
  }
  const onKeyUp = (e) => {
    input.keys[e.code] = false
    input.justReleased[e.code] = true
  }
  const updateAim = (clientX, clientY) => {
    if (!input.canvas || !input.camera) return
    const rect = input.canvas.getBoundingClientRect()
    _ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1
    _ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1
    _ray.setFromCamera(_ndc, input.camera)
    if (_ray.ray.intersectPlane(_plane, _hit)) {
      input.aimX = _hit.x
      input.aimZ = _hit.z
    }
    input.mouseX = clientX
    input.mouseY = clientY
  }
  const onMove = (e) => updateAim(e.clientX, e.clientY)
  const onDown = (e) => {
    updateAim(e.clientX, e.clientY)
    if (e.button === 0) {
      input.lmb = true
      input.lmbPressed = true
    }
    if (e.button === 2) {
      input.rmb = true
      input.rmbPressed = true
    }
  }
  const onUp = (e) => {
    if (e.button === 0) {
      input.lmb = false
      input.lmbReleased = true
    }
    if (e.button === 2) {
      input.rmb = false
      input.rmbReleased = true
    }
  }
  const onContext = (e) => {
    if (e.target === canvas || canvas.contains?.(e.target)) e.preventDefault()
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mousedown', onDown)
  window.addEventListener('mouseup', onUp)
  canvas.addEventListener('contextmenu', onContext)

  return () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mousedown', onDown)
    window.removeEventListener('mouseup', onUp)
    canvas.removeEventListener('contextmenu', onContext)
  }
}

export function readMove(input) {
  let x = 0
  let z = 0
  if (input.keys.KeyA || input.keys.ArrowLeft) x -= 1
  if (input.keys.KeyD || input.keys.ArrowRight) x += 1
  if (input.keys.KeyW || input.keys.ArrowUp) z -= 1
  if (input.keys.KeyS || input.keys.ArrowDown) z += 1
  const len = Math.hypot(x, z)
  if (len > 0) {
    x /= len
    z /= len
  }
  return { x, z }
}

export function shiftDown(input) {
  return !!(input.keys.ShiftLeft || input.keys.ShiftRight)
}
