import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { AnimatePresence, motion } from "framer-motion";
import tripodVawnLogo from "../../assets/TRIPOD VAWN LOGO V3.png";
import { handleBookingSubmit, handleGeneralSubmit } from "../../utils/handlers";

export const tabs = [
  { id: "book", label: "Book Shoot" },
  { id: "general", label: "General Inquiries" },
];

// Drives the brief Apple-Pay-style checkmark overlay: `trigger` flips true
// the moment a submit handler resolves, we hold the overlay up for a beat,
// then flip `trigger` back to false (via setTrigger) so a later resubmit
// can fire it again.
export function useSuccessCheck(trigger, setTrigger, duration = 1700) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTrigger(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [trigger, setTrigger, duration]);

  return show;
}

export function SuccessCheckOverlay({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="success-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-white/50 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 shadow-xl"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10">
              <motion.path
                d="M5 13l4 4L19 7"
                fill="none"
                stroke="white"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContactsWindow({
  isOpen,
  onClose,
  contactSent,
  setContactSent,
  bookingSent,
  setBookingSent,
  getWindowProps,
}) {
  const [activeTab, setActiveTab] = useState("book");
  const showSuccess = useSuccessCheck(contactSent, setContactSent);

  if (!isOpen) return null;


  return (
    <Rnd
      {...getWindowProps}
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
            onClick={onClose}
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

        <div className="relative flex min-h-0 flex-1 bg-zinc-100 text-zinc-900">
          <aside
            role="tablist"
            aria-label="Mail sections"
            className="hidden w-40 shrink-0 border-r border-zinc-200 bg-zinc-50/90 p-3 text-sm text-zinc-600 sm:block"
          >
            <img
              src={tripodVawnLogo}
              alt="Tripod Vawn"
              className="mb-4 h-36 w-36 rounded object-contain"
            />
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

          <main className="min-w-0 flex-1 overflow-auto p-5">
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

          <SuccessCheckOverlay show={showSuccess} />
        </div>
      </motion.div>
    </Rnd>
  );
}

export function BookShootForm({ bookingSent, setBookingSent }) {
  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl font-semibold tracking-normal">Book a Shoot</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fill it out and it goes straight to my inbox.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => handleBookingSubmit(event, setBookingSent)}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Name
          </span>
          <input
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Email
          </span>
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


        <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Your Budget
        </span>
        <fieldset className="space-y-3 rounded-lg border border-zinc-300 bg-white/90 p-4 text-sm text-zinc-700">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="budget"
              value="$450-$900"
              required
              className="h-4 w-4 accent-blue-600"
            />
            $450-$900
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="budget"
              value="$900-$1,350"
              className="h-4 w-4 accent-blue-600"
            />
            $900-$1,350
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="budget"
              value="$1,350-2,000"
              className="h-4 w-4 accent-blue-600"
            />
            $1,350-2,000
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="budget"
              value="$2,000+"
              className="h-4 w-4 accent-blue-600"
            />
            $2,000+
          </label>
        </fieldset>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Your Instagram
          </span>
          <input
            name="instagram"
            required
            placeholder="@yourhandle"
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
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Send Message
          </button>
        </div>
      </form>
    </>
  );
}

export function GeneralInquiriesForm({ onSubmit }) {
  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl font-semibold tracking-normal">
          General Inquiries
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Send a note about your project, date, and location.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Email
          </span>
          <input
            name="email"
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
            name="subject"
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
            name="message"
            required
            rows={7}
            placeholder="Tell me what you are imagining."
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Send Message
          </button>
        </div>
      </form>
    </>
  );
}

export default ContactsWindow;
