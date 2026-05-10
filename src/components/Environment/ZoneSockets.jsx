import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

function zoneMaterials() {
  return {
    shell: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0f2426'),
      roughness: 0.78,
      metalness: 0.45,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#9ad3ff'),
      roughness: 0.12,

      metalness: 0.02,
      transmission: 0.78,
      thickness: 0.6,
      ior: 1.45,
      clearcoat: 0.22,
      transparent: true,
      opacity: 0.25,
      attenuationColor: new THREE.Color('#6aa0b8'),
      attenuationDistance: 8,
    }),
    accent: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#16393a'),
      roughness: 0.45,
      metalness: 0.55,
      emissive: new THREE.Color('#5aa6a1'),
      emissiveIntensity: 0.08,
    }),
    floor: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0b1617'),
      roughness: 0.95,
      metalness: 0.05,
      clearcoat: 0.05,
      clearcoatRoughness: 0.9,
    }),
  }
}

function makeBox(w, h, d, material) {
  const geo = new THREE.BoxGeometry(w, h, d)
  const mesh = new THREE.Mesh(geo, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function makeGlassPanel(w, h, d, material) {
  const geo = new THREE.BoxGeometry(w, h, d)
  const mesh = new THREE.Mesh(geo, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

export default function ZoneSockets() {
  const { scene } = useThree()
  const groupRef = useRef(null)

  const group = useMemo(() => new THREE.Group(), [])

  useEffect(() => {
    const mats = zoneMaterials()

    const zones = [
      // Designed near walkway footprint, evenly spaced left/right for cinematic clarity.
      { key: 'SwipeFix', pos: [-5.6, 0.0, -5.0], size: [1.9, 2.35, 1.2] },
      { key: 'CoursesWalla', pos: [0.0, 0.0, -12.0], size: [2.3, 2.55, 1.35] },
      { key: 'AI Startup Simulator', pos: [5.6, 0.0, -5.0], size: [1.9, 2.35, 1.2] },
      { key: 'Future Labs', pos: [-6.0, 0.0, -18.0], size: [2.2, 2.65, 1.35] },
      { key: 'AI & Data Science Journey', pos: [6.0, 0.0, -18.0], size: [2.2, 2.65, 1.35] },
    ]

    zones.forEach((z, idx) => {
      const [w, h, d] = z.size

      const root = new THREE.Group()
      root.position.set(z.pos[0], 0.18, z.pos[2])
      root.name = `ZoneSocket_${z.key}`

      // Floor pad to integrate physically
      const pad = makeBox(w + 0.5, 0.05, d + 0.55, mats.floor)
      pad.position.set(0, 0.0, 0)
      root.add(pad)

      // Chamber shell
      const shell = makeBox(w, h, d, mats.shell)
      shell.position.set(0, h / 2, 0)
      root.add(shell)

      // Glass exhibit front (toward camera entrance)
      const glass = makeGlassPanel(w * 0.95, h * 0.75, 0.05, mats.glass)
      glass.position.set(0, h * 0.56, d * 0.52)
      root.add(glass)

      // Minimal accent strip (engraved / signage)
      const strip = makeBox(w * 0.72, 0.06, 0.03, mats.accent)
      strip.position.set(0, h * 0.66, d * 0.53)
      root.add(strip)

      // Small corner “marker” pieces for architectural symbolism
      const marker = makeBox(0.12, 0.22, 0.12, mats.accent)
      marker.position.set(-w * 0.38, 0.22, d * 0.45)
      root.add(marker)

      const marker2 = marker.clone()
      marker2.position.set(w * 0.38, 0.22, d * 0.45)
      root.add(marker2)

      // Very subtle motion phase offset: breathing
      root.userData = { idx }
      group.add(root)
    })

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

  // Subtle holographic breathing without turning into neon.
  useEffect(() => {
    let raf = 0
    const start = performance.now()

    const tick = () => {
      const t = (performance.now() - start) * 0.001
      const g = groupRef.current
      if (g) {
        g.children.forEach((child) => {
          const idx = child.userData?.idx ?? 0
          child.rotation.y = Math.sin(t * 0.25 + idx) * 0.0015
          // tiny vertical lift
          child.position.y = 0.18 + Math.sin(t * 0.12 + idx) * 0.003
        })
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}

