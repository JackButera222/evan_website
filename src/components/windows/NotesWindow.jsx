import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, SquarePen, Trash2 } from "lucide-react";

function NotesWindow({ isOpen, onClose, now, getWindowProps }) {
  if (!isOpen) return null;

  return (
    <Rnd
      {...getWindowProps}
      dragHandleClassName="notes-title-bar"
      cancel=".window-control"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-zinc-950/65 shadow-2xl backdrop-blur-2xl sm:rounded-2xl"
      >
        <div className="notes-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-white/10 bg-white/10 px-4 active:cursor-grabbing">
          <button
            type="button"
            aria-label="Close Notes"
            onClick={onClose}
            className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400"
          />
          <button
            type="button"
            aria-label="Minimize Notes"
            className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50"
          />
          <button
            type="button"
            aria-label="Zoom Notes"
            className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50"
          />
          <div className="ml-3 text-sm font-medium text-white/85">Notes</div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f8ed87] text-[#241506]">
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#5d361e] bg-gradient-to-b from-[#8a6645] to-[#4b2a1b] px-2 text-white shadow-inner">
            <button
              type="button"
              className="rounded-md border border-black/35 bg-gradient-to-b from-[#8b6b4d] to-[#3f2518] px-2 py-1 text-xs font-semibold shadow-sm"
            >
              Notes
            </button>
            <div className="text-sm font-semibold drop-shadow">About Evan</div>
            <button
              type="button"
              aria-label="New Note"
              className="rounded-md border border-black/35 bg-gradient-to-b from-[#8b6b4d] to-[#3f2518] p-1 shadow-sm"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto bg-[#fff58f]">
            <div className="flex h-8 items-center justify-between border-b border-[#d6c96b] px-11 text-xs font-semibold text-[#b2622a]">
              <span>Today</span>
              <span>
                {now.toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div
              className="min-h-[720px]"
              style={{
                backgroundColor: "#fff58f",
                backgroundImage:
                  "linear-gradient(90deg, transparent 0 34px, rgba(188, 76, 63, 0.42) 35px, transparent 36px), repeating-linear-gradient(180deg, transparent 0 28px, rgba(150, 130, 62, 0.36) 28px 29px)",
                backgroundPosition: "0 0, 0 0",
                backgroundRepeat: "no-repeat, repeat",
                backgroundSize: "100% 100%, 100% 29px",
              }}
            >
              <article className="space-y-0 px-11 pb-8 pt-[8px] font-['Marker_Felt','Comic_Sans_MS',cursive] text-[17px] leading-[29px] tracking-normal text-[#160f05]">
                <p>Videographer + photographer based in LA.</p>
                <p>10+ years filming for music artists.</p>
                <p>Short form content, live shows, music videos.</p>
                <p>Shot for YEAT, Polo G, Sophie Powers, Eva Grace.</p>
                <p>&nbsp;</p>
                <p>Services:</p>
                <p>- Music videos</p>
                <p>- Short form content (TikTok, Reels)</p>
                <p>- Live performance + tour coverage</p>
                <p>- BTS + studio sessions</p>
                <p>- Artist portraits + cover art</p>
                <p>- Editing + color grading</p>
                <p>&nbsp;</p>
                <p>Available to travel.</p>
                <p>Send project date + location.</p>
              </article>
            </div>
          </div>

          <div className="flex h-12 shrink-0 items-center justify-around border-t border-[#c6ad4d] bg-[#fff58f] text-[#a95826]">
            <button
              type="button"
              aria-label="Previous Note"
              className="rounded-full p-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Edit Note"
              className="rounded-full p-2"
            >
              <SquarePen className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Delete Note"
              className="rounded-full p-2"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next Note"
              className="rounded-full p-2"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </Rnd>
  );
}

export default NotesWindow;
