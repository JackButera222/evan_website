import { ExternalLink, Folder, Star } from "lucide-react";
import Window from "../Window";
import { socialLinks } from "../../constants";

function FinderWindow({ windowProps }) {
  return (
    <Window title="Socials" {...windowProps} dragCancel="a, .aqua-scroll">
      <div className="flex min-h-0 flex-1 bg-[#fbfbfb] text-zinc-900">
        <aside className="aqua-sidebar hidden w-40 shrink-0 p-3 text-sm sm:block">
          <div className="aqua-sidebar-heading">Places</div>
          <div className="space-y-0.5">
            <div className="aqua-sidebar-item active">
              <Star className="h-4 w-4 shrink-0" />
              Socials
            </div>
            <div className="aqua-sidebar-item">
              <Folder className="h-4 w-4 shrink-0 text-[#62a8e8]" />
              Bookings
            </div>
            <div className="aqua-sidebar-item">
              <Folder className="h-4 w-4 shrink-0 text-[#62a8e8]" />
              Press Kit
            </div>
          </div>
        </aside>

        <main className="aqua-scroll min-w-0 flex-1 overflow-auto">
          <div className="grid grid-cols-[1fr_78px] border-b border-zinc-300 bg-gradient-to-b from-[#f7f7f7] to-[#e8e8e8] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-zinc-500 sm:grid-cols-[1fr_170px_78px]">
            <div>Name</div>
            <div className="hidden sm:block">Account</div>
            <div className="text-right">Link</div>
          </div>

          <div>
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  social.href.startsWith("mailto:") ? undefined : "noreferrer"
                }
                className={`grid grid-cols-[1fr_78px] items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-[#3875d7] hover:text-white sm:grid-cols-[1fr_170px_78px] ${
                  index % 2 === 1 ? "bg-[#f0f4fa]" : "bg-white"
                } group`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm ${social.gradient}`}
                  >
                    <social.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{social.name}</div>
                    <div className="truncate text-xs text-zinc-500 group-hover:text-white/80 sm:hidden">
                      {social.detail}
                    </div>
                  </div>
                </div>
                <div className="hidden truncate text-zinc-500 group-hover:text-white/80 sm:block">
                  {social.detail}
                </div>
                <div className="flex justify-end text-[#2c5fd1] group-hover:text-white">
                  <ExternalLink className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </main>
      </div>
    </Window>
  );
}

export default FinderWindow;
