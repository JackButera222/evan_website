import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AtSign,
  Camera,
  Film,
  Folder,
  Image,
  Notebook,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useMediaQuery, useViewportSize } from "./hooks";
import { useWindowManager } from "./hooks/useWindowManager";
import {
  galleryPhotos,
  mobileLayout,
  desktopLayout,
  WINDOW_CONFIGS,
  socialLinks,
} from "./constants";
import { getDefaultPosition, getWindowProps } from "./utils/window";
import ErrorBoundary from "./components/ErrorBoundary";
import BootScreen from "./components/BootScreen";
import MenuBar from "./components/MenuBar";
import Dock from "./components/Dock";
import DesktopIcon from "./components/DesktopIcon";
import Lightbox from "./components/Lightbox";
import FinderWindow from "./components/windows/FinderWindow";
import PhotosWindow from "./components/windows/PhotosWindow";
import ContactsWindow from "./components/windows/ContactsWindow";
import NotesWindow from "./components/windows/NotesWindow";
import TrashWindow from "./components/windows/TrashWindow";
import QuickTimeWindow from "./components/windows/QuickTimeWindow";
import AboutWindow from "./components/windows/AboutWindow";
import wallpaper from "./assets/wallpaper.png?w=2560&format=webp&quality=80";
import folderIcon from "./assets/folder.png?w=256&format=webp";
import finderIcon from "./assets/finder.svg";
import contentPack from "./assets/content-pack-logo-square.png?w=384&format=webp";
import mailIcon from "./assets/mail.png";
import notesIcon from "./assets/notes.png";
import photosIcon from "./assets/photos.png";
import trashIcon from "./assets/trash.png";
import quicktimeIcon from "./assets/quicktime.png";
import showreel from "./assets/portfolio/videos/quicktime-video.mp4";

const STORE_URL = "https://tripodvawn.com/";

