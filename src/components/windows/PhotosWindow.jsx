import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

function PhotosWindow({
  isOpen,
  onClose,
  displayedGallery,
  mediaFilter,
  onFilterChange,
  onPhotoSelect,
  getWindowProps,
}) {
  if (!isOpen) return null;

  return (
    <Rnd
      {...getWindowProps}
      dragHandleClassName="photos-title-bar"
      cancel=".window-control, .photos-gallery"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-zinc-950/65 shadow-2xl backdrop-blur-2xl sm:rounded-2xl"
      >
        <div className="photos-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-white/10 bg-white/10 px-4 active:cursor-grabbing">
          <button
            type="button"
            aria-label="Close Photos"
            onClick={onClose}
            className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400"
          />
          <button
            type="button"
            aria-label="Minimize Photos"
            className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50"
          />
          <button
            type="button"
            aria-label="Zoom Photos"
            className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50"
          />
          <div className="ml-3 text-sm font-medium text-white/85">Photos</div>
        </div>

        <div className="flex min-h-0 flex-1 bg-zinc-100 text-zinc-900">
          <aside className="hidden w-36 shrink-0 border-r border-zinc-200 bg-zinc-50/90 p-3 text-sm text-zinc-600 sm:block">
            <div className="space-y-2">
              {/* <button
                type="button"
                onClick={() => onFilterChange("all")}
                className={
                  mediaFilter === "all"
                    ? "rounded-md bg-blue-500 px-2 py-1.5 font-medium text-white w-full text-left"
                    : "block w-full text-left px-2 py-1.5 text-zinc-600"
                }
              >
                Library
              </button> */}

              <button
                type="button"
                onClick={() => onFilterChange("photos")}
                className={
                  mediaFilter === "photos"
                    ? "rounded-md bg-blue-500 px-2 py-1.5 font-medium text-white w-full text-left"
                    : "block w-full text-left px-2 py-1.5 text-zinc-600"
                }
              >
                Photos
              </button>

              {/* <button
                type="button"
                onClick={() => onFilterChange("videos")}
                className={
                  mediaFilter === "videos"
                    ? "rounded-md bg-blue-500 px-2 py-1.5 font-medium text-white w-full text-left"
                    : "block w-full text-left px-2 py-1.5 text-zinc-600"
                }
              >
                Videos
              </button> */}
            </div>
          </aside>

          <main className="min-w-0 flex-1 overflow-auto p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h1 className="text-xl font-semibold tracking-normal">Library</h1>
            </div>

            <div className="photos-gallery grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {displayedGallery.map((photo, index) => (
                <button
                  type="button"
                  key={`${photo.alt}-${index}`}
                  className="group aspect-square overflow-hidden rounded-lg bg-zinc-200 shadow-sm ring-1 ring-zinc-900/10 transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  onClick={() => onPhotoSelect(photo)}
                >
                  {photo.type === "video" ? (
                    <video
                      src={photo.src}
                      controls
                      playsInline
                      preload="none"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={photo.thumb ?? photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ objectPosition: photo.position }}
                    />
                  )}
                </button>
              ))}
            </div>
          </main>
        </div>
      </motion.div>
    </Rnd>
  );
}

export default PhotosWindow;
