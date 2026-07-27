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

        <div className="trash-list flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-auto bg-zinc-100 p-4 text-center text-zinc-900">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-zinc-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0 1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
          </svg>
          <p className="text-sm font-medium text-zinc-500">The Trash is empty</p>
          <p className="max-w-[220px] text-xs text-zinc-400">
            Nothing's been thrown out — check back later.
          </p>
        </div>
      </motion.div>
    </Rnd>
  );
}

export default TrashWindow;
