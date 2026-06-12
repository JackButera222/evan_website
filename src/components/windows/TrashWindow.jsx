import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Window from "../Window";

const OUTTAKE_NAMES = [
  "lens_cap_on_take3.jpg",
  "blurry_but_artistic.jpg",
  "finger_over_lens.jpg",
  "battery_died_mid_take.mov",
  "wind_ate_the_audio.mov",
  "tripod_fell_over.jpg",
  "overexposed_v7_FINAL.jpg",
  "client_blinked_again.jpg",
];

function TrashWindow({ windowProps, galleryPhotos }) {
  const [emptied, setEmptied] = useState(false);

  const items = galleryPhotos
    .filter((item) => item.type !== "video")
    .slice(0, OUTTAKE_NAMES.length)
    .map((item, i) => ({ ...item, name: OUTTAKE_NAMES[i] }));

  return (
    <Window title="Trash" {...windowProps} dragCancel=".aqua-scroll, button">
      <div className="flex min-h-0 flex-1 flex-col bg-[#fbfbfb] text-zinc-900">
        <div className="aqua-scroll relative min-h-0 flex-1 overflow-auto">
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
            <AnimatePresence>
              {!emptied &&
                items.map((item, index) => (
                  <motion.div
                    key={item.name}
                    exit={{
                      opacity: 0,
                      scale: 0.4,
                      y: 30,
                      transition: { delay: index * 0.05, duration: 0.25 },
                    }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-md bg-zinc-200 opacity-80 shadow-sm ring-1 ring-zinc-900/10 saturate-50">
                      <img
                        src={item.thumb ?? item.src}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        style={{ objectPosition: item.position }}
                      />
                    </div>
                    <span className="max-w-full truncate text-[11px] text-zinc-500">
                      {item.name}
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {emptied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-8 text-center"
            >
              <Sparkles className="h-8 w-8 text-zinc-300" />
              <p className="text-sm font-semibold text-zinc-500">
                Trash is empty.
              </p>
              <p className="text-xs text-zinc-400">
                Every shot that ships is intentional.
              </p>
            </motion.div>
          )}
        </div>

        <div className="flex h-11 shrink-0 items-center justify-between border-t border-zinc-300 bg-gradient-to-b from-[#f4f4f4] to-[#dcdcdc] px-4">
          <span className="text-xs text-zinc-500">
            {emptied ? "0 items" : `${items.length} items, 4.2 GB of regret`}
          </span>
          {!emptied && (
            <button
              type="button"
              onClick={() => setEmptied(true)}
              className="aqua-button-secondary !py-1 text-xs"
            >
              Empty Trash…
            </button>
          )}
        </div>
      </div>
    </Window>
  );
}

export default TrashWindow;
