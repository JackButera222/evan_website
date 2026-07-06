import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

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
        dstData[di]     = srcData[si];
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

export default function CameraWindow({ isOpen, onClose, getWindowProps }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const offRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");

  const flipCamera = () => {
    setFacingMode((f) => (f === "environment" ? "user" : "environment"));
  };

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setReady(false);

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: facingMode }, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
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
  }, [isOpen, facingMode]);

  // Draw fisheye frames to canvas
  useEffect(() => {
    if (!ready) return;
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

      // vignette overlay
      const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.72);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready]);

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

    // Use native share sheet on mobile (lets user save to Photos on iOS/Android)
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Photo" });
        return;
      } catch {
        // user cancelled or share failed — fall through to download
      }
    }

    // Desktop fallback: trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <Rnd {...getWindowProps} dragHandleClassName="cam-title-bar" cancel=".window-control">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-black shadow-2xl"
      >
        {/* Title bar */}
        <div className="cam-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-white/10 bg-zinc-900 px-4 active:cursor-grabbing">
          <button type="button" aria-label="Close Camera" onClick={onClose}
            className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400" />
          <button type="button" aria-label="Minimize"
            className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50" />
          <button type="button" aria-label="Zoom"
            className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50" />
          <div className="ml-3 text-sm font-medium text-white/85">Camera</div>
        </div>

        {/* Viewfinder */}
        <div className="relative flex-1 bg-black flex flex-col">
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="w-full h-full object-cover"
          />

          {/* Flash overlay */}
          {flash && <div className="absolute inset-0 bg-white pointer-events-none" />}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black text-white/60 text-sm text-center px-6">
              <span className="text-3xl">📵</span>
              <p>Camera access denied</p>
              <p className="text-xs text-white/40">{error}</p>
            </div>
          )}

          {/* Loading */}
          {!ready && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white/40 text-sm">
              Starting camera…
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between bg-zinc-900 px-6 py-3">
          {/* Last capture thumbnail — tap to save */}
          <button
            type="button"
            onClick={savePhoto}
            disabled={!captured}
            aria-label="Save photo"
            className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 border border-white/10 disabled:opacity-40 active:scale-95 transition-transform"
          >
            {captured && <img src={captured} alt="capture" className="w-full h-full object-cover" />}
          </button>

          {/* Shutter */}
          <button
            type="button"
            onClick={takePhoto}
            disabled={!ready}
            className="w-14 h-14 rounded-full border-4 border-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all disabled:opacity-40"
          />

          <button
            type="button"
            onClick={flipCamera}
            disabled={!ready}
            className="w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center text-white text-lg"
            aria-label="Flip camera"
          >
            🔄
          </button>
        </div>
      </motion.div>
    </Rnd>
  );
}
