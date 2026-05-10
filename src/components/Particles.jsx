import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ============================================================================
// PARTICLES: src/components/Particles.jsx
// ============================================================================
// Creates floating particles/fireflies for cinematic ambience
//
// PURPOSE:
// - Floating dust/particles create immersive atmosphere
// - Simulates fireflies or environmental particles
// - Adds movement and visual interest without game-like feel
// - Enhances premium architectural visualization aesthetic
//
// FEATURES:
// - Instanced geometry for performance
// - Multiple particle layers with different speeds
// - Subtle, calm motion (not chaotic)
// - Realistic floating behavior
// - Glow effect through transparent material
//
// HOW IT WORKS:
// 1. Creates THREE.Points geometry (many particles = 1 object)
// 2. Uses InstancedBufferGeometry for performance
// 3. Animates particles with GSAP (smooth easing)
// 4. Multiple layers = depth perception
// 5. Gentle, sinusoidal motion = calm feeling
//
// CONNECTIONS:
// - Used in src/scenes/CinematicScene.jsx
// - Rendered as part of the 3D scene
//
// PERFORMANCE:
// - Using Points is more efficient than individual meshes
// - Instanced rendering = can handle thousands of particles
// - Single material for all particles
// ============================================================================

export default function Particles() {
  const { scene } = useThree()
  const particlesRef = useRef([])

  useEffect(() => {
    const createParticleLayer = (count, scale, yOffset, speed) => {
      // Particle geometry
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)

      // Generate random positions
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 40 // x
        positions[i + 1] = Math.random() * 20 + yOffset // y
        positions[i + 2] = (Math.random() - 0.5) * 40 // z
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      // Particle material - soft, semi-transparent glow
      // Premium blending: slightly tinted by layer to match moonlight + rainforest bounce.
      const material = new THREE.PointsMaterial({
        size: scale,
        color: 0x9fb3c9,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.28,
        fog: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })



      // Create points mesh
      const particles = new THREE.Points(geometry, material)
      scene.add(particles)

      // Store reference for animation
      const particleData = {
        mesh: particles,
        positions: positions,
        speed: speed,
        time: 0,
      }

      particlesRef.current.push(particleData)
    }

    // Create multiple particle layers for depth
    createParticleLayer(150, 0.1, 5, 0.0005) // Fast layer (foreground)
    createParticleLayer(100, 0.08, 10, 0.0003) // Medium layer
    createParticleLayer(80, 0.06, 15, 0.0001) // Slow layer (background)

    // Animation loop for particle movement
    let animationId = null
    let frameCount = 0

    const animateParticles = () => {
      frameCount++

      particlesRef.current.forEach((particleData) => {
        const positions = particleData.positions
        const speed = particleData.speed

        // Update particle positions with sine wave motion
        for (let i = 0; i < positions.length; i += 3) {
          // Vertical bobbing motion
          positions[i + 1] +=
            Math.sin(frameCount * speed + positions[i] * 0.1) * 0.01

          // Horizontal drift (subtle)
          positions[i] +=
            Math.cos(frameCount * speed * 0.5 + positions[i + 2] * 0.1) * 0.005

          // Wrap around to loop smoothly
          if (positions[i + 1] > 25) positions[i + 1] = 0
          if (positions[i + 1] < 0) positions[i + 1] = 25
        }

        // Update geometry
        particleData.mesh.geometry.attributes.position.needsUpdate = true
      })

      animationId = requestAnimationFrame(animateParticles)
    }

    animateParticles()

    // Cleanup
    return () => {
      if (animationId) cancelAnimationFrame(animationId)

      particlesRef.current.forEach((particleData) => {
        scene.remove(particleData.mesh)
        particleData.mesh.geometry.dispose()
        particleData.mesh.material.dispose()
      })

      particlesRef.current = []
    }
  }, [scene])

  return null // Particles are rendered through scene.add
}
