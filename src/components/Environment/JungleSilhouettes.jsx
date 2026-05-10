import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EnvironmentAssetGroup } from '../environment/assets/EnvironmentAssetGroup'
import { assetManifest } from '../../assets/assetManifest'

function mulberry32(seed) {

  let t = seed
  return function () {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function placeInRing(rand, radiusMin, radiusMax) {
  const r = radiusMin + (radiusMax - radiusMin) * rand()
  const a = rand() * Math.PI * 2
  return [Math.cos(a) * r, Math.sin(a) * r]
}

export default function JungleSilhouettes() {
  const { scene } = useThree()
  const groupRef = useRef(null)

  const content = useMemo(() => {
    const group = new THREE.Group()
    group.name = 'JungleSilhouettes'

    // Premium dark silhouette palette (not neon)
    // Fallback mats only (used if GLB assets are missing).
    // Make them readable + separated (NOT black).
    const trunkMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1a3a33'),
      roughness: 0.85,
      metalness: 0.06,
    })

    // Leaf canopy cards (also silhouette) — brighter + higher contrast.
    const leafMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14332b'),
      roughness: 0.9,
      metalness: 0.03,
    })


    const rand = mulberry32(90421)

    // Asset-based silhouette replacement for the procedural "pole" layer.
    // If GLBs are missing, we still keep the fallback *readable* geometry.


    const treePlacementsA = []
    const treePlacementsB = []

    // density fields: left/right of walkway, deeper background, sparse far band.
    const fields = [
      { count: 20, radiusMin: 18, radiusMax: 46 },
      { count: 30, radiusMin: 30, radiusMax: 76 },
      { count: 14, radiusMin: 55, radiusMax: 105 },
    ]

    for (const f of fields) {
      for (let i = 0; i < f.count; i++) {
        const [x, z] = placeInRing(rand, f.radiusMin, f.radiusMax)

        // keep walkway clear (safe corridor around origin)
        const corridor = Math.sqrt(x * x + z * z)
        if (corridor < 16) continue

        // richer depth: slight y offsets so trunks sit on terrain
        const scale = 0.55 + rand() * 1.25
        const rotY = rand() * Math.PI * 2
        const pos = [x, 0, z]

        if (rand() > 0.5) {
          treePlacementsA.push({ position: [pos[0], 0, pos[2]], rotation: [0, rotY, 0], scale })
        } else {
          treePlacementsB.push({ position: [pos[0], 0, pos[2]], rotation: [0, rotY, 0], scale })
        }
      }
    }

    // Near-foreground support replacements
    const supportPlacements = []
    for (let i = 0; i < 9; i++) {
      const [x, z] = placeInRing(rand, 9, 18)
      if (Math.abs(z) < 6 && Math.abs(x) < 7) continue

      const scale = 0.65 + rand() * 1.0
      supportPlacements.push({
        position: [x, 0, z],
        rotation: [0, rand() * Math.PI * 2, 0],
        scale,
      })
    }

    // Return early: use GLB assets for silhouettes.
    // Keep trunkMat/leafMat defined for fallback (if assets paths are absent).

    const hasAnyRealAssets = Boolean(
      assetManifest?.rainforestTreeA?.path ||
        assetManifest?.rainforestTreeB?.path ||
        assetManifest?.foliageClusterA?.path ||
        assetManifest?.rockA?.path ||
        assetManifest?.architecturalSupportA?.path ||
        assetManifest?.observatorySupportA?.path
    )

    // When real assets exist, prefer them over debug silhouettes.
    // If any asset fails, EnvironmentAssetGroup will warn and render nothing for that group.
    if (hasAnyRealAssets) {
      // Foreground/midground composition for readable depth.
      const foliagePlacements = []
      for (let i = 0; i < 14; i++) {
        const [x, z] = placeInRing(rand, 10, 28)
        if (Math.abs(z) < 5 && Math.abs(x) < 6) continue
        foliagePlacements.push({
          position: [x, 0, z],
          rotation: [0, rand() * Math.PI * 2, 0],
          scale: 0.8 + rand() * 0.9,
        })
      }

      const rockPlacements = []
      for (let i = 0; i < 10; i++) {
        const [x, z] = placeInRing(rand, 8, 26)
        // bias rocks slightly off the walkway centerline
        const corridor = Math.sqrt(x * x + z * z)
        if (corridor < 14) continue
        rockPlacements.push({
          position: [x, 0, z],
          rotation: [0, rand() * Math.PI * 2, 0],
          scale: 0.6 + rand() * 1.2,
        })
      }

      const observatoryPlacements = [
        {
          position: [0, 0, 20],
          rotation: [0, 0, 0],
          scale: 1.0,
        },
      ]

      group.add(
        <EnvironmentAssetGroup assetKey="rainforestTreeA" placements={treePlacementsA} />
      )
      group.add(
        <EnvironmentAssetGroup assetKey="rainforestTreeB" placements={treePlacementsB} />
      )

      group.add(
        <EnvironmentAssetGroup assetKey="foliageClusterA" placements={foliagePlacements} />
      )
      group.add(
        <EnvironmentAssetGroup assetKey="rockA" placements={rockPlacements} />
      )
      group.add(
        <EnvironmentAssetGroup assetKey="architecturalSupportA" placements={supportPlacements} />
      )
      group.add(
        <EnvironmentAssetGroup assetKey="observatorySupportA" placements={observatoryPlacements} />
      )

      return group
    }


    // Fallback: keep the original procedural silhouette behavior if assets are missing.

    const fallbackFields = [
      { count: 20, radiusMin: 18, radiusMax: 46 },
      { count: 28, radiusMin: 30, radiusMax: 76 },
      { count: 14, radiusMin: 55, radiusMax: 105 },
    ]

    for (const f of fallbackFields) {
      for (let i = 0; i < f.count; i++) {
        const [x, z] = placeInRing(rand, f.radiusMin, f.radiusMax)

        const corridor = Math.sqrt(x * x + z * z)
        if (corridor < 16) continue

        const scale = 0.8 + rand() * 1.4
        const h = (4.5 + rand() * 10) * scale
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06 * scale, 0.12 * scale, h, 7, 1),
          trunkMat
        )
        trunk.position.set(x, h / 2, z)
        trunk.castShadow = true
        trunk.receiveShadow = true


        const canopy = new THREE.Group()
        canopy.position.set(0, h * (0.55 + rand() * 0.25), 0)
        const cards = 3 + Math.floor(rand() * 4)
        for (let c = 0; c < cards; c++) {
          const w = (1.2 + rand() * 2.4) * scale
          const d = (0.6 + rand() * 1.4) * scale
          const yScale = 0.12 + rand() * 0.22
          const card = new THREE.Mesh(new THREE.PlaneGeometry(w, d), leafMat)
          card.position.set((rand() - 0.5) * 1.2 * scale, (rand() - 0.2) * 0.4 * scale, (rand() - 0.5) * 1.2 * scale)
          card.rotation.y = rand() * Math.PI
          card.rotation.x = (rand() - 0.5) * 0.6
          card.scale.y = yScale
          card.castShadow = true
          card.receiveShadow = false
          canopy.add(card)
        }

        trunk.add(canopy)
        group.add(trunk)
      }
    }


    // Additional near-foreground silhouette clusters (very minimal)
    for (let i = 0; i < 10; i++) {
      const [x, z] = placeInRing(rand, 9, 18)
      if (Math.abs(z) < 6 && Math.abs(x) < 7) continue

      const scale = 0.9 + rand() * 1.1
      const h = 3.5 + rand() * 4.5
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.07 * scale, 0.14 * scale, h, 7, 1),
          trunkMat
        )

      trunk.position.set(x, h / 2, z)
      trunk.castShadow = true
      trunk.receiveShadow = true


      group.add(trunk)
    }

    return group
  }, [])

  useEffect(() => {
    scene.add(content)
    groupRef.current = content
    return () => {
      scene.remove(content)
      content.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material?.dispose?.()
        }
      })
    }
  }, [scene, content])

  // Optional gentle sway (very subtle to remain premium)
  useEffect(() => {
    let raf = 0
    const start = performance.now()

    const tick = () => {
      const t = (performance.now() - start) * 0.00025
      if (groupRef.current) {
        // sway all silhouettes minimally
        groupRef.current.rotation.y = Math.sin(t) * 0.002
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}

