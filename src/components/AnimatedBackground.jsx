// Subtle animated aurora background. A brighter violet base with a few large,
// heavily-blurred color blobs drifting on slow loops. Motion is disabled for
// users with prefers-reduced-motion via the CSS in App.css.
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden aurora-bg" aria-hidden="true">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
      {/* faint grain of stars so it still reads as a night sky */}
      <div className="aurora-stars" />
    </div>
  );
}

export default AnimatedBackground;
