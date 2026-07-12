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

// ── Classic Photo Booth effects ─────────────────────────────────────────
// Geometric effects remap pixels (precomputed LUT per canvas size); color
// effects rewrite channel values in place. "Bulge" is the original fisheye.

function buildMap(effect, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);
  const map = new Int32Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sx = x;
      let sy = y;
      const nx = (x - cx) / maxR;
      const ny = (y - cy) / maxR;
      const r = Math.sqrt(nx * nx + ny * ny);

      if (effect === "bulge") {
        const r2 = r * (1 + 0.22 * r * r);
        sx = Math.round(r2 * nx * maxR + cx);
        sy = Math.round(r2 * ny * maxR + cy);
      } else if (effect === "squeeze") {
        const r2 = r * (1 - 0.35 * r * r);
        sx = Math.round(r2 * nx * maxR + cx);
        sy = Math.round(r2 * ny * maxR + cy);
      } else if (effect === "twirl") {
        const angle = Math.atan2(ny, nx) + (1 - Math.min(r, 1)) * 2.2;
        const rr = r * maxR;
        sx = Math.round(Math.cos(angle) * rr + cx);
        sy = Math.round(Math.sin(angle) * rr + cy);
      } else if (effect === "mirror") {
        sx = x < cx ? x : Math.round(2 * cx - x);
      }

      map[y * w + x] =
        sx >= 0 && sx < w && sy >= 0 && sy < h ? sy * w + sx : -1;
    }
  }
  return map;
}

