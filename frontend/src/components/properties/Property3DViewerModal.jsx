import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  X, Compass, Home, Eye, Sun, Moon, Sunrise, Maximize2, Minimize2,
  RotateCw, ZoomIn, ZoomOut, Layers, Sparkles, MapPin, Building
} from 'lucide-react';

/**
 * Procedural 3D Architectural Digital Twin & Virtual Tour Viewer
 * Features:
 * 1. Full Exterior & Surroundings (Lawn, Driveway, Pool, Trees, Fencing, Lighting)
 * 2. Dollhouse Mode (Roof removed, 3D Floorplan visible)
 * 3. Interior Walkthrough Mode (Living Room, Kitchen & Dining, Master Bedroom, Sky Terrace)
 * 4. Day / Sunset / Night Lighting with Real-Time Glowing Interior Lights
 * 5. OrbitControls with smooth cinematic camera transitions
 */
export default function Property3DViewerModal({ property, isOpen, onClose }) {
  const mountRef = useRef(null);

  // Viewer State
  const [viewMode, setViewMode] = useState('exterior'); // 'exterior' | 'dollhouse' | 'interior'
  const [activeRoom, setActiveRoom] = useState('living'); // 'living' | 'kitchen' | 'bedroom' | 'terrace'
  const [timeOfDay, setTimeOfDay] = useState('day'); // 'day' | 'sunset' | 'night'
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // References for Three.js engine
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // References to dynamic 3D scene elements
  const roofGroupRef = useRef(null);
  const interiorLightsRef = useRef([]);
  const sunLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const poolLightRef = useRef(null);

  // Target camera coordinates for smooth interpolation
  const targetCamPos = useRef(new THREE.Vector3(26, 18, 30));
  const targetLookAt = useRef(new THREE.Vector3(0, 3, 0));

  // Camera presets
  const CAMERA_PRESETS = {
    exterior: { pos: new THREE.Vector3(26, 18, 30), lookAt: new THREE.Vector3(0, 3, 0) },
    dollhouse: { pos: new THREE.Vector3(0, 28, 22), lookAt: new THREE.Vector3(0, 2, 0) },
    interior_living: { pos: new THREE.Vector3(-4.5, 3.2, 3.5), lookAt: new THREE.Vector3(-2, 2.8, -0.5) },
    interior_kitchen: { pos: new THREE.Vector3(4.5, 3.2, 3.5), lookAt: new THREE.Vector3(3.5, 2.8, -1.5) },
    interior_bedroom: { pos: new THREE.Vector3(-4.5, 3.2, -4.5), lookAt: new THREE.Vector3(-4.5, 2.8, -7.5) },
    interior_terrace: { pos: new THREE.Vector3(0, 8.2, 5.5), lookAt: new THREE.Vector3(0, 6.5, 12) }
  };

  useEffect(() => {
    if (!isOpen) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xdce9f2);
    scene.fog = new THREE.FogExp2(0xdce9f2, 0.012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 250);
    camera.position.set(26, 18, 30);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going underground
    controls.minDistance = 3;
    controls.maxDistance = 80;
    controls.target.set(0, 3, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    sunLight.position.set(30, 45, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    const d = 28;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 6. BUILD 3D ENVIRONMENT & SURROUNDINGS
    buildSurroundings(scene);

    // 7. BUILD HOUSE (EXTERIOR & INTERIOR ARCHITECTURE)
    const { roofGroup, interiorLights, poolLight } = buildHouse(scene);
    roofGroupRef.current = roofGroup;
    interiorLightsRef.current = interiorLights;
    poolLightRef.current = poolLight;

    // 8. Animation & Render Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth camera interpolation towards target
      camera.position.lerp(targetCamPos.current, 0.04);
      controls.target.lerp(targetLookAt.current, 0.04);

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Window Resize Listener
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement.parentNode);
      }
      renderer.dispose();
    };
  }, [isOpen]);

  // Handle View Mode & Camera Transitions
  useEffect(() => {
    if (!controlsRef.current) return;

    if (viewMode === 'exterior') {
      targetCamPos.current.copy(CAMERA_PRESETS.exterior.pos);
      targetLookAt.current.copy(CAMERA_PRESETS.exterior.lookAt);
      if (roofGroupRef.current) roofGroupRef.current.visible = true;
    } else if (viewMode === 'dollhouse') {
      targetCamPos.current.copy(CAMERA_PRESETS.dollhouse.pos);
      targetLookAt.current.copy(CAMERA_PRESETS.dollhouse.lookAt);
      if (roofGroupRef.current) roofGroupRef.current.visible = false;
    } else if (viewMode === 'interior') {
      if (roofGroupRef.current) roofGroupRef.current.visible = false;
      const key = `interior_${activeRoom}`;
      if (CAMERA_PRESETS[key]) {
        targetCamPos.current.copy(CAMERA_PRESETS[key].pos);
        targetLookAt.current.copy(CAMERA_PRESETS[key].lookAt);
      }
    }
  }, [viewMode, activeRoom]);

  // Handle Day / Sunset / Night Lighting
  useEffect(() => {
    if (!sceneRef.current || !sunLightRef.current || !ambientLightRef.current) return;
    const scene = sceneRef.current;
    const sun = sunLightRef.current;
    const ambient = ambientLightRef.current;
    const interiorLights = interiorLightsRef.current;
    const poolLight = poolLightRef.current;

    if (timeOfDay === 'day') {
      scene.background.setHex(0xdce9f2);
      scene.fog.color.setHex(0xdce9f2);
      ambient.color.setHex(0xffffff);
      ambient.intensity = 0.85;
      sun.color.setHex(0xfffaed);
      sun.intensity = 1.8;
      sun.position.set(30, 45, 25);
      interiorLights.forEach(l => l.intensity = 0.4);
      if (poolLight) poolLight.intensity = 0.3;
    } else if (timeOfDay === 'sunset') {
      scene.background.setHex(0xf5d3b3);
      scene.fog.color.setHex(0xf5d3b3);
      ambient.color.setHex(0xffcb99);
      ambient.intensity = 0.65;
      sun.color.setHex(0xff7733);
      sun.intensity = 1.6;
      sun.position.set(45, 12, 10);
      interiorLights.forEach(l => l.intensity = 1.2);
      if (poolLight) poolLight.intensity = 1.0;
    } else if (timeOfDay === 'night') {
      scene.background.setHex(0x0c1424);
      scene.fog.color.setHex(0x0c1424);
      ambient.color.setHex(0x1a284a);
      ambient.intensity = 0.3;
      sun.color.setHex(0x3b5998);
      sun.intensity = 0.4;
      sun.position.set(-20, 35, -20);
      interiorLights.forEach(l => l.intensity = 2.4);
      if (poolLight) poolLight.intensity = 2.2;
    }
  }, [timeOfDay]);

  // Handle Auto-Rotate toggle
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Zoom handlers
  const handleZoom = (delta) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const dir = new THREE.Vector3().subVectors(controlsRef.current.target, cameraRef.current.position).normalize();
    cameraRef.current.position.addScaledVector(dir, delta * 3);
  };

  // Reset Camera View
  const handleResetCamera = () => {
    setViewMode('exterior');
    targetCamPos.current.copy(CAMERA_PRESETS.exterior.pos);
    targetLookAt.current.copy(CAMERA_PRESETS.exterior.lookAt);
  };

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className={`relative bg-[#0F172A] border border-[#3D4127] rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[88vh]'
      }`}>
        
        {/* TOP BAR / HEADER */}
        <div className="px-6 py-3.5 bg-[#1E293B]/90 border-b border-[#3D4127]/60 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#636B2F] text-white flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate max-w-xs sm:max-w-md">
                  {property?.name || 'Architectural Luxury Villa'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#D4DE95]/20 text-[#D4DE95] text-[10px] font-bold border border-[#BAC095]/40 uppercase">
                  3D Digital Twin
                </span>
              </div>
              <p className="text-[11px] text-[#BAC095] flex items-center space-x-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-[#BAC095]" />
                <span>{property?.locality || 'Prime Locality'}, {property?.city || 'Mumbai'}</span>
                <span>·</span>
                <span>{property?.built_up_area_sqft || 3200} sqft</span>
                <span>·</span>
                <span className="text-[#D4DE95] font-semibold">
                  INR {property?.estimated_value ? (property.estimated_value / 10000000).toFixed(2) + ' Cr' : '6.50 Cr'}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-[#334155]/60 hover:bg-[#334155] text-[#BAC095] hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#DC2626]/20 hover:bg-[#DC2626] text-[#DC2626] hover:text-white transition-colors"
              title="Close 3D Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D CANVAS VIEWPORT */}
        <div className="relative flex-1 w-full h-full bg-[#0b101b] overflow-hidden">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* FLOATING TOP CONTROL STRIP (VIEW MODES) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center bg-[#0F172A]/85 backdrop-blur-md p-1.5 rounded-2xl border border-[#BAC095]/40 shadow-xl">
            <button
              onClick={() => setViewMode('exterior')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === 'exterior'
                  ? 'bg-[#636B2F] text-white shadow-md'
                  : 'text-[#BAC095] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Surroundings &amp; Exterior</span>
            </button>

            <button
              onClick={() => setViewMode('dollhouse')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === 'dollhouse'
                  ? 'bg-[#636B2F] text-white shadow-md'
                  : 'text-[#BAC095] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dollhouse (Roof Off)</span>
            </button>

            <button
              onClick={() => setViewMode('interior')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === 'interior'
                  ? 'bg-[#636B2F] text-white shadow-md'
                  : 'text-[#BAC095] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Walk Inside House</span>
            </button>
          </div>

          {/* ROOM SELECTOR (WHEN IN INTERIOR OR DOLLHOUSE MODE) */}
          {(viewMode === 'interior' || viewMode === 'dollhouse') && (
            <div className="absolute top-18 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 bg-[#1E293B]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#3D4127] shadow-lg animate-fade-in">
              <span className="text-[10px] uppercase font-bold text-[#D4DE95] mr-1">Rooms:</span>
              {[
                { id: 'living', label: 'Living Room' },
                { id: 'kitchen', label: 'Kitchen & Dining' },
                { id: 'bedroom', label: 'Master Suite' },
                { id: 'terrace', label: 'Sky Balcony' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRoom(r.id);
                    setViewMode('interior');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    activeRoom === r.id && viewMode === 'interior'
                      ? 'bg-[#D4DE95] text-[#3D4127] shadow-sm'
                      : 'text-[#BAC095] hover:text-white hover:bg-[#334155]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* BOTTOM-LEFT: LIGHTING CONTROLS */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-1 bg-[#0F172A]/85 backdrop-blur-md p-1.5 rounded-xl border border-[#BAC095]/40 shadow-lg">
            <button
              onClick={() => setTimeOfDay('day')}
              className={`p-2 rounded-lg text-xs transition-colors ${
                timeOfDay === 'day' ? 'bg-[#D4DE95] text-[#3D4127]' : 'text-[#BAC095] hover:text-white'
              }`}
              title="Daylight Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('sunset')}
              className={`p-2 rounded-lg text-xs transition-colors ${
                timeOfDay === 'sunset' ? 'bg-[#D4DE95] text-[#3D4127]' : 'text-[#BAC095] hover:text-white'
              }`}
              title="Sunset Mode"
            >
              <Sunrise className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('night')}
              className={`p-2 rounded-lg text-xs transition-colors ${
                timeOfDay === 'night' ? 'bg-[#D4DE95] text-[#3D4127]' : 'text-[#BAC095] hover:text-white'
              }`}
              title="Night Mode with Interior Illumination"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* BOTTOM-RIGHT: CAMERA & INTERACTION TOOLBAR */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 bg-[#0F172A]/85 backdrop-blur-md p-1.5 rounded-xl border border-[#BAC095]/40 shadow-lg">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors ${
                autoRotate ? 'bg-[#636B2F] text-white' : 'text-[#BAC095] hover:text-white'
              }`}
              title="Toggle 360 Auto-Rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span className="text-[11px] hidden sm:inline">Orbit</span>
            </button>

            <button
              onClick={() => handleZoom(1)}
              className="p-1.5 rounded-lg text-[#BAC095] hover:text-white hover:bg-[#334155] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleZoom(-1)}
              className="p-1.5 rounded-lg text-[#BAC095] hover:text-white hover:bg-[#334155] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded-lg text-[#BAC095] hover:text-white hover:bg-[#334155] transition-colors"
              title="Reset View"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* HINT OVERLAY PILL */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden md:block">
            <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#BAC095] text-[11px] border border-white/10 shadow-sm">
              Click &amp; Drag to rotate 360° · Scroll to zoom · Select modes or rooms to walk inside
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * Procedural 3D Environment: Grounds, Lawn, Trees, Swimming Pool, Pavements, Driveway
 */
function buildSurroundings(scene) {
  // 1. Manicured Estate Lawn
  const lawnGeo = new THREE.PlaneGeometry(80, 80);
  const lawnMat = new THREE.MeshStandardMaterial({
    color: 0x5b753a,
    roughness: 0.85,
    metalness: 0.1
  });
  const lawn = new THREE.Mesh(lawnGeo, lawnMat);
  lawn.rotation.x = -Math.PI / 2;
  lawn.receiveShadow = true;
  scene.add(lawn);

  // 2. Concrete Base / Foundation Pad
  const padGeo = new THREE.BoxGeometry(22, 0.4, 18);
  const padMat = new THREE.MeshStandardMaterial({ color: 0xd6dbcd, roughness: 0.7 });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.position.set(0, 0.2, 0);
  pad.receiveShadow = true;
  scene.add(pad);

  // 3. Paved Driveway
  const driveGeo = new THREE.PlaneGeometry(7, 30);
  const driveMat = new THREE.MeshStandardMaterial({ color: 0x474944, roughness: 0.8 });
  const drive = new THREE.Mesh(driveGeo, driveMat);
  drive.rotation.x = -Math.PI / 2;
  drive.position.set(6, 0.05, 17);
  drive.receiveShadow = true;
  scene.add(drive);

  // 4. Stone Walkway to Porch
  const pathGeo = new THREE.PlaneGeometry(3.5, 14);
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xd4de95, roughness: 0.75 });
  const path = new THREE.Mesh(pathGeo, pathMat);
  path.rotation.x = -Math.PI / 2;
  path.position.set(-1.5, 0.06, 12);
  path.receiveShadow = true;
  scene.add(path);

  // 5. Luxury Swimming Pool & Timber Deck
  const deckGeo = new THREE.BoxGeometry(10, 0.3, 14);
  const deckMat = new THREE.MeshStandardMaterial({ color: 0x9e734c, roughness: 0.6 });
  const deck = new THREE.Mesh(deckGeo, deckMat);
  deck.position.set(-16, 0.15, 0);
  deck.receiveShadow = true;
  scene.add(deck);

  // Pool Water (recessed inside deck)
  const poolWaterGeo = new THREE.PlaneGeometry(6.5, 10.5);
  const poolWaterMat = new THREE.MeshStandardMaterial({
    color: 0x1aa0c4,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85
  });
  const poolWater = new THREE.Mesh(poolWaterGeo, poolWaterMat);
  poolWater.rotation.x = -Math.PI / 2;
  poolWater.position.set(-16, 0.35, 0);
  scene.add(poolWater);

  // Pool border stone
  const borderGeo = new THREE.BoxGeometry(7.2, 0.4, 11.2);
  const borderMat = new THREE.MeshStandardMaterial({ color: 0xe2e6d5, roughness: 0.5 });
  const border = new THREE.Mesh(borderGeo, borderMat);
  border.position.set(-16, 0.2, 0);
  scene.add(border);

  // Pool Lounge Chairs
  for (let i = -3; i <= 3; i += 3) {
    const chair = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.3, 3),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    chair.position.set(-10, 0.4, i);
    chair.castShadow = true;
    scene.add(chair);
  }

  // 6. Perimeter Low Boundary Wall & Entrance Pillars
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xbac095, roughness: 0.8 });
  const wallFrontLeft = new THREE.Mesh(new THREE.BoxGeometry(16, 1.2, 0.6), wallMat);
  wallFrontLeft.position.set(-14, 0.6, 28);
  wallFrontLeft.castShadow = true;
  scene.add(wallFrontLeft);

  const wallFrontRight = new THREE.Mesh(new THREE.BoxGeometry(16, 1.2, 0.6), wallMat);
  wallFrontRight.position.set(16, 0.6, 28);
  wallFrontRight.castShadow = true;
  scene.add(wallFrontRight);

  // 7. Architectural Trees & Foliage
  const treePositions = [
    [-15, 14], [-22, 8], [-22, -8], [-14, -16],
    [15, 14], [22, 6], [20, -10], [14, -16],
    [-4, -18], [4, -18]
  ];

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
  const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x3d4127, roughness: 0.8 });
  const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x636b2f, roughness: 0.75 });

  treePositions.forEach(([x, z], i) => {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);

    // Trunk
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 3.5, 8), trunkMat);
    trunk.position.y = 1.75;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Canopy (multi-cluster foliage)
    const fMat = i % 2 === 0 ? foliageMat1 : foliageMat2;
    const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 1), fMat);
    canopy1.position.y = 4.2;
    canopy1.castShadow = true;
    treeGroup.add(canopy1);

    const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), fMat);
    canopy2.position.set(0.6, 5.2, 0.4);
    canopy2.castShadow = true;
    treeGroup.add(canopy2);

    scene.add(treeGroup);
  });

  // 8. Landscape Shrub Hedges
  for (let x = -8; x <= 8; x += 2) {
    if (x === -2 || x === 0) continue; // Porch entry gap
    const bush = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x3d4127, roughness: 0.8 })
    );
    bush.position.set(x, 0.5, 9.5);
    bush.castShadow = true;
    scene.add(bush);
  }
}

/**
 * Procedural 3D Contemporary House:
 * Exterior Shell, Roof, Floorplan, and Detailed Interior Rooms
 */
function buildHouse(scene) {
  const houseGroup = new THREE.Group();
  scene.add(houseGroup);

  // Materials
  const extWallMat = new THREE.MeshStandardMaterial({ color: 0xf3f2ee, roughness: 0.65 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x3d4127, roughness: 0.5 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88c4e8,
    metalness: 0.8,
    roughness: 0.1,
    transparent: true,
    opacity: 0.45
  });
  const woodFloorMat = new THREE.MeshStandardMaterial({ color: 0xb58c5a, roughness: 0.55 });
  const tileFloorMat = new THREE.MeshStandardMaterial({ color: 0xe2e6d5, roughness: 0.4 });
  const furnitureMatDark = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
  const furnitureMatOlive = new THREE.MeshStandardMaterial({ color: 0x636b2f, roughness: 0.6 });
  const furnitureMatLight = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

  // 1. GROUND FLOOR SLAB & INTERIOR FLOORING
  // Living room wood floor (left side)
  const livingFloor = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.1, 15.6), woodFloorMat);
  livingFloor.position.set(-4.8, 0.45, 0);
  livingFloor.receiveShadow = true;
  houseGroup.add(livingFloor);

  // Kitchen/Dining tile floor (right side)
  const kitchenFloor = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.1, 15.6), tileFloorMat);
  kitchenFloor.position.set(4.8, 0.45, 0);
  kitchenFloor.receiveShadow = true;
  houseGroup.add(kitchenFloor);

  // 2. EXTERIOR WALLS (with window cutouts / glass sections)
  // Back Wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 6, 0.4), extWallMat);
  backWall.position.set(0, 3.4, -8);
  backWall.castShadow = true;
  houseGroup.add(backWall);

  // Left Wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 16), extWallMat);
  leftWall.position.set(-10, 3.4, 0);
  leftWall.castShadow = true;
  houseGroup.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 16), extWallMat);
  rightWall.position.set(10, 3.4, 0);
  rightWall.castShadow = true;
  houseGroup.add(rightWall);

  // Front Wall Pillars & Entrance Frame
  const pillarLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 0.4), extWallMat);
  pillarLeft.position.set(-9, 3.4, 8);
  houseGroup.add(pillarLeft);

  const pillarMid = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 0.4), trimMat);
  pillarMid.position.set(0, 3.4, 8);
  houseGroup.add(pillarMid);

  const pillarRight = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 0.4), extWallMat);
  pillarRight.position.set(9, 3.4, 8);
  houseGroup.add(pillarRight);

  // Panoramic Glass Windows (Front Left & Front Right)
  const windowLeft = new THREE.Mesh(new THREE.BoxGeometry(7, 5.2, 0.1), glassMat);
  windowLeft.position.set(-4.5, 3.4, 8);
  houseGroup.add(windowLeft);

  const windowRight = new THREE.Mesh(new THREE.BoxGeometry(7, 5.2, 0.1), glassMat);
  windowRight.position.set(4.5, 3.4, 8);
  houseGroup.add(windowRight);

  // 3. INTERIOR PARTITION WALLS (Creates Living Room, Kitchen, Bedroom Suite)
  const intWallMat = new THREE.MeshStandardMaterial({ color: 0xedebe4, roughness: 0.8 });

  // Central dividing spine (divides left wing from right wing, with archway)
  const spineFront = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.5, 6), intWallMat);
  spineFront.position.set(0, 3.2, 5);
  houseGroup.add(spineFront);

  const spineBack = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.5, 6), intWallMat);
  spineBack.position.set(0, 3.2, -5);
  houseGroup.add(spineBack);

  // Bedroom partition wall (divides Living room from Master Bedroom Suite in rear left)
  const bedPartition = new THREE.Mesh(new THREE.BoxGeometry(7, 5.5, 0.3), intWallMat);
  bedPartition.position.set(-6, 3.2, -1);
  houseGroup.add(bedPartition);

  // 4. DETAILED INTERIOR FURNITURE

  // --- ZONE 1: LIVING ROOM (Front Left) ---
  const livingGroup = new THREE.Group();

  // Sectional L-Sofa
  const sofaBase1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.8, 1.8), furnitureMatDark);
  sofaBase1.position.set(-4.5, 0.85, 3);
  sofaBase1.castShadow = true;
  livingGroup.add(sofaBase1);

  const sofaBase2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 3.5), furnitureMatDark);
  sofaBase2.position.set(-7.2, 0.85, 4.5);
  sofaBase2.castShadow = true;
  livingGroup.add(sofaBase2);

  // Sofa Backrest
  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.2, 0.4), furnitureMatDark);
  sofaBack.position.set(-4.5, 1.45, 2.2);
  livingGroup.add(sofaBack);

  // Olive Cushion Accents
  const cushion1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.3), furnitureMatOlive);
  cushion1.position.set(-3.5, 1.35, 2.5);
  livingGroup.add(cushion1);

  // Designer Coffee Table
  const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 1.5), glassMat);
  coffeeTable.position.set(-4.5, 0.65, 4.8);
  livingGroup.add(coffeeTable);

  // Living Room Area Rug
  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 4),
    new THREE.MeshStandardMaterial({ color: 0xd4de95, roughness: 0.9 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(-4.8, 0.51, 4.8);
  livingGroup.add(rug);

  // Wall-mounted Entertainment Console & TV
  const tvConsole = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.6, 0.8), trimMat);
  tvConsole.position.set(-4.5, 0.75, 7.4);
  livingGroup.add(tvConsole);

  const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 0.1), furnitureMatDark);
  tvScreen.position.set(-4.5, 2.4, 7.7);
  livingGroup.add(tvScreen);

  houseGroup.add(livingGroup);

  // --- ZONE 2: GOURMET KITCHEN & DINING (Front Right) ---
  const kitchenGroup = new THREE.Group();

  // Kitchen Island Counter
  const island = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.3, 1.8), furnitureMatLight);
  island.position.set(4.5, 1.1, 4);
  island.castShadow = true;
  kitchenGroup.add(island);

  // Quartz Countertop
  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.15, 2.1), trimMat);
  counterTop.position.set(4.5, 1.8, 4);
  kitchenGroup.add(counterTop);

  // Bar Stools
  for (let x = 3; x <= 6; x += 1.5) {
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.1, 12), furnitureMatOlive);
    stool.position.set(x, 1.0, 5.4);
    kitchenGroup.add(stool);
  }

  // Dining Table (Mid-Right)
  const diningTable = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 2.4), trimMat);
  diningTable.position.set(5, 1.05, -1);
  kitchenGroup.add(diningTable);

  // Dining Chairs
  for (let z of [-2.4, 0.4]) {
    for (let x of [3.5, 6.5]) {
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.7), furnitureMatDark);
      chair.position.set(x, 1.15, z);
      kitchenGroup.add(chair);
    }
  }

  // Rear Kitchen Cabinets & Refrigerator Unit
  const cabinets = new THREE.Mesh(new THREE.BoxGeometry(8, 3.5, 1.2), furnitureMatDark);
  cabinets.position.set(5, 2.2, 7.2);
  kitchenGroup.add(cabinets);

  houseGroup.add(kitchenGroup);

  // --- ZONE 3: MASTER BEDROOM SUITE (Rear Left) ---
  const bedGroup = new THREE.Group();

  // King Size Platform Bed
  const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 4.2), trimMat);
  bedFrame.position.set(-5, 0.8, -5.5);
  bedFrame.castShadow = true;
  bedGroup.add(bedFrame);

  // Mattress & Linens
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 3.8), furnitureMatLight);
  mattress.position.set(-5, 1.2, -5.4);
  bedGroup.add(mattress);

  // Olive Duvet Runner
  const duvet = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.1, 2.0), furnitureMatOlive);
  duvet.position.set(-5, 1.46, -4.6);
  bedGroup.add(duvet);

  // Upholstered Headboard
  const headboard = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.2, 0.3), furnitureMatDark);
  headboard.position.set(-5, 1.8, -7.6);
  bedGroup.add(headboard);

  // Bedside Nightstands
  const nightstandL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 0.9), trimMat);
  nightstandL.position.set(-7.4, 0.9, -7.2);
  bedGroup.add(nightstandL);

  const nightstandR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 0.9), trimMat);
  nightstandR.position.set(-2.6, 0.9, -7.2);
  bedGroup.add(nightstandR);

  houseGroup.add(bedGroup);

  // 5. FIRST FLOOR BALCONY & SKY TERRACE
  const terraceGeo = new THREE.BoxGeometry(20.4, 0.3, 6);
  const terraceMat = new THREE.MeshStandardMaterial({ color: 0x9e734c, roughness: 0.6 });
  const terrace = new THREE.Mesh(terraceGeo, terraceMat);
  terrace.position.set(0, 6.4, 10);
  houseGroup.add(terrace);

  // Glass Railings for Sky Terrace
  const railingGeo = new THREE.BoxGeometry(20.4, 1.2, 0.08);
  const railing = new THREE.Mesh(railingGeo, glassMat);
  railing.position.set(0, 7.15, 12.9);
  houseGroup.add(railing);

  // Terrace Outdoor Furniture
  const patioSofa = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.7, 1.6), furnitureMatOlive);
  patioSofa.position.set(0, 6.9, 10.5);
  houseGroup.add(patioSofa);

  // 6. ROOF GROUP (Separated so it can be toggled / lifted in Dollhouse mode)
  const roofGroup = new THREE.Group();

  // Modern Cantilevered Overhanging Flat Roof
  const roofSlab = new THREE.Mesh(
    new THREE.BoxGeometry(22, 0.5, 18),
    new THREE.MeshStandardMaterial({ color: 0x2d3224, roughness: 0.65 })
  );
  roofSlab.position.set(0, 6.6, 0);
  roofSlab.castShadow = true;
  roofGroup.add(roofSlab);

  // Upper Architectural Penthouse / Parapet Box
  const parapet = new THREE.Mesh(
    new THREE.BoxGeometry(12, 2.5, 10),
    new THREE.MeshStandardMaterial({ color: 0xf3f2ee, roughness: 0.7 })
  );
  parapet.position.set(-2, 8.0, -2);
  parapet.castShadow = true;
  roofGroup.add(parapet);

  // Top Solar Panel Arrays & Skylight
  const solarPanel = new THREE.Mesh(
    new THREE.BoxGeometry(7, 0.1, 4),
    new THREE.MeshStandardMaterial({ color: 0x1a2e40, metalness: 0.9, roughness: 0.2 })
  );
  solarPanel.position.set(-2, 9.3, -2);
  roofGroup.add(solarPanel);

  houseGroup.add(roofGroup);

  // 7. INTERIOR WARM ILLUMINATION LIGHTS
  const interiorLights = [];

  // Living Room Chandelier Light
  const livingLight = new THREE.PointLight(0xffeedd, 1.5, 15);
  livingLight.position.set(-4.5, 4.5, 3.5);
  scene.add(livingLight);
  interiorLights.push(livingLight);

  // Kitchen Island Pendant Light
  const kitchenLight = new THREE.PointLight(0xffeedd, 1.5, 15);
  kitchenLight.position.set(4.5, 4.5, 3.5);
  scene.add(kitchenLight);
  interiorLights.push(kitchenLight);

  // Master Bedroom Sconce Light
  const bedLight = new THREE.PointLight(0xffeedd, 1.2, 12);
  bedLight.position.set(-5, 4.5, -5.5);
  scene.add(bedLight);
  interiorLights.push(bedLight);

  // Terrace Sconce Light
  const terraceLight = new THREE.PointLight(0xffddaa, 1.2, 12);
  terraceLight.position.set(0, 7.8, 8);
  scene.add(terraceLight);
  interiorLights.push(terraceLight);

  // Swimming Pool Underwater Light
  const poolLight = new THREE.PointLight(0x00e1ff, 1.0, 10);
  poolLight.position.set(-16, 0.1, 0);
  scene.add(poolLight);

  return { roofGroup, interiorLights, poolLight };
}
