# 🌿 Cinematic Jungle Portfolio

A premium, Awwwards-style interactive 3D jungle walkthrough portfolio. Built with **React**, **Vite**, **Three.js**, **React Three Fiber**, **Drei**, and **GSAP**.

---

## 🎯 Vision

**Experience**: A calm, immersive rainforest research facility where you explore a portfolio naturally through cinematic walkthrough.

**Aesthetic**: 
- Dark, moody jungle ambiance
- Futuristic architectural visualization
- Apple-level minimalism
- Premium cinematic storytelling
- Zero game-like elements

**Tech Stack**:
- ⚛️ React 18.3.1
- ⚡ Vite 5.4
- 🎮 Three.js r160
- 🎬 React Three Fiber 8.18
- 🛠️ Drei 9.122 (helpers & components)
- ✨ GSAP 3.15 (animations)

---

## 📁 Project Structure

```
cinematic-jungle-portfolio/
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # Global styles
│   ├── index.css                   # Base CSS variables
│   │
│   ├── scenes/
│   │   └── CinematicScene.jsx      # Main 3D scene orchestrator
│   │       └─ Renders Canvas with all 3D components
│   │       └─ Sets up camera, canvas config
│   │
│   ├── components/
│   │   ├── CameraRig.jsx           # GSAP-powered smooth camera animation
│   │   │   └─ Orbital guided walkthrough
│   │   ├── Atmosphere.jsx          # Lighting + Fog + Mood
│   │   │   └─ Ambient light, directional light, fog
│   │   └── Particles.jsx           # Floating particles/fireflies
│   │       └─ Performant instanced rendering
│   │
│   ├── ui/
│   │   ├── Loader.jsx              # Beautiful loading screen
│   │   └── Loader.css              # Loader styles
│   │
│   ├── animations/                 # (Ready for future animations)
│   ├── shaders/                    # (Ready for custom shaders)
│   ├── models/                     # (Ready for 3D models)
│   └── textures/                   # (Ready for textures)
│
├── public/                         # Static assets
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite configuration
├── package.json                    # Dependencies
└── .gitignore                      # Git ignore rules
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```
✅ All 141 packages installed (React, Three.js, GSAP, etc.)

### 2. Start Development Server
```bash
npm run dev
```
- Opens automatically at **http://localhost:5173**
- Hot reload enabled
- Press `Ctrl + C` to stop

### 3. Build for Production
```bash
npm run build
```
- Creates optimized `/dist` folder
- Ready for deployment

### 4. Preview Production Build
```bash
npm run preview
```
- Test production build locally

---

## 🎬 Component Architecture

### **CinematicScene.jsx** (Main Orchestrator)
```
Canvas (Three.js Renderer)
├── CameraRig          → Smooth orbital camera movement
├── Atmosphere         → Fog, lighting, mood
├── Particles          → Floating ambient particles
└── Background color   → Dark jungle base
```

### **CameraRig.jsx** (GSAP Animation)
- **Purpose**: Smooth, cinematic camera movement
- **Method**: GSAP timeline with orbital path
- **Motion**: Continuous loop, guided walkthrough
- **Effect**: Premium, immersive exploration feeling

### **Atmosphere.jsx** (Lighting & Mood)
- **Fog**: Dark blue-green (#0a1a15) for immersion
- **Ambient Light**: Soft uniform illumination (0.6 intensity)
- **Directional Light**: Moonlight simulation (cool blue #8899ff)
- **Fill Light**: Subtle opposing light for mood
- **Result**: Professional architectural visualization lighting

### **Particles.jsx** (Floating Elements)
- **System**: Three.js Points (performant instanced geometry)
- **Quantity**: 330 particles across 3 layers
- **Motion**: Sinusoidal bobbing + gentle drift
- **Performance**: Single material, minimal draw calls
- **Effect**: Immersive environmental ambiance

---

## 🎨 Visual Direction

### Color Palette
```
Background:     #0a0a0a (deep black)
Fog:            #0a1a15 (dark blue-green)
Primary Light:  #ffffff (warm ambient)
Moonlight:      #8899ff (cool blue)
Accent:         #2d5a3d (forest green)
Particles:      #8899bb (cool blue-grey)
```

### Lighting Philosophy
- **No harsh shadows** → Premium architectural feel
- **Soft ambient fill** → Calm, inviting atmosphere
- **Directional moonlight** → Realistic jungle night
- **Fog depth** → Immersive environment boundary

---

## ⚙️ How to Extend

### Add a New 3D Model
1. Export from Blender as `.glb` or `.fbx`
2. Place in `src/models/`
3. Use Drei `<useGLTF>` hook in a new component
4. Add to `CinematicScene.jsx`

### Add Custom Animations
1. Create file in `src/animations/`
2. Use GSAP for smooth motion
3. Import and use in components

### Add Portfolio Sections
1. Create hotspots in `CinematicScene.jsx`
2. Trigger animations via camera events
3. Show UI elements at key points
4. Portfolio items:
   - About Me
   - AI & Data Science Journey
   - SwipeFix
   - CoursesWalla
   - AI Startup Simulator
   - Skills
   - Contact Observatory

### Custom Shaders
1. Create `.glsl` files in `src/shaders/`
2. Import into component
3. Use with `shaderMaterial` in Three.js

---

## 🔧 Troubleshooting

### Issue: "Cannot find module '@react-three/fiber'"
**Solution**: Reinstall dependencies
```bash
npm install
```

### Issue: Scene not rendering (black screen)
**Solution**: Check browser console for errors
```bash
Ctrl + Shift + I → Console tab
```

### Issue: Camera spinning weirdly
**Solution**: Update GSAP version
```bash
npm install gsap@latest
```

### Issue: Performance lag (low FPS)
**Solution**: Lower pixel ratio in CinematicScene.jsx
```jsx
pixelRatio: Math.min(window.devicePixelRatio, 1) // Instead of 2
```

### Issue: Particles not visible
**Solution**: Verify particle positions in updateParticles loop

---

## 📊 Performance Tips

✅ **Already Optimized**:
- Instanced particle rendering (not 330 individual meshes)
- Pixel ratio capped at 2x
- Single material per particle layer
- High-performance WebGL context

🎯 **For Future**:
- Use model LOD (Level of Detail) for large models
- Lazy load scenes/models on demand
- Use Drei's `Preload` for critical assets
- Monitor frame rate with React Profiler

---

## 🌐 Deployment

### GitHub Pages
```bash
npm run build
git add dist/
git commit -m "Build: production ready"
git push
```

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts
```

### Netlify
```bash
npm run build
# Drag & drop dist/ folder to Netlify
```

---

## 📚 Documentation Links

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
- [Drei Components](https://github.com/pmndrs/drei)
- [Three.js Docs](https://threejs.org/docs/)
- [GSAP Docs](https://gsap.com/docs/)
- [Vite Docs](https://vitejs.dev/)

---

## 🎯 Next Steps

1. ✅ **Scene Running** → You're here! Test at localhost:5173
2. 📦 **Add Models** → Import 3D jungle assets
3. 🚶 **Interactive Navigation** → Extend CameraRig with waypoints
4. 🎨 **UI Overlays** → Add portfolio section UI
5. 📱 **Responsive** → Test on mobile devices
6. 🚀 **Deploy** → Push to Vercel/GitHub Pages

---

## 💡 Credits

Built with premium web technologies for an immersive portfolio experience.

- **Your Portfolio**: [Add your GitHub]
- **Inspiration**: Awwwards, Apple Design, Architectural Visualizations

---

**Welcome to your cinematic jungle experience.** 🌿✨
