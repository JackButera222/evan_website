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
      {/* two star layers twinkling out of phase + occasional shooting stars */}
      <div className="aurora-stars" />
      <div className="aurora-stars-2" />
      <div className="aurora-shooting-star" />
      <div className="aurora-shooting-star aurora-shooting-star-2" />
    </div>
  );
}

export default AnimatedBackground;
