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

export default function ForegroundLeaves() {
  const { scene } = useThree()

  const leaves = useMemo(() => {
    const group = new THREE.Group()
    group.name = 'ForegroundLeaves'

    const rand = mulberry32(112233)

    const leafMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0f2a22'),
      roughness: 0.9,
      metalness: 0.03,
    })

    // Foreground plane clusters, kept minimal so it remains premium.
    const count = 22

    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * 18
      const z = 2 + rand() * 10 // near camera
      const y = 0.25 + rand() * 1.35

      // keep center corridor clearer
      if (Math.abs(x) < 3.2 && z < 7.5) continue

      const w = 0.7 + rand() * 1.8
      const h = 0.15 + rand() * 0.55

      const blade = new THREE.Mesh(new THREE.PlaneGeometry(w, h), leafMat)
      blade.position.set(x, y, z * -1) // slight inversion to align with walkway
      blade.rotation.y = rand() * Math.PI
      blade.rotation.x = (rand() - 0.5) * 0.6
      blade.rotation.z = (rand() - 0.5) * 0.2

      // mimic slight depth by scaling Y
      blade.scale.y = 0.8 + rand() * 0.6

      blade.castShadow = true
      blade.receiveShadow = false

      group.add(blade)
    }

    // A small "frame" leaf card near bottom edge (composition)
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(30, 2), leafMat)
    frame.position.set(0, 0.18, 4.5)
    frame.rotation.x = -Math.PI / 2
    frame.material = leafMat
    frame.receiveShadow = true
    frame.castShadow = false
    frame.visible = false // keep minimal; can be enabled later
    group.add(frame)

    return group
  }, [])

  useEffect(() => {
    scene.add(leaves)
    return () => {
      scene.remove(leaves)
      leaves.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material?.dispose?.()
        }
      })
    }
  }, [scene, leaves])

  return null
}

