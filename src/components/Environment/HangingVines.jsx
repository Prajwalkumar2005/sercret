import { useEffect, useMemo, useRef } from 'react'
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

export default function HangingVines() {
  const { scene } = useThree()
  const groupRef = useRef(null)

  const vinesGroup = useMemo(() => {
    const group = new THREE.Group()
    group.name = 'HangingVines'

    const rand = mulberry32(77219)

    const vineMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0a1712'),
      roughness: 0.95,
      metalness: 0.02,
    })

    // A restrained amount of vines: premium feel > density.
    const vineCount = 18

    for (let i = 0; i < vineCount; i++) {
      // distribute near the facility entrance and canopy hints
      const side = rand() > 0.5 ? 1 : -1
      const x = side * (2.2 + rand() * 0.5)
      const z = -10 + rand() * 20

      // avoid crossing the walkway center too much
      if (Math.abs(x) < 1.8) continue

      const yTop = 2.2 + rand() * 0.5
      const yBottom = 0.45 + rand() * 0.35
      const height = yTop - yBottom

      const segs = 10 + Math.floor(rand() * 10)
      const geo = new THREE.CylinderGeometry(0.015, 0.02, height, 6, segs)
      const vine = new THREE.Mesh(geo, vineMat)
      vine.position.set(x, yBottom + height / 2, z)
      vine.castShadow = true
      vine.receiveShadow = false

      // offset rotation so vines don't look uniform
      vine.rotation.z = rand() * 0.25 * side
      vine.rotation.x = (rand() - 0.5) * 0.2

      // small leaf accent
      const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.25 + rand() * 0.25, 0.12 + rand() * 0.12), vineMat)
      leaf.position.set(0.02 * side, height * (0.3 + rand() * 0.4) - height / 2, 0.03)
      leaf.rotation.y = rand() * Math.PI
      leaf.scale.y = 0.8
      leaf.castShadow = true
      vine.add(leaf)

      group.add(vine)
    }

    return group
  }, [])

  useEffect(() => {
    scene.add(vinesGroup)
    groupRef.current = vinesGroup

    return () => {
      scene.remove(vinesGroup)
      vinesGroup.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material?.dispose?.()
        }
      })
    }
  }, [scene, vinesGroup])

  // very subtle sway
  useEffect(() => {
    let raf = 0
    const start = performance.now()

    const tick = () => {
      const t = (performance.now() - start) * 0.001
      if (groupRef.current) {
        groupRef.current.children.forEach((child, idx) => {
          if (!child.rotation) return
          child.rotation.x = Math.sin(t * 0.7 + idx) * 0.008
          child.rotation.z = Math.cos(t * 0.6 + idx) * 0.006
        })
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}

