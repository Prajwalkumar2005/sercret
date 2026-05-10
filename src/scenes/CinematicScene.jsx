import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import CameraRig from '../components/CameraRig'
import Atmosphere from '../components/Atmosphere'
import Particles from '../components/Particles'
import GroundPlane from '../components/Environment/GroundPlane'
import WalkwayFacility from '../components/Environment/WalkwayFacility'
import DepthLayers from '../components/Environment/DepthLayers'
import JungleSilhouettes from '../components/Environment/JungleSilhouettes'
import HangingVines from '../components/Environment/HangingVines'
import ForegroundLeaves from '../components/Environment/ForegroundLeaves'
import PathGlowLights from '../components/Environment/PathGlowLights'
import ObservatoryEntrance from '../components/Environment/ObservatoryEntrance'
import ZoneSockets from '../components/Environment/ZoneSockets'
import AtmosphereMotion from '../components/AtmosphereMotion'






// ============================================================================
// CINEMATIC SCENE: src/scenes/CinematicScene.jsx
// ============================================================================
// Main 3D scene orchestrator using React Three Fiber
//
// This component:
// - Creates the Canvas (Three.js renderer)
// - Manages all scene components
// - Handles the overall cinematic experience
//
// CONNECTIONS:
// - CameraRig: src/components/CameraRig.jsx
//   └─ Handles smooth GSAP camera animation & movement
// - Atmosphere: src/components/Atmosphere.jsx
//   └─ Creates fog, ambient lighting, directional light
// - Particles: src/components/Particles.jsx
//   └─ Renders floating particles/fireflies
//
// SCENE HIERARCHY:
// Canvas
// ├── CameraRig (camera control)
// ├── Atmosphere (lighting + fog)
// └── Particles (floating elements)
//
// VISUAL DIRECTION:
// - Dark ambient jungle environment
// - Calm, immersive mood
// - Cinematic depth and atmosphere
// - Premium architectural visualization feel
// ============================================================================

export default function CinematicScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Scene initialization effects can go here
    console.log('🎬 Cinematic Scene Loaded')
  }, [])

  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 2, 5], fov: 75, near: 0.1, far: 1000 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        pixelRatio: Math.min(window.devicePixelRatio, 2), // Cap at 2x for performance
      }}
      style={{ width: '100%', height: '100vh' }}
    >
      {/* Suspense for lazy loading components */}
      <Suspense fallback={null}>
        {/* Camera with smooth GSAP animation */}
        <CameraRig />

        {/* Atmospheric effects: fog, lighting */}
        <Atmosphere />

        {/* Rainforest life layers (kept silhouette + minimal for premium composition) */}
        <JungleSilhouettes />
        <HangingVines />
        <ForegroundLeaves />
        <PathGlowLights />


        {/* Depth layers (faux-volumetric foreground/mid/background haze) */}
        <DepthLayers />

        {/* Ground anchors scene scale + realism */}
        <GroundPlane />

        {/* Architectural rainforest research walkway */}
        <WalkwayFacility />

        {/* In-world observatory entrance branding/signage */}
        <ObservatoryEntrance />

        {/* Portfolio zone sockets (future project architecture placeholders) */}
        <ZoneSockets />

        {/* Atmosphere motion + subtle moonlight shafts (premium faux volumetrics) */}
        <AtmosphereMotion />

        {/* Floating environmental particles (subtle) */}

        <Particles />


        {/* Scene background color */}
        <color attach="background" args={['#0a0a0a']} />
      </Suspense>
    </Canvas>
  )
}
