import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import appleLogo from "../assets/apple_logo.svg.png";
import contentPack from "../assets/content-pack-logo-square.png";
import mojaveDay from "../assets/mojave-day.jpg";
import mojaveNight from "../assets/mojave-night.jpg";
import tHuggy from "../assets/iacpack/testimonial-huggyduzit.webp";
import tCon from "../assets/iacpack/testimonial-con.webp";
import tDtrel from "../assets/iacpack/testimonial-dtrel.webp";

const trackCheckout = () =>
  window.fbq?.("track", "InitiateCheckout", { content_name: "IAC Pack", value: 100, currency: "USD" });

const carouselImages = Object.values(
  import.meta.glob("../assets/iacpack/carousel-*.webp", { eager: true, import: "default" }),
);

const included = [
  "30 Phone-Filmed Ideas",
  "Step-by-Step CapCut Tutorials",
  "Valuable, Easy-to-Follow Guidance",
  "All the Behind-The-Scenes Essentials",
];

const testimonials = [
  {
    handle: "@huggyduzit",
    photo: tHuggy,
    quote:
      "From the variety of cool ideas, to just understanding the BASICS to filming on my iPhone. This pack truly made filming my content at home so much easier.",
  },
  {
    handle: "@con_colorofnoise",
    photo: tCon,
    quote:
      "The amount of VALUE in this pack is unbelievable. It gave the extra boost of confidence I needed when making content with my phone",
  },
  {
    handle: "@d_trel_music",
    photo: tDtrel,
    quote:
      "This made posting content and sharing my music so much easier and more AFFORDABLE. For this price too, it's a game changer",
  },
];

const faqs = [
  {
    q: "What's included in the Independent Artist Content Pack?",
    a: "30 content ideas with behind-the-scenes filming and editing tutorials using iPhone and CapCut, including camera settings and export guidance.",
  },
  {
    q: "How do I access the content after purchasing?",
    a: "An access link is emailed to you, giving lifetime access to the complete folder of videos.",
  },
  {
    q: "Do I need special software or equipment?",
    a: "Only a phone, a tripod, and the CapCut mobile app.",
  },
  {
    q: "How long do I have access?",
    a: "Forever, once purchased.",
  },
];

// Product landing page served at /iacpack — same standalone layout as
// /contact: Mojave wallpaper + menu bar, one big Mac-style window.
function IacPackPage() {
  const [now, setNow] = useState(() => new Date());
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(id);
  }, []);

  const startCheckout = async () => {
    trackCheckout();
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch {
      setCheckoutError("Something went wrong starting checkout — please try again or message me directly.");
      setCheckoutLoading(false);
    }
  };

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
        <time className="shrink-0 tabular-nums text-white/90" dateTime={now.toISOString()}>
          {menuDateTime}
        </time>
      </div>

      {/* Product window */}
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
            <div className="ml-3 text-sm font-medium text-white/85">App Store — IAC Pack</div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-zinc-100 text-zinc-900">
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
                    The next step to creating music content from your phone 📱
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Instant download · Lifetime access
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={startCheckout}
                      disabled={checkoutLoading}
                      className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60"
                    >
                      {checkoutLoading ? "Redirecting…" : "GET — $100"}
                    </button>
                    <span className="text-sm text-zinc-400">
                      <s>$180 value</s>
                    </span>
                    <span className="text-xs text-zinc-400">Secure checkout via Stripe</span>
                  </div>
                  {checkoutError && (
                    <p className="mt-2 text-xs text-red-600">{checkoutError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="px-6 py-6 sm:px-10 sm:py-8">
              <h2 className="text-xl font-semibold">The Perfect Package for Independent Artists</h2>
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
              <p className="mt-4 text-sm text-zinc-600">
                Total value: <s className="text-zinc-400">$180</s>{" "}
                <span className="font-semibold text-zinc-900">Today just $100</span>
              </p>
            </div>

            {/* Scrolling preview strip */}
            <div className="iac-marquee border-b border-zinc-200 bg-zinc-950 py-4">
              <div className="iac-marquee-track">
                {[...carouselImages, ...carouselImages].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    aria-hidden={i >= carouselImages.length}
                    loading="lazy"
                    className="h-56 w-auto shrink-0 rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="px-6 py-6 sm:px-10 sm:py-8">
              {/* Testimonials */}
              <h2 className="mt-10 text-xl font-semibold">What music artists are saying...</h2>
              <div className="mt-4 space-y-4">
                {testimonials.map((t) => (
                  <figure
                    key={t.handle}
                    className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center"
                  >
                    <img
                      src={t.photo}
                      alt={`${t.handle} content example`}
                      loading="lazy"
                      className="h-40 w-full shrink-0 rounded-lg object-cover sm:h-28 sm:w-28"
                    />
                    <div>
                      <blockquote className="text-sm leading-6 text-zinc-700">
                        “{t.quote}”
                      </blockquote>
                      <figcaption className="mt-2 text-sm font-semibold text-blue-600">
                        {t.handle}
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>

              {/* FAQ */}
              <h2 className="mt-10 text-xl font-semibold">You have questions... We have answers.</h2>
              <div className="mt-4 space-y-4">
                {faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-xl border border-zinc-200 bg-white"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-sm font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-6 text-zinc-600">{f.a}</p>
                  </details>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-10 flex flex-col items-center gap-2 border-t border-zinc-200 pt-8">
                <button
                  type="button"
                  onClick={startCheckout}
                  disabled={checkoutLoading}
                  className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60"
                >
                  {checkoutLoading ? "Redirecting…" : "BUY NOW — $100"}
                </button>
                {checkoutError && (
                  <p className="text-xs text-red-600">{checkoutError}</p>
                )}
                <p className="text-xs text-zinc-400">
                  Questions first?{" "}
                  <a href="/contact" className="text-blue-600 underline-offset-2 hover:underline">
                    hit me up
                  </a>
                </p>
                <p className="mt-3 max-w-md text-center text-[11px] leading-5 text-zinc-400">
                  All sales are final. No refunds or exchanges. All digital products
                  are for personal use only and may not be resold or redistributed.
                </p>
              </div>
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

export default IacPackPage;
