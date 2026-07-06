import { useCallback, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

// ── game logic ──────────────────────────────────────────────────────────────

function emptyGrid() {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

function addRandom(grid) {
  const g = grid.map((r) => [...r]);
  const empties = [];
  g.forEach((row, r) => row.forEach((v, c) => { if (!v) empties.push([r, c]); }));
  if (!empties.length) return g;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
  return g;
}

function initGame() {
  let g = emptyGrid();
  g = addRandom(g);
  g = addRandom(g);
  return { grid: g, score: 0, best: 0, over: false, won: false };
}

function slideRow(row) {
  const nums = row.filter(Boolean);
  let gained = 0;
  const merged = [];
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      merged.push(nums[i] * 2);
      gained += nums[i] * 2;
      i += 2;
    } else {
      merged.push(nums[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { row: merged, gained };
}

function moveGrid(grid, dir) {
  let g = grid.map((r) => [...r]);
  let gained = 0;

  const rotateRight = (m) => m[0].map((_, i) => m.map((r) => r[i]).reverse());
  const rotateLeft  = (m) => m[0].map((_, i) => m.map((r) => r[r.length - 1 - i]));

  // normalise: always slide left, rotate to match direction
  if (dir === "right") g = rotateRight(rotateRight(g));
  if (dir === "up")    g = rotateLeft(g);
  if (dir === "down")  g = rotateRight(g);

  g = g.map((row) => {
    const res = slideRow(row);
    gained += res.gained;
    return res.row;
  });

  if (dir === "right") g = rotateRight(rotateRight(g));
  if (dir === "up")    g = rotateRight(g);
  if (dir === "down")  g = rotateLeft(g);

  return { grid: g, gained };
}

function gridsEqual(a, b) {
  return a.every((row, r) => row.every((v, c) => v === b[r][c]));
}

function isOver(grid) {
  if (grid.some((r) => r.some((v) => !v))) return false;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
    }
  return true;
}

// ── tile colours ─────────────────────────────────────────────────────────────

const TILE_STYLE = {
  0:    { bg: "#cdc1b4", text: "transparent" },
  2:    { bg: "#eee4da", text: "#776e65" },
  4:    { bg: "#ede0c8", text: "#776e65" },
  8:    { bg: "#f2b179", text: "#f9f6f2" },
  16:   { bg: "#f59563", text: "#f9f6f2" },
  32:   { bg: "#f67c5f", text: "#f9f6f2" },
  64:   { bg: "#f65e3b", text: "#f9f6f2" },
  128:  { bg: "#edcf72", text: "#f9f6f2" },
  256:  { bg: "#edcc61", text: "#f9f6f2" },
  512:  { bg: "#edc850", text: "#f9f6f2" },
  1024: { bg: "#edc53f", text: "#f9f6f2" },
  2048: { bg: "#edc22e", text: "#f9f6f2" },
};

function tileStyle(v) {
  return TILE_STYLE[v] ?? { bg: "#3c3a32", text: "#f9f6f2" };
}

function fontSize(v) {
  if (v >= 1000) return "text-lg";
  if (v >= 100)  return "text-xl";
  return "text-2xl";
}

// ── component ─────────────────────────────────────────────────────────────────

export default function Game2048Window({ isOpen, onClose, getWindowProps }) {
  const [state, setState] = useState(() => initGame());
  const touchStart = useRef(null);
  const gameAreaRef = useRef(null);

  const move = useCallback((dir) => {
    setState((prev) => {
      if (prev.over) return prev;
      const { grid: newGrid, gained } = moveGrid(prev.grid, dir);
      if (gridsEqual(newGrid, prev.grid)) return prev;
      const withNew = addRandom(newGrid);
      const newScore = prev.score + gained;
      const won = withNew.some((r) => r.some((v) => v === 2048));
      return {
        grid: withNew,
        score: newScore,
        best: Math.max(prev.best, newScore),
        over: isOver(withNew),
        won,
      };
    });
  }, []);

  const restart = useCallback(() => setState((prev) => ({ ...initGame(), best: prev.best })), []);

  // keyboard
  useEffect(() => {
    if (!isOpen) return;
    const MAP = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
    const onKey = (e) => {
      const dir = MAP[e.key];
      if (!dir) return;
      e.preventDefault();
      move(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, move]);

  // touch swipe
  // Native non-passive touch listeners so we can preventDefault and stop
  // Safari from scrolling/panning the page while swiping on the board.
  useEffect(() => {
    const el = gameAreaRef.current;
    if (!el) return;

    const onStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    };
    const onMove = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onEnd = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      touchStart.current = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
      else move(dy > 0 ? "down" : "up");
    };

    const opts = { passive: false };
    el.addEventListener("touchstart", onStart, opts);
    el.addEventListener("touchmove", onMove, opts);
    el.addEventListener("touchend", onEnd, opts);
    return () => {
      el.removeEventListener("touchstart", onStart, opts);
      el.removeEventListener("touchmove", onMove, opts);
      el.removeEventListener("touchend", onEnd, opts);
    };
  }, [move]);

  if (!isOpen) return null;

  const { grid, score, best, over, won } = state;

  return (
    <Rnd {...getWindowProps} dragHandleClassName="g2048-title-bar" cancel=".window-control, .g2048-board">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-[#faf8ef] shadow-2xl"
      >
        {/* Title bar */}
        <div className="g2048-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-black/10 bg-[#bbada0] px-4 active:cursor-grabbing">
          <button type="button" aria-label="Close 2048" onClick={onClose}
            className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400" />
          <button type="button" aria-label="Minimize"
            className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50" />
          <button type="button" aria-label="Zoom"
            className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50" />
          <div className="ml-3 text-sm font-bold text-white">2048</div>
          <div className="ml-auto flex gap-2 text-xs font-bold">
            <span className="rounded bg-[#bbada0] border border-white/20 px-2 py-0.5 text-white">SCORE <span className="text-yellow-200">{score}</span></span>
            <span className="rounded bg-[#bbada0] border border-white/20 px-2 py-0.5 text-white">BEST <span className="text-yellow-200">{best}</span></span>
          </div>
        </div>

        {/* Game area */}
        <div
          ref={gameAreaRef}
          className="g2048-board relative flex flex-1 flex-col items-center justify-center gap-4 bg-[#faf8ef] p-4 select-none"
        >
          {/* Board */}
          <div
            className="grid gap-2 rounded-lg p-2"
            style={{
              background: "#bbada0",
              gridTemplateColumns: "repeat(4, 1fr)",
              width: "min(100%, 280px)",
              aspectRatio: "1",
            }}
          >
            {grid.flat().map((v, i) => {
              const { bg, text } = tileStyle(v);
              return (
                <div
                  key={i}
                  className={`flex items-center justify-center rounded-md font-bold ${fontSize(v)} transition-all duration-100`}
                  style={{ background: bg, color: text, aspectRatio: "1" }}
                >
                  {v !== 0 ? v : ""}
                </div>
              );
            })}
          </div>

          {/* D-pad controls */}
          <div className="flex flex-col items-center gap-1">
            <button type="button" onClick={() => move("up")}
              className="w-12 h-12 rounded-xl bg-[#bbada0] text-white text-xl font-bold hover:bg-[#a89890] active:bg-[#9a8880] transition-colors flex items-center justify-center">
              ▲
            </button>
            <div className="flex gap-1">
              <button type="button" onClick={() => move("left")}
                className="w-12 h-12 rounded-xl bg-[#bbada0] text-white text-xl font-bold hover:bg-[#a89890] active:bg-[#9a8880] transition-colors flex items-center justify-center">
                ◀
              </button>
              <button type="button" onClick={() => move("down")}
                className="w-12 h-12 rounded-xl bg-[#bbada0] text-white text-xl font-bold hover:bg-[#a89890] active:bg-[#9a8880] transition-colors flex items-center justify-center">
                ▼
              </button>
              <button type="button" onClick={() => move("right")}
                className="w-12 h-12 rounded-xl bg-[#bbada0] text-white text-xl font-bold hover:bg-[#a89890] active:bg-[#9a8880] transition-colors flex items-center justify-center">
                ▶
              </button>
            </div>
          </div>

          {/* New game button */}
          <button
            type="button"
            onClick={restart}
            className="rounded-lg bg-[#8f7a66] px-5 py-1.5 text-sm font-bold text-white hover:bg-[#7a6858] transition-colors"
          >
            New Game
          </button>

          {/* Overlays */}
          {(over || won) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-[#faf8ef]/80 backdrop-blur-sm">
              <p className="text-3xl font-bold" style={{ color: won ? "#f9c22e" : "#776e65" }}>
                {won ? "You win!" : "Game over!"}
              </p>
              <p className="text-sm text-[#776e65]">Score: {score}</p>
              <button
                type="button"
                onClick={restart}
                className="rounded-lg bg-[#8f7a66] px-6 py-2 text-sm font-bold text-white hover:bg-[#7a6858] transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </Rnd>
  );
}
