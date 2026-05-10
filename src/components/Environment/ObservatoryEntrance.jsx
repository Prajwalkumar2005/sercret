import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EnvironmentAssetGroup } from '../environment/assets/EnvironmentAssetGroup'
import { assetManifest } from '../../assets/assetManifest'

// ObservatoryEntrance
// Replaces the procedural observatory chamber with the real GLB asset (observatorySupportA).
export default function ObservatoryEntrance() {
  const { scene } = useThree()
  const groupRef = useRef(null)

  const root = useMemo(() => new THREE.Group(), [])

  useEffect(() => {
    root.name = 'ObservatoryEntrance'
    root.position.set(0, 0, 0)
    groupRef.current = root
    scene.add(root)

    return () => {
      scene.remove(root)
      root.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material?.dispose?.()
        }
      })
    }
  }, [scene, root])

  useEffect(() => {
    let raf = 0
    const start = performance.now()

    const tick = () => {
      const t = (performance.now() - start) * 0.001
      const g = groupRef.current
      if (g) g.rotation.y = Math.sin(t * 0.35) * 0.002
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const placements = useMemo(() => {
    // original procedural entrance roughly sat around z = -7.
    return [
      {
        position: [0, 0.0, -7.0],
        rotation: [0, 0, 0],
        scale: 1,
      },
    ]
  }, [])

  const hasObservatory = Boolean(assetManifest?.observatorySupportA?.path)

  return (
    <group>
      {/* Real asset: EnvironmentAssetGroup handles load + tuning + warnings. */}
      {hasObservatory ? (
        <EnvironmentAssetGroup assetKey="observatorySupportA" placements={placements} />
      ) : (
        // Fallback: render something minimal if the GLB manifest path is missing.
        <mesh position={[0, 0.18, -7.0]}>
          <boxGeometry args={[3.8, 0.35, 2.8]} />
          <meshStandardMaterial color={new THREE.Color('#0b1515')} roughness={0.95} metalness={0.05} />
        </mesh>
      )}
    </group>
  )
}


