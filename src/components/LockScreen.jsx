import { useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import mojaveDay from "../assets/mojave-day.jpg";
import mojaveNight from "../assets/mojave-night.jpg";
import logo from "../assets/TRIPOD VAWN LOGO V3.png";
import unlockSound from "../assets/iphone-unlock.wav";

const KNOB = 56;
const PAD = 5;
const UNLOCK_RATIO = 0.72; // fraction of the track the knob must cross to enter

function LockScreen({ now, onUnlock }) {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const audioRef = useRef(null);

  // Play the classic iPhone unlock sound, then enter the site. Called from the
  // user gesture (drag release / key press), so autoplay policies allow it.
  const enter = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(unlockSound);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    onUnlock();
  };

  // The hint text and the knob's trailing fill react to the drag progress.
  const hintOpacity = useTransform(x, [0, 150], [1, 0]);
  const fillOpacity = useTransform(x, [0, 180], [0, 0.5]);

  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Match the desktop's day/night rule (day 6am-6pm)
  const isNight = now.getHours() < 6 || now.getHours() >= 18;
  const wallpaper = isNight ? mojaveNight : mojaveDay;

  const maxX = () => {
    const track = trackRef.current;
    return track ? track.offsetWidth - KNOB - PAD * 2 : 0;
  };

  const handleDragEnd = () => {
    const limit = maxX();
    if (limit > 0 && x.get() >= limit * UNLOCK_RATIO) {
      animate(x, limit, { duration: 0.15, ease: "easeOut" });
      window.setTimeout(enter, 150);
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[20000] flex flex-col items-center justify-between overflow-hidden py-[12vh] text-white"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.06,
        transition: { duration: 0.5, ease: "easeInOut" },
      }}
    >
      {/* Wallpaper backdrop */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 bg-cover bg-center blur-md"
        style={{ backgroundImage: `url(${wallpaper})` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/35" />

      {/* Clock */}
      <div className="relative flex flex-col items-center">
        <div className="text-6xl font-semibold tracking-tight drop-shadow-lg sm:text-7xl">
          {time}
        </div>
        <div className="mt-1 text-base font-medium text-white/85 drop-shadow sm:text-lg">
          {date}
        </div>
      </div>

      {/* Profile */}
      <div className="relative flex flex-col items-center gap-3">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/40 bg-white/40 shadow-2xl backdrop-blur-md sm:h-32 sm:w-32">
          <img
            src={logo}
            alt="Tripod Vawn"
            className="h-[78%] w-[78%] object-contain"
          />
        </div>
        <div className="text-xl font-semibold drop-shadow sm:text-2xl">
          tripodvawn
        </div>
      </div>

      {/* Slide to enter */}
      <div className="relative w-full max-w-[320px] px-6">
        <div
          ref={trackRef}
          className="relative flex h-[66px] items-center overflow-hidden rounded-full border border-white/25 bg-white/10 backdrop-blur-md"
        >
          {/* trailing fill that brightens as you drag */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-white"
            style={{ opacity: fillOpacity }}
          />

          <motion.span
            aria-hidden="true"
            style={{ opacity: hintOpacity }}
            className="lock-shimmer pointer-events-none absolute inset-0 flex items-center justify-center text-base font-medium"
          >
            slide to enter
          </motion.span>

          <motion.button
            type="button"
            aria-label="Slide to enter"
            drag="x"
            dragConstraints={trackRef}
            dragElastic={0}
            dragMomentum={false}
            style={{ x, width: KNOB, height: KNOB, marginLeft: PAD }}
            onDragEnd={handleDragEnd}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") enter();
            }}
            whileTap={{ scale: 0.96 }}
            className="relative z-10 flex shrink-0 cursor-grab items-center justify-center rounded-full border border-white/40 bg-white/40 text-white shadow-lg backdrop-blur-md active:cursor-grabbing"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default LockScreen;
