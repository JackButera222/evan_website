import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import contentPack from "../../assets/content-pack-logo-square.png";

function CheckoutIcon({ placement, viewport, onClick }) {
  const { x, y, width, height, iconSize } = placement;
  const [pos, setPos] = useState({ x, y });
  const wasDraggedRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });

  // Re-anchor whenever the viewport changes (window resize or a switch between
  // the mobile and desktop layouts), so the icon never ends up overlapping the
  // QuickTime player or sitting off-screen. Adjusting state during render is
  // React's recommended way to reset state on a prop change. Clock ticks don't
  // change the viewport, so a dragged position is preserved until a resize.
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
      onDragStart={() => {
        wasDraggedRef.current = false;
      }}
      onDrag={(_event, data) => {
        if (Math.hypot(data.x - pos.x, data.y - pos.y) > 8) {
          wasDraggedRef.current = true;
        }
      }}
      onDragStop={(_event, data) => setPos({ x: data.x, y: data.y })}
    >
      <button
        type="button"
        aria-label="Open Checkout"
        onPointerDown={(event) => {
          pointerStartRef.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const deltaX = event.clientX - pointerStartRef.current.x;
          const deltaY = event.clientY - pointerStartRef.current.y;
          if (!wasDraggedRef.current && Math.hypot(deltaX, deltaY) <= 8) {
            onClick();
          }
        }}
        className="flex h-full w-full touch-none cursor-pointer select-none flex-col items-center justify-start gap-1 text-white transition-transform duration-150 hover:scale-110"
      >
        <span
          className="relative drop-shadow-xl"
          style={{ width: iconSize, height: iconSize }}
        >
          <img
            src={contentPack}
            alt=""
            aria-hidden="true"
            className="pointer-events-none h-full w-full object-contain"
          />
        </span>
        <span className="w-full px-1 text-center text-xs font-semibold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          IAC Pack
        </span>
      </button>
    </Rnd>
  );
}

export default CheckoutIcon;
