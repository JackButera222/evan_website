import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Battery, Search, Wifi } from "lucide-react";
import AppleLogo from "./AppleLogo";
import Spotlight from "./Spotlight";

function MenuBar({ now, menus, spotlightItems, isMobile }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const barRef = useRef(null);

  // Close menus on outside click / escape
  useEffect(() => {
    if (!openMenu) return undefined;
    const onPointerDown = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const menuDateTime = now.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const visibleMenus = isMobile ? menus.slice(0, 2) : menus;

  return (
    <div
      ref={barRef}
      className="menu-bar absolute inset-x-0 top-0 z-[9000] flex h-7 items-stretch justify-between pl-1 pr-2 text-[13px]"
    >
      <div className="flex min-w-0 items-stretch">
        {visibleMenus.map((menu) => {
          const isApple = menu.id === "apple";
          const isOpenNow = openMenu === menu.id;
          return (
            <div key={menu.id} className="relative flex items-stretch">
              <button
                type="button"
                className={`menu-trigger ${isOpenNow ? "open" : ""} ${
                  menu.bold ? "font-bold" : ""
                }`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  setOpenMenu(isOpenNow ? null : menu.id);
                }}
                onPointerEnter={() => {
                  if (openMenu && !isOpenNow) setOpenMenu(menu.id);
                }}
              >
                {isApple ? (
                  <AppleLogo className="h-[15px] w-[15px] translate-y-[-1px]" />
                ) : (
                  menu.label
                )}
              </button>

              <AnimatePresence>
                {isOpenNow && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.08 }}
                    className="menu-dropdown absolute left-0 top-full"
                  >
                    {menu.items.map((item, i) =>
                      item.separator ? (
                        <div key={`sep-${i}`} className="menu-separator" />
                      ) : (
                        <button
                          key={item.label}
                          type="button"
                          className={`menu-item ${item.disabled ? "disabled" : ""}`}
                          disabled={item.disabled}
                          onClick={() => {
                            setOpenMenu(null);
                            item.action?.();
                          }}
                        >
                          <span>{item.label}</span>
                          {item.shortcut && (
                            <span className="text-[12px] opacity-50">
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      ),
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {!isMobile && (
          <>
            <span className="flex h-full items-center px-2 text-white/85">
              <Battery className="h-[17px] w-[17px]" strokeWidth={1.7} />
            </span>
            <span className="flex h-full items-center px-2 text-white/85">
              <Wifi className="h-[15px] w-[15px]" strokeWidth={2} />
            </span>
          </>
        )}
        <button
          type="button"
          aria-label="Spotlight"
          className={`menu-trigger ${spotlightOpen ? "open" : ""}`}
          onClick={() => setSpotlightOpen((v) => !v)}
        >
          <Search className="h-[14px] w-[14px]" strokeWidth={2.5} />
        </button>
        <time
          className="menu-trigger shrink-0 tabular-nums"
          dateTime={now.toISOString()}
        >
          {menuDateTime}
        </time>
      </div>

      <Spotlight
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        items={spotlightItems}
      />
    </div>
  );
}

export default MenuBar;
