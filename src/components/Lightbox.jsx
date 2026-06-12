import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";

const SLIDESHOW_MS = 3200;

/**
 * Full-screen media viewer with keyboard navigation (arrows / escape /
 * space for slideshow) and an auto-advancing slideshow mode.
 */
function Lightbox({ items, index, onNavigate, onClose }) {
  const [slideshow, setSlideshow] = useState(false);
  const isOpen = index !== null && items.length > 0;
  const media = isOpen ? items[index] : null;

  // Reset slideshow when the viewer closes
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) setSlideshow(false);
  }

  const next = useCallback(() => {
    if (!isOpen) return;
    onNavigate((index + 1) % items.length);
  }, [isOpen, index, items.length, onNavigate]);

  const prev = useCallback(() => {
    if (!isOpen) return;
    onNavigate((index - 1 + items.length) % items.length);
  }, [isOpen, index, items.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") {
        e.preventDefault();
        setSlideshow((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, next, prev, onClose]);

  useEffect(() => {
    if (!slideshow || !isOpen) return undefined;
    const t = window.setInterval(next, SLIDESHOW_MS);
    return () => window.clearInterval(t);
  }, [slideshow, isOpen, next]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[15000] flex flex-col bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 py-3 text-white/80"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm tabular-nums">
              {index + 1} of {items.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSlideshow((v) => !v)}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium transition hover:bg-white/20"
              >
                {slideshow ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                {slideshow ? "Pause" : "Slideshow"}
              </button>
              <button
                type="button"
                aria-label="Close viewer"
                onClick={onClose}
                className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Media */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-6 sm:px-20">
            <button
              type="button"
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/25 sm:left-5"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={media.src}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex max-h-full max-w-full items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {media.type === "video" ? (
                  <video
                    src={media.src}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[78vh] max-w-full rounded-md bg-black shadow-2xl"
                  />
                ) : (
                  <img
                    src={media.src}
                    alt={media.alt}
                    className="max-h-[78vh] max-w-full rounded-md object-contain shadow-2xl"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/25 sm:right-5"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Lightbox;
