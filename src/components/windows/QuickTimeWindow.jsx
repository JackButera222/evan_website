import { useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Window from "../Window";
import showreel from "../../assets/portfolio/videos/quicktime-video.mp4";

/**
 * QuickTime X style player: dark chrome, autoplaying muted showreel,
 * hover control bar. "Fullscreen" hands the video to the lightbox.
 */
function QuickTimeWindow({ windowProps, onFullscreen }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <Window title="showreel.mov" variant="dark" {...windowProps}>
      <div className="group relative min-h-0 flex-1 bg-black">
        <video
          ref={videoRef}
          src={showreel}
          autoPlay
          muted
          loop
          playsInline
          onClick={togglePlay}
          className="h-full w-full cursor-pointer object-cover"
        />

        {/* Hover control bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-white/15 bg-black/60 px-2 py-1.5 shadow-2xl backdrop-blur-md">
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={togglePlay}
              className="rounded-lg p-2 text-white transition hover:bg-white/15"
            >
              {playing ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
            </button>
            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={toggleMute}
              className="rounded-lg p-2 text-white transition hover:bg-white/15"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              aria-label="Fullscreen"
              onClick={onFullscreen}
              className="rounded-lg p-2 text-white transition hover:bg-white/15"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Window>
  );
}

export default QuickTimeWindow;
