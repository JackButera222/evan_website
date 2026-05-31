import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import wallpaper from "./assets/wallpaper.png";
import contacts from "./assets/contacts.png";
import notes from "./assets/notes.png";
import photos from "./assets/photos.png";
import hero from "./assets/hero.png";
import folder from "./assets/folder.png";

const galleryPhotos = [
  { src: wallpaper, alt: "Colorful macOS wallpaper", position: "center" },
  { src: wallpaper, alt: "Blue and pink wallpaper detail", position: "18% 42%" },
  { src: wallpaper, alt: "Orange wallpaper detail", position: "74% 45%" },
  { src: wallpaper, alt: "Purple wallpaper detail", position: "52% 72%" },
  { src: hero, alt: "Portrait photo", position: "center" },
  { src: wallpaper, alt: "Green wallpaper detail", position: "35% 24%" },
  { src: wallpaper, alt: "Bright wallpaper detail", position: "82% 72%" },
  { src: wallpaper, alt: "Soft wallpaper detail", position: "10% 74%" },
];

const socialLinks = [
  {
    name: "Instagram",
    detail: "@evanphoto",
    href: "https://instagram.com/evanphoto",
  },
  {
    name: "Portfolio",
    detail: "evanphoto.com",
    href: "https://evanphoto.com",
  },
  {
    name: "TikTok",
    detail: "@evanphoto",
    href: "https://tiktok.com/@evanphoto",
  },
  {
    name: "Behance",
    detail: "Editorial and campaign work",
    href: "https://behance.net/evanphoto",
  },
  {
    name: "Email",
    detail: "hello@evanphoto.com",
    href: "mailto:hello@evanphoto.com",
  },
];

