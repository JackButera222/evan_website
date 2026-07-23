import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { handleGeneralSubmit } from "../utils/handlers";
import {
  tabs,
  BookShootForm,
  GeneralInquiriesForm,
  SuccessCheckOverlay,
  useSuccessCheck,
} from "./windows/ContactsWindow";
import appleLogo from "../assets/apple_logo.svg.png";
import tripodVawnLogo from "../assets/TRIPOD VAWN LOGO V3.png";
import mojaveDay from "../assets/mojave-day.jpg";
import mojaveNight from "../assets/mojave-night.jpg";

// Standalone landing page served at /contact — same Mac look as the desktop
// (wallpaper + menu bar) but a single large Mail-style window with a short
// bio and the booking form. Built to be an ad destination: no lock screen,
// no dock, nothing between the visitor and the form.
function ContactPage() {
  const [now, setNow] = useState(() => new Date());
  const [bookingSent, setBookingSent] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [activeTab, setActiveTab] = useState("book");
  const showSuccess = useSuccessCheck(contactSent, setContactSent);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(id);
  }, []);

  const isNight = now.getHours() < 6 || now.getHours() >= 18;
  const menuDateTime = [
    now.toLocaleString([], { weekday: "short" }),
    now.toLocaleString([], { month: "short" }),
    now.toLocaleString([], { day: "numeric" }),
    now.toLocaleString([], { hour: "numeric", minute: "2-digit" }),
  ].join(" ");

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-zinc-950 text-white">
      {/* Wallpaper */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${mojaveDay})` }}
      />
      <div
        className="fixed inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${mojaveNight})`, opacity: isNight ? 1 : 0 }}
      />

      {/* Menu bar */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-between border-b border-white/10 bg-zinc-950/35 px-4 text-sm font-medium text-white shadow-sm backdrop-blur-2xl">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <img src={appleLogo} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
          <span>tripodvawn</span>
        </a>
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/tripodvawn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center opacity-80 transition-opacity hover:opacity-100"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <time className="shrink-0 tabular-nums text-white/90" dateTime={now.toISOString()}>
            {menuDateTime}
          </time>
        </div>
      </div>

      {/* Mail-style window */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col px-3 pb-4 pt-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/20 bg-zinc-950/65 shadow-2xl backdrop-blur-2xl sm:rounded-2xl"
        >
          {/* Title bar */}
          <div className="flex h-11 items-center gap-2 border-b border-white/10 bg-white/10 px-4">
            <a
              href="/"
              aria-label="Back to tripodvawn.com"
              className="h-3.5 w-3.5 rounded-full border border-red-300/50 bg-red-500 hover:bg-red-400"
            />
            <span className="h-3.5 w-3.5 rounded-full border border-yellow-200/50 bg-yellow-400" />
            <span className="h-3.5 w-3.5 rounded-full border border-green-300/50 bg-green-500" />
            <div className="ml-3 text-sm font-medium text-white/85">Mail — Contact</div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto bg-zinc-100 text-zinc-900">
            {/* Bio header */}
            <div className="border-b border-zinc-200 bg-white/70 px-6 py-6 sm:px-10">
              <div className="flex items-center gap-4">
                <img
                  src={tripodVawnLogo}
                  alt="Tripod Vawn logo"
                  className="h-16 w-16 shrink-0 rounded-2xl bg-zinc-900 object-contain p-1.5 shadow"
                />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">TRIPOD VAWN</h1>
                  <p className="text-sm text-zinc-500">Videographer + Photographer · Los Angeles</p>
                </div>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600">
                10+ years filming for music artists — short form content, live
                performances, and full music videos. Credits include YEAT, Polo
                G, Sophie Powers, and Eva Grace. Available to travel.
              </p>
            </div>

            {/* Tabs + form */}
            <div className="flex flex-1 flex-col sm:flex-row">
              <aside
                role="tablist"
                aria-label="Mail sections"
                className="hidden w-40 shrink-0 border-r border-zinc-200 bg-zinc-50/90 p-3 text-sm text-zinc-600 sm:block"
              >
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={
                        activeTab === tab.id
                          ? "w-full rounded-md bg-blue-500 px-2 py-1.5 text-left font-medium text-white"
                          : "block w-full px-2 py-1.5 text-left text-zinc-600"
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </aside>

              <main className="min-w-0 flex-1 px-6 py-6 sm:px-10 sm:py-8">
                <div
                  role="tablist"
                  aria-label="Mail sections"
                  className="mb-5 flex flex-wrap gap-2 text-sm text-zinc-600 sm:hidden"
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={
                        activeTab === tab.id
                          ? "rounded-md bg-blue-500 px-2 py-1.5 font-medium text-white"
                          : "px-2 py-1.5 text-zinc-600"
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === "book" ? (
                  <BookShootForm
                    bookingSent={bookingSent}
                    setBookingSent={setBookingSent}
                  />
                ) : (
                  <GeneralInquiriesForm
                    onSubmit={(event) => handleGeneralSubmit(event, setContactSent)}
                  />
                )}
              </main>
            </div>

            <SuccessCheckOverlay show={showSuccess} />
          </div>
        </motion.div>

        <p className="mt-3 shrink-0 text-center text-xs text-white/60">
          <a href="/" className="underline-offset-2 hover:underline">
            ← back to tripodvawn.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default ContactPage;
