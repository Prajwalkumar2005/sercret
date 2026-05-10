import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

// In-world architectural signage / observatory chamber near the facility entrance.
// Kept subtle and cinematic (no bright neon cyberpunk).
export default function ObservatoryEntrance() {
  const { scene } = useThree()
  const groupRef = useRef(null)

  const group = useMemo(() => new THREE.Group(), [])

  useEffect(() => {
    const metal = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1b2f30'),
      roughness: 0.65,
      metalness: 0.6,
    })

    const glass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#7fb8d0'),
      roughness: 0.12,
      metalness: 0.02,
      transmission: 0.78,
      thickness: 0.7,
      ior: 1.45,
      clearcoat: 0.22,
      transparent: true,
      opacity: 0.30,
      // absorption to keep it premium + not overly bright
      attenuationColor: new THREE.Color('#6aa0b8'),
      attenuationDistance: 8,
      emissive: new THREE.Color('#5aa6a1'),
      emissiveIntensity: 0.08,
    })

    const frame = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#203c3f'),
      roughness: 0.55,
      metalness: 0.35,
    })

    const darkBase = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0b1515'),
      roughness: 0.95,
      metalness: 0.05,
    })

    // Chamber base (subtle silhouette)
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.35, 2.8), darkBase)
    base.position.set(0, 0.18, -7.0)
    base.receiveShadow = true
    base.castShadow = true
    group.add(base)

    // Vertical columns
    const colGeo = new THREE.BoxGeometry(0.12, 2.0, 0.12)
    ;[-1.65, 1.65].forEach((x) => {
      ;[-0.85, 0.85].forEach((zSign) => {
        const col = new THREE.Mesh(colGeo, metal)
        col.position.set(x, 1.25, -7.0 + zSign * 0.9)
        col.castShadow = true
        col.receiveShadow = true
        group.add(col)
      })
    })

    // Glass arch face
    const archFrame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 0.08), frame)
    archFrame.position.set(0, 1.1, -7.0 - 0.04)
    archFrame.castShadow = true
    archFrame.receiveShadow = true
    group.add(archFrame)

    const archGlass = new THREE.Mesh(new THREE.BoxGeometry(3.18, 1.35, 0.06), glass)
    archGlass.position.set(0, 1.1, -7.0 + 0.02)
    archGlass.castShadow = true
    archGlass.receiveShadow = true
    group.add(archGlass)

    // Engraved-like “branding” bars (low intensity)
    const barMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0e2a2b'),
      roughness: 0.5,
      metalness: 0.7,
      emissive: new THREE.Color('#7fb8d0'),
      emissiveIntensity: 0.10,
    })

    const bars = []
    bars.push(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.01), barMat))
    bars.push(new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.01), barMat))

    bars[0].position.set(0, 1.34, -7.0 + 0.026)
    bars[1].position.set(0, 1.16, -7.0 + 0.026)

    bars.forEach((b) => {
      b.castShadow = false
      b.receiveShadow = true
      group.add(b)
    })

    // Small top canopy for more architectural silhouette
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.08, 3.2), metal)
    canopy.position.set(0, 2.15, -7.0)
    canopy.castShadow = true
    canopy.receiveShadow = true
    group.add(canopy)

    // Place near walkway entrance.
    group.position.set(0, 0.0, 0)
    groupRef.current = group

    scene.add(group)

    return () => {
      scene.remove(group)
      group.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material?.dispose?.()
        }
      })
    }
  }, [scene, group])

  // Subtle breathing shimmer for glass (kept minimal)
  useEffect(() => {
    let raf = 0
    const start = performance.now()

    const tick = () => {
      const t = (performance.now() - start) * 0.001
      const g = groupRef.current
      if (g) {
        g.rotation.y = Math.sin(t * 0.35) * 0.002
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}

