import { useEffect, useRef, useState, useCallback } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

const CELL = 20;
const COLS = 20;
const ROWS = 18;
const W = CELL * COLS;
const H = CELL * ROWS;
const TICK = 120;

const DIR = { UP: [0,-1], DOWN: [0,1], LEFT: [-1,0], RIGHT: [1,0] };

function rand() {
  return [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)];
}

function newFood(snake) {
  let f;
  do { f = rand(); } while (snake.some(([x,y]) => x === f[0] && y === f[1]));
  return f;
}

function initState() {
  const snake = [[10,9],[9,9],[8,9]];
  return { snake, dir: DIR.RIGHT, next: DIR.RIGHT, food: newFood(snake), dead: false, score: 0 };
}

export default function SnakeWindow({ isOpen, onClose, getWindowProps }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(initState());
  const tickRef = useRef(null);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { snake, food } = stateRef.current;

    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(0, 0, W, H);

    // grid dots
    ctx.fillStyle = "#1a1a1a";
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + CELL/2 - 1, y * CELL + CELL/2 - 1, 2, 2);

    // food
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.roundRect(food[0]*CELL+2, food[1]*CELL+2, CELL-4, CELL-4, 4);
    ctx.fill();

    // snake
    snake.forEach(([x,y], i) => {
      ctx.fillStyle = i === 0 ? "#4ade80" : `hsl(${140 - i*2}, 70%, ${45 - i*0.5}%)`;
      ctx.beginPath();
      ctx.roundRect(x*CELL+1, y*CELL+1, CELL-2, CELL-2, i === 0 ? 5 : 3);
      ctx.fill();
    });
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.dead) return;
    const [dx, dy] = s.next;
    const [hx, hy] = s.snake[0];
    const nx = hx + dx, ny = hy + dy;

    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS || s.snake.some(([x,y]) => x === nx && y === ny)) {
      stateRef.current = { ...s, dead: true };
      setDead(true);
      draw();
      return;
    }

    const ate = nx === s.food[0] && ny === s.food[1];
    const newSnake = [[nx,ny], ...s.snake];
    if (!ate) newSnake.pop();
    const newScore = ate ? s.score + 1 : s.score;
    stateRef.current = { ...s, snake: newSnake, dir: s.next, food: ate ? newFood(newSnake) : s.food, score: newScore };
    if (ate) setScore(newScore);
    draw();
  }, [draw]);

  const restart = useCallback(() => {
    stateRef.current = initState();
    setScore(0);
    setDead(false);
    setStarted(true);
    draw();
  }, [draw]);

  // start/restart loop when started changes
  useEffect(() => {
    if (!started || dead) return;
    tickRef.current = setInterval(tick, TICK);
    return () => clearInterval(tickRef.current);
  }, [started, dead, tick]);

  // keyboard
  useEffect(() => {
    if (!isOpen) return;
    const MAP = {
      ArrowUp: DIR.UP, ArrowDown: DIR.DOWN, ArrowLeft: DIR.LEFT, ArrowRight: DIR.RIGHT,
      w: DIR.UP, s: DIR.DOWN, a: DIR.LEFT, d: DIR.RIGHT,
    };
    const onKey = (e) => {
      const d = MAP[e.key];
      if (!d) return;
      e.preventDefault();
      const cur = stateRef.current.dir;
      if (d[0] === -cur[0] && d[1] === -cur[1]) return; // no 180
      stateRef.current = { ...stateRef.current, next: d };
      if (!started) { setStarted(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, started]);

  // draw on open
  useEffect(() => { if (isOpen) draw(); }, [isOpen, draw]);

  if (!isOpen) return null;

  return (
    <Rnd {...getWindowProps} dragHandleClassName="snake-title-bar" cancel=".window-control">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-zinc-950 shadow-2xl"
      >
        {/* Title bar */}
        <div className="snake-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-white/10 bg-zinc-900 px-4 active:cursor-grabbing">
          <button type="button" aria-label="Close Snake" onClick={onClose}
            className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400" />
          <button type="button" aria-label="Minimize"
            className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50" />
          <button type="button" aria-label="Zoom"
            className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50" />
          <div className="ml-3 text-sm font-medium text-white/85">Snake</div>
          <div className="ml-auto text-sm font-mono text-green-400">Score: {score}</div>
        </div>

        {/* Game area */}
        <div className="relative flex flex-1 items-center justify-center bg-zinc-950">
          <canvas ref={canvasRef} width={W} height={H} className="block" />

          {!started && !dead && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-950/80">
              <div className="text-4xl">🐍</div>
              <p className="text-white/70 text-sm">Arrow keys or WASD to move</p>
              <button onClick={restart}
                className="rounded-lg bg-green-500 px-6 py-2 text-sm font-semibold text-black hover:bg-green-400 transition-colors">
                Start Game
              </button>
            </div>
          )}

          {dead && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-950/85">
              <p className="text-2xl font-bold text-white">Game Over</p>
              <p className="text-white/60 text-sm">Score: {score}</p>
              <button onClick={restart}
                className="rounded-lg bg-green-500 px-6 py-2 text-sm font-semibold text-black hover:bg-green-400 transition-colors">
                Play Again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </Rnd>
  );
}
