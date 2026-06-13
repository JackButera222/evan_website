import {
  ChevronLeft,
  ChevronRight,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";
import Window from "../Window";

function NotesWindow({ windowProps, now }) {
  return (
    <Window title="Notes" {...windowProps} dragCancel=".aqua-scroll">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f8ed87] text-[#241506]">
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#5d361e] bg-gradient-to-b from-[#8a6645] to-[#4b2a1b] px-2 text-white shadow-inner">
          <button
            type="button"
            className="rounded-md border border-black/35 bg-gradient-to-b from-[#8b6b4d] to-[#3f2518] px-2 py-1 text-xs font-semibold shadow-sm"
          >
            Notes
          </button>
          <div className="text-sm font-semibold drop-shadow">About Vawn</div>
          <button
            type="button"
            aria-label="New Note"
            className="rounded-md border border-black/35 bg-gradient-to-b from-[#8b6b4d] to-[#3f2518] p-1 shadow-sm"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="aqua-scroll min-h-0 flex-1 overflow-auto bg-[#fff58f]">
          <div className="flex h-8 items-center justify-between border-b border-[#d6c96b] px-11 text-xs font-semibold text-[#b2622a]">
            <span>Today</span>
            <span>
              {now.toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="note-paper min-h-[720px]">
            <article className="space-y-0 px-11 pb-8 pt-[8px] font-['Marker_Felt','Comic_Sans_MS',cursive] text-[17px] leading-[29px] tracking-normal text-[#160f05]">
              <p>Evan — videographer + photographer.</p>
              <p>Music videos. Short-form content.</p>
              <p>Portraits, events, editorial.</p>
              <p>Keep sessions relaxed.</p>
              <p>Make every frame intentional.</p>
              <p>Available in New York.</p>
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
    </Window>
  );
}

export default NotesWindow;
