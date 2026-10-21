import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Compass,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  MapPin,
  Sparkles,
  Map as MapIcon,
  RotateCcw,
  CheckCircle2,
  Layers,
  X,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { TourSpot } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface VirtualTourViewerProps {
  spot: TourSpot;
  allSpots: TourSpot[];
  onSelectSpot: (spotId: string) => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

// 2D Coordinates on the Somaiya Vidyavihar campus schematic map (percentages 0-100)
const campusMapCoordinates: Record<string, { x: number; y: number; label: string }> = {
  'spot-entrance': { x: 18, y: 84, label: 'Main Gate 1' },
  'spot-kjsce': { x: 34, y: 62, label: 'KJSCE Aryabhat' },
  'spot-academic': { x: 50, y: 72, label: 'Academic Quad' },
  'spot-classroom': { x: 56, y: 66, label: 'Smart Lecture Hall' },
  'spot-library': { x: 42, y: 50, label: 'Central Library' },
  'spot-auditorium': { x: 48, y: 40, label: 'Grand Auditorium' },
  'spot-auditorium-stage': { x: 52, y: 35, label: 'Auditorium I' },
  'spot-seminar': { x: 60, y: 44, label: 'MDP Seminar Hall' },
  'spot-gardens': { x: 62, y: 56, label: 'Central Gardens' },
  'spot-founder': { x: 52, y: 54, label: 'Founder Memorial' },
  'spot-sports': { x: 78, y: 30, label: 'Athletic Stadium' },
  'spot-canteen': { x: 68, y: 46, label: 'Dining Pavilion' },
  'spot-chanakya': { x: 64, y: 76, label: 'Chanakya Plaza' },
  'spot-lab': { x: 28, y: 52, label: 'riidl Maker Lab' },
  'spot-hostel': { x: 82, y: 58, label: 'Hostel Enclave' },
};

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  spot,
  allSpots,
  onSelectSpot,
  isSaved = false,
  onToggleSave,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // High-performance animation refs (prevents 60 FPS React re-renders)
  const panXRef = useRef<number>(0);
  const panYRef = useRef<number>(0);
  const zoomRef = useRef<number>(1.0);
  const isAutoRotatingRef = useRef<boolean>(true);
  const autoPanDirectionRef = useRef<number>(1);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDistanceRef = useRef<number>(0);
  const textureRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Display UI State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'fit' | 'fill'>('fit');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showMinimap, setShowMinimap] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [compassHeading, setCompassHeading] = useState<string>('N 0°');

  // Audio synthesis ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);

  const currentIndex = allSpots.findIndex((s) => s.id === spot.id);
  const prevSpot = currentIndex > 0 ? allSpots[currentIndex - 1] : null;
  const nextSpot = currentIndex < allSpots.length - 1 ? allSpots[currentIndex + 1] : null;

  // Sync ref with state
  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  // Toggle ambient breeze sound
  const toggleAudio = () => {
    if (isMuted) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
          const gainNode = audioCtxRef.current.createGain();
          gainNode.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
          gainNode.connect(audioCtxRef.current.destination);
          audioGainRef.current = gainNode;

          const bufferSize = audioCtxRef.current.sampleRate * 2;
          const noiseBuffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.1;
          }
          const whiteNoise = audioCtxRef.current.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          const filter = audioCtxRef.current.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, audioCtxRef.current.currentTime);

          whiteNoise.connect(filter);
          filter.connect(gainNode);
          whiteNoise.start(0);
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        setIsMuted(false);
      } catch (err) {
        console.error('Audio synthesis failed:', err);
      }
    } else {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      setIsMuted(true);
    }
  };

  // Preload and cache current location texture
  useEffect(() => {
    setImageLoaded(false);
    setTransitioning(true);
    panXRef.current = 0;
    panYRef.current = 0;
    zoomRef.current = 1.0;
    setZoomLevel(100);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = spot.panoramaUrl;
    img.onload = () => {
      textureRef.current = img;
      setImageLoaded(true);
      setTimeout(() => setTransitioning(false), 200);
    };
    img.onerror = () => {
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 1600;
      fallbackCanvas.height = 900;
      const ctx = fallbackCanvas.getContext('2d')!;
      const grad = ctx.createLinearGradient(0, 0, 0, 900);
      grad.addColorStop(0, '#3A2859');
      grad.addColorStop(0.5, '#7C5CBF');
      grad.addColorStop(1, '#B9A6E8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1600, 900);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(spot.title, 800, 450);
      textureRef.current = fallbackCanvas as any;
      setImageLoaded(true);
      setTransitioning(false);
    };

    return () => {
      textureRef.current = null;
    };
  }, [spot.panoramaUrl, spot.title]);

  // Handle location transition
  const handleSpotTransition = (targetId: string) => {
    setTransitioning(true);
    setTimeout(() => {
      onSelectSpot(targetId);
      panXRef.current = 0;
      panYRef.current = 0;
      zoomRef.current = 1.0;
      setZoomLevel(100);
    }, 150);
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.75, Math.min(3.0, zoomRef.current + delta));
    zoomRef.current = Number(newZoom.toFixed(2));
    setZoomLevel(Math.round(zoomRef.current * 100));
  };

  // Reset view
  const handleResetCamera = () => {
    panXRef.current = 0;
    panYRef.current = 0;
    zoomRef.current = 1.0;
    setZoomLevel(100);
    setCompassHeading('N 0°');
  };

  // Toggle View Mode (Fit whole photo vs Immersive fill)
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'fit' ? 'fill' : 'fit'));
    panXRef.current = 0;
    panYRef.current = 0;
    zoomRef.current = 1.0;
    setZoomLevel(100);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Main high-performance render loop
  const renderScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark canvas background
    ctx.fillStyle = '#1A1424';
    ctx.fillRect(0, 0, width, height);

    if (textureRef.current) {
      const tex = textureRef.current;
      const texW = tex.width;
      const texH = tex.height;
      const texAspect = texW / texH;
      const canvasAspect = width / height;
      // 1. Draw atmospheric blurred ambient backdrop (so edges look rich & seamless)
      ctx.save();
      ctx.filter = 'blur(20px) brightness(0.4)';
      ctx.drawImage(tex, 0, 0, width, height);
      ctx.restore();

      // Subtle gradient vignette overlay
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.2,
        width / 2,
        height / 2,
        width * 0.7
      );
      grad.addColorStop(0, 'rgba(26, 20, 36, 0.25)');
      grad.addColorStop(1, 'rgba(20, 14, 28, 0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Calculate Foreground Image Sizing & Alignment
      let baseWidth: number;
      let baseHeight: number;

      if (viewMode === 'fit') {
        // Complete Photo View: Fits entire photo inside the screen with perfect aspect ratio
        if (texAspect > canvasAspect) {
          baseWidth = width * 0.94;
          baseHeight = baseWidth / texAspect;
        } else {
          baseHeight = height * 0.92;
          baseWidth = baseHeight * texAspect;
        }
      } else {
        // Immersive Fill View: Fills the entire viewport with edge-to-edge coverage
        if (texAspect > canvasAspect) {
          baseHeight = height;
          baseWidth = baseHeight * texAspect;
        } else {
          baseWidth = width;
          baseHeight = baseWidth / texAspect;
        }
      }

      const drawWidth = baseWidth * zoomRef.current;
      const drawHeight = baseHeight * zoomRef.current;

      // Auto-pan motion: Only pan when image is larger than the viewport (in 'fill' mode or when zoomed in)
      // When in 'fit' mode at 100% zoom, keep photo rock-solid centered
      const canPan = viewMode === 'fill' || zoomRef.current > 1.05;
      if (isAutoRotatingRef.current && !isDraggingRef.current && canPan) {
        panXRef.current += autoPanDirectionRef.current * 0.45;
        const maxPanX = Math.max(width * 0.2, Math.abs((drawWidth - width) / 2));
        if (panXRef.current > maxPanX) {
          autoPanDirectionRef.current = -1;
        } else if (panXRef.current < -maxPanX) {
          autoPanDirectionRef.current = 1;
        }
      } else if (!isDraggingRef.current && viewMode === 'fit' && zoomRef.current <= 1.05) {
        // Smoothly ease back to center if user was dragging
        panXRef.current += (0 - panXRef.current) * 0.15;
        panYRef.current += (0 - panYRef.current) * 0.15;
      }

      const drawX = (width - drawWidth) / 2 + panXRef.current;
      const drawY = (height - drawHeight) / 2 + panYRef.current;

      // 3. Draw Crisp Foreground Authentic Campus Photograph
      ctx.save();
      // Rounded photo corners for a sleek aesthetic in Fit mode
      if (viewMode === 'fit' && zoomRef.current <= 1.05) {
        const radius = Math.min(24, drawWidth * 0.03);
        ctx.beginPath();
        ctx.roundRect(drawX, drawY, drawWidth, drawHeight, radius);
        ctx.clip();
      }

      ctx.drawImage(tex, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      // Delicate photo frame border in Fit view
      if (viewMode === 'fit' && zoomRef.current <= 1.05) {
        ctx.save();
        const radius = Math.min(24, drawWidth * 0.03);
        ctx.beginPath();
        ctx.roundRect(drawX, drawY, drawWidth, drawHeight, radius);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Render Interactive Clickable Waypoint Pins on the Image
      if (spot.hotspots && spot.hotspots.length > 0) {
        spot.hotspots.forEach((hs, idx) => {
          // Normalize hotspot yaw/pitch to image relative coords (0 to 1)
          const normX = Math.max(0.12, Math.min(0.88, 0.5 + hs.yaw / 140));
          const normY = Math.max(0.15, Math.min(0.85, 0.5 - hs.pitch / 70));

          const screenX = drawX + normX * drawWidth;
          const screenY = drawY + normY * drawHeight;

          // Only render if hotspot is on the visible canvas
          if (screenX >= 25 && screenX <= width - 25 && screenY >= 25 && screenY <= height - 25) {
            const isHovered = hoveredHotspot === `hs-${idx}`;

            ctx.save();

            // Outer pulse ring
            ctx.beginPath();
            ctx.arc(screenX, screenY, isHovered ? 26 : 20, 0, Math.PI * 2);
            ctx.fillStyle = isHovered ? 'rgba(124, 92, 191, 0.55)' : 'rgba(124, 92, 191, 0.3)';
            ctx.fill();

            // Inner solid pin
            ctx.beginPath();
            ctx.arc(screenX, screenY, isHovered ? 13 : 10, 0, Math.PI * 2);
            ctx.fillStyle = isHovered ? '#B9A6E8' : '#7C5CBF';
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2.5;
            ctx.fill();
            ctx.stroke();

            // Center beacon dot
            ctx.beginPath();
            ctx.arc(screenX, screenY, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            // Floating Label Badge
            ctx.font = '500 13px Poppins, sans-serif';
            const textMetrics = ctx.measureText(hs.title);
            const padding = 12;
            const pillW = textMetrics.width + padding * 2;
            const pillH = 30;
            const pillX = screenX - pillW / 2;
            const pillY = screenY - 44;

            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            ctx.fillStyle = isHovered ? '#5B3FA0' : 'rgba(38, 28, 56, 0.94)';
            ctx.beginPath();
            ctx.roundRect(pillX, pillY, pillW, pillH, 15);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Border
            ctx.strokeStyle = isHovered ? '#E9E0FA' : 'rgba(221, 210, 243, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label text
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(hs.title, screenX, pillY + pillH / 2);

            ctx.restore();
          }
        });
      }
    }
  }, [viewMode, spot.hotspots, hoveredHotspot]);

  // Continuous animation loop
  useEffect(() => {
    const loop = () => {
      renderScene();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [renderScene]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width * window.devicePixelRatio;
      canvasRef.current.height = rect.height * window.devicePixelRatio;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  // Mouse wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      const newZoom = Math.max(0.75, Math.min(3.0, zoomRef.current + delta));
      zoomRef.current = Number(newZoom.toFixed(2));
      setZoomLevel(Math.round(zoomRef.current * 100));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  // Mouse Dragging to Pan & Look Around
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    dragDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * window.devicePixelRatio;
    const mouseY = (e.clientY - rect.top) * window.devicePixelRatio;

    // Check hotspot hover
    if (textureRef.current && spot.hotspots) {
      const tex = textureRef.current;
      const texW = tex.width;
      const texH = tex.height;
      const texAspect = texW / texH;
      const canvasAspect = canvas.width / canvas.height;

      let baseWidth: number;
      let baseHeight: number;
      if (viewMode === 'fit') {
        if (texAspect > canvasAspect) {
          baseWidth = canvas.width * 0.94;
          baseHeight = baseWidth / texAspect;
        } else {
          baseHeight = canvas.height * 0.92;
          baseWidth = baseHeight * texAspect;
        }
      } else {
        if (texAspect > canvasAspect) {
          baseHeight = canvas.height;
          baseWidth = baseHeight * texAspect;
        } else {
          baseWidth = canvas.width;
          baseHeight = baseWidth / texAspect;
        }
      }

      const drawWidth = baseWidth * zoomRef.current;
      const drawHeight = baseHeight * zoomRef.current;
      const drawX = (canvas.width - drawWidth) / 2 + panXRef.current;
      const drawY = (canvas.height - drawHeight) / 2 + panYRef.current;

      let foundHotspot: string | null = null;
      spot.hotspots.forEach((hs, idx) => {
        const normX = Math.max(0.12, Math.min(0.88, 0.5 + hs.yaw / 140));
        const normY = Math.max(0.15, Math.min(0.85, 0.5 - hs.pitch / 70));
        const screenX = drawX + normX * drawWidth;
        const screenY = drawY + normY * drawHeight;

        const dist = Math.hypot(mouseX - screenX, mouseY - screenY);
        if (dist < 40) {
          foundHotspot = `hs-${idx}`;
        }
      });
      setHoveredHotspot(foundHotspot);
    }

    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    dragDistanceRef.current += Math.hypot(dx, dy);

    dragStartPos.current = { x: e.clientX, y: e.clientY };

    panXRef.current += dx * window.devicePixelRatio;
    panYRef.current += dy * window.devicePixelRatio;

    // Update compass direction dynamically based on horizontal pan
    const headingDegrees = Math.round(((panXRef.current * 0.2) % 360 + 360) % 360);
    const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(headingDegrees / 45) % 8;
    setCompassHeading(`${labels[idx]} ${headingDegrees}°`);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * window.devicePixelRatio;
    const clickY = (e.clientY - rect.top) * window.devicePixelRatio;

    // If mouse was simply tapped (not a long drag), check if a hotspot was clicked
    if (dragDistanceRef.current < 8 && spot.hotspots && textureRef.current) {
      const tex = textureRef.current;
      const texW = tex.width;
      const texH = tex.height;
      const texAspect = texW / texH;
      const canvasAspect = canvas.width / canvas.height;

      let baseWidth: number;
      let baseHeight: number;
      if (viewMode === 'fit') {
        if (texAspect > canvasAspect) {
          baseWidth = canvas.width * 0.94;
          baseHeight = baseWidth / texAspect;
        } else {
          baseHeight = canvas.height * 0.92;
          baseWidth = baseHeight * texAspect;
        }
      } else {
        if (texAspect > canvasAspect) {
          baseHeight = canvas.height;
          baseWidth = baseHeight * texAspect;
        } else {
          baseWidth = canvas.width;
          baseHeight = baseWidth / texAspect;
        }
      }

      const drawWidth = baseWidth * zoomRef.current;
      const drawHeight = baseHeight * zoomRef.current;
      const drawX = (canvas.width - drawWidth) / 2 + panXRef.current;
      const drawY = (canvas.height - drawHeight) / 2 + panYRef.current;

      spot.hotspots.forEach((hs) => {
        const normX = Math.max(0.12, Math.min(0.88, 0.5 + hs.yaw / 140));
        const normY = Math.max(0.15, Math.min(0.85, 0.5 - hs.pitch / 70));
        const screenX = drawX + normX * drawWidth;
        const screenY = drawY + normY * drawHeight;

        const dist = Math.hypot(clickX - screenX, clickY - screenY);
        if (dist < 42) {
          if (hs.targetSpotId) {
            handleSpotTransition(hs.targetSpotId);
          }
        }
      });
    }

    isDraggingRef.current = false;
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      dragStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      dragDistanceRef.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartPos.current.x;
    const dy = e.touches[0].clientY - dragStartPos.current.y;
    dragDistanceRef.current += Math.hypot(dx, dy);

    dragStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    panXRef.current += dx * window.devicePixelRatio;
    panYRef.current += dy * window.devicePixelRatio;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-[24px] overflow-hidden bg-[#1A1424] shadow-2xl select-none transition-all ${
        isFullscreen ? 'h-screen rounded-none' : 'h-[540px] sm:h-[660px]'
      }`}
    >
      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Smooth transition cross-fade */}
      {transitioning && (
        <div className="absolute inset-0 bg-[#1A1424]/40 pointer-events-none transition-opacity duration-200" />
      )}

      {/* Loading state indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-[#1A1424]/85 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
          <div className="w-12 h-12 rounded-full border-4 border-[#B9A6E8] border-t-transparent animate-spin mb-3" />
          <p className="text-sm font-medium tracking-wide">Loading Authentic Campus Scene...</p>
          <span className="text-xs text-white/60 mt-1">{spot.title}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20 gap-2">
        {/* Left: Spot Title & Breadcrumb */}
        <div className="flex items-center gap-2.5 pointer-events-auto bg-[#2D2442]/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 text-white shadow-xl">
          <MapPin className="w-4 h-4 text-[#B9A6E8] shrink-0" />
          <div>
            <div className="text-[11px] text-[#B9A6E8] font-medium leading-none flex items-center gap-1.5">
              <span>Spot {currentIndex + 1} of {allSpots.length}</span>
              <span>•</span>
              <span className="uppercase tracking-wider">{spot.category}</span>
            </div>
            <div className="text-sm sm:text-base font-semibold leading-tight truncate max-w-[170px] sm:max-w-[340px]">
              {spot.title}
            </div>
          </div>
        </div>

        {/* Right Header Badges: Authentic Photo Badge + Minimap + Info */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Authentic Photograph Verified Pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/85 border border-emerald-500/50 text-emerald-300 text-xs font-medium backdrop-blur-md shadow-lg"
            title="Authentic photograph of Somaiya Vidyavihar campus. Full photo shown with pan and zoom controls."
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Campus Photo</span>
          </div>

          {/* Minimap Button */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setShowMinimap(!showMinimap)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg ${
              showMinimap
                ? 'bg-[#7C5CBF] text-white ring-2 ring-white/30'
                : 'bg-[#2D2442]/90 text-white/90 hover:text-white border border-white/20 hover:bg-[#3D3059]'
            }`}
            title="Open Campus Minimap & Waypoint Navigator"
          >
            <MapIcon className="w-4 h-4" />
          </button>

          {/* Save Wishlist Button */}
          {onToggleSave && (
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={onToggleSave}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                isSaved
                  ? 'bg-rose-500 text-white'
                  : 'bg-[#2D2442]/90 text-white/90 hover:text-white border border-white/20 hover:bg-[#3D3059]'
              }`}
              title={isSaved ? 'Saved in wishlist' : 'Save for later'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Location Info Toggle */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg ${
              showInfo
                ? 'bg-[#7C5CBF] text-white ring-2 ring-white/30'
                : 'bg-[#2D2442]/90 text-white/90 hover:text-white border border-white/20 hover:bg-[#3D3059]'
            }`}
            title="Location Specs & Equipment"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RIGHT-HAND FLOATING CONTROLS TOOLBAR (Dual Frosted-Glass Capsules, Vertically Centered) */}
      <div
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5 z-30 pointer-events-auto"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {/* Upper Capsule: Viewing Modes, Orientation & Audio */}
        <div className="flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-[#2D2442]/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Compass / Heading Indicator */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={handleResetCamera}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#7C5CBF] active:scale-90 flex flex-col items-center justify-center text-white transition-all cursor-pointer group"
            title={`Heading: ${compassHeading} • Click to Re-center`}
          >
            <Compass className="w-4 h-4 text-[#B9A6E8] group-hover:text-white transition-transform group-hover:rotate-45" />
            <span className="text-[9px] text-white/80 font-bold leading-none mt-0.5">
              {compassHeading.split(' ')[0]}
            </span>
          </button>

          {/* View Mode Toggle: Fit (Complete Photo) vs Fill (Panoramic Immersive) */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={toggleViewMode}
            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90 ${
              viewMode === 'fit'
                ? 'bg-[#7C5CBF] text-white ring-2 ring-white/40 shadow-md'
                : 'bg-white/10 hover:bg-[#7C5CBF] text-white/80 hover:text-white'
            }`}
            title={
              viewMode === 'fit'
                ? 'View Mode: FIT (Showing 100% Complete Photo) • Click for Immersive Fill'
                : 'View Mode: FILL (Immersive View) • Click for Complete Photo'
            }
          >
            <Layers className="w-4 h-4" />
            <span className="text-[9px] font-bold leading-none mt-0.5 uppercase tracking-wider">
              {viewMode}
            </span>
          </button>

          {/* Auto-Pan Toggle */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
              isAutoRotating
                ? 'bg-[#7C5CBF] text-white ring-2 ring-white/40 shadow-md'
                : 'bg-white/10 hover:bg-[#7C5CBF] text-white/80 hover:text-white'
            }`}
            title={isAutoRotating ? 'Pause Auto-Pan' : 'Start Auto-Pan'}
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Ambient Breeze Sound */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={toggleAudio}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
              !isMuted
                ? 'bg-[#7C5CBF] text-white ring-2 ring-white/40 shadow-md'
                : 'bg-white/10 hover:bg-[#7C5CBF] text-white/80 hover:text-white'
            }`}
            title={isMuted ? 'Play Ambient Campus Breeze Sound' : 'Mute Ambient Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Lower Capsule: Zoom, Reset & Fullscreen */}
        <div className="flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-[#2D2442]/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Zoom In (+) */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={() => handleZoom(0.25)}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#7C5CBF] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
            title="Zoom In (or use mouse scroll wheel)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Current Zoom Level Pill */}
          <div
            className="px-2 py-0.5 rounded-md bg-black/40 text-[10px] font-bold text-[#DDD2F3] select-none pointer-events-none"
            title="Current Zoom Level"
          >
            {zoomLevel}%
          </div>

          {/* Zoom Out (-) */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={() => handleZoom(-0.25)}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#7C5CBF] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
            title="Zoom Out (or use mouse scroll wheel)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Camera View */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={handleResetCamera}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#7C5CBF] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
            title="Reset View & Center Photo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#7C5CBF] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Campus Minimap Modal / Interactive Navigator */}
      {showMinimap && (
        <div
          className="absolute inset-x-4 top-20 sm:inset-auto sm:left-4 sm:top-22 sm:w-[460px] bg-[#2D2442]/95 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/20 z-30 text-white animate-in fade-in duration-150"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-[#B9A6E8]" />
              <h4 className="font-semibold text-sm">Somaiya Vidyavihar Campus Map</h4>
            </div>
            <button
              type="button"
              onClick={() => setShowMinimap(false)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-[#B9A6E8] mb-3 leading-relaxed">
            Click any plotted waypoint pin to navigate directly across the 60-acre campus:
          </p>

          {/* Interactive Schematic 2D Campus Map */}
          <div className="relative w-full h-[220px] rounded-xl bg-gradient-to-br from-[#1E172E] to-[#342352] border border-white/10 overflow-hidden mb-3">
            <svg className="w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
              <rect x="10" y="15" width="80" height="75" rx="8" fill="none" stroke="#DDD2F3" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="20" y1="85" x2="35" y2="60" stroke="#7C5CBF" strokeWidth="1.5" />
              <line x1="35" y1="60" x2="50" y2="70" stroke="#7C5CBF" strokeWidth="1.5" />
              <line x1="35" y1="60" x2="42" y2="50" stroke="#7C5CBF" strokeWidth="1.5" />
              <line x1="42" y1="50" x2="48" y2="40" stroke="#7C5CBF" strokeWidth="1.5" />
              <line x1="48" y1="40" x2="68" y2="46" stroke="#7C5CBF" strokeWidth="1.5" />
              <line x1="68" y1="46" x2="78" y2="30" stroke="#7C5CBF" strokeWidth="1.5" />
              <line x1="68" y1="46" x2="82" y2="58" stroke="#7C5CBF" strokeWidth="1.5" />
              <line x1="50" y1="70" x2="64" y2="76" stroke="#7C5CBF" strokeWidth="1.5" />
            </svg>

            {/* Plotted Pins */}
            {allSpots.map((s, idx) => {
              const coords = campusMapCoordinates[s.id] || { x: 20 + ((idx * 5) % 65), y: 30 + ((idx * 4) % 55), label: s.title };
              const isActive = s.id === spot.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    handleSpotTransition(s.id);
                    setShowMinimap(false);
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all cursor-pointer group ${
                    isActive ? 'z-20 scale-125' : 'z-10 hover:scale-115'
                  }`}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  title={`${s.title} (${s.category})`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shadow-lg transition-colors ${
                      isActive
                        ? 'bg-rose-500 text-white border-white animate-pulse'
                        : 'bg-[#7C5CBF] text-white border-[#B9A6E8] group-hover:bg-[#5B3FA0]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick List of Key Campus Landmarks */}
          <div className="grid grid-cols-2 gap-1.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-none text-[11px]">
            {allSpots.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  handleSpotTransition(s.id);
                  setShowMinimap(false);
                }}
                className={`text-left px-2.5 py-1.5 rounded-lg truncate transition-colors ${
                  s.id === spot.id
                    ? 'bg-[#7C5CBF] text-white font-medium'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span className="font-semibold text-[#B9A6E8] mr-1.5">{idx + 1}.</span>
                {s.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spot Information & Specs Drawer */}
      {showInfo && (
        <div
          className="absolute left-4 top-20 max-w-sm bg-white/95 backdrop-blur-xl rounded-[22px] p-5 shadow-2xl border border-[#DDD2F3] z-20 transition-all text-[#2D2442] animate-in fade-in duration-150"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <Badge variant="lavender">{spot.category}</Badge>
            <span className="text-[11px] text-[#7A6F8F] flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5BAE8A]" />
              Authentic Campus Photo
            </span>
          </div>

          <h4 className="font-semibold text-base mb-1.5 text-[#2D2442]">{spot.title}</h4>
          <p className="text-xs text-[#7A6F8F] leading-relaxed mb-3">{spot.description}</p>

          {spot.locationDetails && (
            <div className="text-[11px] text-[#5B3FA0] bg-[#FAF7FF] p-2.5 rounded-xl border border-[#DDD2F3] mb-3 font-medium">
              📍 {spot.locationDetails}
            </div>
          )}

          {spot.features && (
            <div className="space-y-1.5 border-t border-[#DDD2F3] pt-2.5">
              <span className="text-[11px] font-semibold text-[#5B3FA0] uppercase tracking-wider block">
                Key Campus Features
              </span>
              <ul className="text-xs text-[#2D2442] space-y-1">
                {spot.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#7C5CBF] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#DDD2F3] text-[10px] text-[#7A6F8F] leading-tight">
            Source: {spot.photoSource || 'Somaiya Vidyavihar Campus Photography Archive'}
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION STRIP */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none z-20">
        {/* Next & Prev buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Button
            size="sm"
            variant="secondary"
            disabled={!prevSpot}
            onClick={() => prevSpot && handleSpotTransition(prevSpot.id)}
            icon={<ChevronLeft className="w-4 h-4" />}
            className="shadow-xl bg-white/95 hover:bg-white text-[#2D2442] font-semibold px-3 py-2"
          >
            Prev Spot
          </Button>

          <Button
            size="sm"
            variant="primary"
            disabled={!nextSpot}
            onClick={() => nextSpot && handleSpotTransition(nextSpot.id)}
            className="shadow-xl font-semibold px-3 py-2"
          >
            Next Spot
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Quick Location Pills Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full p-1.5 bg-[#2D2442]/90 backdrop-blur-md rounded-full border border-white/20 pointer-events-auto scrollbar-none shadow-2xl">
          {allSpots.map((s, idx) => {
            const isSelected = s.id === spot.id;
            return (
              <button
                key={s.id}
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => handleSpotTransition(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#7C5CBF] text-white font-medium shadow-md scale-105 ring-1 ring-white/40'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title={s.title}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="hidden lg:inline">{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
