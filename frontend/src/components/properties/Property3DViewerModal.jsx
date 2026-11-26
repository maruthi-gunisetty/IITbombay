import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  X, Compass, Home, Eye, Sun, Moon, Sunrise, Maximize2, Minimize2,
  RotateCw, ZoomIn, ZoomOut, Layers, MapPin, Building,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw
} from 'lucide-react';

/**
 * Procedural 3D Architectural Digital Twin & Immersive Walkthrough Viewer
 * Features:
 * 1. Full Exterior & Surroundings (Lawn, Driveway, Pool, Trees, Fencing, Lighting)
 * 2. Dollhouse Mode (Roof removed, 3D Floorplan visible)
 * 3. Immersive First-Person Walk Inside House:
 *    - Real-time Cursor Look & Movement: View smoothly turns and tracks as mouse moves
 *    - Click & Drag 360° Free Look
 *    - Click Floor to Walk / Teleport with animated ripple beacon
 *    - WASD & Arrow Keys walking navigation
 *    - On-screen Virtual Walking D-Pad for one-click navigation
 *    - 3D Interactive Room Waypoint Markers on floor
 * 4. Day / Sunset / Night Lighting with Real-Time Glowing Interior Lights
 * 5. Smooth Cinematic Transitions between Exterior, Dollhouse, and Rooms
 */
