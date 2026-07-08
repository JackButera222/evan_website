import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import appleLogo from "../assets/apple_logo.svg.png";
import contentPack from "../assets/content-pack-logo-square.png";
import mojaveDay from "../assets/mojave-day.jpg";
import mojaveNight from "../assets/mojave-night.jpg";

// TODO: replace with the real Stripe Payment Link for the IAC Pack
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/REPLACE_ME";
const PRICE_LABEL = "$0"; // TODO: real price

const included = [
  "Short form content strategy built for independent artists",
  "Professionally shot and edited clips ready to post",
  "Cover art / promo photos from the shoot",
  "Delivered fast, formatted for Instagram, TikTok, and YouTube Shorts",
];

// Product landing page served at /iacpack — same standalone layout as
// /contact: Mojave wallpaper + menu bar, one big Mac-style window.
function IacPackPage() {
  const [now, setNow] = useState(() => new Date());

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
    <div className="relative min-h-[100dvh] w-screen overflow-x-hidden bg-zinc-950 text-white">
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
        <time className="shrink-0 tabular-nums text-white/90" dateTime={now.toISOString()}>
          {menuDateTime}
        </time>
      </div>

      {/* Product window */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-3 pb-10 pt-14 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col overflow-hidden rounded-xl border border-white/20 bg-zinc-950/65 shadow-2xl backdrop-blur-2xl sm:rounded-2xl"
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
            <div className="ml-3 text-sm font-medium text-white/85">App Store — IAC Pack</div>
          </div>

          <div className="bg-zinc-100 text-zinc-900">
            {/* Product header */}
            <div className="border-b border-zinc-200 bg-white/70 px-6 py-6 sm:px-10">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <img
                  src={contentPack}
                  alt="Independent Artist Content Pack"
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-lg"
                />
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Independent Artist Content Pack
                  </h1>
                  <p className="mt-1 text-sm text-zinc-500">
                    Everything an independent artist needs to stay consistent online.
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href={STRIPE_CHECKOUT_URL}
                      className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                    >
                      GET — {PRICE_LABEL}
                    </a>
                    <span className="text-xs text-zinc-400">Secure checkout via Stripe</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="px-6 py-6 sm:px-10 sm:py-8">
              <h2 className="text-xl font-semibold">What's Included</h2>
              <ul className="mt-4 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-zinc-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-1 h-4 w-4 shrink-0 text-blue-600">
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.415l2.792 2.793 6.793-6.793a1 1 0 011.415 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-zinc-900">Why the pack?</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Consistency is what grows an artist. The IAC Pack gives you a
                  batch of professional content from a single shoot — so you have
                  weeks of posts, not one video. Shot and edited by Tripod Vawn,
                  trusted by artists like YEAT, Polo G, Sophie Powers, and Eva Grace.
                </p>
              </div>

              <div className="mt-8 flex flex-col items-center gap-2 border-t border-zinc-200 pt-8">
                <a
                  href={STRIPE_CHECKOUT_URL}
                  className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                >
                  BUY THE PACK — {PRICE_LABEL}
                </a>
                <p className="text-xs text-zinc-400">
                  Questions first?{" "}
                  <a href="/contact" className="text-blue-600 underline-offset-2 hover:underline">
                    hit me up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="mt-4 text-center text-xs text-white/60">
          <a href="/" className="underline-offset-2 hover:underline">
            ← back to tripodvawn.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default IacPackPage;
