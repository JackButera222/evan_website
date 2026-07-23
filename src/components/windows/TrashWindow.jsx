import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

function TrashWindow({ isOpen, onClose, galleryPhotos, getWindowProps }) {
  if (!isOpen) return null;

  return (
    <Rnd
      {...getWindowProps}
      dragHandleClassName="trash-title-bar"
      cancel=".window-control, .trash-list"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-zinc-950/65 shadow-2xl backdrop-blur-2xl sm:rounded-2xl"
      >
        <div className="trash-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-white/10 bg-white/10 px-4 active:cursor-grabbing">
          <button
            type="button"
            aria-label="Close Trash"
            onClick={onClose}
            className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400"
          />
          <button
            type="button"
            aria-label="Minimize Trash"
            className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50"
          />
          <button
            type="button"
            aria-label="Zoom Trash"
            className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50"
          />
          <div className="ml-3 text-sm font-medium text-white/85">Trash</div>
        </div>

        <div className="trash-list min-h-0 flex-1 overflow-auto bg-zinc-100 text-zinc-900">
          <div className="grid grid-cols-1 gap-3 p-4">
            {/* {galleryPhotos.concat(galleryPhotos).map((photo, index) => (
              <button
                type="button"
                key={`${photo.alt}-trash-${index}`}
                className="group aspect-square overflow-hidden rounded-lg bg-zinc-200 shadow-sm ring-1 ring-zinc-900/10 transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <img
                  src={photo.thumb ?? photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ objectPosition: photo.position }}
                />
              </button>
            ))} */}
          </div>
        </div>
      </motion.div>
    </Rnd>
  );
}

export default TrashWindow;
