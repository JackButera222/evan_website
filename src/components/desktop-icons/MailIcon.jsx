import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import mailIcon from "../../assets/mail.png";

function MailIcon({ placement, viewport, onClick }) {
  const { x, y, width, height, iconSize } = placement;
  const [pos, setPos] = useState({ x, y });
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
      onDragStart={() => { wasDraggedRef.current = false; }}
      onDrag={(_event, data) => {
        if (Math.hypot(data.x - pos.x, data.y - pos.y) > 8) wasDraggedRef.current = true;
      }}
      onDragStop={(_event, data) => setPos({ x: data.x, y: data.y })}
    >
      <button
        type="button"
        aria-label="Open hit me up"
        onPointerDown={(e) => { pointerStartRef.current = { x: e.clientX, y: e.clientY }; }}
        onPointerUp={(e) => {
          const dx = e.clientX - pointerStartRef.current.x;
          const dy = e.clientY - pointerStartRef.current.y;
          if (!wasDraggedRef.current && Math.hypot(dx, dy) <= 8) onClick();
        }}
        className="flex h-full w-full touch-none cursor-pointer select-none flex-col items-center justify-start gap-1 text-white transition-transform duration-150 hover:scale-110"
      >
        <span className="relative drop-shadow-xl" style={{ width: iconSize, height: iconSize }}>
          <img src={mailIcon} alt="" aria-hidden="true" className="pointer-events-none h-full w-full object-contain" />
        </span>
        <span className="w-full px-1 text-center text-xs font-semibold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          hit me up
        </span>
      </button>
    </Rnd>
  );
}

export default MailIcon;
