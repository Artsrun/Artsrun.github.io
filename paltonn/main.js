import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { nameParts, literal, gonName, greekNum, solidFor, faceTypes, vec, GON } from './lib.js'
import { PLATO, PLATO_STORY, KNOWN, HOW } from './lore.js'

const $ = s => document.querySelector(s)
const MAX_DRAW = 1200, MAX_LABELS = 160
const SEG_COLORS = ['var(--acc)', 'var(--teal)', 'var(--red)', '#a99be8', '#8fb8e6']
const FACE_COLORS = { 3: 0x7ec8b8, 4: 0xc4a35a, 5: 0xe07a5f, 6: 0x9d8df1, 7: 0x6fb3e0 }
const faceColor = k => new THREE.Color(FACE_COLORS[k] ?? 0xd98fb5)

// ---------- three ----------
const view = $('#view'), tip = $('#tip')
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
view.prepend(renderer.domElement)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
camera.position.set(0, 0.8, 6.4)
scene.add(camera)
const controls = new OrbitControls(camera, renderer.domElement)
Object.assign(controls, { enableDamping: true, enablePan: false, autoRotate: true, autoRotateSpeed: 1.1, minDistance: 3, maxDistance: 14 })
scene.add(new THREE.HemisphereLight(0xfff4e0, 0x1a1c20, 1.3))
const key = new THREE.DirectionalLight(0xffffff, 1.7)
key.position.set(2.5, 3, 4)
camera.add(key)
const group = new THREE.Group()
scene.add(group)

const resize = () => { const w = view.clientWidth; renderer.setSize(w, w, false) }
new ResizeObserver(resize).observe(view)
resize()
renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera) })

// ---------- state ----------
const state = { n: 64, labels: 'greek', spin: true }
let solid = null     // { mesh, ranges, faces, colors }
let hovered = -1

const disposeAll = () => {
  group.traverse(o => { o.geometry?.dispose(); o.material?.map?.dispose(); o.material?.dispose() })
  group.clear()
  group.rotation.set(0, 0, 0)
  solid = null; hovered = -1
}

const labelText = i => state.labels === 'greek' ? greekNum(i + 1) : String(i + 1)

const labelMesh = (text, size) => {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const g = c.getContext('2d')
  let fs = 150
  g.font = `600 ${fs}px ui-sans-serif, system-ui, sans-serif`
  const w = g.measureText(text).width
  if (w > 210) { fs *= 210 / w; g.font = `600 ${fs}px ui-sans-serif, system-ui, sans-serif` }
  g.fillStyle = 'rgba(11,12,14,.82)'; g.textAlign = 'center'; g.textBaseline = 'middle'
  g.fillText(text, 128, 136)
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }))
  return m
}

const buildSolid = n => {
  const P = solidFor(n)
  const s = 1.55 / P.R
  const faces = P.faces.map(f => ({ normal: f.normal, verts: f.verts.map(v => vec.scale(v, s)) }))
  const pos = [], col = [], edges = [], ranges = []
  faces.forEach(f => {
    const c = faceColor(f.verts.length), a = pos.length / 3
    for (let k = 1; k < f.verts.length - 1; k++)
      for (const v of [f.verts[0], f.verts[k], f.verts[k + 1]]) { pos.push(...v); col.push(c.r, c.g, c.b) }
    ranges.push([a, pos.length / 3])
    f.verts.forEach((v, i) => edges.push(...v, ...f.verts[(i + 1) % f.verts.length]))
  })
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  geo.computeVertexNormals()
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    vertexColors: true, flatShading: true, roughness: 0.55, metalness: 0.05,
    polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
  }))
  const eg = new THREE.BufferGeometry()
  eg.setAttribute('position', new THREE.Float32BufferAttribute(edges, 3))
  const lines = new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: 0x0b0c0e, transparent: true, opacity: n > 400 ? 0.45 : 0.8 }))
  group.add(mesh, lines)

  // face index for each triangle
  const tri2face = []
  faces.forEach((f, i) => { for (let k = 2; k < f.verts.length; k++) tri2face.push(i) })
  mesh.userData.tri2face = tri2face

  if (state.labels !== 'off' && n <= MAX_LABELS) faces.forEach((f, i) => {
    const c = f.verts.reduce((a, v) => vec.add(a, v), [0, 0, 0]).map(x => x / f.verts.length)
    const inr = Math.min(...f.verts.map((A, k) => {
      const B = f.verts[(k + 1) % f.verts.length], AB = vec.sub(B, A)
      return vec.len(vec.cross(AB, vec.sub(c, A))) / vec.len(AB)
    }))
    const lm = labelMesh(labelText(i), inr * 1.25)
    lm.position.set(...vec.add(c, vec.scale(f.normal, 0.004)))
    lm.lookAt(...vec.add(c, f.normal))
    group.add(lm)
  })
  solid = { mesh, ranges, faces, colors: geo.getAttribute('color'), base: col.slice() }
  return P
}

