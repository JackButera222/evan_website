import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery, useViewportSize } from "./hooks";
import { galleryPhotos, getDesktopLayout, WINDOW_CONFIGS } from "./constants";
import { getWindowProps } from "./utils/window";
import ErrorBoundary from "./components/ErrorBoundary";
import ContactPage from "./components/ContactPage";
import IacPackPage from "./components/IacPackPage";
import GlobalPreview from "./components/GlobalPreview";
import LockScreen from "./components/LockScreen";
import Dock from "./components/Dock";
import CheckoutIcon from "./components/desktop-icons/CheckoutIcon";
import QuickTimeWindow from "./components/desktop-icons/QuickTimeWindow";
import SnakeIcon from "./components/desktop-icons/SnakeIcon";
import MailIcon from "./components/desktop-icons/MailIcon";
import FinderWindow from "./components/windows/FinderWindow";
import PhotosWindow from "./components/windows/PhotosWindow";
import ContactsWindow from "./components/windows/ContactsWindow";
import NotesWindow from "./components/windows/NotesWindow";
import TrashWindow from "./components/windows/TrashWindow";
import Game2048Window from "./components/windows/Game2048Window";
import PhotoBoothWindow from "./components/windows/PhotoBoothWindow";
import appleLogo from "./assets/apple_logo.svg.png";
import mojaveDay from "./assets/mojave-day.jpg";
import mojaveNight from "./assets/mojave-night.jpg";
import notes from "./assets/notes.png";
import photos from "./assets/photos.png";
import trash from "./assets/trash.png";
import photoBoothIcon from "./assets/photobooth-icon.svg";

