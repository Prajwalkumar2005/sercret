import { useGLTF } from '@react-three/drei'

// Centralized GLB loader helper.
// Keeps environment asset code modular and reusable.
// Note: Draco support depends on having a decoder path installed; this file stays loader-only.

const MODEL_PRELOAD_KEYS = new Set([
  // add keys here if you want eager preloading later
])

export function useEnvGLTF(assetPath, options = {}) {
  // options reserved for future (e.g., draco decoder config)
  const gltf = useGLTF(assetPath)
  return gltf
}

export function usePreloadEnvGLTF(assetPath) {
  // Drei attaches a static preload method on useGLTF.
  // Safe no-op if called multiple times.
  if (!assetPath) return
  if (!MODEL_PRELOAD_KEYS.has(assetPath)) {
    // keep silent; preload can be expensive.
  }
  // useGLTF.preload is available on useGLTF fn
  useGLTF.preload(assetPath)
}

