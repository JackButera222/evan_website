import { Rnd } from "react-rnd";
import quicktimeGif from "../../assets/quicktime-video.gif";

function QuickTimeWindow({
  layout,
  isMobile,
  getDefaultPosition,
  viewportSize,
}) {
  return (
    <Rnd
      key={isMobile ? "mobile-quicktime" : "desktop-quicktime"}
      default={getDefaultPosition(layout.quicktime, viewportSize)}
      bounds=".desktop-drag-bounds"
      enableResizing={false}
      dragHandleClassName="quicktime-drag-handle"
    >
      <div
        className="quicktime-drag-handle h-full w-full cursor-grab active:cursor-grabbing"
        style={{
          width: layout.quicktime.width,
          height: layout.quicktime.height,
        }}
      >
        <img
          src={quicktimeGif}
          alt="QuickTime video"
          className="block w-full h-full object-contain pointer-events-none"
        />
      </div>
    </Rnd>
  );
}

export default QuickTimeWindow;
