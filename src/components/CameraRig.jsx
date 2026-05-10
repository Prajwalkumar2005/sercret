import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'


// ============================================================================
// CAMERA RIG: src/components/CameraRig.jsx
// ============================================================================
// Manages smooth cinematic camera movement using GSAP
//
// PURPOSE:
// - Creates a guided walkthrough experience
// - Smooth, continuous camera animation
// - GSAP-powered motion for premium feel
// - Non-intrusive, immersive exploration
//
// FEATURES:
// - Orbital camera movement around a point
// - Smooth easing (cubic bezier)
// - Continuous loop animation
// - Responsive to window resize
//
// HOW IT WORKS:
// 1. Gets camera reference from useThree hook
// 2. Sets initial position and look target
// 3. Uses GSAP timeline for smooth animation
// 4. Creates circular path around scene center
// 5. Loops seamlessly
//
// CONNECTIONS:
// - Used in src/scenes/CinematicScene.jsx
// - Animates the main camera
// ============================================================================

export default function CameraRig() {
  const { camera } = useThree()
  const timelineRef = useRef(null)

  useEffect(() => {
    // Human-scale cinematic framing.
    // Start at the walkway entrance and move left-to-right through the facility.
    // HERO FRAME (still composition): outside geometry, 3/4 framing toward observatory.
    camera.fov = 52
    camera.position.set(-6.2, 1.65, 10.6)
    camera.lookAt(-0.2, 1.25, -6.2)


    // Timeline length: 76s loop (slow luxury pacing)
    const timeline = gsap.timeline({ repeat: -1, yoyo: false })

    // First 8s: keep hero still (avoid clipping + allow overlay to read).
    timeline.to(
      camera.position,
      {
        x: -6.2,
        y: 1.65,
        z: 10.6,
        duration: 8,
        ease: 'none',
      },
      0
    )

    // Phase 1 (8-26s): entrance reveal -> begin walk forward
    timeline.to(
      camera.position,
      {
        x: -1.0,
        y: 1.78,
        z: 6.8,
        duration: 18,
        ease: 'power2.inOut',
      },
      8
    )


    // Phase 2 (26-48s): travel down the walkway (left leading line)
    timeline.to(
      camera.position,
      {
        x: 1.1,
        y: 1.82,
        z: 1.8,
        duration: 22,
        ease: 'sine.inOut',
      },
      26
    )

    // Phase 3 (48-66s): observatory-first beat (readable silhouette)
    timeline.to(
      camera.position,
      {
        x: 3.0,
        y: 1.84,
        z: -3.4,
        duration: 18,
        ease: 'power2.inOut',
      },
      48
    )

    // Phase 4 (66-76s): reveal portfolio zones -> drift back to natural loop origin
    timeline.to(
      camera.position,
      {
        x: -2.6,
        y: 1.72,
        z: 9.2,
        duration: 10,
        ease: 'power2.inOut',
      },
      66
    )

    // Gentle breathing (vertical only)
    timeline.to(
      camera.position,
      {
        y: '+=0.10',
        duration: 6,
        ease: 'sine.inOut',
      },
      0,
      '<'
    )

    timeline.to(
      camera.position,
      {
        y: '-=0.08',
        duration: 8,
        ease: 'sine.inOut',
      },
      14
    )

    // Cinematic focus pulls (no jitter): interpolate between key targets.
    const focusPoints = [
      { t: 0, x: 0.0, y: 1.05, z: -3.2 }, // entrance / deck
      { t: 26, x: -0.2, y: 1.05, z: -6.0 }, // walkway mid
      { t: 48, x: 0.2, y: 1.25, z: -7.2 }, // observatory
      { t: 66, x: 0.0, y: 1.10, z: -14.0 }, // zones
    ]

    const lerp = (a, b, k) => a + (b - a) * k

    const update = () => {
      const now = (gsap.ticker.time / 1000) % 76

      // find segment
      let i = 0
      while (i < focusPoints.length - 1 && now > focusPoints[i + 1].t) i++
      const a = focusPoints[i]
      const b = focusPoints[Math.min(i + 1, focusPoints.length - 1)]
      const span = Math.max(0.0001, b.t - a.t)
      const k = (now - a.t) / span

      const tx = lerp(a.x, b.x, k)
      const ty = lerp(a.y, b.y, k)
      const tz = lerp(a.z, b.z, k)

      camera.lookAt(tx, ty, tz)
    }

    gsap.ticker.add(update)
    timelineRef.current = timeline

    return () => {
      gsap.ticker.remove(update)
      if (timelineRef.current) timelineRef.current.kill()
    }
  }, [camera])


  return null // Camera rig doesn't render anything visually
}
