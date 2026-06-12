import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";

function Spotlight({ isOpen, onClose, items }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Clear the previous search when reopened
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (isOpen) setQuery("");
  }

  useEffect(() => {
    if (isOpen) {
      // Wait for the panel to mount before focusing
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.includes(q)),
    );
  }, [items, query]);

  const run = (item) => {
    onClose();
    item.action();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.12 }}
          className="absolute right-1 top-full mt-1 w-[300px] max-w-[calc(100vw-16px)] overflow-hidden rounded-lg border border-black/20 bg-[#f5f5f5] shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-black/10 px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-zinc-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && results[0]) run(results[0]);
              }}
              placeholder="Spotlight"
              className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
            />
          </div>
          <div className="max-h-72 overflow-auto py-1">
            {results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-zinc-500">No results</div>
            ) : (
              results.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => run(item)}
                  className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px] text-zinc-800 hover:bg-[#3875d7] hover:text-white"
                >
                  <item.icon className="h-4 w-4 shrink-0 opacity-70" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="shrink-0 text-[11px] opacity-50">
                    {item.kind}
                  </span>
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Spotlight;
