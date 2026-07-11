import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { handleBookingSubmit } from "../utils/handlers";
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

          <div className="min-h-0 flex-1 overflow-y-auto bg-zinc-100 text-zinc-900">
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

            {/* Booking form */}
            <div className="px-6 py-6 sm:px-10 sm:py-8">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Book a Shoot</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Fill it out and it goes straight to my inbox.
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => handleBookingSubmit(event, setBookingSent)}
              >
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-zinc-700">Name</span>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-zinc-700">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>

                <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                  What Type of Shoot Are You Interested In?
                </span>
                <fieldset className="space-y-3 rounded-lg border border-zinc-300 bg-white/90 p-4 text-sm text-zinc-700">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shootType"
                      value="Short Form Content Shoot"
                      required
                      className="h-4 w-4 accent-blue-600"
                    />
                    Short Form Content Shoot
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shootType"
                      value="Full Music Video Shoot"
                      className="h-4 w-4 accent-blue-600"
                    />
                    Full Music Video Shoot
                  </label>
                </fieldset>

                <span className="mb-1.5 block text-sm font-medium text-zinc-700">Your Budget</span>
                <fieldset className="space-y-3 rounded-lg border border-zinc-300 bg-white/90 p-4 text-sm text-zinc-700">
                  {["$450-$900", "$900-$1,350", "$1,350-2,000", "$2,000+"].map((b, i) => (
                    <label key={b} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="budget"
                        value={b}
                        required={i === 0}
                        className="h-4 w-4 accent-blue-600"
                      />
                      {b}
                    </label>
                  ))}
                </fieldset>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Link To Your Instagram
                  </span>
                  <input
                    name="instagram"
                    type="url"
                    required
                    placeholder="https://instagram.com/yourhandle"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Anything Else? <span className="font-normal text-zinc-400">(optional)</span>
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell me about your vision, timeline, references..."
                    className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-green-700">
                    {bookingSent ? "Request sent — talk soon!" : ""}
                  </p>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    SUBMIT
                  </button>
                </div>
              </form>
            </div>
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
