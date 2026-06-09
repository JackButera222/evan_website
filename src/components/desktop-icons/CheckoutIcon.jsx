import { Rnd } from "react-rnd";
import contentPack from "../../assets/content-pack-logo-square.png";

function CheckoutIcon({
  layout,
  isMobile,
  getDefaultPosition,
  viewportSize,
  onClick,
  checkoutDragStartRef,
  checkoutPointerStartRef,
  checkoutWasDraggedRef,
}) {
  return (
    <Rnd
      key={isMobile ? "mobile-checkout" : "desktop-checkout"}
      default={getDefaultPosition(layout.checkout, viewportSize)}
      bounds=".desktop-drag-bounds"
      disableDragging={false}
      enableResizing={false}
      onDragStart={(_event, data) => {
        checkoutWasDraggedRef.current = false;
        checkoutDragStartRef.current = { x: data.x, y: data.y };
      }}
      onDrag={(_event, data) => {
        const deltaX = data.x - checkoutDragStartRef.current.x;
        const deltaY = data.y - checkoutDragStartRef.current.y;

        if (Math.hypot(deltaX, deltaY) > 8) {
          checkoutWasDraggedRef.current = true;
        }
      }}
    >
      <button
        type="button"
        aria-label="Open Checkout"
        onPointerDown={(event) => {
          checkoutPointerStartRef.current = {
            x: event.clientX,
            y: event.clientY,
          };
        }}
        onPointerUp={(event) => {
          const deltaX = event.clientX - checkoutPointerStartRef.current.x;
          const deltaY = event.clientY - checkoutPointerStartRef.current.y;

          if (Math.hypot(deltaX, deltaY) <= 8) {
            onClick();
          }
        }}
        className="flex h-full w-full touch-none cursor-pointer select-none flex-col items-center justify-center gap-1 text-white transition-transform duration-150 hover:scale-110"
        style={{
          width: layout.checkout.width,
          height: layout.checkout.height,
        }}
      >
        <span className="relative min-h-0 flex-1 w-full drop-shadow-xl">
          <img
            src={contentPack}
            alt=""
            aria-hidden="true"
            className="pointer-events-none h-full w-full object-contain"
          />
        </span>
        <span className="w-full px-1 text-center text-sm font-semibold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          IAC Pack
        </span>
      </button>
    </Rnd>
  );
}

export default CheckoutIcon;
