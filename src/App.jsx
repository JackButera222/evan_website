import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ShoppingCart,
  SquarePen,
  Trash2,
} from "lucide-react";
import wallpaper from "./assets/wallpaper.png";
import mail from "./assets/mail.png";
import notes from "./assets/notes.png";
import photos from "./assets/photos.png";
import trash from "./assets/trash.png";
import hero from "./assets/hero.png";
import folder from "./assets/folder.png";
import calendar from "./assets/calendar.png";
import quicktimeGif from "./assets/quicktime-video.gif";
import appleLogo from "./assets/apple_logo.svg.png";
import mojaveDay from "./assets/wallpaper.png";
import mojaveNight from "./assets/wallpaper.png";

const galleryPhotos = [
  { src: wallpaper, alt: "Colorful macOS wallpaper", position: "center" },
  {
    src: wallpaper,
    alt: "Blue and pink wallpaper detail",
    position: "18% 42%",
  },
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
    detail: "@tripodvawn",
    href: "https://www.instagram.com/tripodvawn/?hl=en",
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

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => mediaQuery.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}

function useViewportSize() {
  const getViewportSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [viewportSize, setViewportSize] = useState(getViewportSize);

  useEffect(() => {
    const updateViewportSize = () => setViewportSize(getViewportSize());

    window.addEventListener("resize", updateViewportSize);

    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  return viewportSize;
}

export default function App() {
  const folderWasDragged = useRef(false);
  const folderDragStart = useRef({ x: 0, y: 0 });
  const folderPointerStart = useRef({ x: 0, y: 0 });
  const viewportSize = useViewportSize();
  const isMobile = useMediaQuery(
    "(max-width: 640px), (max-width: 1100px) and (max-height: 560px)",
  );
  const [now, setNow] = useState(() => new Date());
  const [photosOpen, setPhotosOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const checkoutWasDragged = useRef(false);
  const checkoutDragStart = useRef({ x: 0, y: 0 });

  const mobileLayout = {
    folder: { x: 16, y: 350, width: 90, height: 90 },
    calendar: { x: 16, y: 470, width: 120, height: 120 },
    quicktime: { x: 16, y: 80, width: 250, height: 250 },
    checkout: { x: 130, y: 350, width: 90, height: 90 },
  };

  const desktopLayout = {
    folder: { x: 80, y: 80, width: 90, height: 110 },
    calendar: {
      x: Math.max(24, viewportSize.width - 150 - 64),
      y: 72,
      width: 150,
      height: 150,
    },
    quicktime: { x: 80, y: 180, width: 400, height: 400 },
    checkout: { x: 200, y: 80, width: 90, height: 90 },
  };

  const layout = isMobile ? mobileLayout : desktopLayout;

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  function handleContactSubmit(event) {
    event.preventDefault();
    setContactSent(true);
  }

  function openFinderFromIcon() {
    if (folderWasDragged.current) {
      folderWasDragged.current = false;
      return;
    }

    setFinderOpen(true);
  }

  function openGHLCheckout() {
    if (checkoutWasDragged.current) {
      checkoutWasDragged.current = false;
      return;
    }
    window.top.location.href =
      "https://tripodvawn.com/checkout";
  }

  const isNight = now.getHours() < 6 || now.getHours() >= 18;
  // const isNight = true;

  const menuDateTime = now.toLocaleString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const calendarMonth = now
    .toLocaleString([], { month: "short" })
    .toUpperCase();
  const calendarDay = now.getDate();

  function getWindowProps({ x, y, width, height, minWidth, minHeight }) {
    const margin = isMobile ? 20 : 24;
    const bottomReserve = isMobile ? 132 : 96;
    const availableWidth = Math.max(240, viewportSize.width - margin * 2);
    const availableHeight = Math.max(
      240,
      viewportSize.height - margin - bottomReserve,
    );
    const windowWidth = Math.min(isMobile ? 360 : width, availableWidth);
    const windowHeight = Math.min(isMobile ? 380 : height, availableHeight);
    const maxX = Math.max(margin, viewportSize.width - windowWidth - margin);
    const maxY = Math.max(
      margin,
      viewportSize.height - windowHeight - bottomReserve,
    );

    return {
      default: {
        x: isMobile ? margin : Math.min(x, maxX),
        y: isMobile ? 34 : Math.min(y, maxY),
        width: windowWidth,
        height: windowHeight,
      },
      minWidth: Math.min(isMobile ? 0 : minWidth, availableWidth),
      minHeight: Math.min(isMobile ? 0 : minHeight, availableHeight),
      maxWidth: availableWidth,
      maxHeight: availableHeight,
      disableDragging: false,
      enableResizing: !isMobile,
    };
  }

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-zinc-950 text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${mojaveDay})`,
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${mojaveNight})`,
          opacity: isNight ? 1 : 0,
        }}
      />

      <div className="absolute inset-x-0 top-0 z-50 flex h-8 items-center justify-between border-b border-white/10 bg-zinc-950/35 px-4 text-sm font-medium text-white shadow-sm backdrop-blur-2xl">
        <div className="flex min-w-0 items-center gap-5">
          <div className="flex items-center gap-2 font-semibold">
            <img
              src={appleLogo}
              alt=""
              aria-hidden="true"
              className="h-4 w-4 object-contain"
            />
            <span>tripodvawn</span>
          </div>
        </div>
        <time
          className="shrink-0 tabular-nums text-white/90"
          dateTime={now.toISOString()}
        >
          {menuDateTime}
        </time>
      </div>

      {/* Desktop Icon (Draggable) */}
      <Rnd
        key={isMobile ? "mobile-folder" : "desktop-folder"}
        default={{
          x: layout.folder.x,
          y: layout.folder.y,
          width: layout.folder.width,
          height: layout.folder.height,
        }}
        bounds="parent"
        disableDragging={false}
        enableResizing={false}
        onDragStart={(_event, data) => {
          folderWasDragged.current = false;
          folderDragStart.current = { x: data.x, y: data.y };
        }}
        onDrag={(_event, data) => {
          const deltaX = data.x - folderDragStart.current.x;
          const deltaY = data.y - folderDragStart.current.y;

          if (Math.hypot(deltaX, deltaY) > 8) {
            folderWasDragged.current = true;
          }
        }}
      >
        <button
          type="button"
          aria-label="Open Socials Folder"
          onPointerDown={(event) => {
            folderPointerStart.current = {
              x: event.clientX,
              y: event.clientY,
            };
          }}
          onPointerUp={(event) => {
            const deltaX = event.clientX - folderPointerStart.current.x;
            const deltaY = event.clientY - folderPointerStart.current.y;

            if (Math.hypot(deltaX, deltaY) <= 8) {
              folderWasDragged.current = false;
              setFinderOpen(true);
            }
          }}
          onClick={openFinderFromIcon}
          className="flex h-full w-full touch-none cursor-pointer select-none flex-col items-center justify-between gap-2 px-2 py-2"
          style={{ width: layout.folder.width, height: layout.folder.height }}
        >
          <span className="flex h-full w-full items-center justify-center">
            <img
              src={folder}
              className="max-h-full max-w-full object-contain drop-shadow-xl pointer-events-none"
            />
          </span>

          <span className="px-1.5 py-0.5 text-sm font-semibold text-white">
            Socials
          </span>
        </button>
      </Rnd>

      <Rnd
        key={isMobile ? "mobile-calendar" : "desktop-calendar"}
        default={{
          x: layout.calendar.x,
          y: layout.calendar.y,
          width: layout.calendar.width,
          height: layout.calendar.height,
        }}
        bounds="parent"
        disableDragging={false}
        enableResizing={false}
      >
        <button
          type="button"
          aria-label={`Calendar ${calendarMonth} ${calendarDay}`}
          className="flex h-full w-full touch-none cursor-pointer select-none flex-col items-center justify-between gap-2 px-2 py-2"
          style={{
            width: layout.calendar.width,
            height: layout.calendar.height,
          }}
        >
          <span className="relative flex-1 w-full drop-shadow-xl">
            <img
              src={calendar}
              alt=""
              aria-hidden="true"
              className="pointer-events-none h-full w-full object-contain"
            />
            {/* <span className="pointer-events-none absolute left-[12px] top-[24px] -rotate-[10deg] text-[7px] font-bold leading-none tracking-wide text-white">
              {calendarMonth}
            </span>
            <span className="pointer-events-none absolute inset-x-0 top-[30px] -rotate-[11deg] text-center text-[30px] font-bold leading-none tracking-normal text-zinc-800">
              {calendarDay}
            </span> */}
          </span>

          <span className="px-1.5 py-0.5 text-sm font-semibold text-white">
            Click 2 Book A Shoot
          </span>
        </button>
      </Rnd>

      <Rnd
        key={isMobile ? "mobile-checkout" : "desktop-checkout"}
        default={{
          x: layout.checkout.x,
          y: layout.checkout.y,
          width: layout.checkout.width,
          height: layout.checkout.height,
        }}
        bounds="parent"
        disableDragging={false}
        enableResizing={false}
        onDragStart={(_event, data) => {
          checkoutWasDragged.current = false;
          checkoutDragStart.current = { x: data.x, y: data.y };
        }}
        onDrag={(_event, data) => {
          const deltaX = data.x - checkoutDragStart.current.x;
          const deltaY = data.y - checkoutDragStart.current.y;

          if (Math.hypot(deltaX, deltaY) > 8) {
            checkoutWasDragged.current = true;
          }
        }}
      >
        <button
          type="button"
          aria-label="Open Checkout"
          onClick={openGHLCheckout}
          className="flex h-full w-full touch-none cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          style={{
            width: layout.checkout.width,
            height: layout.checkout.height,
          }}
        >
          <ShoppingCart className="h-10 w-10" />
          <span className="text-xs font-semibold uppercase tracking-[0.12em]">
            Buy Pack
          </span>
        </button>
      </Rnd>

      {/* QuickTime Window (Movable, non-closable) */}
      <Rnd
        key={isMobile ? "mobile-quicktime" : "desktop-quicktime"}
        default={{
          x: layout.quicktime.x,
          y: layout.quicktime.y,
          width: layout.quicktime.width,
          height: layout.quicktime.height,
        }}
        bounds="parent"
        enableResizing={false}
        dragHandleClassName="quicktime-drag-handle"
      >
        <div
          className="quicktime-drag-handle h-full w-full cursor-grab active:cursor-grabbing"
          style={{
            width: layout.quicktime.width,
            height: layout.quicktime.height,
          }}
        >
          <img
            src={quicktimeGif}
            alt="QuickTime video"
            className="block w-full h-full object-contain pointer-events-none"
          />
        </div>
      </Rnd>

      {finderOpen && (
        <Rnd
          {...getWindowProps({
            x: 160,
            y: 120,
            width: 620,
            height: 390,
            minWidth: 380,
            minHeight: 300,
          })}
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
      )}

      {photosOpen && (
        <Rnd
          {...getWindowProps({
            x: 190,
            y: 90,
            width: 680,
            height: 460,
            minWidth: 380,
            minHeight: 300,
          })}
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
              <div className="ml-3 text-sm font-medium text-white/85">
                Photos
              </div>
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
                  <h1 className="text-xl font-semibold tracking-normal">
                    Library
                  </h1>
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
          {...getWindowProps({
            x: 250,
            y: 120,
            width: 560,
            height: 520,
            minWidth: 360,
            minHeight: 420,
          })}
          dragHandleClassName="contacts-title-bar"
          cancel=".window-control, input, textarea, button"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-zinc-950/65 shadow-2xl backdrop-blur-2xl sm:rounded-2xl"
          >
            <div className="contacts-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-white/10 bg-white/10 px-4 active:cursor-grabbing">
              <button
                type="button"
                aria-label="Close Mail"
                onClick={() => setContactsOpen(false)}
                className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400"
              />
              <button
                type="button"
                aria-label="Minimize Mail"
                className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50"
              />
              <button
                type="button"
                aria-label="Zoom Mail"
                className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50"
              />
              <div className="ml-3 text-sm font-medium text-white/85">Mail</div>
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
                        {contactSent
                          ? "Message ready. Thanks for reaching out."
                          : ""}
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
          {...getWindowProps({
            x: 300,
            y: 80,
            width: 560,
            height: 540,
            minWidth: 360,
            minHeight: 360,
          })}
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
              <div className="ml-3 text-sm font-medium text-white/85">
                Notes
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f8ed87] text-[#241506]">
              <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#5d361e] bg-gradient-to-b from-[#8a6645] to-[#4b2a1b] px-2 text-white shadow-inner">
                <button
                  type="button"
                  className="rounded-md border border-black/35 bg-gradient-to-b from-[#8b6b4d] to-[#3f2518] px-2 py-1 text-xs font-semibold shadow-sm"
                >
                  Notes
                </button>
                <div className="text-sm font-semibold drop-shadow">
                  About Evan
                </div>
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
                    <p>Evan is a photographer.</p>
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
          </motion.div>
        </Rnd>
      )}

      {trashOpen && (
        <Rnd
          {...getWindowProps({
            x: 360,
            y: 110,
            width: 430,
            height: 500,
            minWidth: 320,
            minHeight: 340,
          })}
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
                onClick={() => setTrashOpen(false)}
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
              <div className="ml-3 text-sm font-medium text-white/85">
                Trash
              </div>
            </div>

            <div className="trash-list min-h-0 flex-1 overflow-auto bg-zinc-100 text-zinc-900">
              <div className="grid grid-cols-1 gap-3 p-4">
                {galleryPhotos.concat(galleryPhotos).map((photo, index) => (
                  <button
                    type="button"
                    key={`${photo.alt}-trash-${index}`}
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
            </div>
          </motion.div>
        </Rnd>
      )}

      {/* Dock */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-end gap-4 rounded-3xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl sm:bottom-5 sm:gap-5 sm:px-5">
        {/* Mail */}

        <button
          type="button"
          aria-label="Open Mail"
          onClick={() => {
            setContactsOpen(true);
            setContactSent(false);
          }}
          className="h-12 w-12 cursor-pointer transition-transform hover:scale-110 sm:h-14 sm:w-14"
        >
          <img src={mail} className="h-full w-full scale-103 object-contain" />
        </button>

        {/* Photos */}

        <button
          type="button"
          aria-label="Open Photos"
          onClick={() => setPhotosOpen(true)}
          className="h-12 w-12 cursor-pointer overflow-hidden transition-transform hover:scale-110 sm:h-14 sm:w-14"
        >
          <img
            src={photos}
            className="h-full w-full scale-107 object-contain"
          />
        </button>

        {/* Notes */}

        <button
          type="button"
          aria-label="Open Notes"
          onClick={() => setNotesOpen(true)}
          className="h-12 w-12 cursor-pointer transition-transform hover:scale-110 sm:h-14 sm:w-14"
        >
          <img src={notes} className="w-full h-full object-contain" />
        </button>

        <div className="mx-1 h-10 w-px self-center bg-white/25 sm:h-12" />

        {/* Trash */}

        <button
          type="button"
          aria-label="Open Trash"
          onClick={() => setTrashOpen(true)}
          className="h-12 w-12 cursor-pointer overflow-hidden transition-transform hover:scale-110 sm:h-14 sm:w-14"
        >
          <img
            src={trash}
            className="relative left-[45%] h-[94%] w-auto max-w-none -translate-x-1/2 scale-110 object-contain"
          />
        </button>
      </div>
    </div>
  );
}
