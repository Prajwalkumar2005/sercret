import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Lightweight atmospheric depth layers (faux-volumetrics) using alpha gradients.
// Performance: 3 large quads, no postprocessing.
export default function DepthLayers() {
  const { scene } = useThree()

  const layers = useMemo(() => {
    const makeLayer = ({ w, h, color, opacity, z, y }) => {
      const geo = new THREE.PlaneGeometry(w, h)
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.NormalBlending,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, y, z)
      mesh.rotation.y = 0
      mesh.rotation.x = 0
      mesh.name = 'DepthLayer'
      return mesh
    }

    // Foreground haze (stronger)
    const L1 = makeLayer({ w: 220, h: 80, color: '#0b2a24', opacity: 0.14, z: -6, y: 10 })
    // Mid haze
    const L2 = makeLayer({ w: 260, h: 90, color: '#0a231e', opacity: 0.11, z: -20, y: 12 })
    // Background veil
    const L3 = makeLayer({ w: 320, h: 120, color: '#081b18', opacity: 0.09, z: -52, y: 15 })

    // Rotate slightly to match the camera composition
    ;[L1, L2, L3].forEach((m, idx) => {
      m.rotation.z = idx === 0 ? 0.02 : -0.01
      m.scale.x = 1
    })

    return [L1, L2, L3]
  }, [])

  useEffect(() => {
    layers.forEach((l) => scene.add(l))
    return () => {
      layers.forEach((l) => {
        scene.remove(l)
        l.geometry?.dispose?.()
        l.material?.dispose?.()
      })
    }
  }, [scene, layers])

  return null
}