// n < 4: no solid in space; draw the spherical tiling (lunes)
const buildLunes = n => {
  const lunes = []
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 64, 40, (i / n) * Math.PI * 2, (Math.PI * 2) / n),
      new THREE.MeshStandardMaterial({ color: [0x7ec8b8, 0xc4a35a, 0xe07a5f][i], roughness: 0.6 }))
    m.userData.lune = i
    lunes.push(m)
  }
  group.add(...lunes)
  const seams = []
  if (n > 1) for (let i = 0; i < n; i++) {
    const phi = (i / n) * Math.PI * 2
    for (let k = 0; k < 48; k++) for (const t of [k, k + 1]) {
      const th = (t / 48) * Math.PI, r = 1.352
      seams.push(r * Math.sin(th) * Math.sin(phi), r * Math.cos(th), r * Math.sin(th) * Math.cos(phi))
    }
  }
  if (seams.length) {
    const sg = new THREE.BufferGeometry()
    sg.setAttribute('position', new THREE.Float32BufferAttribute(seams, 3))
    group.add(new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: 0x0b0c0e })))
  }
  group.rotation.set(0.45, 0, 0.35)
  const dots = new THREE.Group()
  const pole = y => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), new THREE.MeshBasicMaterial({ color: 0xe8e4d9 })); d.position.y = y; return d }
  if (n === 1) dots.add(pole(1.36)); else dots.add(pole(1.36), pole(-1.36))
  group.add(dots)
  return { V: n === 1 ? 1 : 2, E: n === 1 ? 0 : n, F: n }
}

// ---------- hover ----------
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2()
const paint = (i, on) => {
  const [a, b] = solid.ranges[i], c = solid.colors
  for (let v = a; v < b; v++) for (let d = 0; d < 3; d++) {
    const base = solid.base[v * 3 + d]
    c.array[v * 3 + d] = on ? base + (1 - base) * 0.45 : base
  }
  c.needsUpdate = true
}
const idleTip = () => {
  tip.textContent = state.n > MAX_DRAW ? `drawing stops at ${MAX_DRAW} faces · the name keeps counting`
    : state.n < 4 ? 'drag to turn · a sphere, not a solid' : 'drag to turn · hover a face'
}

renderer.domElement.addEventListener('pointermove', e => {
  const r = renderer.domElement.getBoundingClientRect()
  ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
  ray.setFromCamera(ptr, camera)
  const hit = ray.intersectObjects(group.children, false).find(h => h.object.userData.tri2face || h.object.userData.lune !== undefined)
  if (!solid) { tip.textContent = hit ? `lune ${hit.object.userData.lune + 1} of ${state.n}` : ''; if (!hit) idleTip(); return }
  const f = hit?.object.userData.tri2face ? hit.object.userData.tri2face[hit.faceIndex] : -1
  if (f === hovered) return
  if (hovered >= 0) paint(hovered, false)
  hovered = f
  if (f < 0) return idleTip()
  paint(f, true)
  const k = solid.faces[f].verts.length
  tip.textContent = `face ${greekNum(f + 1)} · ${f + 1} of ${state.n} · ${gonName(k)}`
})
renderer.domElement.addEventListener('pointerleave', () => { if (solid && hovered >= 0) paint(hovered, false); hovered = -1; idleTip() })

// ---------- text ----------
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const plural = (k, c) => `${c} ${gonName(k)}${c === 1 ? '' : 's'}`

const renderName = n => {
  const parts = nameParts(n)
  $('#word').innerHTML = parts.map((m, i) =>
    `<span data-i="${i}" tabindex="0" style="color:${SEG_COLORS[i % SEG_COLORS.length]}">${m.t}</span>`).join('')
  $('#lit').textContent = `literally “${literal(n)}”`
  $('#morphs').innerHTML = parts.map((m, i) => `
    <div class="morph" data-i="${i}">
      <span class="seg" style="color:${SEG_COLORS[i % SEG_COLORS.length]}">${i ? '-' : ''}${m.t}${i < parts.length - 1 ? '-' : ''}</span>
      <span class="gr">${m.g}<i>${m.r}</i></span>
      <span class="mean">${esc(m.m)}</span>
      ${m.n ? `<span class="note">${esc(m.n)}</span>` : ''}
    </div>`).join('')
}