export default function Property3DViewerModal({ property, isOpen, onClose }) {
  const mountRef = useRef(null);

  // Viewer State
  const [viewMode, setViewMode] = useState('exterior'); // 'exterior' | 'dollhouse' | 'interior'
  const [activeRoom, setActiveRoom] = useState('living'); // 'living' | 'kitchen' | 'bedroom' | 'terrace' | 'pool'
  const [timeOfDay, setTimeOfDay] = useState('day'); // 'day' | 'sunset' | 'night'
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [walkNotice, setWalkNotice] = useState('Move cursor to look around · Click floor or use arrows to walk');

  // References for Three.js engine
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Dynamic Scene Elements
  const roofGroupRef = useRef(null);
  const interiorLightsRef = useRef([]);
  const sunLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const poolLightRef = useRef(null);
  const floorMeshListRef = useRef([]);
  const waypointMeshListRef = useRef([]);
  const clickRippleRef = useRef(null);

  // Walk Engine & First-Person Camera State
  const viewModeRef = useRef('exterior');
  viewModeRef.current = viewMode;

  const playerPos = useRef(new THREE.Vector3(26, 18, 30));
  const targetPlayerPos = useRef(new THREE.Vector3(26, 18, 30));
  const targetLookAt = useRef(new THREE.Vector3(0, 3, 0));
  const isTransitioning = useRef(true);

  // First-Person Rotation (Yaw & Pitch)
  const yaw = useRef(-Math.PI * 0.7);
  const pitch = useRef(0);
  const cursorOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const keysDown = useRef({});

  // Room Coordinates Presets
  const ROOM_COORDINATES = {
    exterior: { pos: new THREE.Vector3(26, 18, 30), lookAt: new THREE.Vector3(0, 3, 0), yaw: -Math.PI * 0.7, pitch: 0 },
    dollhouse: { pos: new THREE.Vector3(0, 28, 22), lookAt: new THREE.Vector3(0, 2, 0), yaw: 0, pitch: -0.6 },
    living: { pos: new THREE.Vector3(-4.5, 2.9, 3.2), lookAt: new THREE.Vector3(-2.0, 2.7, -0.5), yaw: -Math.PI * 0.75, pitch: 0 },
    kitchen: { pos: new THREE.Vector3(4.5, 2.9, 3.2), lookAt: new THREE.Vector3(3.5, 2.7, -1.5), yaw: -Math.PI * 0.85, pitch: 0 },
    bedroom: { pos: new THREE.Vector3(-4.8, 2.9, -4.5), lookAt: new THREE.Vector3(-4.8, 2.7, -7.0), yaw: -Math.PI * 0.95, pitch: 0 },
    terrace: { pos: new THREE.Vector3(0, 7.5, 8.5), lookAt: new THREE.Vector3(0, 6.8, 14.0), yaw: 0, pitch: -0.05 },
    pool: { pos: new THREE.Vector3(-14.0, 2.2, 5.0), lookAt: new THREE.Vector3(-14.0, 1.8, 0), yaw: -Math.PI * 0.5, pitch: 0 }
  };

  useEffect(() => {
    if (!isOpen) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xdce9f2);
    scene.fog = new THREE.FogExp2(0xdce9f2, 0.012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.2, 300);
    camera.position.set(26, 18, 30);
    cameraRef.current = camera;
    playerPos.current.copy(camera.position);
    targetPlayerPos.current.copy(camera.position);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls (Used for Exterior & Dollhouse view)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 3;
    controls.maxDistance = 85;
    controls.target.set(0, 3, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    sunLight.position.set(32, 48, 28);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 130;
    const d = 30;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 6. Build Surroundings & Environment
    const { floorMeshes } = buildSurroundings(scene);
    floorMeshListRef.current = floorMeshes;

    // 7. Build Architectural House & Interior
    const { roofGroup, interiorLights, poolLight, houseFloorMeshes } = buildHouse(scene);
    roofGroupRef.current = roofGroup;
    interiorLightsRef.current = interiorLights;
    poolLightRef.current = poolLight;
    floorMeshListRef.current = [...floorMeshes, ...houseFloorMeshes];

    // 8. Build 3D Interactive Floor Waypoints
    const waypoints = buildWaypoints(scene);
    waypointMeshListRef.current = waypoints;

    // 9. Click Ripple Effect on Floor
    const rippleGeo = new THREE.RingGeometry(0.1, 0.8, 32);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0x636B2F,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    const ripple = new THREE.Mesh(rippleGeo, rippleMat);
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.y = 0.51;
    scene.add(ripple);
    clickRippleRef.current = ripple;

    // 10. Animation & Walk Loop
    let rippleAnim = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const isInterior = viewModeRef.current === 'interior';

      if (isInterior) {
        // --- FIRST PERSON WALK & CURSOR LOOK ENGINE ---
        controls.enabled = false;

        // Smooth transition to target position
        if (isTransitioning.current) {
          playerPos.current.lerp(targetPlayerPos.current, 0.08);
          if (playerPos.current.distanceTo(targetPlayerPos.current) < 0.05) {
            isTransitioning.current = false;
          }
        }

        // Handle keyboard walk movement
        const walkSpeed = 0.12;
        const fwd = new THREE.Vector3(Math.sin(yaw.current), 0, Math.cos(yaw.current));
        const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), fwd).normalize();

        let moved = false;
        if (keysDown.current['KeyW'] || keysDown.current['ArrowUp']) {
          targetPlayerPos.current.addScaledVector(fwd, walkSpeed);
          moved = true;
        }
        if (keysDown.current['KeyS'] || keysDown.current['ArrowDown']) {
          targetPlayerPos.current.addScaledVector(fwd, -walkSpeed);
          moved = true;
        }
        if (keysDown.current['KeyA'] || keysDown.current['ArrowLeft']) {
          targetPlayerPos.current.addScaledVector(right, -walkSpeed);
          moved = true;
        }
        if (keysDown.current['KeyD'] || keysDown.current['ArrowRight']) {
          targetPlayerPos.current.addScaledVector(right, walkSpeed);
          moved = true;
        }
        if (keysDown.current['KeyQ']) {
          yaw.current += 0.03;
        }
        if (keysDown.current['KeyE']) {
          yaw.current -= 0.03;
        }

        if (moved) {
          // Clamp inside house bounds according to elevation
          if (targetPlayerPos.current.y > 5.0) {
            // Terrace bounds
            targetPlayerPos.current.x = THREE.MathUtils.clamp(targetPlayerPos.current.x, -8.5, 8.5);
            targetPlayerPos.current.z = THREE.MathUtils.clamp(targetPlayerPos.current.z, 7.5, 12.5);
          } else if (targetPlayerPos.current.x < -10.0) {
            // Pool deck bounds
            targetPlayerPos.current.x = THREE.MathUtils.clamp(targetPlayerPos.current.x, -19.0, -10.5);
            targetPlayerPos.current.z = THREE.MathUtils.clamp(targetPlayerPos.current.z, -6.0, 6.0);
          } else {
            // Interior rooms bounds
            targetPlayerPos.current.x = THREE.MathUtils.clamp(targetPlayerPos.current.x, -8.5, 8.5);
            targetPlayerPos.current.z = THREE.MathUtils.clamp(targetPlayerPos.current.z, -6.8, 6.8);
          }
          playerPos.current.lerp(targetPlayerPos.current, 0.18);
        }

        // Apply Player Position with dynamic head cursor sway
        const headSwayX = cursorOffset.current.x * 0.15;
        const headSwayZ = cursorOffset.current.y * 0.15;
        camera.position.set(
          playerPos.current.x + headSwayX,
          playerPos.current.y,
          playerPos.current.z + headSwayZ
        );

        // Effective Look Angle: Base rotation + Natural cursor tracking
        const effectiveYaw = yaw.current - (cursorOffset.current.x * 0.65);
        const effectivePitch = THREE.MathUtils.clamp(pitch.current - (cursorOffset.current.y * 0.45), -0.75, 0.75);

        // Calculate gaze direction vector
        const lookDir = new THREE.Vector3(
          Math.sin(effectiveYaw) * Math.cos(effectivePitch),
          Math.sin(effectivePitch),
          Math.cos(effectiveYaw) * Math.cos(effectivePitch)
        );

        const lookTarget = camera.position.clone().add(lookDir);
        camera.lookAt(lookTarget);

      } else {
        // --- EXTERIOR / DOLLHOUSE ORBIT MODE ---
        controls.enabled = true;

        if (isTransitioning.current) {
          camera.position.lerp(targetPlayerPos.current, 0.06);
          controls.target.lerp(targetLookAt.current, 0.06);
          if (camera.position.distanceTo(targetPlayerPos.current) < 0.2) {
            isTransitioning.current = false;
          }
        }
        controls.update();
      }

      // Animate Click Ripple
      if (clickRippleRef.current && rippleAnim > 0) {
        rippleAnim -= 0.035;
        const s = (1 - rippleAnim) * 2.2 + 0.5;
        clickRippleRef.current.scale.set(s, s, s);
        clickRippleRef.current.material.opacity = Math.max(0, rippleAnim);
      }

      // Animate 3D Floor Waypoint Beacons
      waypointMeshListRef.current.forEach((wp, idx) => {
        if (wp.ring) {
          wp.ring.rotation.z += 0.02 * (idx % 2 === 0 ? 1 : -1);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // 11. Mouse & Pointer Movement (Cursor Look in Walk Mode)
    const handlePointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Smooth cursor parallax tracking
      cursorOffset.current.x = THREE.MathUtils.clamp(x, -1, 1);
      cursorOffset.current.y = THREE.MathUtils.clamp(y, -1, 1);

      // Free 360° Drag Look in walk mode
      if (isDragging.current && viewModeRef.current === 'interior') {
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        yaw.current += deltaX * 0.005;
        pitch.current = THREE.MathUtils.clamp(pitch.current - deltaY * 0.004, -0.75, 0.75);
      }
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerDown = (e) => {
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    // 12. Click on Floor / Waypoint to Walk Directly
    const handleCanvasClick = (e) => {
      if (viewModeRef.current !== 'interior') return;

      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Check waypoint beacons first
      const wpIntersects = raycaster.intersectObjects(waypointMeshListRef.current.map(w => w.mesh));
      if (wpIntersects.length > 0) {
        const hitWp = waypointMeshListRef.current.find(w => w.mesh === wpIntersects[0].object);
        if (hitWp) {
          teleportToLocation(hitWp.pos, hitWp.yaw, hitWp.id);
          return;
        }
      }

      // Check Floor Meshes to walk forward
      const floorIntersects = raycaster.intersectObjects(floorMeshListRef.current);
      if (floorIntersects.length > 0) {
        const pt = floorIntersects[0].point;
        // Trigger ripple
        if (clickRippleRef.current) {
          clickRippleRef.current.position.set(pt.x, pt.y + 0.05, pt.z);
          clickRippleRef.current.scale.set(0.2, 0.2, 0.2);
          clickRippleRef.current.material.opacity = 0.9;
          rippleAnim = 1.0;
        }

        // Smoothly walk player to clicked location
        const targetY = pt.y > 4 ? 7.5 : (pt.x < -10 ? 2.2 : 2.9);
        targetPlayerPos.current.set(pt.x, targetY, pt.z);
        isTransitioning.current = true;
        setWalkNotice(`Walking to point (${pt.x.toFixed(1)}, ${pt.z.toFixed(1)})`);
      }
    };

    // 13. Keyboard Listeners
    const handleKeyDown = (e) => {
      keysDown.current[e.code] = true;
      if (e.key === 'Escape') onClose();
    };
    const handleKeyUp = (e) => {
      keysDown.current[e.code] = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointermove', handlePointerMove);
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('click', handleCanvasClick);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 14. Window Resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      dom.removeEventListener('pointermove', handlePointerMove);
      dom.removeEventListener('pointerdown', handlePointerDown);
      dom.removeEventListener('click', handleCanvasClick);

      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement.parentNode);
      }
      renderer.dispose();
    };
  }, [isOpen]);

  // Smooth Teleport to Room Preset
  const teleportToLocation = (targetPos, targetYaw, roomId = null) => {
    targetPlayerPos.current.copy(targetPos);
    yaw.current = targetYaw;
    pitch.current = 0;
    cursorOffset.current = { x: 0, y: 0 };
    isTransitioning.current = true;
    if (roomId) setActiveRoom(roomId);
  };

  // Handle View Mode & Room Transitions
  useEffect(() => {
    if (!controlsRef.current) return;

    if (viewMode === 'exterior') {
      targetPlayerPos.current.copy(ROOM_COORDINATES.exterior.pos);
      targetLookAt.current.copy(ROOM_COORDINATES.exterior.lookAt);
      isTransitioning.current = true;
      if (roofGroupRef.current) roofGroupRef.current.visible = true;
      setWalkNotice('Exterior orbit mode: Drag to inspect architecture 360°');
    } else if (viewMode === 'dollhouse') {
      targetPlayerPos.current.copy(ROOM_COORDINATES.dollhouse.pos);
      targetLookAt.current.copy(ROOM_COORDINATES.dollhouse.lookAt);
      isTransitioning.current = true;
      if (roofGroupRef.current) roofGroupRef.current.visible = false;
      setWalkNotice('Dollhouse 3D Floorplan: Roof lifted to inspect layout');
    } else if (viewMode === 'interior') {
      if (roofGroupRef.current) roofGroupRef.current.visible = false;
      const room = ROOM_COORDINATES[activeRoom] || ROOM_COORDINATES.living;
      teleportToLocation(room.pos, room.yaw, activeRoom);
      setWalkNotice('Walk Mode Active: Move cursor to look · Click floor or use buttons/WASD to walk');
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
      sun.position.set(32, 48, 28);
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

  // Handle Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Virtual Walking Pad Navigation (One-touch buttons)
  const handleVirtualWalk = (direction) => {
    if (viewMode !== 'interior') {
      setViewMode('interior');
    }
    const step = 1.2;
    const fwd = new THREE.Vector3(Math.sin(yaw.current), 0, Math.cos(yaw.current));
    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), fwd).normalize();

    if (direction === 'forward') {
      targetPlayerPos.current.addScaledVector(fwd, step);
    } else if (direction === 'backward') {
      targetPlayerPos.current.addScaledVector(fwd, -step);
    } else if (direction === 'left') {
      targetPlayerPos.current.addScaledVector(right, -step);
    } else if (direction === 'right') {
      targetPlayerPos.current.addScaledVector(right, step);
    } else if (direction === 'turnLeft') {
      yaw.current += 0.35;
    } else if (direction === 'turnRight') {
      yaw.current -= 0.35;
    }
    isTransitioning.current = true;
  };

  // Zoom handlers
  const handleZoom = (delta) => {
    if (viewMode === 'interior') {
      handleVirtualWalk(delta > 0 ? 'forward' : 'backward');
    } else if (cameraRef.current && controlsRef.current) {
      const dir = new THREE.Vector3().subVectors(controlsRef.current.target, cameraRef.current.position).normalize();
      cameraRef.current.position.addScaledVector(dir, delta * 3);
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    setViewMode('exterior');
    targetPlayerPos.current.copy(ROOM_COORDINATES.exterior.pos);
    targetLookAt.current.copy(ROOM_COORDINATES.exterior.lookAt);
    isTransitioning.current = true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className={`relative bg-[#0F172A] border border-[#3D4127] rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[88vh]'
      }`}>
        
        {/* TOP BAR / HEADER */}
        <div className="px-6 py-3.5 bg-[#1E293B]/95 border-b border-[#3D4127]/60 flex items-center justify-between z-10">
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
                  Gruha Anwesh 3D
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
        <div className="relative flex-1 w-full h-full bg-[#0b101b] overflow-hidden select-none">
          <div
            ref={mountRef}
            className={`w-full h-full ${viewMode === 'interior' ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
          />

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
                { id: 'terrace', label: 'Sky Balcony' },
                { id: 'pool', label: 'Pool & Lounge' }
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

          {/* FIRST-PERSON VIRTUAL WALKING D-PAD (INTERIOR WALK MODE) */}
          {viewMode === 'interior' && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 bg-[#0F172A]/90 backdrop-blur-md p-2.5 rounded-2xl border border-[#BAC095]/40 shadow-2xl">
              <div className="text-[10px] font-bold text-[#D4DE95] uppercase tracking-wider mb-0.5 flex items-center space-x-1">
                <span>Walk Controls</span>
                <span className="text-[#BAC095] font-normal lowercase">(cursor moves gaze)</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleVirtualWalk('turnLeft')}
                  className="w-9 h-8 rounded-lg bg-[#334155]/70 hover:bg-[#636B2F] text-white flex items-center justify-center transition-colors active:scale-95"
                  title="Turn Left (Q)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleVirtualWalk('forward')}
                  className="w-9 h-8 rounded-lg bg-[#636B2F] hover:bg-[#3D4127] text-white flex items-center justify-center shadow-md transition-colors active:scale-95"
                  title="Step Forward (W / Up Arrow)"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleVirtualWalk('turnRight')}
                  className="w-9 h-8 rounded-lg bg-[#334155]/70 hover:bg-[#636B2F] text-white flex items-center justify-center transition-colors active:scale-95"
                  title="Turn Right (E)"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleVirtualWalk('left')}
                  className="w-9 h-8 rounded-lg bg-[#334155]/70 hover:bg-[#636B2F] text-white flex items-center justify-center transition-colors active:scale-95"
                  title="Step Left (A / Left Arrow)"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleVirtualWalk('backward')}
                  className="w-9 h-8 rounded-lg bg-[#636B2F] hover:bg-[#3D4127] text-white flex items-center justify-center shadow-md transition-colors active:scale-95"
                  title="Step Backward (S / Down Arrow)"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleVirtualWalk('right')}
                  className="w-9 h-8 rounded-lg bg-[#334155]/70 hover:bg-[#636B2F] text-white flex items-center justify-center transition-colors active:scale-95"
                  title="Step Right (D / Right Arrow)"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* BOTTOM-RIGHT: CAMERA & INTERACTION TOOLBAR */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 bg-[#0F172A]/85 backdrop-blur-md p-1.5 rounded-xl border border-[#BAC095]/40 shadow-lg">
            {viewMode !== 'interior' && (
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
            )}

            <button
              onClick={() => handleZoom(1)}
              className="p-1.5 rounded-lg text-[#BAC095] hover:text-white hover:bg-[#334155] transition-colors"
              title={viewMode === 'interior' ? 'Step Forward' : 'Zoom In'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleZoom(-1)}
              className="p-1.5 rounded-lg text-[#BAC095] hover:text-white hover:bg-[#334155] transition-colors"
              title={viewMode === 'interior' ? 'Step Backward' : 'Zoom Out'}
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
          <div className="absolute bottom-20 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#D4DE95] text-[11px] border border-[#BAC095]/30 shadow-sm text-center">
              {walkNotice}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * 3D Interactive Floor Waypoints for Instant Room Navigation
 */
function buildWaypoints(scene) {
  const waypoints = [
    { id: 'living', name: 'Living Room', pos: new THREE.Vector3(-4.5, 2.9, 3.2), floorY: 0.52, floorX: -4.5, floorZ: 3.5, yaw: -Math.PI * 0.75 },
    { id: 'kitchen', name: 'Kitchen & Dining', pos: new THREE.Vector3(4.5, 2.9, 3.2), floorY: 0.52, floorX: 4.5, floorZ: 3.5, yaw: -Math.PI * 0.85 },
    { id: 'bedroom', name: 'Master Suite', pos: new THREE.Vector3(-4.8, 2.9, -4.5), floorY: 0.52, floorX: -4.8, floorZ: -4.5, yaw: -Math.PI * 0.95 },
    { id: 'terrace', name: 'Sky Balcony', pos: new THREE.Vector3(0, 7.5, 8.5), floorY: 6.52, floorX: 0, floorZ: 9.5, yaw: 0 },
    { id: 'pool', name: 'Pool & Lounge', pos: new THREE.Vector3(-14.0, 2.2, 5.0), floorY: 0.38, floorX: -14.0, floorZ: 0, yaw: -Math.PI * 0.5 }
  ];

  return waypoints.map(wp => {
    const group = new THREE.Group();
    group.position.set(wp.floorX, wp.floorY, wp.floorZ);

    // Glowing Inner Ring
    const ringGeo = new THREE.RingGeometry(0.3, 0.45, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xD4DE95,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    group.add(ring);

    // Center Core Disc
    const discGeo = new THREE.CircleGeometry(0.2, 16);
    const discMat = new THREE.MeshBasicMaterial({ color: 0x636B2F });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    group.add(disc);

    scene.add(group);
    return { mesh: disc, ring, pos: wp.pos, yaw: wp.yaw, id: wp.id };
  });
}

/**
 * Procedural 3D Environment: Grounds, Lawn, Trees, Swimming Pool, Pavements, Driveway
 */
function buildSurroundings(scene) {
  const floorMeshes = [];

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
  floorMeshes.push(lawn);

  // 2. Concrete Base / Foundation Pad
  const padGeo = new THREE.BoxGeometry(22, 0.4, 18);
  const padMat = new THREE.MeshStandardMaterial({ color: 0xd6dbcd, roughness: 0.7 });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.position.set(0, 0.2, 0);
  pad.receiveShadow = true;
  scene.add(pad);
  floorMeshes.push(pad);

  // 3. Paved Driveway
  const driveGeo = new THREE.PlaneGeometry(7, 30);
  const driveMat = new THREE.MeshStandardMaterial({ color: 0x474944, roughness: 0.8 });
  const drive = new THREE.Mesh(driveGeo, driveMat);
  drive.rotation.x = -Math.PI / 2;
  drive.position.set(6, 0.05, 17);
  drive.receiveShadow = true;
  scene.add(drive);
  floorMeshes.push(drive);

  // 4. Stone Walkway to Porch
  const pathGeo = new THREE.PlaneGeometry(3.5, 14);
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xd4de95, roughness: 0.75 });
  const path = new THREE.Mesh(pathGeo, pathMat);
  path.rotation.x = -Math.PI / 2;
  path.position.set(-1.5, 0.06, 12);
  path.receiveShadow = true;
  scene.add(path);
  floorMeshes.push(path);

  // 5. Luxury Swimming Pool & Timber Deck
  const deckGeo = new THREE.BoxGeometry(10, 0.3, 14);
  const deckMat = new THREE.MeshStandardMaterial({ color: 0x9e734c, roughness: 0.6 });
  const deck = new THREE.Mesh(deckGeo, deckMat);
  deck.position.set(-16, 0.15, 0);
  deck.receiveShadow = true;
  scene.add(deck);
  floorMeshes.push(deck);

  // Pool Water
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

    // Canopy
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
    if (x === -2 || x === 0) continue;
    const bush = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x3d4127, roughness: 0.8 })
    );
    bush.position.set(x, 0.5, 9.5);
    bush.castShadow = true;
    scene.add(bush);
  }

  return { floorMeshes };
}

/**
 * Procedural 3D Contemporary House:
 * Exterior Shell, Roof, Floorplan, and Detailed Interior Rooms
 */
function buildHouse(scene) {
  const houseGroup = new THREE.Group();
  scene.add(houseGroup);
  const houseFloorMeshes = [];

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
  const livingFloor = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.1, 15.6), woodFloorMat);
  livingFloor.position.set(-4.8, 0.45, 0);
  livingFloor.receiveShadow = true;
  houseGroup.add(livingFloor);
  houseFloorMeshes.push(livingFloor);

  const kitchenFloor = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.1, 15.6), tileFloorMat);
  kitchenFloor.position.set(4.8, 0.45, 0);
  kitchenFloor.receiveShadow = true;
  houseGroup.add(kitchenFloor);
  houseFloorMeshes.push(kitchenFloor);

  // 2. EXTERIOR WALLS
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 6, 0.4), extWallMat);
  backWall.position.set(0, 3.4, -8);
  backWall.castShadow = true;
  houseGroup.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 16), extWallMat);
  leftWall.position.set(-10, 3.4, 0);
  leftWall.castShadow = true;
  houseGroup.add(leftWall);

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

  // 3. INTERIOR PARTITION WALLS
  const intWallMat = new THREE.MeshStandardMaterial({ color: 0xedebe4, roughness: 0.8 });

  const spineFront = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.5, 6), intWallMat);
  spineFront.position.set(0, 3.2, 5);
  houseGroup.add(spineFront);

  const spineBack = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.5, 6), intWallMat);
  spineBack.position.set(0, 3.2, -5);
  houseGroup.add(spineBack);

  const bedPartition = new THREE.Mesh(new THREE.BoxGeometry(7, 5.5, 0.3), intWallMat);
  bedPartition.position.set(-6, 3.2, -1);
  houseGroup.add(bedPartition);

  // 4. DETAILED INTERIOR FURNITURE
  // --- LIVING ROOM ---
  const livingGroup = new THREE.Group();
  const sofaBase1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.8, 1.8), furnitureMatDark);
  sofaBase1.position.set(-4.5, 0.85, 3);
  sofaBase1.castShadow = true;
  livingGroup.add(sofaBase1);

  const sofaBase2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 3.5), furnitureMatDark);
  sofaBase2.position.set(-7.2, 0.85, 4.5);
  sofaBase2.castShadow = true;
  livingGroup.add(sofaBase2);

  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.2, 0.4), furnitureMatDark);
  sofaBack.position.set(-4.5, 1.45, 2.2);
  livingGroup.add(sofaBack);

  const cushion1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.3), furnitureMatOlive);
  cushion1.position.set(-3.5, 1.35, 2.5);
  livingGroup.add(cushion1);

  const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 1.5), glassMat);
  coffeeTable.position.set(-4.5, 0.65, 4.8);
  livingGroup.add(coffeeTable);

  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 4),
    new THREE.MeshStandardMaterial({ color: 0xd4de95, roughness: 0.9 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(-4.8, 0.51, 4.8);
  livingGroup.add(rug);

  const tvConsole = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.6, 0.8), trimMat);
  tvConsole.position.set(-4.5, 0.75, 7.4);
  livingGroup.add(tvConsole);

  const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 0.1), furnitureMatDark);
  tvScreen.position.set(-4.5, 2.4, 7.7);
  livingGroup.add(tvScreen);
  houseGroup.add(livingGroup);

  // --- KITCHEN & DINING ---
  const kitchenGroup = new THREE.Group();
  const island = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.3, 1.8), furnitureMatLight);
  island.position.set(4.5, 1.1, 4);
  island.castShadow = true;
  kitchenGroup.add(island);

  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.15, 2.1), trimMat);
  counterTop.position.set(4.5, 1.8, 4);
  kitchenGroup.add(counterTop);

  for (let x = 3; x <= 6; x += 1.5) {
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.1, 12), furnitureMatOlive);
    stool.position.set(x, 1.0, 5.4);
    kitchenGroup.add(stool);
  }

  const diningTable = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 2.4), trimMat);
  diningTable.position.set(5, 1.05, -1);
  kitchenGroup.add(diningTable);

  for (let z of [-2.4, 0.4]) {
    for (let x of [3.5, 6.5]) {
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.7), furnitureMatDark);
      chair.position.set(x, 1.15, z);
      kitchenGroup.add(chair);
    }
  }

  const cabinets = new THREE.Mesh(new THREE.BoxGeometry(8, 3.5, 1.2), furnitureMatDark);
  cabinets.position.set(5, 2.2, 7.2);
  kitchenGroup.add(cabinets);
  houseGroup.add(kitchenGroup);

  // --- MASTER BEDROOM ---
  const bedGroup = new THREE.Group();
  const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 4.2), trimMat);
  bedFrame.position.set(-5, 0.8, -5.5);
  bedFrame.castShadow = true;
  bedGroup.add(bedFrame);

  const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 3.8), furnitureMatLight);
  mattress.position.set(-5, 1.2, -5.4);
  bedGroup.add(mattress);

  const duvet = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.1, 2.0), furnitureMatOlive);
  duvet.position.set(-5, 1.46, -4.6);
  bedGroup.add(duvet);

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.2, 0.3), furnitureMatDark);
  headboard.position.set(-5, 1.8, -7.6);
  bedGroup.add(headboard);

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
  houseFloorMeshes.push(terrace);

  const railingGeo = new THREE.BoxGeometry(20.4, 1.2, 0.08);
  const railing = new THREE.Mesh(railingGeo, glassMat);
  railing.position.set(0, 7.15, 12.9);
  houseGroup.add(railing);

  const patioSofa = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.7, 1.6), furnitureMatOlive);
  patioSofa.position.set(0, 6.9, 10.5);
  houseGroup.add(patioSofa);

  // 6. ROOF GROUP
  const roofGroup = new THREE.Group();
  const roofSlab = new THREE.Mesh(
    new THREE.BoxGeometry(22, 0.5, 18),
    new THREE.MeshStandardMaterial({ color: 0x2d3224, roughness: 0.65 })
  );
  roofSlab.position.set(0, 6.6, 0);
  roofSlab.castShadow = true;
  roofGroup.add(roofSlab);

  const parapet = new THREE.Mesh(
    new THREE.BoxGeometry(12, 2.5, 10),
    new THREE.MeshStandardMaterial({ color: 0xf3f2ee, roughness: 0.7 })
  );
  parapet.position.set(-2, 8.0, -2);
  parapet.castShadow = true;
  roofGroup.add(parapet);

  const solarPanel = new THREE.Mesh(
    new THREE.BoxGeometry(7, 0.1, 4),
    new THREE.MeshStandardMaterial({ color: 0x1a2e40, metalness: 0.9, roughness: 0.2 })
  );
  solarPanel.position.set(-2, 9.3, -2);
  roofGroup.add(solarPanel);
  houseGroup.add(roofGroup);

  // 7. INTERIOR WARM ILLUMINATION LIGHTS
  const interiorLights = [];
  const livingLight = new THREE.PointLight(0xffeedd, 1.5, 15);
  livingLight.position.set(-4.5, 4.5, 3.5);
  scene.add(livingLight);
  interiorLights.push(livingLight);

  const kitchenLight = new THREE.PointLight(0xffeedd, 1.5, 15);
  kitchenLight.position.set(4.5, 4.5, 3.5);
  scene.add(kitchenLight);
  interiorLights.push(kitchenLight);

  const bedLight = new THREE.PointLight(0xffeedd, 1.2, 12);
  bedLight.position.set(-5, 4.5, -5.5);
  scene.add(bedLight);
  interiorLights.push(bedLight);

  const terraceLight = new THREE.PointLight(0xffddaa, 1.2, 12);
  terraceLight.position.set(0, 7.8, 8);
  scene.add(terraceLight);
  interiorLights.push(terraceLight);

  const poolLight = new THREE.PointLight(0x00e1ff, 1.0, 10);
  poolLight.position.set(-16, 0.1, 0);
  scene.add(poolLight);

  return { roofGroup, interiorLights, poolLight, houseFloorMeshes };
}
