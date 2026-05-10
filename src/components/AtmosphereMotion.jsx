import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Lightweight atmospheric motion + faux volumetric moon shafts.
// Shader-free: animates fog color/opacity and rotates/translates translucent haze planes.
export default function AtmosphereMotion() {
  const { scene } = useThree()
  const shaftsRef = useRef(null)

  const { hazePlanes, shaftPlanes } = useMemo(() => {
    const hazePlanes = []

    const mkPlane = ({ w, h, color, opacity, y, z, scaleX = 1 }) => {
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
      mesh.rotation.x = 0
      mesh.rotation.y = 0
      mesh.scale.x = scaleX
      return mesh
    }

    // Fore/mid/background haze planes (subtle density shifts)
    hazePlanes.push(mkPlane({ w: 240, h: 90, color: '#0b2a22', opacity: 0.085, y: 10.5, z: -18, scaleX: 1.05 }))
    hazePlanes.push(mkPlane({ w: 300, h: 110, color: '#081f19', opacity: 0.065, y: 12.5, z: -40, scaleX: 1.1 }))
    hazePlanes.push(mkPlane({ w: 360, h: 130, color: '#071a16', opacity: 0.050, y: 15.0, z: -70, scaleX: 1.15 }))

    const shaftPlanes = []
    const mkShaft = ({ w, h, color, opacity, x, z, rotY }) => {
      const geo = new THREE.PlaneGeometry(w, h)
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, 0, z)
      mesh.rotation.y = rotY
      // Lay the shaft so it points upward through fog
      mesh.rotation.x = Math.PI / 2
      return mesh
    }

    // Moon shafts oriented roughly from top-right to observatory
    shaftPlanes.push(mkShaft({ w: 0.9, h: 18, color: '#9fc7ff', opacity: 0.065, x: 2.5, z: -8.0, rotY: -0.55 }))
    shaftPlanes.push(mkShaft({ w: 0.7, h: 16, color: '#9fc7ff', opacity: 0.050, x: -0.8, z: -6.8, rotY: -0.45 }))
    shaftPlanes.push(mkShaft({ w: 0.6, h: 14, color: '#9fc7ff', opacity: 0.045, x: -2.8, z: -7.8, rotY: -0.35 }))

    return { hazePlanes, shaftPlanes }
  }, [])

  useEffect(() => {
    shaftsRef.current = new THREE.Group()
    shaftPlanes.forEach((p) => shaftsRef.current.add(p))
    scene.add(shaftsRef.current)
    hazePlanes.forEach((p) => scene.add(p))

    return () => {
      if (shaftsRef.current) {
        scene.remove(shaftsRef.current)
        shaftsRef.current.traverse((o) => {
          if (o.isMesh) {
            o.geometry?.dispose?.()
            if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose())
            else o.material?.dispose?.()
          }
        })
      }
      hazePlanes.forEach((p) => {
        scene.remove(p)
        p.geometry?.dispose?.()
        p.material?.dispose?.()
      })
    }
  }, [scene, hazePlanes, shaftPlanes])

  useEffect(() => {
    let raf = 0
    const start = performance.now()

    const tick = () => {
      const t = (performance.now() - start) * 0.001

      // Fog breathing: small amplitude adjustments.
      if (scene.fog) {
        const baseNear = 4.0
        const pulse = 0.7 * Math.sin(t * 0.22) + 0.3 * Math.sin(t * 0.07)
        // Keep in range; update only if fog is THREE.Fog.
        try {
          scene.fog.near = baseNear + pulse * 0.18
          scene.fog.far = 85 + pulse * 1.1
        } catch (_) {}
      }

      // Haze planes drift for depth realism
      hazePlanes.forEach((p, i) => {
        p.position.x = Math.sin(t * (0.12 + i * 0.03)) * (0.35 + i * 0.12)
        p.position.y = 10 + i * 1.2 + Math.sin(t * (0.10 + i * 0.02)) * 0.08
        p.rotation.z = 0.01 * Math.sin(t * (0.09 + i * 0.02))
        // subtle opacity breathing
        p.material.opacity = (p.material.opacity ?? 0.06) + 0.005 * Math.sin(t * (0.25 + i * 0.04))
      })

      // Shafts slowly rotate (moon drift) with very subtle parallax
      if (shaftsRef.current) {
        shaftsRef.current.rotation.y = -0.20 + Math.sin(t * 0.18) * 0.015
        shaftsRef.current.rotation.x = 0.05 + Math.cos(t * 0.12) * 0.01
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scene, hazePlanes])

  return null
}

