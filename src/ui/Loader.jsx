import { useEffect, useState } from 'react'
import './Loader.css'

// ============================================================================
// LOADER: src/ui/Loader.jsx
// ============================================================================
// Beautiful loading screen while scene initializes
//
// PURPOSE:
// - Shows while Suspense is loading components
// - Sets premium, cinematic tone
// - Smooth fade-in/out animation
// - Minimal, elegant design
//
// FEATURES:
// - Animated loading indicator
// - Smooth opacity transitions
// - Cinematic atmosphere
// - Premium branding feel
//
// HOW IT WORKS:
// 1. Renders loading screen on component mount
// 2. Animated dots for activity indicator
// 3. Fades in/out with CSS animations
// 4. Auto-removes after scene loads
//
// CONNECTIONS:
// - Used in src/App.jsx as Suspense fallback
// - Styled with src/ui/Loader.css
// ============================================================================

export default function Loader() {
  const [dotCount, setDotCount] = useState(0)

  useEffect(() => {
    // Animate loading dots
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const dots = Array(dotCount).fill('').join('.')

  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="loader-title">
          <h1>Cinematic Jungle</h1>
          <p>Initializing experience{dots}</p>
        </div>

        <div className="loader-animation">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
        </div>

        <div className="loader-subtitle">
          <p>Prepare for immersion</p>
        </div>
      </div>
    </div>
  )
}
