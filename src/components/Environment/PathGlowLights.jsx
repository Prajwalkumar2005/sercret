import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function PathGlowLights() {
  const { scene } = useThree()

  const lights = useMemo(() => {
    const group = new THREE.Group()
    group.name = 'PathGlowLights'

    // Subtle warm-cool hybrid glow along the walkway edges.
    // Keep it low intensity (premium, not arcade).
    const make = (x, z) => {
      const bulb = new THREE.PointLight(0xa8d0c8, 0.14, 14, 2)
      bulb.position.set(x, 0.35, z)
      bulb.castShadow = false
      return bulb
    }

    const startZ = -10
    const endZ = 10
    const step = 2.5

    for (let z = startZ; z <= endZ; z += step) {
      group.add(make(2.55, z))
      group.add(make(-2.55, z))
    }

    // A faint center overhead line for entrance focal hierarchy
    const overhead = new THREE.PointLight(0xc7f0e1, 0.10, 24, 2)
    overhead.position.set(0, 2.0, -3)
    overhead.castShadow = false
    group.add(overhead)

    return group
  }, [])

  useEffect(() => {
    scene.add(lights)
    return () => {
      scene.remove(lights)
      lights.traverse((obj) => {
        if (obj.isLight) {
          // no disposal necessary
        }
      })
    }
  }, [scene, lights])

  return null
}