const focusSeg = i => {
  $('#word').classList.toggle('focus', i !== null)
  document.querySelectorAll('#word span, .morph').forEach(el => el.classList.toggle('on', el.dataset.i === String(i)))
}
const segOf = e => e.target.closest('[data-i]')?.dataset.i ?? null
for (const root of [$('#word'), $('#morphs')]) {
  root.addEventListener('pointerover', e => focusSeg(segOf(e)))
  root.addEventListener('pointerleave', () => focusSeg(null))
  root.addEventListener('focusin', e => focusSeg(segOf(e)))
  root.addEventListener('focusout', () => focusSeg(null))
}

const renderAbout = (n, stats) => {
  const p = PLATO[n]
  $('#kind').textContent = p ? `platonic solid · element: ${p.el}` : n < 4 ? 'spherical only' : 'polyhedron'
  const types = stats?.types?.map(([k, c]) => plural(k, c)).join(' · ')
  $('#stats').innerHTML = !stats ? `F ${n} <span>· too many to draw here</span>` :
    `F ${stats.F} · E ${stats.E} · V ${stats.V} <span>· V − E + F = ${stats.V - stats.E + stats.F}</span>` +
    (p ? `<br>Schläfli ${p.s}` : '') + (types ? `<br>${types}` : '')
  const paras = []
  if (p) paras.push(p.why, ...PLATO_STORY)
  else {
    if (KNOWN[n]) paras.push(n < 4 ? KNOWN[n] : `Worth knowing: ${KNOWN[n]}`)
    if (n >= 4) paras.push(HOW(!!KNOWN[n]))
  }
  paras.push(`Faces are labelled in Greek alphabetic numerals: α = 1 … θ = 9, ι = 10, κ = 20, ρ = 100. ϛ, ϙ and ϡ are letters Greek dropped from writing but kept for counting.`)
  paras.push(`Face shapes end in -${GON.t}: ${GON.g} (${GON.r}), “${GON.m}”. ${GON.n}`)
  $('#about').innerHTML = paras.map(t => `<p>${esc(t)}</p>`).join('')
}

// ---------- flow ----------
let timer = 0
const go = (n, push = true) => {
  n = Math.max(1, Math.min(9999, Math.round(+n) || 1))
  state.n = n
  $('#n').value = n
  document.querySelectorAll('#presets button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.n === n))
  if (push) history.replaceState(null, '', `#${n}`)
  renderName(n)
  clearTimeout(timer)
  timer = setTimeout(() => draw(n), 120)
}

const draw = n => {
  if (n > MAX_DRAW) {
    disposeAll()
    renderAbout(n, null)
    $('#labhint').textContent = ''
    tip.textContent = `drawing stops at ${MAX_DRAW} faces · the name keeps counting`
    return
  }
  disposeAll()
  let stats
  if (n < 4) stats = buildLunes(n)
  else { const P = buildSolid(n); stats = { V: P.V, E: P.E, F: P.F, types: faceTypes(P.faces) } }
  $('#labhint').textContent = n > MAX_LABELS && state.labels !== 'off' ? `Labels hidden above ${MAX_LABELS} faces; hover still names each one.` : ''
  renderAbout(n, stats)
  idleTip()
}

// presets
$('#presets').innerHTML = '<span class="lbl">Platonic</span>' +
  [4, 6, 8, 12, 20].map(n => `<button data-n="${n}">${n}</button>`).join('') +
  '<span class="lbl" style="margin-left:.5rem">Others</span>' +
  [3, 14, 32, 64, 120].map(n => `<button data-n="${n}">${n}</button>`).join('')
$('#presets').addEventListener('click', e => { const b = e.target.closest('button'); if (b) go(b.dataset.n) })

$('#n').addEventListener('input', e => { if (e.target.value) go(e.target.value) })
$('#dec').addEventListener('click', () => go(state.n - 1))
$('#inc').addEventListener('click', () => go(state.n + 1))

document.querySelectorAll('[data-lab]').forEach(b => b.addEventListener('click', () => {
  state.labels = b.dataset.lab
  document.querySelectorAll('[data-lab]').forEach(x => x.setAttribute('aria-pressed', x === b))
  draw(state.n)
}))
document.querySelector('[data-lab="greek"]').setAttribute('aria-pressed', 'true')

$('#spin').addEventListener('click', e => {
  state.spin = controls.autoRotate = !controls.autoRotate
  e.target.setAttribute('aria-pressed', state.spin)
})

addEventListener('hashchange', () => go(location.hash.slice(1), false))
go(+location.hash.slice(1) || 64, false)
