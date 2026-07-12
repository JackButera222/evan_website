import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

// Videos dropped into src/assets/photobooth/ show up automatically in the
// filmstrip (mp4/webm/mov).
const boothVideos = Object.entries(
  import.meta.glob("../../assets/photobooth/*.{mp4,webm,mov,MP4,MOV}", {
    eager: true,
    import: "default",
  }),
).map(([path, src]) => ({
  src,
  name: path.split("/").pop().replace(/\.[^.]+$/, ""),
}));

// Barrel distortion strength (0 = none, 1 = heavy fisheye)
const K = 0.22;

function applyFisheye(src, dst, w, h) {
  const srcData = src.data;
  const dstData = dst.data;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = (x - cx) / maxR;
      const ny = (y - cy) / maxR;
      const r = Math.sqrt(nx * nx + ny * ny);
      const r2 = r * (1 + K * r * r);
      const sx = Math.round(r2 * nx * maxR + cx);
      const sy = Math.round(r2 * ny * maxR + cy);

      const di = (y * w + x) * 4;
      if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
        const si = (sy * w + sx) * 4;
        dstData[di] = srcData[si];
        dstData[di + 1] = srcData[si + 1];
        dstData[di + 2] = srcData[si + 2];
        dstData[di + 3] = srcData[si + 3];
      } else {
        dstData[di] = dstData[di + 1] = dstData[di + 2] = 0;
        dstData[di + 3] = 255;
      }
    }
  }
}

export default function PhotoBoothWindow({ isOpen, onClose, getWindowProps }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const offRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const playerRef = useRef(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  // null = live camera; otherwise index into boothVideos
  const [selectedVideo, setSelectedVideo] = useState(null);

  const cameraMode = selectedVideo === null;

  const flipCamera = () => {
    setFacingMode((f) => (f === "environment" ? "user" : "environment"));
  };

  useEffect(() => {
    if (!isOpen || !cameraMode) return;
    setError(null);
    setReady(false);

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      .then((stream) => {
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          setReady(true);
        };
      })
      .catch((err) => setError(err.message));

    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setReady(false);
    };
  }, [isOpen, facingMode, cameraMode]);

  // Draw fisheye frames to canvas
  useEffect(() => {
    if (!ready || !cameraMode) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!offRef.current) {
      offRef.current = document.createElement("canvas");
      offRef.current.width = W;
      offRef.current.height = H;
    }
    const off = offRef.current;
    const offCtx = off.getContext("2d", { willReadFrequently: true });

    const draw = () => {
      offCtx.drawImage(video, 0, 0, W, H);
      const src = offCtx.getImageData(0, 0, W, H);
      const dst = ctx.createImageData(W, H);
      applyFisheye(src, dst, W, H);
      ctx.putImageData(dst, 0, 0);

      const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.72);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready, cameraMode]);

  const takePhoto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    setCaptured(canvas.toDataURL("image/jpeg", 0.92));
  };

  const savePhoto = async () => {
    if (!captured) return;
    const res = await fetch(captured);
    const blob = await res.blob();
    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Photo" });
        return;
      } catch {
        // user cancelled or share failed — fall through to download
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepVideo = (dir) => {
    if (!boothVideos.length) return;
    setSelectedVideo((cur) => {
      const next = cur === null ? (dir > 0 ? 0 : boothVideos.length - 1) : cur + dir;
      if (next < 0 || next >= boothVideos.length) return null; // wrap back to camera
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <Rnd {...getWindowProps} dragHandleClassName="pb-title-bar" cancel=".window-control, .pb-strip, .pb-player">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-black shadow-2xl"
      >
        {/* Title bar */}
        <div className="pb-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-white/10 bg-zinc-900 px-4 active:cursor-grabbing">
          <button type="button" aria-label="Close Photo Booth" onClick={onClose}
            className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400" />
          <button type="button" aria-label="Minimize"
            className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50" />
          <button type="button" aria-label="Zoom"
            className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50" />
          <div className="ml-3 text-sm font-medium text-white/85">Photo Booth</div>
        </div>

        {/* Stage: live camera or selected video */}
        <div className="relative flex-1 bg-black flex flex-col min-h-0">
          {cameraMode ? (
            <>
              <video ref={videoRef} className="hidden" playsInline muted />
              <canvas ref={canvasRef} width={640} height={480} className="w-full h-full object-cover" />
              {flash && <div className="absolute inset-0 bg-white pointer-events-none" />}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black text-white/60 text-sm text-center px-6">
                  <span className="text-3xl">📵</span>
                  <p>Camera access denied</p>
                  <p className="text-xs text-white/40">{error}</p>
                </div>
              )}
              {!ready && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white/40 text-sm">
                  Starting camera…
                </div>
              )}
            </>
          ) : (
            <video
              ref={playerRef}
              key={boothVideos[selectedVideo].src}
              src={boothVideos[selectedVideo].src}
              className="pb-player h-full w-full object-contain bg-black"
              controls
              autoPlay
              playsInline
            />
          )}

          {/* Prev / next arrows over the stage */}
          {boothVideos.length > 0 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={() => stepVideo(-1)}
                className="window-control absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur hover:bg-black/70"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => stepVideo(1)}
                className="window-control absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur hover:bg-black/70"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Filmstrip: camera tile + stored videos */}
        <div className="pb-strip flex gap-2 overflow-x-auto border-t border-white/10 bg-zinc-900/90 px-3 py-2">
          <button
            type="button"
            onClick={() => setSelectedVideo(null)}
            className={`flex h-14 w-20 shrink-0 items-center justify-center rounded-md border text-2xl transition ${
              cameraMode ? "border-blue-400 bg-zinc-700" : "border-white/10 bg-zinc-800 hover:bg-zinc-700"
            }`}
            aria-label="Live camera"
          >
            📷
          </button>
          {boothVideos.map((v, i) => (
            <button
              key={v.src}
              type="button"
              onClick={() => setSelectedVideo(i)}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border transition ${
                selectedVideo === i ? "border-blue-400" : "border-white/10 hover:border-white/30"
              }`}
              aria-label={`Play ${v.name}`}
            >
              <video src={v.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center text-white/90 text-lg drop-shadow">▶</span>
            </button>
          ))}
          {boothVideos.length === 0 && (
            <div className="flex h-14 items-center px-2 text-xs text-white/35">
              Videos added to the booth will show up here.
            </div>
          )}
        </div>

        {/* Controls (camera mode only) */}
        {cameraMode && (
          <div className="flex items-center justify-between bg-zinc-900 px-6 py-3">
            <button
              type="button"
              onClick={savePhoto}
              disabled={!captured}
              aria-label="Save photo"
              className="window-control w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 border border-white/10 disabled:opacity-40 active:scale-95 transition-transform"
            >
              {captured && <img src={captured} alt="capture" className="w-full h-full object-cover" />}
            </button>

            <button
              type="button"
              onClick={takePhoto}
              disabled={!ready}
              aria-label="Take photo"
              className="window-control w-14 h-14 rounded-full border-4 border-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all disabled:opacity-40"
            />

            <button
              type="button"
              onClick={flipCamera}
              disabled={!ready}
              className="window-control w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center text-white text-lg"
              aria-label="Flip camera"
            >
              🔄
            </button>
          </div>
        )}
      </motion.div>
    </Rnd>
  );
}