export default function App() {
  const folderWasDragged = useRef(false);
  const [photosOpen, setPhotosOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  function handleContactSubmit(event) {
    event.preventDefault();
    setContactSent(true);
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 text-white relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${wallpaper})`,
        }}
      />

      {/* Desktop Icon (Draggable) */}
      <Rnd
        default={{
          x: 80,
          y: 80,
          width: 90,
          height: 110,
        }}
        bounds="parent"
        enableResizing={false}
        onDrag={() => {
          folderWasDragged.current = true;
        }}
      >
        <button
          type="button"
          aria-label="Open Socials Folder"
          onClick={() => {
            if (folderWasDragged.current) {
              folderWasDragged.current = false;
              return;
            }

            setFinderOpen(true);
          }}
          className="flex flex-col items-center gap-2 cursor-pointer select-none"
        >
          <img
            src={folder}
            className="w-20 h-auto max-h-16 object-contain drop-shadow-xl pointer-events-none"
          />

          <span className="rounded-md px-1.5 py-0.5 text-sm text-white shadow-sm">
            Socials
          </span>
        </button>
      </Rnd>

      {finderOpen && (
        <Rnd
          default={{
            x: 160,
            y: 120,
            width: 620,
            height: 390,
          }}
          minWidth={380}
          minHeight={300}
          bounds="parent"
          dragHandleClassName="finder-title-bar"
          cancel=".window-control, a"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full h-full rounded-2xl overflow-hidden backdrop-blur-2xl bg-zinc-950/65 border border-white/20 shadow-2xl flex flex-col"
          >
            <div className="finder-title-bar h-11 border-b border-white/10 bg-white/10 flex items-center px-4 gap-2 cursor-grab active:cursor-grabbing">
              <button
                type="button"
                aria-label="Close Socials Folder"
                onClick={() => setFinderOpen(false)}
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
              <div className="ml-3 text-sm font-medium text-white/85">
                Socials
              </div>
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
                      target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={social.href.startsWith("mailto:") ? undefined : "noreferrer"}
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
      )}

      {photosOpen && (
        <Rnd
          default={{
            x: 190,
            y: 90,
            width: 680,
            height: 460,
          }}
          minWidth={380}
          minHeight={300}
          bounds="parent"
          dragHandleClassName="photos-title-bar"
          cancel=".window-control, .photos-gallery"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full h-full rounded-2xl overflow-hidden backdrop-blur-2xl bg-zinc-950/65 border border-white/20 shadow-2xl flex flex-col"
          >
            <div className="photos-title-bar h-11 border-b border-white/10 bg-white/10 flex items-center px-4 gap-2 cursor-grab active:cursor-grabbing">
              <button
                type="button"
                aria-label="Close Photos"
                onClick={() => setPhotosOpen(false)}
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
                <div className="rounded-md bg-blue-500 px-2 py-1.5 font-medium text-white">
                  Library
                </div>
                <div className="mt-3 px-2 py-1.5">Favorites</div>
                <div className="px-2 py-1.5">Albums</div>
              </aside>

              <main className="min-w-0 flex-1 overflow-auto p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h1 className="text-xl font-semibold tracking-normal">Library</h1>
                  <div className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600">
                    {galleryPhotos.length} Photos
                  </div>
                </div>

                <div className="photos-gallery grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {galleryPhotos.map((photo, index) => (
                    <button
                      type="button"
                      key={`${photo.alt}-${index}`}
                      className="group aspect-square overflow-hidden rounded-lg bg-zinc-200 shadow-sm ring-1 ring-zinc-900/10 transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ objectPosition: photo.position }}
                      />
                    </button>
                  ))}
                </div>
              </main>
            </div>
          </motion.div>
        </Rnd>
      )}

      {contactsOpen && (
        <Rnd
          default={{
            x: 250,
            y: 120,
            width: 560,
            height: 520,
          }}
          minWidth={360}
          minHeight={420}
          bounds="parent"
          dragHandleClassName="contacts-title-bar"
          cancel=".window-control, input, textarea, button"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full h-full rounded-2xl overflow-hidden backdrop-blur-2xl bg-zinc-950/65 border border-white/20 shadow-2xl flex flex-col"
          >
            <div className="contacts-title-bar h-11 border-b border-white/10 bg-white/10 flex items-center px-4 gap-2 cursor-grab active:cursor-grabbing">
              <button
                type="button"
                aria-label="Close Contacts"
                onClick={() => setContactsOpen(false)}
                className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400"
              />
              <button
                type="button"
                aria-label="Minimize Contacts"
                className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50"
              />
              <button
                type="button"
                aria-label="Zoom Contacts"
                className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50"
              />
              <div className="ml-3 text-sm font-medium text-white/85">
                Contact
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-zinc-100 text-zinc-900">
              <div className="grid min-h-full md:grid-cols-[190px_1fr]">
                <aside className="border-b border-zinc-200 bg-zinc-50 p-4 md:border-b-0 md:border-r">
                  <div className="flex items-center gap-3 md:block">
                    <img
                      src={hero}
                      alt="Photographer portrait"
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-md md:h-24 md:w-24"
                    />
                    <div className="min-w-0 md:mt-4">
                      <div className="text-base font-semibold">Evan Photo</div>
                      <div className="text-sm text-zinc-500">
                        Portraits, events, and editorial sessions
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-zinc-600">
                    <a
                      href="mailto:hello@evanphoto.com"
                      className="block rounded-md bg-white px-3 py-2 ring-1 ring-zinc-200 hover:bg-zinc-100"
                    >
                      hello@evanphoto.com
                    </a>
                    <div className="rounded-md bg-white px-3 py-2 ring-1 ring-zinc-200">
                      New York / available to travel
                    </div>
                  </div>
                </aside>

                <main className="p-5">
                  <div className="mb-5">
                    <h1 className="text-xl font-semibold tracking-normal">
                      Book a Shoot
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                      Send a note about your project, date, and location.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleContactSubmit}>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Email
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Subject
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Wedding inquiry, portrait session, event..."
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Message
                      </span>
                      <textarea
                        required
                        rows={7}
                        placeholder="Tell me what you are imagining."
                        className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </label>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-green-700">
                        {contactSent ? "Message ready. Thanks for reaching out." : ""}
                      </p>
                      <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </main>
              </div>
            </div>
          </motion.div>
        </Rnd>
      )}

      {notesOpen && (
        <Rnd
          default={{
            x: 300,
            y: 80,
            width: 560,
            height: 540,
          }}
          minWidth={360}
          minHeight={360}
          bounds="parent"
          dragHandleClassName="notes-title-bar"
          cancel=".window-control"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full h-full rounded-2xl overflow-hidden backdrop-blur-2xl bg-zinc-950/65 border border-white/20 shadow-2xl flex flex-col"
          >
            <div className="notes-title-bar h-11 border-b border-white/10 bg-white/10 flex items-center px-4 gap-2 cursor-grab active:cursor-grabbing">
              <button
                type="button"
                aria-label="Close Notes"
                onClick={() => setNotesOpen(false)}
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

            <div className="min-h-0 flex-1 overflow-auto bg-[#f8f1d8] text-zinc-900">
              <div className="mx-auto max-w-xl p-6">
                <div className="mb-5 text-sm text-zinc-500">Today</div>

                <article className="space-y-5 leading-relaxed">
                  <header>
                    <h1 className="text-3xl font-semibold tracking-normal">
                      About Evan
                    </h1>
                    <p className="mt-2 text-zinc-700">
                      Evan is a photographer focused on honest, cinematic images
                      for people, gatherings, and brands. His work blends quiet
                      direction with a documentary eye, keeping sessions relaxed
                      while still making every frame feel intentional.
                    </p>
                  </header>

                  <section>
                    <h2 className="mb-2 text-lg font-semibold">Services</h2>
                    <ul className="space-y-2 text-zinc-700">
                      <li>Portrait sessions for artists, couples, graduates, and professionals</li>
                      <li>Event coverage for weddings, parties, launches, and live moments</li>
                      <li>Editorial and lifestyle shoots for creative projects and small brands</li>
                      <li>Photo selection, color editing, and web-ready delivery galleries</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="mb-2 text-lg font-semibold">Approach</h2>
                    <p className="text-zinc-700">
                      Every shoot starts with a conversation about mood, location,
                      timing, and the story behind the images. Evan keeps the
                      process simple: plan the essentials, make the shoot feel
                      natural, and deliver photographs that still feel like you.
                    </p>
                  </section>
                </article>
              </div>
            </div>
          </motion.div>
        </Rnd>
      )}

      {/* Dock */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-5 py-3 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-xl flex gap-5 items-end">
        {/* Contacts */}

        <button
          type="button"
          aria-label="Open Contacts"
          onClick={() => {
            setContactsOpen(true);
            setContactSent(false);
          }}
          className="w-14 h-14 hover:scale-110 transition-transform cursor-pointer"
        >
          <img src={contacts} className="w-full h-full object-contain" />
        </button>

        {/* Photos */}

        <button
          type="button"
          aria-label="Open Photos"
          onClick={() => setPhotosOpen(true)}
          className="w-14 h-14 hover:scale-110 transition-transform cursor-pointer"
        >
          <img src={photos} className="w-full h-full object-contain" />
        </button>

        {/* Notes */}

        <button
          type="button"
          aria-label="Open Notes"
          onClick={() => setNotesOpen(true)}
          className="w-14 h-14 hover:scale-110 transition-transform cursor-pointer"
        >
          <img src={notes} className="w-full h-full object-contain" />
        </button>
      </div>
    </div>
  );
}