function applyColor(data, effect) {
  const n = data.length;
  for (let i = 0; i < n; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (effect === "sepia") {
      data[i] = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
      data[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
      data[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
    } else if (effect === "bw") {
      const v = Math.min(255, Math.max(0, (0.299 * r + 0.587 * g + 0.114 * b - 128) * 1.3 + 128));
      data[i] = data[i + 1] = data[i + 2] = v;
    } else if (effect === "xray") {
      const v = 255 - (0.299 * r + 0.587 * g + 0.114 * b);
      data[i] = data[i + 1] = data[i + 2] = v;
    } else if (effect === "thermal") {
      const v = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      data[i] = Math.min(255, v < 0.5 ? 0 : (v - 0.5) * 2 * 255 + 80);
      data[i + 1] = Math.min(255, v < 0.5 ? v * 2 * 200 : 255 - (v - 0.5) * 2 * 160);
      data[i + 2] = Math.min(255, v < 0.5 ? 255 - v * 2 * 175 : 80);
    } else if (effect === "pop") {
      data[i] = r > 128 ? 255 : 40;
      data[i + 1] = g > 128 ? 230 : 30;
      data[i + 2] = b > 128 ? 210 : 90;
    }
  }
}

const EFFECTS = [
  { id: "sepia", name: "Sepia", color: "sepia" },
  { id: "bw", name: "Black & White", color: "bw" },
  { id: "thermal", name: "Thermal", color: "thermal" },
  { id: "xray", name: "X-Ray", color: "xray" },
  { id: "normal", name: "Normal" },
  { id: "pop", name: "Pop Art", color: "pop" },
  { id: "bulge", name: "Bulge", map: "bulge" },
  { id: "squeeze", name: "Squeeze", map: "squeeze" },
  { id: "twirl", name: "Twirl", map: "twirl" },
];
// Mirror rides along as a bonus in place of nothing — swap in if wanted.

const W = 640;
const H = 480;
const PREVIEW_W = 160;
const PREVIEW_H = 120;

function renderFrame(video, offCtx, ctx, w, h, map, colorEffect, vignette) {
  offCtx.drawImage(video, 0, 0, w, h);
  const src = offCtx.getImageData(0, 0, w, h);
  let out = src;
  if (map) {
    const dst = ctx.createImageData(w, h);
    const s = src.data;
    const d = dst.data;
    for (let i = 0; i < map.length; i++) {
      const si = map[i];
      const di = i * 4;
      if (si >= 0) {
        const s4 = si * 4;
        d[di] = s[s4];
        d[di + 1] = s[s4 + 1];
        d[di + 2] = s[s4 + 2];
        d[di + 3] = 255;
      } else {
        d[di] = d[di + 1] = d[di + 2] = 0;
        d[di + 3] = 255;
      }
    }
    out = dst;
  }
  if (colorEffect) applyColor(out.data, colorEffect);
  ctx.putImageData(out, 0, 0);

  if (vignette) {
    const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.72);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

export default function VideoBoothWindow({ isOpen, onClose, getWindowProps }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const offRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const mapsRef = useRef({});
  const previewRefs = useRef({});
  const previewOffRef = useRef(null);
  const previewMapsRef = useRef({});
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [effect, setEffect] = useState("bulge");
  const [showEffects, setShowEffects] = useState(false);
  const [recording, setRecording] = useState(false);
  // Camera stays off until the visitor opts in, so loading the site never
  // triggers a browser permission popup uninvited.
  const [cameraEnabled, setCameraEnabled] = useState(false);
  // Session captures (recorded videos): {url, name}
  const [captures, setCaptures] = useState([]);
  // Stage selection: {type:'camera'} | {type:'library', i} | {type:'capture', i}
  const [stage, setStage] = useState({ type: "camera" });
  const [hasUnmuted, setHasUnmuted] = useState(false);

  const cameraMode = stage.type === "camera";
  const activeEffect = EFFECTS.find((e) => e.id === effect) ?? EFFECTS[4];

  useEffect(() => {
    if (!isOpen || !cameraMode || !cameraEnabled) return;
    setError(null);
    setReady(false);

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: W }, height: { ideal: H } },
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
      recorderRef.current?.state === "recording" && recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setReady(false);
      setRecording(false);
    };
  }, [isOpen, facingMode, cameraMode, cameraEnabled]);

  // Free capture object URLs when the window unmounts entirely
  useEffect(() => {
    return () => captures.forEach((c) => URL.revokeObjectURL(c.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render loop: main stage + (when open) the 3x3 live effect previews
  useEffect(() => {
    if (!ready || !cameraMode) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!offRef.current) {
      offRef.current = document.createElement("canvas");
      offRef.current.width = W;
      offRef.current.height = H;
    }
    const offCtx = offRef.current.getContext("2d", { willReadFrequently: true });

    if (!previewOffRef.current) {
      previewOffRef.current = document.createElement("canvas");
      previewOffRef.current.width = PREVIEW_W;
      previewOffRef.current.height = PREVIEW_H;
    }
    const pOffCtx = previewOffRef.current.getContext("2d", { willReadFrequently: true });

    const getMap = (name, w, h, cache) => {
      if (!name) return null;
      const key = `${name}-${w}`;
      if (!cache[key]) cache[key] = buildMap(name, w, h);
      return cache[key];
    };

    const draw = () => {
      renderFrame(
        video, offCtx, ctx, W, H,
        getMap(activeEffect.map, W, H, mapsRef.current),
        activeEffect.color,
        true,
      );

      if (showEffects) {
        for (const fx of EFFECTS) {
          const pc = previewRefs.current[fx.id];
          if (!pc) continue;
          const pctx = pc.getContext("2d", { willReadFrequently: true });
          renderFrame(
            video, pOffCtx, pctx, PREVIEW_W, PREVIEW_H,
            getMap(fx.map, PREVIEW_W, PREVIEW_H, previewMapsRef.current),
            fx.color,
            false,
          );
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready, cameraMode, activeEffect, showEffects]);

  const toggleRecording = () => {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stream = canvas.captureStream(30);
    let rec;
    try {
      rec = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
    } catch {
      try {
        rec = new MediaRecorder(stream, { mimeType: "video/webm" });
      } catch {
        rec = new MediaRecorder(stream); // Safari: video/mp4
      }
    }
    chunksRef.current = [];
    rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: rec.mimeType });
      const url = URL.createObjectURL(blob);
      setCaptures((c) => [...c, { url, name: `Video ${c.length + 1}` }]);
      setRecording(false);
    };
    recorderRef.current = rec;
    rec.start();
    setRecording(true);
  };

  const saveCapture = async (cap) => {
    const res = await fetch(cap.url);
    const blob = await res.blob();
    const ext = blob.type.includes("mp4") ? "mp4" : "webm";
    const file = new File([blob], `${cap.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.${ext}`, { type: blob.type });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: cap.name });
        return;
      } catch {
        // fall through to download
      }
    }
    const a = document.createElement("a");
    a.href = cap.url;
    a.download = file.name;
    a.click();
  };

  const strip = [
    { type: "camera" },
    ...boothVideos.map((_, i) => ({ type: "library", i })),
    ...captures.map((_, i) => ({ type: "capture", i })),
  ];
  const stageIndex = strip.findIndex(
    (s) => s.type === stage.type && s.i === stage.i,
  );
  const stepStage = (dir) => {
    const next = (stageIndex + dir + strip.length) % strip.length;
    setStage(strip[next]);
  };

  if (!isOpen) return null;

  const stagedLibrary = stage.type === "library" ? boothVideos[stage.i] : null;
  const stagedCapture = stage.type === "capture" ? captures[stage.i] : null;

  return (
    <Rnd {...getWindowProps} dragHandleClassName="pb-title-bar" cancel=".window-control, .pb-strip, .pb-player, .pb-effects">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-black shadow-2xl"
      >
        {/* Title bar */}
        <div className="pb-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-white/10 bg-zinc-900 px-4 active:cursor-grabbing">
          <button type="button" aria-label="Close Video Booth" onClick={onClose}
            className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400" />
          <button type="button" aria-label="Minimize"
            className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50" />
          <button type="button" aria-label="Zoom"
            className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50" />
          <div className="ml-3 text-sm font-medium text-white/85">Video Booth</div>
          {recording && (
            <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-red-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> REC
            </div>
          )}
        </div>

        {/* Stage */}
        <div className="relative flex-1 bg-black flex flex-col min-h-0">
          {cameraMode && (
            <>
              <video ref={videoRef} className="hidden" playsInline muted />
              <canvas ref={canvasRef} width={W} height={H} className="h-full w-full object-cover" />
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black text-white/60 text-sm text-center px-6">
                  <span className="text-3xl">📵</span>
                  <p>Camera access denied</p>
                  <p className="text-xs text-white/40">{error}</p>
                </div>
              )}
              {!cameraEnabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center">
                  <span className="text-4xl">🎥</span>
                  <p className="text-sm text-white/70">
                    Want to record a clip with effects?
                  </p>
                  <button
                    type="button"
                    onClick={() => setCameraEnabled(true)}
                    className="window-control rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-500"
                  >
                    Enable Camera
                  </button>
                  <p className="text-xs text-white/35">
                    Your browser will ask for permission. Nothing is uploaded —
                    recordings stay on your device.
                  </p>
                </div>
              )}
              {cameraEnabled && !ready && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white/40 text-sm">
                  Starting camera…
                </div>
              )}

              {/* Effects panel — classic 3x3 live grid */}
              {showEffects && ready && (
                <div className="pb-effects absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 bg-black/90 p-2">
                  {EFFECTS.map((fx) => (
                    <button
                      key={fx.id}
                      type="button"
                      onClick={() => {
                        setEffect(fx.id);
                        setShowEffects(false);
                      }}
                      className={`relative overflow-hidden rounded border transition ${
                        effect === fx.id ? "border-blue-400" : "border-white/15 hover:border-white/50"
                      }`}
                    >
                      <canvas
                        ref={(el) => { previewRefs.current[fx.id] = el; }}
                        width={PREVIEW_W}
                        height={PREVIEW_H}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[10px] font-medium text-white/90">
                        {fx.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {stagedLibrary && (
            <video
              key={stagedLibrary.src}
              src={stagedLibrary.src}
              className="pb-player h-full w-full object-contain bg-black"
              controls
              autoPlay
              playsInline
              muted={!hasUnmuted}
              onVolumeChange={(e) => {
                if (!e.currentTarget.muted) setHasUnmuted(true);
              }}
            />
          )}

          {stagedCapture && (
            <>
              <video
                key={stagedCapture.url}
                src={stagedCapture.url}
                className="pb-player h-full w-full object-contain bg-black"
                controls
                autoPlay
                playsInline
                loop
              />
              <button
                type="button"
                onClick={() => saveCapture(stagedCapture)}
                className="window-control absolute right-3 top-3 rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-black/80"
              >
                Save ↓
              </button>
            </>
          )}

          {/* Prev / next arrows */}
          {strip.length > 1 && !showEffects && (
            <>
              <button type="button" aria-label="Previous" onClick={() => stepStage(-1)}
                className="window-control absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur hover:bg-black/70">
                ‹
              </button>
              <button type="button" aria-label="Next" onClick={() => stepStage(1)}
                className="window-control absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur hover:bg-black/70">
                ›
              </button>
            </>
          )}
        </div>

        {/* Filmstrip */}
        <div className="pb-strip flex gap-2 overflow-x-auto border-t border-white/10 bg-zinc-900/90 px-3 py-2">
          <button
            type="button"
            onClick={() => setStage({ type: "camera" })}
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
              onClick={() => setStage({ type: "library", i })}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border transition ${
                stage.type === "library" && stage.i === i ? "border-blue-400" : "border-white/10 hover:border-white/30"
              }`}
              aria-label={`Play ${v.name}`}
            >
              <video src={v.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center text-white/90 text-lg drop-shadow">▶</span>
            </button>
          ))}
          {captures.map((c, i) => (
            <button
              key={c.url}
              type="button"
              onClick={() => setStage({ type: "capture", i })}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border transition ${
                stage.type === "capture" && stage.i === i ? "border-blue-400" : "border-white/10 hover:border-white/30"
              }`}
              aria-label={`View ${c.name}`}
            >
              <video src={c.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center text-white/90 text-lg drop-shadow">▶</span>
            </button>
          ))}
        </div>

        {/* Controls (camera mode only) */}
        {cameraMode && (
          <div className="flex items-center justify-between bg-zinc-900 px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEffects((s) => !s)}
                disabled={!ready || recording}
                className={`window-control h-10 rounded-lg border px-3 text-sm font-medium transition disabled:opacity-40 ${
                  showEffects ? "border-blue-400 bg-zinc-700 text-white" : "border-white/10 bg-zinc-800 text-white/85 hover:bg-zinc-700"
                }`}
              >
                Effects
              </button>
            </div>

            {/* Record */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={!ready}
              aria-label={recording ? "Stop recording" : "Start recording"}
              className="window-control flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-white/10 transition-all hover:bg-white/20 active:scale-95 disabled:opacity-40"
            >
              <span className={`bg-red-500 transition-all ${recording ? "h-5 w-5 rounded" : "h-8 w-8 rounded-full"}`} />
            </button>

            <button
              type="button"
              onClick={() => setFacingMode((f) => (f === "environment" ? "user" : "environment"))}
              disabled={!ready || recording}
              className="window-control flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-lg text-white transition-all hover:bg-zinc-600 active:scale-95 disabled:opacity-40"
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
