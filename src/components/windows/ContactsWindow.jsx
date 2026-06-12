import { useState } from "react";
import { Camera, Send } from "lucide-react";
import Window from "../Window";
import tripodVawnLogo from "../../assets/TRIPOD VAWN LOGO V3.png";
import { handleBookingSubmit } from "../../utils/handlers";

const tabs = [
  { id: "book", label: "Book a Shoot", icon: Camera },
  { id: "general", label: "General Inquiries", icon: Send },
];

function ContactsWindow({
  windowProps,
  contactSent,
  setContactSent,
  bookingSent,
  setBookingSent,
}) {
  const [activeTab, setActiveTab] = useState("book");

  function handleContactSubmit(event) {
    event.preventDefault();
    setContactSent(true);
  }

  return (
    <Window
      title="Mail"
      {...windowProps}
      dragCancel="input, textarea, button, .aqua-scroll"
    >
      <div className="flex min-h-0 flex-1 bg-[#fbfbfb] text-zinc-900">
        <aside
          role="tablist"
          aria-label="Mail sections"
          className="aqua-sidebar hidden w-44 shrink-0 p-3 text-sm sm:block"
        >
          <img
            src={tripodVawnLogo}
            alt="Tripod Vawn"
            className="mx-auto mb-3 h-28 w-28 rounded object-contain mix-blend-multiply"
          />
          <div className="aqua-sidebar-heading">Mailboxes</div>
          <div className="space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`aqua-sidebar-item ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >
                <tab.icon className="h-4 w-4 shrink-0 opacity-75" />
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="aqua-scroll min-w-0 flex-1 overflow-auto p-5">
          <div
            role="tablist"
            aria-label="Mail sections"
            className="mb-4 flex flex-wrap gap-1.5 text-sm sm:hidden"
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
                    ? "rounded-full bg-[#3875d7] px-3 py-1 text-xs font-semibold text-white"
                    : "rounded-full px-3 py-1 text-xs text-zinc-600"
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
              contactSent={contactSent}
              onSubmit={handleContactSubmit}
            />
          )}
        </main>
      </div>
    </Window>
  );
}

function FieldLabel({ children }) {
  return (
    <span className="mb-1.5 block text-[13px] font-semibold text-zinc-700">
      {children}
    </span>
  );
}

function RadioRow({ name, value, required }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="radio"
        name={name}
        value={value}
        required={required}
        className="h-4 w-4 accent-[#2c5fd1]"
      />
      {value}
    </label>
  );
}

function BookShootForm({ bookingSent, setBookingSent }) {
  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight">Book a Shoot</h1>
        <p className="mt-1 text-[13px] text-zinc-500">
          Tell me about your project — this opens a ready-to-send email.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => handleBookingSubmit(event, setBookingSent)}
      >
        <label className="block">
          <FieldLabel>Name</FieldLabel>
          <input
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="aqua-field"
          />
        </label>

        <label className="block">
          <FieldLabel>Email</FieldLabel>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="aqua-field"
          />
        </label>

        <div>
          <FieldLabel>What type of shoot are you interested in?</FieldLabel>
          <fieldset className="space-y-2.5 rounded-lg border border-zinc-300 bg-white p-4 text-[13px] text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
            <RadioRow
              name="shootType"
              value="Short Form Content Shoot"
              required
            />
            <RadioRow name="shootType" value="Full Music Video Shoot" />
          </fieldset>
        </div>

        <div>
          <FieldLabel>Your budget</FieldLabel>
          <fieldset className="space-y-2.5 rounded-lg border border-zinc-300 bg-white p-4 text-[13px] text-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
            <RadioRow name="budget" value="$450-$900" required />
            <RadioRow name="budget" value="$900-$1,350" />
            <RadioRow name="budget" value="$1,350-2,000" />
            <RadioRow name="budget" value="$2,000+" />
          </fieldset>
        </div>

        <label className="block">
          <FieldLabel>Link to your Instagram</FieldLabel>
          <input
            name="instagram"
            type="url"
            required
            placeholder="https://instagram.com/yourhandle"
            className="aqua-field"
          />
        </label>

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-[13px] font-medium text-green-700">
            {bookingSent ? "Email draft opened in your mail client." : ""}
          </p>
          <button type="submit" className="aqua-button">
            <Send className="h-3.5 w-3.5" />
            Send Request
          </button>
        </div>
      </form>
    </>
  );
}

function GeneralInquiriesForm({ contactSent, onSubmit }) {
  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight">General Inquiries</h1>
        <p className="mt-1 text-[13px] text-zinc-500">
          Send a note about your project, date, and location.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <FieldLabel>Email</FieldLabel>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="aqua-field"
          />
        </label>

        <label className="block">
          <FieldLabel>Subject</FieldLabel>
          <input
            type="text"
            required
            placeholder="Music video, short-form content, event..."
            className="aqua-field"
          />
        </label>

        <label className="block">
          <FieldLabel>Message</FieldLabel>
          <textarea
            required
            rows={7}
            placeholder="Tell me what you are imagining."
            className="aqua-field resize-none"
          />
        </label>

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-[13px] font-medium text-green-700">
            {contactSent ? "Message ready. Thanks for reaching out." : ""}
          </p>
          <button type="submit" className="aqua-button">
            <Send className="h-3.5 w-3.5" />
            Send Message
          </button>
        </div>
      </form>
    </>
  );
}

export default ContactsWindow;
