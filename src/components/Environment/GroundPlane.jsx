import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

function mulberry32(seed) {
  let t = seed
  return function () {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export default function GroundPlane() {
  const { scene } = useThree()

  const geom = useMemo(() => {
    const width = 220
    const depth = 220
    const segments = 160
    const geometry = new THREE.PlaneGeometry(width, depth, segments, segments)
    geometry.rotateX(-Math.PI / 2)

    // Subtle unevenness for realism.
    // (Lightweight: CPU-side height field, no textures required.)
    const pos = geometry.attributes.position
    const rand = mulberry32(1337)

    const tmp = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      tmp.fromBufferAttribute(pos, i)
      const x = tmp.x
      const z = tmp.z

      // Base micro variation
      const n1 = Math.sin(x * 0.05) * Math.cos(z * 0.05)
      const n2 = Math.sin(x * 0.13 + z * 0.09)

      // Organic dampening toward the walkway center (so it reads as "walkable")
      const walkCenter = Math.sqrt(x * x + z * z)
      const damp = Math.exp(-walkCenter * 0.03)

      const wet = damp * (rand() - 0.5) * 0.18
      const height = (n1 * 0.025 + n2 * 0.012) * (0.6 + damp * 0.8) + wet

      pos.setY(i, height)
    }

    pos.needsUpdate = true
    geometry.computeVertexNormals()
    return geometry
  }, [])

  useEffect(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0b1410'),
      roughness: 0.95,
      metalness: 0.05,
    })

    // Tiny dark tone variations without textures: vertex color-ish via shader-less approach.
    // We'll keep it subtle and premium.
    const mesh = new THREE.Mesh(geom, mat)
    mesh.receiveShadow = true
    mesh.name = 'GroundPlane'

    // Place slightly below origin so it never clips with assets.
    mesh.position.y = -0.25
    scene.add(mesh)

    return () => {
      scene.remove(mesh)
      mat.dispose()
      geom.dispose()
    }
  }, [scene, geom])

  return null
}

