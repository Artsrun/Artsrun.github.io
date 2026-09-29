// Pure core: names + geometry. No DOM, no three — node-testable.

// morpheme: t text, g Greek, r translit, m meaning, l literal, n note
const M = (t, g, r, m, l, n) => ({ t, g, r, m, l, n })

const UN = [null,
  M('hena', 'ἕν', 'hén', 'one', 'one'),
  M('di', 'δίς', 'dís', 'twice', 'two'),
  M('tri', 'τρία', 'tría', 'three', 'three'),
  M('tetra', 'τέτταρα', 'téttara', 'four', 'four'),
  M('penta', 'πέντε', 'pénte', 'five', 'five'),
  M('hexa', 'ἕξ', 'héx', 'six', 'six'),
  M('hepta', 'ἑπτά', 'heptá', 'seven', 'seven'),
  M('octa', 'ὀκτώ', 'oktṓ', 'eight', 'eight'),
  M('ennea', 'ἐννέα', 'ennéa', 'nine', 'nine'),
]

const DECA = M('deca', 'δέκα', 'déka', 'ten', 'ten')
const ICOSA = M('icosa', 'εἴκοσι', 'eíkosi', 'twenty', 'twenty',
  'Twenty gets its own word, not “two-tens”. Before another number it bends to icosi-.')
const CONTA = M('conta', '-κοντα', '-konta', 'tens', 'tens',
  'The shared ending of τριάκοντα, πεντήκοντα, ἑξήκοντα: Greek for “so many tens”.')
const HECTA = M('hecta', 'ἑκατόν', 'hekatón', 'hundred', 'hundred',
  'Same word behind hecto- in hectare. Exactly one hundred is also written hecto-, as in hectogon.')
const CHILIA = M('chilia', 'χίλιοι', 'khílioi', 'thousand', 'thousand',
  'Also behind kilo- (through French) and chiliad.')

export const HEDRON = M('hedron', 'ἕδρα', 'hédra', 'seat, base → face', 'seats',
  'From PIE *sed- “to sit”: kin to English sit, Latin sedēs, and cathedral, the bishop’s καθέδρα (chair).')
export const GON = M('gon', 'γωνία', 'gōnía', 'angle, corner', 'corners',
  'From γόνυ (gónu) “knee”: a bend. A pentagon is literally “five knees”.')

const TENSTEM = {
  3: M('tria', 'τριά-', 'triá-', 'three', 'three'),
  4: M('tetra', 'τεσσαρά-', 'tessará-', 'four', 'four'),
  5: M('penta', 'πεντή-', 'pentḗ-', 'five', 'five'),
  6: M('hexa', 'ἑξή-', 'hexḗ-', 'six', 'six'),
  7: M('hepta', 'ἑβδομή-', 'hebdomḗ-', 'seven', 'seven',
    'Greek said hebdomḗkonta, from hébdomos “seventh”. Hepta- is the modern regularized stem.'),
  8: M('octa', 'ὀγδοή-', 'ogdoḗ-', 'eight', 'eight',
    'Greek said ogdoḗkonta, from ógdoos “eighth”. Octa- is the modern regularized stem.'),
  9: M('ennea', 'ἐνενή-', 'enenḗ-', 'nine', 'nine'),
}

const deca = n => ({ ...DECA, n })

// n in 1..9999 → morphemes (without the -hedron/-gon tail)
export const prefix = n => {
  const out = []
  const th = Math.floor(n / 1000), h = Math.floor(n / 100) % 10, rest = n % 100
  if (th) { if (th > 1) out.push(UN[th]); out.push(CHILIA) }
  if (h) { if (h > 1) out.push(UN[h]); out.push(HECTA) }
  if (!rest) return out
  if (rest < 10) out.push(UN[rest])
  else if (rest === 10) out.push(DECA)
  else if (rest === 11) out.push(M('hen', 'ἕν', 'hén', 'one', 'one'), deca('Greek ἕνδεκα, “one-ten”.'))
  else if (rest === 12) out.push(M('do', 'δύο', 'dúo', 'two', 'two'), deca('Greek δώδεκα, “two-ten”.'))
  else if (rest < 20) out.push(UN[rest - 10], deca('Greek said e.g. treiskaídeka, “three-and-ten”. Geometry drops the -kai- (“and”).'))
  else {
    const t = Math.floor(rest / 10), u = rest % 10
    if (t === 2) out.push(u ? { ...ICOSA, t: 'icosi' } : ICOSA)
    else out.push(TENSTEM[t], CONTA)
    if (u) out.push(UN[u])
  }
  return out
}

export const nameParts = n => [...prefix(n), HEDRON]
export const nameOf = n => nameParts(n).map(m => m.t).join('')
export const literal = n => nameParts(n).map(m => m.l).join('-')

export const gonName = k =>
  k === 3 ? 'triangle' : k === 4 ? 'quadrilateral' : prefix(k).map(m => m.t).join('') + 'gon'

