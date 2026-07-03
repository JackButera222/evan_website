import { Rnd } from "react-rnd";
import quicktimeGif from "../../assets/quicktime-video.gif";

function QuickTimeWindow({ placement, viewport }) {
  const { x, y, width, height } = placement;

  return (
    <Rnd
      key={`${viewport.width}x${viewport.height}`}
      default={{ x, y, width, height }}
      bounds=".desktop-drag-bounds"
      enableResizing={false}
      dragHandleClassName="quicktime-drag-handle"
    >
      <div className="quicktime-drag-handle h-full w-full touch-none cursor-grab overflow-hidden rounded-[3%] active:cursor-grabbing">
        <img
          src={quicktimeGif}
          alt="QuickTime video"
          className="block h-full w-full object-cover pointer-events-none"
        />
      </div>
    </Rnd>
  );
}

export default QuickTimeWindow;
