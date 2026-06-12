import { Film, Image, LayoutGrid, Play } from "lucide-react";
import Window from "../Window";

const FILTERS = [
  { id: "all", label: "Library", icon: LayoutGrid },
  { id: "photos", label: "Photos", icon: Image },
  { id: "videos", label: "Videos", icon: Film },
];

function PhotosWindow({
  windowProps,
  displayedGallery,
  mediaFilter,
  onFilterChange,
  onPhotoSelect,
}) {
  const activeLabel = FILTERS.find((f) => f.id === mediaFilter)?.label;

  return (
    <Window
      title="Photos"
      {...windowProps}
      dragCancel=".photos-gallery, .aqua-sidebar-item"
    >
      <div className="flex min-h-0 flex-1 bg-[#fbfbfb] text-zinc-900">
        <aside className="aqua-sidebar hidden w-40 shrink-0 p-3 text-sm sm:block">
          <div className="aqua-sidebar-heading">Albums</div>
          <div className="space-y-0.5">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={`aqua-sidebar-item ${
                  mediaFilter === filter.id ? "active" : ""
                }`}
              >
                <filter.icon className="h-4 w-4 shrink-0 opacity-75" />
                {filter.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          {/* Mobile filter row */}
          <div className="flex gap-1.5 border-b border-zinc-200 px-3 py-2 sm:hidden">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={
                  mediaFilter === filter.id
                    ? "rounded-full bg-[#3875d7] px-3 py-1 text-xs font-semibold text-white"
                    : "rounded-full px-3 py-1 text-xs text-zinc-600"
                }
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="aqua-scroll min-h-0 flex-1 overflow-auto p-4">
            <div className="photos-gallery grid grid-cols-2 gap-3 sm:grid-cols-3">
              {displayedGallery.map((item, index) => (
                <button
                  type="button"
                  key={`${item.alt}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-md bg-zinc-200 shadow-sm ring-1 ring-zinc-900/10 transition duration-150 hover:ring-2 hover:ring-[#3875d7] focus-visible:ring-2 focus-visible:ring-[#3875d7]"
                  onClick={() => onPhotoSelect(index)}
                >
                  {item.type === "video" ? (
                    <>
                      <video
                        src={item.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition group-hover:bg-black/70">
                          <Play className="ml-0.5 h-5 w-5 fill-current" />
                        </span>
                      </span>
                    </>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ objectPosition: item.position }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* iPhoto-style status bar */}
          <div className="flex h-7 shrink-0 items-center justify-center border-t border-zinc-300 bg-gradient-to-b from-[#f4f4f4] to-[#dcdcdc] text-xs text-zinc-500">
            {displayedGallery.length}{" "}
            {displayedGallery.length === 1 ? "item" : "items"} in {activeLabel}
          </div>
        </main>
      </div>
    </Window>
  );
}

export default PhotosWindow;
