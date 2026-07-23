import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { VideoBoothExperience } from "./windows/VideoBoothWindow";
import appleLogo from "../assets/apple_logo.svg.png";
import mojaveDay from "../assets/mojave-day.jpg";
import mojaveNight from "../assets/mojave-night.jpg";

// Standalone landing page served at /videos — same Mac look as /contact and
// /iacpack (wallpaper + menu bar) but the window is the Video Booth itself
// instead of a form or product page.
function VideosPage() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(id);
  }, []);

  const isNight = now.getHours() < 6 || now.getHours() >= 18;
  const menuDateTime = [
    now.toLocaleString([], { weekday: "short" }),
    now.toLocaleString([], { month: "short" }),
    now.toLocaleString([], { day: "numeric" }),
    now.toLocaleString([], { hour: "numeric", minute: "2-digit" }),
  ].join(" ");

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-zinc-950 text-white">
      {/* Wallpaper */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${mojaveDay})` }}
      />
      <div
        className="fixed inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${mojaveNight})`, opacity: isNight ? 1 : 0 }}
      />

      {/* Menu bar */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-between border-b border-white/10 bg-zinc-950/35 px-4 text-sm font-medium text-white shadow-sm backdrop-blur-2xl">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <img src={appleLogo} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
          <span>tripodvawn</span>
        </a>
        <time className="shrink-0 tabular-nums text-white/90" dateTime={now.toISOString()}>
          {menuDateTime}
        </time>
      </div>

      {/* Video Booth window */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col px-3 pb-4 pt-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="min-h-0 flex-1"
        >
          <VideoBoothExperience variant="page" openToLibrary />
        </motion.div>

        <p className="mt-3 shrink-0 text-center text-xs text-white/60">
          <a href="/" className="underline-offset-2 hover:underline">
            ← back to tripodvawn.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default VideosPage;
