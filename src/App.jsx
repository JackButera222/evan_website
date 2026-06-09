import { useEffect, useRef, useState } from "react";
import { useMediaQuery, useViewportSize } from "./hooks";
import {
  galleryPhotos,
  mobileLayout,
  desktopLayout,
  WINDOW_CONFIGS,
} from "./constants";
import { getDefaultPosition, getWindowProps } from "./utils/window";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalPreview from "./components/GlobalPreview";
import Dock from "./components/Dock";
import CheckoutIcon from "./components/desktop-icons/CheckoutIcon";
import QuickTimeWindow from "./components/desktop-icons/QuickTimeWindow";
import FinderWindow from "./components/windows/FinderWindow";
import PhotosWindow from "./components/windows/PhotosWindow";
import ContactsWindow from "./components/windows/ContactsWindow";
import NotesWindow from "./components/windows/NotesWindow";
import TrashWindow from "./components/windows/TrashWindow";
import appleLogo from "./assets/apple_logo.svg.png";
import mojaveDay from "./assets/wallpaper.png";
import mojaveNight from "./assets/wallpaper.png";

function AppInner() {
  const viewportSize = useViewportSize();
  const isMobile = useMediaQuery(
    "(max-width: 640px), (max-width: 1100px) and (max-height: 560px)",
  );
  const layout = isMobile ? mobileLayout : desktopLayout;

  // Time state
  const [now, setNow] = useState(() => new Date());

  // Window state
  const [photosOpen, setPhotosOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);

  // Form state
  const [contactSent, setContactSent] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);

  // Gallery state
  const [mediaFilter, setMediaFilter] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Drag tracking refs
  const checkoutWasDraggedRef = useRef(false);
  const checkoutDragStartRef = useRef({ x: 0, y: 0 });
  const checkoutPointerStartRef = useRef({ x: 0, y: 0 });

  // Update time every second
  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

  // Handle escape key to close preview
  useEffect(() => {
    if (!selectedMedia) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") setSelectedMedia(null);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMedia]);

  // Filtered gallery items
  const displayedGallery = galleryPhotos.filter((item) => {
    if (mediaFilter === "all") return true;
    if (mediaFilter === "photos") return item.type !== "video";
    if (mediaFilter === "videos") return item.type === "video";
    return true;
  });

  // Checkout click handler
  const openGHLCheckout = () => {
    if (checkoutWasDraggedRef.current) {
      checkoutWasDraggedRef.current = false;
      return;
    }
    window.open("https://tripodvawn.com/", "_blank", "noopener,noreferrer");
  };

  // Date/time formatting
  const isNight = now.getHours() < 6 || now.getHours() >= 18;
  const menuDateTime = now.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  // Create window props helper
  const createWindowProps = (configKey) => {
    return getWindowProps(WINDOW_CONFIGS[configKey], viewportSize, isMobile);
  };

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
      <div
        aria-hidden="true"
        className="desktop-drag-bounds pointer-events-none absolute inset-x-0 bottom-0 top-8"
      />

      {/* Menu Bar */}
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

      {/* Desktop Icons */}
      <CheckoutIcon
        layout={layout}
        isMobile={isMobile}
        getDefaultPosition={getDefaultPosition}
        viewportSize={viewportSize}
        onClick={openGHLCheckout}
        checkoutDragStartRef={checkoutDragStartRef}
        checkoutPointerStartRef={checkoutPointerStartRef}
        checkoutWasDraggedRef={checkoutWasDraggedRef}
      />

      {/* QuickTime Window */}
      <QuickTimeWindow
        layout={layout}
        isMobile={isMobile}
        getDefaultPosition={getDefaultPosition}
        viewportSize={viewportSize}
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

      {/* Dock */}
      <Dock
        onMailClick={() => {
          setContactsOpen(true);
          setContactSent(false);
          setBookingSent(false);
        }}
        onPhotosClick={() => setPhotosOpen(true)}
        onNotesClick={() => setNotesOpen(true)}
        onTrashClick={() => setTrashOpen(true)}
      />

      {/* Global Preview Overlay */}
      <GlobalPreview media={selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
