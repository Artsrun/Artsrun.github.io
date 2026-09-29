// Origin stories. Platonic five get the Timaeus; others get what they're known as.

export const PLATO = {
  4: { el: 'fire', s: '{3,3}', why: 'Sharpest and lightest of the five, so the Timaeus gives it to fire.' },
  6: { el: 'earth', s: '{4,3}', why: 'Square faces make it the steadiest to stand on, so earth. Also the cube, from κύβος (kúbos), a gaming die.' },
  8: { el: 'air', s: '{3,4}', why: 'Between fire and water in size and sharpness, so air.' },
  12: { el: 'the whole heaven', s: '{5,3}', why: 'The one left over. The Timaeus says the god used it for the whole cosmos; Aristotle later gave the heavens a fifth element, aether.' },
  20: { el: 'water', s: '{3,5}', why: 'The roundest and most rolling of the five, so water.' },
}

export const PLATO_STORY = [
  'Plato’s Timaeus (c. 360 BCE) built the four classical elements out of four of these solids, which is why they carry his name.',
  'Ancient sources credit Theaetetus, Plato’s friend, with the octahedron and icosahedron. Euclid closes the Elements (Book XIII) by proving there are exactly five.',
  'Why five: at least three faces meet at a corner and their angles must sum to under 360°. That allows 3, 4 or 5 triangles, 3 squares, or 3 pentagons, and nothing else.',
  'Kepler (Mysterium Cosmographicum, 1596) nested them between the orbits of the six known planets. Wrong, but it pushed him toward his real laws.',
]

export const KNOWN = {
  1: 'Not a solid in space: one face would be the whole surface. On a sphere it’s allowed, one face around a single vertex.',
  2: 'Flat in space, two faces glued back to back. On a sphere: two hemispheres.',
  3: 'Too few to close a solid in space. On a sphere: three lunes meeting at the poles, a hosohedron.',
  5: 'Only two convex shapes exist: the square pyramid and the triangular prism.',
  6: 'Seven topologically different convex hexahedra exist. The cube is the regular one.',
  7: 'There are 34 topologically different convex heptahedra. The pentagonal prism is one.',
  8: 'There are 257 topologically different convex octahedra. The regular one has 8 triangles.',
  10: 'The pentagonal trapezohedron: the ten-sided die.',
  14: 'The truncated octahedron: Kelvin’s 1887 answer for dividing space into equal cells with the least surface. Weaire and Phelan beat it in 1993.',
  24: 'Several famous ones: tetrakis hexahedron, deltoidal icositetrahedron, pentagonal icositetrahedron.',
  26: 'The rhombicuboctahedron, an Archimedean solid.',
  30: 'The rhombic triacontahedron: 30 identical rhombi, used for the thirty-sided die.',
  32: 'The truncated icosahedron: 12 pentagons, 20 hexagons. The classic football, and C₆₀ buckminsterfullerene (1985). The icosidodecahedron has 32 faces too.',
  38: 'The snub cube: 32 triangles and 6 squares.',
  48: 'The disdyakis dodecahedron.',
  60: 'Deltoidal and pentagonal hexecontahedra. Tradition spells them hexeconta-, keeping the Greek ē of ἑξήκοντα.',
  62: 'The rhombicosidodecahedron and the truncated icosidodecahedron.',
  64: 'The frequency-4 geodesic tetrahedron: 4 × 4² triangles.',
  92: 'The snub dodecahedron: 80 triangles and 12 pentagons.',
  120: 'The disdyakis triacontahedron: the most faces of any Catalan solid, and a fair 120-sided die.',
}

export const HOW = known => `The name only counts faces; it doesn’t pick a shape. ${known ? 'The one drawn here is a generic one: it' : 'The one drawn here'} spreads that many points evenly over a sphere, turns each into a tangent plane, and keeps what the planes enclose.`
