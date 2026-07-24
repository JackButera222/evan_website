import { useRef, useState } from "react";
import { Rnd } from "react-rnd";

// Sticky note widget that opens the booking contact window.
// Sits among desktop icons, draggable, slightly tilted for a lived-in feel.
function BookingNote({ placement, viewport, onClick }) {
  const { x, y, width, height } = placement;
  const [pos, setPos] = useState({ x, y });
  const [dragging, setDragging] = useState(false);
  const wasDraggedRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });

  const [prevViewport, setPrevViewport] = useState(viewport);
  if (
    prevViewport.width !== viewport.width ||
    prevViewport.height !== viewport.height
  ) {
    setPrevViewport(viewport);
    setPos({ x, y });
  }

  return (
    <Rnd
      position={pos}
      size={{ width, height }}
      bounds=".desktop-drag-bounds"
      enableResizing={false}
      style={{ zIndex: dragging ? 500 : undefined }}
      onDragStart={() => {
        wasDraggedRef.current = false;
      }}
      onDrag={(_event, data) => {
        if (Math.hypot(data.x - pos.x, data.y - pos.y) > 6) {
          wasDraggedRef.current = true;
          setDragging(true);
        }
      }}
      onDragStop={(_event, data) => {
        setDragging(false);
        setPos({ x: data.x, y: data.y });
      }}
    >
      <button
        type="button"
        aria-label="Book a shoot"
        onPointerDown={(event) => {
          pointerStartRef.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const deltaX = event.clientX - pointerStartRef.current.x;
          const deltaY = event.clientY - pointerStartRef.current.y;
          if (!wasDraggedRef.current && Math.hypot(deltaX, deltaY) <= 6) onClick();
        }}
        className={`flex h-full w-full touch-none cursor-pointer select-none flex-col items-center justify-center rounded-sm bg-yellow-300 p-4 text-center font-handwriting text-xl font-bold text-yellow-900 shadow-2xl transition-transform duration-200 ease-out ${
          dragging ? "-rotate-3 scale-105 shadow-xl" : "hover:scale-105 -rotate-1"
        }`}
        style={{
          fontFamily: '"Comic Sans MS", cursive, sans-serif',
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          boxShadow: dragging
            ? "0 20px 25px -5px rgba(0,0,0,0.3), inset -2px 2px 4px rgba(0,0,0,0.1)"
            : "-2px 4px 8px rgba(0,0,0,0.2), inset -1px 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        📸<div className="mt-1">book me!!</div>
      </button>
    </Rnd>
  );
}

export default BookingNote;
