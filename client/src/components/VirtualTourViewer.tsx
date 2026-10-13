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

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  spot,
  allSpots,
  onSelectSpot,
  isSaved = false,
  onToggleSave,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Panoramic Camera State
  const [yaw, setYaw] = useState<number>(0); // Horizontal angle in degrees
  const [pitch, setPitch] = useState<number>(0); // Vertical angle in degrees
  const [fov, setFov] = useState<number>(75); // Field of view (zoom)
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  // Audio synthesis ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);

  // Mouse / Touch interaction refs
  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const textureRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentIndex = allSpots.findIndex((s) => s.id === spot.id);
  const prevSpot = currentIndex > 0 ? allSpots[currentIndex - 1] : null;
  const nextSpot = currentIndex < allSpots.length - 1 ? allSpots[currentIndex + 1] : null;

  // Toggle synthesized calm ambient sound
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

          // Gentle ambient white-pink noise filter simulating campus breeze
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

  // Preload equirectangular panorama texture
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = spot.panoramaUrl;
    img.onload = () => {
      textureRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Fallback procedural canvas texture if network fails
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 1024;
      fallbackCanvas.height = 512;
      const ctx = fallbackCanvas.getContext('2d')!;
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#5B3FA0');
      grad.addColorStop(0.5, '#B9A6E8');
      grad.addColorStop(1, '#7C5CBF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px Poppins';
      ctx.textAlign = 'center';
      ctx.fillText(spot.title, 512, 256);
      textureRef.current = fallbackCanvas as any;
      setImageLoaded(true);
    };

    return () => {
      textureRef.current = null;
    };
  }, [spot.panoramaUrl, spot.title]);

  // Main 360 panoramic render loop
  const renderPanorama = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#1E172E';
    ctx.fillRect(0, 0, width, height);

    if (textureRef.current) {
      const tex = textureRef.current;
      const texW = tex.width;
      const texH = tex.height;

      // Project panoramic equirectangular image based on yaw (-180 to 180) and pitch (-90 to 90)
      const normalizedYaw = (((yaw % 360) + 360) % 360) / 360;
      const fovRad = (fov * Math.PI) / 180;
      const visibleFractionX = fovRad / (2 * Math.PI);
      const visibleFractionY = (fovRad * (height / width)) / Math.PI;

      const sourceWidth = texW * visibleFractionX;
      const sourceHeight = texH * visibleFractionY;

      // Pitch offset in texture Y
      const pitchOffset = (pitch / 90) * (texH * 0.25);
      let sourceY = texH / 2 - sourceHeight / 2 - pitchOffset;
      sourceY = Math.max(0, Math.min(texH - sourceHeight, sourceY));

      let sourceX = normalizedYaw * texW - sourceWidth / 2;

      // If sourceX wraps around texture edge
      if (sourceX < 0) {
        const wrapPart = -sourceX;
        ctx.drawImage(tex, texW - wrapPart, sourceY, wrapPart, sourceHeight, 0, 0, (wrapPart / sourceWidth) * width, height);
        ctx.drawImage(tex, 0, sourceY, sourceWidth - wrapPart, sourceHeight, (wrapPart / sourceWidth) * width, 0, width - (wrapPart / sourceWidth) * width, height);
      } else if (sourceX + sourceWidth > texW) {
        const firstPart = texW - sourceX;
        ctx.drawImage(tex, sourceX, sourceY, firstPart, sourceHeight, 0, 0, (firstPart / sourceWidth) * width, height);
        ctx.drawImage(tex, 0, sourceY, sourceWidth - firstPart, sourceHeight, (firstPart / sourceWidth) * width, 0, width - (firstPart / sourceWidth) * width, height);
      } else {
        ctx.drawImage(tex, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
      }

      // Draw interactive Hotspot markers on screen
      if (spot.hotspots && spot.hotspots.length > 0) {
        spot.hotspots.forEach((hs, idx) => {
          // Calculate screen coordinates based on angle difference from current yaw
          let angleDiff = (hs.yaw - yaw) % 360;
          if (angleDiff > 180) angleDiff -= 360;
          if (angleDiff < -180) angleDiff += 360;

          // Only render if within visible field of view
          const halfFov = fov / 2;
          if (Math.abs(angleDiff) < halfFov + 10) {
            const screenX = width / 2 + (angleDiff / halfFov) * (width / 2);
            const pitchDiff = (hs.pitch - pitch);
            const screenY = height / 2 - (pitchDiff / (halfFov * (height / width))) * (height / 2);

            if (screenX >= 20 && screenX <= width - 20 && screenY >= 20 && screenY <= height - 20) {
              const isHovered = hoveredHotspot === `hs-${idx}`;

              // Outer pulse ring
              ctx.save();
              ctx.beginPath();
              ctx.arc(screenX, screenY, isHovered ? 26 : 20, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(124, 92, 191, 0.35)';
              ctx.fill();

              // Solid inner pill
              ctx.beginPath();
              ctx.arc(screenX, screenY, isHovered ? 14 : 11, 0, Math.PI * 2);
              ctx.fillStyle = '#7C5CBF';
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 3;
              ctx.fill();
              ctx.stroke();

              // Label badge floating above
              ctx.font = '500 13px Poppins, sans-serif';
              const textMetrics = ctx.measureText(hs.title);
              const padding = 10;
              const pillW = textMetrics.width + padding * 2;
              const pillH = 28;
              const pillX = screenX - pillW / 2;
              const pillY = screenY - 42;

              // Shadow
              ctx.shadowColor = 'rgba(0,0,0,0.3)';
              ctx.shadowBlur = 8;
              ctx.fillStyle = isHovered ? '#5B3FA0' : 'rgba(45, 36, 66, 0.88)';
              ctx.beginPath();
              ctx.roundRect(pillX, pillY, pillW, pillH, 14);
              ctx.fill();
              ctx.shadowBlur = 0;

              // Border
              ctx.strokeStyle = isHovered ? '#B9A6E8' : 'rgba(221, 210, 243, 0.6)';
              ctx.lineWidth = 1;
              ctx.stroke();

              // Hotspot text
              ctx.fillStyle = '#FFFFFF';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(hs.title, screenX, pillY + pillH / 2);
              ctx.restore();
            }
          }
        });
      }
    }

    // Auto rotate subtly
    if (isAutoRotating && !isDraggingRef.current) {
      setYaw((prev) => (prev + 0.12) % 360);
    }
  }, [yaw, pitch, fov, isAutoRotating, spot.hotspots, hoveredHotspot]);

  // Animation Loop
  useEffect(() => {
    const loop = () => {
      renderPanorama();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [renderPanorama]);

  // Resize canvas to match display size
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
  }, []);

  // Mouse / Touch handlers for dragging 360 view
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * window.devicePixelRatio;
    const mouseY = (e.clientY - rect.top) * window.devicePixelRatio;

    // Check hotspot hover
    let foundHotspot: string | null = null;
    if (spot.hotspots) {
      const halfFov = fov / 2;
      spot.hotspots.forEach((hs, idx) => {
        let angleDiff = (hs.yaw - yaw) % 360;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        if (Math.abs(angleDiff) < halfFov + 10) {
          const screenX = canvas.width / 2 + (angleDiff / halfFov) * (canvas.width / 2);
          const pitchDiff = (hs.pitch - pitch);
          const screenY = canvas.height / 2 - (pitchDiff / (halfFov * (canvas.height / canvas.width))) * (canvas.height / 2);
          const dist = Math.hypot(mouseX - screenX, mouseY - screenY);
          if (dist < 35) {
            foundHotspot = `hs-${idx}`;
          }
        }
      });
    }
    setHoveredHotspot(foundHotspot);

    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.22;
    setYaw((prev) => (prev - dx * sensitivity) % 360);
    setPitch((prev) => Math.max(-50, Math.min(50, prev + dy * sensitivity)));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * window.devicePixelRatio;
    const clickY = (e.clientY - rect.top) * window.devicePixelRatio;

    // Trigger hotspot click if tapped
    if (spot.hotspots) {
      const halfFov = fov / 2;
      spot.hotspots.forEach((hs) => {
        let angleDiff = (hs.yaw - yaw) % 360;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        if (Math.abs(angleDiff) < halfFov + 10) {
          const screenX = canvas.width / 2 + (angleDiff / halfFov) * (canvas.width / 2);
          const pitchDiff = (hs.pitch - pitch);
          const screenY = canvas.height / 2 - (pitchDiff / (halfFov * (canvas.height / canvas.width))) * (canvas.height / 2);
          const dist = Math.hypot(clickX - screenX, clickY - screenY);
          if (dist < 40) {
            if (hs.targetSpotId) {
              onSelectSpot(hs.targetSpotId);
            }
          }
        }
      });
    }

    isDraggingRef.current = false;
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePos.current.x;
    const dy = e.touches[0].clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    const sensitivity = 0.28;
    setYaw((prev) => (prev - dx * sensitivity) % 360);
    setPitch((prev) => Math.max(-50, Math.min(50, prev + dy * sensitivity)));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    setFov((prev) => Math.max(45, Math.min(100, prev + delta)));
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

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-[20px] overflow-hidden bg-[#2D2442] shadow-purple-lg select-none transition-all ${
        isFullscreen ? 'h-screen rounded-none' : 'h-[500px] sm:h-[600px]'
      }`}
    >
      {/* 360 Canvas */}
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

      {/* Loading state indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-[#2D2442]/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
          <div className="w-12 h-12 rounded-full border-4 border-[#B9A6E8] border-t-transparent animate-spin mb-3" />
          <p className="text-sm font-medium">Loading 360° Panorama...</p>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2.5 pointer-events-auto bg-[#2D2442]/75 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 text-white">
          <MapPin className="w-4 h-4 text-[#B9A6E8]" />
          <div>
            <div className="text-xs text-[#B9A6E8] font-medium leading-none">
              Spot {currentIndex + 1} of {allSpots.length} • {spot.category}
            </div>
            <div className="text-sm font-semibold leading-tight truncate max-w-[200px] sm:max-w-[320px]">
              {spot.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {onToggleSave && (
            <button
              onClick={onToggleSave}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-500 text-white'
                  : 'bg-[#2D2442]/75 text-white/90 hover:text-white border border-white/10'
              }`}
              title={isSaved ? 'Saved in shortlist' : 'Save for later'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              showInfo
                ? 'bg-[#7C5CBF] text-white'
                : 'bg-[#2D2442]/75 text-white/90 hover:text-white border border-white/10'
            }`}
            title="Location Info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Compass and Controls (Top-Right under header) */}
      <div className="absolute right-4 top-20 flex flex-col gap-2 z-10 pointer-events-auto">
        <div
          className="w-10 h-10 rounded-full bg-[#2D2442]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 shadow-md transition-transform"
          title={`Compass: ${(yaw % 360).toFixed(0)}°`}
        >
          <Compass
            className="w-5 h-5 text-[#B9A6E8]"
            style={{ transform: `rotate(${-yaw}deg)` }}
          />
        </div>

        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-md cursor-pointer transition-colors ${
            isAutoRotating ? 'bg-[#7C5CBF] text-white' : 'bg-[#2D2442]/80 text-white/80'
          }`}
          title={isAutoRotating ? 'Pause Auto-rotate' : 'Resume Auto-rotate'}
        >
          {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <button
          onClick={toggleAudio}
          className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-md cursor-pointer transition-colors ${
            !isMuted ? 'bg-[#7C5CBF]' : 'bg-[#2D2442]/80 text-white/80'
          }`}
          title={isMuted ? 'Unmute Ambient Campus Sound' : 'Mute Ambient Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => handleZoom(-10)}
          className="w-10 h-10 rounded-full bg-[#2D2442]/80 hover:bg-[#2D2442] backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-md cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(10)}
          className="w-10 h-10 rounded-full bg-[#2D2442]/80 hover:bg-[#2D2442] backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-md cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 rounded-full bg-[#2D2442]/80 hover:bg-[#2D2442] backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-md cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Hotspot Drawer info panel */}
      {showInfo && (
        <div className="absolute left-4 top-20 max-w-sm bg-white/95 backdrop-blur-md rounded-[16px] p-5 shadow-purple-lg border border-[#DDD2F3] z-20 transition-all text-[#2D2442]">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="lavender">{spot.category}</Badge>
            <span className="text-xs text-[#7A6F8F]">360° Interactive View</span>
          </div>
          <h4 className="font-semibold text-base mb-1.5">{spot.title}</h4>
          <p className="text-xs text-[#7A6F8F] leading-relaxed mb-3">{spot.description}</p>
          {spot.features && (
            <div className="space-y-1.5 border-t border-[#DDD2F3] pt-2.5">
              <span className="text-[11px] font-semibold text-[#5B3FA0] uppercase tracking-wider block">
                Key Highlights
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
        </div>
      )}

      {/* Bottom Navigation Strip & Hotspot Quick Jumps */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none z-10">
        {/* Next & Prev buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Button
            size="sm"
            variant="secondary"
            disabled={!prevSpot}
            onClick={() => prevSpot && onSelectSpot(prevSpot.id)}
            icon={<ChevronLeft className="w-4 h-4" />}
            className="shadow-md bg-white/90 hover:bg-white text-[#2D2442]"
          >
            Prev Spot
          </Button>
          <Button
            size="sm"
            variant="primary"
            disabled={!nextSpot}
            onClick={() => nextSpot && onSelectSpot(nextSpot.id)}
            className="shadow-md"
          >
            Next Spot
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Thumbnail carousel pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full p-1.5 bg-[#2D2442]/80 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto scrollbar-none">
          {allSpots.map((s, idx) => {
            const isSelected = s.id === spot.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSpot(s.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#7C5CBF] text-white font-medium shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="hidden md:inline">{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
