import { useState } from "react";
import { Rnd } from "react-rnd";
import quicktimeGif from "../../assets/quicktime-video.gif";

function QuickTimeWindow({ placement, viewport }) {
  const { x, y, width, height } = placement;
  const [pos, setPos] = useState({ x, y });

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
      dragHandleClassName="quicktime-drag-handle"
      onDragStop={(_event, data) => setPos({ x: data.x, y: data.y })}
    >
      <div className="quicktime-drag-handle h-full w-full cursor-grab active:cursor-grabbing">
        <img
          src={quicktimeGif}
          alt="QuickTime video"
          className="block h-full w-full object-contain pointer-events-none"
        />
      </div>
    </Rnd>
  );
}

export default QuickTimeWindow;
