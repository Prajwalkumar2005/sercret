import { Suspense } from 'react'
import CinematicScene from './scenes/CinematicScene'
import Loader from './ui/Loader'
import HeroIntro from './ui/HeroIntro'
import './App.css'
import './ui/heroIntro.css'


// ============================================================================
// APP COMPONENT: src/App.jsx
// ============================================================================
// Main application wrapper that renders the Three.js canvas with Suspense
// 
// STRUCTURE:
// - Wraps CinematicScene in Suspense for lazy loading
// - Fallback to Loader component while scene loads
// - Imports global App.css for styling
// 
// CONNECTIONS:
// - Imports CinematicScene from src/scenes/CinematicScene.jsx
// - Imports Loader from src/ui/Loader.jsx
// - Uses App.css for global styles
// ============================================================================

export default function App() {
  return (
    <div className="app-container">
      <Suspense fallback={<Loader />}>
        <HeroIntro />
        <CinematicScene />
      </Suspense>
    </div>
  )

}
