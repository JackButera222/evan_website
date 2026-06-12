import { useCallback, useState } from "react";

const BASE_Z = 100;

/**
 * Central window state: which windows are open/minimized and their
 * stacking order. The last id in `order` is the focused window.
 */
export function useWindowManager(initiallyOpen = []) {
  const [state, setState] = useState(() => ({
    open: new Set(initiallyOpen),
    minimized: new Set(),
    order: [...initiallyOpen],
  }));

  const openWindow = useCallback((id) => {
    setState((prev) => {
      const open = new Set(prev.open);
      const minimized = new Set(prev.minimized);
      open.add(id);
      minimized.delete(id);
      const order = [...prev.order.filter((w) => w !== id), id];
      return { open, minimized, order };
    });
  }, []);

  const closeWindow = useCallback((id) => {
    setState((prev) => {
      const open = new Set(prev.open);
      const minimized = new Set(prev.minimized);
      open.delete(id);
      minimized.delete(id);
      return { open, minimized, order: prev.order.filter((w) => w !== id) };
    });
  }, []);

  const focusWindow = useCallback((id) => {
    setState((prev) => {
      if (!prev.open.has(id) || prev.order[prev.order.length - 1] === id) {
        return prev;
      }
      return {
        ...prev,
        order: [...prev.order.filter((w) => w !== id), id],
      };
    });
  }, []);

  const minimizeWindow = useCallback((id) => {
    setState((prev) => {
      const minimized = new Set(prev.minimized);
      minimized.add(id);
      return {
        ...prev,
        minimized,
        order: prev.order.filter((w) => w !== id),
      };
    });
  }, []);

  const isOpen = useCallback((id) => state.open.has(id), [state]);
  const isMinimized = useCallback((id) => state.minimized.has(id), [state]);
  const isFocused = useCallback(
    (id) => state.order[state.order.length - 1] === id,
    [state],
  );
  const zIndexFor = useCallback(
    (id) => {
      const index = state.order.indexOf(id);
      return index === -1 ? BASE_Z : BASE_Z + index;
    },
    [state],
  );

  return {
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    isOpen,
    isMinimized,
    isFocused,
    zIndexFor,
  };
}
