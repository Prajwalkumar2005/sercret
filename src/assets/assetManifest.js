// Asset manifest maps logical asset keys to GLB paths and default transforms.
// IMPORTANT: Replace placeholder paths with your real /public or imported assets later.

export const assetManifest = {
  // Trees / foliage
  rainforestTreeA: {
    path: '/models/rainforest_tree_a.glb',
    defaultScale: 1,
  },
  rainforestTreeB: {
    path: '/models/rainforest_tree_b.glb',
    defaultScale: 1,
  },
  foliageClusterA: {
    path: '/models/foliage_cluster_a.glb',
    defaultScale: 1,
  },

  // Rocks / terrain props
  rockA: {
    path: '/models/rock_a.glb',
    defaultScale: 1,
  },

  // Architectural supports (replaces debug poles first)
  architecturalSupportA: {
    path: '/models/arch_support_a.glb',
    defaultScale: 1,
  },

  // Observatory / architecture
  observatorySupportA: {
    path: '/models/observatory_support_a.glb',
    defaultScale: 1,
  },
}

export const assetKeys = Object.keys(assetManifest)

