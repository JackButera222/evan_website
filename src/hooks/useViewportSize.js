import { useEffect, useState } from "react";

export function useViewportSize() {
  const getViewportSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [viewportSize, setViewportSize] = useState(getViewportSize);

  useEffect(() => {
    const updateViewportSize = () => setViewportSize(getViewportSize());

    window.addEventListener("resize", updateViewportSize);

    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  return viewportSize;
}
