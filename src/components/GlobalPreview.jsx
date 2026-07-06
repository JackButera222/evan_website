function GlobalPreview({ media, onClose, onPrev, onNext }) {
  if (!media) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 p-6"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div className="max-w-[92vw] max-h-[92vh] inline-block">
        <div onClick={(e) => e.stopPropagation()}>
          {media.type === "video" ? (
            <video
              src={media.src}
              controls
              autoPlay
              playsInline
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg bg-black"
            />
          ) : (
            <img
              src={media.src}
              alt={media.alt}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          )}

          <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={!onPrev}
                className="rounded-md bg-white/10 px-3 py-1 text-sm text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!onNext}
                className="rounded-md bg-white/10 px-3 py-1 text-sm text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
              >
                Next →
              </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalPreview;
