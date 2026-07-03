import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ICON_SIZE } from "../constants";

const MAX_SIZE = 128;
const MAGNIFY_RANGE = 140;

function DockIcon({ item, mouseX, magnify, baseSize, onLaunch }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || x === Infinity) return MAGNIFY_RANGE;
    return x - (bounds.x + bounds.width / 2);
  });

  const sizeTarget = useTransform(distance, (d) => {
    if (!magnify) return baseSize;
    const clamped = Math.min(Math.abs(d), MAGNIFY_RANGE);
    const factor = Math.cos((clamped / MAGNIFY_RANGE) * (Math.PI / 2));
    return baseSize + (MAX_SIZE - baseSize) * factor;
  });

  const size = useSpring(sizeTarget, {
    mass: 0.1,
    stiffness: 320,
    damping: 18,
  });

  const handleClick = () => {
    if (!item.isOpen) {
      setBouncing(true);
    }
    onLaunch(item);
  };

  return (
    <div className="relative flex flex-col items-center justify-end">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1 }}
            className="dock-tooltip pointer-events-none absolute -top-9"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        type="button"
        aria-label={item.label}
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={{ width: size, height: size }}
        animate={bouncing ? { y: [0, -34, 0, -16, 0] } : { y: 0 }}
        transition={
          bouncing
            ? { duration: 0.7, ease: "easeOut", times: [0, 0.3, 0.6, 0.8, 1] }
            : undefined
        }
        onAnimationComplete={() => setBouncing(false)}
        className="relative flex cursor-pointer items-end justify-center"
      >
        {item.icon ? (
          <img
            src={item.icon}
            alt=""
            draggable={false}
            className={`dock-icon-img h-full w-full select-none object-contain object-center drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)] ${
              item.iconClassName ?? ""
            }`}
          />
        ) : (
          item.iconNode
        )}
      </motion.button>

      <span
        className={`dock-indicator absolute -bottom-[7px] transition-opacity duration-200 ${
          item.isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function Dock({ items, isMobile, onLaunch }) {
  const mouseX = useMotionValue(Infinity);
  const magnify = !isMobile;
  const baseSize = isMobile ? ICON_SIZE.mobile : ICON_SIZE.desktop;

  return (
    <div className="absolute inset-x-0 bottom-0 z-[8000] flex justify-center">
      <motion.div
        onMouseMove={(e) => magnify && mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="dock-shelf flex items-end gap-1.5 rounded-t-2xl px-2.5 pb-2.5 pt-2 sm:gap-3 sm:px-4"
      >
        {items.map((item) =>
          item.divider ? (
            <div
              key="divider"
              className="mx-0.5 h-10 w-px self-end bg-black/20 shadow-[1px_0_0_rgba(255,255,255,0.3)] sm:h-12"
            />
          ) : (
            <DockIcon
              key={item.id}
              item={item}
              mouseX={mouseX}
              magnify={magnify}
              baseSize={baseSize}
              onLaunch={onLaunch}
            />
          ),
        )}
      </motion.div>
    </div>
  );
}

export default Dock;
