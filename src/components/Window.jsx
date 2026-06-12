import { useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

/**
 * Shared Aqua window chrome: draggable/resizable Rnd shell, Leopard-style
 * titlebar with glossy traffic lights, focus dimming, and open/close/minimize
 * animations. `variant="dark"` renders QuickTime X style chrome.
 */
function Window({
  title,
  isOpen,
  isMinimized = false,
  isFocused = true,
  zIndex = 100,
  onClose,
  onMinimize,
  onFocus,
  rndProps,
  variant = "light",
  dragCancel = "",
  children,
}) {
  const [closing, setClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => setClosing(true);

  const animate = closing
    ? { opacity: 0, scale: 0.9, y: 14 }
    : isMinimized
      ? { opacity: 0, scale: 0.08, y: window.innerHeight }
      : { opacity: 1, scale: 1, y: 0 };

  return (
    <Rnd
      {...rndProps}
      style={{ zIndex, pointerEvents: isMinimized ? "none" : "auto" }}
      dragHandleClassName="window-titlebar"
      cancel={`.window-control${dragCancel ? `, ${dragCancel}` : ""}`}
      disableDragging={isMinimized || rndProps?.disableDragging}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={animate}
        transition={
          isMinimized || (!closing && !isMinimized)
            ? { duration: 0.28, ease: [0.32, 0.72, 0, 1] }
            : { duration: 0.16, ease: "easeIn" }
        }
        onAnimationComplete={() => {
          if (closing) {
            setClosing(false);
            onClose?.();
          }
        }}
        style={{ transformOrigin: "bottom center" }}
        className={`aqua-window flex h-full w-full flex-col ${
          variant === "dark" ? "qt-dark" : ""
        } ${isFocused ? "" : "is-inactive"}`}
      >
        <div className="window-titlebar aqua-titlebar relative flex h-[26px] shrink-0 touch-none cursor-grab items-center px-2.5 active:cursor-grabbing">
          <div className="traffic-lights flex items-center gap-2">
            <button
              type="button"
              aria-label={`Close ${title}`}
              onClick={handleClose}
              className="window-control traffic-light red"
            >
              <span className="glyph">×</span>
            </button>
            <button
              type="button"
              aria-label={`Minimize ${title}`}
              onClick={onMinimize}
              className="window-control traffic-light yellow"
            >
              <span className="glyph">−</span>
            </button>
            <button
              type="button"
              aria-label={`Zoom ${title}`}
              className="window-control traffic-light green"
            >
              <span className="glyph">+</span>
            </button>
          </div>
          <div className="aqua-titlebar-title pointer-events-none absolute inset-x-0 text-center">
            {title}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </motion.div>
    </Rnd>
  );
}

export default Window;
