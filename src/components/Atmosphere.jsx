import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ============================================================================
// ATMOSPHERE: src/components/Atmosphere.jsx
// ============================================================================
// Creates the cinematic atmospheric environment
//
// PURPOSE:
// - Fog for depth and mood
// - Ambient lighting for soft illumination
// - Directional light for moonlight effect
// - Creates premium architectural visualization feel
//
// FEATURES:
// - Volumetric fog for immersion
// - Soft ambient light (neutral color)
// - Directional light (moonlight simulation)
// - Color grading through lighting
//
// HOW IT WORKS:
// 1. Sets up scene fog (fog creates depth perception)
// 2. Adds ambient light (fills shadows softly)
// 3. Adds directional light (creates realistic shadows)
// 4. Color palette: cool, moody, premium
//
// CONNECTIONS:
// - Used in src/scenes/CinematicScene.jsx
// - Affects overall scene mood and lighting
//
// COLOR THEORY:
// - Dark background (#0a0a0a) creates premium feel
// - Cool blue/green tones in fog suggest rainforest
// - Soft lighting avoids harsh shadows
// - High ambient intensity = calm, immersive
// ============================================================================

export default function Atmosphere() {
  const { scene } = useThree()

  useEffect(() => {
    // ========== ENHANCED FOG SYSTEM ==========
    // Layered-feel depth baseline (3D fog) + additional DepthLayers quads in scene.
    // Readability-first fog tuning: keep it dark, but avoid crushed blacks.
    const fogColor = 0x0a221b // slightly lighter green-blue
    scene.fog = new THREE.Fog(fogColor, 4.0, 85)
    scene.background = new THREE.Color(0x07110f)

    // ========== AMBIENT LIGHT ==========
    // Slight lift for clarity, still cinematic.
    const ambientLight = new THREE.AmbientLight(0xcad2ff, 0.46)
    scene.add(ambientLight)

    // ========== PRIMARY DIRECTIONAL LIGHT (CINEMATIC MOONLIGHT) ==========
    // Stronger moonlight direction to separate shapes.
    const directionalLight = new THREE.DirectionalLight(0x8fb0e8, 0.78)

    directionalLight.position.set(22, 26, 10)
    directionalLight.target.position.set(0, 1.4, 0)

    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 3072
    directionalLight.shadow.mapSize.height = 3072

    // Tight-ish shadow frustum for premium softness without artifacts.
    const cam = directionalLight.shadow.camera
    cam.left = -28
    cam.right = 28
    cam.top = 22
    cam.bottom = -16
    cam.near = 0.7
    cam.far = 110

    directionalLight.shadow.bias = -0.0012
    directionalLight.shadow.normalBias = 0.025


    scene.add(directionalLight)
    scene.add(directionalLight.target)

    // ========== GREENISH RAINFOREST BOUNCE (MID FILL) ==========
    const fillLight = new THREE.DirectionalLight(0x3f6f61, 0.40)


    fillLight.position.set(-18, 14, -14)
    fillLight.target.position.set(0, 1.2, -10)
    scene.add(fillLight)
    scene.add(fillLight.target)

    // ========== MICRO WARM ACCENT (VERY SUBTLE) ==========
    const accentLight = new THREE.DirectionalLight(0x6b5f4f, 0.12)
    accentLight.position.set(8, 10, -22)
    accentLight.target.position.set(0, 1.0, -18)
    scene.add(accentLight)
    scene.add(accentLight.target)

    // ========== HEMISPHERE LIGHT ==========
    const hemiLight = new THREE.HemisphereLight(0x1d4a41, 0x030807, 0.55)
    scene.add(hemiLight)

    // ========== POINT LIGHT (LOW-LEVEL AMBIENCE) ==========
    const pointLight = new THREE.PointLight(0x3f6f61, 0.14, 85)


    pointLight.position.set(0, 2.2, -6)
    scene.add(pointLight)


    // Cleanup
    return () => {
      scene.remove(ambientLight)
      scene.remove(directionalLight)
      scene.remove(directionalLight.target)
      scene.remove(fillLight)
      scene.remove(accentLight)
      scene.remove(hemiLight)
      scene.remove(pointLight)
    }
  }, [scene])

  return null
}
