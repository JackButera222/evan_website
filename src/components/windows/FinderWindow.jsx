import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { socialLinks } from "../../constants";

function FinderWindow({ isOpen, onClose, getWindowProps }) {
  if (!isOpen) return null;

  return (
    <Rnd
      {...getWindowProps}
      dragHandleClassName="finder-title-bar"
      cancel=".window-control, a"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-zinc-950/65 shadow-2xl backdrop-blur-2xl sm:rounded-2xl"
      >
        <div className="finder-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-white/10 bg-white/10 px-4 active:cursor-grabbing">
          <button
            type="button"
            aria-label="Close Socials Folder"
            onClick={onClose}
            className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400"
          />
          <button
            type="button"
            aria-label="Minimize Socials Folder"
            className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50"
          />
          <button
            type="button"
            aria-label="Zoom Socials Folder"
            className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50"
          />
          <div className="ml-3 text-sm font-medium text-white/85">Socials</div>
        </div>

        <div className="flex min-h-0 flex-1 bg-zinc-100 text-zinc-900">
          <aside className="hidden w-40 shrink-0 border-r border-zinc-200 bg-zinc-50/90 p-3 text-sm text-zinc-600 sm:block">
            <div className="rounded-md bg-blue-500 px-2 py-1.5 font-medium text-white">
              Favorites
            </div>
            <div className="mt-3 px-2 py-1.5">Evan Photo</div>
            <div className="px-2 py-1.5">Bookings</div>
            <div className="px-2 py-1.5">Press Kit</div>
          </aside>

          <main className="min-w-0 flex-1 overflow-auto">
            <div className="grid grid-cols-[1fr_170px_78px] border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              <div>Name</div>
              <div className="hidden sm:block">Account</div>
              <div className="text-right">Link</div>
            </div>

            <div>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={
                    social.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel={
                    social.href.startsWith("mailto:")
                      ? undefined
                      : "noreferrer"
                  }
                  className="grid grid-cols-[1fr_78px] items-center gap-3 border-b border-zinc-200 px-4 py-3 text-sm transition hover:bg-blue-50 sm:grid-cols-[1fr_170px_78px]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-sm font-semibold text-white shadow-sm">
                      {social.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-zinc-900">
                        {social.name}
                      </div>
                      <div className="truncate text-xs text-zinc-500 sm:hidden">
                        {social.detail}
                      </div>
                    </div>
                  </div>
                  <div className="hidden truncate text-zinc-500 sm:block">
                    {social.detail}
                  </div>
                  <div className="text-right text-blue-600">Open</div>
                </a>
              ))}
            </div>
          </main>
        </div>
      </motion.div>
    </Rnd>
  );
}

export default FinderWindow;
