import { useRef } from "react";
import { Rnd } from "react-rnd";

/**
 * Draggable desktop icon. Distinguishes a click from a drag so the icon
 * can be repositioned without accidentally launching.
 */
function DesktopIcon({
  id,
  label,
  icon,
  iconClassName = "",
  defaultPosition,
  size = { width: 92, height: 102 },
  onOpen,
}) {
  const dragStartRef = useRef({ x: 0, y: 0 });
  const wasDraggedRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });

  return (
    <Rnd
      key={id}
      default={{ ...defaultPosition, ...size }}
      bounds=".desktop-drag-bounds"
      enableResizing={false}
      onDragStart={(_e, data) => {
        wasDraggedRef.current = false;
        dragStartRef.current = { x: data.x, y: data.y };
      }}
      onDrag={(_e, data) => {
        const dx = data.x - dragStartRef.current.x;
        const dy = data.y - dragStartRef.current.y;
        if (Math.hypot(dx, dy) > 8) wasDraggedRef.current = true;
      }}
    >
      <button
        type="button"
        aria-label={`Open ${label}`}
        onPointerDown={(e) => {
          pointerStartRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const dx = e.clientX - pointerStartRef.current.x;
          const dy = e.clientY - pointerStartRef.current.y;
          if (Math.hypot(dx, dy) <= 8 && !wasDraggedRef.current) onOpen();
          wasDraggedRef.current = false;
        }}
        className="desktop-icon flex h-full w-full touch-none cursor-pointer select-none flex-col items-center gap-1"
      >
        <span className="relative min-h-0 w-full flex-1 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]">
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={`pointer-events-none h-full w-full object-contain ${iconClassName}`}
          />
        </span>
        <span className="desktop-icon-label max-w-full truncate">{label}</span>
      </button>
    </Rnd>
  );
}

export default DesktopIcon;
