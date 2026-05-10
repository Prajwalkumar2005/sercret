import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

function makeBox(w, h, d, material) {
  const geo = new THREE.BoxGeometry(w, h, d)
  const mesh = new THREE.Mesh(geo, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

export default function WalkwayFacility() {
  const { scene } = useThree()

  const group = useMemo(() => new THREE.Group(), [])

  useEffect(() => {
    // Prematerial palette: dark wood + clear glass + muted facility metal.
    const wood = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2a1b12'),
      roughness: 0.86,
      metalness: 0.06,
      clearcoat: 0.16,
      clearcoatRoughness: 0.55,
    })


    const woodRim = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#3a271a'),
      roughness: 0.9,
      metalness: 0.06,
      clearcoat: 0.05,
    })

    const glass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#6aa0b8'),
      roughness: 0.18,
      metalness: 0.02,
      transmission: 0.78,
      thickness: 0.6,
      ior: 1.4,
      clearcoat: 0.25,
      transparent: true,
      opacity: 0.38,
      // Subtle absorption so it doesn’t look like bright UI glass
      attenuationColor: new THREE.Color('#6aa0b8'),
      attenuationDistance: 6,
    })

    const metal = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1b2a2a'),
      roughness: 0.65,
      metalness: 0.55,
    })

    const frame = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#22373a'),
      roughness: 0.72,
      metalness: 0.35,
    })

    const base = new THREE.Group()

    // Walkway deck (visible immediately)
    const deck = makeBox(5.2, 0.12, 22, wood)
    deck.position.set(0, 0.05, 0)
    base.add(deck)

    // Wetness sheen strip (subtle): improves wet rainforest feeling.
    const wetStrip = makeBox(4.9, 0.01, 21.5, new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2c1f16'),
      roughness: 0.30,
      metalness: 0.10,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    }))


    wetStrip.position.set(0, 0.08, 0)
    base.add(wetStrip)


    // Deck planks/edge trims for premium structure
    const edgeL = makeBox(0.08, 0.16, 22, woodRim)
    edgeL.position.set(-2.6, 0.11, 0)
    base.add(edgeL)

    const edgeR = makeBox(0.08, 0.16, 22, woodRim)
    edgeR.position.set(2.6, 0.11, 0)
    base.add(edgeR)

    // Glass side panels
    const glassL = makeBox(0.08, 1.35, 22, glass)
    glassL.position.set(-2.52, 0.7, 0)
    base.add(glassL)

    const glassR = makeBox(0.08, 1.35, 22, glass)
      glassR.position.set(2.52, 0.7, 0)
    base.add(glassR)

    // Slight reflective “rain” line on glass for readability
    const glassSheen = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#7fb8d0'),
      roughness: 0.06,
      metalness: 0.04,

      transmission: 0.75,
      thickness: 0.5,
      ior: 1.45,
      clearcoat: 0.35,
      clearcoatRoughness: 0.18,
      transparent: true,
      opacity: 0.26,
    })

    const sheenL = makeBox(0.06, 1.05, 21.8, glassSheen)
    sheenL.position.set(-2.51, 0.62, 0)
    base.add(sheenL)

    const sheenR = makeBox(0.06, 1.05, 21.8, glassSheen)
    sheenR.position.set(2.51, 0.62, 0)
    base.add(sheenR)


    // Facility spine (subtle futuristic research vibe)
    const spine = makeBox(0.12, 2.2, 22, frame)
    spine.position.set(0, 1.1, 0)
    spine.material.color = new THREE.Color('#1f3436')
    base.add(spine)

    // Vertical posts along the walkway
    const postGeo = new THREE.BoxGeometry(0.08, 2.6, 0.08)
    for (let i = -10; i <= 10; i += 2) {
      const p1 = new THREE.Mesh(postGeo, metal)
      p1.position.set(2.45, 1.35, i)
      p1.castShadow = true
      p1.receiveShadow = true
      base.add(p1)

      const p2 = new THREE.Mesh(postGeo, metal)
      p2.position.set(-2.45, 1.35, i)
      p2.castShadow = true
      p2.receiveShadow = true
      base.add(p2)

      const mid = new THREE.Mesh(postGeo, frame)
      mid.position.set(0, 1.35, i)
      mid.castShadow = true
      mid.receiveShadow = true
      base.add(mid)
    }

    // Hanging “research” fin / canopy hints (minimal, not gamey)
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(4.9, 0.08, 22),
      metal
    )
    canopy.position.set(0, 2.55, 0)
    canopy.material.roughness = 0.6
    canopy.material.metalness = 0.45
    canopy.castShadow = true
    canopy.receiveShadow = true
    base.add(canopy)

    // Subtle signage panel (dark + reflective, no bright text)
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.18, 0.04),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#23393a'),
        roughness: 0.55,
        metalness: 0.5,
      })
    )
    sign.position.set(0, 1.15, -9)
    sign.castShadow = true
    sign.receiveShadow = true
    base.add(sign)

    // Position into world: walkway aligned with camera path
    base.position.set(0, 0.0, 0)
    group.add(base)

    // Slightly lift group so ground contact feels stable.
    group.position.set(0, 0.28, 0)
    group.name = 'WalkwayFacility'

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

  // Optional subtle movement can be added here later (vines, mist wisps)
  return null
}

