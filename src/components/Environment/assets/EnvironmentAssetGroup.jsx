import { memo, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useEnvGLTF } from '../../../loaders/glbLoader'
import { assetManifest } from '../../../assets/assetManifest'


function applyMaterialTuning(object3D) {
  // Keep it subtle so models read in the existing dark/cinematic lighting.
  // Also avoids overly bright or fully-black assets.
  object3D.traverse?.((child) => {
    if (!child.isMesh) return

    // Ensure shadows behave.
    child.castShadow = true
    child.receiveShadow = true

    const mat = child.material
    if (!mat) return

    // For standard/physical materials, tune roughness slightly.
    if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
      mat.roughness = mat.roughness ?? 0.9
      mat.roughness = Math.max(0.15, Math.min(1.0, mat.roughness))
      mat.metalness = mat.metalness ?? 0.0
      mat.metalness = Math.max(0.0, Math.min(1.0, mat.metalness))
    }
  })
}

/**
 * EnvironmentAssetGroup
 * Reusable GLB loader + placement group.
 *
 * @param {object} props
 * @param {string} props.assetKey - key in assetManifest
 * @param {Array} props.placements - array of {position, rotation, scale}
 * @param {boolean} props.skipMaterialTuning - when you want raw model look
 */
export const EnvironmentAssetGroup = memo(function EnvironmentAssetGroup({
  assetKey,
  placements = [],
  skipMaterialTuning = false,
}) {
  const asset = assetManifest[assetKey]
  if (!asset?.path) {
    return null
  }

  const [isLoaded, setIsLoaded] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let canceled = false

    async function checkPath() {
      try {
        const res = await fetch(asset.path, { method: 'GET' })
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        if (!canceled) {
          setIsLoaded(true)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`[MCP] GLB failed to load. key="${assetKey}" path="${asset.path}" error="${String(e?.message || e)}"`)
        if (!canceled) {
          setLoadFailed(true)
          setIsLoaded(false)
        }
      }
    }

    checkPath()

    return () => {
      canceled = true
    }
  }, [assetKey, asset.path])

  const gltf = useEnvGLTF(asset.path)

  // Cache a single root per instance.
  const sceneRoot = gltf.scene || gltf


  const tunedScene = useMemo(() => {
    if (skipMaterialTuning) return sceneRoot

    // clone because we tune materials per asset usage
    const clone = sceneRoot.clone(true)
    applyMaterialTuning(clone)
    // Ensure geometries are shared; only materials are tuned.
    return clone
  }, [sceneRoot, skipMaterialTuning])

  if (loadFailed) return null

  // While we’re verifying the URL, keep visuals stable.
  // Drei will still attempt loading, but we won’t render any instances until verified.
  if (!isLoaded) return null

  return (
    <group>
      {placements.map((p, i) => {
        const pos = p.position || [0, 0, 0]
        const rot = p.rotation || [0, 0, 0]
        const scl = p.scale ?? asset.defaultScale ?? 1

        // Clone again per placement so transforms don't fight.
        const instance = tunedScene.clone(true)
        instance.position.set(pos[0], pos[1], pos[2])
        instance.rotation.set(rot[0], rot[1], rot[2])
        instance.scale.set(scl, scl, scl)

        return <primitive object={instance} key={`${assetKey}_${i}`} />
      })}
    </group>
  )
})


