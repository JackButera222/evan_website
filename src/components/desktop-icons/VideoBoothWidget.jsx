import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import photoBoothIcon from "../../assets/photobooth-icon.svg";

// Draggable desktop widget that opens the Video Booth. Rendered among the
// desktop icons (before the windows) so it stacks behind any open window,
// like a normal macOS desktop widget.
function VideoBoothWidget({ placement, viewport, onClick }) {
  const { x, y, width, height } = placement;
  const [pos, setPos] = useState({ x, y });
  const [dragging, setDragging] = useState(false);
  const wasDraggedRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });

  // Re-anchor when the viewport changes (resize or mobile/desktop switch).
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
        aria-label="Enter the Video Booth"
        onPointerDown={(event) => {
          pointerStartRef.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const deltaX = event.clientX - pointerStartRef.current.x;
          const deltaY = event.clientY - pointerStartRef.current.y;
          if (!wasDraggedRef.current && Math.hypot(deltaX, deltaY) <= 6) onClick();
        }}
        className={`flex h-full w-full touch-none cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-3xl border border-white/20 bg-zinc-900/50 px-5 py-4 text-center text-white shadow-2xl backdrop-blur-xl transition-transform duration-200 ease-out ${
          dragging ? "rotate-2 scale-105" : "hover:scale-[1.03]"
        }`}
      >
        <img
          src={photoBoothIcon}
          alt=""
          aria-hidden="true"
          className="pointer-events-none h-12 w-12 drop-shadow-lg"
        />
        <div>
          <div className="text-sm font-semibold leading-tight">Enter the Video Booth</div>
          <div className="mt-0.5 text-[11px] leading-tight text-white/65">
            Click here to view example videos
          </div>
        </div>
      </button>
    </Rnd>
  );
}

export default VideoBoothWidget;