function AppInner() {
  const viewportSize = useViewportSize();
  const isMobile = useMediaQuery(
    "(max-width: 640px), (max-width: 1100px) and (max-height: 560px)",
  );
  const layout = isMobile ? mobileLayout : desktopLayout;

  const wm = useWindowManager(isMobile ? [] : ["quicktime"]);

  // Time state
  const [now, setNow] = useState(() => new Date());

  // Boot / power state
  const [booting, setBooting] = useState(
    () => !sessionStorage.getItem("tv-booted"),
  );
  const [sleeping, setSleeping] = useState(false);

  // Form state
  const [contactSent, setContactSent] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);

  // Gallery state
  const [mediaFilter, setMediaFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null); // { items, index }

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const displayedGallery = useMemo(
    () =>
      galleryPhotos.filter((item) => {
        if (mediaFilter === "photos") return item.type !== "video";
        if (mediaFilter === "videos") return item.type === "video";
        return true;
      }),
    [mediaFilter],
  );

  const openStore = () =>
    window.open(STORE_URL, "_blank", "noopener,noreferrer");

  const openMail = () => {
    wm.openWindow("mail");
    setContactSent(false);
    setBookingSent(false);
  };

  const restart = () => {
    setSleeping(false);
    setBooting(true);
  };

  // Window props per id, shared chrome wiring
  const windowPropsFor = (id) => ({
    isOpen: wm.isOpen(id),
    isMinimized: wm.isMinimized(id),
    isFocused: wm.isFocused(id),
    zIndex: wm.zIndexFor(id),
    onClose: () => wm.closeWindow(id),
    onMinimize: () => wm.minimizeWindow(id),
    onFocus: () => wm.focusWindow(id),
    rndProps: getWindowProps(WINDOW_CONFIGS[id], viewportSize, isMobile),
  });

  const menus = [
    {
      id: "apple",
      items: [
        { label: "About This Mac", action: () => wm.openWindow("about") },
        { separator: true },
        { label: "Book a Shoot…", action: openMail },
        { label: "IAC Content Pack…", action: openStore },
        { separator: true },
        { label: "Sleep", action: () => setSleeping(true) },
        { label: "Restart…", action: restart },
        { label: "Shut Down…", disabled: true },
      ],
    },
    {
      id: "app",
      label: "Tripod Vawn",
      bold: true,
      items: [
        { label: "About Evan", action: () => wm.openWindow("notes") },
        { label: "Watch Showreel", action: () => wm.openWindow("quicktime") },
        { separator: true },
        { label: "Hide Everything", action: () => setSleeping(true) },
      ],
    },
    {
      id: "file",
      label: "File",
      items: [
        {
          label: "New Booking…",
          shortcut: "⌘B",
          action: openMail,
        },
        {
          label: "Open Portfolio",
          shortcut: "⌘O",
          action: () => wm.openWindow("photos"),
        },
        { separator: true },
        { label: "Move to Trash", action: () => wm.openWindow("trash") },
      ],
    },
    {
      id: "go",
      label: "Go",
      items: socialLinks.map((social) => ({
        label: social.name,
        action: () =>
          social.href.startsWith("mailto:")
            ? (window.location.href = social.href)
            : window.open(social.href, "_blank", "noopener,noreferrer"),
      })),
    },
    {
      id: "help",
      label: "Help",
      items: [
        { label: "About This Mac", action: () => wm.openWindow("about") },
        { label: "Contact Evan", action: openMail },
      ],
    },
  ];

  const spotlightItems = [
    {
      label: "Photos — Portfolio",
      kind: "Application",
      icon: Image,
      keywords: ["portfolio", "gallery", "pictures", "work"],
      action: () => wm.openWindow("photos"),
    },
    {
      label: "showreel.mov",
      kind: "Movie",
      icon: Film,
      keywords: ["video", "reel", "showreel", "quicktime"],
      action: () => wm.openWindow("quicktime"),
    },
    {
      label: "Book a Shoot",
      kind: "Action",
      icon: Camera,
      keywords: ["booking", "hire", "shoot", "mail", "contact"],
      action: openMail,
    },
    {
      label: "About Evan",
      kind: "Note",
      icon: Notebook,
      keywords: ["notes", "bio", "evan"],
      action: () => wm.openWindow("notes"),
    },
    {
      label: "Socials",
      kind: "Folder",
      icon: Folder,
      keywords: ["instagram", "tiktok", "links", "social"],
      action: () => wm.openWindow("socials"),
    },
    {
      label: "Instagram — @tripodvawn",
      kind: "Link",
      icon: AtSign,
      keywords: ["instagram", "ig"],
      action: () =>
        window.open(
          "https://www.instagram.com/tripodvawn/?hl=en",
          "_blank",
          "noopener,noreferrer",
        ),
    },
    {
      label: "IAC Content Pack",
      kind: "Store",
      icon: ShoppingBag,
      keywords: ["pack", "buy", "store", "checkout", "iac"],
      action: openStore,
    },
    {
      label: "Trash",
      kind: "Application",
      icon: Trash2,
      keywords: ["outtakes", "bloopers"],
      action: () => wm.openWindow("trash"),
    },
  ];

  const dockItems = [
    {
      id: "socials",
      label: "Finder — Socials",
      icon: finderIcon,
      isOpen: wm.isOpen("socials"),
    },
    {
      id: "photos",
      label: "Photos",
      icon: photosIcon,
      isOpen: wm.isOpen("photos"),
    },
    {
      id: "quicktime",
      label: "QuickTime — Showreel",
      icon: quicktimeIcon,
      isOpen: wm.isOpen("quicktime"),
    },
    {
      id: "mail",
      label: "Mail — Book a Shoot",
      icon: mailIcon,
      isOpen: wm.isOpen("mail"),
    },
    {
      id: "notes",
      label: "Notes — About Evan",
      icon: notesIcon,
      isOpen: wm.isOpen("notes"),
    },
    {
      id: "store",
      label: "IAC Content Pack",
      icon: contentPack,
      iconClassName: "rounded-[18%]",
      external: true,
    },
    { divider: true },
    {
      id: "trash",
      label: "Trash",
      icon: trashIcon,
      // Source has transparent padding baked in
      iconClassName: "scale-[1.12] origin-bottom",
      isOpen: wm.isOpen("trash"),
    },
  ];

  const handleDockLaunch = (item) => {
    if (item.id === "store") {
      openStore();
      return;
    }
    if (item.id === "mail") {
      openMail();
      return;
    }
    wm.openWindow(item.id);
  };

  return (
    <div className="relative h-[100dvh] w-screen select-none overflow-hidden bg-zinc-950 text-white">
      {/* Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${wallpaper})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.4))]" />

      <div
        aria-hidden="true"
        className="desktop-drag-bounds pointer-events-none absolute inset-x-0 bottom-0 top-7"
      />

      <MenuBar
        now={now}
        menus={menus}
        spotlightItems={spotlightItems}
        isMobile={isMobile}
      />

      {/* Desktop icons */}
      <DesktopIcon
        id={`${isMobile ? "m" : "d"}-socials`}
        label="Socials"
        icon={folderIcon}
        defaultPosition={getDefaultPosition(layout.socials, viewportSize)}
        onOpen={() => wm.openWindow("socials")}
      />
      <DesktopIcon
        id={`${isMobile ? "m" : "d"}-checkout`}
        label="IAC Pack"
        icon={contentPack}
        iconClassName="rounded-xl"
        defaultPosition={getDefaultPosition(layout.checkout, viewportSize)}
        onOpen={openStore}
      />

      {/* Windows */}
      <QuickTimeWindow
        windowProps={windowPropsFor("quicktime")}
        onFullscreen={() =>
          setLightbox({
            items: [{ src: showreel, alt: "Showreel", type: "video" }],
            index: 0,
          })
        }
      />

      <FinderWindow windowProps={windowPropsFor("socials")} />

      <PhotosWindow
        windowProps={windowPropsFor("photos")}
        displayedGallery={displayedGallery}
        mediaFilter={mediaFilter}
        onFilterChange={setMediaFilter}
        onPhotoSelect={(index) =>
          setLightbox({ items: displayedGallery, index })
        }
      />

      <ContactsWindow
        windowProps={windowPropsFor("mail")}
        contactSent={contactSent}
        setContactSent={setContactSent}
        bookingSent={bookingSent}
        setBookingSent={setBookingSent}
      />

      <NotesWindow windowProps={windowPropsFor("notes")} now={now} />

      <TrashWindow
        windowProps={windowPropsFor("trash")}
        galleryPhotos={galleryPhotos}
      />

      <AboutWindow windowProps={windowPropsFor("about")} onBook={openMail} />

      <Dock items={dockItems} isMobile={isMobile} onLaunch={handleDockLaunch} />

      <Lightbox
        items={lightbox?.items ?? []}
        index={lightbox?.index ?? null}
        onNavigate={(index) => setLightbox((lb) => ({ ...lb, index }))}
        onClose={() => setLightbox(null)}
      />

      {/* Sleep overlay */}
      <AnimatePresence>
        {sleeping && (
          <motion.button
            type="button"
            aria-label="Wake from sleep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => setSleeping(false)}
            className="fixed inset-0 z-[19000] block w-full cursor-pointer bg-black"
          >
            <span className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-white/25">
              Click anywhere to wake
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <BootScreen
        booting={booting}
        onDone={() => {
          sessionStorage.setItem("tv-booted", "1");
          setBooting(false);
        }}
      />
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