// Ionic (alphabetic) Greek numerals; ϛ ϙ ϡ survive only as numbers
const GU = 'αβγδεϛζηθ', GT = 'ικλμνξοπϙ', GH = 'ρστυφχψωϡ'
export const greekNum = n => {
  const th = Math.floor(n / 1000), h = Math.floor(n / 100) % 10, t = Math.floor(n / 10) % 10, u = n % 10
  return (th ? '͵' + GU[th - 1] : '') + (h ? GH[h - 1] : '') + (t ? GT[t - 1] : '') + (u ? GU[u - 1] : '') + 'ʹ'
}

// ---------- geometry ----------
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s]
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const len = a => Math.hypot(a[0], a[1], a[2])
const norm = a => scale(a, 1 / len(a))

const PHI = (1 + Math.sqrt(5)) / 2
const cyclic = p => [[p[0], p[1], p[2]], [p[2], p[0], p[1]], [p[1], p[2], p[0]]]
const signs = pts => {
  const out = new Map()
  for (const p of pts) for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) {
    const q = [p[0] * sx, p[1] * sy, p[2] * sz]
    out.set(q.map(x => x.toFixed(6)).join(), q)
  }
  return [...out.values()]
}

// face normals = vertices of the dual
export const PLATONIC = {
  4: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
  6: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
  8: signs([[1, 1, 1]]),
  12: signs(cyclic([0, 1, PHI])),
  20: signs([[1, 1, 1], ...cyclic([0, 1 / PHI, PHI])]),
}

const fib = n => {
  const g = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), t = g * i
    return [Math.cos(t) * r, y, Math.sin(t) * r]
  })
}

// Fibonacci seed + Coulomb relaxation on the sphere (deterministic)
export const spherePoints = n => {
  const P = fib(n)
  const it = n <= 60 ? 300 : n <= 200 ? 120 : n <= 500 ? 40 : 0
  const sp = Math.sqrt(4 * Math.PI / n)
  for (let k = 0; k < it; k++) {
    const F = P.map(() => [0, 0, 0])
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1], dz = P[i][2] - P[j][2]
      const r2 = dx * dx + dy * dy + dz * dz + 1e-12, f = 1 / (r2 * Math.sqrt(r2))
      F[i][0] += dx * f; F[i][1] += dy * f; F[i][2] += dz * f
      F[j][0] -= dx * f; F[j][1] -= dy * f; F[j][2] -= dz * f
    }
    let mx = 0
    for (let i = 0; i < n; i++) {
      const p = P[i], f = F[i], d = dot(f, p)
      f[0] -= d * p[0]; f[1] -= d * p[1]; f[2] -= d * p[2]
      mx = Math.max(mx, len(f))
    }
    const s = 0.25 * sp * (1 - k / it) / (mx || 1)
    for (let i = 0; i < n; i++) P[i] = norm(add(P[i], scale(F[i], s)))
  }
  return P
}

// keep half-space n·x ≤ 1 (Sutherland–Hodgman)
const clip = (poly, n) => {
  let over = false
  for (const v of poly) if (dot(n, v) > 1 + 1e-12) { over = true; break }
  if (!over) return poly
  const out = []
  for (let k = 0; k < poly.length; k++) {
    const A = poly[k], B = poly[(k + 1) % poly.length]
    const da = dot(n, A) - 1, db = dot(n, B) - 1
    if (da <= 0) out.push(A)
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) out.push(add(A, scale(sub(B, A), da / (da - db))))
  }
  return out
}

const EPS2 = 1e-10
const clean = poly => poly.filter((v, i) => {
  const w = poly[(i + 1) % poly.length]
  return (v[0] - w[0]) ** 2 + (v[1] - w[1]) ** 2 + (v[2] - w[2]) ** 2 > EPS2
})

// n face normals → convex polyhedron circumscribing the unit sphere.
// faces: CCW-from-outside vertex loops; V, E, F by vertex merge.
export const polyhedron = normals => {
  const N = normals.map(norm)
  const faces = N.map((p, i) => {
    const u = norm(cross(p, Math.abs(p[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]))
    const w = cross(p, u)
    let poly = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => add(p, add(scale(u, 20 * s), scale(w, 20 * t))))
    for (let j = 0; j < N.length && poly.length; j++) if (j !== i) poly = clip(poly, N[j])
    return { normal: p, verts: clean(poly) }
  })
  const uniq = []
  const id = v => {
    for (let i = 0; i < uniq.length; i++) {
      const u = uniq[i]
      if ((u[0] - v[0]) ** 2 + (u[1] - v[1]) ** 2 + (u[2] - v[2]) ** 2 < EPS2) return i
    }
    return uniq.push(v) - 1
  }
  const edges = new Set()
  for (const f of faces) {
    const ids = f.verts.map(id)
    ids.forEach((a, i) => { const b = ids[(i + 1) % ids.length]; edges.add(a < b ? a + ':' + b : b + ':' + a) })
  }
  const R = Math.max(...uniq.map(len))
  return { faces, V: uniq.length, E: edges.size, F: faces.length, R }
}

export const solidFor = n => polyhedron(PLATONIC[n] || spherePoints(n))

export const faceTypes = faces => {
  const c = {}
  for (const f of faces) c[f.verts.length] = (c[f.verts.length] || 0) + 1
  return Object.entries(c).map(([k, v]) => [+k, v]).sort((a, b) => a[0] - b[0])
}

export const vec = { dot, cross, add, sub, scale, len, norm }