function AppInner() {
  const viewportSize = useViewportSize();
  const isMobile = useMediaQuery(
    "(max-width: 640px), (max-width: 1100px) and (max-height: 560px)",
  );
  const desktopLayout = getDesktopLayout(viewportSize, isMobile);

  // Time state
  const [now, setNow] = useState(() => new Date());

  // Lock screen — shown on every fresh load until the user swipes to enter
  // Stay unlocked for the rest of the browser session (e.g. returning from
  // /contact or /iacpack), but re-lock on a manual Lock Screen.
  const [locked, setLocked] = useState(
    () => sessionStorage.getItem("tv-unlocked") !== "1",
  );

  // Window state
  const [photosOpen, setPhotosOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);
  const [snakeOpen, setSnakeOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  // Apple menu + power state ("off" fakes a shutdown)
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);
  const [powerState, setPowerState] = useState(null);

  // Day/night wallpaper — follows the clock until the user toggles it manually
  const [nightOverride, setNightOverride] = useState(null);
  const autoNight = now.getHours() < 6 || now.getHours() >= 18;
  const isNight = nightOverride ?? autoNight;

  // Form state
  const [contactSent, setContactSent] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);

  // Gallery state
  const [mediaFilter, setMediaFilter] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Update time every second
  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

  // Filtered gallery items
  const displayedGallery = galleryPhotos.filter((item) => {
    if (mediaFilter === "all") return true;
    if (mediaFilter === "photos") return item.type !== "video";
    if (mediaFilter === "videos") return item.type === "video";
    return true;
  });

  const selectedMediaIndex = selectedMedia
    ? displayedGallery.findIndex((p) => p === selectedMedia)
    : -1;

  const goToPrevPhoto = () => {
    if (selectedMediaIndex > 0) setSelectedMedia(displayedGallery[selectedMediaIndex - 1]);
  };
  const goToNextPhoto = () => {
    if (selectedMediaIndex < displayedGallery.length - 1)
      setSelectedMedia(displayedGallery[selectedMediaIndex + 1]);
  };

  // Handle escape/arrow keys for preview
  useEffect(() => {
    if (!selectedMedia) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") setSelectedMedia(null);
      if (e.key === "ArrowLeft") goToPrevPhoto();
      if (e.key === "ArrowRight") goToNextPhoto();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMedia, selectedMediaIndex]);

  // Checkout click handler (drag-vs-click is handled inside CheckoutIcon)
  const openGHLCheckout = () => {
    window.location.href = "/iacpack";
  };

  // Date/time formatting
  const menuDateTime = [
    now.toLocaleString([], { weekday: "short" }),
    now.toLocaleString([], { month: "short" }),
    now.toLocaleString([], { day: "numeric" }),
    now.toLocaleString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
  ].join(" ");

  // Create window props helper
  const createWindowProps = (configKey) => {
    return getWindowProps(WINDOW_CONFIGS[configKey], viewportSize, isMobile);
  };

  // Dock items configuration
  const dockItems = [
    {
      id: "photos",
      label: "Photos",
      icon: photos,
      isOpen: photosOpen,
    },
    {
      id: "notes",
      label: "Notes",
      icon: notes,
      iconClassName: "scale-[0.95]",
      isOpen: notesOpen,
    },
    {
      id: "camera",
      label: "Photo Booth",
      icon: photoBoothIcon,
      isOpen: cameraOpen,
    },
    { divider: true },
    {
      id: "trash",
      label: "Trash",
      icon: trash,
      isOpen: trashOpen,
    },
  ];

  // Handle dock item launch
  const handleDockLaunch = (item) => {
    if (item.id === "mail") {
      setContactsOpen(true);
      setContactSent(false);
      setBookingSent(false);
    } else if (item.id === "photos") {
      setPhotosOpen(true);
    } else if (item.id === "notes") {
      setNotesOpen(true);
    } else if (item.id === "trash") {
      setTrashOpen(true);
    } else if (item.id === "camera") {
      setCameraOpen(true);
    }
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-zinc-950 text-white">
      {/* Background — Mojave day/night with a soft crossfade */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${mojaveDay})` }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${mojaveNight})`, opacity: isNight ? 1 : 0 }}
      />
      <div
        aria-hidden="true"
        className="desktop-drag-bounds pointer-events-none absolute inset-x-0 bottom-0 top-8"
      />

      {/* Menu Bar */}
      <div className="absolute inset-x-0 top-0 z-50 flex h-8 items-center justify-between border-b border-white/10 bg-zinc-950/35 px-4 text-sm font-medium text-white shadow-sm backdrop-blur-2xl">
        <div className="flex min-w-0 items-center gap-5">
          <div className="relative flex items-center gap-2 font-semibold">
            <button
              type="button"
              aria-label="Apple menu"
              onClick={() => setAppleMenuOpen((v) => !v)}
              className={`-mx-1.5 flex h-7 items-center rounded px-1.5 transition-colors ${
                appleMenuOpen ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <img
                src={appleLogo}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 object-contain"
              />
            </button>
            <span>tripodvawn</span>

            {appleMenuOpen && (
              <>
                {/* click-away catcher */}
                <div
                  className="fixed inset-0 z-[60]"
                  onClick={() => setAppleMenuOpen(false)}
                />
                <div className="absolute left-0 top-8 z-[70] w-56 overflow-hidden rounded-lg border border-white/15 bg-zinc-900/80 py-1 font-normal shadow-2xl backdrop-blur-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setNotesOpen(true);
                      setAppleMenuOpen(false);
                    }}
                    className="block w-full px-4 py-1 text-left hover:bg-blue-500"
                  >
                    About Vawn
                  </button>
                  <div className="mx-3 my-1 border-t border-white/15" />
                  <button
                    type="button"
                    onClick={() => {
                      setNightOverride(!isNight);
                      setAppleMenuOpen(false);
                    }}
                    className="block w-full px-4 py-1 text-left hover:bg-blue-500"
                  >
                    {isNight ? "Wake Up" : "Sleep"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem("tv-unlocked");
                      window.location.reload();
                    }}
                    className="block w-full px-4 py-1 text-left hover:bg-blue-500"
                  >
                    Restart…
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPowerState("off");
                      setAppleMenuOpen(false);
                    }}
                    className="block w-full px-4 py-1 text-left hover:bg-blue-500"
                  >
                    Shut Down…
                  </button>
                  <div className="mx-3 my-1 border-t border-white/15" />
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem("tv-unlocked");
                      setLocked(true);
                      setAppleMenuOpen(false);
                    }}
                    className="block w-full px-4 py-1 text-left hover:bg-blue-500"
                  >
                    Lock Screen
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/tripodvawn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <time
            className="shrink-0 tabular-nums text-white/90"
            dateTime={now.toISOString()}
          >
            {menuDateTime}
          </time>
        </div>
      </div>

      {/* Desktop Icons */}
      <CheckoutIcon
        placement={desktopLayout.checkout}
        viewport={viewportSize}
        onClick={openGHLCheckout}
      />

      {/* Desktop Icons */}
      <SnakeIcon
        placement={desktopLayout.snake}
        viewport={viewportSize}
        onClick={() => setSnakeOpen(true)}
      />

      <MailIcon
        placement={desktopLayout.mail}
        viewport={viewportSize}
        onClick={() => {
          setContactsOpen(true);
          setContactSent(false);
          setBookingSent(false);
        }}
      />

      {/* QuickTime Window */}
      <QuickTimeWindow
        placement={desktopLayout.quicktime}
        viewport={viewportSize}
      />

      {/* Window Components */}
      <FinderWindow
        isOpen={finderOpen}
        onClose={() => setFinderOpen(false)}
        getWindowProps={createWindowProps("finder")}
      />

      <PhotosWindow
        isOpen={photosOpen}
        onClose={() => setPhotosOpen(false)}
        displayedGallery={displayedGallery}
        mediaFilter={mediaFilter}
        onFilterChange={setMediaFilter}
        onPhotoSelect={setSelectedMedia}
        getWindowProps={createWindowProps("photos")}
      />

      <ContactsWindow
        isOpen={contactsOpen}
        onClose={() => setContactsOpen(false)}
        contactSent={contactSent}
        setContactSent={setContactSent}
        bookingSent={bookingSent}
        setBookingSent={setBookingSent}
        getWindowProps={createWindowProps("contacts")}
      />

      <NotesWindow
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
        now={now}
        getWindowProps={createWindowProps("notes")}
      />

      <TrashWindow
        isOpen={trashOpen}
        onClose={() => setTrashOpen(false)}
        galleryPhotos={galleryPhotos}
        getWindowProps={createWindowProps("trash")}
      />

      <Game2048Window
        isOpen={snakeOpen}
        onClose={() => setSnakeOpen(false)}
        getWindowProps={createWindowProps("snake")}
      />

      <PhotoBoothWindow
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        getWindowProps={createWindowProps("camera")}
      />

      {/* Dock */}
      <Dock items={dockItems} isMobile={isMobile} onLaunch={handleDockLaunch} />

      {/* Global Preview Overlay */}
      <GlobalPreview
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onPrev={selectedMediaIndex > 0 ? goToPrevPhoto : null}
        onNext={selectedMediaIndex < displayedGallery.length - 1 ? goToNextPhoto : null}
      />

      {/* Lock screen */}
      <AnimatePresence>
        {locked && (
          <LockScreen
            now={now}
            onUnlock={() => {
              sessionStorage.setItem("tv-unlocked", "1");
              setLocked(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Sleep / shutdown overlay — fades to black, click or key to wake */}
      <AnimatePresence>
        {powerState && (
          <motion.div
            key="power-overlay"
            role="button"
            tabIndex={0}
            aria-label="Powered off — click to turn on"
            ref={(el) => el?.focus()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            onClick={() => {
              if (powerState === "off") {
                sessionStorage.removeItem("tv-unlocked");
                window.location.reload();
              }
              else setPowerState(null);
            }}
            onKeyDown={() => {
              if (powerState === "off") {
                sessionStorage.removeItem("tv-unlocked");
                window.location.reload();
              }
              else setPowerState(null);
            }}
            className="fixed inset-0 z-[30000] cursor-pointer bg-black outline-none"
          >
            {powerState === "off" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/25"
              >
                click anywhere to turn on
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  // Tiny path-based router: /contact serves the standalone ad landing page,
  // everything else gets the desktop.
  const path = window.location.pathname.replace(/\/+$/, "");

  return (
    <ErrorBoundary>
      {path === "/contact" ? (
        <ContactPage />
      ) : path === "/iacpack" ? (
        <IacPackPage />
      ) : (
        <AppInner />
      )}
    </ErrorBoundary>
  );
}
