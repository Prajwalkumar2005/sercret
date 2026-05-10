import { useEffect, useMemo, useState } from 'react'

// DOM overlay intro: Apple-style cinematic typography with blur/fade.
// Stays minimal and restrained; NOT a full UI.
export default function HeroIntro() {
  const [visible, setVisible] = useState(false)

  const id = useMemo(() => `hero-intro-${Math.random().toString(16).slice(2)}`, [])

  useEffect(() => {
    // Slow cinematic reveal timing (first 5-10s should feel memorable)
    const t1 = setTimeout(() => setVisible(true), 350)
    return () => clearTimeout(t1)
  }, [])

  return (
    <div
      id={id}
      aria-hidden="true"
      className={visible ? 'heroIntro heroIntro--visible' : 'heroIntro'}
    >
      <div className="heroIntro__container">
        <div className="heroIntro__kicker">FUTURISTIC RAINFOREST RESEARCH FACILITY</div>
        <div className="heroIntro__title">Prajwalkumar Methe</div>
        <div className="heroIntro__subtitle">AI • Builder • Creator</div>
      </div>

      <div className="heroIntro__filmGrain" />
      <div className="heroIntro__vignette" />
    </div>
  )
}

