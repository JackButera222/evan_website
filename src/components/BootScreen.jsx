import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppleLogo from "./AppleLogo";

const SPOKES = Array.from({ length: 12 }, (_, i) => i);

function BootScreen({ booting, onDone }) {
  const [visible, setVisible] = useState(booting);
  const [lastBooting, setLastBooting] = useState(booting);

  // Re-show on restart: adjust state during render when the prop flips
  if (booting !== lastBooting) {
    setLastBooting(booting);
    if (booting) setVisible(true);
  }

  useEffect(() => {
    if (!visible) return undefined;
    const t = window.setTimeout(() => setVisible(false), 2400);
    return () => window.clearTimeout(t);
  }, [visible]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[20000] flex cursor-pointer flex-col items-center justify-center gap-14 bg-[radial-gradient(circle_at_50%_38%,#d6d6d6,#a9a9a9_75%)]"
        >
          <AppleLogo className="h-24 w-24 text-[#4a4a4a] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]" />
          <div className="boot-spinner" aria-label="Loading">
            {SPOKES.map((i) => (
              <span
                key={i}
                style={{
                  transform: `rotate(${i * 30}deg)`,
                  animationDelay: `${-1 + i / 12}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BootScreen;
