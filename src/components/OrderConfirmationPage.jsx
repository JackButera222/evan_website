import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import appleLogo from "../assets/apple_logo.svg.png";
import mojaveDay from "../assets/mojave-day.jpg";
import mojaveNight from "../assets/mojave-night.jpg";

// Standalone landing page served at /order-confirmation — Stripe Checkout
// redirects here after a successful IAC Pack payment. Same Mac look as
// /contact and /iacpack. The actual access link is emailed separately by the
// Stripe webhook (api/stripe-webhook.js); this page just confirms the order
// and looks up the email address Stripe collected for a personal touch.
function OrderConfirmationPage() {
  const [now, setNow] = useState(() => new Date());
  const [sessionId] = useState(
    () => new URLSearchParams(window.location.search).get("session_id"),
  );
  const [status, setStatus] = useState(sessionId ? "loading" : "error"); // loading | ok | error
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.paid) {
          setStatus("error");
          return;
        }
        setEmail(data.email);
        setStatus("ok");
        window.fbq?.("track", "Purchase", { content_name: "IAC Pack", value: 100, currency: "USD" });
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

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

      {/* Confirmation window */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-lg flex-col justify-center px-3 pb-4 pt-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden rounded-xl border border-white/20 bg-zinc-950/65 shadow-2xl backdrop-blur-2xl sm:rounded-2xl"
        >
          <div className="flex h-11 items-center gap-2 border-b border-white/10 bg-white/10 px-4">
            <a
              href="/"
              aria-label="Back to tripodvawn.com"
              className="h-3.5 w-3.5 rounded-full border border-red-300/50 bg-red-500 hover:bg-red-400"
            />
            <span className="h-3.5 w-3.5 rounded-full border border-yellow-200/50 bg-yellow-400" />
            <span className="h-3.5 w-3.5 rounded-full border border-green-300/50 bg-green-500" />
            <div className="ml-3 text-sm font-medium text-white/85">Order Confirmation</div>
          </div>

          <div className="bg-zinc-100 px-6 py-10 text-center text-zinc-900 sm:px-10">
            {status === "loading" && (
              <p className="text-sm text-zinc-500">Confirming your order…</p>
            )}

            {status === "ok" && (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600">
                  <svg viewBox="0 0 20 20" fill="white" className="h-7 w-7">
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.415l2.792 2.793 6.793-6.793a1 1 0 011.415 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h1 className="mt-4 text-xl font-bold tracking-tight">You're in!</h1>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Your access link is on its way{email ? ` to ${email}` : " to your inbox"}.
                  It can take a few minutes — check spam if you don't see it.
                </p>
                <p className="mt-6 text-xs text-zinc-400">
                  Trouble finding it?{" "}
                  <a href="/contact" className="text-blue-600 underline-offset-2 hover:underline">
                    hit me up
                  </a>
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <h1 className="text-xl font-bold tracking-tight">Couldn't confirm that order</h1>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  If you were just charged, don't worry — reach out and I'll sort you out.
                </p>
                <a
                  href="/contact"
                  className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                >
                  Get in touch
                </a>
              </>
            )}
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

export default OrderConfirmationPage;
